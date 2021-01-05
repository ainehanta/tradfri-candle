# tradfri candle

tradfri gw 経由でいい感じにろうそくっぽくチラつかせるスクリプト

## setup

1. node 12 以上をインストール
2. このリポジトリをクローン
3. `npm i`
4. 認証情報を取得する
   - `SECRET_CODE="YOUR_SECRET_CODE" node dist/auth.js`
5. 電球の ID を取得する
   - `node dist/list.js`
6. 起動する
   - `IDS="[電球のID1, 電球のID2, 電球のIDn]" node dist/index.js`
