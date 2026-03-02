// scripts/test_filename_parsing.js
// Simple test harness for parsing filename from Content-Disposition header
'use strict';

function parseFilenameFromContentDisposition(cd) {
  if (!cd) return null;
  let filename = null;
  const star = /filename\*=([^;]+)/i.exec(cd);
  if (star) {
    try {
      let val = star[1].trim();
      if (val.toLowerCase().startsWith("utf-8''")) {
        filename = decodeURIComponent(val.slice(7));
      } else if (val.indexOf("''") !== -1) {
        const parts = val.split("''");
        filename = decodeURIComponent(parts[1] || parts[0]);
      } else {
        filename = decodeURIComponent(val);
      }
    } catch (e) {
      filename = null;
    }
  } else {
    const m = /filename="?([^";]+)"?/.exec(cd);
    if (m) filename = m[1];
  }
  return filename;
}

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
    want: '£-pound.json' // percent-decoding as latin1 will not restore properly, but decoding percent sequences yields the bytes interpreted as UTF-8 — this case may be ambiguous
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
