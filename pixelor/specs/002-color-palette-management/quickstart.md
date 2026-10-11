# Quickstart Validation Guide: Color Reduction and Palette Management

## Purpose

Validate Feature 002 end-to-end behavior for palette generation, editing, application modes, dithering, persistence, and portability while preserving Feature 001 capabilities.

## Prerequisites

- Node.js and npm installed for project scripts
- Desktop browser (current Chrome, Firefox, or Safari)
- Sample assets:
  - PNG/JPEG test image with rich colors
  - PNG with transparency
  - Invalid palette file for error-path validation

## Setup

1. Install dependencies.
2. Start the development server.
3. Open the app in a browser.
4. Optionally disable network access to validate offline behavior.

### Suggested Commands

```bash
npm install
npm run dev
```

## Validation Scenarios

### Scenario 1: Automatic Palette Generation

1. Import an image using existing Feature 001 flow.
2. Set target palette size to a value between 2 and 256.
3. Generate an automatic palette.
4. Regenerate with a different size.

**Expected outcome**: Palette reflects dominant/significant image colors and preview updates; source image remains unchanged.

### Scenario 2: Predefined Palette Selection and Duplication

1. Open predefined palette list.
2. Select monochrome, retro, and limited-color entries.
3. Duplicate one predefined palette.

**Expected outcome**: Predefined palettes are browsable with visible color counts; duplicate becomes editable custom palette while original remains unchanged.

### Scenario 3: Custom Palette Editing

1. Rename a custom palette.
2. Add/remove colors while keeping size within bounds.
3. Edit colors with both picker and hex value input.

**Expected outcome**: Preview updates interactively; source image remains unchanged.

### Scenario 4: Strict vs Soft Mode

1. Enable strict mode and verify palette-only non-transparent output.
2. Switch to soft mode and adjust strength control.
3. Toggle back to strict mode.

**Expected outcome**: Mode behavior is clearly distinct, reversible, and non-destructive.

### Scenario 5: Dithering

1. Enable dithering in strict mode.
2. Disable and re-enable dithering with unchanged settings.
3. Repeat processing with identical input/settings.

**Expected outcome**: Logical grid dimensions do not change; repeated outputs are deterministic for identical inputs.

### Scenario 6: Palette Persistence

1. Save one or more custom palettes.
2. Reload/restart the app session.
3. Reopen palette list.

**Expected outcome**: Saved custom palettes remain available and editable.

### Scenario 7: Palette Import/Export

1. Export a custom palette.
2. Import the exported file.
3. Attempt import with malformed/unsupported file.

**Expected outcome**: Valid file round-trips with accurate color preservation; invalid files show meaningful errors and do not corrupt existing data.

### Scenario 8: Integration With Feature 001 Controls

1. Select a palette and mode.
2. Adjust logical pixelation settings from Feature 001.
3. Export PNG.

**Expected outcome**: Selected palette settings persist through pixelation changes; exported PNG matches preview.

## Verification References

- Spec: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Data model: [data-model.md](./data-model.md)
- Contract: [contracts/palette-workspace-contract.md](./contracts/palette-workspace-contract.md)

## Suggested Test Commands

```bash
npm run test
```

## Expected Automated Coverage Focus

- Deterministic palette extraction
- Strict-mode palette membership guarantees
- Soft-mode strength influence behavior
- Deterministic dithering
- Palette persistence and import/export validation
- Preview/export parity under active palette settings

## Validation Evidence (2026-10-11)

- Implemented automated unit coverage for palette generation, strict mapping, soft grading, ordered dithering, file-format validation, and persistence behavior.
- Implemented integration coverage for strict workflow, predefined-to-custom editing, mode/dithering switching, preview/export parity, palette retention on pixelation change, and persistence/export workflows.
- Added palette generation and mode-switch performance marks (`paletteGenerationDurationMs`, `modeSwitchDurationMs`) and budget assertions (<2s, <500ms).
- Updated cross-feature regression checks to keep Feature 001 import/pixelation/export behavior intact while palette processing is active.

## Follow-Up Notes

- In-agent command execution could not run `npm` in this environment (`npm: command not found`), so full script-driven quickstart execution remains to be verified in a local developer shell.
- No TypeScript diagnostics are currently reported in editor validation across `src/` and `tests/`.
