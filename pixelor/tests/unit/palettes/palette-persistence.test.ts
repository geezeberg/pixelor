import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPaletteStorage } from '../../../src/shared/utils/palette-storage';
import { createPaletteLibrary, upsertCustomPalette } from '../../../src/domain/palettes/palette-library';
import { createCustomPalette } from '../../../src/domain/palettes/create-custom-palette';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('indexedDB', undefined);
});

describe('palette persistence', () => {
  it('persists custom palettes with local fallback storage', async () => {
    const storage = createPaletteStorage();
    const palette = createCustomPalette({
      paletteId: 'saved-1',
      name: 'Saved',
      colors: ['#000000', '#FFFFFF'],
    });
    const library = upsertCustomPalette(createPaletteLibrary(), palette);

    await storage.save(library);
    const restored = await storage.load();

    expect(restored.palettes).toHaveLength(1);
    expect(restored.palettes[0].paletteId).toBe('saved-1');
  });
});
