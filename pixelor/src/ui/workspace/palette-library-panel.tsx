import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function PaletteLibraryPanel() {
  const { state, saveActivePalette, deleteActivePalette, exportActivePalette, importPaletteFile } = useWorkspaceContext();
  const activePalette = state.paletteWorkspace.activePaletteId
    ? state.paletteWorkspace.palettesById[state.paletteWorkspace.activePaletteId]
    : null;

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Palette library</h2>
        <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>Save custom palettes locally and move them via import/export JSON files.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" disabled={!activePalette || activePalette.sourceType !== 'custom'} onClick={saveActivePalette}>
          Save active custom palette
        </button>
        <button type="button" disabled={!activePalette || activePalette.sourceType !== 'custom'} onClick={deleteActivePalette}>
          Delete active custom palette
        </button>
        <button type="button" disabled={!activePalette} onClick={exportActivePalette}>
          Export active palette
        </button>
      </div>

      <label htmlFor="palette-import-file">Import palette JSON</label>
      <input
        id="palette-import-file"
        type="file"
        accept="application/json,.json"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            void importPaletteFile(file);
          }
          event.currentTarget.value = '';
        }}
      />
    </section>
  );
}
