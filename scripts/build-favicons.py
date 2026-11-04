#!/usr/bin/env python3
"""Regenerate every favicon / app-icon export from the approved White Agate artwork.

Developer tool only (needs Pillow + NumPy; NOT a website dependency, NOT run in CI).
Inputs : site/public/brand/agate/source/baldeaglelab-whiteagate-v{1..4}.png  (approved, unmodified)
         site/public/brand/v1/baldeaglelab-monochrome-blue-v1.png            (approved primary logo)
Outputs: site/public/brand/agate/v{1..4}/*           per-variant exports
         site/public/{favicon.ico,...,site.webmanifest}   Version 1 = published default
         site/public/brand/logo/*                    web sizes of the blue logo
         site/public/downloads/BaldEagleLab_WhiteAgate_Favicons.zip
         site/public/brand/agate/manifest.json       sizes + SHA-256 of every export
Run:  python3 scripts/build-favicons.py
"""
import hashlib, json, shutil, zipfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "site" / "public"
AGATE = PUB / "brand" / "agate"
SRC = AGATE / "source"
DEFAULT = 1
VARIANTS = {
    1: ("Pearl White", "Warm pearl-white agate with soft cream striations. DEFAULT."),
    2: ("Slate Vein", "Cool white agate with grey-black veining and dendritic fern marks."),
    3: ("Silver Vein", "Blue-white agate with metallic silver veins; the eagle shows faint black marbling."),
    4: ("Warm Sand", "Cream and sand-brown banded agate."),
}
EXPORTS = [  # name, size, kind
    ("favicon-16x16.png", 16, "tile"),
    ("favicon-32x32.png", 32, "tile"),
    ("apple-touch-icon.png", 180, "square"),
    ("icon-192.png", 192, "tile"),
    ("icon-512.png", 512, "tile"),
    ("icon-maskable-512.png", 512, "maskable"),
]
SAFE_INSET = 0.06      # fraction trimmed from each tile edge to drop rounded corners
MASKABLE_CONTENT = 0.72  # eagle square occupies this share of a maskable canvas


def tile_and_alpha(path):
    """Return (RGB np array of the tile square, alpha np array) with the black outside removed."""
    im = Image.open(path).convert("RGB")
    lum = np.asarray(im.convert("L"))
    cand = lum <= 24
    h, w = cand.shape
    outside = np.zeros_like(cand)
    stack = [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]
    for p in stack:
        outside[p] = True
    while stack:  # flood from the four corners through near-black pixels only
        y, x = stack.pop()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not outside[ny, nx]:
                outside[ny, nx] = True
                stack.append((ny, nx))
    alpha = Image.fromarray(np.where(outside, 0, 255).astype("uint8"))
    alpha = alpha.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    a = np.asarray(alpha)
    ys, xs = np.where(a > 200)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    return im, alpha, box


def crop_square(im, box, inset=0.0):
    x0, y0, x1, y1 = box
    s = min(x1 - x0, y1 - y0)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    half = s / 2 * (1 - 2 * inset)
    return (int(cx - half), int(cy - half), int(cx + half), int(cy + half))


def safe_box(alpha, box):
    """Smallest inset (>= SAFE_INSET) whose four corners lie fully inside the rounded tile."""
    a = np.asarray(alpha)
    inset = SAFE_INSET
    while inset < 0.2:
        x0, y0, x1, y1 = crop_square(None, box, inset)
        k = 6
        if all(a[ys, xs].min() == 255 for ys, xs in (
                (slice(y0, y0 + k), slice(x0, x0 + k)), (slice(y0, y0 + k), slice(x1 - k, x1)),
                (slice(y1 - k, y1), slice(x0, x0 + k)), (slice(y1 - k, y1), slice(x1 - k, x1)))):
            return (x0, y0, x1, y1)
        inset += 0.005
    raise SystemExit("could not find a corner-free inset")


