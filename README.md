以下が日本語訳です：

---

# 案件管理システム（Project Management System）

Node.js、Express、PostgreSQL、Prisma ORM を使用した、取引先・連絡先と紐づいた案件（オポチュニティ）を管理するためのポータブルな業務管理システムです。

## 特長

* **リレーショナルデータ管理**：取引先・連絡先・案件を外部キーで正しく関連付けて管理
* **RESTful API**：すべてのエンティティに対する完全な CRUD 操作を提供
* **Web インターフェース**：シンプルな HTML/JavaScript フロントエンドでデータを操作可能
* **ポータブル**：ベンダー固有の依存なし。Docker で任意の VPS 上で動作
* **PostgreSQL 使用**：Prisma ORM を使用した本番環境対応のリレーショナルデータベース

## データベーススキーマ

```sql
-- 取引先（Accounts）
CREATE TABLE accounts (
  account_id UUID PRIMARY KEY,
  account_name TEXT NOT NULL
);

-- 連絡先（Contacts）
CREATE TABLE contacts (
  contact_id UUID PRIMARY KEY,
  contact_name TEXT NOT NULL,
  account_id UUID REFERENCES accounts(account_id)
);

-- 案件（Opportunities）
CREATE TABLE anken (
  anken_id UUID PRIMARY KEY,
  anken_name TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(contact_id),
  -- 追加項目...
  created_at DATE,
  updated_at TIMESTAMP
);
```

## Docker によるクイックスタート

1. **リポジトリをクローンして Docker Compose で起動：**

   ```bash
   git clone <repository>
   cd anken-management
   docker-compose up -d
   ```

2. **アプリケーションにアクセス：**

   * Web インターフェース: [http://localhost:3000](http://localhost:3000)
   * API: [http://localhost:3000/api/](http://localhost:3000/api/)

## ローカル開発環境のセットアップ

1. **前提条件：**

   * Node.js 18 以上
   * PostgreSQL 12 以上

2. **依存関係のインストール：**

   ```bash
   npm install
   ```

3. **環境変数の設定：**

   ```bash
   cp .env.example .env
   # .env を開いて、データベース URL を記述
   ```

4. **データベースのセットアップ：**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **開発用サーバーを起動：**

   ```bash
   npm run dev
   ```

## API エンドポイント

### 取引先（Accounts）

* `GET /api/accounts` - すべての取引先一覧
* `POST /api/accounts` - 取引先の新規作成

### 連絡先（Contacts）

* `GET /api/contacts` - 取引先情報付きの連絡先一覧
* `POST /api/contacts` - 連絡先の新規作成

### 案件（Opportunities）

* `GET /api/anken` - 案件一覧（連絡先・取引先名付き）
* `GET /api/anken/:id` - 単一の案件情報取得
* `POST /api/anken` - 案件の新規作成
* `PUT /api/anken/:id` - 案件の更新
* `DELETE /api/anken/:id` - 案件の削除

## API レスポンス形式

案件情報のレスポンスには関連データが含まれます：

```json
{
  "anken_id": "uuid",
  "anken_name": "プロジェクト名",
  "contact_id": "uuid",
  "contact_name": "田中太郎",
  "account_name": "株式会社サンプル",
  "status_code": 2,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "price": "¥1,000,000"
}
```

## 環境変数

* `DATABASE_URL` - PostgreSQL の接続文字列
* `PORT` - サーバーのポート番号（デフォルト：3000）
* `NODE_ENV` - 実行環境（development / production）

## プロジェクト構成

```
├── src/
│   ├── server.js          # Express サーバー
│   └── db.js              # Prisma クライアント
├── prisma/
│   └── schema.prisma      # データベーススキーマ
├── public/
│   └── index.html         # フロントエンド
├── docker-compose.yml     # Docker 設定
├── Dockerfile             # コンテナ定義
└── README.md
```

## スクリプト

* `npm start` - 本番用サーバーの起動
* `npm run dev` - nodemon による開発用サーバーの起動
* `npx prisma generate` - Prisma クライアントの生成
* `npx prisma db push` - データベースへのスキーマ反映
* `npx prisma studio` - データベースブラウザの起動

## デプロイ

### Docker を使った VPS へのデプロイ

1. **ファイルを VPS にコピー：**

   ```bash
   scp -r . user@your-vps:/path/to/app
   ```

2. **サービス起動：**

   ```bash
   docker-compose up -d
   ```

3. **ステータス確認：**

   ```bash
   docker-compose ps
   docker-compose logs app
   ```

### 手動での VPS デプロイ

1. **VPS に Node.js と PostgreSQL をインストール**

2. **データベースのセットアップ：**

   ```sql
   CREATE DATABASE anken_db;
   CREATE USER anken_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE anken_db TO anken_user;
   ```

3. **アプリのデプロイ：**

   ```bash
   npm ci --production
   npx prisma generate
   npx prisma db push
   npm start
   ```

## セキュリティ上の注意

* 本番環境ではデフォルトの DB 認証情報を変更
* 機密情報は環境変数で管理
* 本番環境では DB 接続に SSL を有効化
* Web インターフェースに認証機能の導入を検討

## ライセンス

MIT License
