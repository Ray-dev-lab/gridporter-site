# CWS提出前の必須ゲート

通常CIとCWS提出判定を分けます。GridPorter 0.4.1 betaではGitHub Pages標準URLを正式サイトとして使用します。独自ドメインは有料化・正式ブランド展開時に再検討します。メールは設定済みですが、人間による最終確認・実画像が未設定のため、**CWS提出不可**が正しい状態です。メール受信・返信の実確認も必要です。

## 通常CI

- [ ] `python scripts/check-site.py`
- [ ] `node --check assets/site.js`
- [ ] `node --check assets/site-config.js`
- [ ] `node --check scripts/sync-metadata.mjs`

PR / main pushで上記を実行します。通常検査では未確定の正式URLやメールを要求しません。

## CWS提出必須項目

- [ ] 正式βサイト `https://ray-dev-lab.github.io/gridporter-site/` をmain / rootで配信。
- [ ] 有効な証明書によるHTTPS配信とHTTP→HTTPSを実アクセスで確認。
- [ ] siteUrlが正式βサイトのHTTPS URLと一致することを確認。hostnameは `ray-dev-lab.github.io`、pathnameは `/gridporter-site/` とし、任意のGitHub.ioサイトを許可しない。
- [ ] `node scripts/sync-metadata.mjs` を実行し、4ページのcanonical / og:url / og:image / og:image:altを反映。
- [ ] supportEmailを設定して送受信を確認。窓口CTAが表示されることを確認。
- [ ] Privacyを実配布ビルドと照合し、運営主体・問い合わせ情報の取扱いを確定。
- [ ] Termsを人間が確認し、運営主体・準拠法・裁判管轄等を確定。
- [ ] Supportの問い合わせ方法・対象・注意事項を人間が確認。
- [ ] 上記の最終確認後、release内のprivacyReviewed / termsReviewed / supportReviewedをtrueにする。
- [ ] 実スクリーンショットを1280×800 PNGで配置し、src / altを登録。実画面であることと機密情報の除去を人間が確認。
- [ ] 反映後に `python scripts/check-site.py --release` が成功。

release検査は正式HTTPS URL・メール書式・確認フラグ・実PNGの存在と寸法・静的canonical / OGを検査し、条件が揃うと正式URLの4ページへHTTPSアクセスして応答・最終URL・配信されたcanonical / og:urlも確認します。実画像未登録時は画像不足を報告し、登録後はog:imageも必須です。メールの実在・受信、画像の真実性、法的な最終確認は人間の確認が必要です。独自ドメイン不足を理由にβ公開を止めません。将来の独自ドメイン移行時にはDNS管理権限とHTTPSも確認してください。

## 最後の実確認

- [ ] Store申告・掲載説明・拡張UI・Privacyのデータ取扱いが一致。
- [ ] Free 2,000行 / Recipe 1、Pro beta 20,000行 / Recipe件数制限なし、機能表が実装と一致。
- [ ] 有料販売・AI・Cloud・未実装ライセンス等の誤認がない。
- [ ] 内部リンク、Storeリンク（発行済みの場合）、問い合わせ窓口、深い404、綴りを確認。
- [ ] PC / mobile、キーボード、visible focus、FAQ、JS無効時の本文、画像alt、contrastを確認。
- [ ] 不要な第三者リクエスト・解析・広告・Cookie・フォームがない。
- [ ] 秘密情報・個人連絡先・住所・認証資格情報・環境変数ファイルを含めない。

検査成功は審査通過や法的適合の保証ではありません。
