/**
 * AI Gateway — Text Generation with Vercel AI SDK
 *
 * Uses streamText with the Vercel AI Gateway to stream a response
 * from openai/gpt-5.4 and logs full token usage on completion.
 *
 * Run: npx tsx index.ts
 */

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import * as dotenv from "dotenv";

// Load .env.local (Vercel convention — takes precedence over .env)
dotenv.config({ path: ".env.local" });

const apiKey = process.env.AI_GATEWAY_API_KEY;

if (!apiKey) {
  console.error(
    "❌  AI_GATEWAY_API_KEY is not set.\n" +
      "    Open AI-GATEWAY/.env.local and replace the placeholder with your real key.\n" +
      "    Get it from: https://vercel.com/dashboard/ai-gateway"
  );
  process.exit(1);
}


const gateway = createOpenAI({
 
  baseURL: "https://ai-gateway.vercel.sh/v1",
  apiKey,
});

const MODEL = "minimax/minimax-m3";
const PROMPT =
  "You are a luxury fashion AI assistant for DressMe, a Kenya-based fashion store. " +
  "In 3 concise sentences, describe what makes a perfect capsule wardrobe for a modern professional.";

// ── Stream the response ───────────────────────────────────────────────────────
console.log(`\n🚀  Connecting to Vercel AI Gateway → ${MODEL}\n`);
console.log("📝  Prompt:", PROMPT, "\n");
console.log("─".repeat(60));
console.log("💬  Response:\n");

try {
  const result = streamText({
    model: gateway(MODEL),
    prompt: PROMPT,
    temperature: 0.7,
    maxTokens: 512,
    // Capture stream-level errors before they bubble as NoOutputGeneratedError
    onError: ({ error }) => {
      const err = error as any;
      const msg: string =
        err?.data?.error?.message ??
        err?.message ??
        String(error);
      console.error("\n\n❌  Gateway error:", msg);
      if (err?.statusCode === 401) {
        console.error(
          "\n👉  Fix: open AI-GATEWAY/.env.local and replace the placeholder with your real key.\n" +
          "    Get it at: https://vercel.com/dashboard/ai-gateway\n"
        );
      }
    },
  });

  // Stream tokens to stdout as they arrive
  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }

  // ── Log token usage once the stream is complete ─────────────────────────
  const usage = await result.usage;

  console.log("\n\n" + "─".repeat(60));
  console.log("📊  Token Usage:");
  console.log(`    Prompt tokens  : ${usage.promptTokens}`);
  console.log(`    Completion     : ${usage.completionTokens}`);
  console.log(`    Total          : ${usage.totalTokens}`);
  console.log("─".repeat(60));
  console.log("✅  Done.\n");
} catch (error: unknown) {
  // Surface the real cause — not the secondary NoOutputGeneratedError
  const err = error as any;
  const cause = err?.cause ?? err;
  const msg: string =
    cause?.data?.error?.message ??
    cause?.message ??
    err?.message ??
    String(error);

  console.error("\n\n❌  Error:", msg);

  if (cause?.statusCode === 401 || err?.statusCode === 401) {
    console.error(
      "\n👉  Fix: open AI-GATEWAY/.env.local and paste your real API key.\n" +
      "    Get it at: https://vercel.com/dashboard/ai-gateway\n"
    );
    process.exit(1);
  }

  if (cause?.statusCode === 429) {
    console.error("\n👉  Rate limit hit — wait a moment and try again.\n");
    process.exit(1);
  }

  process.exit(1);
}
