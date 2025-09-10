# End-to-End Tests with Playwright

This directory contains end-to-end tests for the project-beta-frontend application using Playwright.

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for containerized testing)

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

#### Local Development

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# Generate test code with Codegen
npm run test:e2e:codegen
```

#### With Docker

```bash
# Build and run tests in containers
docker-compose -f docker-compose.e2e.yml up --build

# Run tests against existing containers
docker-compose -f docker-compose.e2e.yml run tests
```

#### With Mocked API

```bash
# Run tests with mocked backend (no real API needed)
MOCK_API=true npm run test:e2e
```

## Test Structure

```
e2e/
├── tests/                   # Test specifications
│   ├── brand/               # Brand-related tests
│   │   └── onboarding.spec.ts
│   ├── campaign/            # Campaign tests
│   └── auth/                # Authentication tests
├── fixtures/                # Test fixtures and helpers
│   ├── mock-api.fixture.ts # API mocking setup
│   └── mock-data/           # Mock data definitions
│       ├── brands.ts
│       └── api-responses.ts
├── pages/                   # Page Object Models
│   └── BrandOnboardingPage.ts
└── README.md
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures/mock-api.fixture';
import { BrandOnboardingPage } from '../pages/BrandOnboardingPage';

test.describe('Feature Name', () => {
  test('should do something', async ({ mockAPI }) => {
    // Arrange
    const page = new BrandOnboardingPage(mockAPI);

    // Act
    await page.goto();
    await page.fillBrandName('Test Brand');

    // Assert
    await expect(page.brandNameInput).toHaveValue('Test Brand');
  });
});
```

### Page Object Model

Create reusable page objects for better maintainability:

```typescript
export class MyPage {
  constructor(private page: Page) {}

  async fillForm(data: FormData) {
    await this.page.fill('[data-testid="input"]', data.value);
  }
}
```

### API Mocking

Mock API responses for predictable testing:

```typescript
await page.route('**/api/brands', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ id: '123', name: 'Test' }),
  });
});
```

## Best Practices

1. **Use data-testid attributes** for reliable element selection
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Keep tests independent** - each test should run in isolation
4. **Use Page Object Model** for reusable components
5. **Mock external dependencies** for faster, more reliable tests
6. **Add meaningful test descriptions** for better reporting
7. **Group related tests** using `test.describe()`
8. **Use fixtures** for common setup and teardown

## Configuration

See `playwright.config.ts` for test configuration options:

- **Browsers**: Chromium, Firefox, WebKit
- **Viewport**: Desktop and mobile
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry
- **Parallel execution**: With sharding

## CI/CD Integration

Tests run automatically in GitHub Actions on:

- Push to main branch
- Pull requests

The CI workflow includes:

- Building application Docker image
- Running tests in parallel across browsers
- Uploading test artifacts (reports, videos, screenshots)
- Commenting PR with results

## Debugging

### View Test Reports

```bash
# After running tests, open HTML report
npx playwright show-report
```

### Debug Specific Test

```bash
# Debug a single test file
npx playwright test e2e/tests/brand/onboarding.spec.ts --debug

# Debug with specific project (browser)
npx playwright test --project=chromium --debug
```

### View Trace Files

```bash
# Open trace viewer
npx playwright show-trace trace.zip
```

## Troubleshooting

### Common Issues

1. **Browser not installed**

   ```bash
   npx playwright install
   ```

2. **Port already in use**
   - Kill existing process or change port in config

3. **Tests timing out**
   - Increase timeout in playwright.config.ts
   - Check if app is running

4. **Flaky tests**
   - Add proper waits: `await page.waitForLoadState('networkidle')`
   - Use retries in config

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)
