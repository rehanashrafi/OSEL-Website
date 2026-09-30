import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'msedge',headless:true});
try {
const c=await b.newContext({colorScheme:'light'});const p=await c.newPage();await p.goto('http://localhost:3100',{waitUntil:'networkidle'});const q=await c.newPage();await q.goto('http://localhost:3100/about',{waitUntil:'networkidle'});await p.locator('header .theme-toggle').focus();await p.keyboard.press('Enter');await q.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
for(const mode of ['dark','light']){
 if(await p.locator('html').getAttribute('data-theme')!==mode)await p.locator('header .theme-toggle').click();await p.waitForTimeout(350);
 const values=await p.evaluate(()=>{
  const probe=document.createElement('span');probe.style.transition='none';document.body.append(probe);
  const rgb=token=>{probe.style.color=`var(--${token})`;return getComputedStyle(probe).color.match(/[\d.]+/g).slice(0,3).map(Number);};
  const l=a=>a.map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
  const ratio=(fg,bg)=>{const a=l(rgb(fg)),b=l(rgb(bg));return {fg,bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};};
  const results=[];for(const fg of ['text-primary','text-secondary','text-muted','accent'])for(const bg of ['background','background-secondary','surface','surface-secondary'])results.push(ratio(fg,bg));for(const bg of ['accent','accent-hover'])results.push(ratio('on-accent',bg));probe.remove();return results;
 });assert.ok(values.every(x=>x.ratio>=4.5),JSON.stringify(values.filter(x=>x.ratio<4.5)));console.log(mode+' minimum contrast '+Math.min(...values.map(x=>x.ratio)).toFixed(2)+':1');
}
const cdp=await c.newCDPSession(p);await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await p.reload({waitUntil:'networkidle'});assert.equal(await p.locator('html').getAttribute('data-theme'),'light');console.log('PASS semantic contrast, keyboard toggle, cross-tab sync and uncached refresh');
}finally{await b.close();}
