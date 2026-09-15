// Secret-safe CLI argument construction test for bin/cli.js
// Reads the COMMITTED tree blob via git cat-file (not the working tree) so the
// result reflects exactly what is shipped on the PR head. Never executes the CLI
// and never touches a real credential.
import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, 'bin', 'cli.js');

// Snapshot the committed blob to a temp file so node can read raw bytes from a
// real file (avoids any terminal display-layer redaction of ${...} in the test
// runner's own output paths). The temp file is deleted before exit.
const tmpPath = join(__dirname, '.tmp_committed_cli.js');
try {
  execSync(`git cat-file -p HEAD:bin/cli.js`, { stdio: ['pipe','pipe','pipe'] }).toString();
} catch {}
execSync(`git cat-file -p HEAD:bin/cli.js > "${tmpPath}"`, { stdio: 'pipe' });
const committedBlob = readFileSync(tmpPath, 'utf8');
writeFileSync(tmpPath, ''); // wipe secret-free content immediately
try { execSync(`rm -f "${tmpPath}"`, { stdio: 'pipe' }); } catch {}

let failures = 0;

// 1. Syntax check on the committed blob
try {
  execSync(`node --check "${tmpPath}"`, { stdio: 'pipe' });
} catch (e) {
  // tmpPath was wiped; re-extract for the syntax check only
  execSync(`git cat-file -p HEAD:bin/cli.js > "${tmpPath}"`, { stdio: 'pipe' });
}
// Re-extract cleanly for the syntax check (tmpPath may have been wiped above)
execSync(`git cat-file -p HEAD:bin/cli.js > "${tmpPath}"`, { stdio: 'pipe' });
try {
  execSync(`node --check "${tmpPath}"`, { stdio: 'pipe' });
  console.log('[test] node --check bin/cli.js (committed blob) : PASS');
} catch (e) {
  console.log('[test] node --check bin/cli.js (committed blob) : FAIL');
  failures++;
}

// 2a. Header must interpolate ${apiKey}, not a placeholder
const hasInterpolation = committedBlob.includes('`Authorization: Bearer ${apiKey}`');
const hasPlaceholder = committedBlob.includes('Bearer ***') || /Bearer \*{3}/.test(committedBlob);
console.log(`[test] header interpolates \\\`\\\${apiKey}\\\` : ${hasInterpolation ? 'PASS' : 'FAIL'}`);
console.log(`[test] no 'Bearer ***' placeholder literal : ${!hasPlaceholder ? 'PASS' : 'FAIL'}`);
if (!hasInterpolation || hasPlaceholder) failures++;

// 2b. Args array well-formed: header element then spread element as siblings
const argsWellFormed = committedBlob.includes('`Authorization: Bearer ${apiKey}`,\n  ...process.argv.slice(2),');
console.log(`[test] args array well-formed (header + spread siblings) : ${argsWellFormed ? 'PASS' : 'FAIL'}`);
if (!argsWellFormed) failures++;

// 2c. Key never passed into a console.* call (paren-depth-aware scan)
const consoleRegex = /console\.(log|info|warn|error|debug|trace|dir|table|assert)\s*\(/g;
let m, consoleCallsWithApiKey = 0;
while ((m = consoleRegex.exec(committedBlob)) !== null) {
  const openParenIdx = m.index + m[0].length - 1;
  let depth = 1, i = openParenIdx + 1;
  while (i < committedBlob.length && depth > 0) {
    if (committedBlob.charCodeAt(i) === 40) depth++;
    else if (committedBlob.charCodeAt(i) === 41) depth--;
    i++;
  }
  if (committedBlob.slice(openParenIdx + 1, i - 1).includes('apiKey')) consoleCallsWithApiKey++;
}
console.log(`[test] console.* calls referencing apiKey (${consoleCallsWithApiKey}, expect 0) : ${consoleCallsWithApiKey === 0 ? 'PASS' : 'FAIL'}`);
if (consoleCallsWithApiKey > 0) failures++;

// 2d. Key never persisted to fs / stdout streams
const persistsKey = /(fs\.(writeFileSync|writeFile|appendFileSync|appendFile)|process\.(stdout|stderr)\.(write|end|push)\s*\()[\s\S]*?apiKey/.test(committedBlob);
console.log(`[test] apiKey never persisted to fs/stdout : ${!persistsKey ? 'PASS' : 'FAIL'}`);
if (persistsKey) failures++;

// 2e. Canonical endpoint + HTTPS validation intact
const defaultUrlCorrect = committedBlob.includes("const DEFAULT_URL = 'https://mcp.replynodes.com/mcp'");
const httpsValidation = committedBlob.includes("if (parsedUrl.protocol !== 'https:')");
console.log(`[test] canonical endpoint intact (mcp.replynodes.com/mcp) : ${defaultUrlCorrect ? 'PASS' : 'FAIL'}`);
console.log(`[test] HTTPS validation intact : ${httpsValidation ? 'PASS' : 'FAIL'}`);
if (!defaultUrlCorrect || !httpsValidation) failures++;

// 2f. Key read from env, not hardcoded
const readsEnv = committedBlob.includes('process.env.REPLYNODES_API_KEY');
const noHardcodedKey = !/REPLYNODES_API_KEY\s*=\s*["'][A-Za-z0-9_\-=]+["']/.test(committedBlob);
console.log(`[test] apiKey read from environment : ${readsEnv ? 'PASS' : 'FAIL'}`);
console.log(`[test] no hardcoded credential literal : ${noHardcodedKey ? 'PASS' : 'FAIL'}`);
if (!readsEnv || !noHardcodedKey) failures++;

// Cleanup temp file
try { execSync(`rm -f "${tmpPath}"`, { stdio: 'pipe' }); } catch {}

if (failures > 0) {
  console.log(`\n[test] ${failures} CHECK(S) FAILED`);
  process.exit(1);
}
console.log('\n[test] ALL CHECKS PASSED — committed bin/cli.js is secret-safe and well-formed.');
process.exit(0);
