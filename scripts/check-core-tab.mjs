import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-tab.mjs
const source = await readFile(new URL('../packages/core/src/js/tab.js', import.meta.url), 'utf8');
const delegation = await readFile(new URL('../packages/core/src/js/utilities/eventDelegation.js', import.meta.url), 'utf8');
const navigation = await readFile(new URL('../packages/core/src/js/utilities/keyboardNavigation.js', import.meta.url), 'utf8');
const styles = await readFile(new URL('../packages/core/dist/natura11y.css', import.meta.url), 'utf8');
const markup = await readFile(new URL('../apps/storybook/stories/tab/tab.example.html', import.meta.url), 'utf8');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch();

  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => route.fulfill({ body: '', contentType: 'text/css' }));
    await page.setContent(`
      <style>${styles}</style>
      <section id="first-tabs">${markup}</section>
      <section id="second-tabs">${markup.replaceAll('html-', 'second-')}</section>
    `);

    await page.evaluate(async ({ source, delegation, navigation }) => {
      const moduleUrl = contents => URL.createObjectURL(new Blob([contents], { type: 'text/javascript' }));
      const delegationUrl = moduleUrl(delegation);
      const navigationUrl = moduleUrl(navigation);
      const sourceUrl = moduleUrl(source
        .replace('./utilities/eventDelegation', delegationUrl)
        .replace('./utilities/keyboardNavigation', navigationUrl));

      window.Tab = (await import(sourceUrl)).default;
      [sourceUrl, delegationUrl, navigationUrl].forEach(url => URL.revokeObjectURL(url));

      window.tabs = new window.Tab();
      window.tabs.init();

      // Count actual activations so duplicate handlers cannot hide behind identical state.
      window.activations = 0;
      const setAttribute = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function (name, value) {
        if (this.matches('[role="tab"]') && name === 'aria-selected' && value === 'true') {
          window.activations++;
        }
        return setAttribute.call(this, name, value);
      };
    }, { source, delegation, navigation });

    const buttons = page.locator('#first-tabs [role="tab"]');
    const otherButtons = page.locator('#second-tabs [role="tab"]');

    const verifySelection = async (group, selectedIndex) => {
      const state = await page.locator(group).evaluate(group => {
        const tabs = [...group.querySelectorAll('[role="tab"]')];
        const panels = [...group.querySelectorAll('[role="tabpanel"]')];
        return {
          selected: tabs.map(tab => tab.getAttribute('aria-selected')),
          tabIndices: tabs.map(tab => tab.tabIndex),
          visible: panels.map(panel => getComputedStyle(panel).display !== 'none'),
          hidden: panels.map(panel => panel.getAttribute('aria-hidden')),
        };
      });
      assert.deepEqual(state.selected, [0, 1, 2].map(index => String(index === selectedIndex)));
      assert.deepEqual(state.tabIndices, [0, 1, 2].map(index => index === selectedIndex ? 0 : -1));
      assert.deepEqual(state.visible, [0, 1, 2].map(index => index === selectedIndex));
      assert.deepEqual(state.hidden, [0, 1, 2].map(index => String(index !== selectedIndex)));
    };

    const verifyActivation = async action => {
      await page.evaluate(() => { window.activations = 0; });
      await action();
      assert.equal(await page.evaluate(() => window.activations), 1, 'One interaction must activate a tab exactly once');
    };

    await verifySelection('#first-tabs', 0);
    await verifySelection('#second-tabs', 0);
    await verifyActivation(() => buttons.nth(2).click());
    await verifyActivation(() => otherButtons.nth(1).click());

    // Same-instance and new-instance calls must preserve every initialized group.
    await page.evaluate(() => {
      window.activations = 0;
      for (let index = 0; index < 3; index++) {
        window.tabs.init();
        new window.Tab().init();
      }
    });
    assert.equal(await page.evaluate(() => window.activations), 0, 'Repeated init must not reset selection');
    await verifySelection('#first-tabs', 2);
    await verifySelection('#second-tabs', 1);

    await verifyActivation(() => buttons.nth(1).click());
    await verifySelection('#first-tabs', 1);
    await buttons.first().focus();
    await verifyActivation(() => page.keyboard.press('Enter'));
    await verifySelection('#first-tabs', 0);
    await buttons.last().focus();
    await verifyActivation(() => page.keyboard.press('Space'));
    await verifySelection('#first-tabs', 2);
    await verifySelection('#second-tabs', 1);

    await buttons.first().focus();
    await buttons.last().evaluate(button => {
      const focus = button.focus;
      window.focusCalls = 0;
      button.focus = function (...args) {
        window.focusCalls++;
        return focus.apply(this, args);
      };
    });
    await page.keyboard.press('ArrowLeft');
    assert.equal(await buttons.last().evaluate(button => button === document.activeElement), true);
    assert.equal(await page.evaluate(() => window.focusCalls), 1, 'One arrow key must execute one navigation callback');

    // Newly inserted groups must initialize without resetting earlier groups.
    await page.evaluate(markup => {
      const group = document.createElement('section');
      group.id = 'third-tabs';
      group.innerHTML = markup.replaceAll('html-', 'third-');
      document.body.append(group);
      new window.Tab().init();
    }, markup);
    await verifySelection('#first-tabs', 2);
    await verifySelection('#second-tabs', 1);
    await verifySelection('#third-tabs', 0);
    await verifyActivation(() => page.locator('#third-tabs [role="tab"]').nth(2).click());
    await verifySelection('#third-tabs', 2);

    // A replacement DOM element must receive normal first-time initialization.
    await page.evaluate(() => {
      const group = document.querySelector('#first-tabs .tabs');
      group.replaceWith(group.cloneNode(true));
      new window.Tab().init();
    });
    await verifySelection('#first-tabs', 0);
    await verifyActivation(() => buttons.nth(1).click());
    await verifySelection('#first-tabs', 1);
    await verifySelection('#second-tabs', 1);
    await verifySelection('#third-tabs', 2);
    await verifyActivation(() => otherButtons.first().click());
    await verifySelection('#second-tabs', 0);

    assert.deepEqual(errors, []);
    console.log(`PASS ${browserType.name()}: first initialization, repeated instances, preserved selection, single click/keyboard activation, independent groups, new and replacement elements`);
  } finally {
    await browser.close();
  }
}
