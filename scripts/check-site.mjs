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
console.log(
  `PASS: ${files.length} pre-rendered pages, ${localLinks} local references, unique IDs, project paths, metadata, and ${Math.round(jsBytes / 1024)} KiB JS within budget.`,
);
console.log(
  "Scope: website integrity only. Document-processing and migration behavior NOT TESTED.",
);
