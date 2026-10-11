# Research: Image Import, Logical Pixelation, and Basic Rendered Preview

## Browser Image Pipeline Boundaries

- **Decision**: Use four framework-independent pipeline modules: source image,
  logical pixel grid generation, rendered preview generation, and PNG export.
- **Rationale**: This directly enforces the constitution's separation between
  source data, conversion logic, rendering, and export output while keeping
  React limited to UI state.
- **Alternatives considered**:
  - Monolithic React-owned pixel state was rejected because it couples image
    processing to component lifecycle and violates the architecture boundary.
  - Immediate persistence storage was rejected because Feature 001 only needs a
    single in-memory session and does not yet require project save/load.

## Preview Rendering Strategy

- **Decision**: Use Canvas 2D with image smoothing disabled and render the
  logical grid as crisp square blocks for Feature 001.
- **Rationale**: Canvas 2D is the constitution's preferred initial renderer and
  can produce sharp previews and exports without introducing premature GPU or
  shader complexity.
- **Alternatives considered**:
  - WebGL-first rendering was rejected as premature for the initial vertical
    slice.
  - SVG or DOM-per-pixel rendering was rejected due to poor scalability and
    unnecessary rendering overhead.

## Import and Export Handling

- **Decision**: Use browser-native file selection and drag-and-drop import,
  browser image decode, and PNG export via canvas blob generation.
- **Rationale**: Native browser capabilities satisfy the offline requirement,
  preserve transparency, and avoid unnecessary third-party decoding libraries.
- **Alternatives considered**:
  - WASM-based image toolchains were rejected because they add payload and
    complexity without value for basic PNG/JPEG import and PNG export.
  - Network-backed conversion services were rejected because they violate the
    local-first constitution.

## Performance and Future Acceleration

- **Decision**: Keep logical grid generation and rendered output generation as
  pure data transforms that can later move to Web Workers or GPU-backed
  rendering if measured performance requires it.
- **Rationale**: The feature remains simple now while preserving a clean future
  upgrade path for worker transfer or alternate rendering backends.
- **Alternatives considered**:
  - Worker-first architecture was rejected because Feature 001 must avoid
    unnecessary indirection before profiling indicates need.
  - GPU-first architecture was rejected because Canvas 2D is sufficient for the
    current scope and browser support expectations.

## Determinism and Testing Boundaries

- **Decision**: Treat logical pixel generation as a deterministic function from
  source pixels plus pixelation settings to a logical grid, and treat rendering
  as a separate deterministic function from grid plus render settings to visual
  output.
- **Rationale**: This supports reproducibility, export/preview parity, and the
  constitution's requirement for meaningful unit tests around critical image
  behavior.
- **Alternatives considered**:
  - Combining conversion and rendering into one opaque step was rejected because
    it obscures failures and prevents targeted testing.
  - Non-deterministic effects at this stage were rejected because they would
    undermine preview/export parity and saved-setting reproducibility.

## Validation Risks and Mitigations

- **Decision**: Validate file type, decode success, size limits, transparency
  handling, aspect-ratio preservation, preview responsiveness, and image
  replacement stability as first-class feature risks.
- **Rationale**: These areas map directly to the spec's edge cases and the
  constitution's performance and correctness requirements.
- **Alternatives considered**:
  - Relying on happy-path manual testing only was rejected because it leaves the
    most failure-prone import and conversion cases under-specified.
  - Adding broad end-to-end suites was rejected because the constitution favors
    targeted deterministic tests plus focused manual workflow validation.