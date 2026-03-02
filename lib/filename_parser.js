// lib/filename_parser.js
// Shared Content-Disposition filename parsing helper (Node)
'use strict';

function parseFilenameFromContentDisposition(cd) {
  if (!cd) return null;
  let filename = null;
  const star = /filename\*=([^;]+)/i.exec(cd);
  if (star) {
    try {
      let val = star[1].trim();
      // RFC5987: charset''encoded_filename (e.g., UTF-8''%E2%9C%93.json)
      const lower = val.toLowerCase();
      if (lower.startsWith("utf-8''")) {
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

module.exports = { parseFilenameFromContentDisposition };
