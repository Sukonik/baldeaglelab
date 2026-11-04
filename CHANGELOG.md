# Changelog

## UI/UX polish · 2026-11-04

- Raised every text size below 11.5 px (63 declarations): eyebrow labels and badges now start at 0.72 rem, small body and link text at 0.8 rem.
- Enlarged touch targets to at least 36 px (44 px on phones) for footer links, in-page guide chips and links, "Back to the lab", "View source", and the inline "See the build plan", "Read the integration boundary" and "Explore WindSwordAI" links.
- Balanced headline wrapping and improved paragraph line breaks; added print styles (hides navigation, shows link URLs) and a reduced-motion fallback.
- Added a `polish` CSS layer so these refinements do not need `!important` in the earlier layers.
- Audited all nine pages at 320, 390, 820 and 1280 px: no horizontal overflow, no unnamed controls, no images without alt attributes, no interactive element under 32 px.

## Branding update · 2026-11-04

- Adopted the approved monochrome blue eagle as the primary logo in the website header, README, and social preview image.
- Added the four approved White Agate favicon variants (unmodified sources plus exports) and published Version 1 as the default favicon and mobile home-screen icon.
- Added `favicon.ico`, 16x16 and 32x32 PNGs, a 180x180 Apple touch icon, 192x192, 512x512, and maskable 512x512 icons, and a web manifest with project-relative paths.
- Added `BaldEagleLab_WhiteAgate_Favicons.zip` with a guide, and the README "Logos & Favicons" section.
- Added `scripts/build-favicons.py` and website integrity checks for icon links, sizes, manifest, and the default.
- Removed the provisional folded-wing `eagle.svg`. Website version remains 0.1.0; no harness behavior changes.

## V1 brand asset collection · 2026-11-04

- Recorded owner approval of the Natural, Old Glory, Black Monochrome, and Reverse directions.
- Added five separately named, label-free PNG editions, including the requested Old Glory Blue monochrome preview.
- Preserved the original approved board, documented backgrounds and raster limitations, and recorded dimensions and SHA-256 hashes.
- Added a README gallery and brand asset guide. Website version remains 0.1.0; no layout or harness behavior changes.

## 0.1.0 · Website Build 1 · 2026-11-04

- Expanded the project README with mission, framework scope, evidence rules, application boundaries, synthetic-data policy, build roadmap, development instructions, and release history.
- Published an overview and eight dedicated guides: document analysis, verified migration, testing, model contracts, modular applications, stage ledger, BASE3 UI, and roadmap.
- Added the white-and-blue BASE3 identity with restrained Old Glory Red accents, a folded-wing mark, Outfit/Inter typography, and layered responsive CSS.
- Added React and Base UI desktop/mobile navigation with pre-rendered text and real page URLs.
- Added Vite production build, website integrity checks, a lockfile, and GitHub Pages Actions deployment of `dist/` only.
- Preserved MPL-2.0 and documented third-party components.

Scope: documentation website only. No verification harness, fixture generator, model runner, private adapter, installer, or document-processing certification ships with this version. Ledger fields remain draft proposals.
