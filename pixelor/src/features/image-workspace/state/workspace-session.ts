import { createPixelationSetting } from '../../../domain/logical-grid/pixelation-setting';
import type { WorkspaceState } from '../../../shared/types/image-workspace';
import { createInitialPaletteWorkspaceState } from './palette-workspace-state';

export function createInitialWorkspaceState(): WorkspaceState {
  return {
    activeSourceImage: null,
    activePixelationSetting: createPixelationSetting(),
    activeLogicalGrid: null,
    activeProcessedLogicalGrid: null,
    activeRenderPreview: null,
    lastExportedOutput: null,
    lastError: null,
    paletteWorkspace: createInitialPaletteWorkspaceState(),
    phase: 'idle',
  };
}

export function clearDerivedWorkspaceState(state: WorkspaceState): WorkspaceState {
  return {
    ...state,
    activeLogicalGrid: null,
    activeProcessedLogicalGrid: null,
    activeRenderPreview: null,
    lastExportedOutput: null,
  };
}
