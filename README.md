# GridPorter 公式Webサイト

**GridPorter（グリッドポーター）** — Webの表・一覧を、そのまま使えるExcelへ。

[公式サイト](https://ray-dev-lab.github.io/gridporter-site/) · [プライバシーポリシー](https://ray-dev-lab.github.io/gridporter-site/privacy/) · [利用規約](https://ray-dev-lab.github.io/gridporter-site/terms/) · [サポート](https://ray-dev-lab.github.io/gridporter-site/support/)

対象はGridPorter 0.4.2 betaです。Freeは2,000行・Recipe 1件、Pro betaは20,000行・Recipe件数制限なし。現在、有料販売は行っていません。詳しい機能・制限は公式サイトをご覧ください。

## このサイトについて

GitHub Pagesで配信する静的サイトです。HTML・CSS・ローカルJavaScriptで構成し、インストールやビルドは不要です。サイトのコードに広告、アクセス解析、Cookieは使用していません。お問い合わせは外部のGoogleフォームへの通常リンクで案内し、フォームを埋め込みません。配信事業者によるアクセス情報の取扱いを含め、データの説明はPrivacyをご覧ください。

問い合わせの主導線はGoogleフォームです。種類はフォーム側で選択します。未設定時は準備中案内と予備メール窓口を表示します。予備メールは文字で案内し、件名の先頭を正確に `[GridPorter]` として利用者自身が作成・送信します。フォーム・メールのどちらにも、実質的な回答は `raydevsupport@gmail.com` から人間が下書きを確認して手動で返信します。フォーム受付時の定型受領メールは別に自動送信します。サイトからメールソフトを起動したり、問い合わせ本文を保存・自動送信したりしません。

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

PRとmain pushで通常検査を実行します。公開URL・問い合わせ窓口・任意画像は `assets/site-config.js` で管理し、変更時は `node scripts/sync-metadata.mjs` でcanonical・OG・404の戻り先・静的なフォームリンクと連絡先表示を同期します。フォームは専用のsupportFormUrl、予備メールはsupportEmailで管理します。supportUrlは従来の任意の案内URLで、フォーム設定の代わりには使用しません。将来の独自ドメインへの変更にも対応しています。未確定のStore URL等は空のままにします。

`python scripts/check-site.py --release` は正式HTTPS URL、公開ページのメタ情報、問い合わせ設定、任意の掲載画像等を検査します。検査成功は、法的適合やストア審査通過を保証しません。実際の法令対応とChrome Web Storeの提出内容は、それぞれ確認してください。サイトへの画像掲載は任意です。掲載する場合は[実画面の案内](docs/SCREENSHOT_GUIDE.md)に従います。

このRepositoryのファイル・変更履歴・PRは公開情報です。認証情報、私用の連絡情報、内部監査資料や運用手順は登録しないでください。ファイルの削除後も過去のGit履歴やキャッシュに情報が残る場合があります。

## フォームの設定と受付の連携

supportFormUrlには所有者から提示された回答者用URLを設定しています（共有用パラメーターusp=dialogは除外）。問い合わせAI側の公開契約の実行結果としては未取得であり、編集URLや管理表URLから推測したものではありません。変更時は、実際に確定したGoogleフォームの回答用HTTPS URL（forms.gleの共有リンク、またはdocs.google.com/forms/d/.../viewform）だけを設定します。編集・管理URL、query/hash、入力値を事前設定するURLは使用しません。サイトから利用者の情報をURLへ付加しません。未設定でも通常検査は通り、正式公開用の--releaseは未設定を検出します。

URL設定後にメタ情報同期を実行すると、JavaScript無効時にも同じフォームリンクを使えます。未設定時は準備中表示と予備メール案内になります。CSPは外部リンクのために緩めません。

フォームは必須4項目（返信先メール・問い合わせ種別・件名・内容）と任意3項目（GridPorterバージョン・OS/Chrome・対象URL）の計7項目です。「コピーした報告文」の項目は廃止されており、再作成や入力を前提にしません。ファイルアップロードは設けません。フォームや管理表の作成・公開・受付試験は本サイトの実装に含みません。

フォーム受付時は、入力した返信先へ受付番号付きの定型受領メールを自動送信し、問い合わせ種別・件名・内容・入力のあった任意項目を再掲します。この内容はGmail送信済みにも保存されます。送信受付の確認後にローカルAI解析へ進み、実質的な回答は人間が下書きを確認して手動送信します。直接メール経路には、この受領メールの自動送信を追加していません。送信受付と受信箱への配達は異なり、配達時間は保証しません。

問い合わせAI側PR #7の2026年10月29日時点の実装と引継ぎ資料を照合しました。所有者による7項目・フォーム公開/受付ON等の診断成功と、旧形式の受領メール1件の受信は報告されていますが、新形式の実配達と両受付経路のAI解析・下書き・LINEまでの実環境受入完了は確認できていません。回答者用URLは所有者からの提示に基づき設定しましたが、新形式の実環境受入は未確認のため、公開準備は未完了です。URLの形式検査やサイトCI成功だけで、実際に回答・受付可能とは扱いません。

フォーム回答はGoogleフォーム・管理スプレッドシートに保存され、メール・処理用コピー等とは保持範囲が異なります。詳細はPrivacyをご確認ください。管理表URL・内部ID・認証情報・実問い合わせは登録しないでください。
