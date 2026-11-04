import { build, createServer } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pages } from "../site/src/data.mjs";
import { renderToString } from "react-dom/server";
import React from "react";

await build();
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const client = manifest["src/client.jsx"];
if (!client?.file || !client.css?.length)
  throw new Error("Missing site build assets");
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
try {
  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  for (const page of [
    {
      slug: "home",
      title: "Independent evidence for document systems",
      description:
        "Bald Eagle Lab: document analysis, verified migration, testing frameworks, and modular application design.",
    },
    ...pages,
  ]) {
    const file = page.slug === "home" ? "index.html" : `${page.slug}.html`;
    const canonical = `https://sukonik.github.io/baldeaglelab/${file === "index.html" ? "" : file}`;
    const body = renderToString(React.createElement(App, { page: page.slug }));
    await writeFile(
      `dist/${file}`,
      `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(page.title)} | Bald Eagle Lab</title><meta name="description" content="${escape(page.description)}"><meta name="theme-color" content="#002868"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escape(page.title)} | Bald Eagle Lab"><meta property="og:description" content="${escape(page.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><link rel="icon" href="eagle.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">${client.css.map((path) => `<link rel="stylesheet" href="${path}">`).join("")}<script type="module" src="${client.file}"></script><noscript><style>.mobile-nav,.nav-trigger{display:none}.desktop-nav{display:flex;flex-wrap:wrap;gap:12px;font-size:11px}.header-inner{height:auto;min-height:74px;flex-wrap:wrap;padding-block:15px}</style></noscript></head><body data-page="${page.slug}"><div id="root">${body}</div></body></html>`,
    );
  }
  await writeFile("dist/.nojekyll", "");
  await writeFile(
    "dist/robots.txt",
    "User-agent: *\nAllow: /\nSitemap: https://sukonik.github.io/baldeaglelab/sitemap.xml\n",
  );
  const urls = ["", ...pages.map((p) => `${p.slug}.html`)];
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>https://sukonik.github.io/baldeaglelab/${u}</loc></url>`).join("")}</urlset>`,
  );
  await mkdir("dist/releases", { recursive: true });
  await writeFile(
    "dist/releases/v0.1.0.json",
    JSON.stringify(
      {
        version: "0.1.0",
        date: "2026-11-04",
        scope: "Documentation website Build 1",
        harness_implemented: false,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Pre-rendered ${urls.length} pages. Core content is readable without JavaScript.`,
  );
} finally {
  await server.close();
}
