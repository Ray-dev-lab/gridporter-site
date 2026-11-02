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
  context.window.GRIDPORTER_CONFIG={...context.window.GRIDPORTER_CONFIG,supportFormUrl:'',...overrides};
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

test('PWA proposal separates planned sales, business files and support without active purchase links',()=>{const home=fs.readFileSync(path.join(root,'index.html'),'utf8'),privacy=fs.readFileSync(path.join(root,'privacy/index.html'),'utf8'),terms=fs.readFileSync(path.join(root,'terms/index.html'),'utf8');for(const text of ['PWA','Founder','10万セル','一括承認','元ファイル','未販売'])assert.ok(home.includes(text),text);assert.doesNotMatch(home,/CHROME EXTENSION|Pro beta|0\.4\.2 beta/);assert.ok(privacy.includes('業務データをContactSupporterへ自動送信しません'));for(const text of ['Google','LINE','人間','7日','30日'])assert.ok(privacy.includes(text),text);assert.ok(terms.includes('価格、納品時期'));assert.equal((home.match(/data-config-link="chromeWebStoreUrl"/g)||[]).length,0);});

test('current PWA metadata agrees with page content and keeps standard and OG descriptions aligned',()=>{
 for(const name of ['index.html','terms/index.html','privacy/index.html','support/index.html']){
  const html=fs.readFileSync(path.join(root,name),'utf8'),head=html.split('</head>')[0];
  const title=head.match(/<title>([^<]+)<\/title>/)[1],ogTitle=head.match(/property="og:title" content="([^"]+)"/)[1];
  const description=head.match(/name="description" content="([^"]+)"/)[1],ogDescription=head.match(/property="og:description" content="([^"]+)"/)[1];
  assert.equal(title,ogTitle,name);assert.equal(description,ogDescription,name);assert.match(description,/PWA/,name);
  assert.doesNotMatch(head,/Chrome拡張|β版|Free\s*\/\s*Pro|0\.4\.2/,name);
  assert.match(html,/Free\s*\/\s*Founder/,name);
 }
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.match(home,/<title>GridPorter \| 仕入価格改定を確認するPWA<\/title>/);
 assert.match(home,/XLSX一括入力には対応していません/);
 assert.match(home,/最大2,000行/);assert.match(home,/最大20,000行/);
 assert.match(fs.readFileSync(path.join(root,'README.md'),'utf8'),/本体Phase 4\.5はmainへ統合済み/);
});

test('buyer guide orders real synthetic examples before plans and separates future onboarding from sale',()=>{
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const anchors=['id="example"','id="plans"','id="before-purchase"','id="getting-started"','id="details"'];
 for(let i=1;i<anchors.length;i++)assert.ok(home.indexOf(anchors[i])>home.indexOf(anchors[i-1]));
 for(const word of ['購買・商品管理','Founder開発検証画面','Freeで月次照合が利用できるという案内ではありません','購入直後の自動解放は約束していません','実機インストール・実Excel・本番納品の受入は未完了'])assert.ok(home.includes(word),word);
 for(const file of ['previous.csv','current.csv','master.csv','confirmation-sample.xlsx','proposal-sample.csv'])assert.ok(home.includes('assets/samples/'+file));
 assert.ok(fs.readFileSync(path.join(root,'assets/screenshots/price-review.jpg')).subarray(0,3).equals(Buffer.from([255,216,255])));
 assert.doesNotMatch(home,/data-config-link="(?:purchaseUrl|appUrl|chromeWebStoreUrl)"|1,980|2,980|4,980/);
});
