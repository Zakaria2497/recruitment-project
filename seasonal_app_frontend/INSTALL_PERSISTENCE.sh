#!/bin/bash

echo "========================================="
echo "Installing Redux Persist for State Management"
echo "========================================="
echo ""

# Change to frontend directory
cd "$(dirname "$0")"

echo "Current directory: $(pwd)"
echo ""

# Install redux-persist
echo "📦 Installing redux-persist..."
npm install redux-persist

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Restart your development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser and test:"
echo "   - Fill out a form"
echo "   - Refresh the page"
echo "   - Data should be preserved!"
echo ""
echo "3. (Optional) Clear old localStorage data:"
echo "   Open DevTools → Console → Run:"
echo "   localStorage.clear()"
echo ""
echo "========================================="
echo "For more info, see STATE_PERSISTENCE_FIX.md"
echo "========================================="

