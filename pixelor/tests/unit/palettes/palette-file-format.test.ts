import { describe, expect, it } from 'vitest';
import { importPaletteFromFile, exportPaletteToArtifact, serializePaletteArtifact } from '../../../src/shared/utils/palette-file';
import { createCustomPalette } from '../../../src/domain/palettes/create-custom-palette';

describe('palette file format', () => {
  it('round-trips valid palette data with preserved hex values', () => {
    const source = createCustomPalette({
      paletteId: 'palette-file',
      name: 'Portable',
      colors: ['#112233', '#AABBCC'],
    });

    const artifact = exportPaletteToArtifact(source);
    const serialized = serializePaletteArtifact(artifact);
    const restored = importPaletteFromFile(serialized, 'restored');

    expect(restored.colors.map((entry) => entry.hex)).toEqual(['#112233', '#AABBCC']);
  });

  it('rejects malformed payloads', () => {
    expect(() => importPaletteFromFile('{"formatVersion":1}', 'bad')).toThrow();
  });
});
