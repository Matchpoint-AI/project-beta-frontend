#!/bin/bash

# E2E Brand Onboarding Test Script
# Tests the complete brand onboarding flow with video recording
set -euo pipefail

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
TIMEOUT=300
RETRY_INTERVAL=5
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VIDEO_OUTPUT_DIR="${PROJECT_ROOT}/test-results/videos"
SCREENSHOT_OUTPUT_DIR="${PROJECT_ROOT}/test-results/screenshots"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Change to project root
cd "$PROJECT_ROOT"

# Wait for application to be ready
wait_for_app() {
    log_info "Waiting for application to be ready at ${APP_URL}"
    local attempts=0
    local max_attempts=$((TIMEOUT / RETRY_INTERVAL))
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -s --max-time 10 "${APP_URL}" >/dev/null 2>&1; then
            log_info "Application is ready after $((attempts * RETRY_INTERVAL)) seconds"
            return 0
        fi
        
        attempts=$((attempts + 1))
        log_info "Attempt $attempts/$max_attempts - Application not ready, waiting ${RETRY_INTERVAL}s..."
        sleep $RETRY_INTERVAL
    done
    
    log_error "Application failed to become ready within ${TIMEOUT} seconds"
    return 1
}

# Install Playwright browsers if needed
install_playwright_browsers() {
    log_info "Installing Playwright browsers..."
    if ! npx playwright install chromium --with-deps; then
        log_error "Failed to install Playwright browsers"
        return 1
    fi
    log_info "Playwright browsers installed successfully"
}

# Create output directories
setup_output_directories() {
    log_info "Setting up output directories"
    mkdir -p "$VIDEO_OUTPUT_DIR"
    mkdir -p "$SCREENSHOT_OUTPUT_DIR"
    mkdir -p "${PROJECT_ROOT}/test-results/traces"
}

# Run brand onboarding e2e tests
run_brand_onboarding_tests() {
    log_info "Running brand onboarding E2E tests with video recording"
    
    local test_file="e2e/brand/onboarding.spec.ts"
    local failed_tests=0
    
    # Set environment variables for video recording
    export BASE_URL="$APP_URL"
    export CI="true"
    export MOCK_API="true"
    
    # Run the specific brand onboarding test with video recording
    log_info "Executing: npx playwright test $test_file --project=chromium --reporter=json,html,github"
    
    if ! npx playwright test "$test_file" \
        --project=chromium \
        --reporter=json,html,github \
        --output="${PROJECT_ROOT}/test-results" \
        --timeout=60000; then
        log_error "Brand onboarding tests failed"
        failed_tests=$((failed_tests + 1))
    else
        log_info "✅ Brand onboarding tests passed"
    fi
    
    return $failed_tests
}

# Run smoke tests
run_smoke_tests() {
    log_info "Running smoke tests with video recording"
    
    local failed_tests=0
    
    # Set environment variables
    export BASE_URL="$APP_URL"
    export MOCK_API="true"
    
    # Run smoke tests (tests tagged with @smoke)
    log_info "Executing: npx playwright test --grep=@smoke --project=chromium"
    
    if ! npx playwright test \
        --grep="@smoke" \
        --project=chromium \
        --reporter=json,html,github \
        --output="${PROJECT_ROOT}/test-results" \
        --timeout=30000; then
        log_error "Smoke tests failed"
        failed_tests=$((failed_tests + 1))
    else
        log_info "✅ Smoke tests passed"
    fi
    
    return $failed_tests
}

# Check for test artifacts
check_artifacts() {
    log_info "Checking for test artifacts..."
    
    local artifacts_found=0
    
    # Check for videos
    if [ -d "$VIDEO_OUTPUT_DIR" ] && [ -n "$(find "$VIDEO_OUTPUT_DIR" -name "*.webm" -o -name "*.mp4" 2>/dev/null)" ]; then
        log_info "✅ Video recordings found in $VIDEO_OUTPUT_DIR"
        ls -la "$VIDEO_OUTPUT_DIR"/*.{webm,mp4} 2>/dev/null || true
        artifacts_found=$((artifacts_found + 1))
    else
        log_warn "No video recordings found in $VIDEO_OUTPUT_DIR"
    fi
    
    # Check for screenshots
    if [ -d "$SCREENSHOT_OUTPUT_DIR" ] && [ -n "$(find "$SCREENSHOT_OUTPUT_DIR" -name "*.png" 2>/dev/null)" ]; then
        log_info "✅ Screenshots found in $SCREENSHOT_OUTPUT_DIR"
        ls -la "$SCREENSHOT_OUTPUT_DIR"/*.png 2>/dev/null || true
        artifacts_found=$((artifacts_found + 1))
    else
        log_warn "No screenshots found in $SCREENSHOT_OUTPUT_DIR"
    fi
    
    # Check for HTML report
    if [ -f "${PROJECT_ROOT}/playwright-report/index.html" ]; then
        log_info "✅ HTML report generated at playwright-report/index.html"
        artifacts_found=$((artifacts_found + 1))
    else
        log_warn "No HTML report found"
    fi
    
    if [ $artifacts_found -gt 0 ]; then
        log_info "Test artifacts are available for review"
        return 0
    else
        log_error "No test artifacts were generated"
        return 1
    fi
}

# Main test execution
main() {
    log_info "Starting E2E Brand Onboarding Tests"
    log_info "Target Application: ${APP_URL}"
    log_info "Project Root: ${PROJECT_ROOT}"
    
    # Setup
    setup_output_directories
    
    # Install Playwright browsers
    if ! install_playwright_browsers; then
        log_error "❌ E2E tests failed - Could not install Playwright browsers"
        exit 1
    fi
    
    # Wait for application to be available
    if ! wait_for_app; then
        log_error "❌ E2E tests failed - Application not available"
        exit 1
    fi
    
    # Run tests
    local total_failed=0
    
    # Run smoke tests first (quick validation)
    if ! run_smoke_tests; then
        total_failed=$((total_failed + 1))
    fi
    
    # Run brand onboarding tests
    if ! run_brand_onboarding_tests; then
        total_failed=$((total_failed + 1))
    fi
    
    # Check artifacts were generated
    if ! check_artifacts; then
        log_error "❌ Test artifacts were not generated properly"
        total_failed=$((total_failed + 1))
    fi
    
    # Summary
    if [ $total_failed -eq 0 ]; then
        log_info "🎉 All E2E brand onboarding tests passed!"
        log_info "📹 Video recordings and artifacts are available for review"
        exit 0
    else
        log_error "❌ $total_failed E2E test suite(s) failed"
        log_info "📹 Check video recordings and artifacts for debugging"
        exit 1
    fi
}

# Check dependencies
check_dependencies() {
    local missing_deps=()
    
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    if ! command -v npx &> /dev/null; then
        missing_deps+=("npx")
    fi
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        exit 1
    fi
}

# Run dependency check and main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_dependencies
    main "$@"
fi