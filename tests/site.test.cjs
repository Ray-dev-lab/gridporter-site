const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const siteScript = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');
const configScript = fs.readFileSync(path.join(root, 'assets/site-config.js'), 'utf8');

const generalBody = '【お問い合わせ内容】\r\n\r\n【補足情報】\r\n（任意）';
const cases = {
  bug: ['[GridPorter] 不具合報告', `【GridPorterのバージョン】
（分かる範囲で記入）

【利用環境】
OS：
Chromeのバージョン：

【利用していた機能】
（例：表の取得、Recipe、Excel保存、比較）

【発生した問題】
（どのような問題が発生しましたか？）

【再現手順】
1.
2.
3.

【期待した動作】
（本来どうなることを期待しましたか？）

【実際の動作】
（実際に何が起こりましたか？）

【エラー表示・診断コード】
（表示された場合のみ記入）

【発生頻度】
（毎回 / ときどき / 1回のみ / 不明）`],
  usage: ['[GridPorter] 使い方の質問', `【質問内容】
（知りたいことを記入してください）

【利用している機能】
（分かる範囲で記入）

【試した操作】
（既に試した方法があれば記入してください）

【GridPorterのバージョン・利用環境】
（必要に応じて記入）`],
  improvement: ['[GridPorter] 改善要望', `【改善してほしいこと】

【現在困っていること】

【希望する動作・機能】

【どのような場面で使いたいか】
（任意）`],
  privacy: ['[GridPorter] データ・プライバシー相談', `【お問い合わせ内容】
（データ保存、削除、プライバシーなどについて記入してください）

【対象となる機能】
（分かる範囲で記入）

【確認したいこと・希望する対応】`],
  general: ['[GridPorter] お問い合わせ', generalBody],
};

function run(overrides = {}, type, pageUrl = 'https://ray-dev-lab.github.io/gridporter-site/support/') {
  const link = { dataset: { configLink: 'supportEmail' }, hidden: true, textContent: '元の種別ラベル' };
  if (type !== undefined) link.dataset.supportType = type;
  const context = {
    window: { location: { href: pageUrl } }, URL, encodeURIComponent,
    document: {
      currentScript: { src: 'https://ray-dev-lab.github.io/gridporter-site/assets/site.js' },
      querySelectorAll: () => [link],
      querySelector: () => null,
    },
  };
  vm.runInNewContext(configScript, context);
  context.window.GRIDPORTER_CONFIG = { ...context.window.GRIDPORTER_CONFIG, ...overrides };
  // No storage, network, form or mail transport API is provided to this runtime.
  vm.runInNewContext(siteScript, context);
  return link;
}

test('existing general email link has the same address and subject plus a fixed body', () => {
  const link = run();
  const url = new URL(link.href);
  assert.equal(link.hidden, false);
  assert.equal(link.textContent, 'raydevsupport@gmail.com');
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'raydevsupport@gmail.com');
  assert.deepEqual([...url.searchParams], [['subject', '[GridPorter] お問い合わせ'], ['body', generalBody]]);
  assert.equal(url.hash, '');
});

test('subject punctuation and non-ASCII text cannot inject headers or replace the fixed body', () => {
  const subject = '[GridPorter] 日本語 &bcc=追加 ?body=本文 #fragment + %';
  const url = new URL(run({ supportSubject: subject }).href);
  assert.deepEqual([...url.searchParams], [['subject', subject], ['body', generalBody]]);
  assert.equal(url.hash, '');
});

test('invalid email and raw or encoded CR/LF keep the link hidden', () => {
  for (const email of ['', 'not-an-address', 'a@b.com\n', 'a@b.com\r\nBcc:other', 'a%0d%0abcc@b.com', null]) {
    assert.equal(run({ supportEmail: email }).hidden, true);
  }
  for (const subject of ['[GridPorter]\r\nBcc:other', '[GridPorter]\n本文', '[GridPorter]%0D%0ABcc:other', '\u0000', {}, '\ud800']) {
    assert.equal(run({ supportSubject: subject }).hidden, true);
  }
});

test('email local-part delimiters are encoded instead of becoming URL parameters', () => {
  const email = 'help?bcc=other&body=text#part@support.test';
  const url = new URL(run({ supportEmail: email }).href);
  assert.equal(decodeURIComponent(url.pathname), email);
  assert.deepEqual([...url.searchParams], [['subject', '[GridPorter] お問い合わせ'], ['body', generalBody]]);
  assert.equal(url.hash, '');
});

