import { updatePixelationSetting } from '../../../domain/logical-grid/pixelation-setting';
import type { WorkspaceState } from '../../../shared/types/image-workspace';

export function setPixelationValue(state: WorkspaceState, value: number): WorkspaceState {
  return {
    ...state,
    activePixelationSetting: updatePixelationSetting(state.activePixelationSetting, value),
  };
}

export function canAdjustPixelation(state: WorkspaceState) {
  return Boolean(state.activeSourceImage);
}

export function canExportPreview(state: WorkspaceState) {
  return Boolean(state.activeLogicalGrid && state.activeRenderPreview);
}
