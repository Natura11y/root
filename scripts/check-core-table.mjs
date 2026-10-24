import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-table.mjs
const source = await readFile(new URL('../packages/core/src/js/table.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../packages/core/dist/natura11y.css', import.meta.url), 'utf8');
const markup = await readFile(new URL('../apps/storybook/stories/table/table.example.html', import.meta.url), 'utf8');
const scrollMarkup = await readFile(new URL('../apps/storybook/stories/table/table-scroll.example.html', import.meta.url), 'utf8');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    const page = await browser.newPage({ viewport: { width: 400, height: 800 } });

    // Font downloads are unnecessary for these layout and listener checks.
    await page.route('https://**/*', (route) => route.fulfill({ body: '', contentType: 'text/css' }));
    await page.setContent(`
      <style>
        ${styles}
      </style>

      <section id="html-example">
        ${scrollMarkup.replace('class="table-scroll"', 'class="table-scroll" id="wide"')}
      </section>

      <div class="table-scroll" id="narrow" style="--table-scroll-min-width: 100px;">

        <div class="table-scroll__container">

          <table class="table">
            <tbody>
              <tr>
                <td>
                  Short content
                </td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

      ${markup.replace('class="table"', 'class="table table--stack--lg" id="stack"')}
    `);

    await page.evaluate(async (source) => {
      const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      const { default: Table } = await import(moduleUrl);
      URL.revokeObjectURL(moduleUrl);
      window.table = new Table();
      window.table.init();
    }, source);

    const wide = page.locator('#wide');
    const target = wide.locator('.table-scroll__container');
    const stackCells = page.locator('#stack td');

    assert.equal(await wide.getAttribute('data-scroll'), 'true');
    assert.equal(await page.locator('#narrow').getAttribute('data-scroll'), 'false');
    assert.notEqual(await target.getAttribute('data-scrolling'), 'true');
    assert.equal(await stackCells.first().getAttribute('data-header'), 'Name');
    assert.equal(await stackCells.first().getAttribute('aria-labelledby'), 'header-0');
    assert.equal(await page.locator('#stack .td-content').count(), await stackCells.count());

    // Count observable attribute updates to detect accumulated scroll callbacks.
    await target.evaluate((element) => {
      const setAttribute = element.setAttribute;
      window.scrollWrites = 0;
      element.setAttribute = function (name, value) {
        if (name === 'data-scrolling') {
          window.scrollWrites++;
        }
        return setAttribute.call(this, name, value);
      };
    });

    for (let index = 0; index < 3; index++) {
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      await page.waitForTimeout(200);
    }

    assert.equal(await target.evaluate((element) => {
      window.scrollWrites = 0;
      element.dispatchEvent(new Event('scroll'));
      return window.scrollWrites;
    }), 1, 'One scroll must run one callback after repeated resize');

    await target.hover();
    await page.mouse.wheel(200, 0);
    await page.waitForFunction(() => document.querySelector('#wide .table-scroll__container').dataset.scrolling === 'true');
    await page.mouse.wheel(-1000, 0);
    await page.waitForFunction(() => document.querySelector('#wide .table-scroll__container').dataset.scrolling === 'false');

    // Check native keyboard scrolling as well as access to table links.
    await target.locator('a').first().focus();
    const positionBeforeArrow = await target.evaluate((element) => element.scrollLeft);
    await page.keyboard.press('ArrowLeft');
    await page.waitForFunction((position) => (
      document.querySelector('#wide .table-scroll__container').scrollLeft < position
    ), positionBeforeArrow);
    await page.keyboard.press('Tab');
    assert.equal(await target.locator('a').nth(1).evaluate((element) => element === document.activeElement), true);

    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForFunction(() => document.querySelector('#wide').dataset.scroll === 'false');
    await page.setViewportSize({ width: 400, height: 800 });
    await page.waitForFunction(() => document.querySelector('#wide').dataset.scroll === 'true');

    // Destroy must detach scroll and resize handlers and cancel pending resize work.
    await page.evaluate(() => {
      window.dispatchEvent(new Event('resize'));
      window.table.destroy();
      window.table.destroy();
      document.querySelector('#wide').setAttribute('data-scroll', 'untouched');
      const target = document.querySelector('#wide .table-scroll__container');
      target.setAttribute('data-scrolling', 'untouched');
      target.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(250);
    assert.equal(await wide.getAttribute('data-scroll'), 'untouched');
    assert.equal(await target.getAttribute('data-scrolling'), 'untouched');

    // A scoped instance must leave adjacent (for example, React-owned) tables alone.
    await page.evaluate(() => {
      document.querySelector('#narrow').setAttribute('data-scroll', 'react-owned');
      window.table.init(document.querySelector('#html-example'));
    });

    assert.equal(await page.locator('#narrow').getAttribute('data-scroll'), 'react-owned');

    // Reusing an instance must detach its previous root before attaching the next one.
    await page.evaluate((markup) => {
      const root = document.createElement('section');
      root.id = 'second-example';
      root.innerHTML = markup;
      document.body.append(root);
    }, scrollMarkup);

    for (const rootId of ['second-example', 'html-example', 'second-example']) {
      const states = await page.evaluate((rootId) => {
        window.dispatchEvent(new Event('resize'));
        window.table.init(document.getElementById(rootId));

        return ['html-example', 'second-example'].map((id) => {
          const target = document.querySelector(`#${id} .table-scroll__container`);
          target.setAttribute('data-scrolling', 'untouched');
          target.dispatchEvent(new Event('scroll'));
          return { active: id === rootId, state: target.getAttribute('data-scrolling') };
        });
      }, rootId);

      for (const { active, state } of states) {
        assert.equal(state !== 'untouched', active, 'Only the current root may handle scrolling after a transfer');
      }
    }

    // After transferring, resize updates the active root and its gradient only.
    const current = page.locator('#second-example .table-scroll');
    const currentTarget = current.locator('.table-scroll__container');
    await wide.evaluate((element) => element.setAttribute('data-scroll', 'previous-root'));
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForFunction(() => document.querySelector('#second-example .table-scroll').dataset.scroll === 'false');
    assert.equal(await currentTarget.evaluate((element) => getComputedStyle(element, '::after').display), 'none');

    await page.setViewportSize({ width: 400, height: 800 });
    await page.waitForFunction(() => document.querySelector('#second-example .table-scroll').dataset.scroll === 'true');
    assert.equal(await currentTarget.evaluate((element) => getComputedStyle(element, '::after').display), 'block');
    assert.equal(await currentTarget.evaluate((element) => getComputedStyle(element, '::after').opacity), '1');
    assert.equal(await wide.getAttribute('data-scroll'), 'previous-root');

    await page.evaluate(() => window.table.destroy());
    for (const id of ['html-example', 'second-example']) {
      assert.equal(await page.locator(`#${id} .table-scroll__container`).evaluate((target) => {
        target.setAttribute('data-scrolling', 'untouched');
        target.dispatchEvent(new Event('scroll'));
        return target.getAttribute('data-scrolling');
      }), 'untouched', 'Destroy after root transfers must leave neither root with a scroll handler');
    }
    await page.evaluate(() => window.table.init(document.getElementById('html-example')));

    // Cleanup must still find the original listener target after DOM replacement.
    assert.equal(await page.evaluate(() => {
      const target = document.querySelector('#wide .table-scroll__container');
      target.replaceWith(target.cloneNode(true));
      window.table.destroy();
      target.setAttribute('data-scrolling', 'detached');
      target.dispatchEvent(new Event('scroll'));
      return target.getAttribute('data-scrolling');
    }), 'detached');


    console.log(`PASS ${browserType.name()}: scroll state, resize, one callback, teardown, scoped initialization, root transfers, detached targets, keyboard access`);
  } finally {
    await browser.close();
  }
}
