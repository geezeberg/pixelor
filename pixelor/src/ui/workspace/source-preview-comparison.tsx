import { useEffect, useRef, useState } from 'react';
import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function SourcePreviewComparison() {
  const { state, services } = useWorkspaceContext();
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeDisplayGrid = state.activeProcessedLogicalGrid ?? state.activeLogicalGrid;

  useEffect(() => {
    if (!previewCanvasRef.current || !activeDisplayGrid || !state.activeRenderPreview) {
      return;
    }

    services.drawRenderPreview({
      logicalGrid: activeDisplayGrid,
      renderPreview: state.activeRenderPreview,
      canvas: previewCanvasRef.current,
    });
  }, [activeDisplayGrid, services, state.activeRenderPreview]);

  useEffect(() => {
    if (!isLightboxOpen || !modalCanvasRef.current || !activeDisplayGrid || !state.activeRenderPreview) {
      return;
    }

    services.drawRenderPreview({
      logicalGrid: activeDisplayGrid,
      renderPreview: state.activeRenderPreview,
      canvas: modalCanvasRef.current,
    });
  }, [activeDisplayGrid, isLightboxOpen, services, state.activeRenderPreview]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <section className="panel preview-comparison-panel" style={{ padding: 20, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Source and rendered preview</h2>
        <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>
          The left view stays faithful to the imported source. The right view renders the logical grid.
        </p>
      </div>

      <div className="preview-comparison-grid">
        <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
          <figcaption style={{ fontWeight: 600 }}>Original image</figcaption>
          {state.activeSourceImage ? (
            <img
              alt="Imported source preview"
              src={state.activeSourceImage.displayUrl}
              style={{ width: '100%', borderRadius: 16, border: '1px solid rgba(29, 36, 48, 0.12)' }}
            />
          ) : (
            <div style={{ minHeight: 280, display: 'grid', placeItems: 'center', background: 'rgba(29, 36, 48, 0.05)', borderRadius: 16 }}>
              No source image loaded.
            </div>
          )}
        </figure>

        <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
          <figcaption style={{ fontWeight: 600 }}>
            Rendered preview{state.paletteWorkspace.activePaletteId ? ' (palette-processed)' : ''}
          </figcaption>
          {state.activeRenderPreview ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ overflow: 'auto', borderRadius: 16, border: '1px solid rgba(29, 36, 48, 0.12)', background: 'white', padding: 12 }}>
                <canvas ref={previewCanvasRef} aria-label="Rendered logical pixel preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <button type="button" onClick={() => setIsLightboxOpen(true)}>
                Open large preview
              </button>
            </div>
          ) : (
            <div style={{ minHeight: 280, display: 'grid', placeItems: 'center', background: 'rgba(29, 36, 48, 0.05)', borderRadius: 16 }}>
              No rendered preview yet.
            </div>
          )}
        </figure>
      </div>

      {isLightboxOpen ? (
        <div className="preview-lightbox-backdrop" onClick={() => setIsLightboxOpen(false)}>
          <div className="preview-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="preview-lightbox-close"
              aria-label="Close large preview"
              onClick={() => setIsLightboxOpen(false)}
            >
              X
            </button>
            <canvas
              ref={modalCanvasRef}
              aria-label="Large rendered logical pixel preview"
              className="preview-lightbox-canvas"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
