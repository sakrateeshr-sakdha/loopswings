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

// Hosted builds must use the default `.next`. A platform like Vercel reads
// next.config.mjs in its own process to find the output directory, where this
// variable isn't set — pointing the build elsewhere would leave it looking in
// an empty `.next`. The dev/production split only matters on a local machine
// where both run at once.
const isHostedBuild = Boolean(
  process.env.VERCEL || process.env.CI || process.env.NETLIFY || process.env.RENDER,
);

const env = { ...process.env };
if (isHostedBuild) {
  delete env.NEXT_DIST_DIR;
} else {
  env.NEXT_DIST_DIR = ".next-build";
}

const child = spawn(process.execPath, [nextCli, command, ...process.argv.slice(3)], {
  stdio: "inherit",
  env,
});

child.on("exit", (code) => process.exit(code ?? 0));
