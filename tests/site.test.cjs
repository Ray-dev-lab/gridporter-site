const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const siteScript = fs.readFileSync(path.join(root, 'assets/site.js'), 'utf8');
const configScript = fs.readFileSync(path.join(root, 'assets/site-config.js'), 'utf8');

function run(overrides = {}) {
  const link = { dataset: { configLink: 'supportEmail' }, hidden: true };
  const context = {
    window: {}, URL, encodeURIComponent,
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

test('configured email opens a composer with the GridPorter subject only', () => {
  const link = run();
  const url = new URL(link.href);
  assert.equal(link.hidden, false);
  assert.equal(link.textContent, 'raydevsupport@gmail.com');
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'raydevsupport@gmail.com');
  assert.deepEqual([...url.searchParams], [['subject', '[GridPorter] お問い合わせ']]);
  assert.equal(url.hash, '');
});

test('subject punctuation and non-ASCII text cannot add mail headers or a body', () => {
  const subject = '[GridPorter] 日本語 &bcc=追加 ?body=本文 #fragment + %';
  const url = new URL(run({ supportSubject: subject }).href);
  assert.deepEqual([...url.searchParams], [['subject', subject]]);
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
  assert.deepEqual([...url.searchParams], [['subject', '[GridPorter] お問い合わせ']]);
  assert.equal(url.hash, '');
});

test('public HTML and browser JavaScript contain no inquiry collection or storage', () => {
  for (const file of ['index.html', 'privacy/index.html', 'terms/index.html', 'support/index.html', '404.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(html, /<(?:form|input|textarea)\b/i);
    assert.doesNotMatch(html, /\bon(?:submit|input|change)\s*=/i);
  }
  assert.doesNotMatch(siteScript, /\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|FormData)\b|document\.cookie/);
  assert.equal(new URL(run().href).searchParams.has('body'), false);
});
