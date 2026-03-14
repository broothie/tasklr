// scripts/check_export_filename.js
'use strict';
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
// Look for Content-Disposition header setting in /api/export route
const exportSectionIndex = src.indexOf('API: Export all lists and tasks') !== -1 ? src.indexOf('API: Export all lists and tasks') : src.indexOf('/api/export');
const snippet = exportSectionIndex !== -1 ? src.slice(exportSectionIndex, exportSectionIndex + 2000) : src.slice(0,2000);
const hasContentDisposition = /Content-Disposition/.test(snippet);
const hasFilenameStar = /filename\*/.test(snippet);
const hasEncodeURIComponent = /encodeURIComponent\(/.test(snippet);
console.log('Checked /api/export section for Content-Disposition and filename* encoding');
console.log('Content-Disposition present:', hasContentDisposition);
console.log('filename* present:', hasFilenameStar);
console.log('encodeURIComponent used:', hasEncodeURIComponent);
if (!hasContentDisposition) { console.error('MISSING: Content-Disposition header not found in /api/export section'); process.exit(1); }
if (!hasFilenameStar && !hasEncodeURIComponent) { console.error('WARNING: no filename* or encodeURIComponent found; filename may not handle UTF-8'); process.exit(2); }
console.log('OK: export filename handling looks present');
