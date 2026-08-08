import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const checkBuild = process.argv.includes('--build');
const checkRemote = process.argv.includes('--remote');
const packageNames = ['core', 'icons', 'react'];
const packageVersions = new Map();

for (const packageName of packageNames) {
  const packagePath = path.join(root, 'packages', packageName, 'package.json');
  const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
  packageVersions.set(packageName, packageJson.version);
}

const coreVersion = packageVersions.get('core');
const iconsVersion = packageVersions.get('icons');
const expectedUrls = {
  cdnCSS: `https://cdn.jsdelivr.net/npm/@natura11y/core@${coreVersion}/dist/natura11y.css`,
  cdnJS: `https://cdn.jsdelivr.net/npm/@natura11y/core@${coreVersion}/dist/natura11y.js`,
  cdnIcons: `https://cdn.jsdelivr.net/npm/@natura11y/icons@${iconsVersion}/dist/natura11y-icons.min.css`,
};

const varsPath = path.join(root, 'apps/docs/src/content/mdxVars.js');
const varsContents = await readFile(varsPath, 'utf8');
const vars = {};
const failures = [];

for (const [name, expectedUrl] of Object.entries(expectedUrls)) {
  const match = varsContents.match(new RegExp(`export const ${name} = ['"]([^'"]+)['"]`));
  vars[name] = match?.[1];

  if (vars[name] !== expectedUrl) {
    failures.push(`${name} must be ${expectedUrl}, received ${vars[name] ?? 'undefined'}`);
  }
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath));
    } else if (/\.(?:astro|css|html|js|jsx|md|mdx|ts|tsx)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

const scanDirectories = [path.join(root, 'apps/docs/src')];

if (checkBuild) {
  scanDirectories.push(path.join(root, 'apps/docs/dist'));
}

const versionedCdnPattern = /https:\/\/cdn\.jsdelivr\.net\/npm\/@natura11y\/(core|icons|react)(?:@([^/\s"'<>&]+))?\//g;
const legacyCdnPattern = /https:\/\/cdn\.jsdelivr\.net\/npm\/natura11y(?:@|\/)/g;

for (const directory of scanDirectories) {
  for (const file of await collectFiles(directory)) {
    const contents = await readFile(file, 'utf8');
    const relativeFile = path.relative(root, file);

    if (legacyCdnPattern.test(contents)) {
      failures.push(`${relativeFile} references the retired unscoped natura11y CDN package`);
    }
    legacyCdnPattern.lastIndex = 0;

    for (const match of contents.matchAll(versionedCdnPattern)) {
      const [, packageName, referencedVersion] = match;
      const expectedVersion = packageVersions.get(packageName);

      if (!referencedVersion) {
        failures.push(`${relativeFile} contains an unversioned @natura11y/${packageName} CDN URL`);
      } else if (referencedVersion !== expectedVersion) {
        failures.push(
          `${relativeFile} references @natura11y/${packageName}@${referencedVersion}; expected ${expectedVersion}`,
        );
      }
    }
  }
}

if (checkRemote) {
  for (const url of Object.values(expectedUrls)) {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });

      if (!response.ok) {
        failures.push(`${url} returned HTTP ${response.status}`);
      }
    } catch (error) {
      failures.push(`${url} could not be reached: ${error.message}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Documentation CDN verification failed:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const checks = ['source versions'];

if (checkBuild) checks.push('production build');
if (checkRemote) checks.push('live CDN availability');

console.log(`Documentation CDN verification passed: ${checks.join(', ')}.`);
console.log(`Core ${coreVersion}; Icons ${iconsVersion}.`);
