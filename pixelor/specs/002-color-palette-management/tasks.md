---

description: "Task list for implementing Feature 002: Color Reduction and Palette Management"
---

# Tasks: Color Reduction and Palette Management

**Input**: Design documents from `/specs/002-color-palette-management/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Deterministic unit and integration tests are required for palette extraction, strict/soft mapping behavior, dithering, persistence, and preview/export parity.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single browser application: `src/`, `tests/` at repository root
- Feature docs live in `specs/002-color-palette-management/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare project scaffolding and shared folders for palette and color-processing modules

- [X] T001 Create palette and color-processing domain directories at `/home/tomtom/gm/pixelor/src/domain/palettes/` and `/home/tomtom/gm/pixelor/src/domain/color-processing/`
- [X] T002 [P] Create unit test directories for palettes and color-processing at `/home/tomtom/gm/pixelor/tests/unit/palettes/` and `/home/tomtom/gm/pixelor/tests/unit/color-processing/`
- [X] T003 [P] Create integration test directory for Feature 002 workspace flows at `/home/tomtom/gm/pixelor/tests/integration/image-workspace/`
- [X] T004 [P] Add shared type stubs for palette and color-processing state at `/home/tomtom/gm/pixelor/src/shared/types/palette-workspace.ts`
- [X] T005 [P] Add shared constants for palette bounds, mode defaults, and dithering defaults at `/home/tomtom/gm/pixelor/src/shared/utils/palette-constants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core models, contracts, and persistence interfaces required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create `Palette` model at `/home/tomtom/gm/pixelor/src/domain/palettes/palette.ts` enforcing "Palette MUST contain between 2 and 256 colors", "Name MUST be non-empty after trimming", and "Predefined palettes MUST be immutable"
- [X] T007 [P] Create `PaletteColorEntry` model at `/home/tomtom/gm/pixelor/src/domain/palettes/palette-color-entry.ts` enforcing "Hex value MUST be valid and normalized" and "Index MUST be unique per palette"
- [X] T008 [P] Create `PredefinedPaletteCatalog` model at `/home/tomtom/gm/pixelor/src/domain/palettes/predefined-palette-catalog.ts` enforcing "Every predefined palette must satisfy Palette bounds" and "Catalog entries MUST remain unchanged by user edits"
- [X] T009 [P] Create `ColorProcessingSettings` model at `/home/tomtom/gm/pixelor/src/domain/color-processing/color-processing-settings.ts` enforcing "softStrength MUST remain inside defined UI bounds" and "ditheringAlgorithm MUST resolve to one deterministic implementation"
- [X] T010 [P] Create `ProcessedLogicalGrid` model at `/home/tomtom/gm/pixelor/src/domain/color-processing/processed-logical-grid.ts` enforcing "Dimensions MUST match source logical grid dimensions", "In strict mode, all non-transparent colors MUST belong to active palette", and "For identical inputs/settings, processed result MUST be deterministic"
- [X] T011 [P] Create `PaletteLibrary` model at `/home/tomtom/gm/pixelor/src/domain/palettes/palette-library.ts` enforcing "Storage writes MUST not alter predefined palettes" and "Deletion MUST remove only targeted custom palette"
- [X] T012 [P] Create `PaletteFileArtifact` schema model at `/home/tomtom/gm/pixelor/src/domain/palettes/palette-file-artifact.ts` enforcing "File MUST parse as supported format version", "Color count MUST be 2-256", and "Invalid or unsupported data MUST fail import with explicit error"
- [X] T013 Create palette pipeline contracts at `/home/tomtom/gm/pixelor/src/domain/pipeline/palette-contracts.ts` for extraction, mapping, grading, dithering, persistence, and file portability
- [X] T014 [P] Create browser persistence adapter interface and implementation shell at `/home/tomtom/gm/pixelor/src/shared/utils/palette-storage.ts`
- [X] T015 [P] Create palette import/export JSON utility shell at `/home/tomtom/gm/pixelor/src/shared/utils/palette-file.ts`
- [X] T016 [P] Extend workspace error codes/messages for palette generation, palette file validation, and persistence failures at `/home/tomtom/gm/pixelor/src/shared/types/errors.ts` and `/home/tomtom/gm/pixelor/src/shared/utils/error-messages.ts`
- [X] T017 Create baseline palette workspace state and selectors at `/home/tomtom/gm/pixelor/src/features/image-workspace/state/palette-workspace-state.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Generate and Apply Reduced Palettes (Priority: P1) 🎯 MVP

