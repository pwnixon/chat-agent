#!/usr/bin/env node
// Design system compliance audit
// Run: npm run audit
// Checks JSX files for common violations of the design system guidelines.

import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const TARGETS = ['.jsx', '.tsx'];

// Files / line ranges exempt from hex checks (SVG animation constants at top of file)
const SVG_EXEMPT_LINES = 50; // first N lines of ArcheraArchitect.jsx are SVG math

function getFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'dist' && e.name !== 'scripts')
    .flatMap(e => {
      const full = join(dir, e.name);
      return e.isDirectory() ? getFiles(full) : TARGETS.includes(extname(e.name)) ? [full] : [];
    });
}

const CHECKS = [
  {
    id: 'fontFamily',
    description: 'Explicit fontFamily — remove, theme handles it',
    test: (line) => /fontFamily\s*:\s*["']Roboto/.test(line),
  },
  {
    id: 'raw-hex-sx',
    description: 'Raw hex color in sx/style prop — use palette or token',
    test: (line, lineNum, filename) => {
      if (filename.includes('ArcheraArchitect') && lineNum <= SVG_EXEMPT_LINES) return false;
      // Skip SVG animation constants, path data, and lerp calls
      if (/const C_|STEP_TONES/.test(line)) return false;
      if (/setAttribute|mkP\(|lh\(/.test(line)) return false;
      if (/<path\s|fill="/.test(line)) return false; // SVG element attributes
      // Only flag hex used as a JS value in sx/style/color props (not SVG path strings)
      return /(bgcolor|color|background|borderColor)\s*[:=]\s*["']#[0-9a-fA-F]{3,8}["']/.test(line)
          || /:\s*["']#[0-9a-fA-F]{3,8}["']/.test(line) && /(sx|style)\s*=/.test(line);
    },
  },
  {
    id: 'cursor-pointer-box',
    description: 'cursor:pointer on Box — use IconButton or Link component="button"',
    test: (line) => /cursor\s*:\s*["']pointer["']/.test(line) && /<Box[\s>]/.test(line),
  },
  {
    id: 'placeholder-box',
    description: 'Box used as skeleton placeholder — use <Skeleton>',
    test: (line) => /bgcolor\s*:\s*["']neutral\.100["']/.test(line),
  },
  {
    id: 'raw-rgba',
    description: 'Raw rgba() color in sx/style — use palette or token',
    test: (line, lineNum, filename) => {
      if (filename.includes('ArcheraArchitect') && lineNum <= SVG_EXEMPT_LINES) return false;
      // Skip SVG animation code
      if (/lh\(|rgba\(152,152,160|setAttribute/.test(line)) return false;
      // Skip CSS template string blocks (keyframes, class selectors)
      if (/^\s*(\.[\w-]|@keyframes|::-webkit)/.test(line)) return false;
      // Skip lines that are HTML content strings (html: `...` or html:`...`)
      if (/^\s*html\s*[=:]/.test(line) || /html:`/.test(line)) return false;
      // Skip overlay/backdrop rgba(0,0,0,...) and on-dark rgba(255,255,255,...) — no palette equivalent
      if (/rgba\(0,0,0|rgba\(255,255,255/.test(line)) return false;
      // Only flag rgba used as a direct JS property value
      return /rgba\(\d/.test(line)
          && /(bgcolor|color|background|borderColor)\s*[=:]\s*(["'`])?rgba/.test(line);
    },
  },
  {
    id: 'inline-fontsize',
    description: 'Raw px font size on text element — use typography token',
    test: (line) => {
      // Skip icon components — icon sizes are always set explicitly
      if (/MuiIcon|<Icon[\s>]/.test(line)) return false;
      // Skip micro-typography sizes (<12px) — no token equivalent
      if (/fontSize\s*:\s*([1-9]|10|11)[,}\s]/.test(line)) return false;
      // Skip HTML content strings
      if (/^\s*html\s*[=:]/.test(line) || /html:`/.test(line)) return false;
      // Flag raw numeric fontSize ≥12 on text-bearing elements
      return /fontSize\s*:\s*1[2-9]\d*[,}]/.test(line)
          && /Typography|<div|<span|<p[\s>]/.test(line);
    },
  },
];

const files = getFiles(ROOT);
let totalIssues = 0;
const results = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const rel = file.replace(ROOT, '');
  const fileIssues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    for (const check of CHECKS) {
      if (check.test(line, lineNum, file)) {
        fileIssues.push({ lineNum, checkId: check.id, description: check.description, snippet: line.trim().slice(0, 100) });
        totalIssues++;
      }
    }
  }

  if (fileIssues.length) results.push({ file: rel, issues: fileIssues });
}

if (totalIssues === 0) {
  console.log('✓ No issues found');
  process.exit(0);
}

console.log(`\nAudit found ${totalIssues} issue${totalIssues === 1 ? '' : 's'}:\n`);
for (const { file, issues } of results) {
  console.log(`  ${file}`);
  for (const { lineNum, checkId, description, snippet } of issues) {
    console.log(`    ${String(lineNum).padStart(4)}  [${checkId}] ${description}`);
    console.log(`          ${snippet}`);
  }
  console.log();
}
process.exit(1);
