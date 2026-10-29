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
  function supportFormUrl(value) {
    if (typeof value !== 'string' || value.length > 2048 || /[\s\u0000-\u001f\u007f-\u009f]/.test(value)) return null;
    return /^https:\/\/(?:forms\.gle\/[A-Za-z0-9_-]+|docs\.google\.com\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform)$/.test(value) ? value : null;
  }
  document.querySelectorAll('[data-config-link]').forEach(link => {
    const key = link.dataset.configLink;
    const href = key === 'supportFormUrl' ? supportFormUrl(config[key]) : safeUrl(config[key], key === 'chromeWebStoreUrl');
    link.removeAttribute('href');
    link.hidden = true;
    if (!href) return;
    link.href = href;
    link.hidden = false;
  });
  const formStatus = document.querySelector('[data-support-form-status]');
  if (formStatus) formStatus.hidden = Boolean(supportFormUrl(config.supportFormUrl));
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
