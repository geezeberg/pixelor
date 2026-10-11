import type { ImageWorkspaceServices } from '../../../domain/pipeline/contracts';
import type { WorkspaceRegenerationResult, WorkspaceState } from '../../../shared/types/image-workspace';
import { setPixelationValue } from '../state/pixelation-state';
import { WorkspaceError, isWorkspaceError } from '../../../shared/types/errors';
import { markPreviewEnd, markPreviewStart } from '../../../shared/utils/performance-marks';

function normalizeError(error: unknown) {
  if (isWorkspaceError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new WorkspaceError('render-failed', error.message);
  }

  return new WorkspaceError('render-failed', 'Unknown preview update failure.');
}

export interface UpdatePixelationActionInput {
  value: number;
  state: WorkspaceState;
  services: ImageWorkspaceServices;
}

export function updatePixelationAction({ value, state, services }: UpdatePixelationActionInput): WorkspaceRegenerationResult {
  if (!state.activeSourceImage) {
    throw new WorkspaceError('render-failed', 'Load a source image before adjusting the pixelation level.');
  }

  markPreviewStart();

  try {
    const nextState = setPixelationValue(state, value);
    const logicalGrid = services.generateLogicalPixelGrid(nextState.activeSourceImage, nextState.activePixelationSetting);
    const renderPreview = services.createRenderPreview({
      logicalGrid,
      renderScale: state.activeRenderPreview?.renderScale,
    });

    markPreviewEnd();
    return { logicalGrid, renderPreview };
  } catch (error) {
    markPreviewEnd();
    throw normalizeError(error);
  }
}
