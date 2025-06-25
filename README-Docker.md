# Docker 環境での案件管理システム

## 概要

この案件管理システムはDockerとDocker Composeを使用して簡単にデプロイできます。PostgreSQLデータベースとNode.jsアプリケーションがコンテナ化されており、個人VPSでの運用に最適化されています。

## 必要な環境

- Docker Engine 20.10+
- Docker Compose v2.0+
- 最低2GB RAM
- 10GB以上の空きディスク容量

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd anken-management-system
```

### 2. 環境変数の設定

`.env`ファイルを作成してデータベース設定を行います：

```bash
cp .env.example .env
```

### 3. Docker Composeでアプリケーション起動

```bash
# バックグラウンドで起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

### 4. データベースの初期化

初回起動時、Prismaマイグレーションが自動実行されます。

### 5. アプリケーションへのアクセス

ブラウザで `http://localhost:5000` にアクセスしてください。

## コマンド一覧

### アプリケーション管理

```bash
# 起動
docker-compose up -d

# 停止
docker-compose down

# 再起動
docker-compose restart

# ログ確認
docker-compose logs -f app

# コンテナ状態確認
docker-compose ps
```

### データベース管理

```bash
# データベースコンテナに接続
docker-compose exec db psql -U anken_user -d anken_management

# データベースバックアップ
docker-compose exec db pg_dump -U anken_user anken_management > backup.sql

# データベースリストア
docker-compose exec -T db psql -U anken_user anken_management < backup.sql
```

### 開発・メンテナンス

```bash
# アプリケーションコンテナに接続
docker-compose exec app sh

# Prismaマイグレーション実行
docker-compose exec app npx prisma migrate deploy

# データベースリセット（注意：全データ削除）
docker-compose exec app npx prisma migrate reset --force
```

## ディレクトリ構造

```
.
├── docker-compose.yml      # Docker Compose設定
├── Dockerfile             # アプリケーションコンテナ設定
├── docker-entrypoint.sh   # 起動スクリプト
├── .dockerignore          # Docker除外ファイル
├── server-new.js          # メインアプリケーション
├── prisma/                # データベーススキーマ
├── public/                # 静的ファイル
└── README-Docker.md       # このファイル
```

## 本番環境での運用

### セキュリティ設定

1. **パスワード変更**: `docker-compose.yml`のデータベースパスワードを変更
2. **ポート制限**: 必要に応じて`5432`ポートの外部公開を停止
3. **SSL証明書**: リバースプロキシ（Nginx等）でHTTPS化

### パフォーマンス最適化

```yaml
# docker-compose.yml に追加
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
  db:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

### バックアップ戦略

```bash
# 日次バックアップスクリプト例
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U anken_user anken_management | gzip > backup_${DATE}.sql.gz
find . -name "backup_*.sql.gz" -mtime +7 -delete
```

## トラブルシューティング

### よくある問題

1. **ポート競合**: `docker-compose ps`で確認、競合する場合はポートを変更
2. **データベース接続エラー**: `docker-compose logs db`でPostgreSQLログを確認
3. **権限エラー**: `docker-compose down -v`でボリューム削除後、再起動

### ログ確認

```bash
# アプリケーションログ
docker-compose logs app

# データベースログ
docker-compose logs db

# 全サービスログ
docker-compose logs
```

## 停止・削除

```bash
# 停止
docker-compose down

# データも含めて完全削除
docker-compose down -v
docker system prune -a
```