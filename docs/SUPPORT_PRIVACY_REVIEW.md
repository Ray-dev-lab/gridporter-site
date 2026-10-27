# Extension / Supportの情報取扱い照合

確認日：2026年10月27日。サイトの対象表記はGridPorter 0.4.2 beta。法的適合や実アカウントの設定を保証する記録ではありません。

## 読み取り参照

- Extension main：`2f53139bcb348af34b84547be6caf3fe98fd49fd`。package / manifest / Privacyは0.4.1表記。
- Extension提出準備branch `chore/cws-private-beta-submission`：`dc462c4707ae18095ade6715243afb692c4c4dfa`。こちらもversionは0.4.1。0.4.2の実配布物は人間が最終照合する必要があります。
- ContactSupporter：`Ray-dev-lab/contactsupporter`、default branch `codex/initial-implementation`、`babf97e9f70505bc56c54c1d05dd84e67db2f0e5`。mainというbranchは取得時点でありません。

## 情報の境界

ExtensionのWebsite content / URL・title / Recipe / Dataset / Snapshot / checkpoint / settings / usageはブラウザー内で処理し、開発者へ自動送信しません。利用者が自らメールに含めて送った内容だけが任意のサポート通信になります。support bundleもコピー後に利用者が共有先と内容を選びます。

|対象|確認した実装・開示|
|---|---|
|問い合わせ|Gmailの送信者情報・件名・本文・添付。回答、不具合・セキュリティ調査、製品・サポート品質改善に使用|
|Drive処理用コピー|apps-script/Code.gs：件名・本文を最小化・Redactorで処理。送信者メールの欄はqueueに含まない。残留する自然文・秘密情報の可能性は否定しない|
|添付|mailData_：有無とMIME種類のみ。添付bytesを取得・コピーしない。filenameをqueue・ローカルLLMへ渡さない。人間はGmailで確認可能|
|ローカルAI|agent/analyzer.py / config.py：運営者Windows端末のOllama。分類・整理・調査補助・返信案。外部クラウドAI APIへ問い合わせを送らない|
|返信|collectResults_ / createDraft_：Gmail下書き作成。人間が内容・宛先・妥当性を確認し手動送信。自動送信処理なし|
|LINE|LineNotification.gs：固定通知とランダム管理ID。問い合わせ内容・製品名・Gmail ID・コード・LLM出力は入力しない|
|GitHub|agent/repository.py：local checkout参照。任意のfetchはsource更新だけ。問い合わせをIssue / commit / PRへ書き込む機能なし|
|Gmail原文・添付・下書き|自動削除処理なし。架空の削除日数を設定しない。運用上必要な期間管理し不要になったら判断して削除|

## 保持期間の適用範囲

Code.gsのmaintenance_はarchive内の処理済みpayloadを7日、failedを30日でTrashへ移す実装です。state / ticket / lineの小さい管理記録は除外されます。agent/queue.pyは正常解析後のqueueを削除し、本文なしreceiptをarchiveへ残します。未処理queue・processing・results自体に一律7日のタイマーがあるとは説明しません。定期処理の実行・件数制限による遅れ、Trash・履歴・backup・同期端末への残存を説明します。

## 件名prefixと実運用の確認

サイトのmailtoには `[GridPorter] お問い合わせ` を設定します。取得したContactSupporterのintake_は受信箱を走査し、このprefixだけで受付を限定する処理は確認できませんでした。サイトはprefixなしでも受信でき、自動整理の対象外となる「場合がある」と案内します。受付範囲を実運用で確認し、prefixで限定済みとは断定しないでください。サイト側でバックエンドを変更しません。

Drive領域の非共有設定、Ollamaのcloud無効化、通知の宛先と内容、実メール受信・手動返信は実環境での確認が必要です。コードの読み取りだけで稼働中の構成を確認済みとは扱いません。

## CWS Data Usageとの区別

提出時の想定はExtensionについて Web browsing history / Website contentをON、Personally identifiable information / Personal communications / Health / Financial・payment / Authentication / Location / User activityをOFFです。これはDashboardを変更した記録ではありません。実配布ビルドと最新の質問文に照らして人間が確定してください。Web表に個人情報等が含まれ得るため、単にLocal-firstだから申告不要と判断しないでください。

Privacyで説明する送信者メール・問い合わせ本文は、利用者が明示的に送った特定のサポート通信であり、Extensionがメールや通信履歴を収集するという意味ではありません。ExtensionのLimited Use説明は維持し、Supportでも広告・ターゲティング・販売・仲介・信用評価・融資・無関係なマーケティング・外部モデル学習等へ利用しない方針です。

参照：[Limited Use](https://developer.chrome.com/docs/webstore/program-policies/limited-use)、[Disclosure Requirements](https://developer.chrome.com/docs/webstore/program-policies/disclosure-requirements)。
