import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const csso = require('csso');

const sourceFile = new URL('../dist/natura11y-icons.css', import.meta.url);
const targetFile = new URL('../dist/natura11y-icons.min.css', import.meta.url);

const sourceCss = await readFile(sourceFile, 'utf8');
const minifiedCss = csso.minify(sourceCss).css.replace(
  /content:"([\uE000-\uF8FF])"/g,
  (_, glyph) => `content:"\\${glyph.codePointAt(0).toString(16)}"`
);

await writeFile(targetFile, `${minifiedCss}\n`);
