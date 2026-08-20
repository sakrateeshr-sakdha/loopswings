/**
 * Runs `next build` / `next start` against a separate output directory.
 *
 * Dev and production both default to `.next`, so building while `npm run dev`
 * is running leaves one process reading chunks the other has replaced — which
 * surfaces as "Cannot find module './996.js'" or a page with no CSS. Giving
 * production its own folder removes the collision entirely.
 *
 * Cross-platform on purpose: npm scripts can't set env vars inline on Windows.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const command = process.argv[2];
if (!["build", "start"].includes(command)) {
  console.error("Usage: node scripts/next-prod.mjs <build|start>");
  process.exit(1);
}

// Resolve Next's CLI and run it with this Node binary. Spawning `npx.cmd`
// instead would need a shell on Windows, which Node now refuses by default.
const require = createRequire(import.meta.url);
const nextCli = require.resolve("next/dist/bin/next");

const child = spawn(process.execPath, [nextCli, command, ...process.argv.slice(3)], {
  stdio: "inherit",
  env: { ...process.env, NEXT_DIST_DIR: ".next-build" },
});

child.on("exit", (code) => process.exit(code ?? 0));
