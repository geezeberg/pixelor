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

  async function importFile(file: File) {
    setState((previous) => ({ ...previous, lastError: null, phase: 'loading' }));

    try {
      const result = await importImageAction({
        file,
        previousState: stateRef.current,
        services: resolvedServices,
      });

      setState((previous) => ({
        ...previous,
        activeSourceImage: result.sourceImage,
        activeLogicalGrid: result.logicalGrid,
        activeRenderPreview: result.renderPreview,
        lastExportedOutput: null,
        lastError: null,
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

      setState((previous) => ({
        ...previous,
        activeSourceImage: result.sourceImage,
        activeLogicalGrid: result.logicalGrid,
        activeRenderPreview: result.renderPreview,
        lastExportedOutput: null,
        lastError: null,
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

      setState((previous) => ({
        ...previous,
        activePixelationSetting: {
          ...previous.activePixelationSetting,
          settingValue: value,
        },
        activeLogicalGrid: result.logicalGrid,
        activeRenderPreview: result.renderPreview,
        lastError: null,
        phase: 'ready',
      }));
    } catch (error) {
      const workspaceError = error instanceof WorkspaceError ? error : new WorkspaceError('render-failed', 'Unable to update preview.');
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
