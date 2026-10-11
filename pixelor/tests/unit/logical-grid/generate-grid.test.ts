import { describe, expect, it } from 'vitest';
import { generateLogicalPixelGrid } from '../../../src/domain/logical-grid/generate-logical-grid';
import { createPixelationSetting } from '../../../src/domain/logical-grid/pixelation-setting';
import { createSourceImage } from '../../../src/domain/source-image/source-image';

function createSource() {
  return createSourceImage({
    sourceImageId: 'source-grid',
    fileName: 'grid.png',
    displayUrl: 'data:image/png;base64,grid',
    mimeType: 'image/png',
    width: 4,
    height: 2,
    pixelData: new ImageData(
      new Uint8ClampedArray([
        255, 0, 0, 255,
        255, 0, 0, 255,
        0, 0, 255, 255,
        0, 0, 255, 255,
        255, 255, 0, 255,
        255, 255, 0, 255,
        0, 255, 0, 255,
        0, 255, 0, 255,
      ]),
      4,
      2,
    ),
  });
}

describe('generateLogicalPixelGrid', () => {
  it('preserves aspect ratio while reducing the grid size', () => {
    const grid = generateLogicalPixelGrid(createSource(), createPixelationSetting(2));

    expect(grid.gridWidth).toBe(2);
    expect(grid.gridHeight).toBe(1);
  });

  it('produces deterministic output for the same source and settings', () => {
    const sourceImage = createSource();
    const setting = createPixelationSetting(2);
    const firstGrid = generateLogicalPixelGrid(sourceImage, setting);
    const secondGrid = generateLogicalPixelGrid(sourceImage, setting);

    expect(Array.from(firstGrid.sampledPixels)).toEqual(Array.from(secondGrid.sampledPixels));
    expect(firstGrid.fingerprint).toBe(secondGrid.fingerprint);
  });
});
