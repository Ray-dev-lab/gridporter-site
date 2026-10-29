// 任意の保守ツール。配信時のbuild・Node.jsは不要です。
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const context = { window: {} };
vm.runInNewContext(await readFile(resolve(root, 'assets/site-config.js'), 'utf8'), context);
const config = context.window.GRIDPORTER_CONFIG;
let base;
if (config.siteUrl) {
  base = new URL(config.siteUrl);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) throw new Error('siteUrlは正式なHTTPS URLを指定してください');
  if (!base.pathname.endsWith('/')) base.pathname += '/';
}
const formValue = config.supportFormUrl;
const formUrl = typeof formValue === 'string' && formValue.length <= 2048 && !/[\s\u0000-\u001f\u007f-\u009f]/.test(formValue) &&
  /^https:\/\/(?:forms\.gle\/[A-Za-z0-9_-]+|docs\.google\.com\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform)$/.test(formValue) ? formValue : '';
if (formValue !== undefined && formValue !== '' && !formUrl) throw new Error('supportFormUrlはGoogleフォームの回答用HTTPS URLを指定してください');
const firstImage = Array.isArray(config.screenshots) ? config.screenshots[0] : null;
const image = base && firstImage && /^assets\/screenshots\/[a-z0-9-]+\.png$/.test(firstImage.src) && firstImage.alt ? firstImage : null;
if (image) await readFile(resolve(root, image.src));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
for (const file of ['index.html', 'privacy/index.html', 'terms/index.html', 'support/index.html']) {
  const path = resolve(root, file);
  const canonical = base ? new URL(file.replace(/index\.html$/, ''), base).href : '';
  const imageTags = image ? `\n  <meta property="og:image" content="${escape(new URL(image.src, base).href)}">\n  <meta property="og:image:alt" content="${escape(image.alt)}">\n  <meta property="og:image:width" content="1280">\n  <meta property="og:image:height" content="800">` : '';
  const tags = canonical ? `\n  <link rel="canonical" href="${escape(canonical)}">\n  <meta property="og:url" content="${escape(canonical)}">${imageTags}\n  ` : '\n  ';
  const html = await readFile(path, 'utf8');
  await writeFile(path, html.replace(/(?<=<!-- site-metadata:start -->)[\s\S]*?(?=<!-- site-metadata:end -->)/, tags));
}
// 深い不明パスからも戻れるよう、404のみ正式URLのpathnameを使用します。
const notFoundPath = resolve(root, '404.html');
const notFound = await readFile(notFoundPath, 'utf8');
const sitePath = base ? base.pathname : '/gridporter-site/';
await writeFile(notFoundPath, notFound.replace(/(href=")[^"]*(assets\/(?:style\.css|favicon\.svg))"/g, `$1${sitePath}$2"`).replace(/href="[^"]*">トップページへ戻る/, `href="${sitePath}">トップページへ戻る`));
// Static form link and text fallback remain usable without JavaScript.
const supportPath = resolve(root, 'support/index.html');
const support = await readFile(supportPath, 'utf8');
const formMarkup = `
<p data-support-form-status${formUrl ? ' hidden' : ''}>お問い合わせフォームは準備中です。フォームを利用できない場合は、下記の予備メール窓口をご利用ください。</p>
<div class="actions"><a class="button secondary" data-config-link="supportFormUrl" target="_blank" rel="noopener noreferrer" aria-describedby="support-form-help"${formUrl ? ` href="${escape(formUrl)}"` : ' hidden'}>お問い合わせフォームを開く</a></div>
`;
if (!support.includes('<!-- support-form:start -->') || !support.includes('<!-- support-form:end -->')) throw new Error('Supportのフォーム同期領域がありません');
await writeFile(supportPath, support
  .replace(/(?<=<!-- support-form:start -->)[\s\S]*?(?=<!-- support-form:end -->)/, () => formMarkup)
  .replace(/(?<=<span data-support-email-fallback>)[\s\S]*?(?=<\/span>)/, () => escape(config.supportEmail || '')));
console.log(base ? 'canonical / og:url / 404を更新しました。' : '正式URL未設定: canonical / og:urlを出力しません。');
