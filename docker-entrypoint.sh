#!/bin/sh

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -p 5432 -U anken_user; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready - executing command"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
exec node server-new.js