import { createLogicalPixelGrid, type LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import type { Palette } from '../palettes/palette';
import type { ColorProcessingSettings } from './color-processing-settings';
import { createProcessedLogicalGrid } from './processed-logical-grid';
import { resolveColorProcessing } from './resolve-color-processing';

export interface BuildProcessedGridResult {
  processedGrid: ReturnType<typeof createProcessedLogicalGrid>;
  renderLogicalGrid: LogicalPixelGrid;
}

export function buildProcessedGrid(
  logicalGrid: LogicalPixelGrid,
  palette: Palette,
  settings: ColorProcessingSettings,
): BuildProcessedGridResult {
  const processedPixels = resolveColorProcessing(logicalGrid, palette, settings);

  const processedGrid = createProcessedLogicalGrid({
    width: logicalGrid.gridWidth,
    height: logicalGrid.gridHeight,
    sourceGridFingerprint: logicalGrid.fingerprint,
    processedPixels,
    modeUsed: settings.mode,
    ditheringApplied: settings.ditheringEnabled,
    preservesTransparency: logicalGrid.preservesTransparency,
    palette,
  });

  const renderLogicalGrid = createLogicalPixelGrid({
    gridWidth: logicalGrid.gridWidth,
    gridHeight: logicalGrid.gridHeight,
    sampledPixels: processedGrid.processedPixels,
    derivedFromSourceImageId: logicalGrid.derivedFromSourceImageId,
    derivedFromSettingValue: logicalGrid.derivedFromSettingValue,
    preservesTransparency: logicalGrid.preservesTransparency,
  });

  return {
    processedGrid,
    renderLogicalGrid,
  };
}
