import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { chromium, firefox } from 'playwright';

// Uses the existing Core stylesheet; no development server or fixture files are needed.
// Run: node scripts/check-react-collapse.mjs
// By default, use installed Chrome. Set CHROME_CHANNEL=chromium for Playwright Chromium.
const root = fileURLToPath(new URL('../', import.meta.url));
const fixtureId = `${root}scripts/react-collapse-fixture.jsx`;
const styles = await readFile(new URL('../packages/core/dist/natura11y.css', import.meta.url), 'utf8');
const fixture = `
  import React, { StrictMode, useRef, useState } from 'react';
  import { createRoot } from 'react-dom/client';
  import Collapse from ${JSON.stringify(`${root}packages/react/src/components/collapse/index.tsx`)};
  import MainMenu from ${JSON.stringify(`${root}packages/react/src/components/main-menu/index.tsx`)};
  import Dropdown from ${JSON.stringify(`${root}packages/react/src/components/dropdown/index.tsx`)};
  import FormEntrySearch from ${JSON.stringify(`${root}packages/react/src/components/form/FormEntrySearch.tsx`)};

  function Panel({ id, focusFirst = false, textOnly = false, showAt = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    return (
      <section>
        <button ref={triggerRef} id={id + '-toggle'} aria-expanded={isOpen} onClick={() => setIsOpen(open => !open)}>
          Toggle {id}
        </button>

        <Collapse id={id} isOpen={isOpen} focusFirst={focusFirst} showAt={showAt} onClose={() => {
          setIsOpen(false);
          triggerRef.current.focus();
        }}>
          <div className="padding-3">
            <p>
              Panel content gives the real Core stylesheet a measurable height to animate.
            </p>

            {!textOnly && (
              <a id={id + '-link'} href="#content">
                Panel link
              </a>
            )}
          </div>
        </Collapse>
      </section>
    );
  }

  function Pair() {
    const [active, setActive] = useState(null);

    return (
      <section>
        {['one', 'two'].map(id => (
          <button key={id} id={'pair-' + id + '-toggle'} aria-expanded={active === id} onClick={() => setActive(value => value === id ? null : id)}>
            Open {id}
          </button>
        ))}

        {['one', 'two'].map(id => (
          <Collapse key={id} id={'pair-' + id} isOpen={active === id} focusFirst onClose={() => {
            setActive(null);
            document.getElementById('pair-' + id + '-toggle').focus();
          }}>
            <div className="padding-3">
              <p>
                Only the open panel should participate in keyboard navigation.
              </p>

              <a id={'pair-' + id + '-link'} href="#content">
                Link in {id}
              </a>
            </div>
          </Collapse>
        ))}

        <a id="after-pair" href="#content">
          Following content
        </a>
      </section>
    );
  }

  function Fixtures() {
    return (
      <main data-generation={generation}>
        <Panel id="default" />
        <Panel id="first" focusFirst />
        <Panel id="text" focusFirst textOnly />
        <Panel id="responsive" showAt="lg" />
        <Pair />

        {['bar', 'stack'].map(variant => (
          <MainMenu key={variant} variant={variant} navId={variant + '-nav'} searchId={variant + '-search'} search={
            <FormEntrySearch id={variant + '-input'} leadingIcon={false} submitButton="text" />
          } searchFormProps={{ onKeyDown: event => {
            if (event.key === 'Escape') {
              window.searchEscapeCalls++;
              if (window.blockSearchEscape) event.preventDefault();
            }
          } }}>
            <li>
              <Dropdown dropdownId={variant + '-dropdown'} buttonText="Dropdown">
                <li>
                  <a id={variant + '-dropdown-first'} href="#content">
                    First link
                  </a>
                </li>
                <li>
                  <a id={variant + '-dropdown-last'} href="#content">
                    Last link
                  </a>
                </li>
              </Dropdown>
            </li>

            <li>
              <a id={variant + '-nav-link'} href="#content">
                Navigation link
              </a>
            </li>
          </MainMenu>
        ))}
      </main>
    );
  }

  const root = createRoot(document.getElementById('root'));
  let generation = 0;
  window.searchEscapeCalls = 0;
  window.bubbledEscapes = 0;
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') window.bubbledEscapes++;
  });
  window.blockSearchEscape = false;
  window.renderFixtures = () => root.render(<StrictMode><Fixtures key={generation} /></StrictMode>);
  window.remountFixtures = () => {
    generation++;
    window.renderFixtures();
  };
  window.renderFixtures();
`;

