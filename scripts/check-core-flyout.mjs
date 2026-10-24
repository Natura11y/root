import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-flyout.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../packages/core/src/js/flyout.js');
const modules = {
  '/flyout.js': source.replace(/\.\/utilities\/(overlay|focus)'/g, "./utilities/$1.js'"),
  '/utilities/overlay.js': await read('../packages/core/src/js/utilities/overlay.js'),
  '/utilities/focus.js': await read('../packages/core/src/js/utilities/focus.js'),
};
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/flyout/flyout-drill-down.example.html');
const secondMarkup = markup
  .replaceAll('flyout-drill-down-html', 'flyout-second')
  .replaceAll('flyout-panel-', 'flyout-second-panel-');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    for (const width of [548, 1687]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.setDefaultTimeout(5000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.route('**/*', route => {
        const path = new URL(route.request().url()).pathname;
        if (path === '/') {
          return route.fulfill({
            contentType: 'text/html',
            body: `
              <!doctype html>
              <html lang="en">
                <head>
                  <style>
                    ${styles}
                  </style>
                </head>
                <body>
                  <main id="examples">
                    ${markup}
                  </main>
                </body>
              </html>
            `,
          });
        }
        if (!modules[path]) return route.abort();
        return route.fulfill({ body: modules[path], contentType: 'text/javascript' });
      });
      await page.goto('http://natura11y.test/');
      await page.evaluate(async () => {
        window.Flyout = (await import('/flyout.js')).default;
        window.examples = document.querySelector('#examples');
        window.flyout = new window.Flyout().init(window.examples);
      });

      const trigger = page.locator('[data-open="flyout"]').first();
      const menu = page.locator('#flyout-drill-down-html');
      const close = menu.locator('[data-flyout-close]');
      const open = async () => {
        await trigger.focus();
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#flyout-drill-down-html')).opacity === '1');
        assert.equal(await close.evaluate(el => el === document.activeElement), true);
      };
      const closed = async () => {
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#flyout-drill-down-html')).visibility === 'hidden');
        assert.equal(await trigger.evaluate(el => el === document.activeElement), true, 'Return focus to the opener');
        assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), false);
      };

      await open();
      await menu.locator('[aria-controls="flyout-panel-wildlife"]').click();
      await page.evaluate(() => {
        window.flyout.init(window.examples);
        window.sameOwner = new window.Flyout().init(window.examples) === window.flyout;
      });
      assert.equal(await page.evaluate(() => window.sameOwner), true);
      assert.equal(await menu.locator('.flyout__panel:not([inert])').getAttribute('id'), 'flyout-panel-wildlife');
      assert.equal(await menu.locator('[data-flyout-back]').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Escape');
      await closed();

      // A real pointer click used to move focus to BODY after closing on pointerdown.
      await open();
      await page.mouse.click(5, 450);
      await closed();
      await open();
      await close.focus();
      await page.keyboard.press('Space');
      await closed();

      // Reinitialization also discovers newly added menus.
      await page.evaluate(markup => {
        window.examples.insertAdjacentHTML('beforeend', markup);
        window.flyout.init(window.examples);
      }, secondMarkup);
      const secondTrigger = page.locator('[data-open="flyout"]').nth(1);
      await secondTrigger.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#flyout-second').evaluate(el => el.classList.contains('shown')), true);
      await page.keyboard.press('Escape');
      assert.equal(await secondTrigger.evaluate(el => el === document.activeElement), true);

      // Teardown must work after the whole example is detached, including while open.
      await open();
      await page.evaluate(() => {
        window.examples.remove();
        window.flyout.destroy();
        window.flyout.destroy();
      });
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), false);
      assert.equal(await page.evaluate(() => window.examples.querySelector('.flyout.shown') === null), true);
      await page.evaluate(() => {
        document.body.append(window.examples);
        window.flyout = new window.Flyout().init(window.examples);
      });
      await open();
      await page.keyboard.press('Escape');
      await closed();

      // A removed open menu must still be cleaned up while its root remains mounted.
      await open();
      await page.evaluate(() => {
        window.removedMenu = document.querySelector('#flyout-drill-down-html');
        window.removedMenu.remove();
        window.flyout.destroy();
        window.flyout.destroy();
      });
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), false, 'Destroy releases the overlay after the open menu is removed');
      assert.equal(await page.locator('html').evaluate(el => el.style.getPropertyValue('--scroll-position')), '');
      assert.equal(await page.evaluate(() => window.removedMenu.classList.contains('shown')), false);
      assert.equal(await page.evaluate(() => window.removedMenu.getAttribute('aria-hidden')), 'true');
      assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.deepEqual(errors, [], 'Escape after destruction must not call a stale handler');

      // A stale focus trap on the detached menu must not close a later overlay.
      await page.evaluate(() => {
        window.flyout = new window.Flyout().init(window.examples);
      });
      await secondTrigger.focus();
      await page.keyboard.press('Enter');
      await page.evaluate(() => {
        window.removedMenu.querySelector('.flyout__content').dispatchEvent(
          new KeyboardEvent('keydown', { code: 'Escape', key: 'Escape', bubbles: true })
        );
      });
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), true, 'The detached menu no longer owns a focus trap');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), false);
      assert.equal(await secondTrigger.evaluate(el => el === document.activeElement), true);

      await page.evaluate(() => {
        window.examples.append(window.removedMenu);
        window.flyout.init(window.examples);
      });
      await open();
      await page.keyboard.press('Escape');
      await closed();

      assert.deepEqual(errors, []);
      console.log(`PASS ${browserType === chromium ? 'chrome' : 'firefox'} ${width}: repeated initialization, panel state, backdrop and keyboard focus return, multiple menus, teardown, removed open menus, detached focus traps and remounting`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
