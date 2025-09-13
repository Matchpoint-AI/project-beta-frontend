#!/bin/bash

# E2E Playwright All Tests Script
# Runs complete Playwright test suite with video recording and artifact collection
set -euo pipefail

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
TIMEOUT=300
RETRY_INTERVAL=5
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BROWSER="${BROWSER:-chromium}"
WORKERS="${WORKERS:-1}"
RETRIES="${RETRIES:-2}"

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

# Install Playwright browsers
install_playwright_browsers() {
    log_info "Installing Playwright browsers for $BROWSER"
    
    # Install specific browser or all browsers
    if [ "$BROWSER" = "all" ]; then
        if ! npx playwright install --with-deps; then
            log_error "Failed to install all Playwright browsers"
            return 1
        fi
    else
        if ! npx playwright install "$BROWSER" --with-deps; then
            log_error "Failed to install Playwright browser: $BROWSER"
            return 1
        fi
    fi
    
    log_info "Playwright browsers installed successfully"
}

# Setup test environment and directories
setup_test_environment() {
    log_info "Setting up test environment"
    
    # Clean previous test results
    if [ -d "${PROJECT_ROOT}/test-results" ]; then
        log_info "Cleaning previous test results"
        rm -rf "${PROJECT_ROOT}/test-results"
    fi
    
    if [ -d "${PROJECT_ROOT}/playwright-report" ]; then
        rm -rf "${PROJECT_ROOT}/playwright-report"
    fi
    
    # Create output directories
    mkdir -p "${PROJECT_ROOT}/test-results/videos"
    mkdir -p "${PROJECT_ROOT}/test-results/screenshots"
    mkdir -p "${PROJECT_ROOT}/test-results/traces"
    
    # Set environment variables for test execution
    export BASE_URL="$APP_URL"
    export CI="true"
    export MOCK_API="true"
    export PLAYWRIGHT_VIDEO_DIR="${PROJECT_ROOT}/test-results/videos"
    export PLAYWRIGHT_SCREENSHOT_DIR="${PROJECT_ROOT}/test-results/screenshots"
    
    log_info "Test environment configured"
}

# Run all Playwright tests
run_all_playwright_tests() {
    log_info "Running complete Playwright test suite"
    log_info "Browser: $BROWSER | Workers: $WORKERS | Retries: $RETRIES"
    
    local playwright_cmd="npx playwright test"
    local cmd_args=(
        "--project=$BROWSER"
        "--workers=$WORKERS" 
        "--retries=$RETRIES"
        "--reporter=json,html,github"
        "--output=${PROJECT_ROOT}/test-results"
        "--timeout=60000"
    )
    
    # Add sharding if in CI
    if [ "${CI:-false}" = "true" ] && [ -n "${SHARD:-}" ]; then
        cmd_args+=("--shard=$SHARD")
        log_info "Running with shard: $SHARD"
    fi
    
    log_info "Executing: $playwright_cmd ${cmd_args[*]}"
    
    if $playwright_cmd "${cmd_args[@]}"; then
        log_info "✅ All Playwright tests passed"
        return 0
    else
        log_error "❌ Some Playwright tests failed"
        return 1
    fi
}

# Run specific test suites
run_smoke_tests() {
    log_info "Running smoke tests only"
    
    export BASE_URL="$APP_URL"
    export MOCK_API="true"
    
    if npx playwright test \
        --grep="@smoke" \
        --project="$BROWSER" \
        --workers="$WORKERS" \
        --retries="$RETRIES" \
        --reporter=json,html,github \
        --output="${PROJECT_ROOT}/test-results" \
        --timeout=30000; then
        log_info "✅ Smoke tests passed"
        return 0
    else
        log_error "❌ Smoke tests failed"
        return 1
    fi
}

