import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, firefox } from 'playwright';

// Build Core first: npm run build:core
// Run this regression check: node scripts/check-core-alert.mjs
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../packages/core/src/js/alert.js');
const styles = await read('../packages/core/dist/natura11y.css');
const markup = await read('../apps/storybook/stories/alert/alert.example.html');

for (const browserType of [chromium, firefox]) {
  const browser = await browserType.launch(browserType === chromium ? { channel: 'chrome' } : {});

  try {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const page = await browser.newPage({ reducedMotion });
      page.setDefaultTimeout(5000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.route('**/*', route => {
        const path = new URL(route.request().url()).pathname;
        if (path === '/') {
          return route.fulfill({
            contentType: 'text/html',
            body: `<!doctype html><style>${styles}</style>
              <main><div id="first"></div><div id="second"></div><div id="outside"></div></main>`,
          });
        }
        if (path === '/alert.js') {
          return route.fulfill({ contentType: 'text/javascript', body: source });
        }
        return route.abort();
      });

      await page.goto('http://natura11y.test/');
      await page.evaluate(async markup => {
        window.Alert = (await import('/alert.js')).default;
        window.removals = {};
        window.endingOpacities = {};
        const remove = Element.prototype.remove;
        Element.prototype.remove = function () {
          if (this.matches('.alert')) window.removals[this.id] = (window.removals[this.id] || 0) + 1;
          return remove.call(this);
        };

        window.addAlert = (rootId, id) => {
          const template = document.createElement('template');
          template.innerHTML = markup.replaceAll('alert-label-html', `${id}-label`).replaceAll('alert-desc-html', `${id}-description`);
          const alert = template.content.firstElementChild;
          alert.id = id;
          alert.addEventListener('animationend', () => {
            window.endingOpacities[id] = getComputedStyle(alert).opacity;
          });
          const button = document.createElement('button');
          button.type = 'button';
          button.setAttribute('data-alert-close', '');
          button.textContent = `Close ${id}`;
          alert.prepend(button);
          document.getElementById(rootId).append(alert);
        };

        window.addAlert('first', 'initial');
        window.addAlert('second', 'independent');
        window.addAlert('outside', 'unowned');
        window.first = new window.Alert();
        const root = document.getElementById('first');
        window.owner = window.first.init(root);
        window.first.init(root);
        window.otherOwner = new window.Alert().init(root);
      }, markup);

      const dismiss = async (id, keyboard = false) => {
        const button = page.locator(`#${id} > [data-alert-close]`);
        if (keyboard) {
          await button.focus();
          await page.keyboard.press('Space');
        } else {
          await button.click();
        }
        await page.locator(`#${id}`).waitFor({ state: 'detached' });
        assert.equal(await page.evaluate(id => window.removals[id], id), 1, 'One dismissal must remove the alert exactly once');
        if (reducedMotion === 'no-preference') {
          assert.equal(await page.evaluate(id => window.endingOpacities[id], id), '0', 'The fade must end transparent until the alert is removed');
        }
      };

      await dismiss('initial');
      assert.equal(await page.evaluate(() => window.owner === window.first && window.otherOwner === window.first), true, 'Repeated initialization returns the existing owner');
      await page.locator('#unowned button').click();
      assert.equal(await page.locator('#unowned').evaluate(el => el.classList.contains('dismissed')), false, 'Scoped initialization leaves other alerts alone');

      await page.evaluate(() => {
        window.addAlert('first', 'dynamic');
        window.second = new window.Alert().init(document.getElementById('second'));
      });
      await dismiss('dynamic', true);
      assert.equal(await page.locator('#independent').evaluate(el => el.classList.contains('dismissed')), false, 'Dismissing one root leaves another root alone');
      await dismiss('independent');

      await page.evaluate(() => {
        window.first.destroy();
        window.first.destroy();
        new window.Alert().destroy();
        window.addAlert('first', 'after-destroy');
      });
      await page.locator('#after-destroy button').click();
      assert.equal(await page.locator('#after-destroy').evaluate(el => el.classList.contains('dismissed')), false, 'Destroy removes the click handler');
      await page.evaluate(() => { window.first.init(document.getElementById('first')); });
      await dismiss('after-destroy');

      await page.evaluate(() => {
        window.second.destroy();
        window.addAlert('first', 'old-root');
        window.addAlert('second', 'new-root');
        window.first.init(document.getElementById('second'));
      });
      await page.locator('#old-root button').click();
      assert.equal(await page.locator('#old-root').evaluate(el => el.classList.contains('dismissed')), false, 'Moving initialization cleans up the previous root');
      await dismiss('new-root');

      await page.evaluate(() => {
        const innerRoot = document.createElement('div');
        innerRoot.id = 'inner-root';
        innerRoot.innerHTML = '<button type="button" data-alert-close>Nested close</button>';
        document.querySelector('#unowned .alert__description').append(innerRoot);
        window.innerOwner = new window.Alert().init(innerRoot);
      });
      await page.locator('#inner-root button').click();
      assert.equal(await page.locator('#unowned').evaluate(el => el.classList.contains('dismissed')), false, 'A scoped close button cannot dismiss an ancestor alert outside its root');
      await page.evaluate(() => { window.innerOwner.destroy(); });

      await page.evaluate(() => {
        window.first.destroy();
        window.documentOwner = new window.Alert().init();
        new window.Alert().init();
      });
      await dismiss('unowned');
      await page.evaluate(() => { window.documentOwner.destroy(); });
      assert.deepEqual(errors, []);
      console.log(`PASS ${browserType.name()} ${reducedMotion}: repeated initialization, scoped and dynamic alerts, independent roots, cleanup, reinitialization, and default document scope`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
