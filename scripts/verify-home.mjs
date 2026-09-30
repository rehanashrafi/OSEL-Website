import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const ready=async()=>page.waitForFunction(()=>document.querySelector('[data-home]')?.dataset.motionReady==='true');
const scroll=async y=>{await page.evaluate(top=>window.scrollTo(0,top),y);await page.waitForTimeout(750);};
const sectionY=async selector=>page.locator(selector).evaluate(el=>el.getBoundingClientRect().top+scrollY);
try {
 await page.goto('http://localhost:3100',{waitUntil:'networkidle'});await ready();
 assert.equal(await page.locator('header').count(),1);assert.equal(await page.locator('footer').count(),1);
 assert.equal(await page.locator('main h1').count(),1);assert.equal(await page.locator('[data-product-card]').count(),9);
 assert.equal(await page.locator('.pin-spacer').count(),2);
 await page.locator('#products-trigger').click();
 assert.equal(await page.evaluate(()=>document.elementFromPoint(300,200)?.closest('#products-menu')!==null),true);
 await page.keyboard.press('Escape');
 const productStart=await sectionY('[data-product-section]')-80;
 await scroll(productStart);
 await page.getByRole('button',{name:'Next display',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('[data-product-index]').textContent==='02');
 await page.locator('[data-product-card]').last().getByRole('link').focus();
 await page.waitForTimeout(700);
 const last=await page.locator('[data-product-card]').last().getByRole('link').boundingBox();
 assert.ok(last.x>=0&&last.x+last.width<=1440,'keyboard focused product must be visible');
 await page.screenshot({path:'scripts/home-product-last.png'});
 for(const [name,selector] of [['welcome','[aria-labelledby="welcome-title"]'],['pillars','[data-pillar-section]'],['universe','[data-universe]'],['manufacturing','[data-manufacturing]'],['clients','[data-clientele]'],['journey','[aria-labelledby="journey-title"]'],['cta','[data-cta]']]) {
   await scroll(await sectionY(selector)-100);
   await page.screenshot({path:`scripts/home-${name}-desktop.png`});
 }
 const pillarsStart=await sectionY('[data-pillar-section]');
 await scroll(pillarsStart+1200);await page.reload({waitUntil:'networkidle'});await ready();await page.waitForTimeout(800);
 assert.equal(await page.locator('.pin-spacer').count(),2);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(600);
 assert.equal(await page.locator('.pin-spacer').count(),0);
 assert.equal(await page.locator('[data-pillar]').evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).opacity==='1')),true);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(600);
 assert.equal(await page.locator('.pin-spacer').count(),2);
 for(const width of [1440,1280,1024,768,430,390,375]) {
   await page.setViewportSize({width,height:900});await scroll(0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px outer overflow`);
   assert.deepEqual(await page.locator('[data-reveal-line], [data-hero-word]').evaluateAll(nodes=>nodes.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.textContent)),[], 'masked heading clipping');
   assert.equal(await page.locator('.pin-spacer').count(),2,`${width}px pin mode`);
   for(const selector of ['[data-universe]','[data-manufacturing]','[data-cta]']) { await scroll(await sectionY(selector));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px ${selector}`); }
 }
 await scroll(0);await page.getByRole('button',{name:'Open navigation'}).click();
 assert.equal(await page.evaluate(()=>document.body.style.position),'fixed');await page.keyboard.press('Escape');
 await page.locator('dialog').waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.body.style.position),'');
 await scroll(await sectionY('[data-product-section]'));
 const before=await page.locator('[data-product-index]').textContent();
 await page.getByRole('button',{name:'Next display',exact:true}).click();await page.waitForTimeout(750);
 assert.notEqual(await page.locator('[data-product-index]').textContent(),before,'mobile product controls');
 await page.screenshot({path:'scripts/home-products-mobile.png'});
 await page.setViewportSize({width:1440,height:1000});await scroll(0);
 await page.getByRole('link',{name:'Explore our displays',exact:true}).click();await page.waitForURL('**/products/led-displays');
 assert.equal(await page.locator('.pin-spacer').count(),0);assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('lenis')),false);
 await page.locator('header').getByRole('link',{name:'Home',exact:true}).click();await page.waitForURL('http://localhost:3100/');await ready();
 assert.equal(await page.locator('.pin-spacer').count(),2);
 const internal=await page.locator('main a[href^="/"]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.getAttribute('href')))]);
 for(const href of internal) assert.equal((await page.request.get('http://localhost:3100'+href)).status(),200,href);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);
 for(const selector of ['[data-product-section]','[data-manufacturing]','[data-clientele]']) {await scroll(await sectionY(selector));}
 const broken=await page.locator('main img').evaluateAll(nodes=>nodes.filter(n=>n.complete&&n.naturalWidth===0).map(n=>n.src));
 assert.deepEqual(broken,[]);assert.deepEqual(errors,[]);
 console.log('PASS: 9 products, 9 sections, 7 viewport sizes, desktop pins, pinned mobile controls, reduced motion, reload at mid-page, resize, keyboard product access, Lenis teardown, navigation cleanup/remount, menu layering, image loading, internal links and browser errors.');
} finally {await browser.close();}

