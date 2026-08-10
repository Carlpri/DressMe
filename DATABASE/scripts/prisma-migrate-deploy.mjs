import { execFileSync } from "node:child_process";

if (process.env.DATABASE_MIGRATION_APPROVED !== "true") {
  console.error("Refusing to run Prisma migrations. Set DATABASE_MIGRATION_APPROVED=true only after staging baseline validation.");
  process.exit(1);
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
execFileSync(npx, ["prisma", "migrate", "deploy"], { stdio: "inherit" });
