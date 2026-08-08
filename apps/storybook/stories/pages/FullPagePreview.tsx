import { useLayoutEffect, useMemo, useRef } from 'react';

type FullPagePreviewProps = {
  html: string;
  path: string;
  title: string;
};

type PageScript = {
  attributes: Array<[string, string]>;
  content: string;
};

type PreparedPage = {
  bodyClassNames: string[];
  documentClassNames: string[];
  documentDirection: string | null;
  documentLanguage: string | null;
  markup: string;
  scripts: PageScript[];
  title: string;
};

const resolvePagePath = (path: string) => {
  const previewFile = '/iframe.html';
  const { pathname } = window.location;
  const storybookBase = pathname.endsWith(previewFile)
    ? pathname.slice(0, -previewFile.length)
    : '';
  const pagePath = path.endsWith('/') ? `${path}index.html` : path;

  return `${storybookBase}/${pagePath}`.replace(/\/+/g, '/');
};

const resolveAssetUrl = (value: string, pageUrl: URL) => {
  if (!value || value.startsWith('#')) {
    return value;
  }

  try {
    return new URL(value, pageUrl).href;
  } catch {
    return value;
  }
};

const preparePage = (html: string, path: string): PreparedPage => {
  const source = new DOMParser().parseFromString(html, 'text/html');
  const pageUrl = new URL(resolvePagePath(path), window.location.href);

  for (const [selector, attribute] of [
    ['[action]', 'action'],
    ['[href]', 'href'],
    ['[poster]', 'poster'],
    ['[src]', 'src'],
  ] as const) {
    source.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      const value = element.getAttribute(attribute);

      if (value !== null) {
        element.setAttribute(attribute, resolveAssetUrl(value, pageUrl));
      }
    });
  }

  source.querySelectorAll<HTMLElement>('[srcset]').forEach((element) => {
    const value = element.getAttribute('srcset');

    if (!value) {
      return;
    }

    const resolved = value
      .split(',')
      .map((candidate) => {
        const [url, ...descriptor] = candidate.trim().split(/\s+/);
        return [resolveAssetUrl(url, pageUrl), ...descriptor].join(' ');
      })
      .join(', ');

    element.setAttribute('srcset', resolved);
  });

  const scripts = Array.from(source.querySelectorAll('script')).map((script) => {
    const pageScript: PageScript = {
      attributes: Array.from(script.attributes).map(({ name, value }) => [name, value]),
      content: script.textContent ?? '',
    };

    script.remove();
    return pageScript;
  });

  const headMarkup = Array.from(
    source.head.querySelectorAll('link[rel~="stylesheet"], style'),
  )
    .map((element) => element.outerHTML)
    .join('');

  return {
    bodyClassNames: Array.from(source.body.classList),
    documentClassNames: Array.from(source.documentElement.classList),
    documentDirection: source.documentElement.getAttribute('dir'),
    documentLanguage: source.documentElement.getAttribute('lang'),
    markup: `${headMarkup}${source.body.innerHTML}`,
    scripts,
    title: source.title,
  };
};

const addPageClasses = (element: HTMLElement, classNames: string[]) => {
  const added = classNames.filter((className) => !element.classList.contains(className));
  element.classList.add(...added);
  return () => element.classList.remove(...added);
};

const appendScript = (container: HTMLElement, pageScript: PageScript) => new Promise<void>((resolve) => {
  const script = document.createElement('script');

  pageScript.attributes.forEach(([name, value]) => script.setAttribute(name, value));
  script.textContent = pageScript.content;

  if (script.src) {
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => resolve(), { once: true });
  }

  container.appendChild(script);

  if (!script.src) {
    resolve();
  }
});

export const FullPagePreview = ({ html, path, title }: FullPagePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const page = useMemo(() => preparePage(html, path), [html, path]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const originalTitle = document.title;
    const originalLanguage = document.documentElement.getAttribute('lang');
    const originalDirection = document.documentElement.getAttribute('dir');
    const removeDocumentClasses = addPageClasses(document.documentElement, page.documentClassNames);
    const removeBodyClasses = addPageClasses(document.body, page.bodyClassNames);
    let active = true;

    if (page.title) {
      document.title = page.title;
    }

    if (page.documentLanguage) {
      document.documentElement.setAttribute('lang', page.documentLanguage);
    }

    if (page.documentDirection) {
      document.documentElement.setAttribute('dir', page.documentDirection);
    }

    const initializePage = async () => {
      for (const pageScript of page.scripts) {
        if (!active) {
          return;
        }

        await appendScript(container, pageScript);
      }

      if (active) {
        document.dispatchEvent(new Event('DOMContentLoaded'));
        container.dataset.pageReady = 'true';
      }
    };

    void initializePage();

    return () => {
      active = false;
      document.title = originalTitle;
      removeDocumentClasses();
      removeBodyClasses();

      if (originalLanguage === null) {
        document.documentElement.removeAttribute('lang');
      } else {
        document.documentElement.setAttribute('lang', originalLanguage);
      }

      if (originalDirection === null) {
        document.documentElement.removeAttribute('dir');
      } else {
        document.documentElement.setAttribute('dir', originalDirection);
      }
    };
  }, [page]);

  return (
    <div
      aria-label={`${title} page preview`}
      className='full-page-preview'
      data-page-preview
      ref={containerRef}
      // This is trusted markup from the canonical Natura11y package output.
      dangerouslySetInnerHTML={{ __html: page.markup }}
    />
  );
};
