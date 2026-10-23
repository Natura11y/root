import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-accordion.mjs
const source = await readFile(new URL('../packages/core/src/js/accordion.js', import.meta.url), 'utf8');
const delegation = await readFile(new URL('../packages/core/src/js/utilities/eventDelegation.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../packages/core/dist/natura11y.css', import.meta.url), 'utf8');
const markup = await readFile(new URL('../apps/storybook/stories/accordion/accordion.example.html', import.meta.url), 'utf8');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch();

  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => route.fulfill({ body: '', contentType: 'text/css' }));
    await page.setContent(`
      <style>${styles}</style>
      <section id="first-accordion">${markup}</section>
      <section id="second-accordion">${markup.replaceAll('html-acc-', 'second-acc-')}</section>
    `);

    await page.evaluate(async ({ source, delegation }) => {
      const delegationUrl = URL.createObjectURL(new Blob([delegation], { type: 'text/javascript' }));
      const sourceUrl = URL.createObjectURL(new Blob([
        source.replace('./utilities/eventDelegation', delegationUrl),
      ], { type: 'text/javascript' }));

      window.Accordion = (await import(sourceUrl)).default;
      URL.revokeObjectURL(sourceUrl);
      URL.revokeObjectURL(delegationUrl);

      window.accordion = new window.Accordion();
      window.accordion.init();
      window.toggleEvents = 0;
      document.addEventListener('accTrigger', () => window.toggleEvents++);
    }, { source, delegation });

    const buttons = page.locator('#first-accordion [data-accordion="button"]');
    const panels = page.locator('#first-accordion [data-accordion="panel"]');
    const otherButtons = page.locator('#second-accordion [data-accordion="button"]');
    const otherPanels = page.locator('#second-accordion [data-accordion="panel"]');

    const verifyToggle = async (action, expanded) => {
      await page.evaluate(() => { window.toggleEvents = 0; });
      await action();

      assert.equal(await buttons.first().getAttribute('aria-expanded'), String(expanded));
      assert.equal(await panels.first().evaluate(el => el.classList.contains('shown')), expanded);
      assert.equal(await panels.first().evaluate(el => el.inert), !expanded);
      assert.equal(await page.evaluate(() => window.toggleEvents), 1, 'One activation must dispatch one toggle event');
    };

    await verifyToggle(() => buttons.first().click(), true);

    // Each group must keep its own open panel and keyboard navigation.
    await otherButtons.first().click();
    assert.equal(await otherButtons.first().getAttribute('aria-expanded'), 'true');
    assert.equal(await buttons.first().getAttribute('aria-expanded'), 'true');
    await otherButtons.nth(1).click();
    assert.equal(await otherButtons.first().getAttribute('aria-expanded'), 'false');
    assert.equal(await otherPanels.first().evaluate(el => el.inert), true);
    assert.equal(await otherButtons.nth(1).getAttribute('aria-expanded'), 'true');
    assert.equal(await buttons.first().getAttribute('aria-expanded'), 'true');

    await otherButtons.first().focus();
    await page.keyboard.press('ArrowUp');
    assert.equal(await otherButtons.last().evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('ArrowDown');
    assert.equal(await otherButtons.first().evaluate(el => el === document.activeElement), true);

    // Repeat both the same instance and new instances on the existing elements.
    await page.evaluate(() => {
      for (let index = 0; index < 3; index++) {
        window.accordion.init();
        new window.Accordion().init();
      }
    });
    assert.equal(await buttons.first().getAttribute('aria-expanded'), 'true', 'Repeated init must preserve the open panel');

    assert.equal(await otherButtons.nth(1).getAttribute('aria-expanded'), 'true', 'Repeated init must preserve both groups');

    await verifyToggle(() => buttons.first().click(), false);
    await verifyToggle(() => page.keyboard.press('Enter'), true);
    await verifyToggle(() => page.keyboard.press('Space'), false);

    // The second group must also retain a single handler after repeated setup.
    for (const expanded of [false, true]) {
      await page.evaluate(() => { window.toggleEvents = 0; });
      await otherButtons.nth(1).click();
      assert.equal(await otherButtons.nth(1).getAttribute('aria-expanded'), String(expanded));
      assert.equal(await page.evaluate(() => window.toggleEvents), 1);
      assert.equal(await buttons.first().getAttribute('aria-expanded'), 'false');
    }

    await buttons.first().focus();

    // A single keypress must not execute accumulated keyboard handlers.
    await buttons.nth(1).evaluate(button => {
      const focus = button.focus;
      window.focusCalls = 0;
      button.focus = function (...args) {
        window.focusCalls++;
        return focus.apply(this, args);
      };
    });
    await page.keyboard.press('ArrowDown');
    assert.equal(await buttons.nth(1).evaluate(el => el === document.activeElement), true);
    assert.equal(await page.evaluate(() => window.focusCalls), 1);

    // Replacement elements must initialize normally, even with identical markup.
    await page.evaluate(() => {
      const accordion = document.querySelector('.accordion');
      accordion.replaceWith(accordion.cloneNode(true));
      new window.Accordion().init();
    });
    await verifyToggle(() => buttons.first().click(), true);
    await verifyToggle(() => page.keyboard.press('Enter'), false);

    assert.equal(await otherButtons.nth(1).getAttribute('aria-expanded'), 'true', 'Replacing the first group must leave the second unchanged');
    assert.equal(await otherPanels.nth(1).evaluate(el => el.inert), false);

    assert.deepEqual(errors, []);
    console.log(`PASS ${browserType.name()}: initial setup, same-instance and new-instance repeats, preserved state, one click/keyboard callback, replacement elements, independent groups`);
  } finally {
    await browser.close();
  }
}