# Check and report on generated artifacts
check_artifacts() {
    log_info "Checking generated test artifacts..."
    
    local artifacts_found=0
    local total_videos=0
    local total_screenshots=0
    local total_traces=0
    
    # Check videos
    if [ -d "${PROJECT_ROOT}/test-results" ]; then
        total_videos=$(find "${PROJECT_ROOT}/test-results" -name "*.webm" -o -name "*.mp4" | wc -l)
        if [ "$total_videos" -gt 0 ]; then
            log_info "✅ Found $total_videos video recording(s)"
            artifacts_found=$((artifacts_found + 1))
        fi
    fi
    
    # Check screenshots
    if [ -d "${PROJECT_ROOT}/test-results" ]; then
        total_screenshots=$(find "${PROJECT_ROOT}/test-results" -name "*.png" -o -name "*.jpg" | wc -l)
        if [ "$total_screenshots" -gt 0 ]; then
            log_info "✅ Found $total_screenshots screenshot(s)"
            artifacts_found=$((artifacts_found + 1))
        fi
    fi
    
    # Check traces
    if [ -d "${PROJECT_ROOT}/test-results" ]; then
        total_traces=$(find "${PROJECT_ROOT}/test-results" -name "*.zip" | wc -l)
        if [ "$total_traces" -gt 0 ]; then
            log_info "✅ Found $total_traces trace file(s)"
            artifacts_found=$((artifacts_found + 1))
        fi
    fi
    
    # Check HTML report
    if [ -f "${PROJECT_ROOT}/playwright-report/index.html" ]; then
        log_info "✅ HTML report generated at playwright-report/index.html"
        artifacts_found=$((artifacts_found + 1))
    fi
    
    # Check JSON results
    if [ -f "${PROJECT_ROOT}/test-results/results.json" ]; then
        log_info "✅ JSON results available at test-results/results.json"
        artifacts_found=$((artifacts_found + 1))
    fi
    
    log_info "Artifacts summary: Videos=$total_videos, Screenshots=$total_screenshots, Traces=$total_traces"
    
    if [ $artifacts_found -gt 0 ]; then
        log_info "📹 Test artifacts are ready for review and upload"
        return 0
    else
        log_warn "⚠️  No test artifacts were generated"
        return 1
    fi
}

# Display test results summary
display_results_summary() {
    if [ -f "${PROJECT_ROOT}/test-results/results.json" ]; then
        log_info "Test Results Summary:"
        
        # Extract test counts from JSON results (requires jq)
        if command -v jq &> /dev/null; then
            local total_tests passed_tests failed_tests
            total_tests=$(jq -r '.suites | map(.specs | length) | add' "${PROJECT_ROOT}/test-results/results.json" 2>/dev/null || echo "unknown")
            passed_tests=$(jq -r '.suites | map(.specs | map(select(.ok == true)) | length) | add' "${PROJECT_ROOT}/test-results/results.json" 2>/dev/null || echo "unknown")
            failed_tests=$(jq -r '.suites | map(.specs | map(select(.ok == false)) | length) | add' "${PROJECT_ROOT}/test-results/results.json" 2>/dev/null || echo "unknown")
            
            log_info "  Total Tests: $total_tests"
            log_info "  Passed: $passed_tests"
            log_info "  Failed: $failed_tests"
        fi
    fi
}

# Main test execution
main() {
    local test_mode="${1:-all}"
    
    log_info "Starting E2E Playwright Tests"
    log_info "Mode: $test_mode | Target: ${APP_URL} | Browser: $BROWSER"
    log_info "Project Root: ${PROJECT_ROOT}"
    
    # Setup
    setup_test_environment
    
    # Install browsers
    if ! install_playwright_browsers; then
        log_error "❌ E2E tests failed - Could not install Playwright browsers"
        exit 1
    fi
    
    # Wait for application
    if ! wait_for_app; then
        log_error "❌ E2E tests failed - Application not available"
        exit 1
    fi
    
    # Run tests based on mode
    local test_result=0
    
    case "$test_mode" in
        "smoke")
            if ! run_smoke_tests; then
                test_result=1
            fi
            ;;
        "all"|*)
            if ! run_all_playwright_tests; then
                test_result=1
            fi
            ;;
    esac
    
    # Check artifacts
    if ! check_artifacts; then
        log_warn "Some artifacts may be missing, but this won't fail the build"
    fi
    
    # Display summary
    display_results_summary
    
    # Final result
    if [ $test_result -eq 0 ]; then
        log_info "🎉 E2E Playwright tests completed successfully!"
        log_info "📹 Video recordings and artifacts are available for review"
        exit 0
    else
        log_error "❌ E2E Playwright tests failed"
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
    
    # Warn if jq is missing (for results parsing)
    if ! command -v jq &> /dev/null; then
        log_warn "jq not available - test result parsing will be limited"
    fi
}

# Print usage information
usage() {
    cat << EOF
Usage: $0 [MODE]

MODE:
    all     Run all Playwright tests (default)
    smoke   Run only smoke tests (@smoke tagged)

Environment Variables:
    APP_URL     Application URL (default: http://localhost:3000)
    BROWSER     Browser to test (default: chromium)
    WORKERS     Number of parallel workers (default: 1)
    RETRIES     Number of test retries (default: 2)
    SHARD       Shard specification for parallel CI runs
    
Examples:
    $0                    # Run all tests
    $0 smoke              # Run smoke tests only
    BROWSER=firefox $0    # Run with Firefox
    
EOF
}

# Handle help flag
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    usage
    exit 0
fi

# Run dependency check and main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    check_dependencies
    main "$@"
fi