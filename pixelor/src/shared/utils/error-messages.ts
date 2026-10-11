import { WorkspaceError, type WorkspaceErrorCode } from '../types/errors';

const ERROR_MESSAGES: Record<WorkspaceErrorCode, string> = {
  'unsupported-type': 'Only PNG and JPEG images are supported.',
  'oversized-image': 'Images must be 2048 by 2048 pixels or smaller.',
  'corrupt-image': 'The selected image could not be decoded.',
  'empty-image': 'The selected image file is empty.',
  'missing-preview': 'Load an image before exporting a preview.',
  'render-failed': 'The preview could not be rendered.',
  'export-failed': 'The rendered preview could not be exported.',
  unknown: 'Something went wrong while processing the image.',
};

export function toUserFacingMessage(error: unknown): string {
  if (error instanceof WorkspaceError) {
    return ERROR_MESSAGES[error.code] ?? error.message;
  }

  return ERROR_MESSAGES.unknown;
}