**Goal**: Generate reduced palettes from loaded artwork and apply strict palette matching to logical pixels.

**Independent Test**: Import an image, generate 2-256 color palettes, re-generate with different sizes, apply strict mode, and confirm non-transparent processed colors are all from the selected palette while source image stays unchanged.

### Tests for User Story 1

- [X] T018 [P] [US1] Add unit tests for deterministic palette quantization and 2-256 bounds in `/home/tomtom/gm/pixelor/tests/unit/palettes/palette-generation.test.ts`
- [X] T019 [P] [US1] Add unit tests for strict mode palette-membership guarantees in `/home/tomtom/gm/pixelor/tests/unit/color-processing/strict-mapping.test.ts`
- [X] T020 [P] [US1] Add integration test for generate/regenerate strict-apply workflow in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/palette-generation-strict.test.tsx`

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement deterministic quantization-based palette extraction service in `/home/tomtom/gm/pixelor/src/domain/palettes/generate-palette-from-grid.ts`
- [X] T022 [P] [US1] Implement strict nearest-palette mapping service on logical pixels in `/home/tomtom/gm/pixelor/src/domain/color-processing/apply-strict-palette.ts`
- [X] T023 [P] [US1] Implement processed-grid pipeline assembly for strict mode in `/home/tomtom/gm/pixelor/src/domain/color-processing/build-processed-grid.ts`
- [X] T024 [US1] Implement actions to generate/regenerate automatic palettes in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/generate-palette.ts`
- [X] T025 [US1] Implement actions to select active palette source and apply strict mode in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/select-palette.ts`
- [X] T026 [US1] Implement automatic palette controls UI (size slider/input + regenerate) in `/home/tomtom/gm/pixelor/src/ui/controls/palette-generation-control.tsx`
- [X] T027 [US1] Wire strict processed-grid rendering path into preview draw flow in `/home/tomtom/gm/pixelor/src/ui/workspace/source-preview-comparison.tsx` and `/home/tomtom/gm/pixelor/src/app/providers/workspace-provider.tsx`

**Checkpoint**: User Story 1 provides an MVP for color-reduced strict palette output

---

## Phase 4: User Story 2 - Manage Predefined and Custom Palettes (Priority: P2)

**Goal**: Support predefined palette browsing, duplication, custom palette editing, and interactive preview updates.

**Independent Test**: Select predefined palette, duplicate into custom, rename/edit/add/remove colors with picker and hex, and verify preview updates while predefined source remains immutable.

### Tests for User Story 2

- [X] T028 [P] [US2] Add unit tests for predefined catalog immutability and duplication behavior in `/home/tomtom/gm/pixelor/tests/unit/palettes/predefined-catalog.test.ts`
- [X] T029 [P] [US2] Add unit tests for custom palette edit validations and color normalization in `/home/tomtom/gm/pixelor/tests/unit/palettes/custom-palette-editing.test.ts`
- [X] T030 [P] [US2] Add integration test for predefined-to-custom editing flow in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/predefined-custom-palette.test.tsx`

### Implementation for User Story 2

- [X] T031 [P] [US2] Implement curated predefined palette catalog data in `/home/tomtom/gm/pixelor/src/domain/palettes/predefined-palettes.ts`
- [X] T032 [P] [US2] Implement palette duplication and custom creation services in `/home/tomtom/gm/pixelor/src/domain/palettes/create-custom-palette.ts`
- [X] T033 [P] [US2] Implement custom palette color add/remove/edit/rename services in `/home/tomtom/gm/pixelor/src/domain/palettes/edit-custom-palette.ts`
- [X] T034 [US2] Implement actions for predefined selection, duplication, and custom edits in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/edit-palette.ts`
- [X] T035 [US2] Implement predefined palette browser UI with swatches/counts in `/home/tomtom/gm/pixelor/src/ui/workspace/predefined-palette-browser.tsx`
- [X] T036 [US2] Implement custom palette editor UI with color picker and hex input in `/home/tomtom/gm/pixelor/src/ui/workspace/custom-palette-editor.tsx`
- [X] T037 [US2] Integrate palette management controls into workspace shell without breaking Feature 001 controls in `/home/tomtom/gm/pixelor/src/ui/workspace/workspace-shell.tsx`

**Checkpoint**: User Story 2 adds editable palette workflows with interactive updates

---

## Phase 5: User Story 3 - Switch Color Modes and Dithering (Priority: P2)

**Goal**: Provide strict/soft mode switching, soft strength control, and deterministic basic dithering.

**Independent Test**: Switch strict/soft modes, adjust soft strength, toggle dithering on/off, and verify deterministic preview behavior with unchanged logical grid dimensions.

### Tests for User Story 3

- [X] T038 [P] [US3] Add unit tests for soft grading blend behavior and strength bounds in `/home/tomtom/gm/pixelor/tests/unit/color-processing/soft-grading.test.ts`
- [X] T039 [P] [US3] Add unit tests for deterministic ordered dithering and dimension invariance in `/home/tomtom/gm/pixelor/tests/unit/color-processing/dithering-ordered.test.ts`
- [X] T040 [P] [US3] Add integration test for mode switching + dithering workflow in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/mode-switch-dithering.test.tsx`

