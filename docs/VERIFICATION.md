# GridPorterサイト検証記録

確認日：2026年10月26日（日本時間）。

## 本体参照

- Repository：`Ray-dev-lab/gridporter`
- branch：`main`
- version：`0.4.1`（beta）
- 参照commit：`250ad103717d0d74ea065fd84525c7df0172e861`

本体は読み取り確認のみ行い、コード・配布物を本サイトに同梱しません。

|参照元|確認内容|
|---|---|
|package.json|0.4.1|
|src/shared/product.ts|Free 2,000行、Recipe 1件|
|src/infrastructure/license.ts|Pro 20,000行・Recipe件数制限なし、比較・転送・Repair、販売ライセンス未実装|
|src/infrastructure/data-store.ts / settings.ts|Dataset 0/1/7日、session 8MB、checkpoint 1日・10件・20MB、削除範囲|
|src/infrastructure/snapshots.ts|30/90/365日/削除まで、既定90日、5件/Recipe、20MB/件・40MB全体|
|src/infrastructure/usage.ts|成功回数とレビュー案内フラグをlocalに保持|
|src/shared/support.ts / support-bundle.tsx|明示コピー、セル本文等を含めず、URLは任意・クエリ等を除外|
|docs/PRIVACY.md / CWS_PRIVACY_REVIEW.md|Local-first、対象サイトの通常通信、公開Policyとの照合|

## 検証範囲

- 静的検査：5ページ / 公開テキスト9ファイルの内部リンク・アンカー・必須meta・禁止参照・外部リソース検査に合格。
- site.js / site-config.js / sync-metadata.mjsのNode構文検査に合格。
- 正式βサイトは `https://ray-dev-lab.github.io/gridporter-site/`。GridPorter 0.4.1 betaではGitHub Pages標準URLを正式サイトとして使用し、独自ドメインは有料化・正式ブランド展開時に再検討する。
- siteUrlを正式βサイトへ設定し、4ページのcanonical / og:urlを同期。404のbase pathは `/gridporter-site/`。supportEmailは空、確認フラグはfalse、実画像は未登録のまま維持。
- ローカルChromeで1440px / 390px / 320px × 主要4ページの12表示を確認。ページ全体の横はみ出し、JavaScriptエラーなし。トップ画像でGridPorterのブランド・レイアウトを目視確認。
- FAQ開閉・Tab操作・visible focus、未設定CTAの非表示、テスト用設定差し替え時の宛先、不正設定の非表示、JS無効時のPrivacy / Terms / Support本文を確認。
- 通常読込みで第三者リクエスト・Cookie・localStorage / sessionStorageへの保存なし。
- URLゲートでは指定のGitHub Pages hostname / pathnameだけをβサイトとして許可し、将来の独自ドメイン対応を維持。HTTP、ローカル・予約ドメイン、IPアドレス、認証情報、query / hash、別のGitHub Pagesのhostname / pathnameは拒否。
- 隔離した一時fixtureでURLゲート28ケースを確認。正式β URL・将来の独自ドメインを許可し、別のGitHub Pages、パス違い、予約ドメイン、認証情報、空を含むquery / hash、明示port等を拒否。テスト用宛先は公開ファイルに保存しない。
- 現在の実設定で `--release` はsupportEmail・最終確認フラグ3件・実画像の不足により失敗する。GitHub Pagesであることや独自ドメイン不足を理由には失敗しない。実画像のog:imageは登録後に検査する。
- 4ページの変更はcanonical / og:urlの同期のみで、本文・デザイン・CSPは維持。404は変更前と同一で、base pathは `/gridporter-site/`。通常site checkと指定のNode構文検査3件に合格。
- source全体の旧ブランド残存検索は0件。確認用の不要な文言や移行記録を公開ファイルに残さない。
- CIはPR / main pushで静的検査とJS構文検査を行う。checkoutはcommit固定・contents read・認証情報保持なし。

メール・実画像は未設定です。正式βサイトURLの設定と公開環境での反映確認は区別します。公開環境のHTTPS・メタ情報反映、メール受信、実画像の真実性、法的な最終確認、スクリーンリーダー実機の確認は残っています。実環境のHTTPSを模擬検証で確認済みとは扱いません。CI実行状況はRepositoryのActionsで確認してください。
