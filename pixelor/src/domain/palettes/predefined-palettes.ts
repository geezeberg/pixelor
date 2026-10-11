import { createPalette } from './palette';
import { createPaletteColorEntry } from './palette-color-entry';

function buildPalette(paletteId: string, name: string, hexes: string[]) {
  return createPalette({
    paletteId,
    name,
    sourceType: 'predefined',
    isEditable: false,
    colors: hexes.map((hex, index) =>
      createPaletteColorEntry({
        entryId: `${paletteId}-${index}`,
        hex,
        index,
      }),
    ),
  });
}

export const PREDEFINED_PALETTES = [
  buildPalette('predefined-mono', 'Monochrome', ['#111111', '#777777', '#DDDDDD', '#FFFFFF']),
  buildPalette('predefined-retro', 'Retro Arcade', ['#0F380F', '#306230', '#8BAC0F', '#9BBC0F']),
  buildPalette('predefined-limited', 'Limited Color', ['#1B1B3A', '#693668', '#A74482', '#F84AA7', '#FF3562', '#FF6037']),
];
