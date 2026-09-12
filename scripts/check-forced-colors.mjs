import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium, firefox } from 'playwright';

// Run against Storybook so Core markup, React markup, themes, and icon fonts are real.
const base = process.env.STORYBOOK_URL || 'http://localhost:6006';
const screenshots = process.env.FORCED_COLORS_SCREENSHOTS;
const browsers = { chromium, firefox };
const requested = (process.env.FORCED_COLORS_BROWSERS || 'chromium,firefox').split(',');
let checks = 0;

async function colors(page) {
  return page.evaluate(() => Object.fromEntries(
    ['CanvasText', 'ButtonText', 'FieldText', 'GrayText', 'LinkText', 'Highlight', 'HighlightText'].map(name => {
      const probe = document.createElement('span');
      probe.style.cssText = `color:${name};forced-color-adjust:none`;
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return [name, value];
    }),
  ));
}

async function visit(page, story, selector) {
  await page.goto(`${base}/iframe.html?id=${story}&viewMode=story`);
  await page.locator(selector).first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.evaluate(() => matchMedia('(forced-colors: active)').matches), true);
}

async function focus(page, element) {
  await page.keyboard.press('Tab');
  await element.focus();
  const style = await element.evaluate(el => {
    const s = getComputedStyle(el);
    return { visible: el.matches(':focus-visible'), width: parseFloat(s.outlineWidth), style: s.outlineStyle };
  });
  assert.ok(style.visible && style.width > 0 && style.style !== 'none', 'Keyboard focus must remain visible');
}

async function capture(page, name) {
  if (screenshots) await page.screenshot({ path: join(screenshots, `${name}.png`) });
}

async function checkTabs(page, palette, width) {
  await page.setViewportSize({ width, height: 800 });
  for (const story of ['tab--default-html', 'tab--default-react', 'tab--pill']) {
    await visit(page, story, '.tabs-nav .is-active');
    const tabs = page.locator('.tabs-nav [role="tab"]');
    for (let selected = 0; selected < await tabs.count(); selected++) {
      await tabs.nth(selected).click();
      const states = await tabs.evaluateAll(elements => elements.map(el => {
        const s = getComputedStyle(el), bar = getComputedStyle(el, '::before');
        return {
          selected: el.getAttribute('aria-selected') === 'true', color: s.color, background: s.backgroundColor,
          bottom: parseFloat(s.borderBlockEndWidth), side: parseFloat(s.borderInlineEndWidth),
          bottomColor: s.borderBlockEndColor, sideColor: s.borderInlineEndColor,
          barColor: bar.backgroundColor, barOpacity: bar.opacity,
        };
      }));
      assert.equal(states.filter(s => s.selected).length, 1);
      assert.equal(states[selected].selected, true);
      if (story === 'tab--pill') {
        assert.equal(states[selected].background, palette.Highlight);
        assert.equal(states[selected].color, palette.HighlightText);
      } else {
        states.forEach((s, index) => {
          assert.equal(s.bottom > 0, width < 768 ? index < states.length - 1 : index !== selected);
          assert.equal(s.side > 0, width >= 768 && index < states.length - 1);
          if (s.bottom) assert.equal(s.bottomColor, palette.CanvasText);
          if (s.side) assert.equal(s.sideColor, palette.CanvasText);
          assert.equal(s.barOpacity, index === selected ? '1' : '0');
        });
        assert.equal(states[selected].barColor, palette.ButtonText);
      }
      await focus(page, tabs.nth(selected));
      if (story === 'tab--pill') assert.equal(await tabs.nth(selected).evaluate(el => getComputedStyle(el).outlineColor), palette.HighlightText);
      checks++;
    }
    await capture(page, `${page._testName}-${story}-${width}`);
  }
}

