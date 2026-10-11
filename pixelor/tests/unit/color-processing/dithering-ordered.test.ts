import { describe, expect, it } from 'vitest';
import { applyOrderedDithering } from '../../../src/domain/color-processing/apply-ordered-dithering';
import { createPalette } from '../../../src/domain/palettes/palette';
import { createPaletteColorEntry } from '../../../src/domain/palettes/palette-color-entry';

const palette = createPalette({
  paletteId: 'palette-dither',
  name: 'Dither test',
  sourceType: 'custom',
  isEditable: true,
  colors: [
    createPaletteColorEntry({ entryId: 'd-0', hex: '#000000', index: 0 }),
    createPaletteColorEntry({ entryId: 'd-1', hex: '#FFFFFF', index: 1 }),
  ],
});

describe('applyOrderedDithering', () => {
  it('is deterministic for identical input', () => {
    const pixels = new Uint8ClampedArray(4 * 4 * 4).fill(128);
    for (let index = 3; index < pixels.length; index += 4) {
      pixels[index] = 255;
    }

    const first = applyOrderedDithering(pixels, 4, 4, palette);
    const second = applyOrderedDithering(pixels, 4, 4, palette);

    expect(Array.from(first)).toEqual(Array.from(second));
    expect(first.length).toBe(pixels.length);
  });

  it('can preserve soft tonal variation when palette quantization is disabled', () => {
    const pixels = new Uint8ClampedArray(4 * 4 * 4).fill(120);
    for (let index = 3; index < pixels.length; index += 4) {
      pixels[index] = 255;
    }

    const dithered = applyOrderedDithering(pixels, 4, 4, palette, {
      quantizeToPalette: false,
      strength: 0.5,
    });

    const channels = Array.from(dithered).filter((_, index) => index % 4 !== 3);
    expect(channels.some((value) => value > 0 && value < 255)).toBe(true);
  });
});
