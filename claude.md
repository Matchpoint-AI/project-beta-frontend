# Playwright E2E Testing Strategy

## Research Findings and Best Practices

### Overview

This document outlines the comprehensive strategy for implementing Playwright end-to-end tests for the project-beta-frontend application, incorporating best practices from industry research and inspiration from the backend's container-based testing approach.

## Key Design Decisions

### 1. Container-First Testing Architecture

Following the project-beta-api's successful pattern of building Docker images as part of the test process, we will:

- **Build the application Docker image** as part of the E2E test workflow
- **Run tests against the containerized application** to ensure production parity
- **Use Microsoft's official Playwright Docker image** for consistent browser environments

This approach ensures:

- Tests run against the exact same container that would be deployed to production
- Consistency across local development and CI environments
- Early detection of container build issues

### 2. GitHub Actions Integration Strategy

#### Workflow Structure

```yaml
name: E2E Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-app:
    runs-on: ubuntu-latest
    steps:
      - Build application Docker image
      - Save image as artifact

  e2e-tests:
    needs: build-app
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4] # Parallel execution
        browser: [chromium, firefox, webkit]
    container:
      image: mcr.microsoft.com/playwright:v1.55.0-noble
    steps:
      - Load application image
      - Start application container
      - Run Playwright tests
      - Upload artifacts (videos, traces, reports)
```

#### Performance Optimizations

- **Parallel Sharding**: Split tests across multiple runners for faster execution
- **Matrix Strategy**: Test all browsers simultaneously
- **Docker Layer Caching**: Leverage GitHub's native caching for faster builds
- **Selective Test Execution**: Run only affected tests on PRs

### 3. Test Organization and Structure

#### Directory Structure

```
e2e/
├── tests/
│   ├── brand/
│   │   ├── onboarding.spec.ts      # Brand onboarding journey
│   │   ├── settings.spec.ts        # Brand settings management
│   │   └── profile.spec.ts         # Brand profile editing
│   ├── campaign/
│   │   ├── creation.spec.ts        # Campaign creation flow
│   │   ├── management.spec.ts      # Campaign management
│   │   └── publishing.spec.ts      # Content publishing
│   ├── auth/
│   │   ├── login.spec.ts           # Authentication flows
│   │   └── registration.spec.ts    # User registration
│   └── smoke/
│       └── critical-paths.spec.ts  # Critical user journeys
├── fixtures/
│   ├── auth.fixture.ts             # Authentication helpers
│   ├── api.fixture.ts              # API mocking utilities
│   └── test-data.fixture.ts        # Test data generators
├── pages/                          # Page Object Model
│   ├── BrandOnboardingPage.ts
│   ├── CampaignPage.ts
│   └── DashboardPage.ts
├── config/
│   └── playwright.config.ts        # Playwright configuration
└── docker/
    ├── Dockerfile.e2e               # E2E test container
    └── docker-compose.e2e.yml       # Local test environment
```

#### Page Object Model Pattern

```typescript
// pages/BrandOnboardingPage.ts
export class BrandOnboardingPage {
  constructor(private page: Page) {}

  async fillBrandName(name: string) {
    await this.page.fill('[data-testid="brand-name-input"]', name);
  }

  async selectIndustry(industry: string) {
    await this.page.selectOption('[data-testid="industry-select"]', industry);
  }

  async completeOnboarding() {
    // Orchestrate the complete onboarding flow
  }
}
```

### 4. Backend Mocking Strategy

#### API Mocking with Playwright Route Interception

Playwright's powerful route interception allows us to run tests without a real backend, providing:

- **Faster test execution** (no network latency)
- **Predictable test data** (no flaky external dependencies)
- **Offline testing capability**
- **Easy edge case testing** (errors, timeouts, etc.)

#### Implementation Approaches

##### Approach 1: Full Mock Mode (No Backend Required)

```typescript
// fixtures/mock-api.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  mockAPI: async ({ page }, use) => {
    // Mock all API endpoints
    await page.route('**/api/v2/**', async (route) => {
      const url = route.request().url();

      // Brand endpoints
      if (url.includes('/brands')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'brand-123',
            name: 'Test Brand',
            industry: 'Technology',
            onboardingComplete: false,
          }),
        });
      }
      // Campaign endpoints
      else if (url.includes('/campaigns')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'campaign-456',
            brandId: 'brand-123',
            title: 'Summer Campaign',
            status: 'draft',
          }),
        });
      }
      // Default fallback
      else {
        await route.continue();
      }
    });

    await use(page);
  },
});
```

