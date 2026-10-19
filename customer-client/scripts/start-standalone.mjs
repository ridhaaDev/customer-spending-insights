// Serves the production build the same way the Docker image does: the standalone server plus
// the static assets and public folder copied beside it. PORT and HOSTNAME are read by server.js.
import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";

const standalone = ".next/standalone";
if (!existsSync(`${standalone}/server.js`)) {
  console.error("No standalone build found. Run `npm run build` first.");
  process.exit(1);
}
cpSync(".next/static", `${standalone}/.next/static`, { recursive: true });
if (existsSync("public")) cpSync("public", `${standalone}/public`, { recursive: true });

const server = spawn(process.execPath, [`${standalone}/server.js`], { stdio: "inherit", env: { HOSTNAME: "127.0.0.1", ...process.env } });
server.on("exit", (code) => process.exit(code ?? 0));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
