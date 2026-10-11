import { createColorProcessingSettings } from '../../../domain/color-processing/color-processing-settings';
import type { PaletteWorkspaceState } from '../../../shared/types/palette-workspace';
import { PREDEFINED_PALETTES } from '../../../domain/palettes/predefined-palettes';

export function createInitialPaletteWorkspaceState(): PaletteWorkspaceState {
  const palettesById = Object.fromEntries(PREDEFINED_PALETTES.map((palette) => [palette.paletteId, palette]));

  return {
    activePaletteId: null,
    activePaletteSource: 'automatic',
    palettesById,
    orderedPaletteIds: PREDEFINED_PALETTES.map((palette) => palette.paletteId),
    processing: createColorProcessingSettings(),
    processedGrid: null,
  };
}

export function getActivePaletteId(state: PaletteWorkspaceState): string | null {
  return state.activePaletteId;
}

export function hasSelectedPalette(state: PaletteWorkspaceState): boolean {
  return Boolean(state.activePaletteId && state.palettesById[state.activePaletteId]);
}

export function listPalettesInOrder(state: PaletteWorkspaceState) {
  return state.orderedPaletteIds
    .map((paletteId) => state.palettesById[paletteId])
    .filter((palette): palette is NonNullable<typeof palette> => Boolean(palette));
}
