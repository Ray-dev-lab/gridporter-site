const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const siteScript = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');
const configScript = fs.readFileSync(path.join(root, 'assets/site-config.js'), 'utf8');
const form = 'https://docs.google.com/forms/d/e/TestFormId/viewform';
function run(overrides = {}, key = 'supportFormUrl', pageUrl = 'https://ray-dev-lab.github.io/gridporter-site/support/') {
  const link = {dataset:{configLink:key}, hidden:false, href:'https://forms.gle/StaleForm', textContent:'お問い合わせフォームを開く', removeAttribute(name){delete this[name];}};
  const status = {hidden:true};
  const context = {window:{location:{href:pageUrl}},URL, document:{
    currentScript:{src:'https://ray-dev-lab.github.io/gridporter-site/assets/site.js'},
    querySelectorAll:()=>[link],querySelector:selector=>selector==='[data-support-form-status]'?status:null,
  }};
  vm.runInNewContext(configScript, context);
  context.window.GRIDPORTER_CONFIG={...context.window.GRIDPORTER_CONFIG,...overrides};
  vm.runInNewContext(siteScript,context);
  return {link,status};
}
test('unconfigured form has no active link and shows preparation status',()=>{
  const {link,status}=run();assert.equal(link.hidden,true);assert.equal(link.href,undefined);assert.equal(status.hidden,false);
});
for(const url of [form,'https://docs.google.com/forms/d/TestFormId/viewform','https://forms.gle/TestFormId']){
 test(`Google responder link is used unchanged: ${url}`,()=>{
  const {link,status}=run({supportFormUrl:url});assert.equal(link.hidden,false);assert.equal(link.href,url);assert.equal(status.hidden,true);assert.equal(link.textContent,'お問い合わせフォームを開く');
 });
}
test('invalid or non-responder links fail closed, including stale static links',()=>{
 for(const value of [null,42,{},'', 'http://forms.gle/TestFormId','https://forms.gle.evil.test/TestFormId','https://evil.test/forms.gle/TestFormId','https://user:pass@forms.gle/TestFormId','https://forms.gle:443/TestFormId',form+'?entry.1=private',form+'#private','https://docs.google.com/forms/d/TestFormId/edit','https://docs.google.com/spreadsheets/d/TestSheet/edit',form+'\n','https://forms.gle/%0dTest','javascript:alert(1)','mailto:help@support.test','https://forms.gle/'+ 'a'.repeat(2050)]){
  const {link,status}=run({supportFormUrl:value});assert.equal(link.hidden,true,JSON.stringify(value));assert.equal(link.href,undefined);assert.equal(status.hidden,false);
 }
});
test('page data and old mail settings cannot prefill a form',()=>{
 const {link}=run({supportFormUrl:form,supportSubject:'private',supportBody:'secret'},'supportFormUrl','https://ray-dev-lab.github.io/gridporter-site/support/?email=private&body=secret#subject=other');assert.equal(link.href,form);
});
test('supportUrl remains independent of supportFormUrl',()=>{
 assert.equal(run({supportUrl:'https://support.test/help'}).link.hidden,true);
 assert.equal(run({supportUrl:'https://support.test/help'},'supportUrl').link.href,'https://support.test/help');
});
test('other configured HTTPS destinations retain URL validation',()=>{
 assert.equal(run({chromeWebStoreUrl:'https://chromewebstore.google.com/detail/gridporter/test'},'chromeWebStoreUrl').link.hidden,false);
 for(const value of ['http://other.test/','javascript:alert(1)','https://user:pass@other.test/'])assert.equal(run({chromeWebStoreUrl:value},'chromeWebStoreUrl').link.hidden,true);
});
test('no local inquiry collection, storage, automatic navigation or mail-app links',()=>{
 for(const file of ['index.html','privacy/index.html','terms/index.html','support/index.html','404.html']){
  const html=fs.readFileSync(path.join(root,file),'utf8');assert.doesNotMatch(html,/<(?:form|input|textarea|iframe)\b/i);assert.doesNotMatch(html,/href\s*=\s*["']mailto:/i);
 }
 assert.doesNotMatch(siteScript,/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|FormData)\b|document\.cookie/);
 assert.doesNotMatch(siteScript,/\.click\s*\(|\.submit\s*\(|window\.open\s*\(|location\s*=/);
 assert.doesNotMatch(siteScript,/supportTemplates|supportMailto|encodeURIComponent/);
});
test('support provides one external form entry, stable anchors and plain fallback email',()=>{
 const html=fs.readFileSync(path.join(root,'support/index.html'),'utf8');
 assert.equal((html.match(/data-config-link="supportFormUrl"/g)||[]).length,1);
 assert.match(html,/target="_blank" rel="noopener noreferrer"/);
 assert.match(html,/id="contact"/);assert.match(html,/id="contact-options"/);
 for(const type of ['bug','usage','improvement','privacy','general'])assert.ok(html.includes(`id="contact-${type}"`));
 assert.match(html,/<span data-support-email-fallback>raydevsupport@gmail.com<\/span>/);
 assert.match(html,/件名の先頭を正確に「\[GridPorter\]」/);
 assert.match(html,/フォーム・メールのどちらから/);assert.match(html,/このメールアドレスから回答/);
 assert.doesNotMatch(html,/data-support-type|data-support-options|data-config-link="supportEmail"/);
});
