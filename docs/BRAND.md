# Bald Eagle Lab · V1 icon collection

The owner approved all four directions on the V1 comparison board on November 4, 2026 and requested separate GitHub assets plus a blue version of the monochrome design.

## Individual assets

| Variant | PNG | Background | Status |
| --- | --- | --- | --- |
| Natural | [Download](../site/public/brand/v1/baldeaglelab-natural-v1.png) | Transparent outside the emblem; white head and neck retained | Approved V1 direction |
| Old Glory | [Download](../site/public/brand/v1/baldeaglelab-old-glory-v1.png) | Transparent outside the emblem; white details retained | Approved V1 direction |
| Black Monochrome | [Download](../site/public/brand/v1/baldeaglelab-monochrome-black-v1.png) | Transparent outside the emblem; white details retained | Approved V1 direction |
| Reverse | [Download](../site/public/brand/v1/baldeaglelab-reverse-v1.png) | Navy square | Approved V1 direction |
| Blue Monochrome | [Download](../site/public/brand/v1/baldeaglelab-monochrome-blue-v1.png) | White square | Additional requested color preview |

Every file is standalone and has no comparison label. The [manifest](../site/public/brand/v1/manifest.json) records dimensions, alpha ranges, file sizes, and SHA-256 hashes. Public assets are copied into the Pages build under `brand/v1/`.

## Visual reference

![Approved V1 comparison board](../site/public/brand/v1/baldeaglelab-approved-board-v1.png)

The original board remains the authoritative approved visual reference. Standalone PNGs were generated from it through the built-in image tool; they are raster editions and may have small geometric differences. They are not exact cropped vector masters. No source reference photograph is included.

## Composition and color

- Upright eagle with a left-facing head and downward folded wings.
- One talon grips a document folder; the other rests on a straight industrial scaffold.
- Natural: white head/neck, yellow beak and feet, brown body, navy folder and scaffold.
- Old Glory: navy and white, with restrained red accents.
- Black Monochrome: black and white.
- Reverse: white emblem on navy, with a small red folder tab.
- Blue Monochrome: the black design translated to navy and white, without red, yellow, or brown.

Target brand tokens are Old Glory Blue `#002868`, White `#FFFFFF`, and Old Glory Red `#B22234`. Raster pixels include antialiasing and generated color variation; use the CSS tokens for exact interface colors. Production vector work should use solid fills without gradients or texture.

## Use and next refinement

Preserve aspect ratio, keep clear space, and retain the folder and scaffold. Use the reverse asset on dark surfaces. Do not erase white interior shapes when preparing transparency. Do not relabel the generated PNGs as SVG or claim they are production vector files.

## Primary logo and White Agate favicons (2026-11-04)

- **Primary logo:** the monochrome blue eagle above. The website header, README, and social preview use it (`site/public/brand/logo/`, 128 and 512 px).
- **Favicons:** four approved White Agate variants of the black monochrome eagle, stored unmodified in `site/public/brand/agate/source/` and exported per variant to `site/public/brand/agate/v1` to `v4`. Version 1 (Pearl White) is the published default; Versions 2 to 4 are Slate Vein, Silver Vein, and Warm Sand. See the [README](../README.md#-logos--favicons) and the downloadable ZIP.
- **Exports** per variant: `favicon.ico` (16/32/48), 16 and 32 px PNGs, 180 px Apple touch icon (opaque, full-bleed), 192 and 512 px icons, and a 512 px maskable icon. `site/public/brand/agate/manifest.json` records SHA-256 hashes.
- **Small sizes:** at 16 px the eagle is a silhouette; the folder and scaffold merge. Exact vector masters and simplified 16/24 px redraws remain future work.
