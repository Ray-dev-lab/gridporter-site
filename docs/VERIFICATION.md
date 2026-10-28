# GridPorterサイト検証記録

確認日：2026年10月28日（日本時間）。対象：GridPorter 0.4.2 beta。

## 固定根拠と変更範囲

サイトPR #4は2026-10-28 08:39:47 UTCにマージ済み。mainの `006c064d08da8dc9574956109593ed4365f4ae08` から今回の独立PRを作成します。

GridPorterは取得したmainの固定commit `dbcd4058fa12de3ef6195519fbef694e31a73646` を確認。manifestはGridPorter BETA / 0.4.2 / THIS EXTENSION IS FOR BETA TESTING、4権限、host permissionなし、CSP self。srcの外部URL・動的コード参照を調べ、Remote Code追加なし。src/shared/product.ts / infrastructure/license.tsのFree・Pro上限とβ・非販売を照合。data-store.ts / settings.ts / snapshots.ts / usage.tsは以前の照合commit `250ad103717d0d74ea065fd84525c7df0172e861` から差分なしです。本体の全ビルド・最終配布ZIP・CWS Dashboardを検証したという意味ではありません。

ContactSupporter PR #3 / #4はマージ済み。固定merge commitはそれぞれ `7b91fb9fc49090c7181ef1846be9421c5b4b2c41` / `e7450546192767fc8228f77ab1088d2cde4b9157`。後者が前者を含み、取得したdefault branchと一致します。DATA_HANDLING / Code.gs / LineNotification.gs / LINE_NOTIFICATION_JA / pipeline.pyを読み取り、公開文書の対応表を [SUPPORT_PRIVACY_REVIEW.md](SUPPORT_PRIVACY_REVIEW.md) に記録しました。

今回の公開変更はPrivacy §5の品質審査、LINE通知内容・匿名化の限界・残存、短い概要/件名を含む管理記録の保持説明と、Supportの関連案内だけです。Extension内データの説明、Terms本文、問い合わせ5種類の固定件名・本文・mailto・URLエンコード、JS無効時の代替、デザイン・CSP・設定・404は変更しません。

## 通常検証

次のすべてを実行し成功しました。実行結果はPR本文にも記録します。

- python scripts/check-site.py：全5ページ、リンク・アンカー・ブランド・meta・外部リソース等。
- node --check assets/site.js
- node --check assets/site-config.js
- node --check scripts/sync-metadata.mjs
- node --test tests/site.test.cjs：16件。5種類の全文・宛先・件名prefix・CRLF、注入拒否、未知の種別、URL長、query/hash非利用、既存一般リンク等。
- python -m unittest discover -s tests -p "test_*.py"：4件。人間の確認フラグ、任意画像、静的宛先同期。fixtureのHTTPSはmock。
- git diff --check

siteUrlは正式β URL、supportEmailはraydevsupport@gmail.com。chromeWebStoreUrl / supportUrlは空、screenshotsは空配列。privacyReviewed / termsReviewed / supportReviewedはfalseを維持。実設定のrelease検査はこの3件だけで停止し、任意の画像未登録は阻害要因にしません。レビュー済みfixtureの成功と実サイトの公開承認を混同しません。

## 表示・実環境の確認範囲

ローカルChromeで1440 / 390 / 320px、主要4ページの表示・横はみ出し、キーボード・focus、問い合わせの日本語/改行、JS無効時の連絡先、404のbase pathを確認しました。メールリンクの起動はテストで捕捉し、実メールは送信していません。ページ読込みで第三者リクエスト、Cookie、local/session storage、JavaScriptエラーは0件。Privacyのmobile表示も画像で確認。主要4ページは既存CSPを維持。404はscriptを含まない既存静的ページです。

正式サイトの主要4ページはHTTPSで200応答、最終URLとcanonical / og:urlが正式β URLに一致。深い存在しないパスは404で、戻り先は /gridporter-site/。公開Supportには5種類の導線があります。内部リンクはローカル静的検査でも成功。公開側は今回PR前の内容であり、新Privacyが反映済みとは扱いません。今回の公開操作はしていません。任意画像未登録のためog:imageを捏造しません。

## 所有者の最終確認とrelease blocker

- マージ・live反映後にPrivacy / Terms / Supportを読み、実際の運用と一致することを確認してから3フラグを更新する。今回はfalseのまま。
- Termsの未定義の運営主体と、未記載の準拠法・裁判管轄の扱いを判断する。免責・責任制限・β提供条件の適切性を人間が確認する。
- LINEへの概要・件名と、state/再試行記録に自動削除期限がないことを運用方針として承認する。上流DATA_HANDLING第0・10節に残る「本文なし」の総称も見直す。根拠と実装上の例外は対応表を参照。
- Gmail実受信、prefix限定、Drive非共有、ローカルOllama、下書き、LINE、宛先確認後の手動返信を、秘密情報のない試験メールで確認する。このサイトテストでは実施しない。
- 実機メールアプリとスクリーンリーダーで確認する。端末ごとのmailto動作・本文省略の可能性があり、手動作成案内を維持する。
- 最終配布Extension・CWS Dashboardの現在の質問文からData Usage checkboxを確定し、提出用実画像・Listing・公開Privacyを照合する。候補を確定申告と扱わない。

技術検査の成功は、公開済み・実受信成功・法的適合・CWS審査通過を示しません。
