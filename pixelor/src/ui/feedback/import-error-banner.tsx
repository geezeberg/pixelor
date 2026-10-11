import { useWorkspaceContext } from '../../app/providers/workspace-provider';
import { toUserFacingMessage } from '../../shared/utils/error-messages';

export function ImportErrorBanner() {
  const { state, dismissError } = useWorkspaceContext();

  if (!state.lastError) {
    return null;
  }

  return (
    <div
      className="panel"
      role="alert"
      style={{
        padding: 16,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        borderColor: 'rgba(160, 32, 56, 0.2)',
        background: 'rgba(160, 32, 56, 0.06)',
      }}
    >
      <div style={{ flex: 1 }}>{toUserFacingMessage(state.lastError)}</div>
      <button type="button" onClick={dismissError}>
        Dismiss
      </button>
    </div>
  );
}
