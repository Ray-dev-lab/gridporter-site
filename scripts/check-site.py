"""依存追加なし: 公開ファイルのリンク・メタデータ・禁止参照を検査。"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re
import sys
import json
import subprocess
import struct
import ipaddress
from urllib.request import urlopen, Request

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'privacy/index.html', 'terms/index.html', 'support/index.html', '404.html']
ERRORS = []
RELEASE = '--release' in sys.argv
config_result = subprocess.run(['node', '--input-type=module', '-e', "import fs from 'node:fs'; import vm from 'node:vm'; const ctx={window:{}}; vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),ctx); process.stdout.write(JSON.stringify(ctx.window.GRIDPORTER_CONFIG));", str(ROOT / 'assets/site-config.js')], capture_output=True, text=True, encoding='utf-8', check=True)
CONFIG = json.loads(config_result.stdout)
BASE = urlsplit(CONFIG.get('siteUrl', ''))
BASE_PATH = BASE.path if BASE.hostname else '/gridporter-site/'
if not BASE_PATH.endswith('/'): BASE_PATH += '/'

def fail(file, message):
    ERRORS.append(f'{file}: {message}')

# 正規表現の表記自体をRepository全体のブランド検索で誤検出しない形にする。
brand_guard = re.compile(r'Table[P]ilot|Ray[A]kira7|GridPorter\s+JP', re.I)
for path in ROOT.rglob('*.html'):
    relative = path.relative_to(ROOT)
    if any(part in {'.git', '.qa', 'node_modules'} for part in relative.parts):
        continue
    for match in brand_guard.finditer(path.read_text(encoding='utf-8')):
        fail(relative, f'禁止ブランド表記: {match.group()}')

class Document(HTMLParser):
    def __init__(self, file):
        super().__init__(convert_charrefs=True)
        self.file, self.ids, self.links, self.metas = file, set(), [], {}
        self.canonicals = []
        self.title, self.main, self.lang, self.favicon = False, False, False, False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids:
                fail(self.file, f'重複ID: {a["id"]}')
            self.ids.add(a['id'])
        if tag == 'html': self.lang = a.get('lang') == 'ja'
        if tag == 'title': self.title = True
        if tag == 'main': self.main = True
        if tag == 'meta': self.metas[a.get('name', a.get('property', ''))] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'icon': self.favicon = True
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href', ''))
        for key in ('href', 'src'):
            if key in a:
                self.links.append((tag, key, a[key]))
        if any(k.startswith('on') for k in a): fail(self.file, 'inlineイベントハンドラー')
        if tag == 'script' and 'src' not in a: fail(self.file, 'inline JavaScript')
        if tag == 'script' and urlsplit(a.get('src', '')).scheme: fail(self.file, '外部script')
        if tag == 'img' and 'alt' not in a: fail(self.file, 'altなし画像')
        if tag == 'form': fail(self.file, '未実装フォーム')
        if tag == 'a' and 'href' not in a and not ('data-config-link' in a and 'hidden' in a): fail(self.file, 'リンク先なしのa要素')
        if tag in ('img', 'script', 'link'):
            resource = a.get('src', a.get('href', ''))
            if resource.startswith(('https:', 'http:', '//')) and a.get('rel') != 'canonical': fail(self.file, '第三者リソース')

docs = {}
for name in PAGES:
    path = ROOT / name
    if not path.exists():
        fail(name, 'ファイルなし')
        continue
    text = path.read_text(encoding='utf-8')
    parser = Document(name)
    parser.feed(text)
    docs[name] = parser
    for field in ['description', 'og:title', 'og:description', 'og:type']:
        if not parser.metas.get(field): fail(name, f'{field}なし')
    if not all([parser.title, parser.main, parser.lang, parser.favicon]): fail(name, '基本HTML情報が不足')

for name, doc in docs.items():
    for tag, key, url in doc.links:
        parsed = urlsplit(url)
        if parsed.scheme in ('https', 'mailto'): continue
        if parsed.scheme or parsed.netloc:
            fail(name, f'禁止URL形式: {url}')
            continue
        if parsed.path.startswith('/'):
            if name != '404.html': fail(name, f'ルート絶対パス: {url}')
            # 404はproject-siteのbase path（custom domainでは空）を許可。
            if not parsed.path.startswith(BASE_PATH):
                fail(name, f'404のbase path不一致: {url}')
            relative = parsed.path.removeprefix(BASE_PATH).lstrip('/')
            target = ROOT / relative
        else:
            target = ((ROOT / name).parent / unquote(parsed.path)).resolve()
        if not target.is_relative_to(ROOT):
            fail(name, f'サイト外パス: {url}')
            continue
        if target.is_dir(): target /= 'index.html'
        if not target.exists():
            fail(name, f'内部リンク切れ: {url}')
            continue
        if parsed.fragment:
            target_name = target.relative_to(ROOT).as_posix()
            if target_name in docs and unquote(parsed.fragment) not in docs[target_name].ids:
                fail(name, f'アンカーなし: {url}')

public = [ROOT / name for name in PAGES] + [p for p in (ROOT / 'assets').rglob('*') if p.suffix in {'.css', '.js', '.svg'}]
# SVG名前空間は標準識別子であり通信ではないため除外。
banned = re.compile(r'localhost|127\.0\.0\.1|example\.com|\bTODO\b|\bdummy\b|\bplaceholder\b|http://', re.I)
for path in public:
    content = path.read_text(encoding='utf-8').replace('http://www.w3.org/2000/svg', '')
    for match in banned.finditer(content): fail(path.relative_to(ROOT), f'禁止参照: {match.group()}')
    if path.suffix in {'.js', '.css'} and re.search(r'\b(fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(|@import|url\(\s*["\']?https?:', content):
        fail(path.relative_to(ROOT), '外部通信・外部CSS参照')
if not (ROOT / '.nojekyll').exists(): fail('.nojekyll', 'ファイルなし')

if RELEASE:
    host = BASE.hostname or ''
    github_pages = host == 'github.io' or host.endswith('.github.io')
    valid_domain = bool(host and '.' in host and not host.endswith(('.', '.test', '.invalid', '.localhost', '.example')) and not any(host == reserved or host.endswith('.' + reserved) for reserved in ('example.com', 'example.org', 'example.net')))
    if github_pages:
        valid_domain = host == 'ray-dev-lab.github.io' and BASE.path == '/gridporter-site/'
    try:
        ipaddress.ip_address(host)
        valid_domain = False
    except ValueError:
        pass
    if BASE.scheme != 'https' or BASE.username is not None or BASE.password is not None or '?' in CONFIG['siteUrl'] or '#' in CONFIG['siteUrl'] or BASE.port is not None or not valid_domain:
        fail('release', '有効な正式HTTPS siteUrlが必要です（βサイトは指定のhostname・pathnameのみ許可）')
    email = CONFIG.get('supportEmail', '')
    if not isinstance(email, str) or re.search(r'[\x00-\x1f\x7f]|%0[ad]', email, re.I) or not re.fullmatch(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", email):
        fail('release', '実際に受信できるsupportEmailが必要です')
    subject = CONFIG.get('supportSubject', '')
    if not isinstance(subject, str) or re.search(r'[\x00-\x1f\x7f]|%0[ad]', subject, re.I):
        fail('release', 'supportSubjectにメールヘッダーの制御文字は使用できません')
    for key in ('privacyReviewed', 'termsReviewed', 'supportReviewed'):
        if CONFIG.get('release', {}).get(key) is not True: fail('release', f'{key}の人間による最終確認が必要です')
    images = CONFIG.get('screenshots', [])
    if not isinstance(images, list): fail('release', 'screenshotsは配列で指定してください（サイトへの掲載は任意）')
    else:
        for image in images:
            src = image.get('src', '')
            if not re.fullmatch(r'assets/screenshots/[a-z0-9-]+\.png', src) or not image.get('alt', '').strip():
                fail('release', '実スクリーンショットはローカルPNGと説明altを指定してください')
                continue
            path = ROOT / src
            if not path.is_file():
                fail('release', f'画像なし: {src}')
                continue
            data = path.read_bytes()
            if len(data) < 24 or data[:8] != b'\x89PNG\r\n\x1a\n' or struct.unpack('>II', data[16:24]) != (1280, 800):
                fail('release', f'画像は1280x800のPNGが必要です: {src}')
    if valid_domain and BASE.scheme == 'https':
        base_url = CONFIG['siteUrl'].rstrip('/') + '/'
        first_src = images[0].get('src', '') if isinstance(images, list) and images else ''
        for name in PAGES[:-1]:
            expected = base_url + name.removesuffix('index.html')
            doc = docs.get(name)
            if not doc or doc.canonicals != [expected] or doc.metas.get('og:url') != expected:
                fail(name, '正式URLに一致する静的canonical / og:urlが必要です')
            if first_src and (not doc or doc.metas.get('og:image') != base_url + first_src or not doc.metas.get('og:image:alt')):
                fail(name, '実画像を使ったog:image / og:image:altが必要です')
        # 設定漏れがある間はネットワーク検証へ進めない。
        if not ERRORS:
            for suffix in ('', 'privacy/', 'terms/', 'support/'):
                target_url = base_url + suffix
                try:
                    with urlopen(Request(target_url, headers={'User-Agent': 'GridPorter-release-check'}), timeout=15) as response:
                        final = urlsplit(response.url)
                        if response.status != 200 or final.scheme != 'https' or final.hostname != host or final.path != urlsplit(target_url).path:
                            fail('release', f'正式HTTPSページを確認できません: {suffix}')
                        remote = Document(suffix or 'index.html')
                        remote.feed(response.read().decode('utf-8'))
                        if remote.canonicals != [target_url] or remote.metas.get('og:url') != target_url:
                            fail('release', f'公開ページのメタ情報が未反映: {suffix}')
                except Exception as error:
                    fail('release', f'HTTPS確認失敗 ({suffix}): {type(error).__name__}')
if ERRORS:
    print('\n'.join(ERRORS))
    sys.exit(1)
print(f'PASS: {len(PAGES)}ページ / {len(public)}公開テキストファイル。内部リンク・アンカー・メタ情報・禁止参照・外部リソース検査。')
if RELEASE: print('PASS: サイトの設定・確認フラグ・正式HTTPS配信ゲート。CWS提出用画像は別途確認してください。メール受信と任意掲載画像の真実性は人間が確認してください。')
