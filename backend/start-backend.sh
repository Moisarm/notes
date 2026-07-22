#!/bin/bash
set -e

# Asegura que se ejecute desde la raíz del proyecto
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/backend"

echo "Starting Backend..."
echo ""

if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  bun install
fi

echo "Setting up database with Prisma..."
bun --bun prisma generate
bun --bun prisma db push

echo ""
echo "================================="
echo "Backend running at: http://localhost:3002"
echo "================================="
echo ""

bun run dev