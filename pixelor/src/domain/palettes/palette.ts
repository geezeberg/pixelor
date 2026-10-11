import { WorkspaceError } from '../../shared/types/errors';
import { PALETTE_LIMITS } from '../../shared/utils/palette-constants';
import type { PaletteColorEntry } from './palette-color-entry';

export type PaletteSourceType = 'automatic' | 'predefined' | 'custom';

export interface Palette {
  paletteId: string;
  name: string;
  sourceType: PaletteSourceType;
  colors: readonly PaletteColorEntry[];
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePaletteInput {
  paletteId: string;
  name: string;
  sourceType: PaletteSourceType;
  colors: readonly PaletteColorEntry[];
  isEditable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function validatePaletteName(name: string) {
  if (!name.trim()) {
    throw new WorkspaceError('invalid-palette-file', 'Palette name must not be empty.');
  }
}

function validateColorBounds(colors: readonly PaletteColorEntry[]) {
  if (colors.length < PALETTE_LIMITS.minColors || colors.length > PALETTE_LIMITS.maxColors) {
    throw new WorkspaceError('invalid-palette-file', 'Palette must contain between 2 and 256 colors.', {
      minColors: PALETTE_LIMITS.minColors,
      maxColors: PALETTE_LIMITS.maxColors,
      actualColors: colors.length,
    });
  }
}

export function createPalette(input: CreatePaletteInput): Palette {
  validatePaletteName(input.name);
  validateColorBounds(input.colors);

  const now = new Date().toISOString();
  const palette: Palette = {
    paletteId: input.paletteId,
    name: input.name.trim(),
    sourceType: input.sourceType,
    colors: [...input.colors],
    isEditable: input.isEditable ?? input.sourceType !== 'predefined',
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };

  if (palette.sourceType === 'predefined' && palette.isEditable) {
    throw new WorkspaceError('invalid-palette-file', 'Predefined palettes must be immutable.');
  }

  return palette;
}
