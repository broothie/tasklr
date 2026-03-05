#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const script = path.join(__dirname, 'validate_oauth_env.js');

// Run the target script inside a VM with a fake `process` and `console`
// so we avoid spawning child processes (which can be restricted in CI).
function runWithEnv(env) {
  const mergedEnv = Object.assign({}, process.env, env);
  const code = fs.readFileSync(script, 'utf8');

  let stdout = '';
  let stderr = '';

  const fakeConsole = {
    log: (...args) => { stdout += args.join(' ') + '\n'; },
    info: (...args) => { stdout += args.join(' ') + '\n'; },
    warn: (...args) => { stderr += args.join(' ') + '\n'; },
    error: (...args) => { stderr += args.join(' ') + '\n'; },
  };

  // Provide a fake process that has env and an exit that throws so we can
  // capture the intended exit code without terminating this runner.
  const fakeProcess = {
    env: mergedEnv,
    exit: (code) => { const e = new Error('EXIT:' + (code || 0)); e.code = code || 0; throw e; },
    cwd: process.cwd.bind(process),
    argv: [process.execPath, script],
    stdout: process.stdout,
    stderr: process.stderr,
  };

  const sandbox = {
    require, console: fakeConsole, process: fakeProcess, __dirname: path.dirname(script), __filename: script, module: {}, exports: {}, Buffer, setTimeout, clearTimeout,
  };

  try {
    vm.runInNewContext(code, sandbox, { filename: script });
    // If script completes without calling exit, treat as success (0)
    return { status: 0, stdout, stderr };
  } catch (e) {
    if (e && typeof e.code === 'number' && String(e.message || '').startsWith('EXIT:')) {
      return { status: e.code, stdout, stderr };
    }
    // Unexpected exception: include stack in stderr
    stderr += (e && e.stack) ? '\n' + e.stack : '\n' + String(e);
    return { status: 1, stdout, stderr };
  }
}

let failed = false;
// Test 1: Missing SESSION_SECRET should fail
const env1 = {
  GOOGLE_CLIENT_ID: 'x',
  GOOGLE_CLIENT_SECRET: 'y',
  BASE_URL: 'http://localhost:3000',
};
const r1 = runWithEnv(env1);
if (r1.status === 0) {
  console.error('FAIL: expected non-zero exit when SESSION_SECRET missing');
  failed = true;
} else if (!(/SESSION_SECRET/.test(r1.stdout + r1.stderr))) {
  console.error('FAIL: expected message about SESSION_SECRET in output');
  console.error('stdout:', r1.stdout);
  console.error('stderr:', r1.stderr);
  failed = true;
} else {
  console.log('PASS: missing SESSION_SECRET detected');
}

// Test 2: With SESSION_SECRET present and redirect URI set should pass
const env2 = Object.assign({}, env1, {
  SESSION_SECRET: 'secret',
  // Provide GOOGLE_REDIRECT_URI to satisfy the redirect check
  GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/callback',
});
const r2 = runWithEnv(env2);
if (r2.status !== 0) {
  console.error('FAIL: expected zero exit when SESSION_SECRET present');
  console.error('stdout:', r2.stdout);
  console.error('stderr:', r2.stderr);
  failed = true;
} else {
  console.log('PASS: validate_oauth_env passes with SESSION_SECRET');
}

if (failed) process.exit(1);
console.log('ALL TESTS PASSED');
