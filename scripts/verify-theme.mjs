import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'msedge',headless:true});const errors=[];const base=process.env.TEST_URL||'http://localhost:3000';
const ready=p=>p.waitForFunction(()=>document.querySelector('[data-home]')?.dataset.motionReady==='true');
const theme=p=>p.locator('html').getAttribute('data-theme');
const toggle=p=>p.locator('header .theme-toggle').click();
try {
 for(const width of [1440,1280,390,375]){
  const context=await b.newContext({viewport:{width,height:900},colorScheme:'light'});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await p.addInitScript(()=>{window.firstBodyTheme=null;new MutationObserver((_,o)=>{if(document.body){window.firstBodyTheme=document.documentElement.dataset.theme;o.disconnect();}}).observe(document.documentElement||document,{childList:true,subtree:true});});
  await p.goto(base,{waitUntil:'networkidle'});await ready(p);assert.equal(await theme(p),'light');assert.equal(await p.evaluate(()=>window.firstBodyTheme),'light');
  for(const target of ['dark','light']){
   await toggle(p);await p.waitForTimeout(400);assert.equal(await theme(p),target);assert.equal(await p.evaluate(()=>localStorage.getItem('osel-theme')),target);
   assert.equal(await p.locator('.pin-spacer').count(),2);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const visibleLogo=p.locator(`header .theme-${target}-only[src]`);assert.ok(await visibleLogo.isVisible());assert.ok(await visibleLogo.evaluate(el=>el.complete&&el.naturalWidth>0));
   await p.screenshot({path:`scripts/theme-${target}-${width}.png`});
   if(width>=1280){await p.locator('#products-trigger').click();await p.waitForTimeout(350);assert.ok(await p.locator('#products-menu').isVisible());await p.keyboard.press('Escape');}
   else{await p.getByRole('button',{name:'Open navigation'}).click();await p.waitForTimeout(350);assert.ok(await p.locator('dialog').isVisible());await p.locator('dialog .theme-toggle').click();assert.notEqual(await theme(p),target);await p.locator('dialog .theme-toggle').click();await p.keyboard.press('Escape');await p.locator('dialog').waitFor({state:'hidden'});}
   await p.evaluate(()=>scrollTo(0,document.querySelector('[data-product-section]').getBoundingClientRect().top+scrollY+600));await p.waitForTimeout(800);const progress=await p.locator('[data-product-index]').textContent();await toggle(p);await p.waitForTimeout(400);assert.equal(await p.locator('[data-product-index]').textContent(),progress);assert.equal(await p.locator('.pin-spacer').count(),2);await toggle(p);
   await p.reload({waitUntil:'networkidle'});await ready(p);assert.equal(await theme(p),target);assert.equal(await p.evaluate(()=>window.firstBodyTheme),target);
   await p.evaluate(()=>scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(1500);await p.screenshot({path:`scripts/theme-footer-${target}-${width}.png`});assert.ok(await p.locator('footer').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+2));
   await p.goto(base+'/about');assert.equal(await theme(p),target);await p.goto(base,{waitUntil:'networkidle'});await ready(p);
  }
  await context.close();console.log('PASS themes, persistence, pre-paint initialization, menus, pins, footer, routes at '+width);
 }
 const context=await b.newContext({colorScheme:'dark'});const p=await context.newPage();await p.goto(base,{waitUntil:'networkidle'});assert.equal(await theme(p),'dark');await p.emulateMedia({colorScheme:'light'});await p.waitForTimeout(100);assert.equal(await theme(p),'light');await toggle(p);await p.emulateMedia({colorScheme:'dark'});await p.emulateMedia({colorScheme:'light'});assert.equal(await theme(p),'dark');await p.emulateMedia({reducedMotion:'reduce'});await p.waitForTimeout(400);assert.equal(await p.locator('.pin-spacer').count(),0);await context.close();
 const blocked=await b.newContext({colorScheme:'dark'});const q=await blocked.newPage();await q.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('Storage unavailable');}});});await q.goto(base,{waitUntil:'networkidle'});assert.equal(await theme(q),'dark');await toggle(q);assert.equal(await theme(q),'light');await blocked.close();assert.deepEqual(errors,[]);console.log('PASS system preference, saved override, reduced motion, blocked storage, no hydration/browser errors');
}finally{await b.close();}
