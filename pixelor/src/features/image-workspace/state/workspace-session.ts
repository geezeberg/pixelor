import { createPixelationSetting } from '../../../domain/logical-grid/pixelation-setting';
import type { WorkspaceState } from '../../../shared/types/image-workspace';

export function createInitialWorkspaceState(): WorkspaceState {
  return {
    activeSourceImage: null,
    activePixelationSetting: createPixelationSetting(),
    activeLogicalGrid: null,
    activeRenderPreview: null,
    lastExportedOutput: null,
    lastError: null,
    phase: 'idle',
  };
}

export function clearDerivedWorkspaceState(state: WorkspaceState): WorkspaceState {
  return {
    ...state,
    activeLogicalGrid: null,
    activeRenderPreview: null,
    lastExportedOutput: null,
  };
}