async function checkCarets(page, palette) {
  for (const story of ['form--select-html', 'form--select']) {
    await visit(page, story, '.form-entry__field__select');
    const field = page.locator('.form-entry__field__select').first();
    const select = field.locator('select');
    const read = () => field.evaluate(el => {
      const s = getComputedStyle(el, '::before');
      return { left: s.borderLeftColor, right: s.borderRightColor, top: s.borderTopColor };
    });
    assert.deepEqual(await read(), { left: 'rgba(0, 0, 0, 0)', right: 'rgba(0, 0, 0, 0)', top: palette.FieldText });
    await select.evaluate(el => { el.disabled = true; });
    assert.equal((await read()).top, palette.GrayText);
    checks++;
  }
  for (const [story, selector, color] of [
    ['dropdown--default-html', '.dropdown', 'ButtonText'],
    ['dropdown--default-react', '.dropdown', 'ButtonText'],
    ['dropdown--link-split-html', '.dropdown-link-split > [data-toggle="dropdown"]', 'LinkText'],
    ['dropdown--link-split-react', '.dropdown-link-split > [data-toggle="dropdown"]', 'LinkText'],
    ['breadcrumb--default-html', '.breadcrumb > li:not(:last-child)', 'CanvasText'],
  ]) {
    await visit(page, story, selector);
    const caret = await page.locator(selector).first().evaluate(el => {
      const s = getComputedStyle(el, '::after');
      return { top: s.borderTopColor, left: s.borderLeftColor, right: s.borderRightColor };
    });
    assert.deepEqual(caret, { top: palette[color], left: 'rgba(0, 0, 0, 0)', right: 'rgba(0, 0, 0, 0)' });
    checks++;
  }
}

async function checkSearchButtons(page, palette) {
  for (const width of [400, 1200]) {
    await page.setViewportSize({ width, height: 800 });
    for (const story of [
      'form--search-entry-html', 'form--search-entry',
      'main-menu--bar-html', 'main-menu--bar-react',
      'main-menu--stack-html', 'main-menu--stack-react',
    ]) {
      await visit(page, story, story.startsWith('main-menu') ? '[class*="main-menu--"]' : '.form-entry--search');
      if (width === 400 && story.startsWith('main-menu--bar')) {
        await page.locator('.main-menu__toggle [aria-label="Search"]').click();
        // The mobile panel places focus when its opening transition ends.
        await page.locator('.main-menu__search').evaluate(async el => {
          await Promise.all(el.getAnimations().map(animation => animation.finished));
          await new Promise(requestAnimationFrame);
        });
      }
      const field = page.locator('.form-entry--search .form-entry__field__input').first();
      await field.locator('input').fill('Search');
      for (const button of await field.locator('button').all()) {
        if (await button.isVisible()) await focus(page, button);
        const border = await button.evaluate(el => getComputedStyle(el).borderTop);
        assert.equal(border, `1px solid ${palette.CanvasText}`, `${story} at ${width}px: field button border`);
      }
      await capture(page, `${page._testName}-${story}-${width}`);
      checks++;
    }
  }
}

async function checkNormalSearchButtons(browser) {
  // Firefox needs a fresh context to disable forced-color emulation reliably.
  const page = await browser.newPage({ forcedColors: 'none', viewport: { width: 1200, height: 800 } });
  try {
    for (const story of ['form--search-entry-html', 'form--search-entry', 'main-menu--bar-html', 'main-menu--bar-react']) {
      await page.goto(`${base}/iframe.html?id=${story}&viewMode=story`);
      const field = page.locator('.form-entry--search .form-entry__field__input').first();
      await field.waitFor();
      assert.equal(await page.evaluate(() => matchMedia('(forced-colors: active)').matches), false);
      assert.ok(await field.locator('button').evaluateAll(elements => elements.every(el => getComputedStyle(el).borderTopWidth === '0px')), `${story}: normal-color buttons must keep their existing appearance`);
    }
  } finally {
    await page.close();
  }
}

async function checkSwitches(page) {
  for (const story of ['form--checkbox-switch-html', 'form--checkbox-switch']) {
    await visit(page, story, '.switch__slider');
    const input = page.locator('.form-entry__option__switch input').first();
    const read = () => page.locator('.switch__slider').first().evaluate(el => {
      const track = getComputedStyle(el, '::before'), thumb = getComputedStyle(el, '::after');
      return { border: parseFloat(track.borderTopWidth), opacity: track.opacity, position: thumb.insetInlineStart };
    });
    await input.uncheck({ force: true });
    await page.waitForTimeout(250); // The component animates its thumb for 200ms.
    const off = await read();
    await input.check({ force: true });
    await page.waitForTimeout(250);
    const on = await read();
    assert.ok(off.border > 0 && on.border > 0);
    assert.equal(off.opacity, '1');
    assert.notEqual(off.position, on.position, 'Switch position must communicate state');
    await page.keyboard.press('Tab');
    await input.focus();
    assert.ok(await page.locator('.switch__slider').first().evaluate(el => parseFloat(getComputedStyle(el).outlineWidth) > 0));
    await capture(page, `${page._testName}-${story}`);
    checks++;
  }
}

