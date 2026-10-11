import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { importSourceImage } from '../../domain/source-image/import-source-image';
import { generateLogicalPixelGrid } from '../../domain/logical-grid/generate-logical-grid';
import { createCanvasRenderPreview, drawRenderPreviewToCanvas } from '../../domain/rendering/render-preview-canvas';
import { exportRenderedPng } from '../../domain/export/export-rendered-png';
import { createInitialWorkspaceState } from '../../features/image-workspace/state/workspace-session';
import type { WorkspaceState } from '../../shared/types/image-workspace';
import type { ImageWorkspaceServices } from '../../domain/pipeline/contracts';
import { importImageAction } from '../../features/image-workspace/actions/import-image';
import { updatePixelationAction } from '../../features/image-workspace/actions/update-pixelation';
import { exportPreviewAction } from '../../features/image-workspace/actions/export-preview';
import { replaceImageAction } from '../../features/image-workspace/actions/replace-image';
import { WorkspaceError } from '../../shared/types/errors';
import { generatePaletteAction } from '../../features/image-workspace/actions/generate-palette';
import { selectPaletteAction } from '../../features/image-workspace/actions/select-palette';
import {
  addActivePaletteColorAction,
  duplicatePaletteAction,
  reapplySelectedPaletteAction,
  removeActivePaletteColorAction,
  renameActivePaletteAction,
  updateActivePaletteColorAction,
} from '../../features/image-workspace/actions/edit-palette';
import { updateColorProcessingAction } from '../../features/image-workspace/actions/update-color-processing';
import {
  deleteActivePaletteAction,
  exportActivePaletteAction,
  importPaletteAction,
  loadPersistedPalettesAction,
  saveActivePaletteAction,
} from '../../features/image-workspace/actions/persist-palette';

const defaultServices: ImageWorkspaceServices = {
  importSourceImage,
  generateLogicalPixelGrid,
  createRenderPreview: createCanvasRenderPreview,
  drawRenderPreview: drawRenderPreviewToCanvas,
  exportRenderedPreview: exportRenderedPng,
};

