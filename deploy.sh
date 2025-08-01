#!/bin/bash

# Finance GPT Agent Deployment Script

echo "🚀 Starting Finance GPT Agent deployment..."

# Kill any existing processes
echo "🔄 Stopping existing processes..."
pkill -f "node server/server.js" || true

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set environment variables (you can modify these as needed)
export PORT=3001
export NODE_ENV=production

# Start the server
echo "🌟 Starting server on port $PORT..."
node server/server.js