# GridPorter 公式Webサイト

**GridPorter（グリッドポーター）** — Webの表・一覧を、そのまま使えるExcelへ。

Repository：`Ray-dev-lab/gridporter-site`。拡張機能本体 `Ray-dev-lab/gridporter` と独立した静的サイトです。HTML / CSS / 最小限のローカルJavaScriptだけで構成し、npm installやbuildは不要です。

Cookie、Analytics、広告、外部JavaScript、CDN、外部フォント、DB、アカウント、決済、外部フォームは使用しません。Proはβテスト中で、有料販売は行っていません。

## 構成

```text
index.html                         商品説明・機能・Free/Pro・FAQ
privacy/index.html                 データの取扱い
terms/index.html                   利用規約
support/index.html                 サポートガイド
404.html                           不明なページ
assets/site-config.js              公開URL・窓口・実画像・確認フラグ
assets/site.js                     設定済みCTA・実画像だけを表示
assets/style.css                   共通スタイル
assets/favicon.svg                 ローカルアイコン
assets/screenshots/                実画面の配置先（現在画像なし）
scripts/check-site.py              静的検査・CWS提出前ゲート
scripts/sync-metadata.mjs           canonical / OG / 404の静的反映
tests/                            mailto安全性・サイトreleaseゲートの回帰検査
.github/workflows/site-check.yml   PR / main push時のCI
docs/CONTENT_INPUTS.md             人間が確定する情報
docs/RELEASE_CHECKLIST.md          CWS提出前の必須条件
docs/SCREENSHOT_GUIDE.md           実画面1280×800の準備
docs/COMMERCIAL_DISCLOSURE_TEMPLATE.md  将来の販売表示
docs/VERIFICATION.md               本体参照と検証結果
.nojekyll                          GitHub Pagesの静的配信
```

## ローカル確認とCI

Repository内で `python -m http.server 8000 --bind 127.0.0.1` を実行し、`http://127.0.0.1:8000/` を開きます。PythonとNode.jsは検査・保守時だけ必要で、配信時には不要です。追加パッケージは不要です。

```sh
python scripts/check-site.py
node --check assets/site.js
node --check assets/site-config.js
node --check scripts/sync-metadata.mjs
node --test tests/site.test.cjs
python -m unittest discover -s tests -p "test_*.py"
```

PR・main pushのGitHub Actionsで静的・構文・回帰検査を実行します。権限はcontents readのみ、checkoutの認証情報は保持しません。通常CIの成功やサイトのrelease検査成功は、CWS提出資産の準備完了を意味しません。

## リンク・正式ドメインの設定

`assets/site-config.js` で管理します。GridPorter 0.4.2 betaでは `https://ray-dev-lab.github.io/gridporter-site/` を正式サイトURLとして使用します。supportEmailは `raydevsupport@gmail.com` に設定済みです。公開前に実際の受信・返信を確認してください。架空の宛先は設定しません。

|設定|用途|
|---|---|
|siteUrl|正式βサイトのHTTPS URL。将来の独自ドメインにも変更可能。末尾 `/`|
|chromeWebStoreUrl|確定したChrome Web Store詳細URL。未設定ならCTA非表示|
|supportEmail|受信・返信を確認した窓口。未設定ならメールCTA非表示|
|supportSubject|`[GridPorter] お問い合わせ`。mailtoの件名として安全にエンコード|
|supportUrl|確定した問い合わせ案内URL。未設定ならCTA非表示|
|privacyUrl / termsUrl|サイト内ページの相対パス|
|screenshots|実在するPNGのsrcとalt|
|release|Privacy / Terms / Supportの人間による最終確認フラグ|

公開本文・Privacy・Terms・SupportはJS無効でも閲覧できます。Privacy / Termsの静的ナビゲーションはHTMLにも記載しているため、パス変更時は全HTMLと設定を同期してください。

## 正式βサイトのGitHub Pages公開

