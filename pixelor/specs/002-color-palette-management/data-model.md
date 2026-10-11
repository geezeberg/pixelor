# Data Model: Color Reduction and Palette Management

## Palette

- **Purpose**: Represents a named set of colors used for strict matching or soft grading.
- **Fields**:
  - `paletteId`: Stable identifier
  - `name`: User-visible palette name
  - `sourceType`: `automatic` | `predefined` | `custom`
  - `colors`: Ordered list of palette color entries
  - `isEditable`: Whether colors/name can be modified directly
  - `createdAt`: Creation timestamp
  - `updatedAt`: Last update timestamp
- **Validation Rules**:
  - Palette MUST contain between 2 and 256 colors
  - Name MUST be non-empty after trimming
  - Predefined palettes MUST be immutable
- **State Transitions**:
  - `generated` -> `edited`
  - `predefined` -> `duplicated-custom`
  - `custom` -> `persisted` | `deleted`

## Palette Color Entry

- **Purpose**: Represents one reusable color value in a palette.
- **Fields**:
  - `entryId`: Stable identifier within palette
  - `hex`: Canonical `#RRGGBB` representation
  - `rgba`: Numeric channels including alpha where applicable
  - `index`: Ordered position in palette
- **Validation Rules**:
  - Hex value MUST be valid and normalized
  - Index MUST be unique per palette

## Predefined Palette Catalog

- **Purpose**: Curated built-in palette collection.
- **Fields**:
  - `catalogId`
  - `palettes`: list of immutable predefined palettes
  - `groups`: optional category labels (`monochrome`, `retro`, `limited-color`)
- **Validation Rules**:
  - Every predefined palette must satisfy Palette bounds
  - Catalog entries MUST remain unchanged by user edits

## Color Processing Settings

- **Purpose**: Active controls that influence logical pixel color mapping.
- **Fields**:
  - `mode`: `strict` | `soft`
  - `softStrength`: numeric factor used only when `mode=soft`
  - `ditheringEnabled`: boolean toggle
  - `ditheringAlgorithm`: fixed identifier for this feature version
  - `selectedPaletteId`: active palette reference
- **Validation Rules**:
  - `softStrength` MUST remain inside defined UI bounds
  - `ditheringAlgorithm` MUST resolve to one deterministic implementation

## Processed Logical Grid

- **Purpose**: Color-processed logical pixel output consumed by rendering/export.
- **Fields**:
  - `gridFingerprint`: identity of source logical grid input
  - `paletteFingerprint`: identity of active palette state
  - `processedPixels`: mapped logical pixel color buffer
  - `modeUsed`: strict or soft
  - `ditheringApplied`: boolean
  - `preservesTransparency`: boolean
- **Validation Rules**:
  - Dimensions MUST match source logical grid dimensions
  - In strict mode, all non-transparent colors MUST belong to active palette
  - For identical inputs/settings, processed result MUST be deterministic

## Palette Library

- **Purpose**: Persisted store of user custom palettes.
- **Fields**:
  - `libraryVersion`: schema version
  - `palettes`: collection of custom palettes
  - `lastSyncedAt`: local write timestamp
- **Validation Rules**:
  - Storage writes MUST not alter predefined palettes
  - Deletion MUST remove only targeted custom palette

## Palette File Artifact

- **Purpose**: Portable import/export representation of a palette.
- **Fields**:
  - `formatVersion`
  - `paletteName`
  - `colors`: ordered list of canonical color values
  - `metadata`: optional non-critical compatibility fields
- **Validation Rules**:
  - File MUST parse as supported format version
  - Color count MUST be 2-256
  - Invalid or unsupported data MUST fail import with explicit error
