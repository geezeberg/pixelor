import { WorkspaceError } from '../../shared/types/errors';
import { PALETTE_LIMITS } from '../../shared/utils/palette-constants';
import type { Palette } from './palette';

export type PredefinedPaletteGroup = 'monochrome' | 'retro' | 'limited-color';

export interface PredefinedPaletteCatalog {
  catalogId: string;
  palettes: readonly Palette[];
  groups: readonly PredefinedPaletteGroup[];
}

export function createPredefinedPaletteCatalog(input: {
  catalogId: string;
  palettes: readonly Palette[];
  groups?: readonly PredefinedPaletteGroup[];
}): PredefinedPaletteCatalog {
  for (const palette of input.palettes) {
    if (palette.sourceType !== 'predefined' || palette.isEditable) {
      throw new WorkspaceError('invalid-palette-file', 'Predefined catalog contains a mutable or non-predefined palette.', {
        paletteId: palette.paletteId,
      });
    }

    if (palette.colors.length < PALETTE_LIMITS.minColors || palette.colors.length > PALETTE_LIMITS.maxColors) {
      throw new WorkspaceError('invalid-palette-file', 'Predefined palette color count is out of bounds.', {
        paletteId: palette.paletteId,
        count: palette.colors.length,
      });
    }
  }

  return {
    catalogId: input.catalogId,
    palettes: [...input.palettes],
    groups: input.groups ? [...input.groups] : [],
  };
}
