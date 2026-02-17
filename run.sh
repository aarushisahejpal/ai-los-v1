#!/bin/bash

# AI Learning Outcomes Generator - Run Script
# Kogod School of Business × Google

echo "🚀 Starting AI Learning Outcomes Generator..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and add your GEMINI_API_KEY"
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "GEMINI_API_KEY=.*[^[:space:]]" .env; then
    echo "⚠️  Warning: GEMINI_API_KEY appears to be empty in .env file"
    echo "Please add your Google Gemini API key to the .env file"
    echo ""
    echo "Get your API key from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Run: python3 setup.py"
    exit 1
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if Flask is installed
if ! python -c "import flask" 2>/dev/null; then
    echo "❌ Flask not installed!"
    echo "Run: pip install -r requirements.txt"
    exit 1
fi

echo "✅ Environment ready!"
echo ""
echo "Starting Flask application..."
echo "Access the app at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the Flask app
python app.py
