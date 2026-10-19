const fs = require('node:fs');
const zlib = require('node:zlib');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const file of ['index.html', 'app.html', 'sanctuary.html', 'js/signup.js', 'js/trust.js']) {
  const a = fs.readFileSync(path.join(root, file));
  const b = fs.readFileSync(path.join(root, 'dist', file));
  console.log(file, JSON.stringify({sourceBytes:a.length,deliveredBytes:b.length,gzipBytes:zlib.gzipSync(b).length}));
}
