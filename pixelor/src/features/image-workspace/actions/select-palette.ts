import type { WorkspaceState } from '../../../shared/types/image-workspace';
import { WorkspaceError } from '../../../shared/types/errors';
import { buildProcessedGrid } from '../../../domain/color-processing/build-processed-grid';
import type { ImageWorkspaceServices } from '../../../domain/pipeline/contracts';

export interface SelectPaletteActionInput {
  state: WorkspaceState;
  services: ImageWorkspaceServices;
  paletteId: string;
}

export function selectPaletteAction({ state, services, paletteId }: SelectPaletteActionInput): WorkspaceState {
  if (!state.activeLogicalGrid) {
    throw new WorkspaceError('render-failed', 'Load an image before selecting a palette.');
  }

  const selected = state.paletteWorkspace.palettesById[paletteId];

  if (!selected) {
    throw new WorkspaceError('invalid-palette-file', 'Selected palette does not exist.', { paletteId });
  }

  const nextSettings = {
    ...state.paletteWorkspace.processing,
    mode: 'strict' as const,
    selectedPaletteId: paletteId,
  };

  const result = buildProcessedGrid(state.activeLogicalGrid, selected, nextSettings);
  const renderPreview = services.createRenderPreview({
    logicalGrid: result.renderLogicalGrid,
    renderScale: state.activeRenderPreview?.renderScale,
  });

  return {
    ...state,
    activeProcessedLogicalGrid: result.renderLogicalGrid,
    activeRenderPreview: renderPreview,
    paletteWorkspace: {
      ...state.paletteWorkspace,
      activePaletteId: paletteId,
      processing: nextSettings,
      processedGrid: result.processedGrid,
    },
  };
}
