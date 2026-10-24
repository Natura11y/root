import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-modal.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../packages/core/src/js/modal.js');
const modules = {
  '/modal.js': source.replace(/\.\/utilities\/(overlay|focus)'/g, "./utilities/$1.js'"),
  '/utilities/overlay.js': await read('../packages/core/src/js/utilities/overlay.js'),
  '/utilities/focus.js': await read('../packages/core/src/js/utilities/focus.js'),
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
        window.modalListeners = [];
        const add = EventTarget.prototype.addEventListener;
        const remove = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.addEventListener = function (type, callback, options) {
          const capture = typeof options === 'boolean' ? options : !!options?.capture;
          if (/natura11y\.test\/(modal|utilities\/focus)\.js/.test(new Error().stack) &&
              !window.modalListeners.some(item => item.active && item.target === this && item.type === type && item.callback === callback && item.capture === capture)) {
            window.modalListeners.push({ target: this, type, callback, capture, active: true });
          }
          return add.call(this, type, callback, options);
        };
        EventTarget.prototype.removeEventListener = function (type, callback, options) {
          const capture = typeof options === 'boolean' ? options : !!options?.capture;
          window.modalListeners.forEach(item => {
            if (item.target === this && item.type === type && item.callback === callback && item.capture === capture) item.active = false;
          });
          return remove.call(this, type, callback, options);
        };

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

      // Hidden, disabled, and non-tabbable controls must not become trap boundaries.
      await page.evaluate(() => {
        const content = document.querySelector('#modal-html .modal__content');
        window.expectedFocus = [...content.querySelectorAll('button, a[href]')];
        const unavailable = `
          <div data-focus-test style="position: fixed; left: -10000px">
            <button style="display: none">
              Hidden button
            </button>
            <div style="display: none">
              <a href="#hidden">
                Hidden ancestor
              </a>
            </div>
            <button style="visibility: hidden">
              Invisible button
            </button>
            <div hidden>
              <button>
                Hidden attribute
              </button>
            </div>
            <div inert>
              <button>
                Inert control
              </button>
            </div>
            <input type="hidden" />
            <button disabled>
              Disabled button
            </button>
            <fieldset disabled>
              <input aria-label="Disabled fieldset input" />
            </fieldset>
            <button tabindex="-1">
              Programmatic focus only
            </button>
          </div>
        `;
        content.insertAdjacentHTML('afterbegin', unavailable);
        content.insertAdjacentHTML('beforeend', unavailable);
      });
      await open('modal-html');
      assert.equal(await page.evaluate(async () => {
        const { getFocusableElements } = await import('/utilities/focus.js');
        const actual = getFocusableElements(document.querySelector('#modal-html .modal__content'));
        return actual.length === window.expectedFocus.length &&
          actual.every((element, index) => element === window.expectedFocus[index]);
      }), true, 'Only the original available controls belong in the focus list');

      for (const direction of ['Tab', 'Shift+Tab']) {
        const count = await page.evaluate(() => window.expectedFocus.length);
        for (let step = 1; step <= count; step++) {
          await page.keyboard.press(direction);
          const index = direction === 'Tab' ? step % count : (count - step) % count;
          assert.equal(await page.evaluate(index =>
            document.activeElement === window.expectedFocus[index], index
          ), true, `${direction} must cycle through the available controls`);
        }
      }
      await close('modal-html');
      await page.locator('[data-focus-test]').evaluateAll(elements => elements.forEach(element => element.remove()));

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

      const listeners = () => page.evaluate(() => window.modalListeners.filter(item => item.active).length);
      assert.equal(await listeners(), 1, 'Closing releases focus, close-button and Escape handlers');
      await page.evaluate(() => window.modal.destroy());
      assert.equal(await listeners(), 0, 'Destroy removes the opening listener too');

      // Scoped initialization must ignore matching markup outside its container.
      await page.evaluate(markup => {
        const root = document.querySelector('#examples');
        root.insertAdjacentHTML('afterend', markup.replaceAll('modal-html', 'modal-outside'));
        window.modal = new window.Modal().init(root);
        window.sameOwner = new window.Modal().init(root) === window.modal;
        window.openings = 0;
      }, markup);
      assert.equal(await page.evaluate(() => window.sameOwner), true);
      await trigger('modal-outside').click();
      assert.equal(await page.evaluate(() => window.openings), 0);
      assert.equal(await panel('modal-outside').evaluate(el => el.classList.contains('shown')), false);

      // Unmount an open example, including outside-click handling, before destroying it.
      await panel('modal-html').evaluate(el => { el.dataset.modalCloseOutside = 'true'; });
      await open('modal-html');
      assert.equal(await listeners(), 5, 'All owned listener types are present before cleanup');
      await page.evaluate(() => {
        window.detachedExample = document.querySelector('#examples');
        window.detachedExample.remove();
        window.modal.destroy();
        window.modal.destroy();
      });
      assert.equal(await listeners(), 0, 'Detached dialog cleanup removes every owned listener');
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), false);
      assert.equal(await page.locator('html').evaluate(el => el.style.getPropertyValue('--scroll-position')), '');
      assert.equal(await page.evaluate(() => {
        const modal = window.detachedExample.querySelector('.modal');
        return modal.inert && modal.getAttribute('aria-hidden') === 'true' && !modal.classList.contains('shown');
      }), true);

      // Old detached content cannot handle Escape or Tab or disturb a new overlay.
      await page.evaluate(() => {
        document.documentElement.classList.add('has-overlay');
        const content = window.detachedExample.querySelector('.modal__content');
        content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }));
      });
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), true);
      await page.evaluate(() => {
        document.documentElement.classList.remove('has-overlay');
        document.body.prepend(window.detachedExample);
        window.modal.init(window.detachedExample);
      });
      await open('modal-html');
      await close('modal-html');
      await page.evaluate(() => window.modal.destroy());
      assert.equal(await listeners(), 0);

      assert.deepEqual(errors, []);
      console.log(`PASS ${browserType === chromium ? 'chrome' : 'firefox'} ${width}: repeated init, focus/state, remounts, scoped ownership and complete listener/overlay cleanup`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
