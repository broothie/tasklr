// scripts/test_filename_parsing.js
// Simple test harness for parsing filename from Content-Disposition header
'use strict';

const { parseFilenameFromContentDisposition } = require('../lib/filename_parser');

const tests = [
  {
    cd: "attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json",
    want: '✓-文.json'
  },
  {
    cd: 'attachment; filename="simple-export.json"',
    want: 'simple-export.json'
  },
  {
    cd: "inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json",
    want: '✓-file.json'
  },
  {
    cd: "attachment; filename*=latin1''%A3-pound.json",
    want: null
  },
  {
    cd: '',
    want: null
  },
  {
    cd: 'attachment; filename=unquoted-name.json',
    want: 'unquoted-name.json'
  }
];

let fail = false;
for (const t of tests) {
  const got = parseFilenameFromContentDisposition(t.cd);
  const ok = got === t.want;
  if (!ok) {
    console.error(`FAIL: header=${t.cd}\n  want=${t.want}\n  got =${got}\n`);
    fail = true;
  } else {
    console.log(`PASS: ${t.cd} -> ${got}`);
  }
}
if (fail) process.exit(1);
console.log('All filename parsing tests passed');
