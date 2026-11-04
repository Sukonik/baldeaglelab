# BASE3 UI format

BASE3 is Bald Eagle Lab's project design format. It combines a foundation of semantic content, accessible behavior through Base UI, and an editorial visual structure inspired by GoldBrief. It is not an upstream framework or a claim that GoldBrief already uses Base UI.

## Stack and scope

- React and React DOM render and hydrate the interface.
- Base UI `Menu` handles the desktop framework chooser; `Dialog` handles the modal mobile menu.
- Vite builds local JavaScript and CSS. The build script pre-renders nine independent HTML pages.
- CSS Grid, Flexbox, and media queries handle layout. No CSS framework, client router, document backend, or account system is added.

## Palette

| Name           | Value     | Role                                                  |
| -------------- | --------- | ----------------------------------------------------- |
| Old Glory Blue | `#002868` | Primary identity, headings, buttons, evidence section |
| White          | `#FFFFFF` | Primary canvas                                        |
| Old Glory Red  | `#B22234` | Small rules and markers                               |
| Signal Blue    | `#165DDE` | Interactive emphasis and focus                        |
| Pale Blue      | `#F2F6FC` | Supporting surfaces                                   |
| Reading Ink    | `#102B50` | Body text                                             |
| Muted Ink      | `#526580` | Secondary text                                        |

Use white and blue for the majority of surfaces. Red stays an accent. Do not use color alone to communicate a verdict; pair it with explicit text. Current evidence labels are descriptive, not certification badges.

## Typography and identity

Outfit carries masthead and headlines; Inter carries body and interface text. Google Fonts uses `display=swap`; Helvetica and Arial are local fallbacks. The live wordmark remains text. A compact provisional folded-wing vector in `site/public/eagle.svg` provides the favicon and header mark. The owner-approved V1 eagle-holding-a-folder directions and separate raster editions are documented in [BRAND.md](BRAND.md), including a navy monochrome preview. See [LOGO_BRIEF.md](LOGO_BRIEF.md) for the design direction. It is a project identity, not a government seal or official affiliation.

## Layer contract

`tokens` → `base` → `components` → `responsive` → `baldeaglelab`

Tokens hold palette, type families, spacing boundaries, and widths. Base establishes reset and semantic defaults. Components define reusable interface pieces. Responsive handles breakpoint changes. The final product layer contains Bald Eagle Lab-specific refinements.

## Navigation

Desktop: Overview, Frameworks, Stage ledger, BASE3 UI, Roadmap, GitHub. Frameworks opens a Base UI Menu containing five dedicated guide links.

Below 1101px: one Menu button opens a modal Base UI Dialog. It contains every page and a GitHub link. The primitive owns Escape dismissal, focus containment, and return to the trigger. Footer navigation exposes all guides independently of JavaScript.

## Responsive contract

| Width            | Layout                                                   |
| ---------------- | -------------------------------------------------------- |
| 1101px and above | Full navigation, split hero, guide sidebar               |
| 761–1100px       | Modal menu, compact split layouts                        |
| 381–760px        | Stacked hero, single-column guides, wrapped page anchors |
| Up to 380px      | Narrow-phone spacing and stacked input/output panels     |

No document-level overflow, clipped text, overlapping controls, or viewport-dependent hidden content. Use real page URLs and relative assets so GitHub Pages' `/baldeaglelab/` project path works on direct navigation and refresh.

## Accessibility and performance

Provide semantic landmarks, one h1 per page, descriptive links, visible focus, a skip link, and reduced-motion support. Keep primary controls at least 44px high. Core content is pre-rendered; no client fetch is needed to read a guide. Hydration adds menu behavior.

The website integrity script enforces a 400,000-byte JavaScript budget, static links and anchors, IDs, and metadata. Browser review remains necessary for overflow, keyboard use, focus return, and visual hierarchy. No formal accessibility certification is claimed.

## Sources

- [GoldBrief](https://github.com/Sukonik/goldbrief) and its [brand guide](https://github.com/Sukonik/goldbrief/blob/main/docs/BRAND.md): layout and typography reference.
- [Base UI](https://github.com/mui/base-ui): unstyled accessible React primitives.
- [Quick start](https://base-ui.com/react/overview/quick-start) and [Dialog](https://base-ui.com/react/components/dialog): implementation API reference.
