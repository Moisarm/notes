#!/bin/bash
set -e

echo "Starting Notes App..."
echo ""

# Setup backend
echo "Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  bun install
fi

echo "Setting up database with Prisma..."
bun --bun prisma generate
bun --bun prisma db push

echo "Starting backend on port 3002..."
bun run dev &
BACKEND_PID=$!

cd ..

# Setup frontend
echo "Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

echo "Starting frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "================================="
echo "Notes App started successfully!"
echo "Backend: http://localhost:3002"
echo "Frontend: http://localhost:5173"
echo "================================="
echo ""
echo "Press Ctrl+C to stop the servers"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