##### Approach 2: HAR File Recording (Record and Replay)

```typescript
// First, record real API responses
await page.routeFromHAR('e2e/fixtures/api-responses.har', {
  url: '**/api/**',
  update: true, // Update HAR file with new responses
});

// Then replay in tests
await page.routeFromHAR('e2e/fixtures/api-responses.har', {
  url: '**/api/**',
});
```

##### Approach 3: Hybrid Mode (Mock Some, Real Others)

```typescript
// fixtures/hybrid-api.fixture.ts
export const hybridTest = test.extend({
  setupAPI: async ({ page }, use) => {
    // Mock external services (e.g., payment, email)
    await page.route('**/stripe.com/**', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ paymentIntent: 'pi_mock_123' }),
      });
    });

    // Mock slow or flaky endpoints
    await page.route('**/api/v2/ai/generate', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          content: 'Mocked AI generated content for faster tests',
        }),
      });
    });

    // Let other requests go through to real backend
    await page.route('**/api/v2/**', (route) => route.continue());

    await use(page);
  },
});
```

#### Mock Data Fixtures

```typescript
// fixtures/mock-data/brands.ts
export const mockBrands = {
  newBrand: {
    id: null,
    name: '',
    industry: '',
    targetAudience: '',
  },

  onboardingBrand: {
    id: 'brand-onboarding-123',
    name: 'Acme Corp',
    industry: 'Technology',
    targetAudience: 'Developers',
    onboardingStep: 2,
    onboardingComplete: false,
  },

  completeBrand: {
    id: 'brand-complete-456',
    name: 'TechStart Inc',
    industry: 'SaaS',
    targetAudience: 'Small Businesses',
    onboardingComplete: true,
    brandVoice: {
      tone: 'Professional yet friendly',
      values: ['Innovation', 'Reliability', 'Customer Success'],
    },
  },
};

// fixtures/mock-data/api-responses.ts
export const apiResponses = {
  brands: {
    list: () => ({
      status: 200,
      body: JSON.stringify({
        brands: [mockBrands.completeBrand],
        total: 1,
      }),
    }),

    create: (data: any) => ({
      status: 201,
      body: JSON.stringify({
        ...mockBrands.onboardingBrand,
        ...data,
        id: `brand-${Date.now()}`,
      }),
    }),

    error: {
      status: 400,
      body: JSON.stringify({
        error: 'Invalid brand data',
        details: ['Name is required'],
      }),
    },
  },
};
```

#### Testing Error Scenarios

```typescript
// tests/brand/error-handling.spec.ts
test('handles API errors gracefully', async ({ page }) => {
  // Mock 500 error
  await page.route('**/api/v2/brands', (route) => {
    route.fulfill({
      status: 500,
      body: 'Internal Server Error',
    });
  });

  await page.goto('/brands/new');
  await page.click('[data-testid="submit-brand"]');

  // Verify error message is shown
  await expect(page.locator('.error-message')).toContainText(
    'Something went wrong. Please try again.'
  );
});

test('handles network timeouts', async ({ page }) => {
  // Simulate timeout
  await page.route('**/api/v2/brands', (route) => {
    // Never respond - triggers timeout
  });

  await page.goto('/brands/new');
  await page.click('[data-testid="submit-brand"]');

  // Verify timeout handling
  await expect(page.locator('.error-message')).toContainText('Request timed out');
});
```

#### Environment-Based Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // Custom option for API mocking
    mockAPI: process.env.MOCK_API === 'true',
  },

  projects: [
    {
      name: 'mocked',
      use: {
        ...devices['Desktop Chrome'],
        mockAPI: true, // Run with mocked backend
      },
    },
    {
      name: 'integration',
      use: {
        ...devices['Desktop Chrome'],
        mockAPI: false, // Run against real backend
      },
    },
  ],
});
```

#### Command Line Usage

```bash
# Run tests with mocked backend (fast, no dependencies)
MOCK_API=true npx playwright test

# Run tests against real backend
MOCK_API=false npx playwright test

