# サイト公開準備とCWS提出資産の確認

対象：GridPorter 0.4.2 beta。正式サイトはGitHub Pages標準URLです。独自ドメインは有料化・正式ブランド展開時に再検討します。サイトのrelease検査と、CWS提出用画像等の資産準備は分離します。

## 通常CI

- [ ] `python scripts/check-site.py`
- [ ] `node --check assets/site.js`
- [ ] `node --check assets/site-config.js`
- [ ] `node --check scripts/sync-metadata.mjs`
- [ ] `node --test tests/site.test.cjs`
- [ ] `python -m unittest discover -s tests -p "test_*.py"`

PR / main pushで実行します。5種類の固定本文・正確な件名prefix・宛先、本文改行のエンコード、CR/LFヘッダー注入拒否、未知の種別拒否、query/hashを使用しないこと、本文収集・保存・自動送信なし、既存の一般リンクを確認します。

## サイトのreleaseゲート

- [ ] 正式βサイト `https://ray-dev-lab.github.io/gridporter-site/` をmain / rootで配信し、HTTPSを確認。
- [ ] siteUrlのhostname / pathname、4ページのcanonical / og:url、404のbase pathを確認。
- [ ] supportEmail `raydevsupport@gmail.com` の実受信・返信、supportSubjectの `[GridPorter]` を確認。
- [ ] Support上部「メールでお問い合わせ」→5種類をそれぞれ選び、メール作成画面の宛先・件名・本文を確認。件名先頭は正確に `[GridPorter]`、日本語と改行が読め、送信前に編集できること。テストでは実送信しない。
- [ ] PCとスマートフォンの普段使うメールアプリで確認。起動しない・本文が省略される場合は、表示された宛先と件名形式で手動作成できること。
- [ ] JavaScript無効でもSupportに宛先と件名形式が表示されること。supportEmail変更時は既存の `node scripts/sync-metadata.mjs` で静的表示も同期する。
- [ ] PrivacyでExtensionデータと任意の問い合わせを分離し、ContactSupporterの実運用と照合。
- [ ] Termsでは運営者が未定義で、準拠法・裁判管轄の明文はない。実際の運営主体の公開表記と、法的記述の要否・内容、免責/責任範囲・β提供条件を所有者が判断する。架空の氏名・住所・法人・法域は補わない。
- [ ] Supportの案内・秘密情報送付禁止・自動整理と手動返信を人間が最終確認。
- [ ] 最終確認後だけprivacyReviewed / termsReviewed / supportReviewedをtrueにする。
- [ ] `node scripts/sync-metadata.mjs` 後に `python scripts/check-site.py --release` を実行。

現在の確認フラグはfalseです。サイトのrelease検査はこの3項目で停止するのが正しい状態です。画像未登録だけを理由に失敗せず、CWS提出可否を断定しません。任意のサイト掲載画像を登録した場合は、実ファイル・1280×800 PNG・alt・og:imageを検査します。架空画像は追加しません。

設定と確認フラグが揃うと、正式URLの4ページへHTTPSアクセスし、応答・最終URL・公開canonical / og:urlも検査します。メール実受信・法的確認・画像の真実性は人間の確認が必要です。

## CWS提出資産・本体との整合（サイト検査とは別）

- [ ] 本体mainの固定参照 `dbcd4058fa12de3ef6195519fbef694e31a73646` で確認した0.4.2 manifestを最終配布ビルドと照合。CWS再提出は人間が実施する。
- [ ] StoreのWeb browsing history / Website content等の申告、Listing、拡張UI、Privacyを最終照合。任意のサポートメールをExtensionの収集カテゴリと混同しない。
- [ ] CWS提出用の実スクリーンショットを用意し、提出要件・機密情報・権利を確認。サイトRepositoryへのcommitは不要。
- [ ] Store URLが発行されたら設定し、配布状態・β表示を確認。
- [ ] Free 2,000行 / Recipe 1、Pro beta 20,000行 / Recipe件数制限なし、機能表を確認。
- [ ] 本体のWebデータを外部AIサービスへ送信しない説明と、任意のサポートでローカルAIを使う説明を区別。
- [ ] 有料販売・AI搭載製品・未実装ライセンス等の誤認がない。

## 表示・セキュリティと運用

- [ ] PC / mobile、キーボード、visible focus、FAQ、JS無効時の本文、内部リンク・深い404を確認。
- [ ] 問い合わせ本文を収集・保存するフォーム、解析、追跡、外部JS・フォント、広告、Cookieがない。
- [ ] 固定の本文ひな形と、利用者がメールアプリ内で記入する実本文を区別。サイト側は実本文・ページURL・ブラウザー情報等を自動取得しない。PrivacyのExtension / Support分離と矛盾しない。
- [ ] Gmail原文・添付・下書きの自動削除は未実装として案内。Drive処理済みコピー原則7日・failed原則30日は適用範囲と清掃遅延を含めて説明。
- [ ] ContactSupporterのマージ済みPR #3 / #4との[対応表](SUPPORT_PRIVACY_REVIEW.md)を確認。LINEへ製品名・タイトル・AI概要（240文字）・元件名（180文字）・判定/調査/対応/draft状態・Ticket等が送られ、完全匿名化ではないことを公開Privacyと実運用で照合。
- [ ] state / 通知再試行記録には短い概要・件名が含まれ、自動削除期限がなく、7日/30日のpayload清掃対象とは別であることを確認。LINE側・管理環境・端末・通知履歴の保持と閲覧範囲も確認する。
- [ ] 上流DATA_HANDLING第0・10節の「本文なし」総称は新しいstate等の保持を十分に表さないため、所有者が見直す。サイト側の公開説明は実装と同文書第4節・通知仕様に合わせる。
- [ ] 件名prefixによる受付範囲、Drive非共有設定、ローカルAI、手動送信、通知の最小化を実際の運用で確認。
- [ ] 秘密情報・私用の連絡情報・住所・認証資格情報をcommitしない。

検査成功は審査通過や法的適合の保証ではありません。
