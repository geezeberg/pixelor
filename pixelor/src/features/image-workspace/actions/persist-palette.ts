import type { WorkspaceState } from '../../../shared/types/image-workspace';
import { createPaletteStorage } from '../../../shared/utils/palette-storage';
import { createPaletteLibrary, deleteCustomPalette, upsertCustomPalette } from '../../../domain/palettes/palette-library';
import { importPaletteFromFile, exportPaletteToArtifact, serializePaletteArtifact } from '../../../shared/utils/palette-file';
import { WorkspaceError } from '../../../shared/types/errors';

export async function loadPersistedPalettesAction(state: WorkspaceState): Promise<WorkspaceState> {
  const storage = createPaletteStorage();
  const library = await storage.load();

  const palettesById = { ...state.paletteWorkspace.palettesById };
  const customIds: string[] = [];

  for (const palette of library.palettes) {
    palettesById[palette.paletteId] = palette;
    customIds.push(palette.paletteId);
  }

  const predefinedIds = state.paletteWorkspace.orderedPaletteIds.filter((paletteId) => paletteId.startsWith('predefined-'));

  return {
    ...state,
    paletteWorkspace: {
      ...state.paletteWorkspace,
      palettesById,
      orderedPaletteIds: [...predefinedIds, ...customIds],
    },
  };
}

export async function saveActivePaletteAction(state: WorkspaceState): Promise<WorkspaceState> {
  const activePaletteId = state.paletteWorkspace.activePaletteId;
  if (!activePaletteId) {
    throw new WorkspaceError('palette-persistence-failed', 'No active palette selected to save.');
  }

  const activePalette = state.paletteWorkspace.palettesById[activePaletteId];
  if (!activePalette || activePalette.sourceType !== 'custom') {
    throw new WorkspaceError('palette-persistence-failed', 'Only custom palettes can be saved.');
  }

  const storage = createPaletteStorage();
  const existing = await storage.load();
  const next = upsertCustomPalette(existing, activePalette);
  await storage.save(next);
  return state;
}

export async function deleteActivePaletteAction(state: WorkspaceState): Promise<WorkspaceState> {
  const activePaletteId = state.paletteWorkspace.activePaletteId;
  if (!activePaletteId) {
    throw new WorkspaceError('palette-persistence-failed', 'No active palette selected to delete.');
  }

  const activePalette = state.paletteWorkspace.palettesById[activePaletteId];
  if (!activePalette || activePalette.sourceType !== 'custom') {
    throw new WorkspaceError('palette-persistence-failed', 'Only custom palettes can be deleted.');
  }

  const storage = createPaletteStorage();
  const existing = await storage.load();
  const next = deleteCustomPalette(existing, activePaletteId);
  await storage.save(next);

  const { [activePaletteId]: _removed, ...remaining } = state.paletteWorkspace.palettesById;

  return {
    ...state,
    paletteWorkspace: {
      ...state.paletteWorkspace,
      activePaletteId: null,
      activePaletteSource: 'predefined',
      palettesById: remaining,
      orderedPaletteIds: state.paletteWorkspace.orderedPaletteIds.filter((paletteId) => paletteId !== activePaletteId),
      processing: {
        ...state.paletteWorkspace.processing,
        selectedPaletteId: null,
      },
      processedGrid: null,
    },
    activeProcessedLogicalGrid: null,
  };
}

export function exportActivePaletteAction(state: WorkspaceState): string {
  const activePaletteId = state.paletteWorkspace.activePaletteId;
  if (!activePaletteId) {
    throw new WorkspaceError('invalid-palette-file', 'No active palette selected to export.');
  }

  const palette = state.paletteWorkspace.palettesById[activePaletteId];
  if (!palette) {
    throw new WorkspaceError('invalid-palette-file', 'Active palette could not be found.');
  }

  const artifact = exportPaletteToArtifact(palette);
  return serializePaletteArtifact(artifact);
}

export function importPaletteAction(state: WorkspaceState, content: string): WorkspaceState {
  const paletteId = `imported-${Date.now()}`;
  const imported = importPaletteFromFile(content, paletteId);
  const library = upsertCustomPalette(createPaletteLibrary(), imported);
  void library;

  return {
    ...state,
    paletteWorkspace: {
      ...state.paletteWorkspace,
      activePaletteId: imported.paletteId,
      activePaletteSource: 'custom',
      palettesById: {
        ...state.paletteWorkspace.palettesById,
        [imported.paletteId]: imported,
      },
      orderedPaletteIds: state.paletteWorkspace.orderedPaletteIds.includes(imported.paletteId)
        ? state.paletteWorkspace.orderedPaletteIds
        : [...state.paletteWorkspace.orderedPaletteIds, imported.paletteId],
      processing: {
        ...state.paletteWorkspace.processing,
        selectedPaletteId: imported.paletteId,
      },
    },
  };
}
