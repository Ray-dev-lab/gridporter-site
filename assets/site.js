'use strict';
(() => {
  const config = window.GRIDPORTER_CONFIG || {};
  const script = document.currentScript;
  const base = new URL('../', script.src);
  function safeUrl(value, store = false) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, base);
      if (url.username || url.password) return null;
      if (store && (url.protocol !== 'https:' || url.hostname !== 'chromewebstore.google.com' || !url.pathname.startsWith('/detail/'))) return null;
      if (url.origin !== base.origin && url.protocol !== 'https:') return null;
      return url.href;
    } catch { return null; }
  }
  // Public, fixed templates only. Never read inquiry text from the page URL or browser.
  const supportTemplates = Object.freeze({
    bug: {
      subject: '[GridPorter] 不具合報告',
      body: `【GridPorterのバージョン】
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
（毎回 / ときどき / 1回のみ / 不明）`,
    },
    usage: {
      subject: '[GridPorter] 使い方の質問',
      body: `【質問内容】
（知りたいことを記入してください）

【利用している機能】
（分かる範囲で記入）

【試した操作】
（既に試した方法があれば記入してください）

【GridPorterのバージョン・利用環境】
（必要に応じて記入）`,
    },
    improvement: {
      subject: '[GridPorter] 改善要望',
      body: `【改善してほしいこと】

【現在困っていること】

【希望する動作・機能】

【どのような場面で使いたいか】
（任意）`,
    },
    privacy: {
      subject: '[GridPorter] データ・プライバシー相談',
      body: `【お問い合わせ内容】
（データ保存、削除、プライバシーなどについて記入してください）

【対象となる機能】
（分かる範囲で記入）

【確認したいこと・希望する対応】`,
    },
    general: {
      body: `【お問い合わせ内容】

【補足情報】
（任意）`,
    },
  });
  function supportMailto(type) {
    if (typeof type !== 'string' || !Object.prototype.hasOwnProperty.call(supportTemplates, type)) return null;
    const template = supportTemplates[type];
    const email = config.supportEmail;
    const subject = type === 'general' ? config.supportSubject : template.subject;
    const unsafeHeader = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]|%0[ad]/i;
    if (typeof email !== 'string' || email.length > 254 || unsafeHeader.test(email) || !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return null;
    if (typeof subject !== 'string' || subject.length > 200 || !subject.startsWith('[GridPorter]') || unsafeHeader.test(subject)) return null;
    try {
      const recipient = encodeURIComponent(email).replace(/%40/gi, '@');
      const body = template.body.replace(/\r?\n/g, '\r\n');
      const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return href.length <= 2048 ? href : null;
    } catch { return null; }
  }
  document.querySelectorAll('[data-config-link]').forEach(link => {
    const key = link.dataset.configLink;
    const href = key === 'supportEmail'
      ? supportMailto(link.dataset.supportType === undefined ? 'general' : link.dataset.supportType)
      : safeUrl(config[key], key === 'chromeWebStoreUrl');
    if (!href) return;
    link.href = href;
    link.hidden = false;
    if (key === 'supportEmail' && link.dataset.supportType === undefined) link.textContent = config[key];
  });
  const supportOptions = document.querySelector('[data-support-options]');
  if (supportOptions) supportOptions.hidden = !supportOptions.querySelector('a[href]');
  const gallery = document.querySelector('[data-screenshots]');
  if (gallery && Array.isArray(config.screenshots)) {
    config.screenshots.forEach(item => {
      if (!item || !/^assets\/screenshots\/[a-z0-9-]+\.(png|webp|jpg)$/.test(item.src) || !item.alt) return;
      const img = document.createElement('img');
      img.alt = item.alt;
      img.width = 1280;
      img.height = 800;
      img.loading = 'lazy';
      const figure = document.createElement('figure');
      const caption = document.createElement('figcaption');
      caption.textContent = item.alt;
      img.addEventListener('load', () => { figure.append(img, caption); gallery.append(figure); gallery.hidden = false; });
      img.src = new URL(item.src, base).href;
    });
  }
})();