async function checkPanels(page, palette) {
  await page.setViewportSize({ width: 1200, height: 800 });
  for (const story of [
    'dropdown--default-html', 'dropdown--default-react',
    'dropdown--mega-menu-html', 'dropdown--mega-menu-react',
    'main-menu--bar-html', 'main-menu--bar-react',
    'main-menu--stack-html', 'main-menu--stack-react',
  ]) {
    await visit(page, story, '[data-toggle="dropdown"]');
    const trigger = page.locator('[data-toggle="dropdown"]').first();
    const id = await trigger.getAttribute('aria-controls');
    await trigger.click();
    const panel = page.locator(`[id="${id}"]`);
    await panel.waitFor({ state: 'visible' });
    const border = await panel.evaluate(el => {
      const s = getComputedStyle(el);
      return { width: parseFloat(s.borderInlineStartWidth), color: s.borderInlineStartColor };
    });
    assert.ok(border.width > 0, `${story}: dropdown panel must keep its boundary`);
    assert.equal(border.color, palette.CanvasText, story);
    await focus(page, panel.locator('a, button').first());
    await capture(page, `${page._testName}-${story}`);
    checks++;
  }
  for (const component of ['modal', 'flyout']) {
    for (const variant of ['html', 'react']) {
      const story = `${component}--default-${variant}`;
      await visit(page, story, '#storybook-root .button');
      await page.getByRole('button', { name: component === 'modal' ? 'Open Modal' : 'Flyout Menu', exact: true }).click();
      const panel = page.locator(`.${component}.shown .${component}__content`);
      await panel.waitFor({ state: 'visible' });
      const border = await panel.evaluate(el => {
        const s = getComputedStyle(el);
        return { width: parseFloat(s.borderInlineStartWidth), color: s.borderInlineStartColor };
      });
      assert.ok(border.width > 0, `${story}: overlay panel must keep its boundary`);
      assert.equal(border.color, palette.CanvasText, story);
      await capture(page, `${page._testName}-${story}`);
      checks++;
    }
  }
}

async function checkBorderToken(page, palette) {
  await visit(page, 'button--default-html', '.button');
  // Exercise the component border contract under actual theme ancestors.
  const result = await page.evaluate(expected => {
    const host = document.createElement('div');
    host.className = 'theme-primary';
    host.style.setProperty('--forced-color-border', '3px dashed LinkText');
    host.innerHTML = '<button class="button">Button</button><button class="button border-radius-2">Rounded button</button><button class="accordion__button">Accordion</button><div class="alert">Alert</div><div class="modal__content border-radius-2">Modal</div><div class="flyout__content">Flyout</div><div class="tabs">Tabs</div>';
    document.body.append(host);
    const failures = [...host.children].flatMap(el => {
      const s = getComputedStyle(el);
      const border = el.classList.contains('flyout__content') ? [s.borderInlineStartWidth, s.borderInlineStartStyle, s.borderInlineStartColor] : [s.borderTopWidth, s.borderTopStyle, s.borderTopColor];
      return border.join('|') === `3px|dashed|${expected}` ? [] : [{ component: el.className, border }];
    });
    host.remove();
    return failures;
  }, palette.LinkText);
  assert.deepEqual(result, [], 'Shared border width, style, and color must survive theme rules');
  for (const story of ['accordion--default-html', 'accordion--react']) {
    await visit(page, story, '.accordion__button');
    await focus(page, page.locator('.accordion__button').first());
  }
  checks++;
}

if (screenshots) await mkdir(screenshots, { recursive: true });
for (const name of requested) {
  assert.ok(browsers[name], `Unknown browser: ${name}`);
  const browser = await browsers[name].launch();
  try {
    await checkNormalSearchButtons(browser);
    for (const colorScheme of ['light', 'dark']) {
      const page = await browser.newPage({ forcedColors: 'active', colorScheme, viewport: { width: 960, height: 800 } });
      page._testName = `${name}-${colorScheme}`;
      await visit(page, 'tab--default-html', '.tabs-nav .is-active');
      const palette = await colors(page);
      await checkTabs(page, palette, 400);
      await checkTabs(page, palette, 960);
      await checkCarets(page, palette);
      await checkSwitches(page);
      await checkBorderToken(page, palette);
      await checkPanels(page, palette);
      await checkSearchButtons(page, palette);
      await page.close();
      console.log(`PASS ${name} ${colorScheme}: tabs, carets, switches, shared borders, panels, search buttons, and keyboard focus`);
    }
  } finally {
    await browser.close();
  }
}
console.log(`PASS ${checks} forced-color regression cases`);
