#!/bin/bash

# E2E Health Check Test Script
# Tests basic application availability and health
set -euo pipefail

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
TIMEOUT=60
RETRY_INTERVAL=2
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

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

# Test application root endpoint
test_app_root() {
    log_info "Testing application root: GET ${APP_URL}"
    
    local response
    local http_code
    
    # Make request and capture both response and HTTP code
    response=$(curl -s -w "\n%{http_code}" --max-time 10 "${APP_URL}" 2>&1 || echo "CURL_ERROR")
    
    if [[ "$response" == "CURL_ERROR" ]]; then
        log_error "Failed to connect to application"
        return 1
    fi
    
    # Extract HTTP code (last line) and body (everything before)
    http_code=$(echo "$response" | tail -n1)
    
    log_info "HTTP Status: $http_code"
    
    # Validate HTTP status code (200 or 3xx redirect)
    if [[ "$http_code" =~ ^[23][0-9][0-9]$ ]]; then
        log_info "✅ Application root endpoint is accessible"
        return 0
    else
        log_error "Expected HTTP 2xx or 3xx, got $http_code"
        return 1
    fi
}

# Test application loads basic React elements
test_react_app_loads() {
    log_info "Testing React app loads with basic elements"
    
    local response
    local http_code
    
    response=$(curl -s -w "\n%{http_code}" --max-time 15 "${APP_URL}" 2>&1 || echo "CURL_ERROR")
    
    if [[ "$response" == "CURL_ERROR" ]]; then
        log_error "Failed to connect to application"
        return 1
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check for React app indicators (case insensitive)
    if echo "$body" | grep -qi "<!doctype html>"; then
        log_info "✅ HTML document structure found"
    else
        log_error "No HTML document structure found"
        return 1
    fi
    
    if echo "$body" | grep -q "root\|app"; then
        log_info "✅ React root element or app container found"
    else
        log_warn "React root element not clearly visible (might be SPA)"
    fi
    
    log_info "✅ React application appears to be loading properly"
    return 0
}

# Test with invalid routes
test_404_handling() {
    log_info "Testing 404 handling: GET ${APP_URL}/this-route-should-not-exist"
    
    local response
    local http_code
    
    response=$(curl -s -w "\n%{http_code}" --max-time 10 "${APP_URL}/this-route-should-not-exist" 2>&1 || echo "CURL_ERROR")
    
    if [[ "$response" == "CURL_ERROR" ]]; then
        log_error "Failed to connect to application"
        return 1
    fi
    
    http_code=$(echo "$response" | tail -n1)
    
    log_info "HTTP Status: $http_code"
    
    # For SPAs, 404s might return 200 with client-side routing
    if [[ "$http_code" == "200" || "$http_code" == "404" ]]; then
        log_info "✅ Invalid routes handled appropriately (Status: $http_code)"
        return 0
    else
        log_warn "Unexpected status for invalid route: $http_code"
        return 0  # Don't fail on this, just warn
    fi
}

# Test basic performance
test_basic_performance() {
    log_info "Testing basic application performance"
    
    local start_time
    local end_time
    local duration
    
    start_time=$(date +%s.%N)
    
    if curl -s --max-time 20 "${APP_URL}" >/dev/null 2>&1; then
        end_time=$(date +%s.%N)
        duration=$(echo "$end_time - $start_time" | bc)
        
        log_info "Application response time: ${duration}s"
        
        # Warn if response is slow (>10 seconds)
        if (( $(echo "$duration > 10" | bc -l) )); then
            log_warn "Application response time is slow: ${duration}s"
        else
            log_info "✅ Application response time is acceptable"
        fi
        
        return 0
    else
        log_error "Application performance test failed - timeout"
        return 1
    fi
}

# Main test execution
main() {
    log_info "Starting E2E Health Check Tests"
    log_info "Target Application: ${APP_URL}"
    
    # Wait for application to be available
    if ! wait_for_app; then
        log_error "❌ Health check tests failed - Application not available"
        exit 1
    fi
    
    # Run health tests
    local failed_tests=0
    
    if ! test_app_root; then
        failed_tests=$((failed_tests + 1))
    fi
    
    if ! test_react_app_loads; then
        failed_tests=$((failed_tests + 1))
    fi
    
    if ! test_404_handling; then
        failed_tests=$((failed_tests + 1))
    fi
    
    if ! test_basic_performance; then
        failed_tests=$((failed_tests + 1))
    fi
    
    # Summary
    if [[ $failed_tests -eq 0 ]]; then
        log_info "🎉 All health check tests passed!"
        log_info "✅ Application is ready for E2E testing"
        exit 0
    else
        log_error "❌ $failed_tests health check test(s) failed"
        exit 1
    fi
}

# Check dependencies
check_dependencies() {
    local missing_deps=()
    
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    if ! command -v bc &> /dev/null; then
        missing_deps+=("bc")
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