# Quickstart Validation Guide: Image Import, Logical Pixelation, and Basic Rendered Preview

## Purpose

Provide a validation path for Feature 001 once implementation exists. This guide
focuses on proving the end-to-end workflow described in the specification and
plan.

## Prerequisites

- Node.js 22 LTS installed locally
- A modern desktop browser such as current Chrome, Firefox, or Safari
- Sample test assets:
  - one PNG with transparency
  - one JPEG without transparency
  - one oversized image above 2048x2048 for validation failure

## Setup

1. Install project dependencies.
2. Start the local development server.
3. Open the application in a desktop browser with network access disabled to
   confirm the core workflow remains local-first.

### Suggested Commands

```bash
npm install
npm run dev
```

## Validation Scenarios

### Scenario 1: Import Supported Image

1. Open the application with no image loaded.
2. Import a supported PNG or JPEG through the file picker.
3. Confirm the workspace shows both the original image and the rendered preview.
4. Confirm the imported source remains visible as a separate reference.

**Expected outcome**: The image loads without network activity and produces a
stable original-plus-preview workspace.

### Scenario 2: Drag-and-Drop Import

1. Drag a supported image file onto the workspace.
2. Confirm the same behavior as file-picker import.

**Expected outcome**: Drag-and-drop reaches the same loaded workspace state as
file selection.

### Scenario 3: Interactive Pixelation Update

1. With an image loaded, change the pixelation control several times.
2. Observe whether the rendered preview updates without an explicit apply step.
3. Confirm the original image remains unchanged.

**Expected outcome**: Preview updates are interactive and visually crisp while
the source image remains recoverable and unchanged.

### Scenario 4: Transparency Preservation

1. Import a PNG with transparent areas.
2. Adjust the pixelation setting.
3. Export the rendered PNG.
4. Compare the preview and exported image.

**Expected outcome**: Transparent areas remain meaningful in preview and export,
and the exported output matches the preview.

### Scenario 5: Replace Active Image

1. Import one supported image and adjust pixelation.
2. Import a second supported image.
3. Confirm the workspace updates to the new source and new derived preview.

**Expected outcome**: Replacing the image does not require restart and does not
leave stale preview data visible.

### Scenario 6: Invalid Import Handling

1. Attempt to import an unsupported file type.
2. Attempt to import a corrupt image file.
3. Attempt to import an image larger than 2048x2048.

**Expected outcome**: Each failure shows a clear error and the workspace remains
recoverable for another import attempt.

## Verification References

- Data model: [data-model.md](./data-model.md)
- UI behavior contract: [contracts/workspace-ui-contract.md](./contracts/workspace-ui-contract.md)
- Feature specification: [spec.md](./spec.md)

## Suggested Test Commands

```bash
npm run test
```

## Expected Test Focus

- Deterministic logical grid generation
- Aspect-ratio preservation during sampling
- Transparency preservation in preview/export pipeline
- Export parity with active rendered preview
- Stable workspace behavior when replacing or rejecting images

## Validation Log

### Automated Coverage Added

- Unit coverage now exists for source-image validation, logical grid generation,
  pixelation-setting bounds, preview regeneration, and PNG export parity.
- Integration coverage now exists for import plus preview display, interactive
  pixelation updates, replace-image flow, import error recovery, and
  cross-story regression around source stability and export triggering.

### SC-001 and SC-002 Timing Status

- **SC-001**: Not measured in this agent environment. The implementation now
  records import timing through `src/shared/utils/performance-marks.ts`, but the
  current environment does not provide Node.js, npm, or a runnable browser app
  session for automated measurement.
- **SC-002**: Not measured in this agent environment. Preview update timing
  instrumentation is present, but browser execution is blocked by the missing
  JavaScript runtime and package manager.

### Full Quickstart Run Status

- The end-to-end quickstart scenarios were not executed from this session
  because the environment does not provide `node` or `npm`, so the Vite app and
  Vitest suite could not be launched here.