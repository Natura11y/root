type CodeLineAnchor = {
  start: number;
  range: string;
};

const lineAnchorSetupKey = '__natura11yCodeLineAnchors';
const copySetupKey = '__natura11yCodeCopy';
const copyFeedbackDuration = 4000;

const getAnchorRanges = (value: string): CodeLineAnchor[] => {
  return value
    .split(',')
    .map((part) => part.trim().replace(/\s+/gu, ''))
    .filter(Boolean)
    .map((range) => {
      const start = Number.parseInt(range.split('-')[0] ?? '', 10);
      return Number.isNaN(start) ? null : { start, range };
    })
    .filter((anchor): anchor is CodeLineAnchor => anchor !== null);
};

const applyLineAnchors = (): void => {
  document.querySelectorAll('[data-code-id][data-line-anchors]').forEach((codeBlock) => {
    const codeId = codeBlock.getAttribute('data-code-id');
    const lineAnchors = codeBlock.getAttribute('data-line-anchors');

    if (!codeId || !lineAnchors) {
      return;
    }

    const lines = codeBlock.querySelectorAll('.ec-line');
    const ranges = getAnchorRanges(lineAnchors);

    ranges.forEach(({ start, range }) => {
      const line = lines[start - 1];

      if (line instanceof HTMLElement) {
        line.id = `${codeId}.${range}`;
      }
    });
  });
};

const setupLineAnchors = (): void => {
  if (Reflect.get(window, lineAnchorSetupKey)) {
    return;
  }

  Reflect.set(window, lineAnchorSetupKey, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLineAnchors, { once: true });
  } else {
    applyLineAnchors();
  }
};

const copyWithFallback = (value: string): boolean => {
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.insetBlockStart = '0';
  field.style.insetInlineStart = '-9999px';

  document.body.append(field);
  field.select();

  let didCopy = false;

  try {
    didCopy = document.execCommand('copy');
  } finally {
    field.remove();
  }

  return didCopy;
};

const setCopyButtonText = (button: HTMLButtonElement, value: string): void => {
  button.textContent = value;
  button.setAttribute('aria-label', value === 'Copied' ? 'Code copied' : 'Copy code');
};

const setupCodeCopy = (): void => {
  if (Reflect.get(window, copySetupKey)) {
    return;
  }

  Reflect.set(window, copySetupKey, true);

  document.addEventListener('click', async (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest('[data-code-copy]');

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const codeBlock = button.closest('.example__code');
    const source = codeBlock?.querySelector('[data-code-source]');

    if (!(source instanceof HTMLTemplateElement)) {
      return;
    }

    const code = source.content.textContent ?? '';
    let didCopy = false;

    try {
      await navigator.clipboard.writeText(code);
      didCopy = true;
    } catch {
      didCopy = copyWithFallback(code);
    }

    if (!didCopy) {
      return;
    }

    setCopyButtonText(button, 'Copied');
    window.setTimeout(() => setCopyButtonText(button, 'Copy'), copyFeedbackDuration);
  });
};

setupLineAnchors();
setupCodeCopy();