#!/bin/bash

echo "🚀 Starting InvestSmart AI Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment file..."
    cp .env.example .env
    echo "✅ Created .env file with demo settings"
    echo ""
fi

echo "🔧 Starting backend server..."
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "🌐 Starting frontend client..."
echo ""
echo "📱 Opening browser windows:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:3000"
echo ""
echo "💡 To stop the application, press Ctrl+C"
echo ""

# Start the client
npm run client &
CLIENT_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    pkill -f "live-server" 2>/dev/null
    pkill -f "node server/server.js" 2>/dev/null
    echo "✅ Services stopped. Goodbye!"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait