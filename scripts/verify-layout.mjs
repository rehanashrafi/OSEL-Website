import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.env.OSEL_TEST_URL ?? 'http://localhost:3100';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const links = async scope => scope.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/') && !href.startsWith('//')));
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  const desktopLinks = new Set(await links(page.locator('header')));
  const triggers = await page.locator('nav[aria-label="Primary"] button').evaluateAll(nodes => nodes.map(node => node.id));
  for (const id of triggers) {
    const trigger = page.locator(`#${id}`);
    await trigger.click();
    for (const href of await links(page.locator('header'))) desktopLinks.add(href);
    await page.keyboard.press('Escape');
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  }
  const footerLinks = new Set(await links(page.locator('footer')));
  await page.locator('#products-trigger').focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('href')), '/products/led-displays');
  await page.locator('#products-menu summary').filter({ hasText: /^Clario$/ }).click();
  await page.locator('#products-menu').getByRole('link', { name: 'Clario Shield', exact: true }).click();
  await page.waitForURL('**/products/led-displays/clario-shield');
  assert.equal(await page.locator('h1').textContent(), 'Clario Shield');
  assert.equal(await page.locator('#products-trigger').getAttribute('data-active'), 'true');
  assert.equal(await page.locator('#products-trigger').getAttribute('aria-expanded'), 'false');
  await page.locator('#investors-trigger').click();
  await page.locator('#investors-menu').getByRole('link', { name: 'Corporate Announcements', exact: true }).click();
  await page.waitForURL('**/investors/corporate-announcements');
  assert.equal(await page.locator('#investors-trigger').getAttribute('data-active'), 'true');
  assert.equal(await page.locator('#products-trigger').getAttribute('data-active'), 'false');
  await page.locator('#investors-trigger').click();
  await page.mouse.click(1400, 900);
  assert.equal(await page.locator('#investors-trigger').getAttribute('aria-expanded'), 'false');
  const sourceRoutes = (await fs.readFile('ROUTES.md', 'utf8')).split('\n').filter(line => /^\| .+ \| \/[^ ]* \|/.test(line)).map(line => line.split('|')[2].trim());
  const routes = new Set([...sourceRoutes, ...desktopLinks, ...footerLinks]);
  assert.equal(sourceRoutes.length, 44);
  assert.equal(routes.size, 58);
  for (const href of routes) {
    const response = await page.goto(`${base}${href}`, { waitUntil: 'load' });
    assert.equal(response.status(), 200, href);
    assert.equal(await page.locator('main h1').count(), 1, href);
    if (href !== '/') assert.equal(await page.locator('main form, main img, main canvas').count(), 0, href);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, href);
  }
  const invalid = await page.request.get(`${base}/products/led-displays/not-a-real-product`);
  assert.equal(invalid.status(), 404);
  console.log(`PASS: ${routes.size} linked routes render one main heading; invalid product returns 404.`);
  await page.goto(base, { waitUntil: 'networkidle' });
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width}px overflow`);
    if (width >= 1280) {
      const rects = await page.locator('header .site-container > *:visible').evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { left:r.left,right:r.right }; }));
      for (let i = 1; i < rects.length; i++) assert.ok(rects[i].left >= rects[i-1].right, `header overlap ${width}px`);
      continue;
    }
    const open = page.getByRole('button', { name: 'Open navigation' });
    await open.click();
    await page.locator('dialog').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => document.body.style.position), 'fixed');
    const mobileLinks = new Set(await links(page.locator('dialog')));
    for (const href of desktopLinks) assert.ok(mobileLinks.has(href), `Missing mobile destination: ${href}`);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true);
    await page.keyboard.press('Escape');
    await page.locator('dialog').waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => document.body.style.position), '');
    assert.equal(await open.evaluate(el => el === document.activeElement), true);
  }
  await page.setViewportSize({ width:390,height:844 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.locator('dialog summary').filter({hasText:/^Investors$/}).click();
  await page.locator('dialog').getByRole('link', {name:'Corporate Announcements',exact:true}).click();
  await page.waitForURL('**/investors/corporate-announcements');
  await page.locator('dialog').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(() => document.body.style.position), '');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(await page.locator('dialog summary').filter({hasText:/^Investors$/}).getAttribute('data-active'), 'true');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button', {name:'Close navigation'}).click();
  await page.locator('dialog').waitFor({state:'hidden'});
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('dialog').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(() => document.body.style.position), '');
  await page.goto(base, {waitUntil:'networkidle'});
  await page.locator('#products-trigger').click();
  await page.screenshot({path:'scripts/navigation-desktop.png'});
  await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.locator('dialog summary').filter({hasText:/^Products$/}).click();
  await page.screenshot({path:'scripts/navigation-mobile.png'});
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.screenshot({path:'scripts/navigation-footer.png'});
  assert.deepEqual(errors, []);
  console.log('PASS: menu keyboard/outside click, product/investor navigation, active routes, desktop/mobile parity, focus trap/return, scroll locking, reduced motion, responsive layouts and console/hydration checks.');
} finally { await browser.close(); }

