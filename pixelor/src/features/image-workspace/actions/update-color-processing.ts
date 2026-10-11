import type { WorkspaceState } from '../../../shared/types/image-workspace';
import { createColorProcessingSettings } from '../../../domain/color-processing/color-processing-settings';
import { markModeSwitchEnd, markModeSwitchStart } from '../../../shared/utils/performance-marks';

export interface UpdateColorProcessingInput {
  state: WorkspaceState;
  mode?: 'strict' | 'soft';
  softStrength?: number;
  ditheringEnabled?: boolean;
}

export function updateColorProcessingAction({
  state,
  mode,
  softStrength,
  ditheringEnabled,
}: UpdateColorProcessingInput): WorkspaceState {
  markModeSwitchStart();
  const nextProcessing = createColorProcessingSettings({
    ...state.paletteWorkspace.processing,
    mode: mode ?? state.paletteWorkspace.processing.mode,
    softStrength: softStrength ?? state.paletteWorkspace.processing.softStrength,
    ditheringEnabled: ditheringEnabled ?? state.paletteWorkspace.processing.ditheringEnabled,
  });

  markModeSwitchEnd();

  return {
    ...state,
    paletteWorkspace: {
      ...state.paletteWorkspace,
      processing: {
        ...nextProcessing,
        selectedPaletteId: state.paletteWorkspace.processing.selectedPaletteId,
      },
    },
  };
}
