import { createLogicalPixelGrid } from './logical-pixel-grid';
import type { GenerateLogicalPixelGridService } from '../pipeline/contracts';

function averageChannel(total: number, samples: number) {
  return Math.round(total / samples);
}

export const generateLogicalPixelGrid: GenerateLogicalPixelGridService = (sourceImage, pixelationSetting) => {
  const blockSize = Math.max(1, Math.round(pixelationSetting.settingValue));
  const gridWidth = Math.max(1, Math.ceil(sourceImage.width / blockSize));
  const gridHeight = Math.max(1, Math.ceil(sourceImage.height / blockSize));
  const sampledPixels = new Uint8ClampedArray(gridWidth * gridHeight * 4);
  const sourcePixels = sourceImage.pixelData.data;

  for (let gridY = 0; gridY < gridHeight; gridY += 1) {
    const startY = gridY * blockSize;
    const endY = Math.min(sourceImage.height, startY + blockSize);

    for (let gridX = 0; gridX < gridWidth; gridX += 1) {
      const startX = gridX * blockSize;
      const endX = Math.min(sourceImage.width, startX + blockSize);

      let redTotal = 0;
      let greenTotal = 0;
      let blueTotal = 0;
      let alphaTotal = 0;
      let samples = 0;

      for (let pixelY = startY; pixelY < endY; pixelY += 1) {
        for (let pixelX = startX; pixelX < endX; pixelX += 1) {
          const sourceIndex = (pixelY * sourceImage.width + pixelX) * 4;
          redTotal += sourcePixels[sourceIndex];
          greenTotal += sourcePixels[sourceIndex + 1];
          blueTotal += sourcePixels[sourceIndex + 2];
          alphaTotal += sourcePixels[sourceIndex + 3];
          samples += 1;
        }
      }

      const targetIndex = (gridY * gridWidth + gridX) * 4;
      sampledPixels[targetIndex] = averageChannel(redTotal, samples);
      sampledPixels[targetIndex + 1] = averageChannel(greenTotal, samples);
      sampledPixels[targetIndex + 2] = averageChannel(blueTotal, samples);
      sampledPixels[targetIndex + 3] = averageChannel(alphaTotal, samples);
    }
  }

  return createLogicalPixelGrid({
    gridWidth,
    gridHeight,
    sampledPixels,
    derivedFromSourceImageId: sourceImage.sourceImageId,
    derivedFromSettingValue: pixelationSetting.settingValue,
    preservesTransparency: sourceImage.hasTransparency,
  });
};
