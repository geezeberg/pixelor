import { useRef, useState } from 'react';
import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function ImportPanel() {
  const { importFile, state } = useWorkspaceContext();
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) {
      void importFile(file);
    }
  }

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Import artwork</h2>
        <p style={{ marginBottom: 0, color: '#4e5765' }}>
          PNG and JPEG only. Files stay local and the original stays recoverable.
        </p>
      </div>

      <button type="button" onClick={() => inputRef.current?.click()}>
        Choose image
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        style={{ display: 'none' }}
        onChange={(event) => handleFiles(event.currentTarget.files)}
      />

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
        style={{
          border: `2px dashed ${isDragActive ? '#ca6702' : 'rgba(29, 36, 48, 0.2)'}`,
          borderRadius: 16,
          padding: 24,
          minHeight: 180,
          display: 'grid',
          placeItems: 'center',
          background: isDragActive ? 'rgba(255, 184, 108, 0.18)' : 'rgba(255, 255, 255, 0.4)',
          textAlign: 'center',
        }}
      >
        <div>
          <strong>{state.phase === 'loading' ? 'Importing image…' : 'Drop an image here'}</strong>
          <p style={{ marginBottom: 0, color: '#4e5765' }}>Offline import via drag-and-drop or file picker.</p>
        </div>
      </div>
    </section>
  );
}