def sharpen(img, size):
    if size <= 48:
        return img.filter(ImageFilter.UnsharpMask(radius=0.6, percent=60, threshold=2))
    return img


def make(path, name, size, kind, im, alpha, box):
    if kind == "tile":  # rounded tile, transparent corners
        b = crop_square(im, box)
        rgba = im.copy()
        rgba.putalpha(alpha)
        out = rgba.crop(b).resize((size, size), Image.LANCZOS)
        out = sharpen(out, size)
    elif kind == "square":  # opaque full-bleed square (iOS masks it itself)
        out = im.crop(safe_box(alpha, box)).resize((size, size), Image.LANCZOS).convert("RGB")
    else:  # maskable: opaque; eagle kept inside the safe zone, padding is a smoothed agate wash
        sq = im.crop(safe_box(alpha, box)).convert("RGB")
        canvas = int(round(size / 1))
        inner = int(round(size * MASKABLE_CONTENT))
        small = sq.resize((256, 256), Image.LANCZOS).filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(10))
        out = small.resize((canvas, canvas), Image.LANCZOS)  # dark eagle shapes removed, texture smoothed
        off = (canvas - inner) // 2
        out.paste(sq.resize((inner, inner), Image.LANCZOS), (off, off))
    out.save(path, optimize=True)
    return out


