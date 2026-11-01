# GridPorter 公式Webサイト

**GridPorter（グリッドポーター）** — Webの表・一覧を、そのまま使えるExcelへ。

[公式サイト](https://ray-dev-lab.github.io/gridporter-site/) · [プライバシーポリシー](https://ray-dev-lab.github.io/gridporter-site/privacy/) · [利用規約](https://ray-dev-lab.github.io/gridporter-site/terms/) · [サポート](https://ray-dev-lab.github.io/gridporter-site/support/)

このブランチはPWA向けの公開前レビュー案です。FreeとFounder、月次価格改定確認、汎用表処理、形式別容量制限を現行実装に合わせます。未販売・PWA公開前で、購入URL・価格・発行時間・サポート／更新条件を確定しません。main／公開ページはこのPRのmerge前には変わりません。

## このサイトについて

GitHub Pagesで配信する静的サイトです。HTML・CSS・ローカルJavaScriptで構成し、インストールやビルドは不要です。サイトのコードに広告、アクセス解析、Cookieは使用していません。お問い合わせは外部のGoogleフォームへの通常リンクで案内し、フォームを埋め込みません。配信事業者によるアクセス情報の取扱いを含め、データの説明はPrivacyをご覧ください。

問い合わせの主導線はGoogleフォームです。種類はフォーム側で選択します。未設定時は準備中案内と予備メール窓口を表示します。予備メールは文字で案内し、件名の先頭を正確に `[GridPorter]` として利用者自身が作成・送信します。フォーム・メールのどちらにも、実質的な回答は `raydevsupport@gmail.com` から人間が下書きを確認して手動で返信します。フォーム受付時の定型受領メールは別に自動送信します。サイトからメールソフトを起動したり、問い合わせ本文を保存・自動送信したりしません。

## ページと保守

|場所|内容|
|---|---|
|index.html|製品紹介・機能・Free/Founder・FAQ|
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

PRとmain pushで通常検査を実行します。公開URL・問い合わせ窓口・任意画像は `assets/site-config.js` で管理し、変更時は `node scripts/sync-metadata.mjs` でcanonical・OG・404の戻り先・静的なフォームリンクと連絡先表示を同期します。フォームは専用のsupportFormUrl、予備メールはsupportEmailで管理します。supportUrlは従来の任意の案内URLで、フォーム設定の代わりには使用しません。将来の独自ドメインへの変更にも対応しています。未確定のStore URL等は空のままにします。

`python scripts/check-site.py --release` は正式HTTPS URL、公開ページのメタ情報、問い合わせ設定、任意の掲載画像等を検査します。検査成功は、法的適合やストア審査通過を保証しません。実際の法令対応とPWAの販売・提供条件は、それぞれ確認してください。サイトへの画像掲載は任意です。掲載する場合は[実画面の案内](docs/SCREENSHOT_GUIDE.md)に従います。

このRepositoryのファイル・変更履歴・PRは公開情報です。認証情報、私用の連絡情報、内部監査資料や運用手順は登録しないでください。ファイルの削除後も過去のGit履歴やキャッシュに情報が残る場合があります。

## フォームの設定と受付の連携

公開の回答者用URLだけを設定し、編集・管理URLや入力値付きURLは使用しません。フォームは外部の通常リンクで、業務データや問い合わせ文をサイトから自動送信しません。任意の問い合わせのGoogle・LINE・AI処理と手動返信、保存・削除の範囲はPrivacyの説明を保持します。

## 履歴とレビュー範囲

旧版はChrome拡張0.4.2 beta／Free-Proの案内でした。現在仕様と混同しないよう、このPRでPWA／Free-Founderへ変更する案を提示します。履歴はGitに保持します。購入・公開アプリURL、販売価格・納品時間・サポート／更新条件は未確定で、架空リンクは設けません。

条件付き一括承認・位置案内はPWA側のレビュー差分と同時に所有者が確認してください。アプリ側の未マージ機能を公開済みと扱わず、当PRも未マージで提出します。GitHub Pages設定・公開main・問い合わせフォーム・販売窓口は変更しません。
