import { describe, expect, it } from 'vitest';
import { generateLogicalPixelGrid } from '../../../src/domain/logical-grid/generate-logical-grid';
import { createPixelationSetting } from '../../../src/domain/logical-grid/pixelation-setting';
import { createCanvasRenderPreview, drawRenderPreviewToCanvas } from '../../../src/domain/rendering/render-preview-canvas';
import { createSourceImage } from '../../../src/domain/source-image/source-image';

function createTransparentSource() {
  return createSourceImage({
    sourceImageId: 'transparent-source',
    fileName: 'transparent.png',
    displayUrl: 'data:image/png;base64,transparent',
    mimeType: 'image/png',
    width: 2,
    height: 1,
    pixelData: new ImageData(new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 255, 0]), 2, 1),
  });
}

describe('render preview regeneration', () => {
  it('preserves transparency metadata and deterministic fingerprints', () => {
    const logicalGrid = generateLogicalPixelGrid(createTransparentSource(), createPixelationSetting(1));
    const firstPreview = createCanvasRenderPreview({ logicalGrid, renderScale: 8 });
    const secondPreview = createCanvasRenderPreview({ logicalGrid, renderScale: 8 });

    expect(logicalGrid.preservesTransparency).toBe(true);
    expect(firstPreview.fingerprint).toBe(secondPreview.fingerprint);
  });

  it('draws the preview onto a canvas using the resolved render dimensions', () => {
    const logicalGrid = generateLogicalPixelGrid(createTransparentSource(), createPixelationSetting(1));
    const preview = createCanvasRenderPreview({ logicalGrid, renderScale: 6 });
    const canvas = document.createElement('canvas');

    drawRenderPreviewToCanvas({ logicalGrid, renderPreview: preview, canvas });

    expect(canvas.width).toBe(12);
    expect(canvas.height).toBe(6);
  });
});
