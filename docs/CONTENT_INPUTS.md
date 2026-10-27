# 公開前に確定する情報

対象：GridPorter 0.4.2 beta。現在は有料販売を行いません。

- [ ] 正式βサイト `https://ray-dev-lab.github.io/gridporter-site/` のPages配信とHTTPSを確認。
- [ ] `assets/site-config.js` のsiteUrlが上記URLと一致することを確認。GridPorter 0.4.2 betaではGitHub Pages標準URLを正式サイトとして使用し、独自ドメインは有料化・正式ブランド展開時に再検討する。
- [ ] 公開窓口のsupportEmailを設定し、実際の受信・返信を確認。個人用メールを推測して設定しない。
- [ ] Publisher name / 運営主体と必要な表示情報を確定し、Privacy・Termsに反映。Git Authorから法的な運営主体を推測しない。
- [ ] 問い合わせ用Gmail・非共有Drive・運営者端末の実運用、保持・削除、外部通知の内容をPrivacyと照合。原文・添付・返信下書きには自動削除日数を設定したと記載しない。
- [ ] 本体PR #3の最新headで0.4.2 manifestを読取り確認済み。Merge後の実配布ビルド・対応コミット・CWS申告を人間が最終照合する。Free 2,000行 / Recipe 1、Pro 20,000行 / Recipe件数制限なし。
- [ ] Dataset / Snapshot / Recipe / checkpoint / session / ローカル利用カウンターの保存先、保持、削除範囲を確認。
- [ ] Local-first、元サイトへの通常通信、support bundleの明示共有をStore申告・掲載説明・拡張UIと一致させる。
- [ ] Privacyを人間が確認してprivacyReviewedをtrueにする。
- [ ] Termsの運営者・準拠法・裁判管轄・免責等を人間が確定してtermsReviewedをtrueにする。
- [ ] Support窓口・対応方法・情報の共有範囲を確認してsupportReviewedをtrueにする。
- [ ] CWS提出用実スクリーンショットを別途準備・確認する。サイトRepositoryへのcommitは必須ではない。サイトに掲載する場合のみ配置・登録。
- [ ] 正式なChrome Web Store URLが発行されたら設定。未発行なら空のままでCTA非表示。
- [ ] `node scripts/sync-metadata.mjs` でcanonical / OG / 404を反映し、公開ページで確認。
- [ ] `python scripts/check-site.py --release` でサイトの公開準備を確認し、CWSの画像等の提出資産は別に確認する。
- [ ] ContactSupporter PR #1のMerge、本番prefix設定、受入試験を行う。最新PRでfail-closed受付を読取り確認済みだが、未導入を導入済みとは扱わない。prefixなしでもGmail受信自体を拒否するという案内にしない。

siteUrlは正式βサイトのURL、supportEmailは `raydevsupport@gmail.com` を設定済みです。メールの受信・返信は別途確認してください。supportUrl、chromeWebStoreUrl、実画像は未設定です。Privacy / Terms / Supportの最終確認フラグはfalseです。架空情報は公開ページに表示しません。

将来の販売事業者情報・価格・支払・提供・更新・解約・返金は別途決定し、[販売表示テンプレート](COMMERCIAL_DISCLOSURE_TEMPLATE.md)を利用してください。現在は購入ボタンを設置しません。
