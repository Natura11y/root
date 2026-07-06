import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { natura11yIcons } from '@natura11y/icons/src/data/icons.mjs';
import type { APIRoute, GetStaticPaths } from 'astro';

const iconNames = new Set(natura11yIcons.map((icon) => icon.className));

export const getStaticPaths: GetStaticPaths = () => (
  natura11yIcons.map((icon) => ({
    params: {
      name: icon.className,
    },
  }))
);

export const GET: APIRoute = async ({ params }) => {
  const name = params.name;

  if (!name || !iconNames.has(name)) {
    return new Response('Icon not found.', { status: 404 });
  }

  const svgPath = fileURLToPath(
    new URL(`../../../../../packages/icons/optimized-svg/${name}.svg`, import.meta.url)
  );
  const svg = await readFile(svgPath, 'utf8');

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
    },
  });
};
