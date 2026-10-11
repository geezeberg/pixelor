import { WorkspaceError } from '../../shared/types/errors';
import { PALETTE_LIMITS } from '../../shared/utils/palette-constants';
import { createPalette, type Palette } from './palette';
import { createPaletteColorEntry } from './palette-color-entry';

function assertEditable(palette: Palette) {
  if (!palette.isEditable || palette.sourceType !== 'custom') {
    throw new WorkspaceError('invalid-palette-file', 'Only custom palettes can be edited.', {
      paletteId: palette.paletteId,
    });
  }
}

function rebuildPalette(palette: Palette, colors: string[], name = palette.name): Palette {
  return createPalette({
    ...palette,
    name,
    sourceType: 'custom',
    isEditable: true,
    colors: colors.map((hex, index) =>
      createPaletteColorEntry({
        entryId: `${palette.paletteId}-${index}`,
        hex,
        index,
      }),
    ),
  });
}

export function renameCustomPalette(palette: Palette, name: string): Palette {
  assertEditable(palette);
  return rebuildPalette(palette, palette.colors.map((entry) => entry.hex), name);
}

export function updateCustomPaletteColor(palette: Palette, index: number, hex: string): Palette {
  assertEditable(palette);

  const colors = palette.colors.map((entry) => entry.hex);
  if (index < 0 || index >= colors.length) {
    throw new WorkspaceError('invalid-palette-file', 'Palette color index is out of bounds.', { index });
  }

  colors[index] = hex;
  return rebuildPalette(palette, colors);
}

export function addCustomPaletteColor(palette: Palette, hex: string): Palette {
  assertEditable(palette);

  if (palette.colors.length >= PALETTE_LIMITS.maxColors) {
    throw new WorkspaceError('invalid-palette-file', 'Palette already contains the maximum number of colors.');
  }

  return rebuildPalette(palette, [...palette.colors.map((entry) => entry.hex), hex]);
}

export function removeCustomPaletteColor(palette: Palette, index: number): Palette {
  assertEditable(palette);

  if (palette.colors.length <= PALETTE_LIMITS.minColors) {
    throw new WorkspaceError('invalid-palette-file', 'Palette must contain at least two colors.');
  }

  const colors = palette.colors.map((entry) => entry.hex);
  if (index < 0 || index >= colors.length) {
    throw new WorkspaceError('invalid-palette-file', 'Palette color index is out of bounds.', { index });
  }

  colors.splice(index, 1);
  return rebuildPalette(palette, colors);
}
