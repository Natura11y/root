import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-modal.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../packages/core/src/js/modal.js');
const modules = {
  '/modal.js': source.replace(/\.\/utilities\/(overlay|eventDelegation|focus)'/g, "./utilities/$1.js'"),
  '/utilities/overlay.js': await read('../packages/core/src/js/utilities/overlay.js'),
  '/utilities/focus.js': await read('../packages/core/src/js/utilities/focus.js'),
  '/utilities/eventDelegation.js': await read('../packages/core/src/js/utilities/eventDelegation.js'),
};
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/modal/modal.example.html');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    for (const width of [548, 1687]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('https://**/*', route => route.fulfill({ body: '', contentType: 'text/css' }));
      await page.route('http://natura11y.test/**', route => {
        const path = new URL(route.request().url()).pathname;
        if (path === '/') {
          return route.fulfill({
            contentType: 'text/html',
            body: `
              <!doctype html>
              <style>
                ${styles}
              </style>

              <main id="examples">
                ${markup}
              </main>
            `,
          });
        }
        if (!modules[path]) return route.abort();
        return route.fulfill({ body: modules[path], contentType: 'text/javascript' });
      });
      await page.goto('http://natura11y.test/');

      await page.evaluate(async () => {
        window.Modal = (await import('/modal.js')).default;
        window.modal = new window.Modal();
        window.modal.init();

        // Count actual openings so duplicate work cannot hide behind identical visible state.
        window.openings = 0;
        const openModal = window.Modal.prototype.openModal;
        window.Modal.prototype.openModal = function (...args) {
          window.openings++;
          return openModal.apply(this, args);
        };
      });

      const trigger = id => page.locator(`[data-modal="open"][aria-controls="${id}"]`);
      const panel = id => page.locator(`#${id}`);
      const state = async (id, open) => {
        assert.equal(await panel(id).evaluate(el => el.classList.contains('shown')), open);
        assert.equal(await panel(id).getAttribute('aria-hidden'), String(!open));
        assert.equal(await panel(id).evaluate(el => el.inert), !open);
      };
      const open = async (id, key = 'Enter') => {
        await page.evaluate(() => { window.openings = 0; });
        await trigger(id).focus();
        await page.keyboard.press(key);
        await state(id, true);
        assert.equal(await page.evaluate(() => window.openings), 1, 'One activation must open the modal once');
        assert.equal(await panel(id).locator('[data-modal-close]').evaluate(el => el === document.activeElement), true);
      };
      const close = async (id, escape = true) => {
        if (escape) await page.keyboard.press('Escape');
        else await panel(id).locator('[data-modal-close]').click();
        await state(id, false);
        assert.equal(await trigger(id).evaluate(el => el === document.activeElement), true, 'Closing must return focus to the opener');
        assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), false);
      };

      await state('modal-html', false);
      await open('modal-html');
      await page.keyboard.press('Tab');
      await page.evaluate(() => {
        window.focusBeforeInit = document.activeElement;
        for (let index = 0; index < 3; index++) {
          window.modal.init();
          new window.Modal().init();
        }
      });
      await state('modal-html', true);
      assert.equal(await page.evaluate(() => document.activeElement === window.focusBeforeInit), true, 'Repeated init preserves focus in an open dialog');
      assert.equal(await page.evaluate(() => window.openings), 1, 'Repeated init does not reopen the dialog');
      await close('modal-html');
      await open('modal-html', 'Space');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await panel('modal-html').locator('a').last().evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Tab');
      assert.equal(await panel('modal-html').locator('[data-modal-close]').evaluate(el => el === document.activeElement), true);
      await close('modal-html', false);

      // New and remounted dialogs still receive closed-state setup and the existing delegation.
      await page.evaluate(markup => {
        document.querySelector('#examples').insertAdjacentHTML('beforeend', markup.replaceAll('modal-html', 'modal-later'));
        new window.Modal().init();
      }, markup);
      await state('modal-later', false);
      await open('modal-later');
      await state('modal-html', false);
      await close('modal-later');

      for (let cycle = 0; cycle < 3; cycle++) {
        await page.evaluate(markup => {
          document.querySelector('#examples').innerHTML = markup;
          new window.Modal().init();
        }, markup);
        await state('modal-html', false);
        await open('modal-html');
        await close('modal-html', cycle % 2 === 0);
      }

      assert.deepEqual(errors, []);
      console.log(`PASS ${browserType === chromium ? 'chrome' : 'firefox'} ${width}: repeated init, single opening, preserved state/focus, focus trap/return, new and remounted dialogs`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
