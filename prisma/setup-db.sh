#!/bin/bash

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name initial_migration

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Seed database with initial data
echo "Seeding database..."
npm run seed

echo "Database setup complete!" 