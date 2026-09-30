import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[];
const base=process.env.TEST_URL||'http://localhost:3000';
const scroll=async(page,y)=>{await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(850);};
async function story(page,kind){
 const section=page.locator(`[data-${kind}-section]`);
 const pin=page.locator(`[data-${kind}-pin]`);
 const geometry=await section.evaluate(el=>{const spacer=el.querySelector('.pin-spacer');const pin=spacer.firstElementChild;return {start:el.getBoundingClientRect().top+scrollY-(innerWidth>=1024?80:76),distance:spacer.offsetHeight-pin.offsetHeight};});
 assert.ok(geometry.distance>500);
 for(const fraction of kind==='product'?[0,.5,1]:[0,.27,.49,.72,1]){
  await scroll(page,geometry.start+geometry.distance*fraction);
  const box=await pin.boundingBox();assert.ok(Math.abs(box.y-(await page.evaluate(()=>innerWidth>=1024?80:76)))<3,`${kind} pin ${JSON.stringify(box)}`);
  if(kind==='product'){
   assert.equal(await page.locator('[data-product-index]').textContent(),String(Math.round(fraction*8)+1).padStart(2,'0'));
   const fit=await pin.evaluate(el=>el.lastElementChild.getBoundingClientRect().bottom<=innerHeight+1);assert.ok(fit,'product progress clipped');
  }else{
   const visible=await page.locator('[data-pillar]').evaluateAll(nodes=>nodes.filter(el=>+getComputedStyle(el).opacity>.95).map(el=>({title:el.querySelector('h3').textContent,bottom:el.querySelector('.body-lg').getBoundingClientRect().bottom})));
   assert.equal(visible.length,1,JSON.stringify(visible));assert.ok(visible[0].bottom<(await page.evaluate(()=>innerHeight)),'pillar text clipped');
  }
 }
 if(kind==='product')assert.ok(await page.locator('[data-product-track]').evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m41+el.scrollWidth-el.parentElement.clientWidth)<2));
}
try{
 for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,900],[1024,768],[768,1024],[430,932],[390,844],[375,667]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1024});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('[data-home]')?.dataset.motionReady==='true');
  assert.equal(await page.locator('.pin-spacer').count(),2);await story(page,'product');await story(page,'pillar');
  await scroll(page,await page.evaluate(()=>document.body.scrollHeight));
  assert.ok(await page.locator('footer').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+2));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(await page.locator('[data-reveal-line],[data-reveal]').evaluateAll(nodes=>nodes.filter(el=>+getComputedStyle(el).opacity<.99||getComputedStyle(el).visibility==='hidden').map(el=>el.textContent)),[]);
  if(width===375){
   for(const size of [{width:667,height:375},{width:375,height:667}]){await scroll(page,0);await page.setViewportSize(size);await page.waitForTimeout(900);await story(page,'product');await story(page,'pillar');}
   await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('[data-home]')?.dataset.motionReady==='true');assert.equal(await page.locator('.pin-spacer').count(),2);
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);assert.equal(await page.locator('.pin-spacer').count(),0);assert.ok(await page.locator('[data-pillar]').evaluateAll(nodes=>nodes.every(el=>+getComputedStyle(el).opacity===1)));
  }
  await page.close();console.log(`PASS ${width}x${height}`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
