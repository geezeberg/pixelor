import { WorkspaceStatus } from '../feedback/workspace-status';
import { ImportErrorBanner } from '../feedback/import-error-banner';
import { PixelationControl } from '../controls/pixelation-control';
import { WorkspaceActions } from '../controls/workspace-actions';
import { ImportPanel } from './import-panel';
import { SourcePreviewComparison } from './source-preview-comparison';

export function WorkspaceShell() {
  return (
    <main className="app-shell">
      <section className="workspace-shell">
        <header className="workspace-header panel">
          <p>Feature 001</p>
          <h1>Import, pixelate, compare, export.</h1>
          <p>
            Pixelor keeps the source image intact, builds a distinct logical grid, and
            renders a preview that can evolve independently from future visual styles.
          </p>
        </header>

        <WorkspaceStatus />
        <ImportErrorBanner />

        <section className="workspace-content">
          <div style={{ display: 'grid', gap: 20 }}>
            <ImportPanel />
            <PixelationControl />
            <WorkspaceActions />
          </div>
          <SourcePreviewComparison />
        </section>
      </section>
    </main>
  );
}