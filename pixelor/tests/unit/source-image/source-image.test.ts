import { describe, expect, it } from 'vitest';
import { MAX_SOURCE_DIMENSION, createSourceImage } from '../../../src/domain/source-image/source-image';

function createImageDataSample() {
  return new ImageData(
    new Uint8ClampedArray([
      255, 0, 0, 255,
      0, 255, 0, 128,
    ]),
    2,
    1,
  );
}

describe('createSourceImage', () => {
  it('creates an immutable copy of the decoded image data', () => {
    const pixelData = createImageDataSample();
    const sourceImage = createSourceImage({
      sourceImageId: 'source-1',
      fileName: 'sample.png',
      displayUrl: 'data:image/png;base64,sample',
      mimeType: 'image/png',
      width: 2,
      height: 1,
      pixelData,
    });

    pixelData.data[0] = 12;

    expect(sourceImage.pixelData.data[0]).toBe(255);
    expect(sourceImage.hasTransparency).toBe(true);
  });

  it('rejects images larger than the supported maximum', () => {
    const oversizedWidth = MAX_SOURCE_DIMENSION + 1;

    expect(() =>
      createSourceImage({
        sourceImageId: 'source-2',
        fileName: 'oversized.png',
        displayUrl: 'data:image/png;base64,sample',
        mimeType: 'image/png',
        width: oversizedWidth,
        height: 1,
        pixelData: new ImageData(new Uint8ClampedArray(oversizedWidth * 4), oversizedWidth, 1),
      }),
    ).toThrowError(/supported maximum/i);
  });

  it('rejects unsupported image types', () => {
    expect(() =>
      createSourceImage({
        sourceImageId: 'source-3',
        fileName: 'sample.webp',
        displayUrl: 'data:image/webp;base64,sample',
        mimeType: 'image/webp',
        width: 1,
        height: 1,
        pixelData: new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1),
      }),
    ).toThrowError(/unsupported image type/i);
  });
});
