import type { ImageWorkspaceServices } from '../../../domain/pipeline/contracts';
import type { WorkspaceImportResult, WorkspaceState } from '../../../shared/types/image-workspace';
import { WorkspaceError, isWorkspaceError } from '../../../shared/types/errors';
import { markImportEnd, markImportStart } from '../../../shared/utils/performance-marks';

function normalizeError(error: unknown) {
  if (isWorkspaceError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new WorkspaceError('unknown', error.message);
  }

  return new WorkspaceError('unknown', 'Unknown image import failure.');
}

export interface ImportImageActionInput {
  file: File;
  previousState: WorkspaceState;
  services: ImageWorkspaceServices;
}

export async function importImageAction({ file, previousState, services }: ImportImageActionInput): Promise<WorkspaceImportResult> {
  markImportStart();

  try {
    const sourceImage = await services.importSourceImage({ file });
    const logicalGrid = services.generateLogicalPixelGrid(sourceImage, previousState.activePixelationSetting);
    const renderPreview = services.createRenderPreview({ logicalGrid });
    markImportEnd();

    return {
      sourceImage,
      logicalGrid,
      renderPreview,
    };
  } catch (error) {
    markImportEnd();
    throw normalizeError(error);
  }
}
