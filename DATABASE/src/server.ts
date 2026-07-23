import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5000;
let server: ReturnType<typeof app.listen> | undefined;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    server = app.listen(PORT, () => {
      console.log(`DressMe API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down DressMe API.`);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    return;
  }

  await prisma.$disconnect();
  process.exit(0);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

startServer();
