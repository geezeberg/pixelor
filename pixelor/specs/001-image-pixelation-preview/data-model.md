# Data Model: Image Import, Logical Pixelation, and Basic Rendered Preview

## Source Image

- **Purpose**: Represents the recoverable imported artwork used as the immutable
  input to the feature workflow.
- **Fields**:
  - `sourceImageId`: Stable identifier for the currently loaded source image
  - `fileName`: Original file name for user reference
  - `mimeType`: Imported image type, limited to PNG or JPEG
  - `width`: Source image width in pixels
  - `height`: Source image height in pixels
  - `pixelData`: Full decoded source pixel buffer
  - `hasTransparency`: Whether the decoded image contains transparent pixels
  - `importedAt`: Timestamp for the current session import event
- **Validation Rules**:
  - Width and height MUST both be greater than zero and MUST NOT exceed 2048
  - MIME type MUST be supported before processing continues
  - Source pixel data MUST remain unchanged after import unless the user
    replaces the image
- **State Transitions**:
  - `empty` -> `loaded`
  - `loaded` -> `replaced`
  - `loaded` -> `error` if replacement import fails after the previous source is
    intentionally released

## Pixelation Setting

- **Purpose**: Captures the active user-selected level of logical detail.
- **Fields**:
  - `settingValue`: Current pixelation control value
  - `minValue`: Minimum allowed setting
  - `maxValue`: Maximum allowed setting
  - `defaultValue`: Initial setting used after a successful import
- **Validation Rules**:
  - Current value MUST stay within the supported bounds
  - Setting changes MUST trigger logical grid regeneration
- **State Transitions**:
  - `defaulted` -> `adjusted`
  - `adjusted` -> `adjusted` on subsequent changes

## Logical Pixel Grid

- **Purpose**: Represents sampled image data at the chosen level of detail.
- **Fields**:
  - `gridWidth`: Width of the logical grid
  - `gridHeight`: Height of the logical grid
  - `sampledPixels`: Grid pixel buffer derived from the source image
  - `derivedFromSourceImageId`: Link back to the active source image
  - `derivedFromSettingValue`: Pixelation setting used to build the grid
  - `preservesTransparency`: Whether alpha values are carried into the grid
- **Validation Rules**:
  - Grid dimensions MUST preserve source aspect ratio within the selected
    sampling scheme
  - Grid generation MUST be deterministic for identical source data and
    identical settings
  - Grid generation MUST NOT mutate source image data
- **Relationships**:
  - One `Source Image` produces zero or one active `Logical Pixel Grid`
  - One `Pixelation Setting` maps to one active grid generation result per
    source image
- **State Transitions**:
  - `unavailable` -> `generated`
  - `generated` -> `regenerated` when the pixelation setting changes
  - `generated` -> `replaced` when the source image changes

## Render Preview

- **Purpose**: Represents the visible artistic preview derived from the logical
  grid for on-screen comparison.
- **Fields**:
  - `renderWidth`: Current preview rendering width
  - `renderHeight`: Current preview rendering height
  - `renderStyle`: Initial square-block render style for Feature 001
  - `renderedFromGridId`: Identifier or fingerprint of the logical grid used
  - `previewSurfaceState`: Ready, updating, or failed state for the preview
- **Validation Rules**:
  - Rendered preview MUST preserve crisp pixel boundaries without unintended
    smoothing
  - Render dimensions MUST remain conceptually independent from logical grid
    dimensions
  - Preview MUST accurately represent what export will produce for the same
    settings
- **Relationships**:
  - One `Logical Pixel Grid` produces one active `Render Preview`
- **State Transitions**:
  - `empty` -> `ready`
  - `ready` -> `updating` when pixelation changes
  - `updating` -> `ready` when redraw completes
  - `ready` -> `failed` if rendering cannot complete

## Exported Output

- **Purpose**: Represents the downloadable PNG artifact produced from the active
  rendered preview.
- **Fields**:
  - `exportFormat`: PNG for Feature 001
  - `exportedAt`: Timestamp of export generation
  - `matchesPreview`: Confirmation that export settings match the preview state
  - `sourceGridFingerprint`: Identity of the logical grid behind the export
- **Validation Rules**:
  - Export MUST only proceed when a valid rendered preview exists
  - Exported output MUST match the active preview for the current settings
  - Export MUST preserve transparency when present in the rendered result
- **Relationships**:
  - One `Render Preview` produces zero or more `Exported Output` artifacts

## Workspace Session

- **Purpose**: Represents the active end-user workflow state for a single image
  transformation session.
- **Fields**:
  - `activeSourceImage`
  - `activePixelationSetting`
  - `activeLogicalGrid`
  - `activeRenderPreview`
  - `lastError`
- **Validation Rules**:
  - Only one source image is active at a time in Feature 001
  - Import failure MUST leave the previous valid session intact when possible
  - Replacing the source image MUST invalidate derived grid and preview state
    before regeneration