1. mainへpushし、Settings → Pages → Source **Deploy from a branch** → **main / (root)** を指定します。
2. 正式βサイト `https://ray-dev-lab.github.io/gridporter-site/` の配信とHTTPS証明書の有効性を確認し、Enforce HTTPSを有効にします。
3. `siteUrl` が上記URLであることを確認します。GitHub Pagesのhostnameとpathnameは正確な組み合わせだけを許可します。
4. 問い合わせ窓口の実受信とPrivacy / Terms / Supportを最終確認します。サイトへの実画像掲載は任意です。
5. `node scripts/sync-metadata.mjs` で全ページのcanonical / og:url / 実画像のog:image、および404のbase pathを反映しpushします。
6. [必須チェック](docs/RELEASE_CHECKLIST.md)を終え、`python scripts/check-site.py --release` を実行します。

**GridPorter 0.4.2 betaではGitHub Pages標準URLを正式サイトとして使用します。独自ドメインは有料化・正式ブランド展開時に再検討します。** 独自ドメイン取得をCWS提出のプロジェクト必須条件にはしません。canonical / og:urlは正式βサイトのURLを出力し、og:imageは実画像の登録後に同期します。OGのtitle・description等は設定済みです。

通常ページは相対URLを使用します。404だけは未知の深いパスからも戻れるようルート相対パスを使い、正式URL未設定時は `/gridporter-site/`、設定後は同期スクリプトが正式URLのpathnameへ更新します。独自ドメインのルート配信では `/` です。

GitHub Pagesの[branch公開](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)を参照してください。将来、独自ドメインへ移行する際は[Custom domainとDNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)・HTTPSを整備し、siteUrlを変更してメタ情報を同期します。DNSの管理資格情報はRepositoryに保存しません。

## 本体・Privacy・Termsとの同期

対象：**GridPorter 0.4.2 beta**。本体の参照コミットと取得時点のversionとの差異は [VERIFICATION](docs/VERIFICATION.md) に記録します。Freeは2,000行・Recipe 1件、Pro betaは20,000行・Recipe件数制限なしです。取得件数や任意サイトでの精度を保証する上限ではありません。

保存先・保存期間・削除範囲・元サイトへの通常通信・support bundleを、公開説明、実際に配布する拡張機能、Store申告の間で照合します。法的適合・審査通過を断定せず、運営主体、受信した問い合わせの保持・削除条件、準拠法・裁判管轄は人間が確定します。

ExtensionのWebデータと、利用者が任意に送る問い合わせは別管理です。問い合わせはGmailで受信し、ContactSupporterが最小化・一部マスキングした処理用コピーを非共有Drive経由で運営者のWindows端末へ同期し、ローカルOllamaで整理・返信案作成を補助する場合があります。外部クラウドAI APIへ問い合わせ内容を送らず、運営者が確認・修正して手動返信します。添付は自動処理では有無・MIME種類のみです。詳細と保持の制限は [Privacy](privacy/index.html#support-data) と [照合記録](docs/SUPPORT_PRIVACY_REVIEW.md) を参照してください。

## 実画像とセキュリティ

[SCREENSHOT_GUIDE](docs/SCREENSHOT_GUIDE.md)に従ってCWS提出用の実画面を別途準備します。サイトRepositoryへのcommitは必須ではありません。サイトに掲載する場合のみ実画面の1280×800 PNGを配置・登録し、メタ情報を同期します。実UIを模した画像は使用しません。初期状態は画像なしで、トップの表はサンプルデータの説明図と明記しています。

Public repositoryです。個人用の連絡情報・住所、認証用の秘密値、決済・DNS・メールの資格情報、環境変数ファイルをcommitしません。公開窓口や法令上の表示情報は公開範囲を判断してから設定してください。`docs/` と `scripts/` も公開対象になり得ます。販売表示テンプレートへの公開HTMLからのリンクはありません。