// Keep React's development build so StrictMode exercises effect setup and cleanup.
const bundle = await build({
  root,
  configFile: false,
  logLevel: 'error',
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  plugins: [{
    name: 'react-collapse-fixture',
    resolveId: id => id === fixtureId ? id : undefined,
    load: id => id === fixtureId ? fixture : undefined,
  }],
  build: {
    write: false,
    minify: false,
    copyPublicDir: false,
    lib: { entry: fixtureId, formats: ['iife'], name: 'ReactCollapseCheck' },
  },
});
const script = (Array.isArray(bundle) ? bundle : [bundle])
  .flatMap(result => result.output)
  .find(output => output.type === 'chunk').code;

for (const browserType of [chromium, firefox]) {
  const channel = process.env.CHROME_CHANNEL ?? 'chrome';
  const browser = await browserType.launch(browserType === chromium && channel !== 'chromium' ? { channel } : {});

  try {
    const page = await browser.newPage({ viewport: { width: 548, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => route.abort());
    await page.route('http://natura11y.test/**', route => {
      const path = new URL(route.request().url()).pathname;
      if (path === '/fixture.js') return route.fulfill({ body: script, contentType: 'text/javascript' });
      return route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html lang="en"><head><style>${styles}</style></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>`,
      });
    });

    const element = id => page.locator(`#${id}`);
    const trigger = id => element(`${id}-toggle`);
    const menuTrigger = id => page.locator(`button[aria-controls="${id}"]`);
    const focused = async id => assert.equal(await element(id).evaluate(el => el === document.activeElement), true, `${id} should have focus`);
    const visible = async (id, expected) => {
      await page.waitForFunction(({ id, expected }) => {
        const panel = document.getElementById(id);
        return panel && panel.inert === !expected && panel.getAttribute('aria-hidden') === String(!expected);
      }, { id, expected });
    };
    const settle = async id => element(id).evaluate(async el => {
      await Promise.allSettled(el.getAnimations().map(animation => animation.finished));
    });
    const toggle = id => trigger(id).click({ force: true });

    for (const reducedMotion of ['no-preference', 'reduce']) {
      await page.emulateMedia({ reducedMotion });
      await page.setViewportSize({ width: 548, height: 1000 });
      await page.goto('http://natura11y.test/');
      await trigger('default').waitFor();

      // Public focus defaults, independent instances, and text-only fallback.
      await toggle('default');
      await visible('default', true);
      await focused('default-toggle');
      await toggle('first');
      await focused('first-link');
      await visible('default', true);
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => window.bubbledEscapes), 1, 'Escape remains available to nested component listeners');
      await visible('first', false);
      await focused('first-toggle');
      await visible('default', true);

      await toggle('text');
      await focused('text');
      assert.equal(await element('text').getAttribute('tabindex'), '-1');
      await page.keyboard.press('Escape');
      await focused('text-toggle');
      assert.equal(await element('text').getAttribute('tabindex'), null);

      // Re-rendering does not reset the open state or repeat focus entry.
      await element('default-link').focus();
      await page.evaluate(() => window.renderFixtures());
      await focused('default-link');
      await visible('default', true);
      await page.keyboard.press('Escape');
      await focused('default-toggle');

      // Reverse a transition before it completes; stale cleanup must not clear the reopening.
      await toggle('pair-one');
      await settle('pair-one');
      for (let cycle = 0; cycle < 3; cycle++) {
        await toggle('pair-two');
        await page.waitForTimeout(40);
        await toggle('pair-one');
        await focused('pair-one-link');
        await visible('pair-two', false);
        await settle('pair-one');
        await settle('pair-two');
        assert.equal(await element('pair-one').getAttribute('data-active'), '');
        assert.equal(await element('pair-two').getAttribute('data-active'), null);
      }
      await page.keyboard.press('Tab');
      await focused('after-pair');
      await page.keyboard.press('Shift+Tab');
      await focused('pair-one-link');
      await page.keyboard.press('Escape');
      await focused('pair-one-toggle');
      await visible('pair-one', false);

      // Responsive CSS and accessibility visibility must agree in both directions.
      await visible('responsive', false);
      await page.setViewportSize({ width: 1687, height: 1000 });
      await visible('responsive', true);
      await visible('bar-search', true);
      await visible('bar-nav', true);
      await element('bar-input').focus();
      await page.keyboard.press('Escape');
      await focused('bar-input');
      await page.setViewportSize({ width: 548, height: 1000 });
      await visible('responsive', false);
      await visible('bar-search', false);
      await visible('bar-nav', false);

      // Search focus and Escape are shared with Collapse; custom form handlers remain composable.
      await menuTrigger('bar-search').click();
      await focused('bar-input');
      assert.equal(await element('bar-input').evaluate(el => el.closest('.form-entry').classList.contains('is-focused')), true);
      await page.evaluate(() => { window.blockSearchEscape = true; });
      await page.keyboard.press('Escape');
      await visible('bar-search', true);
      await focused('bar-input');
      await page.evaluate(() => { window.blockSearchEscape = false; });
      await page.keyboard.press('Escape');
      await visible('bar-search', false);
      assert.equal(await menuTrigger('bar-search').evaluate(el => el === document.activeElement), true);
      assert.equal(await page.evaluate(() => window.searchEscapeCalls), 3);

      await menuTrigger('bar-nav').focus();
      await page.keyboard.press('Enter');
      await focused('bar-nav');
      await page.keyboard.press('Escape');
      assert.equal(await menuTrigger('bar-nav').evaluate(el => el === document.activeElement), true);
      await menuTrigger('bar-nav').click();
      assert.equal(await menuTrigger('bar-nav').evaluate(el => el === document.activeElement), true, 'Pointer opening retains trigger focus');

      for (let cycle = 0; cycle < 3; cycle++) {
        await menuTrigger('bar-search').click({ force: true });
        await focused('bar-input');
        await visible('bar-nav', false);
        await page.waitForTimeout(40);
        await menuTrigger('bar-nav').click({ force: true });
        await visible('bar-search', false);
        await visible('bar-nav', true);
      }
      await menuTrigger('bar-search').click({ force: true });
      await settle('bar-search');
      await settle('bar-nav');
      await focused('bar-input');
      await page.keyboard.press('Escape');
      await visible('bar-search', false);
      await page.setViewportSize({ width: 1687, height: 1000 });
      await visible('bar-search', true);
      await element('bar-input').focus();
      await page.keyboard.press('Escape');
      await focused('bar-input');
      await page.setViewportSize({ width: 548, height: 1000 });
      await visible('bar-search', false);

      await visible('stack-search', true);
      await element('stack-input').focus();
      await page.keyboard.press('Escape');
      await visible('stack-search', true);
      await focused('stack-input');

      // Native Tab order keeps inline mobile dropdowns open; desktop focus-out closes them.
      await menuTrigger('bar-nav').click();
      const dropdown = menuTrigger('bar-dropdown');
      await dropdown.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await focused('bar-dropdown-first');
      await page.keyboard.press('Tab');
      await focused('bar-dropdown-last');
      await page.keyboard.press('Tab');
      await focused('bar-nav-link');
      assert.equal(await dropdown.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Shift+Tab');
      await focused('bar-dropdown-last');
      await page.keyboard.press('Escape');
      assert.equal(await dropdown.getAttribute('aria-expanded'), 'false');
      await visible('bar-nav', false);
      await settle('bar-nav');
      assert.equal(
        await menuTrigger('bar-nav').evaluate(el => el === document.activeElement),
        true,
        'Nested Escape returns focus to the visible Menu trigger',
      );

      await page.setViewportSize({ width: 1687, height: 1000 });
      await visible('bar-nav', true);
      await dropdown.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await focused('bar-dropdown-first');
      await page.keyboard.press('Tab');
      await focused('bar-dropdown-last');
      await page.keyboard.press('Tab');
      await focused('bar-nav-link');
      assert.equal(await dropdown.getAttribute('aria-expanded'), 'false');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await dropdown.evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Escape');
      assert.equal(await dropdown.getAttribute('aria-expanded'), 'false');
      assert.equal(await dropdown.evaluate(el => el === document.activeElement), true);
      await page.setViewportSize({ width: 548, height: 1000 });
      await visible('bar-nav', false);

      // Unmount during a pending close, then repeat interaction on fresh StrictMode instances.
      await toggle('first');
      await settle('first');
      await toggle('first');
      await page.evaluate(() => window.remountFixtures());
      await page.waitForFunction(() => document.querySelector('main').dataset.generation === '1');
      await visible('first', false);
      await toggle('first');
      await focused('first-link');
      await settle('first');
      assert.equal(await element('first').getAttribute('data-active'), '');
      await page.keyboard.press('Escape');
      await focused('first-toggle');
      await menuTrigger('bar-search').click();
      await focused('bar-input');
      await page.keyboard.press('Escape');
      await visible('bar-search', false);

      assert.deepEqual(errors, []);
      console.log(`PASS ${browserType === chromium ? channel : 'firefox'} (${reducedMotion}): focus policies, Escape, independent panels, transition reversal, resizing, Main Menu, StrictMode remounts`);
    }
  } finally {
    await browser.close();
  }
}
