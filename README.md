# 案件管理システム (Project Management System)

A portable business management system for managing opportunities (案件) with linked contacts and accounts using Node.js, Express, PostgreSQL, and Prisma ORM.

## Features

- **Relational Data Management**: Manage accounts, contacts, and opportunities with proper foreign key relationships
- **RESTful API**: Complete CRUD operations for all entities
- **Web Interface**: Simple HTML/JavaScript frontend for data management
- **Portable**: No vendor-specific dependencies, runs on any VPS with Docker
- **PostgreSQL**: Production-ready relational database with Prisma ORM

## Database Schema

```sql
-- Accounts (取引先)
CREATE TABLE accounts (
  account_id UUID PRIMARY KEY,
  account_name TEXT NOT NULL
);

-- Contacts (連絡先)
CREATE TABLE contacts (
  contact_id UUID PRIMARY KEY,
  contact_name TEXT NOT NULL,
  account_id UUID REFERENCES accounts(account_id)
);

-- Opportunities (案件)
CREATE TABLE anken (
  anken_id UUID PRIMARY KEY,
  anken_name TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(contact_id),
  -- Additional fields...
  created_at DATE,
  updated_at TIMESTAMP
);
```

## Quick Start with Docker

1. **Clone and start with Docker Compose:**
   ```bash
   git clone <repository>
   cd anken-management
   docker-compose up -d
   ```

2. **Access the application:**
   - Web Interface: http://localhost:3000
   - API: http://localhost:3000/api/

## Local Development Setup

1. **Prerequisites:**
   - Node.js 18+
   - PostgreSQL 12+

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Accounts (取引先)
- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create account

### Contacts (連絡先)
- `GET /api/contacts` - List all contacts with account info
- `POST /api/contacts` - Create contact

### Opportunities (案件)
- `GET /api/anken` - List all opportunities with contact and account names
- `GET /api/anken/:id` - Get single opportunity
- `POST /api/anken` - Create opportunity
- `PUT /api/anken/:id` - Update opportunity
- `DELETE /api/anken/:id` - Delete opportunity

## API Response Format

Opportunity responses include related data:

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

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
├── src/
│   ├── server.js          # Express server
│   └── db.js              # Prisma client
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── index.html         # Frontend
├── docker-compose.yml     # Docker setup
├── Dockerfile            # Container definition
└── README.md
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open database browser

## Deployment

### VPS Deployment with Docker

1. **Copy files to VPS:**
   ```bash
   scp -r . user@your-vps:/path/to/app
   ```

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

3. **Check status:**
   ```bash
   docker-compose ps
   docker-compose logs app
   ```

### Manual VPS Deployment

1. **Install Node.js and PostgreSQL on VPS**

2. **Setup database:**
   ```sql
   CREATE DATABASE anken_db;
   CREATE USER anken_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE anken_db TO anken_user;
   ```

3. **Deploy application:**
   ```bash
   npm ci --production
   npx prisma generate
   npx prisma db push
   npm start
   ```

## Security Notes

- Change default database credentials in production
- Use environment variables for sensitive data
- Enable SSL for database connections in production
- Consider implementing authentication for the web interface

## License

MIT License