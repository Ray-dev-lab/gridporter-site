"""Public synthetic artifacts: stdlib readback, no customer or license data."""
import unittest,pathlib,json,hashlib,csv,zipfile,xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[1]
class SyntheticSamples(unittest.TestCase):
 def test_manifest_and_inputs(self):
  root=ROOT/'assets/samples';m=json.loads((root/'manifest.json').read_text());self.assertTrue(m['synthetic']);self.assertEqual(m['approved'],1);self.assertEqual(m['reviewHeld'],2)
  for entry in m['files']:
   self.assertEqual(pathlib.Path(entry['name']).name,entry['name']);raw=(root/entry['name']).read_bytes();self.assertEqual(len(raw),entry['bytes']);self.assertEqual(hashlib.sha256(raw).hexdigest(),entry['sha256'])
  for name in ['previous.csv','current.csv','master.csv','proposal-sample.csv']:
   with (root/name).open(encoding='utf-8-sig',newline='') as f:rows=list(csv.reader(f))
   self.assertEqual(len(rows),6);self.assertEqual(rows[1][0],'00123');self.assertEqual(rows[-1][0],'12345678901234567890')
 def test_confirmation_workbook(self):
  n={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
  with zipfile.ZipFile(ROOT/'assets/samples/confirmation-sample.xlsx') as z:
   self.assertIsNone(z.testzip());self.assertFalse(any('externalLinks/' in name or name.endswith('.bin') for name in z.namelist()))
   strings=[''.join(s.itertext()) for s in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',n)]
   def rows(name):
    tree=ET.fromstring(z.read(name));self.assertFalse(tree.findall('.//m:f',n));return [['' if (v:=c.find('m:v',n)) is None else strings[int(v.text)] if c.get('t')=='s' else v.text for c in row.findall('m:c',n)]for row in tree.findall('m:sheetData/m:row',n)]
   sheets=ET.fromstring(z.read('xl/workbook.xml')).findall('m:sheets/m:sheet',n);self.assertEqual(len(sheets),9)
   all_rows={s.get('name'):rows(f'xl/worksheets/sheet{i}.xml')for i,s in enumerate(sheets,1)}
   summary=dict(all_rows['概要・集計'][1:]);self.assertEqual(summary['承認選択'],'1');self.assertEqual(summary['保留'],'2')
   with (ROOT/'assets/samples/proposal-sample.csv').open(encoding='utf-8-sig',newline='') as f:proposal=list(csv.reader(f))
   self.assertEqual(all_rows['利用者確認更新案'],proposal);self.assertEqual(proposal[1][2],'1000');self.assertEqual(proposal[2][2],'450');self.assertEqual(proposal[1][6],'10')
