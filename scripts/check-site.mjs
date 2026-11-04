import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pages } from "../site/src/data.mjs";

const root = resolve("dist");
const files = ["index.html", ...pages.map((p) => `${p.slug}.html`)];
let localLinks = 0;
for (const file of files) {
  const html = await readFile(resolve(root, file), "utf8");
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: one h1`);
  assert(html.includes('<html lang="en">'), `${file}: language`);
  assert(html.includes('name="viewport"'), `${file}: viewport`);
  assert(html.includes('class="skip-link"'), `${file}: skip link`);
  assert(html.includes('id="main"'), `${file}: main landmark`);
  assert(
    html.includes('aria-label="Footer frameworks"'),
    `${file}: navigation without JS`,
  );
  assert(html.includes('rel="canonical"'), `${file}: canonical URL`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  const page = pages.find((p) => file === `${p.slug}.html`);
  if (page)
    assert(
      html.includes(page.summary.replaceAll("&", "&amp;")),
      `${file}: prerendered content`,
    );
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(value)) continue;
    assert(
      !value.startsWith("/"),
      `${file}: project-safe relative link ${value}`,
    );
    const [path, fragment] = value.split("#");
    const target = path
      ? resolve(dirname(resolve(root, file)), decodeURIComponent(path))
      : resolve(root, file);
    assert(target.startsWith(root + "/"), `${file}: outside build`);
    await access(target);
    if (fragment) {
      const text = await readFile(target, "utf8");
      assert(
        text.includes(`id="${fragment}"`),
        `${file}: missing anchor ${value}`,
      );
    }
    localLinks++;
  }
}
const assets = await readdir(resolve(root, "assets"));
let jsBytes = 0;
for (const f of assets.filter((f) => f.endsWith(".js")))
  jsBytes += (await readFile(resolve(root, "assets", f))).length;
assert(jsBytes < 400_000, `JS budget exceeded: ${jsBytes}`);
assert(
  (await readFile("dist/releases/v0.1.0.json", "utf8")).includes(
    '"harness_implemented": false',
  ),
);

// ---- Branding: primary logo, White Agate favicons, manifest, ZIP -------------
const pngSize = async (file) => {
  const b = await readFile(file);
  assert.equal(b.subarray(1, 4).toString(), "PNG", `${file}: PNG signature`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};
const same = async (a, b) =>
  assert.deepEqual(await readFile(a), await readFile(b), `${a} must equal ${b}`);
const iconSizes = {
  "favicon-16x16.png": 16,
  "favicon-32x32.png": 32,
  "apple-touch-icon.png": 180,
  "icon-192.png": 192,
  "icon-512.png": 512,
  "icon-maskable-512.png": 512,
};
for (const file of files) {
  const html = await readFile(resolve(root, file), "utf8");
  for (const needle of [
    'rel="icon" href="favicon.ico"',
    'href="favicon-32x32.png"',
    'href="favicon-16x16.png"',
    'rel="apple-touch-icon" href="apple-touch-icon.png"',
    'rel="manifest" href="site.webmanifest"',
    'src="brand/logo/baldeaglelab-logo-blue-128.png"',
  ])
    assert(html.includes(needle), `${file}: missing ${needle}`);
  assert(!html.includes("eagle.svg"), `${file}: stale eagle.svg reference`);
}
for (const [name, size] of Object.entries(iconSizes)) {
  assert.deepEqual(await pngSize(resolve(root, name)), [size, size], name);
  await same(resolve(root, name), resolve(root, "brand/agate/v1", name)); // default = Version 1
}
for (const v of [1, 2, 3, 4]) {
  for (const [name, size] of Object.entries(iconSizes))
    assert.deepEqual(await pngSize(resolve(root, `brand/agate/v${v}`, name)), [size, size], `v${v}/${name}`);
  assert.deepEqual(await pngSize(resolve(root, `brand/agate/source/baldeaglelab-whiteagate-v${v}.png`)), [1254, 1254]);
  const ico = await readFile(resolve(root, `brand/agate/v${v}/favicon.ico`));
  assert.equal(ico.readUInt16LE(2), 1, `v${v} ICO type`);
  const dims = [];
  for (let i = 0; i < ico.readUInt16LE(4); i++) dims.push(ico[6 + i * 16] || 256);
  assert.deepEqual(dims.sort((a, b) => a - b), [16, 32, 48], `v${v} ICO sizes`);
}
await same(resolve(root, "favicon.ico"), resolve(root, "brand/agate/v1/favicon.ico"));
assert.deepEqual(await pngSize(resolve(root, "brand/logo/baldeaglelab-logo-blue-512.png")), [512, 512]);
assert.deepEqual(await pngSize(resolve(root, "brand/logo/baldeaglelab-logo-blue-128.png")), [128, 128]);
const webmanifest = JSON.parse(await readFile(resolve(root, "site.webmanifest"), "utf8"));
assert.equal(webmanifest.start_url, "./");
assert.equal(webmanifest.scope, "./");
for (const icon of webmanifest.icons) {
  assert(!icon.src.startsWith("/") && !/^https?:/.test(icon.src), `manifest path ${icon.src} must be relative`);
  await access(resolve(root, icon.src));
}
assert.deepEqual(
  webmanifest.icons.map((i) => i.sizes).sort(),
  ["192x192", "512x512", "512x512"],
);
const zip = await readFile(resolve(root, "downloads/BaldEagleLab_WhiteAgate_Favicons.zip"));
assert.equal(zip.subarray(0, 2).toString(), "PK", "ZIP signature");
const zipText = zip.toString("latin1");
for (const entry of ["README.md", "site.webmanifest", "head-snippet.html"])
  assert(zipText.includes(entry), `ZIP missing ${entry}`);
for (const folder of ["v1-pearl-white-DEFAULT", "v2-slate-vein", "v3-silver-vein", "v4-warm-sand"])
  for (const f of ["favicon.ico", ...Object.keys(iconSizes)])
    assert(zipText.includes(`${folder}/${f}`), `ZIP missing ${folder}/${f}`);
const readme = await readFile("README.md", "utf8");
assert(readme.includes("## 🎨 Logos & Favicons"), "README section");
assert(readme.includes("site/public/brand/logo/baldeaglelab-logo-blue-512.png"), "README blue logo");
assert(readme.includes("BaldEagleLab_WhiteAgate_Favicons.zip"), "README ZIP link");
assert(readme.includes("Version 1 (default)"), "README labels Version 1 default");
for (const v of [1, 2, 3, 4]) assert(readme.includes(`brand/agate/v${v}/icon-192.png`), `README shows variant ${v}`);
assert(!readme.includes("eagle.svg"), "README stale eagle.svg");
console.log("PASS: branding (blue logo in header/README, 4 White Agate sets, default = Version 1, manifest, ZIP).");
console.log(
  `PASS: ${files.length} pre-rendered pages, ${localLinks} local references, unique IDs, project paths, metadata, and ${Math.round(jsBytes / 1024)} KiB JS within budget.`,
);
console.log(
  "Scope: website integrity only. Document-processing and migration behavior NOT TESTED.",
);
