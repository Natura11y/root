import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-dropdown.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../packages/core/src/js/dropdown.js');
const modules = {
  '/dropdown.js': source.replace(/\.\/utilities\/(overlay|eventDelegation|getCurrentBreakpoint)'/g, "./utilities/$1.js'"),
  '/utilities/overlay.js': await read('../packages/core/src/js/utilities/overlay.js'),
  '/utilities/focus.js': await read('../packages/core/src/js/utilities/focus.js'),
  '/utilities/eventDelegation.js': await read('../packages/core/src/js/utilities/eventDelegation.js'),
  '/utilities/getCurrentBreakpoint.js': await read('../packages/core/src/js/utilities/getCurrentBreakpoint.js'),
};
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/dropdown/dropdown.example.html');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    for (const width of [548, 1687]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
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

              <button id="outside" type="button">
                Outside
              </button>
            `,
          });
        }
        if (!modules[path]) return route.abort();
        return route.fulfill({ body: modules[path], contentType: 'text/javascript' });
      });
      await page.goto('http://natura11y.test/');

      await page.evaluate(async () => {
        window.listenerRegistrations = [];
        window.expansionWrites = [];
        const add = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, callback, options) {
          const capture = typeof options === 'boolean' ? options : !!options?.capture;
          if (
            new Error().stack.includes('http://natura11y.test/dropdown.js') &&
            !window.listenerRegistrations.some(item =>
              item.active && item.target === this && item.type === type && item.callback === callback && item.capture === capture
            )
          ) {
            window.listenerRegistrations.push({ target: this, type, callback, capture, active: true });
          }
          return add.call(this, type, callback, options);
        };
        const remove = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.removeEventListener = function (type, callback, options) {
          const capture = typeof options === 'boolean' ? options : !!options?.capture;
          window.listenerRegistrations.forEach(item => {
            if (item.target === this && item.type === type && item.callback === callback && item.capture === capture) {
              item.active = false;
            }
          });
          return remove.call(this, type, callback, options);
        };
        const setAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function (name, value) {
          if (name === 'aria-expanded' && this.matches('[data-toggle="dropdown"]')) {
            window.expansionWrites.push({ id: this.getAttribute('aria-controls'), value });
          }
          return setAttribute.call(this, name, value);
        };

        window.Dropdown = (await import('/dropdown.js')).default;
        window.dropdown = new window.Dropdown();
        window.dropdown.init();
      });

      const trigger = id => page.locator(`[aria-controls="${id}"]`);
      const state = async (id, expanded) => {
        assert.equal(await trigger(id).getAttribute('aria-expanded'), String(expanded));
        assert.equal(await page.locator(`#${id}`).evaluate(menu => menu.classList.contains('shown')), expanded);
      };
      const toggle = async (id, expanded, action = () => trigger(id).click()) => {
        await page.evaluate(() => { window.expansionWrites = []; });
        await action();
        await state(id, expanded);
        const writes = await page.evaluate(id => window.expansionWrites.filter(write => write.id === id), id);
        assert.deepEqual(writes, [{ id, value: String(expanded) }], 'One interaction must toggle its dropdown once');
      };
      const registrations = () => page.evaluate(() => window.listenerRegistrations.filter(item => item.active).length);
      const sharedRegistrations = () => page.evaluate(() => window.listenerRegistrations
        .filter(item => item.active && (item.target === window || item.target === document))
        .map(item => `${item.target === window ? 'window' : 'document'}:${item.type}`)
        .sort());
      const shared = ['document:click', 'document:keydown', 'window:click', 'window:resize'];

      await state('click-menu-id', false);
      await toggle('click-menu-id', true);
      const initialRegistrations = await registrations();
      await page.evaluate(() => {
        window.expansionWrites = [];
        for (let index = 0; index < 3; index++) {
          window.dropdown.init();
          new window.Dropdown().init();
        }
      });
      assert.deepEqual(await page.evaluate(() => window.expansionWrites), [], 'Repeated init preserves open state');
      assert.equal(await registrations(), initialRegistrations, 'Repeated init adds no listeners');
      assert.deepEqual(await sharedRegistrations(), shared);
      await state('click-menu-id', true);
      await toggle('click-menu-id', false);
      await toggle('click-menu-id', true, () => page.keyboard.press('Enter'));
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('#click-menu-id a').first().evaluate(link => link === document.activeElement), true);
      await toggle('click-menu-id', false, () => page.keyboard.press('Escape'));
      assert.equal(await trigger('click-menu-id').evaluate(button => button === document.activeElement), true);
      await toggle('click-menu-id', true, () => page.keyboard.press('Space'));

      // New elements initialize while existing dropdown state and shared handlers survive.
      await page.evaluate(markup => {
        document.querySelector('#examples').insertAdjacentHTML('beforeend', markup.replaceAll('-menu-id', '-later-id'));
        new window.Dropdown().init();
      }, markup);
      await state('click-menu-id', true);
      await state('click-later-id', false);
      await toggle('click-menu-id', false, () => page.keyboard.press('Escape'));
      await toggle('click-later-id', true);
      await page.locator('#click-later-id a').first().focus();
      await page.locator('#outside').focus();
      const inline = await page.locator('#click-later-id').evaluate(menu => getComputedStyle(menu).position !== 'absolute');
      await state('click-later-id', inline);
      await trigger('click-later-id').focus();
      if (!inline) await toggle('click-later-id', true, () => page.keyboard.press('Enter'));
      await toggle('click-later-id', false, () => page.keyboard.press('Escape'));
      assert.deepEqual(await sharedRegistrations(), shared);

      // Replacing story markup must initialize the new nodes exactly once.
      for (let cycle = 0; cycle < 3; cycle++) {
        await page.evaluate(markup => {
          document.querySelector('#examples').innerHTML = markup;
          new window.Dropdown().init();
        }, markup);
        await toggle('click-menu-id', true);
        await toggle('click-menu-id', false);
        assert.deepEqual(await sharedRegistrations(), shared);
      }

      // The original resize listener must continue updating newly mounted hover menus.
      await page.mouse.move(0, 0);
      for (const resizedWidth of [1687, 548, 1687]) {
        await page.setViewportSize({ width: resizedWidth, height: 900 });
        await page.waitForFunction(desktop =>
          !!document.querySelector('[data-hover="true"]')._hasHoverListeners === desktop,
          resizedWidth >= 992,
        );
      }
      const hover = trigger('hover-menu-id');
      await hover.hover();
      await state('hover-menu-id', true);
      await page.mouse.move(0, 0);
      await page.waitForFunction(() => document.querySelector('[aria-controls="hover-menu-id"]').getAttribute('aria-expanded') === 'false');
      // Destruction releases all handlers; scoped reinitialization leaves outside markup alone.
      await page.evaluate(() => window.dropdown.destroy());
      assert.equal(await registrations(), 0, 'Destroy removes all Dropdown listeners');
      await page.evaluate(markup => {
        const root = document.querySelector('#examples');
        root.innerHTML = markup;
        root.insertAdjacentHTML('afterend', `<section id="unmanaged">${markup.replaceAll('-menu-id', '-outside-id')}</section>`);
        window.dropdown = new window.Dropdown().init(root);
        window.sameOwner = new window.Dropdown().init(root) === window.dropdown;
      }, markup);
      assert.equal(await page.evaluate(() => window.sameOwner), true, 'Repeated scoped init returns its owner');
      await trigger('click-outside-id').click();
      await state('click-outside-id', false);
      await toggle('click-menu-id', true);
      await toggle('click-menu-id', false);

      // A detached story with pending hover work must leave no timer, observer, or listeners.
      await hover.hover();
      await state('hover-menu-id', true);
      await page.evaluate(() => {
        const button = document.querySelector('[aria-controls="hover-menu-id"]');
        window.hoverObserverDisconnected = false;
        const observer = button._hoverObserver;
        const disconnect = observer.disconnect.bind(observer);
        observer.disconnect = () => {
          window.hoverObserverDisconnected = true;
          disconnect();
        };
        button.dispatchEvent(new MouseEvent('mouseleave'));
        window.hadPendingHover = typeof button._hoverTimeout === 'number';
        window.detachedExample = document.querySelector('#examples');
        window.detachedExample.remove();
        window.dropdown.destroy();
        window.dropdown.destroy();
        window.expansionWrites = [];
      });
      assert.equal(await registrations(), 0);
      assert.equal(await page.evaluate(() => window.hadPendingHover && window.hoverObserverDisconnected), true);
      await page.waitForTimeout(450);
      assert.deepEqual(await page.evaluate(() => window.expansionWrites), [], 'No hover callback runs after destroy');
      await page.evaluate(() => {
        const root = window.detachedExample;
        document.body.prepend(root);
        window.dropdown.init(root);
      });
      await toggle('click-menu-id', true);
      await toggle('click-menu-id', false);

      // An owned mega overlay must be released even after resizing below its breakpoint.
      await page.evaluate(() => {
        document.querySelector('#click-menu-id').classList.add('mega-menu--lg');
      });
      await trigger('click-menu-id').focus();
      await toggle('click-menu-id', true, () => page.keyboard.press('Enter'));
      assert.equal(await page.locator('html').evaluate(root => root.classList.contains('has-overlay')), true);
      await page.setViewportSize({ width: 548, height: 900 });
      await page.waitForFunction(() => !document.querySelector('[data-hover="true"]')._hasHoverListeners);
      await page.evaluate(() => window.dropdown.destroy());
      assert.equal(await page.locator('html').evaluate(root => root.classList.contains('has-overlay')), false);
      assert.equal(await registrations(), 0);

      assert.deepEqual(errors, []);
      console.log(`PASS ${browserType === chromium ? 'chrome' : 'firefox'} ${width}: repeated init, preserved state, keyboard/focus, new dropdowns, remounts, responsive hover, scoped ownership and destruction`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
