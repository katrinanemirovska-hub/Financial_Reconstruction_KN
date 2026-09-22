import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(projectRoot, "dist");
const outputRoot = join(projectRoot, ".vercel", "output");
const functionRoot = join(outputRoot, "functions", "ssr.func");

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(functionRoot, { recursive: true });

// Vinext emits client assets and a Fetch-compatible SSR server separately.
// Vercel's Build Output API serves the former statically and invokes the latter
// for every non-static request.
cpSync(join(distRoot, "client"), join(outputRoot, "static"), { recursive: true });
cpSync(join(distRoot, "server"), join(functionRoot, "server"), { recursive: true });

writeFileSync(
  join(functionRoot, "server", "package.json"),
  '{"type":"module"}\n',
);

writeFileSync(
  join(functionRoot, "index.cjs"),
  `const { Readable } = require("node:stream");

const server = import("./server/index.js");

module.exports = async function handler(req, res) {
  const host = req.headers.host || "localhost";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const request = new Request(new URL(req.url, protocol + "://" + host), {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : Readable.toWeb(req),
    duplex: "half",
  });
  const response = await (await server).default.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  if (!response.body) return res.end();
  Readable.fromWeb(response.body).pipe(res);
};
`,
);

writeFileSync(
  join(functionRoot, ".vc-config.json"),
  `${JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "index.cjs",
      launcherType: "Nodejs",
      shouldAddHelpers: true,
      shouldAddSourcemapSupport: true,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(outputRoot, "config.json"),
  `${JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/ssr" },
      ],
    },
    null,
    2,
  )}\n`,
);
