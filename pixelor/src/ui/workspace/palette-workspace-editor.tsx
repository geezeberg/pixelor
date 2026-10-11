import { useEffect, useMemo, useState } from 'react';
import { useWorkspaceContext } from '../../app/providers/workspace-provider';
import type { Palette } from '../../domain/palettes/palette';
import { PALETTE_LIMITS, SOFT_STRENGTH_LIMITS } from '../../shared/utils/palette-constants';

function sourceLabel(sourceType: Palette['sourceType']) {
  if (sourceType === 'predefined') {
    return 'Preset';
  }

  if (sourceType === 'custom') {
    return 'Custom';
  }

  return 'Auto';
}

export function PaletteWorkspaceEditor() {
  const {
    state,
    generatePalette,
    selectPalette,
    duplicatePalette,
    renameActivePalette,
    updateActivePaletteColor,
    addActivePaletteColor,
    removeActivePaletteColor,
    updateColorProcessing,
    saveActivePalette,
    saveActivePaletteAsCustom,
    deleteActivePalette,
    exportActivePalette,
    importPaletteFile,
  } = useWorkspaceContext();

  const [targetSize, setTargetSize] = useState(16);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const hasImage = Boolean(state.activeSourceImage);
  const activePaletteId = state.paletteWorkspace.activePaletteId;
  const activePalette: Palette | null = activePaletteId ? state.paletteWorkspace.palettesById[activePaletteId] ?? null : null;
  const paletteList = useMemo(
    () => state.paletteWorkspace.orderedPaletteIds
      .map((paletteId) => state.paletteWorkspace.palettesById[paletteId])
      .filter((palette): palette is Palette => Boolean(palette)),
    [state.paletteWorkspace.orderedPaletteIds, state.paletteWorkspace.palettesById],
  );
  const predefinedPalettes = paletteList.filter((palette) => palette.sourceType === 'predefined');
  const customPalettes = paletteList.filter((palette) => palette.sourceType === 'custom');
  const processing = state.paletteWorkspace.processing;

  useEffect(() => {
    if (!activePalette) {
      setSelectedColorIndex(0);
      return;
    }

    if (selectedColorIndex >= activePalette.colors.length) {
      setSelectedColorIndex(Math.max(0, activePalette.colors.length - 1));
    }
  }, [activePalette, selectedColorIndex]);

  const selectedEntry = activePalette ? activePalette.colors[selectedColorIndex] : null;

  return (
    <section className="panel palette-workspace-panel" style={{ padding: 20, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Palette workspace</h2>
        <p style={{ marginBottom: 0, color: '#4e5765' }}>
          Generate, select, edit, process, and manage palettes from one place.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <label htmlFor="palette-size-range">Palette size</label>
        <input
          id="palette-size-range"
          type="range"
          min={PALETTE_LIMITS.minColors}
          max={PALETTE_LIMITS.maxColors}
          step={1}
          disabled={!hasImage}
          value={targetSize}
          onChange={(event) => setTargetSize(Number(event.currentTarget.value))}
        />

        <label htmlFor="palette-size-number">Requested colors</label>
        <input
          id="palette-size-number"
          type="number"
          min={PALETTE_LIMITS.minColors}
          max={PALETTE_LIMITS.maxColors}
          step={1}
          disabled={!hasImage}
          value={targetSize}
          onChange={(event) => setTargetSize(Number(event.currentTarget.value))}
        />

        <button type="button" disabled={!hasImage} onClick={() => generatePalette(targetSize)}>
          Generate palette
        </button>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <label htmlFor="active-palette-select">Active palette</label>
        <select
          id="active-palette-select"
          value={activePaletteId ?? ''}
          disabled={!hasImage || paletteList.length === 0}
          onChange={(event) => {
            const nextId = event.currentTarget.value;
            if (nextId) {
              selectPalette(nextId);
            }
          }}
        >
          <option value="" disabled>
            Select a palette
          </option>
          {paletteList.map((palette) => (
            <option key={palette.paletteId} value={palette.paletteId}>
              {sourceLabel(palette.sourceType)}: {palette.name} ({palette.colors.length})
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>Preset palettes</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {predefinedPalettes.map((palette) => (
            <button key={palette.paletteId} type="button" onClick={() => selectPalette(palette.paletteId)}>
              {palette.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <strong>Saved custom palettes</strong>
        {customPalettes.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {customPalettes.map((palette) => (
              <button key={palette.paletteId} type="button" onClick={() => selectPalette(palette.paletteId)}>
                {palette.name}
              </button>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#4e5765' }}>No saved custom palettes yet.</p>
        )}
      </div>

      {activePalette ? (
        <>
          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '1.05rem' }}>{activePalette.name}</strong>
              <span style={{ color: '#4e5765' }}>
                {sourceLabel(activePalette.sourceType)} · {activePalette.colors.length} colors
              </span>
            </div>

            <label htmlFor="palette-name">Palette name</label>
            <input
              id="palette-name"
              type="text"
              value={activePalette.name}
              disabled={!activePalette.isEditable}
              onChange={(event) => renameActivePalette(event.currentTarget.value)}
            />
          </div>

          <div className="palette-swatch-grid" role="list" aria-label="Palette swatches">
            {activePalette.colors.map((entry, index) => (
              <button
                key={entry.entryId}
                type="button"
                aria-label={`palette-swatch-${index}`}
                title={entry.hex}
                className={`palette-swatch ${selectedColorIndex === index ? 'is-active' : ''}`}
                style={{ background: entry.hex }}
                onClick={() => setSelectedColorIndex(index)}
              />
            ))}
          </div>

          {selectedEntry ? (
            <div style={{ display: 'grid', gap: 8 }}>
              <strong>Selected color</strong>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  aria-label="selected-swatch-color"
                  type="color"
                  disabled={!activePalette.isEditable}
                  value={selectedEntry.hex}
                  onChange={(event) => updateActivePaletteColor(selectedColorIndex, event.currentTarget.value)}
                />
                <input
                  aria-label="selected-swatch-hex"
                  type="text"
                  disabled={!activePalette.isEditable}
                  value={selectedEntry.hex}
                  onChange={(event) => updateActivePaletteColor(selectedColorIndex, event.currentTarget.value)}
                />
                <button
                  type="button"
                  disabled={!activePalette.isEditable || activePalette.colors.length <= PALETTE_LIMITS.minColors}
                  onClick={() => removeActivePaletteColor(selectedColorIndex)}
                >
                  Remove selected color
                </button>
                <button type="button" disabled={!activePalette.isEditable} onClick={() => addActivePaletteColor('#808080')}>
                  Add color
                </button>
                {activePalette.sourceType !== 'custom' ? (
                  <button type="button" onClick={() => duplicatePalette(activePalette.paletteId)}>
                    Duplicate as custom
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p style={{ margin: 0, color: '#4e5765' }}>Generate or select a palette to start editing.</p>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>Color processing</h3>

        <label htmlFor="processing-mode">Mode</label>
        <select
          id="processing-mode"
          disabled={!activePalette}
          value={processing.mode}
          onChange={(event) => updateColorProcessing({ mode: event.currentTarget.value as 'strict' | 'soft' })}
        >
          <option value="strict">Strict Palette Matching</option>
          <option value="soft">Soft Palette Grading</option>
        </select>

        {processing.mode === 'soft' ? (
          <>
            <label htmlFor="soft-strength">Soft strength</label>
            <input
              id="soft-strength"
              type="range"
              min={SOFT_STRENGTH_LIMITS.min}
              max={SOFT_STRENGTH_LIMITS.max}
              step={0.05}
              disabled={!activePalette}
              value={processing.softStrength}
              onChange={(event) => updateColorProcessing({ softStrength: Number(event.currentTarget.value) })}
            />
          </>
        ) : null}

        <label htmlFor="dithering-enabled" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            id="dithering-enabled"
            type="checkbox"
            disabled={!activePalette}
            checked={processing.ditheringEnabled}
            onChange={(event) => updateColorProcessing({ ditheringEnabled: event.currentTarget.checked })}
          />
          Enable ordered dithering
        </label>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>Library</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={!activePalette || activePalette.sourceType !== 'custom'}
            onClick={() => {
              void saveActivePalette();
            }}
          >
            Save active custom palette
          </button>
          <button
            type="button"
            disabled={!activePalette || !activePalette.isEditable}
            onClick={() => {
              void saveActivePaletteAsCustom();
            }}
          >
            Save as new custom palette
          </button>
          <button
            type="button"
            disabled={!activePalette || activePalette.sourceType !== 'custom'}
            onClick={() => {
              void deleteActivePalette();
            }}
          >
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
      </div>
    </section>
  );
}
