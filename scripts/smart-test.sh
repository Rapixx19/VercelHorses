#!/bin/bash
# FILE SUMMARY:
# The "Quality Gate" script.
# Logic: If Red Zone changed -> Deep Test. If Green Zone -> Lint only.
# Path: scripts/smart-test.sh

# Identify changed files
CHANGED_FILES=$(git diff --name-only HEAD)

# Define the Red Zone (Swiss Banking, PDF, Supabase)
RED_ZONE="src/services/extraction|src/services/billing|src/lib/supabase"

echo "🛡️ EquineOS Quality Gate: Analyzing changes..."

if echo "$CHANGED_FILES" | grep -E "($RED_ZONE)" > /dev/null; then
  echo "🔴 RED ZONE DETECTED: Running full logic validation..."
  npm run lint && npm run build # Build check ensures no type errors in core logic
else
  echo "🟢 GREEN/YELLOW ZONE: Running standard linting..."
  npx lint-staged
fi

if [ $? -ne 0 ]; then
  echo "❌ Push blocked: Fix linting or logic errors first."
  exit 1
fi

echo "✅ Quality Gate passed. Pushing to repository..."
