import { createPalette, type Palette } from './palette';
import { createPaletteColorEntry } from './palette-color-entry';

export function createCustomPalette(input: { paletteId: string; name: string; colors: string[] }): Palette {
  return createPalette({
    paletteId: input.paletteId,
    name: input.name,
    sourceType: 'custom',
    isEditable: true,
    colors: input.colors.map((hex, index) =>
      createPaletteColorEntry({
        entryId: `${input.paletteId}-${index}`,
        hex,
        index,
      }),
    ),
  });
}

export function duplicatePaletteAsCustom(source: Palette, newPaletteId: string): Palette {
  return createPalette({
    paletteId: newPaletteId,
    name: `${source.name} Copy`,
    sourceType: 'custom',
    isEditable: true,
    colors: source.colors.map((entry, index) =>
      createPaletteColorEntry({
        entryId: `${newPaletteId}-${index}`,
        hex: entry.hex,
        index,
      }),
    ),
  });
}
