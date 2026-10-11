import { WorkspaceError } from '../types/errors';
import { createPalette } from '../../domain/palettes/palette';
import { createPaletteColorEntry } from '../../domain/palettes/palette-color-entry';
import { parsePaletteFileArtifact, type PaletteFileArtifact } from '../../domain/palettes/palette-file-artifact';
import type { Palette } from '../../domain/palettes/palette';

export function parsePaletteFileContent(content: string): PaletteFileArtifact {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new WorkspaceError('invalid-palette-file', 'Palette file is not valid JSON.');
  }

  return parsePaletteFileArtifact(parsed);
}

export function importPaletteFromFile(content: string, paletteId: string): Palette {
  const artifact = parsePaletteFileContent(content);

  const colors = artifact.colors.map((hex, index) =>
    createPaletteColorEntry({
      entryId: `${paletteId}-${index}`,
      hex,
      index,
    }),
  );

  return createPalette({
    paletteId,
    name: artifact.paletteName,
    sourceType: 'custom',
    colors,
    isEditable: true,
  });
}

export function exportPaletteToArtifact(palette: Palette): PaletteFileArtifact {
  return {
    formatVersion: 1,
    paletteName: palette.name,
    colors: palette.colors.map((entry) => entry.hex),
    metadata: {
      sourceType: palette.sourceType,
      exportedAt: new Date().toISOString(),
    },
  };
}

export function serializePaletteArtifact(artifact: PaletteFileArtifact): string {
  return JSON.stringify(artifact, null, 2);
}
