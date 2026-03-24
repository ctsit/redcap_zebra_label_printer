# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run build     # Bundle JS with webpack (outputs generateTubeLabels.bundle.js)
```

There are no lint or test commands configured.

After editing `js/generateTubeLabels.js`, always run `npm run build` to regenerate the bundle.

## REDCap External Module Framework

Before making any changes to this module, fetch and review https://github.com/vanderbilt-redcap/external-module-framework-docs to ensure conformance with the framework.


This module conforms to the REDCap External Module Framework. Full documentation is at:
**https://github.com/vanderbilt-redcap/external-module-framework-docs**

Key conventions from that framework used here:

- **Hooks** — Methods on the module class whose names match REDCap hook names (e.g., `redcap_data_entry_form`) are called automatically by REDCap at the appropriate point.
- **AJAX** — JS calls `module.ajax('action', payload)` on the JS Module Object; PHP handles it in `redcap_module_ajax($action, $payload)`. Actions must be declared in `config.json` under `auth-ajax-actions` or `no-auth-ajax-actions`.
- **Settings** — Retrieved via `$this->getProjectSetting('key')` / `$this->getSystemSetting('key')`; defined in `config.json`.
- **Unit testing** — PHPUnit tests extend `\ExternalModules\ModuleBaseTest`, live in a `tests/` directory, and require a path to `redcap_connect.php`. Settings are stored in-memory during tests.
- **`config.json`** — Declares module metadata, settings, action tags, AJAX actions, and framework version.

## Architecture

This is a **REDCap External Module** (framework v15) that generates ZPL-format biospecimen tube labels and sends them to Zebra printers via the [Zebra Browser Print](https://www.zebra.com/us/en/software/barcode-printer-software/browser-print.html) desktop app.

### Key files

- **`ExternalModule.php`** — Main module class. Detects page context (DataEntry, Survey), finds fields tagged with `@ZEBRA-LABEL-PRINTER`, handles three AJAX endpoints (`generateTubeLabels`, `getDataForPtidDropdown`, `getDataForVisitDropdown`), and contains all barcode encoding logic.
- **`js/generateTubeLabels.js`** — Source JS (compiled to `generateTubeLabels.bundle.js`). Manages UI state, calls AJAX endpoints, builds ZPL strings via `generateZplLabel()`, and drives printing via `zebra-browser-print-wrapper-v2`.
- **`config.json`** — Module metadata, per-project settings (`input_base`, `output_base`, `ptid_field`, `visit_num_field`), action tag declaration, and AJAX endpoint whitelist.
- **`lang/English.ini`** — All user-visible strings (i18n).

### Label generation flow

1. User clicks "Generate Labels" on a REDCap data-entry form field tagged with `@ZEBRA-LABEL-PRINTER`.
2. JS calls `generateTubeLabels` AJAX endpoint → PHP `generateLabelArray()` returns an array of 23 label objects (Blood ×3, Buffy Coat ×5, PAXgene ×5, Plasma ×5, Serum ×5).
3. Each label's barcode is encoded: patient ID + visit number converted from `input_base` → `output_base`, zero-padded, concatenated with sample type/number, then a Luhn mod-N checksum appended.
4. JS builds ZPL for each label (380×192 px, barcode + QR code) and sends the full print job to the Zebra Browser Print app.

### Barcode encoding (PHP)

- `encodeUnique(string $value, int $inputBase, int $outputBase, int $padding)` — Base conversion with zero-padding.
- `generateLuhnChecksum(string $input, int $base)` — Luhn mod-N checksum.
- Both are called from `generateLabelArray()` to build the final barcode string.

### Module installation path

The directory must be named `redcap_zebra_label_printer_v<VERSION>` under `<redcap-root>/modules/`. The version comes from the `VERSION` file and must match `config.json`.
