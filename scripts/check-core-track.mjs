import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-track.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../packages/core/src/js/track.js');
const modules = {
  '/track.js': source.replace(/\.\/utilities\/(eventDelegation|focus)'/g, "./utilities/$1.js'"),
  '/utilities/eventDelegation.js': await read('../packages/core/src/js/utilities/eventDelegation.js'),
  '/utilities/focus.js': await read('../packages/core/src/js/utilities/focus.js'),
  '/utilities/overlay.js': await read('../packages/core/src/js/utilities/overlay.js'),
};
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/track/track.example.html');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    for (const reducedMotion of ['reduce', 'no-preference']) {
      const page = await browser.newPage({ viewport: { width: 548, height: 900 }, reducedMotion });
      page.setDefaultTimeout(8000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.route('**/*', route => {
        const path = new URL(route.request().url()).pathname;
        if (path === '/') {
          return route.fulfill({
            contentType: 'text/html',
            body: `<!doctype html>
              <style>${styles}</style>
              <main>
                <div id="first-track">${markup}</div>
                <div id="second-track">${markup.replaceAll('carousel-heading', 'second-heading')}</div>
              </main>
            `,
          });
        }
        if (modules[path]) return route.fulfill({ body: modules[path], contentType: 'text/javascript' });
        if (path.startsWith('/story-assets/')) {
          return route.fulfill({
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="548" height="120"><rect width="548" height="120" fill="#ddd"/></svg>',
          });
        }
        return route.abort();
      });
      await page.goto('http://natura11y.test/');
      await page.evaluate(async () => {
        window.Track = (await import('/track.js')).default;
        window.track = new window.Track();
        window.track.init();
      });
      await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await page.waitForTimeout(100);

      const first = page.locator('#first-track .track');
      const second = page.locator('#second-track .track');
      const settled = async (group, index) => {
        await page.waitForFunction(({ group, index }) => {
          const track = document.querySelector(`#${group} .track`);
          const panels = track.querySelector('.track__panels');
          return track.currentPageIndex === index && !track.isNavigating &&
            track.querySelector(`[data-page-index="${index}"]`)?.getAttribute('aria-current') === 'true' &&
            Math.abs(panels.scrollLeft - track.pages[index][0].offsetLeft) < 1;
        }, { group, index });
      };
      const once = async (action, index, group = 'first-track') => {
        await page.evaluate(() => { window.scrollCalls = 0; });
        await action();
        await settled(group, index);
        assert.equal(await page.evaluate(() => window.scrollCalls), 1, 'One interaction must navigate exactly once');
      };

      await page.evaluate(() => {
        const scrollTo = Element.prototype.scrollTo;
        window.scrollCalls = 0;
        Element.prototype.scrollTo = function (...args) {
          if (this.matches('.track__panels')) window.scrollCalls++;
          return scrollTo.apply(this, args);
        };
      });
      await once(() => first.locator('[data-track-next]').click(), 1);
      await once(() => second.locator('[data-track-next]').click(), 1, 'second-track');
      await first.locator('[data-page-index="1"]').focus();

      await page.evaluate(() => {
        window.savedFocus = document.activeElement;
        window.savedPagination = document.querySelector('#first-track [data-track-pagination] button');
        window.savedScroll = document.querySelector('#first-track .track__panels').scrollLeft;
        window.scrollCalls = 0;
        for (let index = 0; index < 3; index++) {
          window.track.init();
          new window.Track().init();
        }
      });
      assert.equal(await first.evaluate(track => track.currentPageIndex), 1, 'Repeated init preserves the selected page');
      assert.equal(await second.evaluate(track => track.currentPageIndex), 1, 'Repeated init preserves every track');
      assert.equal(await page.evaluate(() => document.activeElement === window.savedFocus), true, 'Repeated init preserves focus');
      assert.equal(await page.evaluate(() => document.querySelector('#first-track [data-track-pagination] button') === window.savedPagination), true, 'Repeated init keeps existing pagination');
      assert.equal(await first.locator('.track__panels').evaluate(panels => panels.scrollLeft === window.savedScroll), true);
      assert.equal(await page.evaluate(() => window.scrollCalls), 0);

      await once(() => first.locator('[data-track-next]').click(), 2);
      await once(() => page.keyboard.press('ArrowLeft'), 1);
      await once(() => page.keyboard.press('Enter'), 0);
      await first.locator('[data-track-next]').focus();
      await once(() => page.keyboard.press('Space'), 1);
      await once(() => first.locator('[data-page-index="2"]').click(), 2);
      await once(() => second.locator('[data-track-next]').click(), 2, 'second-track');

      // Destroy must remove all controls; reinitialization must restore them once.
      for (const newInstance of [false, true]) {
        const previousIndex = await first.evaluate(track => track.currentPageIndex);
        await page.evaluate(() => {
          window.scrollCalls = 0;
          window.track.destroy(document.querySelector('#first-track .track'));
        });
        await first.locator('[data-track-next]').click();
        await first.locator('[data-track-prev]').click();
        await first.locator('[data-page-index="0"]').click();
        await first.locator('[data-track-next]').focus();
        await page.keyboard.press('ArrowRight');
        assert.equal(await page.evaluate(() => window.scrollCalls), 0, 'Destroyed controls must not navigate');
        assert.equal(await first.evaluate(track => track.currentPageIndex), previousIndex);

        await page.evaluate(newInstance => {
          const trackElement = document.querySelector('#first-track .track');
          trackElement.classList.add('track--column-3--lg');
          if (newInstance) window.track = new window.Track();
          window.track.init();
        }, newInstance);
        await settled('first-track', 0);
        await once(() => first.locator('[data-track-next]').click(), 1);
        await once(() => page.keyboard.press('ArrowRight'), 2);
        await once(() => page.keyboard.press('ArrowLeft'), 1);
        await once(() => first.locator('[data-track-prev]').click(), 0);
        await once(() => first.locator('[data-page-index="2"]').click(), 2);

        // Responsive CSS and JavaScript pagination must still agree after cleanup.
        await page.setViewportSize({ width: 1687, height: 900 });
        await page.waitForFunction(() => {
          const track = document.querySelector('#first-track .track');
          return track.pages.length === 1 && track.classList.contains('hide-controls');
        });
        assert.equal(await first.locator('[data-page-index]').count(), 1);
        assert.equal(await first.locator('.track__panels').evaluate(panels =>
          Number.parseInt(getComputedStyle(panels).getPropertyValue('--_visible-panels'), 10)
        ), 3);

        await page.setViewportSize({ width: 548, height: 900 });
        await page.waitForFunction(() => {
          const track = document.querySelector('#first-track .track');
          return track.pages.length === 3 && !track.classList.contains('hide-controls');
        });
        assert.equal(await first.locator('[data-page-index]').count(), 3);
        await settled('first-track', 0);
        await once(() => first.locator('[data-track-next]').click(), 1);
        await once(() => second.locator('[data-track-next]').click(), 1, 'second-track');
        await once(() => second.locator('[data-page-index="2"]').click(), 2, 'second-track');
      }

      // Newly mounted elements still initialize, while the other track keeps its state.
      await page.evaluate(markup => {
        document.querySelector('#first-track').innerHTML = markup;
        new window.Track().init();
      }, markup);
      await page.waitForTimeout(100);
      await once(() => first.locator('[data-track-next]').click(), 1);
      assert.equal(await second.evaluate(track => track.currentPageIndex), 2);
      // Adding a track before existing tracks must not reuse their generated panel IDs.
      await page.evaluate(markup => {
        const wrapper = document.createElement('div');
        wrapper.id = 'new-track';
        wrapper.innerHTML = markup.replaceAll('carousel-heading', 'new-heading');
        document.querySelector('main').prepend(wrapper);
        new window.Track().init();
      }, markup);
      const panelIds = await page.locator('.track__panel').evaluateAll(panels => panels.map(panel => panel.id));
      assert.equal(new Set(panelIds).size, panelIds.length, 'New tracks must have unique panel IDs');
      assert.equal(await first.evaluate(track => track.currentPageIndex), 1);
      assert.equal(await second.evaluate(track => track.currentPageIndex), 2);
      await page.waitForTimeout(100);
      await once(() => page.locator('#new-track [data-track-next]').click(), 1, 'new-track');
      assert.deepEqual(errors, []);
      console.log(`PASS ${browserType.name()} (${reducedMotion}): repeated setup, preserved page/focus/pagination, single click/keyboard navigation, multiple tracks, replacement elements, destroy/reinitialize, responsive resize`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