### Implementation for User Story 3

- [X] T041 [P] [US3] Implement soft palette grading service with user-controlled strength in `/home/tomtom/gm/pixelor/src/domain/color-processing/apply-soft-grading.ts`
- [X] T042 [P] [US3] Implement deterministic ordered Bayer dithering service in `/home/tomtom/gm/pixelor/src/domain/color-processing/apply-ordered-dithering.ts`
- [X] T043 [P] [US3] Implement mode-resolution orchestrator defining strict/soft+dither interaction in `/home/tomtom/gm/pixelor/src/domain/color-processing/resolve-color-processing.ts`
- [X] T044 [US3] Implement actions for mode selection, soft strength updates, and dithering toggle in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/update-color-processing.ts`
- [X] T045 [US3] Implement UI controls for mode selector, strength control, and dithering toggle in `/home/tomtom/gm/pixelor/src/ui/controls/color-processing-controls.tsx`
- [X] T046 [US3] Wire color-processing controls to provider state and preview updates in `/home/tomtom/gm/pixelor/src/app/providers/workspace-provider.tsx`

**Checkpoint**: User Story 3 adds reversible strict/soft behavior and deterministic dithering

---

## Phase 6: User Story 4 - Persist, Import, and Export Palettes Offline (Priority: P3)

**Goal**: Persist custom palettes across sessions and support validated palette file import/export.

**Independent Test**: Save custom palette, restart app, verify persistence, export/import palette file, and validate errors on invalid files while preserving existing data.

### Tests for User Story 4

- [X] T047 [P] [US4] Add unit tests for palette JSON schema validation and round-trip value preservation in `/home/tomtom/gm/pixelor/tests/unit/palettes/palette-file-format.test.ts`
- [X] T048 [P] [US4] Add unit tests for local palette persistence CRUD behavior in `/home/tomtom/gm/pixelor/tests/unit/palettes/palette-persistence.test.ts`
- [X] T049 [P] [US4] Add integration test for save/reload/import/export offline workflow in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/palette-persistence-portability.test.tsx`

### Implementation for User Story 4

- [X] T050 [P] [US4] Implement IndexedDB palette repository with fallback handling in `/home/tomtom/gm/pixelor/src/shared/utils/palette-storage.ts`
- [X] T051 [P] [US4] Implement palette JSON import/export and validation in `/home/tomtom/gm/pixelor/src/shared/utils/palette-file.ts`
- [X] T052 [US4] Implement actions for save/rename/delete/import/export custom palettes in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/persist-palette.ts`
- [X] T053 [US4] Implement palette library UI controls for saved custom palettes and file I/O in `/home/tomtom/gm/pixelor/src/ui/workspace/palette-library-panel.tsx`
- [X] T054 [US4] Integrate persisted palette loading during workspace bootstrap in `/home/tomtom/gm/pixelor/src/app/providers/workspace-provider.tsx`

**Checkpoint**: User Story 4 delivers local durability and portability

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end quality, performance, docs, and regression protection

- [X] T055 [P] Add preview/export parity regression tests for palette settings in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/palette-preview-export-parity.test.tsx`
- [X] T056 [P] Add performance instrumentation for palette generation and mode-switch timing in `/home/tomtom/gm/pixelor/src/shared/utils/performance-marks.ts`
- [X] T057 Preserve Feature 001 behavior via cross-feature regression suite updates in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/workspace-regressions.test.tsx`
- [X] T058 [P] Update user-facing docs for Feature 002 palette workflows in `/home/tomtom/gm/pixelor/README.md`
- [X] T059 Record Feature 002 quickstart validation evidence and timing outcomes in `/home/tomtom/gm/pixelor/specs/002-color-palette-management/quickstart.md`
- [ ] T060 Run full quickstart scenarios and document follow-up fixes in `/home/tomtom/gm/pixelor/specs/002-color-palette-management/quickstart.md`
- [X] T061 Add dedicated integration regression test ensuring selected palette and mode persist across logical pixelation changes in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/palette-retention-on-pixelation-change.test.tsx`
- [X] T062 Add automated performance budget assertions for palette generation (<2s at supported workload) and mode/palette interaction updates (<500ms) in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/palette-performance-budgets.test.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** -> starts immediately
- **Phase 2: Foundational** -> depends on Setup; blocks all user stories
- **Phase 3 (US1)** -> depends on Foundational; defines MVP
- **Phase 4 (US2)** -> depends on Foundational and can proceed after US1 contracts stabilize
- **Phase 5 (US3)** -> depends on Foundational and color-processing interfaces from US1
- **Phase 6 (US4)** -> depends on Foundational and palette models from US2
- **Phase 7: Polish** -> depends on completion of desired user stories

