import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("out");
const prefix = "/ai-costume-gallery";
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };

createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (!path.startsWith(`${prefix}/`)) throw new Error("Not found");
    const file = resolve(root, `.${path.slice(prefix.length)}${path.endsWith("/") ? "index.html" : ""}`);
    if (!file.startsWith(`${root}${sep}`)) throw new Error("Not found");
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(43719, "127.0.0.1");
