# Pixelor

Pixelor is a local-first browser application for transforming imported artwork into logical pixel previews. Feature 001 established the first vertical slice: import a PNG or JPEG, preserve the source image, derive a logical pixel grid, render a crisp preview, and export the rendered result as PNG.

Feature 002 extends the workflow with color reduction and palette management:

- Automatic palette generation from logical-grid colors (2 to 256 colors)
- Curated predefined palettes and duplication into editable custom palettes
- Custom palette editing with color-picker and hex input controls
- Strict palette matching and soft grading modes
- Deterministic ordered dithering toggle
- Local palette persistence with IndexedDB-first storage and fallback behavior
- Palette JSON import/export with schema validation

## Available Scripts

- `npm install`: install the React, TypeScript, Vite, and Vitest toolchain
- `npm run dev`: start the local development server
- `npm run build`: type-check and build the production bundle
- `npm run test`: run the deterministic unit and integration suite
- `npm run test:watch`: run Vitest in watch mode

## Offline Workflow

- Import happens through the browser file picker or drag-and-drop
- PNG and JPEG inputs stay on the local device
- The source image remains distinct from the logical grid and rendered preview
- Export writes a PNG generated from the current rendered preview

## Current Feature Scope

- One active image workspace
- Adjustable logical pixelation control
- Side-by-side source image and rendered preview
- Replace-image flow without restarting
- Clear errors for unsupported, corrupt, or oversized images
- Palette generation, selection, and strict/soft processing controls
- Predefined and custom palette editing workflows
- Local custom palette save/delete and portable import/export

## Validation Focus

- Deterministic logical grid generation
- Preview/export parity
- Transparency preservation
- Responsive update and export flow
- Offline-friendly import behavior
- Deterministic palette extraction and strict membership guarantees
- Deterministic ordered dithering for identical inputs
- Palette persistence and file round-trip validation