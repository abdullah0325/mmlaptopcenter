import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// Keep the platform-facing `npm run build` command dedicated to OpenNext.
// OpenNext uses this command internally to build the underlying Next.js app,
// avoiding a recursive call back into itself.
config.buildCommand = "npm run build:next";

export default config;
