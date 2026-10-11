import type { WorkspaceState } from '../../../shared/types/image-workspace';
import { WorkspaceError } from '../../../shared/types/errors';
import { DEFAULT_GENERATED_PALETTE_SIZE } from '../../../shared/utils/palette-constants';
import { generatePaletteFromGrid } from '../../../domain/palettes/generate-palette-from-grid';
import { markPaletteGenerationEnd, markPaletteGenerationStart } from '../../../shared/utils/performance-marks';

export interface GeneratePaletteActionInput {
  state: WorkspaceState;
  targetSize?: number;
}

export function generatePaletteAction({ state, targetSize = DEFAULT_GENERATED_PALETTE_SIZE }: GeneratePaletteActionInput): WorkspaceState {
  if (!state.activeLogicalGrid) {
    throw new WorkspaceError('palette-generation-failed', 'Load an image before generating a palette.');
  }

  markPaletteGenerationStart();
  const generatedPalette = generatePaletteFromGrid(state.activeLogicalGrid, targetSize);
  markPaletteGenerationEnd();

  return {
    ...state,
    paletteWorkspace: {
      ...state.paletteWorkspace,
      activePaletteId: generatedPalette.paletteId,
      activePaletteSource: 'automatic',
      palettesById: {
        ...state.paletteWorkspace.palettesById,
        [generatedPalette.paletteId]: generatedPalette,
      },
      orderedPaletteIds: state.paletteWorkspace.orderedPaletteIds.includes(generatedPalette.paletteId)
        ? state.paletteWorkspace.orderedPaletteIds
        : [...state.paletteWorkspace.orderedPaletteIds, generatedPalette.paletteId],
      processing: {
        ...state.paletteWorkspace.processing,
        selectedPaletteId: generatedPalette.paletteId,
      },
      processedGrid: null,
    },
  };
}
