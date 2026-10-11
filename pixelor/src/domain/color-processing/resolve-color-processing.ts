import type { LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import type { Palette } from '../palettes/palette';
import type { ColorProcessingSettings } from './color-processing-settings';
import { applyOrderedDithering } from './apply-ordered-dithering';
import { applySoftGrading } from './apply-soft-grading';
import { applyStrictPalette } from './apply-strict-palette';

export function resolveColorProcessing(
  logicalGrid: LogicalPixelGrid,
  palette: Palette,
  settings: ColorProcessingSettings,
): Uint8ClampedArray {
  const isSoftMode = settings.mode === 'soft';
  const modeResolved = isSoftMode
    ? applySoftGrading(logicalGrid, palette, settings.softStrength)
    : applyStrictPalette(logicalGrid, palette);

  if (!settings.ditheringEnabled) {
    return modeResolved;
  }

  return applyOrderedDithering(modeResolved, logicalGrid.gridWidth, logicalGrid.gridHeight, palette, {
    quantizeToPalette: !isSoftMode,
    strength: isSoftMode ? settings.softStrength : 1,
  });
}
