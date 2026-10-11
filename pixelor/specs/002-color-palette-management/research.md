# Research: Color Reduction and Palette Management

## Palette Extraction Strategy

- **Decision**: Use deterministic color quantization to build automatic palettes from logical-grid source colors, with configurable target size from 2 to 256.
- **Rationale**: Quantization provides repeatable dominant-color extraction and predictable behavior for editing, persistence, and testing.
- **Alternatives considered**:
  - Randomized sampling was rejected because it reduces reproducibility.
  - Manual-only palette construction was rejected because it fails core user outcomes.

## Strict and Soft Application Modes

- **Decision**: Implement two explicit color-mapping paths:
  - strict mode: nearest-palette assignment for each non-transparent logical pixel
  - soft mode: blend source logical color toward nearest palette-guided target using user-controlled strength
- **Rationale**: This matches product goals for hard-limited versus influenced color workflows while keeping mode semantics clear.
- **Alternatives considered**:
  - Implicit single-mode behavior was rejected because users must explicitly choose mode.
  - Global post-render filters were rejected because processing must occur on logical pixels.

## Dithering Approach

- **Decision**: Implement one deterministic, established dithering algorithm (ordered Bayer matrix) with a simple on/off toggle.
- **Rationale**: Ordered dithering is stable, fast, and deterministic across runs, satisfying feature requirements and performance goals.
- **Alternatives considered**:
  - Error-diffusion-only first implementation was deferred due to more complex state propagation and harder predictability during rapid interactive updates.
  - Multiple algorithms in this feature were rejected as out of scope.

## Palette Persistence and Portability

- **Decision**: Persist custom palettes locally with IndexedDB-backed storage and use a documented JSON palette file format for import/export.
- **Rationale**: IndexedDB supports structured, local-first data durability; JSON supports straightforward validation and forward compatibility.
- **Alternatives considered**:
  - Server-side storage was rejected due to local-first constitution requirements.
  - Binary-only format was rejected due to poor inspectability and higher compatibility burden.

## Incremental Processing and Responsiveness

- **Decision**: Separate source-image, logical-grid, and color-processing stages; only recompute affected stages on user actions.
- **Rationale**: Prevents unnecessary source/grid regeneration on palette-only edits and preserves interactive responsiveness.
- **Alternatives considered**:
  - Full-pipeline rerun on every control change was rejected for performance risk.
  - React-managed per-pixel state was rejected due to architectural boundary violations.

## Failure Handling and Validation

- **Decision**: Validate palette import schema, color value format, color-count bounds, and duplicate-name conflict handling with explicit user-facing errors.
- **Rationale**: Meets robustness and usability requirements without corrupting active workspace state.
- **Alternatives considered**:
  - Lenient silent coercion of invalid palette files was rejected because it undermines predictability.
