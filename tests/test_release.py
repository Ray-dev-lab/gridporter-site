"""Site readiness is independent of CWS submission images; HTTPS is mocked."""
from pathlib import Path
from contextlib import redirect_stdout
from unittest.mock import patch
import io
import runpy
import shutil
import sys
import tempfile
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


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

    def run_gate(self, reviewed=False):
        if reviewed:
            config = self.root / 'assets/site-config.js'
            config.write_text(config.read_text(encoding='utf-8').replace('Reviewed: false', 'Reviewed: true'), encoding='utf-8')
        fixture = self.root

        class Response:
            status = 200

            def __init__(self, request):
                self.url = request.full_url

            def __enter__(self):
                return self

            def __exit__(self, *args):
                pass

            def read(self):
                relative = urlsplit(self.url).path.removeprefix('/gridporter-site/')
                return (fixture / relative / 'index.html').read_bytes()

        output = io.StringIO()
        code = 0
        with patch('urllib.request.urlopen', side_effect=lambda request, **kwargs: Response(request)), patch.object(sys, 'argv', ['check-site.py', '--release']), redirect_stdout(output):
            try:
                runpy.run_path(str(fixture / 'scripts/check-site.py'), run_name='__main__')
            except SystemExit as error:
                code = error.code
        return code, output.getvalue()

    def test_empty_site_gallery_leaves_only_human_reviews_blocking(self):
        code, output = self.run_gate()
        self.assertEqual(code, 1)
        lines = output.strip().splitlines()
        self.assertEqual(len(lines), 3, output)
        for flag in ('privacyReviewed', 'termsReviewed', 'supportReviewed'):
            self.assertIn(flag, output)

    def test_no_site_screenshot_is_required_after_reviews(self):
        code, output = self.run_gate(reviewed=True)
        self.assertEqual(code, 0, output)
        self.assertIn('PASS:', output)

    def test_registered_but_missing_site_image_still_fails(self):
        config = self.root / 'assets/site-config.js'
        text = config.read_text(encoding='utf-8').replace('screenshots: []', "screenshots: [{src:'assets/screenshots/missing.png',alt:'Registered image'}]")
        config.write_text(text, encoding='utf-8')
        code, output = self.run_gate(reviewed=True)
        self.assertEqual(code, 1)
        self.assertIn('missing.png', output)


if __name__ == '__main__':
    unittest.main()
