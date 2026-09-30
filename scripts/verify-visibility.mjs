import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:'msedge',headless:true});
const failures=[];
const visible = async page => {
 await page.waitForTimeout(1500);
 const hidden=await page.locator('[data-reveal-line], [data-reveal]').evaluateAll(nodes=>nodes.filter(el=>{
   const section=el.closest('[data-reveal-section]');
   if(section.getBoundingClientRect().top>=innerHeight-2)return false;
   const s=getComputedStyle(el);const m=s.transform==='none'?null:new DOMMatrixReadOnly(s.transform);
   return Number(s.opacity)<0.99||s.visibility==='hidden'||(m&&Math.abs(m.m42)>1);
 }).map(el=>({text:el.textContent,style:el.getAttribute('style')})));
 assert.deepEqual(hidden,[]);
};
const ready=page=>page.waitForFunction(()=>document.querySelector('[data-home]')?.dataset.motionReady==='true');
try {
 for(const base of ['http://localhost:3100','http://localhost:3000']) {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',error=>failures.push(error.message));
  page.on('console',message=>{if(message.type()==='error'||/GSAP|hydration/i.test(message.text())&&message.type()==='warning')failures.push(message.text());});
  await page.goto(base,{waitUntil:'networkidle'});await ready(page);
  assert.equal(await page.locator('.pin-spacer').count(),2);
  for(const selector of ['[aria-labelledby="welcome-title"]','[data-manufacturing]','[aria-labelledby="journey-title"]','[data-cta]']) {
   await page.evaluate(sel=>window.scrollTo(0,document.querySelector(sel).getBoundingClientRect().top+scrollY-150),selector);await visible(page);
  }
  await page.reload({waitUntil:'networkidle'});await ready(page);await visible(page);
  for(let i=0;i<2;i++){
   await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await visible(page);
   await page.evaluate(()=>window.scrollTo(0,0));await visible(page);
  }
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);
  assert.equal(await page.locator('.pin-spacer').count(),2);
  await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await visible(page);
  await page.emulateMedia({reducedMotion:'reduce'});await visible(page);
  assert.equal(await page.locator('[data-pillar]').evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).opacity==='1')),true);
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});await visible(page);
  assert.equal(await page.locator('.pin-spacer').count(),2);
  for(let i=0;i<3;i++){
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.locator('header').getByRole('link',{name:'Enquire Now'}).click();await page.waitForURL('**/contact');
   assert.equal(await page.locator('.pin-spacer').count(),0);
   assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('lenis')),false);
   await page.locator('header').getByRole('link',{name:'Home',exact:true}).click();await ready(page);
   assert.equal(await page.locator('.pin-spacer').count(),2);
   assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('lenis')),true);
   await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await visible(page);
  }
  await page.close();console.log(`PASS: visibility, reload, fast scroll both directions, resizing, motion changes and 3 route remounts on ${base}`);
 }
 // Delay layout readiness, leave the route, and release stale setup work only after a new mount.
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.addInitScript(()=>{let release;const pending=new Promise(resolve=>{release=resolve;});Object.defineProperty(document.fonts,'ready',{get:()=>pending});window.releaseFonts=release;});
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await page.locator('header').getByRole('link',{name:'Enquire Now'}).click();await page.waitForURL('**/contact');
 await page.locator('header').getByRole('link',{name:'Home',exact:true}).click();
 await page.evaluate(()=>window.releaseFonts());await ready(page);
 assert.equal(await page.locator('.pin-spacer').count(),2);
 await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await visible(page);
 await page.close();assert.deepEqual(failures,[]);
 console.log('PASS: cancelled asynchronous setup, Strict Mode remount, visible final transforms and no console/hydration warnings.');
}finally{await browser.close();}



