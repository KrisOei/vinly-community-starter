#!/usr/bin/env tsx
/**
 * Vinly Community Config Submission Script
 *
 * Validates, serializes, and packages your community config for submission.
 * The output is a clean JSON payload with no code, no functions, no secrets.
 *
 * Usage: npm run submit
 */

import { CommunityConfigSchema } from "../schema";
import config from "../community.config";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, ".submission");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

console.log(`\n${BOLD}${CYAN}  Vinly Community Submission${RESET}\n`);
console.log(`${CYAN}─────────────────────────────────────────────${RESET}\n`);

// ── Step 1: Run Validation ──────────────────────────────────────────────────

console.log(`${BOLD}Step 1: Validating config...${RESET}\n`);

const result = CommunityConfigSchema.safeParse(config);

if (!result.success) {
  console.log(`${RED}Config validation failed. Run 'npm run validate' for details.${RESET}\n`);
  process.exit(1);
}

console.log(`${GREEN}  ✓ Config is valid${RESET}\n`);

// ── Step 2: Serialize to clean JSON ─────────────────────────────────────────

console.log(`${BOLD}Step 2: Serializing config...${RESET}\n`);

// Use Zod's parsed output — this strips any extra fields and ensures type safety
const cleanConfig = result.data;

// Convert to JSON (this removes functions, undefined values, and non-serializable data)
const jsonPayload = JSON.stringify(cleanConfig, null, 2);

// Verify the JSON is parseable and clean
try {
  const reparsed = JSON.parse(jsonPayload);
  const revalidation = CommunityConfigSchema.safeParse(reparsed);
  if (!revalidation.success) {
    throw new Error("Re-validation failed after serialization");
  }
} catch (err) {
  console.log(`${RED}  ✗ Serialization integrity check failed: ${err}${RESET}\n`);
  process.exit(1);
}

console.log(`${GREEN}  ✓ Serialized to clean JSON (${jsonPayload.length} bytes)${RESET}\n`);

// ── Step 3: Write submission package ────────────────────────────────────────

console.log(`${BOLD}Step 3: Creating submission package...${RESET}\n`);

// Clean output dir
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Write the config
fs.writeFileSync(path.join(OUTPUT_DIR, "community.config.json"), jsonPayload);

// Write metadata
const metadata = {
  submittedAt: new Date().toISOString(),
  schemaVersion: cleanConfig.version,
  communityName: cleanConfig.name,
  abbreviation: cleanConfig.abbreviation,
  configHash: simpleHash(jsonPayload),
  generatorVersion: "1.0.0",
};
fs.writeFileSync(
  path.join(OUTPUT_DIR, "metadata.json"),
  JSON.stringify(metadata, null, 2)
);

console.log(`${GREEN}  ✓ Submission package created at .submission/${RESET}\n`);

// ── Step 4: Instructions ────────────────────────────────────────────────────

console.log(`${CYAN}─────────────────────────────────────────────${RESET}`);
console.log(`
${BOLD}Your community config is ready!${RESET}

${BOLD}To submit via Pull Request:${RESET}
  1. Fork https://github.com/vinly-co/vinly-community-submissions
  2. Copy ${BOLD}.submission/community.config.json${RESET} to the fork
  3. Open a PR with title: "Community: ${cleanConfig.name}"
  4. Our team will review and get back to you within 48 hours

${BOLD}To submit via the Vinly intake API:${RESET}
  curl -X POST https://api.vinly.co/v1/community/submit \\
    -H "Content-Type: application/json" \\
    -d @.submission/community.config.json

${BOLD}Questions?${RESET} Reach out at communities@vinly.co
`);

// ── Helpers ─────────────────────────────────────────────────────────────────

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}
