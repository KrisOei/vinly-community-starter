#!/usr/bin/env tsx
/**
 * Vinly Community Config Validator
 *
 * Validates community.config.ts against the Zod schema and scans for
 * accidentally included secrets.
 *
 * Usage: npm run validate
 */

import { CommunityConfigSchema } from "../schema";
import config from "../community.config";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

// ANSI colors
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

function log(color: string, icon: string, msg: string) {
  console.log(`${color}${icon}${RESET} ${msg}`);
}

let hasErrors = false;
let hasWarnings = false;

console.log(`\n${BOLD}${CYAN}  Vinly Community Config Validator${RESET}\n`);
console.log(`${CYAN}─────────────────────────────────────────────${RESET}\n`);

// ── Step 1: Schema Validation ───────────────────────────────────────────────

console.log(`${BOLD}1. Schema Validation${RESET}\n`);

const result = CommunityConfigSchema.safeParse(config);

if (result.success) {
  log(GREEN, "  ✓", "Config schema is valid");
} else {
  hasErrors = true;
  log(RED, "  ✗", "Config schema validation failed:\n");
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    console.log(`    ${RED}→${RESET} ${BOLD}${path}${RESET}: ${issue.message}`);
  });
}

// ── Step 2: Secret Scanning ─────────────────────────────────────────────────

console.log(`\n${BOLD}2. Secret Scanning${RESET}\n`);

const SECRET_PATTERNS = [
  { name: "AWS Access Key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "Generic API Key", pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/i },
  { name: "Generic Secret", pattern: /(?:secret|password|token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{10,}['"]/i },
  { name: "Stripe Key", pattern: /sk_(?:live|test)_[a-zA-Z0-9]{20,}/ },
  { name: "Stripe Publishable Key", pattern: /pk_(?:live|test)_[a-zA-Z0-9]{20,}/ },
  { name: "JWT Token", pattern: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}/ },
  { name: "Private Key", pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
  { name: "PostgreSQL URL", pattern: /postgres(?:ql)?:\/\/[^\s'"]+/ },
  { name: "Redis URL", pattern: /redis:\/\/[^\s'"]+/ },
  { name: "Clerk Secret Key", pattern: /sk_test_[a-zA-Z0-9]{20,}|sk_live_[a-zA-Z0-9]{20,}/ },
  { name: "Supabase Key", pattern: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/ },
  { name: "SendGrid Key", pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/ },
  { name: "Twilio SID", pattern: /AC[a-f0-9]{32}/ },
];

const SCAN_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".json", ".yaml", ".yml", ".env", ".md"];
const SKIP_DIRS = ["node_modules", ".next", ".git", "out", "dist"];

function scanFile(filePath: string): { file: string; matches: string[] } {
  const content = fs.readFileSync(filePath, "utf-8");
  const matches: string[] = [];

  for (const { name, pattern } of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      matches.push(name);
    }
  }

  return { file: filePath, matches };
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walkDir(fullPath));
      } else if (SCAN_EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  } catch {
    // Skip unreadable dirs
  }
  return files;
}

const filesToScan = walkDir(ROOT);
let secretsFound = 0;

for (const file of filesToScan) {
  const { matches } = scanFile(file);
  if (matches.length > 0) {
    secretsFound += matches.length;
    hasErrors = true;
    const relative = path.relative(ROOT, file);
    matches.forEach((m) => {
      log(RED, "  ✗", `Potential secret found: ${BOLD}${m}${RESET} in ${relative}`);
    });
  }
}

if (secretsFound === 0) {
  log(GREEN, "  ✓", `Scanned ${filesToScan.length} files — no secrets detected`);
}

// ── Step 3: .env File Check ─────────────────────────────────────────────────

console.log(`\n${BOLD}3. Dangerous File Check${RESET}\n`);

const DANGEROUS_FILES = [".env", ".env.local", ".env.production", ".env.development", "credentials.json", "service-account.json", "token.json"];
let dangerousFound = 0;

for (const f of DANGEROUS_FILES) {
  if (fs.existsSync(path.join(ROOT, f))) {
    dangerousFound++;
    hasErrors = true;
    log(RED, "  ✗", `Dangerous file found: ${BOLD}${f}${RESET} — remove before committing!`);
  }
}

if (dangerousFound === 0) {
  log(GREEN, "  ✓", "No dangerous files found in project root");
}

// ── Step 4: Config Content Checks ───────────────────────────────────────────

console.log(`\n${BOLD}4. Config Content Checks${RESET}\n`);

if (!config.name || config.name === "My Community") {
  hasWarnings = true;
  log(YELLOW, "  ⚠", "Community name looks like a placeholder — customize it!");
}

if (!config.logoUrl) {
  hasWarnings = true;
  log(YELLOW, "  ⚠", "No logo URL set — your community will use a text fallback");
}

if (!config.coverImageUrl) {
  hasWarnings = true;
  log(YELLOW, "  ⚠", "No cover image URL set — consider adding one for visual impact");
}

if ((config.channels?.length ?? 0) < 3) {
  hasWarnings = true;
  log(YELLOW, "  ⚠", "Less than 3 channels — most communities work better with at least 3-4 spaces");
}

if ((config.onboardingQuestions?.length ?? 0) === 0 && config.mandatoryOnboarding) {
  hasErrors = true;
  log(RED, "  ✗", "mandatoryOnboarding is true but no onboardingQuestions defined");
}

if (!hasWarnings && !hasErrors) {
  log(GREEN, "  ✓", "Config content looks good");
}

// ── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${CYAN}─────────────────────────────────────────────${RESET}`);

if (hasErrors) {
  console.log(`\n${RED}${BOLD}  ✗ Validation FAILED${RESET} — fix the errors above before submitting.\n`);
  process.exit(1);
} else if (hasWarnings) {
  console.log(`\n${YELLOW}${BOLD}  ⚠ Validation PASSED with warnings${RESET} — review the notes above.\n`);
  process.exit(0);
} else {
  console.log(`\n${GREEN}${BOLD}  ✓ Validation PASSED${RESET} — your config is ready to submit!\n`);
  process.exit(0);
}