# Run specific test configuration
npx playwright test --project=mocked
```

### 5. Test Data Management

#### Strategies

1. **Test Data Isolation**: Each test creates its own data
2. **Mock Data Generators**: Create realistic test data programmatically
3. **Fixture-Based Setup**: Use Playwright fixtures for consistent setup
4. **State Reset**: Clear state between tests for isolation

#### Implementation

```typescript
// fixtures/test-data.fixture.ts
export const testData = {
  generateBrand: () => ({
    name: `Test Brand ${Date.now()}`,
    industry: 'Technology',
    targetAudience: 'Developers',
  }),

  generateCampaign: () => ({
    title: `Campaign ${Date.now()}`,
    objective: 'Brand Awareness',
    budget: 10000,
  }),
};
```

### 6. Video and Artifact Management

#### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    video: 'retain-on-failure', // Only keep videos for failed tests
    trace: 'on-first-retry', // Generate traces on retry
    screenshot: 'only-on-failure', // Screenshots for debugging
  },

  reporter: [
    ['html'], // HTML report
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit.xml' }], // For CI integration
    ['github'], // GitHub Actions annotations
  ],
});
```

#### GitHub Actions Artifact Storage

```yaml
- name: Upload test artifacts
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-results-${{ matrix.shard }}-${{ matrix.browser }}
    path: |
      test-results/
      playwright-report/
      videos/
    retention-days: 30
```

#### Viewing Videos in GitHub Actions

1. **Artifact Download**: Videos are available in the Actions tab under Artifacts
2. **HTML Report with Embedded Videos**: The HTML report includes video playback
3. **PR Comments**: Automated comments with links to failed test videos
4. **Trace Viewer**: Use Playwright's trace viewer for detailed debugging

### 7. Container Testing Strategy

#### Application Container Build

```dockerfile
# Dockerfile (production)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

#### E2E Test Execution

```yaml
# docker-compose.e2e.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:80'
    environment:
      - API_URL=http://api:8080

  api:
    image: project-beta-api:latest
    ports:
      - '8080:8080'

  tests:
    image: mcr.microsoft.com/playwright:v1.55.0-noble
    volumes:
      - ./e2e:/work
    depends_on:
      - app
      - api
    command: npx playwright test
```

### 8. Critical User Stories to Test

Based on the brand onboarding experience requirement, here are the essential user stories:

#### Brand Onboarding Journey

1. **New Brand Registration**
   - User signs up for the platform
   - Creates their first brand
   - Completes brand profile (name, industry, values)
   - Uploads brand assets (logo, colors, fonts)

2. **Brand Voice Configuration**
   - Defines brand personality traits
   - Sets content tone preferences
   - Provides sample content for analysis
   - Reviews AI-generated brand guidelines

3. **Competitor Analysis**
   - Adds competitor information
   - Reviews competitive insights
   - Adjusts brand positioning

4. **Content Generation Test**
   - Creates first campaign
   - Generates sample content
   - Reviews and edits content
   - Approves final version

#### Campaign Management Stories

1. **Campaign Creation**
   - Selects campaign objectives
   - Defines target audience
   - Sets budget and timeline
   - Chooses content types

2. **Content Review and Approval**
   - Reviews generated content
   - Makes edits and refinements
   - Approves for publishing
   - Schedules posts

3. **Multi-Platform Publishing**
   - Connects social media accounts
   - Customizes content per platform
   - Publishes simultaneously
   - Tracks performance

### 9. Local Development Workflow

#### Quick Start for Developers

```bash
# Install Playwright
npm init playwright@latest

# Run tests locally with UI
npx playwright test --ui

# Run specific test file
npx playwright test e2e/tests/brand/onboarding.spec.ts

# Run tests in headed mode for debugging
npx playwright test --headed

# Generate test code with codegen
npx playwright codegen localhost:3000
```

#### Docker-based Local Testing

```bash
# Build and run tests in containers
docker-compose -f docker-compose.e2e.yml up --build

# Run tests against existing containers
docker-compose -f docker-compose.e2e.yml run tests

# Debug with Playwright Inspector
docker-compose -f docker-compose.e2e.yml run tests npx playwright test --debug
```

### 10. CI/CD Integration Best Practices

#### Progressive Testing Strategy

1. **Smoke Tests on Every Push**: Quick validation of critical paths (2-3 min)
2. **Full Suite on PRs**: Complete test coverage before merge (10-15 min)
3. **Extended Tests Nightly**: Including performance and cross-browser tests
4. **Production Smoke Tests**: Post-deployment validation

#### Failure Handling

```yaml
# Automatic retry for flaky tests
- name: Run E2E tests
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 15
    max_attempts: 2
    command: npm run test:e2e

