#!/bin/bash

# Script to run E2E tests with artifact collection for local debugging

set -e

echo "🎭 Running Playwright E2E Tests with Artifact Collection"
echo "========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create artifacts directory
ARTIFACTS_DIR="e2e-artifacts-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$ARTIFACTS_DIR"

# Run tests with video recording enabled
echo -e "${YELLOW}Running E2E tests with video recording...${NC}"
npx playwright test \
  --reporter=html,line,json \
  --output="$ARTIFACTS_DIR" \
  || TEST_FAILED=true

# Copy test results
if [ -d "test-results" ]; then
  echo -e "${YELLOW}Copying test results...${NC}"
  cp -r test-results/* "$ARTIFACTS_DIR/" 2>/dev/null || true
fi

# Copy HTML report
if [ -d "playwright-report" ]; then
  echo -e "${YELLOW}Copying HTML report...${NC}"
  cp -r playwright-report "$ARTIFACTS_DIR/html-report" 2>/dev/null || true
fi

# Generate summary
echo -e "\n${GREEN}Test Artifacts Summary:${NC}"
echo "========================"

# Count videos
VIDEO_COUNT=$(find "$ARTIFACTS_DIR" -name "*.webm" -o -name "*.mp4" 2>/dev/null | wc -l)
echo "📹 Videos: $VIDEO_COUNT"

# Count screenshots
SCREENSHOT_COUNT=$(find "$ARTIFACTS_DIR" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" 2>/dev/null | wc -l)
echo "📸 Screenshots: $SCREENSHOT_COUNT"

# Count trace files
TRACE_COUNT=$(find "$ARTIFACTS_DIR" -name "*.zip" 2>/dev/null | wc -l)
echo "📊 Traces: $TRACE_COUNT"

echo -e "\n${GREEN}Artifacts saved to: $ARTIFACTS_DIR${NC}"

# Open HTML report if available
if [ -d "$ARTIFACTS_DIR/html-report" ]; then
  echo -e "${YELLOW}Opening HTML report...${NC}"
  npx playwright show-report "$ARTIFACTS_DIR/html-report" &
fi

# Exit with appropriate code
if [ "$TEST_FAILED" = true ]; then
  echo -e "\n${RED}❌ Some tests failed. Check artifacts for details.${NC}"
  exit 1
else
  echo -e "\n${GREEN}✅ All tests passed!${NC}"
  exit 0
fi