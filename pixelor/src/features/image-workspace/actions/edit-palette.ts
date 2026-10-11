import type { WorkspaceState } from '../../../shared/types/image-workspace';
import { WorkspaceError } from '../../../shared/types/errors';
import type { ImageWorkspaceServices } from '../../../domain/pipeline/contracts';
import { duplicatePaletteAsCustom } from '../../../domain/palettes/create-custom-palette';
import {
  addCustomPaletteColor,
  removeCustomPaletteColor,
  renameCustomPalette,
  updateCustomPaletteColor,
} from '../../../domain/palettes/edit-custom-palette';
import { selectPaletteAction } from './select-palette';

function upsertPalette(state: WorkspaceState, paletteId: string, nextPalette: WorkspaceState['paletteWorkspace']['palettesById'][string]) {
  const exists = state.paletteWorkspace.orderedPaletteIds.includes(paletteId);

  return {
    ...state,
    paletteWorkspace: {
      ...state.paletteWorkspace,
      palettesById: {
        ...state.paletteWorkspace.palettesById,
        [paletteId]: nextPalette,
      },
      orderedPaletteIds: exists ? state.paletteWorkspace.orderedPaletteIds : [...state.paletteWorkspace.orderedPaletteIds, paletteId],
    },
  };
}

export function duplicatePaletteAction(state: WorkspaceState, paletteId: string): WorkspaceState {
  const source = state.paletteWorkspace.palettesById[paletteId];
  if (!source) {
    throw new WorkspaceError('invalid-palette-file', 'Palette to duplicate was not found.', { paletteId });
  }

  const nextId = `custom-${Date.now()}`;
  const duplicated = duplicatePaletteAsCustom(source, nextId);

  return {
    ...upsertPalette(state, nextId, duplicated),
    paletteWorkspace: {
      ...upsertPalette(state, nextId, duplicated).paletteWorkspace,
      activePaletteId: nextId,
      activePaletteSource: 'custom',
      processing: {
        ...state.paletteWorkspace.processing,
        selectedPaletteId: nextId,
      },
    },
  };
}

function updateActiveCustomPalette(
  state: WorkspaceState,
  updater: (active: NonNullable<WorkspaceState['paletteWorkspace']['activePaletteId']>) => WorkspaceState,
) {
  const activePaletteId = state.paletteWorkspace.activePaletteId;

  if (!activePaletteId) {
    throw new WorkspaceError('invalid-palette-file', 'No active palette selected.');
  }

  return updater(activePaletteId);
}

export function renameActivePaletteAction(state: WorkspaceState, name: string): WorkspaceState {
  return updateActiveCustomPalette(state, (activePaletteId) => {
    const active = state.paletteWorkspace.palettesById[activePaletteId];
    const renamed = renameCustomPalette(active, name);
    return upsertPalette(state, activePaletteId, renamed);
  });
}

export function updateActivePaletteColorAction(state: WorkspaceState, index: number, hex: string): WorkspaceState {
  return updateActiveCustomPalette(state, (activePaletteId) => {
    const active = state.paletteWorkspace.palettesById[activePaletteId];
    const edited = updateCustomPaletteColor(active, index, hex);
    return upsertPalette(state, activePaletteId, edited);
  });
}

export function addActivePaletteColorAction(state: WorkspaceState, hex: string): WorkspaceState {
  return updateActiveCustomPalette(state, (activePaletteId) => {
    const active = state.paletteWorkspace.palettesById[activePaletteId];
    const edited = addCustomPaletteColor(active, hex);
    return upsertPalette(state, activePaletteId, edited);
  });
}

export function removeActivePaletteColorAction(state: WorkspaceState, index: number): WorkspaceState {
  return updateActiveCustomPalette(state, (activePaletteId) => {
    const active = state.paletteWorkspace.palettesById[activePaletteId];
    const edited = removeCustomPaletteColor(active, index);
    return upsertPalette(state, activePaletteId, edited);
  });
}

export function reapplySelectedPaletteAction(state: WorkspaceState, services: ImageWorkspaceServices): WorkspaceState {
  const activePaletteId = state.paletteWorkspace.activePaletteId;
  if (!activePaletteId || !state.activeLogicalGrid) {
    return state;
  }

  return selectPaletteAction({
    state,
    services,
    paletteId: activePaletteId,
  });
}
