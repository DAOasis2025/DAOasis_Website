const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const scripts = html => Array.from(html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))
  .filter(m => !/\bsrc=/.test(m[1])).map(m => m[2]);
let count = 0;
for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
  const source = read(file), built = read('dist/' + file);
  assert.deepEqual(scripts(built), scripts(source), file + ': inline scripts changed during build');
  const original = execFileSync('git', ['-c', 'safe.directory=' + root.replaceAll('\\', '/'), 'show', '9ee9021:' + file], { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  assert.deepEqual(scripts(source), scripts(original), file + ': original inline scripts changed');
  const styles = html => Array.from(html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)).map(m => m[1]);
  assert.deepEqual(styles(source), styles(original.replaceAll("url('images/hero-mobile.jpg?v=20261009')", "url('images/hero-mobile-optimized.webp')")), file + ': original layout or animation CSS changed');
  for (const script of scripts(source)) {
    if (/^\s*\{/.test(script)) JSON.parse(script);
    else new vm.Script(script, { filename: file });
    count++;
  }
  assert(!/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(source), file + ': external font request');
  const markup = built.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  for (const match of markup.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    const target = path.join(root, 'dist', url.replace(/^\//, ''));
    assert(fs.existsSync(target) || fs.existsSync(target + '.html'), file + ': missing ' + url);
  }
}
for (const file of ['cine.js', 'smooth.js']) {
  assert.equal(read('js/' + file), read('dist/js/' + file), file + ': build changed scrolling code');
  const original = execFileSync('git', ['-c', 'safe.directory=' + root.replaceAll('\\', '/'), 'show', '9ee9021:js/' + file], { cwd: root, encoding: 'utf8' });
  assert.equal(read('js/' + file).replaceAll('\r\n', '\n'), original.replaceAll('\r\n', '\n'), file + ': scrolling code changed');
}
for (const file of fs.readdirSync(path.join(root,'dist/js')).filter(f => f.endsWith('.js'))) new vm.Script(read('dist/js/' + file));
console.log(`Verified ${count} unchanged inline script blocks, unchanged scrolling files, JS syntax and local asset references.`);
