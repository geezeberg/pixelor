import { useWorkspaceContext } from '../../app/providers/workspace-provider';
import type { Palette } from '../../domain/palettes/palette';

export function CustomPaletteEditor() {
  const {
    state,
    renameActivePalette,
    updateActivePaletteColor,
    addActivePaletteColor,
    removeActivePaletteColor,
    selectPalette,
  } = useWorkspaceContext();

  const activePaletteId = state.paletteWorkspace.activePaletteId;
  const activePalette: Palette | null = activePaletteId ? state.paletteWorkspace.palettesById[activePaletteId] : null;

  if (!activePalette) {
    return (
      <section className="panel" style={{ padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>Custom palette editor</h2>
        <p style={{ marginBottom: 0, color: '#4e5765' }}>Duplicate a predefined palette or generate one first to begin editing.</p>
      </section>
    );
  }

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Custom palette editor</h2>
        <p style={{ marginBottom: 0, color: '#4e5765' }}>Rename, edit, add, and remove colors for the selected editable palette.</p>
      </div>

      <label htmlFor="palette-name">Palette name</label>
      <input
        id="palette-name"
        type="text"
        value={activePalette.name}
        disabled={!activePalette.isEditable}
        onChange={(event) => renameActivePalette(event.currentTarget.value)}
      />

      <div style={{ display: 'grid', gap: 8 }}>
        {activePalette.colors.map((entry: Palette['colors'][number], index: number) => (
          <div key={entry.entryId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              aria-label={`palette-color-${index}`}
              type="color"
              value={entry.hex}
              disabled={!activePalette.isEditable}
              onChange={(event) => updateActivePaletteColor(index, event.currentTarget.value)}
            />
            <input
              aria-label={`palette-color-hex-${index}`}
              type="text"
              value={entry.hex}
              disabled={!activePalette.isEditable}
              onChange={(event) => updateActivePaletteColor(index, event.currentTarget.value)}
            />
            <button type="button" disabled={!activePalette.isEditable} onClick={() => removeActivePaletteColor(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" disabled={!activePalette.isEditable} onClick={() => addActivePaletteColor('#808080')}>
          Add color
        </button>
        <button type="button" onClick={() => selectPalette(activePalette.paletteId)}>
          Apply to preview
        </button>
      </div>
    </section>
  );
}
