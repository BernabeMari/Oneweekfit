#!/bin/bash

# OneWeekFit Installation Script

echo "=== OneWeekFit Installation ==="
echo "This script will set up the OneWeekFit application."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v14 or higher and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d '.' -f 1)
if [ "$NODE_MAJOR" -lt 14 ]; then
    echo "Node.js version $NODE_VERSION detected. Please upgrade to Node.js v14 or higher."
    exit 1
fi

echo "Node.js v$NODE_VERSION detected."
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "PORT=3000" > .env
    echo "GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE" >> .env
    echo ""
    echo "IMPORTANT: You need to add your Gemini API key to the .env file."
    echo "Edit the .env file and replace YOUR_GEMINI_API_KEY_HERE with your actual key."
fi

echo ""
echo "=== Installation complete! ==="
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To start the production server, run:"
echo "  npm start"
echo ""
echo "Access the application at: http://localhost:3000"
echo "" 