export interface WorkspaceContextValue {
  state: WorkspaceState;
  setState: Dispatch<SetStateAction<WorkspaceState>>;
  services: ImageWorkspaceServices;
  isOffline: boolean;
  importFile: (file: File) => Promise<void>;
  replaceFile: (file: File) => Promise<void>;
  updatePixelation: (value: number) => void;
  generatePalette: (targetSize: number) => void;
  selectPalette: (paletteId: string) => void;
  duplicatePalette: (paletteId: string) => void;
  renameActivePalette: (name: string) => void;
  updateActivePaletteColor: (index: number, hex: string) => void;
  addActivePaletteColor: (hex: string) => void;
  removeActivePaletteColor: (index: number) => void;
  updateColorProcessing: (input: { mode?: 'strict' | 'soft'; softStrength?: number; ditheringEnabled?: boolean }) => void;
  saveActivePalette: () => Promise<void>;
  saveActivePaletteAsCustom: () => Promise<void>;
  deleteActivePalette: () => Promise<void>;
  exportActivePalette: () => void;
  importPaletteFile: (file: File) => Promise<void>;
  exportPreview: () => Promise<void>;
  dismissError: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps extends PropsWithChildren {
  services?: Partial<ImageWorkspaceServices>;
}

export function WorkspaceProvider({ children, services }: WorkspaceProviderProps) {
  const [state, setState] = useState<WorkspaceState>(() => createInitialWorkspaceState());
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);
  const stateRef = useRef(state);
  const resolvedServices: ImageWorkspaceServices = {
    ...defaultServices,
    ...services,
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const loadedState = await loadPersistedPalettesAction(stateRef.current);
        if (!cancelled) {
          setState((previous) => ({
            ...previous,
            paletteWorkspace: loadedState.paletteWorkspace,
          }));
        }
      } catch {
        // Non-fatal: user can still work without persisted palettes.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function importFile(file: File) {
    setState((previous) => ({ ...previous, lastError: null, phase: 'loading' }));

    try {
      const result = await importImageAction({
        file,
        previousState: stateRef.current,
        services: resolvedServices,
      });

      const baseState: WorkspaceState = {
        ...stateRef.current,
        activeSourceImage: result.sourceImage,
        activeLogicalGrid: result.logicalGrid,
        activeProcessedLogicalGrid: null,
        activeRenderPreview: result.renderPreview,
        lastExportedOutput: null,
        lastError: null,
      };
      const resolvedState = reapplySelectedPaletteAction(baseState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeSourceImage: resolvedState.activeSourceImage,
        activeLogicalGrid: resolvedState.activeLogicalGrid,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        lastExportedOutput: resolvedState.lastExportedOutput,
        lastError: null,
        paletteWorkspace: resolvedState.paletteWorkspace,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('unknown', 'Unable to import image.');
      setState((previous) => ({
        ...previous,
        lastError: workspaceError,
        phase: 'error',
      }));
    }
  }

  async function replaceFile(file: File) {
    setState((previous) => ({ ...previous, lastError: null, phase: 'loading' }));

    try {
      const result = await replaceImageAction({
        file,
        previousState: stateRef.current,
        services: resolvedServices,
      });

      const baseState: WorkspaceState = {
        ...stateRef.current,
        activeSourceImage: result.sourceImage,
        activeLogicalGrid: result.logicalGrid,
        activeProcessedLogicalGrid: null,
        activeRenderPreview: result.renderPreview,
        lastExportedOutput: null,
        lastError: null,
      };
      const resolvedState = reapplySelectedPaletteAction(baseState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeSourceImage: resolvedState.activeSourceImage,
        activeLogicalGrid: resolvedState.activeLogicalGrid,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        lastExportedOutput: resolvedState.lastExportedOutput,
        lastError: null,
        paletteWorkspace: resolvedState.paletteWorkspace,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('unknown', 'Unable to replace image.');
      setState((previous) => ({
        ...previous,
        lastError: workspaceError,
        phase: 'error',
      }));
    }
  }

  function updatePixelation(value: number) {
    setState((previous) => ({ ...previous, lastError: null, phase: 'updating' }));

    try {
      const result = updatePixelationAction({
        value,
        state: stateRef.current,
        services: resolvedServices,
      });

      const nextState: WorkspaceState = {
        ...stateRef.current,
        activePixelationSetting: {
          ...stateRef.current.activePixelationSetting,
          settingValue: value,
        },
        activeLogicalGrid: result.logicalGrid,
        activeProcessedLogicalGrid: null,
        activeRenderPreview: result.renderPreview,
      };

      const selectedPaletteId = stateRef.current.paletteWorkspace.activePaletteId;
      const resolvedState = selectedPaletteId
        ? selectPaletteAction({
            state: nextState,
            services: resolvedServices,
            paletteId: selectedPaletteId,
          })
        : nextState;

      setState((previous) => ({
        ...previous,
        activePixelationSetting: resolvedState.activePixelationSetting,
        activeLogicalGrid: resolvedState.activeLogicalGrid,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('render-failed', 'Unable to update preview.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function generatePalette(targetSize: number) {
    try {
      const generatedState = generatePaletteAction({
        state: stateRef.current,
        targetSize,
      });
      const resolvedState = reapplySelectedPaletteAction(generatedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('palette-generation-failed', 'Unable to generate palette.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function selectPalette(paletteId: string) {
    try {
      const nextState = selectPaletteAction({
        state: stateRef.current,
        services: resolvedServices,
        paletteId,
      });

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: nextState.activeProcessedLogicalGrid,
        activeRenderPreview: nextState.activeRenderPreview,
        paletteWorkspace: nextState.paletteWorkspace,
        lastError: null,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('render-failed', 'Unable to apply palette selection.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function duplicatePalette(paletteId: string) {
    try {
      const duplicatedState = duplicatePaletteAction(stateRef.current, paletteId);
      const resolvedState = reapplySelectedPaletteAction(duplicatedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('invalid-palette-file', 'Unable to duplicate palette.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function renameActivePalette(name: string) {
    try {
      const renamedState = renameActivePaletteAction(stateRef.current, name);
      const resolvedState = reapplySelectedPaletteAction(renamedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('invalid-palette-file', 'Unable to rename palette.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function updateActivePaletteColor(index: number, hex: string) {
    try {
      const editedState = updateActivePaletteColorAction(stateRef.current, index, hex);
      const resolvedState = reapplySelectedPaletteAction(editedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('invalid-palette-file', 'Unable to update palette color.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function addActivePaletteColor(hex: string) {
    try {
      const editedState = addActivePaletteColorAction(stateRef.current, hex);
      const resolvedState = reapplySelectedPaletteAction(editedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('invalid-palette-file', 'Unable to add palette color.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function removeActivePaletteColor(index: number) {
    try {
      const editedState = removeActivePaletteColorAction(stateRef.current, index);
      const resolvedState = reapplySelectedPaletteAction(editedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('invalid-palette-file', 'Unable to remove palette color.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function updateColorProcessing(input: { mode?: 'strict' | 'soft'; softStrength?: number; ditheringEnabled?: boolean }) {
    try {
      const updatedState = updateColorProcessingAction({
        state: stateRef.current,
        mode: input.mode,
        softStrength: input.softStrength,
        ditheringEnabled: input.ditheringEnabled,
      });
      const resolvedState = reapplySelectedPaletteAction(updatedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('render-failed', 'Unable to update color processing settings.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  async function saveActivePalette() {
    try {
      await saveActivePaletteAction(stateRef.current);
      setState((previous) => ({ ...previous, lastError: null }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('palette-persistence-failed', 'Unable to save active custom palette.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  async function saveActivePaletteAsCustom() {
    try {
      const activePaletteId = stateRef.current.paletteWorkspace.activePaletteId;
      if (!activePaletteId) {
        throw new WorkspaceError('palette-persistence-failed', 'No active palette selected to save.');
      }

      const activePalette = stateRef.current.paletteWorkspace.palettesById[activePaletteId];
      if (!activePalette) {
        throw new WorkspaceError('palette-persistence-failed', 'Active palette could not be found.');
      }

      if (activePalette.sourceType === 'custom') {
        await saveActivePaletteAction(stateRef.current);
        setState((previous) => ({ ...previous, lastError: null }));
        return;
      }

      const duplicatedState = duplicatePaletteAction(stateRef.current, activePaletteId);
      const resolvedState = reapplySelectedPaletteAction(duplicatedState, resolvedServices);

      await saveActivePaletteAction(resolvedState);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('palette-persistence-failed', 'Unable to save palette as custom.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  async function deleteActivePalette() {
    try {
      const nextState = await deleteActivePaletteAction(stateRef.current);
      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: nextState.activeProcessedLogicalGrid,
        paletteWorkspace: nextState.paletteWorkspace,
        lastError: null,
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('palette-persistence-failed', 'Unable to delete active custom palette.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function exportActivePalette() {
    try {
      const serialized = exportActivePaletteAction(stateRef.current);
      const blob = new Blob([serialized], { type: 'application/json' });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileBaseName = stateRef.current.paletteWorkspace.activePaletteId ?? 'pixelor-palette';

      link.href = objectUrl;
      link.download = `${fileBaseName}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('invalid-palette-file', 'Unable to export active palette.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  async function importPaletteFile(file: File) {
    try {
      const content = await file.text();
      const importedState = importPaletteAction(stateRef.current, content);
      const resolvedState = reapplySelectedPaletteAction(importedState, resolvedServices);

      setState((previous) => ({
        ...previous,
        activeProcessedLogicalGrid: resolvedState.activeProcessedLogicalGrid,
        activeRenderPreview: resolvedState.activeRenderPreview,
        paletteWorkspace: resolvedState.paletteWorkspace,
        lastError: null,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('invalid-palette-file', 'Unable to import palette file.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  async function exportPreview() {
    setState((previous) => ({ ...previous, lastError: null, phase: 'exporting' }));

    try {
      const exportedOutput = await exportPreviewAction({
        state: stateRef.current,
        services: resolvedServices,
      });

      setState((previous) => ({
        ...previous,
        lastExportedOutput: exportedOutput,
        lastError: null,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('export-failed', 'Unable to export preview.');
      setState((previous) => ({ ...previous, lastError: workspaceError, phase: 'error' }));
    }
  }

  function dismissError() {
    setState((previous) => ({
      ...previous,
      lastError: null,
      phase: previous.activeSourceImage ? 'ready' : 'idle',
    }));
  }

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        setState,
        services: resolvedServices,
        isOffline,
        importFile,
        replaceFile,
        updatePixelation,
        generatePalette,
        selectPalette,
        duplicatePalette,
        renameActivePalette,
        updateActivePaletteColor,
        addActivePaletteColor,
        removeActivePaletteColor,
        updateColorProcessing,
        saveActivePalette,
        saveActivePaletteAsCustom,
        deleteActivePalette,
        exportActivePalette,
        importPaletteFile,
        exportPreview,
        dismissError,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider.');
  }

  return context;
}
