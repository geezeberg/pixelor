import { toUserFacingMessage } from '../../shared/utils/error-messages';
import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function WorkspaceStatus() {
  const { state, isOffline } = useWorkspaceContext();

  let message = 'Load a PNG or JPEG to start building a logical pixel preview.';

  if (state.phase === 'loading') {
    message = 'Importing image and preparing the first preview.';
  } else if (state.phase === 'updating') {
    message = 'Updating the logical pixel grid preview.';
  } else if (state.phase === 'exporting') {
    message = 'Exporting the rendered preview as PNG.';
  } else if (state.lastError) {
    message = toUserFacingMessage(state.lastError);
  } else if (state.activeSourceImage) {
    message = `Loaded ${state.activeSourceImage.fileName} at ${state.activeSourceImage.width}×${state.activeSourceImage.height}.`;
  }

  return (
    <div className="workspace-status panel" role="status" aria-live="polite">
      <span>{message}</span>
      <span style={{ marginLeft: 'auto', fontSize: '0.9rem', opacity: 0.8 }}>
        {isOffline ? 'Offline mode active' : 'Online'}
      </span>
    </div>
  );
}
