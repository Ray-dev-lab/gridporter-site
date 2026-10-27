# GridPorterサイト検証記録

更新確認日：2026年10月27日（日本時間）。サイト対象：GridPorter 0.4.2 beta。

## 固定根拠とレビュー時点の記録（2026年10月27日）

GridPorterは[PR #3](https://github.com/Ray-dev-lab/gridporter/pull/3)を主要参照とします。レビュー実施日：2026年10月27日。**reviewed snapshot** `f68700c6718bf681b907849d4d11e46ab464297f`、base main / `2f53139bcb348af34b84547be6caf3fe98fd49fd` で、manifestのGridPorter BETA / 0.4.2 / β宣言、4権限のみ・host permissionなし・CSP、runtime src差分なしとRemote Code追加なしを読取り確認しました。このSHAは当日の検証対象を再現するための記録で、可変なPR先端の継続的な保証ではありません。レビュー時点でPRは未Mergeで、後続変更・Merge後の最終配布物は再照合が必要です。

ContactSupporter [PR #1](https://github.com/Ray-dev-lab/contactsupporter/pull/1)はMerge済み。固定根拠はMerge commit [`a10650cfc0c1625e0ac3b2273acd15ee1b373cf4`](https://github.com/Ray-dev-lab/contactsupporter/commit/a10650cfc0c1625e0ac3b2273acd15ee1b373cf4)です。default branch `codex/initial-implementation` に含まれることと、固定commitのDATA_HANDLING / Code.gsが取得したdefault branch上の内容と一致することを確認しました。prefixのfail-closed gate、保持・添付・通知・下書き処理を読取り確認し、prefix不一致ではfull body / queue / LINE / supportラベル変更 / state作成なしです。固定permalinkは [SUPPORT_PRIVACY_REVIEW](SUPPORT_PRIVACY_REVIEW.md) を参照してください。

ContactSupporterのMerge完了と本番設定・受入試験は区別します。GridPorter PR #3はレビュー時点で未Merge。CWS再提出やサイトの公開反映も完了扱いにしません。外部PRの試験成績はPR本文の報告であり、このサイト作業で全ビルド・実サービス試験を再実行したという意味ではありません。

## 過去の本体参照（2026年10月26日、履歴根拠）

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
- 正式βサイトは `https://ray-dev-lab.github.io/gridporter-site/`。GridPorter 0.4.2 betaではGitHub Pages標準URLを正式サイトとして使用し、独自ドメインは有料化・正式ブランド展開時に再検討する。
- siteUrlを正式βサイトへ設定し、4ページのcanonical / og:urlを同期。404のbase pathは `/gridporter-site/`。supportEmailは `raydevsupport@gmail.com` に設定。確認フラグはfalse、実画像は未登録のまま維持。
- ローカルChromeで1440px / 390px / 320px × 主要4ページの12表示を確認。ページ全体の横はみ出し、JavaScriptエラーなし。トップ画像でGridPorterのブランド・レイアウトを目視確認。
- FAQ開閉・Tab操作・visible focus、未設定CTAの非表示、テスト用設定差し替え時の宛先、不正設定の非表示、JS無効時のPrivacy / Terms / Support本文を確認。
- 通常読込みで第三者リクエスト・Cookie・localStorage / sessionStorageへの保存なし。
- URLゲートでは指定のGitHub Pages hostname / pathnameだけをβサイトとして許可し、将来の独自ドメイン対応を維持。HTTP、ローカル・予約ドメイン、IPアドレス、認証情報、query / hash、別のGitHub Pagesのhostname / pathnameは拒否。
- 隔離した一時fixtureでURLゲート28ケースを確認。正式β URL・将来の独自ドメインを許可し、別のGitHub Pages、パス違い、予約ドメイン、認証情報、空を含むquery / hash、明示port等を拒否。テスト用宛先は公開ファイルに保存しない。
- 現在の実設定で `--release` は最終確認フラグ3件の不足により失敗する。サイト掲載画像は任意で、未登録だけでは失敗しない。GitHub Pagesであることや独自ドメイン不足を理由には失敗しない。実画像のog:imageは登録後に検査する。
- 過去のGitHub Pages URL同期時の4ページ変更はcanonical / og:urlのみ。今回のcross-repository evidence同期でもデザイン・CSP・404のbase path `/gridporter-site/` は維持。
- source全体の旧ブランド残存検索は0件。確認用の不要な文言や移行記録を公開ファイルに残さない。
- CIはPR / main pushで静的検査、JS構文検査、mailto安全性・releaseゲートの回帰検査を行う。checkoutはcommit固定・contents read・認証情報保持なし。

実画像は未設定です。正式βサイトURL・メールの設定と公開環境での反映確認は区別します。公開環境のHTTPS・メタ情報反映、メール受信、実画像の真実性、法的な最終確認、スクリーンリーダー実機の確認は残っています。実環境のHTTPSを模擬検証で確認済みとは扱いません。CI実行状況はRepositoryのActionsで確認してください。

## 0.4.2向けの変更・検証

- PrivacyはExtensionのWebデータと任意の問い合わせを別の見出しで開示。Extension内のDataset / Snapshot / checkpointの保持・削除仕様は変更しない。
- Gmail受信、最小化・マスキングした専用非共有Driveコピー、WindowsのローカルOllama、結果からGmail下書き、人間の確認・手動送信を説明。完全匿名化とは記載しない。
- 添付は自動処理では有無・MIMEのみ、LINEは固定通知と管理IDのみ、問い合わせをGitHubへ自動投稿しない。Gmail原文・添付・下書きの自動削除日数は作らない。
- `node --test tests/site.test.cjs`：5テスト成功。invalid email、件名の安全なエンコード、raw / encoded CR/LF拒否、メールのlocal-partにあるURL区切り文字のエンコード、本文収集・保存機能なしを確認。
- `python -m unittest discover -s tests -p "test_*.py"`：3テスト成功。画像なしで人間の確認だけが残ること、確認済みfixtureでは画像なしでも通ること、登録した画像の欠落は引き続き拒否することを確認。HTTPSはmockで、実メールは送信しない。
- 更新後のローカルChrome：1440px / 390px / 320px × 主要4ページの12表示、件名付きmailto、本文フォームなし、JS無効時の文書表示を確認。横はみ出し・JSエラー・第三者リクエスト・Cookie・ブラウザー保存なし。Supportのmobile画像を目視確認。
- 通常site check・指定のNode構文検査3件が成功。実設定の`--release`はprivacyReviewed / termsReviewed / supportReviewedの3件で意図どおり停止。flagsはfalseを維持。
- 2026年10月27日のlive確認：トップ・Privacy・Terms・SupportはいずれもHTTPSでHTTP 200、canonicalも正式β URLに一致。公開本文は0.4.1 betaのまま。PR未mergeのため今回の変更が公開済みとは扱わない。
- CWS画像はExtensionの提出資産として別確認。サイトcommitや架空のog:imageを要求・追加しない。

## 参照方法の最終整理

ContactSupporterはdefault branchに含まれるMerge commitを固定根拠とし、DATA_HANDLING / Code.gsのpermalinkを使用します。GridPorterはPR URLを主要参照とし、SHAは日付付きreviewed snapshotと明示します。可変PRの先端を長期保証する文書にはせず、Merge後に固定commitと最終配布物を改めて照合します。今回の差分は文書のみで、Privacy / Supportの公開本文・デザイン・機能・設定は変更しません。

指定の通常site check、Node構文検査3件、Node 5テスト、Python 3テストを再実行して成功。実設定の`--release`は人間のreview flags 3件だけで意図どおり失敗。flagsはfalseのままで、Merge後のliveページを人間が最終確認する前にはtrueにしません。GridPorter PRのMerge、本番prefix設定・受入試験、CWS最終checkbox・再提出は別途確認が必要です。Data UsageのON / OFFは候補のままで、人間が最終Dashboard質問文と最終配布物から決定します。
