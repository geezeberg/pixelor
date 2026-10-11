import { useRef } from 'react';
import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function WorkspaceActions() {
  const { state, exportPreview, replaceFile } = useWorkspaceContext();
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Workspace actions</h2>
        <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>
          Export the rendered output or replace the active source while keeping the session responsive.
        </p>
      </div>

      <button type="button" disabled={!state.activeRenderPreview} onClick={() => void exportPreview()}>
        Export PNG
      </button>

      <button type="button" disabled={!state.activeSourceImage} onClick={() => replaceInputRef.current?.click()}>
        Replace image
      </button>

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png,image/jpeg"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            void replaceFile(file);
          }
        }}
      />
    </section>
  );
}
