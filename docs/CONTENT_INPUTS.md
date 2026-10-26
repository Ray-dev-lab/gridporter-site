# 公開前に確定する情報

対象：GridPorter 0.4.1 beta。現在は有料販売を行いません。

- [ ] 正式βサイト `https://ray-dev-lab.github.io/gridporter-site/` のPages配信とHTTPSを確認。
- [ ] `assets/site-config.js` のsiteUrlが上記URLと一致することを確認。GridPorter 0.4.1 betaではGitHub Pages標準URLを正式サイトとして使用し、独自ドメインは有料化・正式ブランド展開時に再検討する。
- [ ] 公開窓口のsupportEmailを設定し、実際の受信・返信を確認。個人用メールを推測して設定しない。
- [ ] Publisher name / 運営主体と必要な表示情報を確定し、Privacy・Termsに反映。Git Authorから法的な運営主体を推測しない。
- [ ] 問い合わせで受信した情報の保存先・保持期間・削除依頼・処理事業者等を確定しPrivacyへ反映。
- [ ] 本体main・実配布ビルド・version・Free/Proを最終照合。参照時点は0.4.1 beta、Free 2,000行 / Recipe 1、Pro 20,000行 / Recipe件数制限なし。
- [ ] Dataset / Snapshot / Recipe / checkpoint / session / ローカル利用カウンターの保存先、保持、削除範囲を確認。
- [ ] Local-first、元サイトへの通常通信、support bundleの明示共有をStore申告・掲載説明・拡張UIと一致させる。
- [ ] Privacyを人間が確認してprivacyReviewedをtrueにする。
- [ ] Termsの運営者・準拠法・裁判管轄・免責等を人間が確定してtermsReviewedをtrueにする。
- [ ] Support窓口・対応方法・情報の共有範囲を確認してsupportReviewedをtrueにする。
- [ ] 機密情報や第三者の権利を確認した実スクリーンショットを配置・登録。
- [ ] 正式なChrome Web Store URLが発行されたら設定。未発行なら空のままでCTA非表示。
- [ ] `node scripts/sync-metadata.mjs` でcanonical / OG / 404を反映し、公開ページで確認。
- [ ] `python scripts/check-site.py --release` を実行し、CWS提出前の必須条件を満たす。

siteUrlは正式βサイトのURLを設定済みです。supportEmail、supportUrl、chromeWebStoreUrl、実画像は未設定です。Privacy / Terms / Supportの最終確認フラグはfalseです。架空情報は公開ページに表示しません。

将来の販売事業者情報・価格・支払・提供・更新・解約・返金は別途決定し、[販売表示テンプレート](COMMERCIAL_DISCLOSURE_TEMPLATE.md)を利用してください。現在は購入ボタンを設置しません。
