import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-lightbox.mjs
const read = (path, encoding = 'utf8') => readFile(new URL(path, import.meta.url), encoding);
const script = await read('../packages/core/dist/natura11y.js');
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/lightbox/lightbox.example.html');
const image = await read('../apps/storybook/public/story-assets/backdrop/landscape.jpg', null);

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    for (const width of [548, 1687]) {
      for (const reducedMotion of ['no-preference', 'reduce']) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
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
                    <link rel="stylesheet" href="/natura11y.css">
                    <script src="/natura11y.js" defer>
                    </script>
                  </head>
                  <body>
                    <main>
                      ${markup}
                    </main>
                  </body>
                </html>
              `,
            });
          }
          if (path === '/natura11y.js') return route.fulfill({ body: script, contentType: 'text/javascript' });
          if (path === '/natura11y.css') return route.fulfill({ body: styles, contentType: 'text/css' });
          if (route.request().resourceType() === 'image') return route.fulfill({ body: image, contentType: 'image/jpeg' });
          return route.abort();
        });

        // Observe the real focus registry without exposing it in production code.
        await page.addInitScript(() => {
          const set = Map.prototype.set;
          Map.prototype.set = function (element, handler) {
            if (element instanceof Element && element.matches('.lightbox') && typeof handler === 'function') {
              window.lightboxFocusRegistry = this;
            }
            return set.call(this, element, handler);
          };
        });

        await page.goto('http://natura11y.test/');
        const trigger = page.locator('[data-lightbox]').first();

        // Each closing method must remove the dialog and permit another full cycle.
        for (const method of ['Space', 'Escape', 'Enter', 'mouse']) {
          for (let cycle = 0; cycle < 2; cycle++) {
            if (method === 'mouse') {
              await trigger.click();
            } else {
              await trigger.focus();
              await page.keyboard.press(method === 'Space' ? 'Space' : 'Enter');
            }

            const lightbox = page.locator('.lightbox');
            await page.waitForFunction(() => {
              const lightbox = document.querySelector('.lightbox');
              const content = lightbox?.querySelector('.lightbox__container');
              return lightbox?.classList.contains('shown') && getComputedStyle(content).opacity === '1';
            });
            assert.equal(await lightbox.count(), 1);
            assert.equal(await page.evaluate(() => window.lightboxFocusRegistry.size), 1, 'One open lightbox owns one focus trap');
            assert.equal(await lightbox.evaluate(el => el.contains(document.activeElement)), true);

            // Close the second cycle while gallery navigation is still animating.
            if (cycle === 1) {
              await page.keyboard.press('ArrowRight');
              assert.equal(await lightbox.locator('.lightbox__caption').textContent(), 'Video one');
              await page.keyboard.press('ArrowLeft');
              assert.equal(await lightbox.locator('.lightbox__caption').textContent(), 'Mountain landscape');
            }

            const close = lightbox.locator('[data-lightbox-close]');
            if (method === 'Escape') await page.keyboard.press('Escape');
            else if (method === 'Enter' || method === 'Space') {
              await close.focus();
              await page.keyboard.press(method);
            } else await close.click();

            // A hidden but retained lightbox prevents every subsequent opening.
            await lightbox.waitFor({ state: 'detached' });
            assert.equal(await page.evaluate(() => window.lightboxFocusRegistry.size), 0, 'Closing removes the focus trap registry entry');
            assert.equal(await trigger.evaluate(el => el === document.activeElement), true, 'Return focus to the opener');
            assert.equal(await page.locator('html').evaluate(el => el.classList.contains('has-overlay')), false);
            assert.equal(await page.locator('html').evaluate(el => el.style.getPropertyValue('--scroll-position')), '');
          }
        }

        assert.deepEqual(errors, []);
        console.log(`PASS ${browserType === chromium ? 'chrome' : 'firefox'} ${width} ${reducedMotion}: Space, Escape, Enter and mouse closing, removal after arrow navigation, return focus, reopening and empty focus registry after close`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}
