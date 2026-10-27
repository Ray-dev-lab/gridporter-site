# Extension / Supportの情報取扱い照合

確認日：2026年10月27日。サイトの対象表記はGridPorter 0.4.2 beta。法的適合や実アカウントの設定を保証する記録ではありません。

## 読み取り参照

- [GridPorter PR #3](https://github.com/Ray-dev-lab/gridporter/pull/3)：head `3ece341c09228215849f3455d4e5237013ac7c7d`、branch `chore/cws-private-beta-submission`。baseはmain / `2f53139bcb348af34b84547be6caf3fe98fd49fd`。
- [ContactSupporter PR #1](https://github.com/Ray-dev-lab/contactsupporter/pull/1)：head `f5ea35fe98f262a0f954194fd2a17584b75846cc`、branch `chore/gridporter-support-hardening`。baseはcodex/initial-implementation / `babf97e9f70505bc56c54c1d05dd84e67db2f0e5`。このbaseを現行PR実装の根拠にはしません。
- 2026年10月27日に現在のGitHub APIで両PRのhead / base / 本文 / 変更一覧を確認し、PR refを取得して同じSHAのコードを読取り確認しました。GridPorterは15変更ファイル（package / manifest / icon / CWS・Privacy監査docs / tooling・E2E等）、ContactSupporterは23変更ファイル（Apps Script / redactor / repository制御 / DATA_HANDLING / 受入手順 / setup・検査・テスト等）。
- 両PRともopen / 未Mergeです。以下はPR実装の確認であり、本番導入・live反映・受入試験・CWS再提出の完了を示しません。Merge、本番設定、受入試験は未完了として扱います。

## GridPorter 0.4.2の確認

最新headの `public/manifest.json` はname `GridPorter BETA`、version `0.4.2`、descriptionに `THIS EXTENSION IS FOR BETA TESTING` を含みます。permissionsはactiveTab / scripting / storage / downloadsの4件のみで、host_permissions / optional_host_permissionsはありません。CSPは `script-src 'self'; object-src 'none'`、runtime srcはPR baseから変更なし。Remote Code追加なしを、manifest / src差分 / `tests/tooling/resubmission.test.mjs` / `docs/RESUBMISSION_AUDIT_0.4.2.md` で読取り確認しました。外部PRの全ビルド・E2Eや配布ZIPの再検査をこのサイト作業で再実行したという意味ではありません。

PR本文では既存の手入力報告文を端末内で処理・コピーする機能も説明されています。Extensionが問い合わせ本文を一切扱わないとは断言せず、メール受信・送信者情報取得・自動送信とは区別します。実配布ZIP・Dashboard申告・CWS再提出は人間が確認・実施します。

## 情報の境界

ExtensionのWebsite content / URL・title / Recipe / Dataset / Snapshot / checkpoint / settings / usageはブラウザー内で処理し、開発者へ自動送信しません。利用者が自らメールに含めて送った内容だけが任意のサポート通信になります。support bundleもコピー後に利用者が共有先と内容を選びます。

|対象|確認した実装・開示|
|---|---|
|問い合わせ|Gmailの送信者情報・件名・本文・添付。回答、不具合・セキュリティ調査、製品・サポート品質改善に使用|
|Drive処理用コピー|apps-script/Code.gs：件名・本文を最小化・Redactorで処理。送信者メールの欄はqueueに含まない。残留する自然文・秘密情報の可能性は否定しない|
|添付|mailData_：有無とMIME種類のみ。添付bytesを取得・コピーしない。filenameをqueue・ローカルLLMへ渡さない。人間はGmailで確認可能|
|ローカルAI|Drive Desktop同期後、agent/analyzer.py / config.pyが運営者Windows端末のOllamaで分類・整理・調査補助・返信案を作成。外部クラウドAI APIへ問い合わせを送らない|
|返信|collectResults_ / createDraft_：Gmail下書き作成。人間が内容・宛先・妥当性を確認し手動送信。自動送信処理なし|
|LINE|LineNotification.gsのLINE Messaging API：所有者1名へ固定通知と独立乱数Ticketのみ。問い合わせ内容・製品名・Gmail ID・コード・LLM出力は入力しない。到着事実・Ticketの日付・時刻相当のmetadataは通知サービス側に残り得る|
|GitHub|agent/repository.py：local checkout参照。任意のfetchはGit object等の取得のみで、worktree更新の保証はない。問い合わせをGitHub / Issue / commit / PRへ書き込む機能なし|
|Gmail原文・添付・下書き|自動削除処理なし。架空の削除日数を設定しない。運用上必要な期間管理し不要になったら判断して削除|

## 保持期間の適用範囲

最新PRの `support-agent/docs/DATA_HANDLING.md` 第10節とCode.gsのmaintenance_を照合しました。

|保存物|PR実装で確認した扱い|
|---|---|
|archive内の処理済みresult / queue / receipt等payload|最終更新から7日超でDrive Trash対象（公開文では原則7日）|
|failed内payload|最終更新から30日超でDrive Trash対象（公開文では原則30日）|
|未完了queue / processing / 未回収results|一律7日削除なし。再試行・担当者確認を優先し、停止・障害時は残り得る|
|Gmail原文・添付・返信draft|自動削除なし。固定の削除日数は説明しない|
|state / ticket / line系、SQLite jobs|本文なしの管理metadataとして期限なし。より長く保持する場合があると公開説明|

正常解析後のprocessing queueは結果・receipt公開とdone永続化後にローカル削除し、同期へ反映。クラウド回収が先ならarchiveへ移る場合があります。Drive resultには要約・返信案に加え、調査用の短いコードexcerpt・相対ファイル参照が含まれ得ます。匿名情報とは断定しません。

清掃は最短1時間間隔、archive / failedそれぞれ最大100件。古いpayloadを検索で先に絞り、管理metadataによる清掃停滞を防ぐ実装です。トリガー停止・同期遅延・蓄積で遅れる可能性、Trash・履歴・backup・同期端末への残存があり、7日 / 30日は完全消去時刻の保証ではありません。

## 件名prefixと実運用の確認

サイトのmailtoには `[GridPorter] お問い合わせ` を設定します。**ContactSupporter PR #1の最新headでprefix限定のfail-closed gateを確認しました。** `SUPPORT_INTAKE_PREFIXES_JSON` のGridPorter設定値は `["[GridPorter]"]`。未設定・空・不正なら受付0件で、Inbox全体へのfallbackはありません。

Code.gsのintakePrefixes_ / acceptedSubject_ / intake_で、候補をSubject metadataにより大小文字を含む先頭一致で検査してから後段へ進みます。不一致ではfull body取得・Drive queue作成・LINE通知・supportラベル変更・state作成を行いません。Re: / Fwd: / 先頭空白 / 本文だけのprefixは受付せず、Gmailに届いたメールは人が確認します。結果回収・エラー処理・滞留確認にも同じ境界があり、旧stateを通じた迂回を防ぐコードと契約テストを読み取り確認しました。prefixは本人確認・迷惑メール対策の代替ではありません。

これはPR #1実装での確認です。Merge / 本番設定 / 受入試験は未完了。本番へ配置済みとは記載しません。公開ページには内部property名を出さず、製品識別子で始まる件名の案内を維持します。

Drive領域の非共有設定、Ollamaのcloud無効化、通知の宛先と内容、実メール受信・手動返信は実環境での確認が必要です。コードの読み取りだけで稼働中の構成を確認済みとは扱いません。

## CWS Data Usageとの区別

現時点のON候補はWeb browsing history / browsing information、Website contentです。OFF候補はPII、Health、Financial / payment、Authentication、Personal communications、Location、User activityです。候補であって確定事項ではありません。Dashboardの最終checkboxは、Extension実配布物と現在の質問文を人間が確認して確定します。Dashboard変更・最終宣誓・CWS再提出はこの作業では行いません。

任意のWebページ・URL・手入力報告文にPII等が含まれ得て、ローカル利用counterも存在します。Web content categoryだけで十分という法的・審査上の断定をせず、サポートでの任意メール受信だけでExtensionのカテゴリを決めることもしません。Google公式User Data FAQの質問3・14にあるとおり、local-onlyの処理・保存でも取扱いの開示が必要です。

Privacyで説明する送信者メール・問い合わせ本文は、利用者が明示的に送った特定のサポート通信であり、Extensionがメールや通信履歴を収集するという意味ではありません。ExtensionのLimited Use説明は維持し、Supportでも広告・ターゲティング・販売・仲介・信用評価・融資・無関係なマーケティング・外部モデル学習等へ利用しない方針です。

参照：[User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)、[Limited Use](https://developer.chrome.com/docs/webstore/program-policies/limited-use)、[Disclosure Requirements](https://developer.chrome.com/docs/webstore/program-policies/disclosure-requirements)。公開PrivacyのUser Data Policy / Limited Useへの肯定的な準拠表明は維持します。
