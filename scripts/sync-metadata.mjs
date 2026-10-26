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
console.log(base ? 'canonical / og:url / 404を更新しました。' : '正式URL未設定: canonical / og:urlを出力しません。');
