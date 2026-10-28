# Extension / Supportの情報取扱い照合

確認日：2026年10月28日（日本時間）。対象：GridPorter 0.4.2 beta。実装の読取り照合と、実運用・法的判断・CWS審査を区別します。

## マージ済みの固定根拠

- サイト[PR #4](https://github.com/Ray-dev-lab/gridporter-site/pull/4)はマージ済み。今回のbaseはmainの `006c064d08da8dc9574956109593ed4365f4ae08`。5種類の問い合わせテンプレートを含みます。
- ContactSupporter [PR #3](https://github.com/Ray-dev-lab/contactsupporter/pull/3)：merge commit `7b91fb9fc49090c7181ef1846be9421c5b4b2c41`。調査・返信案作成・独立した品質審査の工程を追加。
- ContactSupporter [PR #4](https://github.com/Ray-dev-lab/contactsupporter/pull/4)：merge commit [`e7450546192767fc8228f77ab1088d2cde4b9157`](https://github.com/Ray-dev-lab/contactsupporter/commit/e7450546192767fc8228f77ab1088d2cde4b9157)。PR #3を含み、取得したdefault branch `codex/initial-implementation` と一致。概要・元件名のLINE通知とstateへの保持を確認しました。
- GridPorterは取得したmainの固定commit [`dbcd4058fa12de3ef6195519fbef694e31a73646`](https://github.com/Ray-dev-lab/gridporter/commit/dbcd4058fa12de3ef6195519fbef694e31a73646)を確認。可変なPR headを継続的な保証には使いません。

ContactSupporterの次のリンクはPR #4 merge commitに固定した根拠です。private repositoryのため運営者向けであり、公開Privacyの利用者が閲覧できる前提にはしません。

- [DATA_HANDLING.md](https://github.com/Ray-dev-lab/contactsupporter/blob/e7450546192767fc8228f77ab1088d2cde4b9157/support-agent/docs/DATA_HANDLING.md)
- [Code.gs](https://github.com/Ray-dev-lab/contactsupporter/blob/e7450546192767fc8228f77ab1088d2cde4b9157/support-agent/apps-script/Code.gs)
- [LineNotification.gs](https://github.com/Ray-dev-lab/contactsupporter/blob/e7450546192767fc8228f77ab1088d2cde4b9157/support-agent/apps-script/LineNotification.gs)
- [LINE_NOTIFICATION_JA.md](https://github.com/Ray-dev-lab/contactsupporter/blob/e7450546192767fc8228f77ab1088d2cde4b9157/support-agent/docs/LINE_NOTIFICATION_JA.md)
- [pipeline.py](https://github.com/Ray-dev-lab/contactsupporter/blob/e7450546192767fc8228f77ab1088d2cde4b9157/support-agent/agent/pipeline.py)

## 現在の実装と公開文書の対応表

|対象|固定commitで確認した実装|公開文書|
|---|---|---|
|Extension|manifestはGridPorter BETA / 0.4.2、descriptionにTHIS EXTENSION IS FOR BETA TESTING。activeTab / scripting / storage / downloadsのみ、host permissionなし。CSPはself。srcの外部URL・動的コード読取りでRemote Code追加なし|トップの0.4.2 beta、Privacy §1・2・4・6|
|Free / Pro|product.ts / license.ts：Free 2,000行・Recipe 1、Pro 20,000行・Recipe unlimited、比較・転送・Repair等。販売用ライセンス未実装|トップ比較表、Terms §6のβ・非販売|
|Extension内の保存|data-store.ts / settings.ts / snapshots.ts / usage.tsは従来照合commitから差分なし。Dataset / Snapshot / checkpoint等はローカル管理|Privacy §2・3を変更しない|
|境界|ExtensionのWebデータ・URLをContactSupporterへ自動送信する変更なし。利用者がメールに含めて送った情報を処理|Privacy §1・4・5、Supportの明示共有|
|Gmail・受付|原文・送信者・件名・本文・添付をGoogleが保持。Apps ScriptがSubject metadataで受付判定し、対象の技術本文等を最小化・マスキング|Privacy §5「扱う情報」「GmailとGoogle Drive」|
|Drive・同期|処理コピーは専用非共有Drive、Drive DesktopでWindowsへ同期。queueに専用sender欄なし。resultには要約・返信案・短いコードexcerpt等が含まれ得る|Privacy §5のGoogle処理・ローカルAI|
|ローカルAI|Planner → bounded retrieval → Investigator → Writer → Reviewer、修正最大1回。ローカルOllama、外部クラウドAI APIなし|Privacy §5に調査・返信案・品質審査を明記|
|返信|Code.gsでGmail返信下書き。人間が確認・修正し手動送信。メール自動送信なし|Privacy §5、Supportに即時・完全自動回答の保証なし|
|添付|自動処理は有無・MIME種類のみ。添付bytesを解析・queueへコピーせず、filenameをローカルAIへ渡さない。担当者がGmailで確認可能|Privacy §5の添付説明を維持|
|LINE|製品名、固定カタログタイトル、AI概要、検証済み元件名、分類・判定・確信度・優先度、所定の調査結果・対応状況、追加情報/添付確認要否、draft状態、独立Ticket|Privacy §5「LINEへの通知」を更新、Supportからリンク|
|LINEへの制限|prepareContext：概要240文字/件名180文字。保存前・送信前に既知の秘密・連絡先・URL/IP・パス等を除去。氏名/会社名/未知secretの完全除去なし。原文全文・添付実体・Gmail ID・コードを通知しない|Privacy §5に上限・匿名化の限界・LINE事業者/管理環境/端末/通知履歴への残存を明記|
|GitHub|参照するのは許可されたlocal checkout。任意のfetchはオブジェクト取得。問い合わせのIssue/PR/commit/pushなし|Privacy §5の調査説明を維持|
|サイト|5種類の固定件名/本文、mailto、個別URLエンコード、利用者による編集/手動送信。本文入力フォーム・保存・自動収集/送信なし|Supportの5種類・注意・JS無効/メールアプリ未設定時の代替を維持|

## 保存期間と補助記録

|保存物|確認した扱いと公開説明|
|---|---|
|archiveの処理済みresult / queue / receipt等payload|最終更新から7日超でDrive Trash対象（原則7日）|
|failedのpayload|最終更新から30日超でDrive Trash対象（原則30日）|
|未完了queue / processing / 未回収results|一律7日削除なし。障害や停止時に残る場合あり|
|state / ticket / line系|自動削除期限なし。stateのline_mail_contextとline再試行snapshotに、秘密除去後の短い概要・件名が含まれる。7日/30日のpayload清掃とは別|
|SQLite jobs|本文・件名・senderなし。重複防止のため期限なし|
|Gmail原文・添付・draft・返信履歴|この自動処理による削除なし。運営者が必要性を判断して管理|

DATA_HANDLING第4節と通知仕様は短い概要・件名のstate等への保持を明記しています。一方、第0・10節には「本文なし補助記録」という総称が残っています。Code.gsのstate.line_mail_context保存、LineNotification.gsのstate.notice snapshot、maintenance_の管理記録除外を根拠に、公開Privacyでは**すべての管理記録が内容を含まないとは説明しません**。上流文書の総称も所有者が見直す事項です。本サイト作業で上流ソース・文書は変更しません。

清掃は最短1時間間隔、archive / failedそれぞれ最大100件。停止・同期遅延・大量蓄積で遅れ得ます。Trashは完全消去ではなく、履歴・backup・同期端末への残存もあります。7日/30日の完全消去保証はしません。通知サービス側の保存にこのDrive期限は適用しません。

## 受付互換性

Code.gsのintakePrefixes_ / acceptedSubject_ / intake_で、SUPPORT_INTAKE_PREFIXES_JSONのGridPorter値 `["[GridPorter]"]` に対する厳密な先頭一致を確認。未設定・不正ならfail closed。不一致ではfull body取得・queue・LINE・support label変更・state作成なし。prefixは本人確認の代替ではありません。

サイトの不具合・使い方・改善・プライバシー・その他の5件名はすべて正確な `[GridPorter]` で始まります。本文を簡略化せず、一般リンクも維持。利用者がメールアプリで件名を変更すると対象外になり得ます。実受信・下書き・LINEの受入試験はコード読取りとは別です。

## Terms・所有者が判断する事項

Terms §2〜4の利用者責任、§5・6のβ/提供条件/現時点で非販売、§8の免責と法令上制限できない責任の留保、§10の窓口を確認しました。本文は変更しません。法的適合を保証するレビューではありません。

- 公開Termsは「運営者」を定義していません。実際の運営主体の公開表記・責任主体を所有者が確定する。GitHub名だけで法的主体の確認済みとはしない。
- 準拠法・裁判管轄の明文はありません。採用の要否・内容、免責/責任制限と利用者への適用を人間が確認する。架空の氏名・住所・法人・法域は追加しない。
- Proのβ提供条件・将来販売時の表示、問い合わせ削除依頼の対応方法、期限のない短い概要/件名の保持が運用方針として適切かを確認する。
- LINE事業者・公式アカウント・端末の閲覧範囲、通知プレビュー、Drive非共有、同期/backup、Ollamaのlocal-only設定を実環境で確認する。

## CWS Data Usageと公開判定

ON有力候補はWeb browsing history / information、Website content。OFF候補はPII、Health、Financial/payment、Authentication、Personal communications、Location、User activity。確定値ではなく、最終配布ExtensionとCWS Dashboardの現在の質問文を人間が確認して決定します。任意Webページ・URL・報告文にPII等が含まれ得るため、Website contentだけで十分とは断定しません。

local-onlyでもデータ取扱いの開示が必要という前提と、公開PrivacyのUser Data Policy / Limited Useへの肯定的な準拠表明を維持します。任意サポートメールをExtensionによるメール収集と混同しません。

privacyReviewed / termsReviewed / supportReviewedはfalseのまま。マージ・live反映後に所有者が実ページを読み、運用との一致と上記判断事項を確認してから別途更新します。マージ済みコードはGoogle/PCへの配置、実メール受入、公開反映、CWS再提出・審査通過の証明にはしません。
