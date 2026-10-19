// Keep authored files readable. Only delivery copies are minified.
const fs = require('node:fs/promises');
const path = require('node:path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const css = new CleanCSS({ level: { 1: { all: false, removeWhitespace: true } }, rebase: false });
function minCSS(source) {
  const result = css.minify(source);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  return result.styles;
}
(async () => {
  if (path.dirname(out) !== root || path.basename(out) !== 'dist') throw new Error('Invalid output directory');
  await fs.rm(out, { recursive: true, force: true });
  await fs.mkdir(out, { recursive: true });
  for (const dir of ['images', 'fonts', 'css', 'js']) {
    await fs.cp(path.join(root, dir), path.join(out, dir), { recursive: true });
  }
  for (const file of await fs.readdir(root)) {
    if (!/\.(html|ico|png|webmanifest|xml|txt)$/.test(file)) continue;
    if (file.endsWith('.html')) {
      const source = (await fs.readFile(path.join(root, file), 'utf8'))
        .replace('<link rel="stylesheet" href="css/fonts.css">', '<style data-local-fonts>' +
          (await fs.readFile(path.join(root, 'css/fonts.css'), 'utf8')).replaceAll('../fonts/', 'fonts/') + '</style>')
        .replace(/<link rel="stylesheet" href="css\/signup\.css[^\"]*"\s*\/>/,
          '<style data-signup-styles>' + await fs.readFile(path.join(root, 'css/signup.css'), 'utf8') + '</style>');
      // Do not transform HTML whitespace or inline JS: animation text nodes,
      // timing, layout declarations and scrolling scripts remain intact.
      const result = source.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,
        (_, start, body, end) => start + minCSS(body) + end);
      await fs.writeFile(path.join(out, file), result);
    } else await fs.copyFile(path.join(root, file), path.join(out, file));
  }
  for (const file of await fs.readdir(path.join(root, 'css'))) {
    if (file.endsWith('.css')) await fs.writeFile(path.join(out, 'css', file), minCSS(await fs.readFile(path.join(root, 'css', file), 'utf8')));
  }
  // The cinematic and smooth-scroll files are deliberately copied byte-for-byte.
  for (const file of ['signup.js', 'trust.js', 'menu-accessibility.js']) {
    const source = await fs.readFile(path.join(root, 'js', file), 'utf8');
    const result = await minify(source, { compress: false, mangle: false, format: { comments: false } });
    await fs.writeFile(path.join(out, 'js', file), result.code);
  }
  console.log('Built static site in dist; cinematic scripts unchanged.');
})().catch(error => { console.error(error); process.exitCode = 1; });
