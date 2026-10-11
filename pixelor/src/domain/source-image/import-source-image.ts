import { createSourceImage } from './source-image';
import { createStableId, loadImageElement, readImageDataFromElement } from '../../shared/utils/file-image';
import type { ImportSourceImageService } from '../pipeline/contracts';

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const importSourceImage: ImportSourceImageService = async ({ file }) => {
  const [image, displayUrl] = await Promise.all([loadImageElement(file), readFileAsDataUrl(file)]);
  const pixelData = readImageDataFromElement(image);

  return createSourceImage({
    sourceImageId: createStableId('source'),
    fileName: file.name,
    displayUrl,
    mimeType: file.type,
    width: image.naturalWidth,
    height: image.naturalHeight,
    pixelData,
  });
};
