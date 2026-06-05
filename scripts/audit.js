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
      // Skip SVG animation code and CSS template string blocks
      if (/lh\(|rgba\(152,152,160|setAttribute/.test(line)) return false;
      // Skip lines inside CSS <style> template literals (keyframes, .class selectors)
      if (/^\s*(\.[\w-]|@keyframes|::-webkit)/.test(line)) return false;
      // Only flag rgba used as a direct value in a JS property (not a CSS string)
      return /rgba\(\d/.test(line)
          && /(bgcolor|color|background|borderColor)\s*[=:]\s*(["'`])?rgba/.test(line);
    },
  },
  {
    id: 'inline-fontsize',
    description: 'Raw px font size on text element — use typography token',
    test: (line) => {
      // Only flag fontSize on Typography, div, span, p — not on MuiIcon (icon sizing is always explicit)
      if (/MuiIcon|<Icon[\s>]/.test(line)) return false;
      // Skip icon-size-looking values that appear alone (12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 40)
      if (/fontSize\s*:\s*(12|13|14|16|18|20|22|24|28|32|40)\s*[,}]/.test(line) && /MuiIcon|icon/.test(line.toLowerCase())) return false;
      // Flag raw numeric fontSize on Typography/text-bearing elements
      return /fontSize\s*:\s*\d+[,}]/.test(line)
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
