import { WorkspaceError } from '../types/errors';
import { MAX_SOURCE_DIMENSION } from '../../domain/source-image/source-image';

export function createStableId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function assertNonEmptyFile(file: File) {
  if (file.size <= 0) {
    throw new WorkspaceError('empty-image', 'The selected file is empty.');
  }
}

export async function loadImageElement(file: File): Promise<HTMLImageElement> {
  assertNonEmptyFile(file);

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new WorkspaceError('corrupt-image', 'The image could not be decoded.'));
      element.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function readImageDataFromElement(image: HTMLImageElement): ImageData {
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    throw new WorkspaceError('corrupt-image', 'The decoded image did not contain pixel data.');
  }

  if (image.naturalWidth > MAX_SOURCE_DIMENSION || image.naturalHeight > MAX_SOURCE_DIMENSION) {
    throw new WorkspaceError('oversized-image', 'Image dimensions exceed the supported maximum.', {
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
  }

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new WorkspaceError('corrupt-image', 'Canvas rendering context was unavailable.');
  }

  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}