### User Story Dependencies

- **US1 (P1)**: independent after Foundational and delivers initial value
- **US2 (P2)**: builds on palette selection from US1 but remains independently testable
- **US3 (P2)**: builds on mapping pipeline from US1 and remains independently testable
- **US4 (P3)**: builds on custom palette behavior from US2 and remains independently testable

### Within Each User Story

- Write story tests before or alongside implementation work
- Domain logic before state/action orchestration
- State/actions before UI binding
- UI binding before end-to-end story validation

### Parallel Opportunities

- Setup tasks marked `[P]`
- Foundational model tasks T007-T012 in parallel
- US1 domain tasks T021-T023 in parallel
- US2 domain tasks T031-T033 in parallel
- US3 domain tasks T041-T043 in parallel
- US4 infrastructure tasks T050-T051 in parallel

---

## Parallel Example: User Story 1

```bash
Task: "T018 [US1] Add unit tests for deterministic palette quantization and 2-256 bounds in tests/unit/palettes/palette-generation.test.ts"
Task: "T019 [US1] Add unit tests for strict mode palette-membership guarantees in tests/unit/color-processing/strict-mapping.test.ts"

Task: "T021 [US1] Implement deterministic quantization-based palette extraction service in src/domain/palettes/generate-palette-from-grid.ts"
Task: "T022 [US1] Implement strict nearest-palette mapping service on logical pixels in src/domain/color-processing/apply-strict-palette.ts"
Task: "T023 [US1] Implement processed-grid pipeline assembly for strict mode in src/domain/color-processing/build-processed-grid.ts"
```

---

## Parallel Example: User Story 2

```bash
Task: "T028 [US2] Add unit tests for predefined catalog immutability and duplication behavior in tests/unit/palettes/predefined-catalog.test.ts"
Task: "T029 [US2] Add unit tests for custom palette edit validations and color normalization in tests/unit/palettes/custom-palette-editing.test.ts"

Task: "T031 [US2] Implement curated predefined palette catalog data in src/domain/palettes/predefined-palettes.ts"
Task: "T032 [US2] Implement palette duplication and custom creation services in src/domain/palettes/create-custom-palette.ts"
Task: "T033 [US2] Implement custom palette color add/remove/edit/rename services in src/domain/palettes/edit-custom-palette.ts"
```

---

## Parallel Example: User Story 4

```bash
Task: "T047 [US4] Add unit tests for palette JSON schema validation and round-trip value preservation in tests/unit/palettes/palette-file-format.test.ts"
Task: "T048 [US4] Add unit tests for local palette persistence CRUD behavior in tests/unit/palettes/palette-persistence.test.ts"

Task: "T050 [US4] Implement IndexedDB palette repository with fallback handling in src/shared/utils/palette-storage.ts"
Task: "T051 [US4] Implement palette JSON import/export and validation in src/shared/utils/palette-file.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational)
3. Complete Phase 3 (US1)
4. Validate strict palette generation/apply flow end-to-end

### Incremental Delivery

1. Deliver US1 for automatic generation + strict apply
2. Add US2 for predefined/custom editing
3. Add US3 for soft grading + dithering
4. Add US4 for persistence + import/export
5. Finalize with Phase 7 regression/performance/documentation checks

### Parallel Team Strategy

1. One engineer focuses domain models/contracts while another prepares tests and UI shells.
2. After Foundational phase, engineers split by story lanes (US2, US3, US4) against stabilized interfaces.

---

## Notes

- Every task line follows `- [ ] T### [P?] [US#?] Description with file path` format.
- Story labels are used only in user story phases.
- Tests are intentionally included because the spec requires critical behavior testing.
- Suggested MVP scope is through completion of US1 after Setup and Foundational phases.
