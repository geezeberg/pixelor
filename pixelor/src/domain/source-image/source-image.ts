import { WorkspaceError } from '../../shared/types/errors';

export const MAX_SOURCE_DIMENSION = 2048;
export const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg'] as const;

export type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number];

export interface SourceImage {
  sourceImageId: string;
  fileName: string;
  displayUrl: string;
  mimeType: SupportedMimeType;
  width: number;
  height: number;
  pixelData: ImageData;
  hasTransparency: boolean;
  importedAt: number;
}

export interface CreateSourceImageInput {
  sourceImageId: string;
  fileName: string;
  displayUrl: string;
  mimeType: string;
  width: number;
  height: number;
  pixelData: ImageData;
  importedAt?: number;
}

export function assertSupportedMimeType(mimeType: string): asserts mimeType is SupportedMimeType {
  if (!SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType)) {
    throw new WorkspaceError('unsupported-type', `Unsupported image type: ${mimeType}`);
  }
}

export function imageHasTransparency(pixelData: ImageData): boolean {
  for (let index = 3; index < pixelData.data.length; index += 4) {
    if (pixelData.data[index] < 255) {
      return true;
    }
  }

  return false;
}

export function createSourceImage(input: CreateSourceImageInput): SourceImage {
  assertSupportedMimeType(input.mimeType);

  if (input.width <= 0 || input.height <= 0) {
    throw new WorkspaceError('empty-image', 'Image dimensions must be greater than zero.');
  }

  if (input.width > MAX_SOURCE_DIMENSION || input.height > MAX_SOURCE_DIMENSION) {
    throw new WorkspaceError('oversized-image', 'Image dimensions exceed the supported maximum.', {
      width: input.width,
      height: input.height,
    });
  }

  if (input.pixelData.width !== input.width || input.pixelData.height !== input.height) {
    throw new WorkspaceError('corrupt-image', 'Decoded image data did not match expected dimensions.');
  }

  return {
    sourceImageId: input.sourceImageId,
    fileName: input.fileName,
    displayUrl: input.displayUrl,
    mimeType: input.mimeType,
    width: input.width,
    height: input.height,
    pixelData: new ImageData(new Uint8ClampedArray(input.pixelData.data), input.width, input.height),
    hasTransparency: imageHasTransparency(input.pixelData),
    importedAt: input.importedAt ?? Date.now(),
  };
}
