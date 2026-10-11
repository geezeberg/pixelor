import { describe, expect, it } from 'vitest';
import { exportRenderedPng } from '../../../src/domain/export/export-rendered-png';
import { generateLogicalPixelGrid } from '../../../src/domain/logical-grid/generate-logical-grid';
import { createPixelationSetting } from '../../../src/domain/logical-grid/pixelation-setting';
import { createCanvasRenderPreview } from '../../../src/domain/rendering/render-preview-canvas';
import { createSourceImage } from '../../../src/domain/source-image/source-image';

function createSource() {
  return createSourceImage({
    sourceImageId: 'export-source',
    fileName: 'export.png',
    displayUrl: 'data:image/png;base64,export',
    mimeType: 'image/png',
    width: 2,
    height: 2,
    pixelData: new ImageData(
      new Uint8ClampedArray([
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255,
        255, 255, 255, 255,
      ]),
      2,
      2,
    ),
  });
}

describe('exportRenderedPng', () => {
  it('exports a PNG blob matching the preview fingerprint', async () => {
    const logicalGrid = generateLogicalPixelGrid(createSource(), createPixelationSetting(1));
    const renderPreview = createCanvasRenderPreview({ logicalGrid, renderScale: 4 });
    const exportedOutput = await exportRenderedPng({ logicalGrid, renderPreview });

    expect(exportedOutput.exportFormat).toBe('image/png');
    expect(exportedOutput.blob.type).toBe('image/png');
    expect(exportedOutput.sourceGridFingerprint).toBe(logicalGrid.fingerprint);
    expect(exportedOutput.matchesPreview).toBe(true);
  });
});
