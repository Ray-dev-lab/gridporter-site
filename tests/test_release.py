"""Release verifies site configuration and delivery; HTTPS is mocked in unit tests."""
from pathlib import Path
from contextlib import redirect_stdout
from unittest.mock import patch
import io
import runpy
import shutil
import subprocess
import sys
import tempfile
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://ray-dev-lab.github.io/gridporter-site/'


class ReleaseGateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='gridporter-release-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'site'
        self.root.mkdir()
        for folder in ('assets', 'scripts', 'privacy', 'terms', 'support'):
            shutil.copytree(ROOT / folder, self.root / folder)
        for name in ('index.html', '404.html', '.nojekyll'):
            shutil.copy2(ROOT / name, self.root / name)

    def run_gate(self, remote_url=None, remote_html=None, network_error=None):
        fixture = self.root
        self.requests = []

        class Response:
            status = 200

            def __init__(self, request):
                self.request_url = request.full_url
                self.url = remote_url or self.request_url

            def __enter__(self):
                return self

            def __exit__(self, *args):
                pass

            def read(self):
                relative = urlsplit(self.request_url).path.removeprefix('/gridporter-site/')
                text = (fixture / relative / 'index.html').read_text(encoding='utf-8')
                return (remote_html(text) if remote_html else text).encode('utf-8')

        def open_response(request, **kwargs):
            self.requests.append(request.full_url)
            if network_error:
                raise network_error
            return Response(request)

        output = io.StringIO()
        code = 0
        with patch('urllib.request.urlopen', side_effect=open_response), patch.object(sys, 'argv', ['check-site.py', '--release']), redirect_stdout(output):
            try:
                runpy.run_path(str(fixture / 'scripts/check-site.py'), run_name='__main__')
            except SystemExit as error:
                code = error.code
        return code, output.getvalue()

    def test_configuration_without_approval_settings_or_site_images_passes(self):
        code, output = self.run_gate()
        self.assertEqual(code, 0, output)
        self.assertIn('PASS:', output)
        self.assertEqual(self.requests, [BASE + suffix for suffix in ('', 'privacy/', 'terms/', 'support/')])

    def test_invalid_site_urls_are_rejected(self):
        config = self.root / 'assets/site-config.js'
        original = config.read_text(encoding='utf-8')
        for url in ('http://ray-dev-lab.github.io/gridporter-site/',
                    'https://other.github.io/gridporter-site/',
                    BASE + '?query=1', 'https://user:password@ray-dev-lab.github.io/gridporter-site/'):
            with self.subTest(url=url):
                config.write_text(original.replace(repr(BASE), repr(url)), encoding='utf-8')
                code, output = self.run_gate()
                self.assertEqual(code, 1)
                self.assertIn('HTTPS siteUrl', output)
                self.assertEqual(self.requests, [])

    def test_invalid_support_email_is_rejected(self):
        config = self.root / 'assets/site-config.js'
        original = config.read_text(encoding='utf-8')
        for email in ('', 'not-an-email', 'help@support.test\r\nBcc: other@support.test'):
            with self.subTest(email=email):
                config.write_text(original.replace("'raydevsupport@gmail.com'", repr(email)), encoding='utf-8')
                code, output = self.run_gate()
                self.assertEqual(code, 1)
                self.assertIn('supportEmail', output)
                self.assertEqual(self.requests, [])

    def test_broken_privacy_link_is_rejected(self):
        page = self.root / 'index.html'
        original = page.read_text(encoding='utf-8')
        text = original.replace('href="privacy/"', 'href="missing-privacy/"')
        self.assertNotEqual(text, original)
        page.write_text(text, encoding='utf-8')
        code, output = self.run_gate()
        self.assertEqual(code, 1)
        self.assertIn('missing-privacy/', output)
        self.assertEqual(self.requests, [])

    def test_wrong_local_metadata_is_rejected(self):
        page = self.root / 'privacy/index.html'
        page.write_text(page.read_text(encoding='utf-8').replace(BASE + 'privacy/', BASE + 'wrong/'), encoding='utf-8')
        code, output = self.run_gate()
        self.assertEqual(code, 1)
        self.assertIn('canonical / og:url', output)
        self.assertEqual(self.requests, [])

    def test_non_https_remote_destination_is_rejected(self):
        code, output = self.run_gate(remote_url=BASE.replace('https:', 'http:'))
        self.assertEqual(code, 1)
        self.assertIn('正式HTTPSページ', output)

    def test_wrong_remote_metadata_is_rejected(self):
        code, output = self.run_gate(remote_html=lambda text: text.replace('rel="canonical"', 'rel="alternate"'))
        self.assertEqual(code, 1)
        self.assertIn('公開ページのメタ情報', output)

    def test_network_failure_is_rejected(self):
        code, output = self.run_gate(network_error=TimeoutError())
        self.assertEqual(code, 1)
        self.assertIn('HTTPS確認失敗', output)

    def test_registered_but_missing_site_image_still_fails(self):
        config = self.root / 'assets/site-config.js'
        text = config.read_text(encoding='utf-8').replace('screenshots: []', "screenshots: [{src:'assets/screenshots/missing.png',alt:'Registered image'}]")
        config.write_text(text, encoding='utf-8')
        code, output = self.run_gate()
        self.assertEqual(code, 1)
        self.assertIn('missing.png', output)

    def test_metadata_sync_keeps_static_support_address_in_sync_with_config(self):
        config = self.root / 'assets/site-config.js'
        text = config.read_text(encoding='utf-8').replace("supportEmail: 'raydevsupport@gmail.com'", "supportEmail: 'help&desk@support.test'")
        config.write_text(text, encoding='utf-8')
        result = subprocess.run(['node', str(self.root / 'scripts/sync-metadata.mjs')], capture_output=True, check=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        html = (self.root / 'support/index.html').read_text(encoding='utf-8')
        self.assertIn('<span data-support-email-fallback>help&amp;desk@support.test</span>', html)


if __name__ == '__main__':
    unittest.main()
