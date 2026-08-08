import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const colorSourcePath = path.join(
  repositoryRoot,
  'packages/core/src/scss/_color.scss',
);
const colorSource = fs.readFileSync(colorSourcePath, 'utf8');
const rootBlock = colorSource.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1];

if (!rootBlock) {
  throw new Error(`Unable to find the :root color tokens in ${colorSourcePath}`);
}

const tokens = new Map(
  [...rootBlock.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [
    match[1],
    match[2].trim(),
  ]),
);

const namedColors = new Map([
  ['black', '#000000'],
  ['white', '#ffffff'],
]);

function normalizeHex(value) {
  const normalized = value.toLowerCase();

  if (/^#[0-9a-f]{6}$/.test(normalized)) {
    return normalized;
  }

  if (/^#[0-9a-f]{3}$/.test(normalized)) {
    return `#${[...normalized.slice(1)].map((digit) => digit.repeat(2)).join('')}`;
  }

  throw new Error(`Unsupported color value: ${value}`);
}

function resolveValue(value, currentColor, trail) {
  if (value === 'currentColor') {
    if (!currentColor) {
      throw new Error(`currentColor cannot be resolved for ${trail.join(' -> ')}`);
    }

    return currentColor;
  }

  if (namedColors.has(value.toLowerCase())) {
    return namedColors.get(value.toLowerCase());
  }

  if (value.startsWith('#')) {
    return normalizeHex(value);
  }

  const variableMatch = value.match(/^var\(--([\w-]+)\)$/);

  if (variableMatch) {
    return resolveToken(variableMatch[1], currentColor, trail);
  }

  throw new Error(`Unsupported color value "${value}" for ${trail.join(' -> ')}`);
}

function resolveToken(name, currentColor = null, trail = []) {
  if (trail.includes(name)) {
    throw new Error(`Circular color token reference: ${[...trail, name].join(' -> ')}`);
  }

  const value = tokens.get(name);

  if (!value) {
    throw new Error(`Missing color token: --${name}`);
  }

  return resolveValue(value, currentColor, [...trail, name]);
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((index) =>
    Number.parseInt(hex.slice(index, index + 2), 16) / 255,
  );

  const linearChannels = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return (
    linearChannels[0] * 0.2126 +
    linearChannels[1] * 0.7152 +
    linearChannels[2] * 0.0722
  );
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);

  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

const themes = ['primary', 'secondary', 'dark', 'light', 'canvas'];
const minimumContrast = 4.5;
const rows = [];
const failures = [];

for (const theme of themes) {
  const background = resolveToken(theme);
  const text = resolveToken(`${theme}-text`);
  const colors = new Map([
    ['Text', text],
    ['Link', resolveToken(`${theme}-link`, text)],
    ['Confirm', resolveToken(`${theme}-confirm`)],
    ['Warn', resolveToken(`${theme}-warn`)],
  ]);

  for (const [role, foreground] of colors) {
    const ratio = contrastRatio(foreground, background);
    const result = {
      theme,
      role,
      foreground,
      background,
      ratio,
    };

    rows.push(result);

    if (ratio < minimumContrast) {
      failures.push(result);
    }
  }
}

console.log('Natura11y theme contrast matrix (minimum 4.5:1)');
console.log('Theme      Role      Foreground  Background  Ratio');

for (const row of rows) {
  console.log(
    `${row.theme.padEnd(11)}${row.role.padEnd(10)}${row.foreground.padEnd(12)}` +
      `${row.background.padEnd(12)}${row.ratio.toFixed(2)}:1`,
  );
}

if (failures.length > 0) {
  console.error(`\n${failures.length} theme color pair(s) failed contrast.`);
  process.exitCode = 1;
} else {
  console.log('\nAll theme color pairs pass.');
}
