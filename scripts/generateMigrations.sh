#!/bin/sh

echo "Generating SQLite migrations..."
DB_TYPE=sqlite npx drizzle-kit generate

echo ""
echo "Generating PostgreSQL migrations..."
DB_TYPE=postgres npx drizzle-kit generate

echo ""
echo "Done. Migrations generated in drizzle/sqlite/ and drizzle/pg/"
