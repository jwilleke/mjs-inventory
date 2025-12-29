#!/bin/bash

# Home Inventory App - Quick Start Script
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   Home Inventory Management System - Quick Start      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Create data directory
if [ ! -d "data" ]; then
    mkdir -p data
    echo "✅ Created data directory"
else
    echo "✅ Data directory exists"
fi
echo ""

# Copy example env file if .env doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "✅ .env file exists"
fi
echo ""

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   Setup Complete!                                      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "To start the application:"
echo "  npm start          - Production mode"
echo "  npm run dev        - Development mode (auto-reload)"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Optional: Load example data"
echo "  curl -X POST http://localhost:3000/api/import \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d @example-data.json"
echo ""
