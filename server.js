/* eslint-disable @typescript-eslint/no-require-imports */

const { spawn } = require("node:child_process");
const path = require("node:path");

const port = process.env.PORT || "3000";

// Vi startar Next.js med en liten Node-fil så att vi kan logga serverns start.
const nextCommand = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

console.info(`INFO: Studyflow server starting on port ${port}`);

const nextServer = spawn(
  nextCommand,
  ["start", "--hostname", "0.0.0.0", "--port", port],
  {
    stdio: "inherit",
    env: process.env,
  },
);

nextServer.on("spawn", () => {
  console.info("INFO: Studyflow production server started");
});

nextServer.on("error", (error) => {
  console.error("ERROR: Could not start the Studyflow server", error);
  process.exitCode = 1;
});

nextServer.on("exit", (code, signal) => {
  if (code !== 0) {
    console.error(
      `ERROR: Studyflow server stopped unexpectedly. Code: ${code}, Signal: ${signal}`,
    );
  }

  process.exitCode = code ?? 1;
});

function shutdown(signal) {
  // Render skickar SIGTERM när containern ska stängas ner.
  console.info(`INFO: Received ${signal}. Shutting down Studyflow.`);
  nextServer.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
