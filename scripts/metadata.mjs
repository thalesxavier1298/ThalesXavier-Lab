import fs from "node:fs";
import { config } from "../src/config.js";
import { projects } from "../src/data.js";
if (config.siteUrl) {
  const origin = new URL(config.siteUrl);
  if (!["http:", "https:"].includes(origin.protocol))
    throw new Error("siteUrl must use https:// or http://");
  const routes = [
    "/",
    "/about",
    "/education",
    "/experience",
    "/skills",
    "/projects",
    "/contact",
    ...projects.map((p) => "/projects/" + p.id),
  ];
  const escape = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  fs.writeFileSync(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `\n<url><loc>${escape(new URL(route, origin).href)}</loc></url>`).join("")}\n</urlset>\n`,
  );
  fs.writeFileSync(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", origin).href}\n`,
  );
  console.log("Generated sitemap for the configured site origin.");
} else {
  console.log(
    "Sitemap deferred until config.siteUrl contains the real deployment origin.",
  );
}
