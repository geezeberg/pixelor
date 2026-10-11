# UI Contract: Palette and Color Processing Workflow

## Purpose

Define the user-visible behavior for Feature 002 palette workflows and color processing in the image workspace.

## Core States

| State | Required Visible Elements | Allowed User Actions | Expected Outcome |
|-------|----------------------------|----------------------|------------------|
| No image loaded | Palette controls visible but disabled where required, guidance text | Import image | Feature 001 workflow activates; palette controls become actionable when relevant |
| Image loaded, no custom edits | Active palette source selector, mode selector, dithering toggle, preview | Generate/select palette, switch mode | Processed preview updates while source image remains unchanged |
| Editing custom palette | Palette name, editable color list, add/remove/edit controls, preview | Modify colors, rename, save | Processed preview updates interactively |
| Palette import/export | Import action, export action, validation feedback | Import file, export palette | Valid file round-trips with accurate color values |
| Error state | Clear error message, retry controls, stable previous workspace | Retry operation | User can recover without app restart |

## Palette Source Contract

- Users MUST be able to switch between automatic, predefined, and custom palette sources.
- Predefined palettes MUST display color count and preview swatches.
- Duplicating a predefined palette MUST produce an editable custom palette.

## Mode Contract

- Mode selector MUST expose `Strict Palette Matching` and `Soft Palette Grading`.
- Strict mode MUST constrain non-transparent logical pixel colors to selected palette.
- Soft mode MUST preserve some source variation and expose a strength control.
- Mode switching MUST be reversible and non-destructive.

## Dithering Contract

- UI MUST provide a single on/off dithering toggle.
- Dithering MUST operate on logical pixel colors only.
- Dithering MUST not change logical grid dimensions.
- For identical inputs/settings, dithering output MUST be deterministic.

## Persistence Contract

- Custom palettes MUST persist locally across sessions.
- Users MUST be able to rename, update, and delete saved custom palettes.
- Palette import/export MUST use a portable format with explicit validation errors for invalid files.

## Preview and Export Contract

- Palette and mode changes MUST update preview interactively.
- Logical pixelation controls from Feature 001 MUST remain available.
- Changing logical pixelation MUST not clear selected palette settings.
- Exported PNG MUST match the visible processed preview for active settings.
- Source transparency MUST remain preserved.