# Slack notification on failure
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'E2E tests failed for ${{ github.sha }}'
```

### 11. Monitoring and Reporting

#### Test Metrics to Track

- **Test Execution Time**: Monitor for performance degradation
- **Flakiness Rate**: Identify and fix unstable tests
- **Coverage**: Ensure all critical paths are tested
- **Failure Patterns**: Analyze common failure points

#### Dashboard Integration

- **GitHub Actions Summary**: Native test result visualization
- **Allure Reports**: Rich test reporting with history
- **Grafana Dashboard**: Real-time test metrics
- **PagerDuty Integration**: Alert on critical test failures

### 12. Security Considerations

#### Best Practices

1. **No Hardcoded Credentials**: Use environment variables and secrets
2. **Secure Test Data**: Sanitize PII in test artifacts
3. **Network Isolation**: Run tests in isolated network segments
4. **Artifact Encryption**: Encrypt sensitive test outputs

#### Implementation

```typescript
// Use GitHub Secrets for sensitive data
const testUser = {
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD,
};

// Sanitize screenshots and videos
await page.evaluate(() => {
  document.querySelectorAll('[data-sensitive]').forEach((el) => {
    el.textContent = '***REDACTED***';
  });
});
```

### 13. Performance Testing Integration

#### Lighthouse Integration

```typescript
test('Brand onboarding page performance', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    return JSON.stringify(performance.getEntriesByType('navigation'));
  });

  const parsed = JSON.parse(metrics);
  expect(parsed[0].loadEventEnd - parsed[0].fetchStart).toBeLessThan(3000);
});
```

#### Load Testing with Artillery

```yaml
# Run after E2E tests pass
- name: Load test critical endpoints
  run: |
    npm run test:load
    artillery run scenarios/brand-onboarding.yml
```

## Implementation Roadmap

### Phase 1: Foundation (Current PR)

- [x] Set up Playwright with TypeScript
- [x] Create basic GitHub Actions workflow
- [x] Implement first brand onboarding test
- [x] Configure video recording and artifacts

### Phase 2: Coverage Expansion

- [ ] Add remaining brand story tests
- [ ] Implement campaign management tests
- [ ] Add authentication flow tests
- [ ] Create reusable fixtures and helpers

### Phase 3: Advanced Features

- [ ] Implement visual regression testing
- [ ] Add performance metrics collection
- [ ] Set up cross-browser testing matrix
- [ ] Create custom test reporters

### Phase 4: Optimization

- [ ] Implement test sharding for parallel execution
- [ ] Add intelligent test selection based on code changes
- [ ] Optimize Docker image sizes
- [ ] Implement test result caching

## Success Metrics

### Key Performance Indicators

- **Test Execution Time**: < 10 minutes for full suite
- **Test Stability**: < 1% flakiness rate
- **Coverage**: 100% of critical user journeys
- **Feedback Time**: < 5 minutes for smoke tests

### Quality Gates

- All tests must pass before merge to main
- No decrease in test coverage
- Performance benchmarks must be maintained
- Security scans must pass

## Maintenance Guidelines

### Test Maintenance

1. **Regular Review**: Monthly review of test effectiveness
2. **Flaky Test Quarantine**: Isolate and fix unstable tests
3. **Test Data Cleanup**: Regular cleanup of test artifacts
4. **Documentation Updates**: Keep test documentation current

### Continuous Improvement

- Collect metrics on test effectiveness
- Regular retrospectives on test failures
- Automate repetitive test maintenance tasks
- Share learnings across teams

## Resources and References

### Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions for Playwright](https://playwright.dev/docs/ci-intro)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Tools and Utilities

- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Allure Report](https://docs.qameta.io/allure/)
- [Artillery Load Testing](https://www.artillery.io/)

### Community Resources

- [Playwright Discord](https://discord.gg/playwright)
- [Playwright GitHub Discussions](https://github.com/microsoft/playwright/discussions)
- [Testing Best Practices](https://testingjavascript.com/)

---

_Last Updated: September 2025_
_Version: 1.0.0_
