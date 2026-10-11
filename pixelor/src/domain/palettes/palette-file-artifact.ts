import { WorkspaceError } from '../../shared/types/errors';
import { PALETTE_LIMITS } from '../../shared/utils/palette-constants';
import { normalizeHexValue } from './palette-color-entry';

export interface PaletteFileArtifact {
  formatVersion: number;
  paletteName: string;
  colors: string[];
  metadata?: Record<string, unknown>;
}

export function parsePaletteFileArtifact(value: unknown): PaletteFileArtifact {
  if (!value || typeof value !== 'object') {
    throw new WorkspaceError('invalid-palette-file', 'Palette file payload must be an object.');
  }

  const candidate = value as Partial<PaletteFileArtifact>;

  if (candidate.formatVersion !== 1) {
    throw new WorkspaceError('invalid-palette-file', 'Unsupported palette file format version.', {
      formatVersion: candidate.formatVersion,
    });
  }

  if (!candidate.paletteName || !candidate.paletteName.trim()) {
    throw new WorkspaceError('invalid-palette-file', 'Palette file name is required.');
  }

  if (!Array.isArray(candidate.colors)) {
    throw new WorkspaceError('invalid-palette-file', 'Palette file colors must be an array.');
  }

  if (candidate.colors.length < PALETTE_LIMITS.minColors || candidate.colors.length > PALETTE_LIMITS.maxColors) {
    throw new WorkspaceError('invalid-palette-file', 'Palette file color count is out of bounds.', {
      count: candidate.colors.length,
    });
  }

  return {
    formatVersion: 1,
    paletteName: candidate.paletteName.trim(),
    colors: candidate.colors.map((color) => normalizeHexValue(String(color))),
    metadata: candidate.metadata,
  };
}
