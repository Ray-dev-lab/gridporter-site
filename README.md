# GridPorter 公式Webサイト

**GridPorter（グリッドポーター）** — Webの表・一覧を、そのまま使えるExcelへ。

[公式サイト](https://ray-dev-lab.github.io/gridporter-site/) · [プライバシーポリシー](https://ray-dev-lab.github.io/gridporter-site/privacy/) · [利用規約](https://ray-dev-lab.github.io/gridporter-site/terms/) · [サポート](https://ray-dev-lab.github.io/gridporter-site/support/)

対象はGridPorter 0.4.2 betaです。Freeは2,000行・Recipe 1件、Pro betaは20,000行・Recipe件数制限なし。現在、有料販売は行っていません。詳しい機能・制限は公式サイトをご覧ください。

## このサイトについて

GitHub Pagesで配信する静的サイトです。HTML・CSS・ローカルJavaScriptで構成し、インストールやビルドは不要です。サイトのコードに広告、アクセス解析、Cookie、外部フォームを使用していません。配信事業者によるアクセス情報の取扱いを含め、データの説明はPrivacyをご覧ください。

問い合わせは5種類から選び、件名・本文のひな形を入れたメール作成画面を開きます。内容は利用者が編集・確認して手動送信します。メールアプリが開かない場合やJavaScript無効時は、Supportに表示された連絡先と件名形式で手動作成できます。サイトが問い合わせ本文を保存・自動送信する機能はありません。

## ページと保守

|場所|内容|
|---|---|
|index.html|製品紹介・機能・Free/Pro beta・FAQ|
|privacy/、terms/、support/|データの取扱い・利用条件・問い合わせ案内|
|404.html|ページが見つからない場合の案内|
|assets/|共通スタイル・スクリプト・公開設定・画像|
|scripts/、tests/|サイトの検査とメタ情報の同期|

ローカル表示は `python -m http.server 8000 --bind 127.0.0.1` を実行して `http://127.0.0.1:8000/` を開きます。Python・Node.jsは保守時のみ使用します。

```sh
python scripts/check-site.py
node --check assets/site.js
node --check assets/site-config.js
node --check scripts/sync-metadata.mjs
node --test tests/site.test.cjs
python -m unittest discover -s tests -p "test_*.py"
```

PRとmain pushで通常検査を実行します。公開URL・問い合わせ窓口・任意画像は `assets/site-config.js` で管理し、変更時は `node scripts/sync-metadata.mjs` でcanonical・OG・404の戻り先・静的な連絡先表示を同期します。将来の独自ドメインへの変更にも対応しています。未確定のStore URL等は空のままにします。

`python scripts/check-site.py --release` は公開準備を検査します。Privacy・Terms・Supportの確認フラグは所有者が実際の公開内容と運用を確認した後だけ更新します。検査成功は、法的適合やストア審査通過を保証しません。サイトへの画像掲載は任意です。掲載する場合は[実画面の案内](docs/SCREENSHOT_GUIDE.md)に従います。

このRepositoryのファイル・変更履歴・PRは公開情報です。認証情報、私用の連絡情報、内部監査資料や運用手順は登録しないでください。ファイルの削除後も過去のGit履歴やキャッシュに情報が残る場合があります。