def build_variant(n):
    src = SRC / f"baldeaglelab-whiteagate-v{n}.png"
    im, alpha, box = tile_and_alpha(src)
    d = AGATE / f"v{n}"
    if d.exists():
        shutil.rmtree(d)
    d.mkdir(parents=True)
    made = {}
    for name, size, kind in EXPORTS:
        made[name] = make(d / name, name, size, kind, im, alpha, box)
    big = make(d / "_ico_src.png", "", 256, "tile", im, alpha, box)
    big.save(d / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    (d / "_ico_src.png").unlink()
    return box


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


GUIDE = """# Bald Eagle Lab · White Agate favicon sets

Four approved White Agate variants of the black monochrome eagle. **Version 1 (Pearl White) is the
published default** for browser tabs and mobile home-screen icons. The other three are complete,
swappable alternatives; nothing rotates automatically.

| # | Name | Folder | Status |
|---|------|--------|--------|
{rows}

## What is in each folder

| File | Size | Use |
|------|------|-----|
| `favicon.ico` | 16, 32, 48 px | Legacy browsers and `/favicon.ico` requests |
| `favicon-16x16.png` | 16x16 | Browser tab (standard density) |
| `favicon-32x32.png` | 32x32 | Browser tab (high density), bookmarks |
| `apple-touch-icon.png` | 180x180 | iOS/iPadOS home screen. Opaque, full-bleed; iOS applies its own rounded mask |
| `icon-192.png` | 192x192 | Web app manifest (Android home screen) |
| `icon-512.png` | 512x512 | Web app manifest (splash / install) |
| `icon-maskable-512.png` | 512x512 | Web app manifest, `purpose: maskable`. Eagle kept inside the 80% safe zone so circular and squircle crops do not clip it |

The 16/32 px, 192/512 px and `favicon.ico` files keep the rounded agate tile with transparent corners.

## Use a variant on a site

Copy a variant's files to the site root (or any folder), then in `<head>`:

```html
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" href="favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
```

Keep paths relative. Bald Eagle Lab is served from `/baldeaglelab/`, so a leading `/` would break them.
`site.webmanifest` in this ZIP is ready to use as written.

To switch the live site to another variant, run `python3 scripts/build-favicons.py` after changing
`DEFAULT` in that script (or copy the chosen folder's files over the ones in `site/public/`).

## Source artwork

Approved originals (1254x1254, unmodified) live in the repository at
`site/public/brand/agate/source/baldeaglelab-whiteagate-v{{1..4}}.png`. Exports are raster derivatives; they are not
vector masters. At 16 px the eagle reads as a silhouette (head, folder and scaffold merge); the detail is
intended for 32 px and above.

Licensed with the rest of the repository (MPL-2.0).
"""

ICON_LINKS = """<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" href="favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
"""


def webmanifest():
    return json.dumps({
        "name": "Bald Eagle Lab",
        "short_name": "Bald Eagle Lab",
        "description": "Independent evidence for document systems.",
        "start_url": "./",
        "scope": "./",
        "display": "browser",
        "background_color": "#ffffff",
        "theme_color": "#002868",
        "icons": [
            {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }, indent=2) + "\n"


def main():
    boxes = {n: build_variant(n) for n in VARIANTS}

    # Version 1 is the published default at the site root.
    files = ["favicon.ico"] + [e[0] for e in EXPORTS]
    for f in files:
        shutil.copyfile(AGATE / f"v{DEFAULT}" / f, PUB / f)
    (PUB / "site.webmanifest").write_text(webmanifest())

    # Blue monochrome logo, web sizes.
    logo_dir = PUB / "brand" / "logo"
    logo_dir.mkdir(parents=True, exist_ok=True)
    blue = Image.open(PUB / "brand" / "v1" / "baldeaglelab-monochrome-blue-v1.png").convert("RGB")
    # The source's "white" is slightly off-white (visible as a box on a pure-white page): lift 200..245 to 255.
    lut = [v if v <= 200 else min(255, round(200 + (v - 200) * 55 / 45)) for v in range(256)]
    blue = blue.point(lut * 3)
    for s in (128, 512):
        blue.resize((s, s), Image.LANCZOS).save(logo_dir / f"baldeaglelab-logo-blue-{s}.png", optimize=True)

    # Download ZIP (deterministic).
    zpath = PUB / "downloads" / "BaldEagleLab_WhiteAgate_Favicons.zip"
    zpath.parent.mkdir(parents=True, exist_ok=True)
    folders = {n: f"v{n}-{VARIANTS[n][0].lower().replace(' ', '-')}{'-DEFAULT' if n == DEFAULT else ''}" for n in VARIANTS}
    rows = "\n".join(
        f"| {n} | {name} | `{folders[n]}/` | {'**Default** (published)' if n == DEFAULT else 'Alternative'}: {desc} |"
        for n, (name, desc) in VARIANTS.items())
    entries = {"README.md": GUIDE.format(rows=rows), "site.webmanifest": webmanifest(), "head-snippet.html": ICON_LINKS}
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        def add(arc, data):
            zi = zipfile.ZipInfo(arc, (2026, 11, 4, 0, 0, 0))
            zi.compress_type = zipfile.ZIP_DEFLATED
            zi.external_attr = 0o644 << 16
            z.writestr(zi, data)
        for arc in sorted(entries):
            add(arc, entries[arc])
        for n in VARIANTS:
            for f in sorted(files):
                add(f"{folders[n]}/{f}", (AGATE / f"v{n}" / f).read_bytes())

    # Manifest of everything produced.
    man = {"edition": "White Agate", "default_variant": DEFAULT, "variants": {}}
    for n, (name, desc) in VARIANTS.items():
        d = AGATE / f"v{n}"
        man["variants"][str(n)] = {
            "name": name, "description": desc, "default": n == DEFAULT,
            "source": {"file": f"source/baldeaglelab-whiteagate-v{n}.png", "sha256": sha(SRC / f"baldeaglelab-whiteagate-v{n}.png")},
            "tile_bbox_in_source": list(map(int, boxes[n])),
            "exports": {f: {"sha256": sha(d / f), "bytes": (d / f).stat().st_size} for f in sorted(files)},
        }
    man["download_zip"] = {"file": "../../downloads/BaldEagleLab_WhiteAgate_Favicons.zip", "sha256": sha(zpath), "bytes": zpath.stat().st_size}
    (AGATE / "manifest.json").write_text(json.dumps(man, indent=2) + "\n")
    print("built", {n: boxes[n] for n in boxes}, "zip", zpath.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