test('public HTML and browser JavaScript contain no inquiry collection or storage', () => {
  for (const file of ['index.html', 'privacy/index.html', 'terms/index.html', 'support/index.html', '404.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(html, /<(?:form|input|textarea)\b/i);
    assert.doesNotMatch(html, /\bon(?:submit|input|change)\s*=/i);
  }
  assert.doesNotMatch(siteScript, /\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|FormData)\b|document\.cookie/);
  assert.equal(new URL(run().href).searchParams.get('body'), generalBody);
  assert.doesNotMatch(siteScript, /\.click\s*\(|\.submit\s*\(|window\.open\s*\(|location\s*=/);
});

for (const [type, [subject, body]] of Object.entries(cases)) {
  test(`${type}: correct recipient, strict prefix and complete fixed template without extra headers`, () => {
    const link = run({}, type);
    assert.equal(link.hidden, false);
    assert.equal(link.textContent, '元の種別ラベル');
    const url = new URL(link.href);
    assert.equal(url.protocol, 'mailto:');
    assert.equal(url.pathname, 'raydevsupport@gmail.com');
    assert.equal(url.searchParams.get('subject'), subject);
    assert.ok(subject.startsWith('[GridPorter]'));
    assert.equal(url.searchParams.get('body'), body.replace(/\r?\n/g, '\r\n'));
    assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
    assert.equal(url.hash, '');
    assert.doesNotMatch(link.href, /[\r\n]/);
    assert.ok(link.href.length <= 2048);
  });
}

test('unknown and inherited inquiry types fail closed', () => {
  for (const type of ['', 'billing', '__proto__', 'constructor', 'toString', null, 42]) {
    const link = run({}, type);
    assert.equal(link.hidden, true);
    assert.equal(link.href, undefined);
  }
});

test('invalid email is rejected for every inquiry type', () => {
  for (const type of Object.keys(cases)) {
    for (const email of ['invalid', 'one@site.test,two@site.test', 'a@b.com\r\nBcc:other', 'a%0abcc@b.com']) {
      assert.equal(run({ supportEmail: email }, type).hidden, true);
    }
  }
});

test('configured general subject must keep the exact intake prefix and bounded length', () => {
  for (const subject of ['', null, ' [GridPorter] 問合せ', 'Re: [GridPorter] 問合せ', '[gridporter] 問合せ', '[GridPorter]\u0085Bcc:other', '[GridPorter]\u2028Bcc:other', '[GridPorter]' + 'x'.repeat(201)]) {
    assert.equal(run({ supportSubject: subject }).hidden, true);
  }
});

test('long encoded mailto fails closed instead of truncating the template', () => {
  const email = '?'.repeat(64) + '@' + 'a'.repeat(60) + '.' + 'b'.repeat(60) + '.com';
  assert.equal(run({ supportEmail: email }).hidden, false);
  assert.equal(run({ supportEmail: email }, 'bug').hidden, true);
});

test('page query, fragment and undeclared config do not supply inquiry text or type', () => {
  const page = 'https://ray-dev-lab.github.io/gridporter-site/support/?type=bug&subject=other&body=private#bcc=other';
  const overrides = { supportBody: 'private\r\nBcc:other', supportType: 'bug', supportTemplates: { general: { body: 'private' } } };
  for (const type of Object.keys(cases)) assert.equal(run(overrides, type, page).href, run({}, type).href);
});

test('support HTML exposes five described links and a JavaScript-independent contact fallback', () => {
  const html = fs.readFileSync(path.join(root, 'support/index.html'), 'utf8');
  assert.deepEqual([...html.matchAll(/data-support-type="([^"]+)"/g)].map(match => match[1]), Object.keys(cases));
  const context = { window: {} };
  vm.runInNewContext(configScript, context);
  assert.ok(html.includes(`<span data-support-email-fallback>${context.window.GRIDPORTER_CONFIG.supportEmail}</span>`));
  assert.ok(html.includes('件名の先頭を正確に「[GridPorter]」'));
  for (const type of Object.keys(cases)) {
    assert.ok(html.includes(`aria-describedby="contact-${type}"`));
    assert.ok(html.includes(`id="contact-${type}"`));
  }
});
