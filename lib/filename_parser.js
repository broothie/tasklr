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
        // Format: charset''percent-encoded-filename
        const parts = val.split("''");
        const charset = (parts[0] || '').toLowerCase();
        const encoded = parts[1] || '';
        // Prefer UTF-8 decoding when charset indicates utf
        if (charset.indexOf('utf') !== -1) {
          filename = decodeURIComponent(encoded);
        } else if (charset.indexOf('latin') !== -1 || charset.indexOf('iso-8859') !== -1) {
          // Decode percent-encoded bytes and interpret as latin1 (ISO-8859-1)
          // Build a byte array from %XX sequences and raw characters.
          try {
            const bytes = [];
            for (let i = 0; i < encoded.length; ) {
              const ch = encoded[i];
              if (ch === '%' && i + 2 < encoded.length) {
                const hex = encoded.substr(i+1,2);
                const byte = parseInt(hex, 16);
                if (!Number.isNaN(byte)) {
                  bytes.push(byte);
                  i += 3;
                  continue;
                }
              }
              // Non-percent char -> push its char code (assume ASCII)
              bytes.push(encoded.charCodeAt(i));
              i += 1;
            }
            filename = Buffer.from(bytes).toString('latin1');
          } catch (e) {
            filename = null;
          }
        } else {
          // Fallback: try decodeURIComponent; if it fails return null
          filename = decodeURIComponent(encoded);
        }
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
