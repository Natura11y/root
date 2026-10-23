import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-collapse.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../packages/core/src/js/collapse.js');
const modules = {
  '/collapse.js': source
    .replace('./utilities/focus', './utilities/focus.js')
    .replace('./utilities/eventDelegation', './utilities/eventDelegation.js'),
  '/utilities/focus.js': await read('../packages/core/src/js/utilities/focus.js'),
  '/utilities/overlay.js': await read('../packages/core/src/js/utilities/overlay.js'),
  '/utilities/eventDelegation.js': await read('../packages/core/src/js/utilities/eventDelegation.js'),
};
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/collapse/collapse.example.html');
const closeTargetMarkup = await read('../apps/storybook/stories/collapse/collapse-close-target.example.html');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch();

  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => route.fulfill({ body: '', contentType: 'text/css' }));

    // Serve source modules in memory, including the existing focus/overlay circular imports.
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
              ${closeTargetMarkup}
            </main>
          `,
        });
      }
      const module = modules[path];
      if (!module) return route.abort();
      return route.fulfill({ body: module, contentType: 'text/javascript' });
    });
    await page.goto('http://natura11y.test/');

    await page.evaluate(async () => {
      window.documentClickListeners = 0;
      window.expansionWrites = [];
      const addEventListener = document.addEventListener;
      document.addEventListener = function (type, ...args) {
        if (type === 'click') window.documentClickListeners++;
        return addEventListener.call(this, type, ...args);
      };
      const setAttribute = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function (name, value) {
        if (name === 'aria-expanded' && this.matches('[data-toggle="collapse"]')) {
          window.expansionWrites.push({ target: this.getAttribute('aria-controls'), value });
        }
        return setAttribute.call(this, name, value);
      };

      window.Collapse = (await import('/collapse.js')).default;
      window.collapse = new window.Collapse();
      window.collapse.init();
    });

    const trigger = id => page.locator(`[aria-controls="${id}"]`);
    const verifyState = async (id, expanded) => {
      assert.equal(await trigger(id).getAttribute('aria-expanded'), String(expanded));
      assert.equal(await page.locator(`#${id}`).evaluate(el => el.classList.contains('shown')), expanded);
      assert.equal(await page.locator(`#${id}`).evaluate(el => el.inert), !expanded);
    };
    const verifyToggle = async (id, expanded, action = () => trigger(id).click()) => {
      await page.evaluate(() => { window.expansionWrites = []; });
      await action();
      await verifyState(id, expanded);
      const writes = await page.evaluate(id => window.expansionWrites.filter(write => write.target === id), id);
      assert.deepEqual(writes, [{ target: id, value: String(expanded) }], 'One interaction must toggle its panel once');
    };

    await verifyState('collapse-html', false);
    await verifyToggle('collapse-html', true);

    await page.evaluate(() => {
      for (let index = 0; index < 3; index++) {
        window.collapse.init();
        new window.Collapse().init();
      }
    });
    assert.equal(await page.evaluate(() => window.documentClickListeners), 1, 'Repeated init must not add document click handlers');
    await verifyState('collapse-html', true);
    await verifyToggle('collapse-html', false);
    await verifyToggle('collapse-html', true, () => page.keyboard.press('Enter'));
    assert.equal(await page.locator('#collapse-html').evaluate(el => el === document.activeElement), true);
    await verifyToggle('collapse-html', false, () => page.keyboard.press('Escape'));
    assert.equal(await trigger('collapse-html').evaluate(el => el === document.activeElement), true);
    await verifyToggle('collapse-html', true, () => page.keyboard.press('Space'));

    // Later panels must receive initial inert state and retain the original document handler.
    await page.evaluate(markup => {
      const section = document.createElement('section');
      section.innerHTML = markup.replaceAll('collapse-html', 'collapse-later');
      document.querySelector('#examples').append(section);
      new window.Collapse().init();
    }, markup);
    await verifyState('collapse-later', false);
    await verifyState('collapse-html', true);
    await verifyToggle('collapse-later', true);
    await page.locator('#collapse-later a').first().focus();
    await verifyToggle('collapse-later', false, () => page.keyboard.press('Escape'));
    assert.equal(await trigger('collapse-later').evaluate(el => el === document.activeElement), true);
    await verifyState('collapse-html', true);

    // Close Target must open one panel and close the other exactly once.
    const first = 'collapse-target-one-story';
    const second = 'collapse-target-two-story';
    await verifyToggle(first, true);
    await verifyToggle(second, true);
    await verifyState(first, false);
    assert.deepEqual(await page.evaluate(() => window.expansionWrites), [
      { target: second, value: 'true' },
      { target: first, value: 'false' },
    ]);
    await page.evaluate(() => new window.Collapse().init());
    await verifyState(second, true);
    await verifyToggle(first, true);
    await verifyState(second, false);

    // Replacement fixtures model story remounts in the same document.
    for (let index = 0; index < 3; index++) {
      await page.evaluate(markup => {
        document.querySelector('#examples').innerHTML = markup;
        new window.Collapse().init();
      }, markup);
      await verifyState('collapse-html', false);
      await verifyToggle('collapse-html', true);
      await page.locator('#collapse-html a').first().focus();
      await verifyToggle('collapse-html', false, () => page.keyboard.press('Escape'));
      assert.equal(await trigger('collapse-html').evaluate(el => el === document.activeElement), true);
    }

    // Document delegation must still handle new buttons before another init call.
    await page.evaluate(markup => {
      document.querySelector('#examples').insertAdjacentHTML('beforeend', markup.replaceAll('collapse-html', 'collapse-dynamic'));
    }, markup);
    await verifyToggle('collapse-dynamic', true);
    assert.equal(await page.evaluate(() => window.documentClickListeners), 1);
    assert.deepEqual(errors, []);
    console.log(`PASS ${browserType.name()}: one document listener, repeated instances, preserved state, keyboard/focus, new panels, Close Target, remounts, dynamic delegation`);
  } finally {
    await browser.close();
  }
}
