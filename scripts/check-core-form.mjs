import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run: node scripts/check-core-form.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const modules = {
  '/form.js': (await read('../packages/core/src/js/form.js'))
    .replace('./utilities/eventDelegation', './utilities/eventDelegation.js'),
  '/utilities/eventDelegation.js': await read('../packages/core/src/js/utilities/eventDelegation.js'),
};
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/form/form.example.html');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const path = new URL(route.request().url()).pathname;
      if (path === '/') return route.fulfill({
        contentType: 'text/html',
        body: `
          <!doctype html>
          <style>
            ${styles}
          </style>

          ${markup}

          <button id="outside" type="button">
            Outside
          </button>
        `,
      });
      if (modules[path]) return route.fulfill({ body: modules[path], contentType: 'text/javascript' });
      return route.abort();
    });
    await page.goto('http://natura11y.test/');
    await page.evaluate(async () => {
      // Reuse the real entry structure for all three delegated control types.
      const original = document.querySelector('.form-entry');
      for (const tag of ['select', 'textarea']) {
        const entry = original.cloneNode(true);
        const input = entry.querySelector('input');
        const control = document.createElement(tag);
        control.id = `form-${tag}`;
        control.name = tag;
        entry.querySelector('.form-entry__field__label').textContent = tag;
        entry.querySelector('.form-entry__help').remove();
        if (tag === 'select') {
          input.parentElement.className = 'form-entry__field__select';
          control.add(new Option('Choose', ''));
          control.add(new Option('One', 'one'));
        }
        input.replaceWith(control);
        original.parentElement.append(entry);
      }
      original.setAttribute('data-required', '');
      window.entries = [...document.querySelectorAll('.form-entry')];
      window.focusWrites = [];
      const toggle = DOMTokenList.prototype.toggle;
      DOMTokenList.prototype.toggle = function (token, ...args) {
        if (token === 'is-focused' && window.entries.some(entry => entry.classList === this)) {
          window.focusWrites.push(args[0]);
        }
        return toggle.call(this, token, ...args);
      };
      window.FormInput = (await import('/form.js')).default;
      window.form = new window.FormInput();
      window.form.init();
    });

    const fields = ['#form-entry-html', '#form-select', '#form-textarea'];
    const outside = page.locator('#outside');
    const verifyFocus = async enabled => {
      for (const selector of fields) {
        await outside.focus();
        await page.evaluate(() => { window.focusWrites = []; });
        await page.locator(selector).focus();
        assert.equal(await page.locator(selector).evaluate(el => el.closest('.form-entry').classList.contains('is-focused')), enabled);
        await outside.focus();
        assert.deepEqual(await page.evaluate(() => window.focusWrites), enabled ? [true, false] : [], 'One focus update per event; none after cleanup');
      }
    };

    await verifyFocus(true);
    await page.evaluate(() => window.form.cleanup());
    await verifyFocus(false);
    await page.evaluate(() => window.form.cleanup());

    for (let cycle = 0; cycle < 3; cycle++) {
      await page.evaluate(() => window.form.init());
      await verifyFocus(true);
      await page.locator(fields[0]).focus();
      await page.evaluate(() => {
        // Repeated init must preserve current focus and avoid adding duplicate listeners.
        window.focusBeforeInit = document.activeElement;
        window.form.init();
        window.form.init();
      });
      assert.equal(await page.evaluate(() => document.activeElement === window.focusBeforeInit), true);
      await outside.focus();
      await verifyFocus(true);
      await page.evaluate(() => window.form.cleanup());
      await verifyFocus(false);
    }

    // A replacement owner can initialize the same fields after the previous owner cleans up.
    await page.evaluate(() => { window.form = new window.FormInput(); window.form.init(); });
    await verifyFocus(true);
    await page.locator(fields[0]).fill('Carl');
    await outside.focus();
    assert.equal(await page.locator(fields[0]).evaluate(el => el.closest('.form-entry').classList.contains('has-value')), true);
    await page.locator(fields[0]).fill('');
    assert.equal(await page.locator(fields[0]).getAttribute('aria-invalid'), 'true');
    await page.locator(fields[0]).fill('Carl');
    assert.equal(await page.locator(fields[0]).getAttribute('aria-invalid'), 'false');
    await outside.focus();
    await page.evaluate(() => window.form.cleanup());

    // The delegate still handles clicks on a matching element's child, and its remover is reusable.
    await page.evaluate(async () => {
      const { delegateEvent } = await import('/utilities/eventDelegation.js');
      const span = document.createElement('span');
      span.textContent = 'Outside';
      document.querySelector('#outside').replaceChildren(span);
      window.clicks = 0;
      window.removeClick = delegateEvent(document, 'click', '#outside', () => window.clicks++);
    });
    await outside.locator('span').click();
    assert.equal(await page.evaluate(() => window.clicks), 1);
    await page.evaluate(() => { window.removeClick(); window.removeClick(); });
    await outside.locator('span').click();
    assert.equal(await page.evaluate(() => window.clicks), 1);
    assert.deepEqual(errors, []);
    console.log(`PASS ${browserType === chromium ? 'chrome' : 'firefox'}: input/select/textarea cleanup, repeated init, replacement owner, focus preservation, value/validation and delegated removal`);
    await page.close();
  } finally {
    await browser.close();
  }
}
