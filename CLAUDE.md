# Claude AI Assistant Configuration

## Semantic Versioning Guidelines

This repository uses automated semantic versioning triggered by commits to the main branch. Understanding and following these conventions is critical for proper version management.

### Version Format

Versions follow the format: `v{major}.{minor}.{patch}`

### Triggering Version Changes

The automated versioning system responds to specific keywords in commit messages:

1. **Major Version Increment (Breaking Changes)**
   - Include the exact string `(MAJOR)` in your commit message
   - Use for: Breaking API changes, major architectural shifts, incompatible changes
   - Example: `Refactor API endpoints (MAJOR)`
   - Version change: `v1.2.3` → `v2.0.0`

2. **Minor Version Increment (New Features)**
   - Include the exact string `(MINOR)` in your commit message
   - Use for: New features, non-breaking enhancements, significant additions
   - Example: `Add user authentication feature (MINOR)`
   - Version change: `v1.2.3` → `v1.3.0`

3. **Patch Version Increment (Bug Fixes)**
   - Default behavior when no keywords are present
   - Use for: Bug fixes, documentation, refactoring, small improvements
   - Example: `Fix navigation menu alignment`
   - Version change: `v1.2.3` → `v1.2.4`

### PR Title and Description Best Practices

When creating pull requests:

1. **PR Titles**: Keep them descriptive but avoid version keywords unless intentional
   - Good: `Add user profile management feature`
   - Avoid: `Add feature (MINOR)` (save keywords for the squash commit)

2. **PR Descriptions**: Document changes thoroughly but be careful with keyword usage
   - Describe what changed and why
   - List breaking changes explicitly
   - Avoid accidental keyword triggers in descriptions

3. **Squash Merge Commits**: This is where version keywords belong
   - The squash commit message is what triggers versioning
   - Include the appropriate keyword based on the changes
   - GitHub uses PR title as default squash message, so update it during merge if needed

### Examples of Proper Usage

#### Breaking Change Example

```
PR Title: Restructure API response format
Squash Commit: Restructure API response format (MAJOR)
```

#### New Feature Example

```
PR Title: Implement dark mode theme
Squash Commit: Implement dark mode theme (MINOR)
```

#### Bug Fix Example

```
PR Title: Resolve dropdown menu z-index issue
Squash Commit: Resolve dropdown menu z-index issue
```

### Important Reminders

- Version keywords are case-sensitive and must include parentheses
- Keywords only work in the actual commit message to main branch
- PR descriptions and comments don't trigger versioning
- When in doubt, omit keywords to default to patch increment
- Review the squash commit message before merging to ensure correct versioning

### Workflow Location

The semantic versioning workflow is defined in `.github/workflows/set-version.yaml`

## Project Quick Facts

- **Repository**: project-beta-frontend
- **Primary Language**: TypeScript/JavaScript
- **Framework**: React
- **Build System**: npm
- **CI/CD**: GitHub Actions
- **Versioning**: Automated semantic versioning on main branch
- **Testing Framework**: Vitest (unit tests), Playwright (E2E tests)

## Code Quality Guidelines

### Pre-Pull Request Checklist

Before creating a pull request, ensure your code meets the following standards:

1. **Code Formatting**: Run prettier to format all code

   ```bash
   npm run format
   ```

   This prevents GitHub Actions lint failures and ensures consistent code style.

2. **Linting**: Check for and fix any linting issues

   ```bash
   npm run lint
   ```

3. **Type Checking**: Ensure TypeScript types are correct

   ```bash
   npm run type-check
   ```

4. **Tests**: Run all tests to ensure nothing is broken
   ```bash
   npm test
   ```

### CRITICAL: Run Tests Locally Before Pushing

**Always run the complete test suite locally before pushing to remote:**

```bash
# Run all tests with coverage
npm test

# If tests are interactive/watching, run once with:
npm test -- --run

# Also verify the build succeeds
npm run build
```

**Why this is critical:**

- GitHub Actions will fail if tests don't pass
- Failed CI checks block PR merging
- Local testing catches issues faster than waiting for CI
- Prevents wasted CI minutes and multiple fix commits

**Test Troubleshooting:**

- If tests fail with missing dependencies, check that all imports are correct
- For "multiple elements found" errors, ensure proper test cleanup with `afterEach(cleanup)`
- Mock external dependencies properly in test files
- Check that all relative import paths are correct for the current file structure

### Test Writing Guidelines

All tests in this project **MUST** follow the AAA (Arrange-Act-Assert) pattern for clarity and maintainability:

#### AAA Pattern Structure

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange - Set up test data, mocks, and initial state
    const mockData = { id: 1, name: 'Test' };
    const mockCallback = vi.fn(); // Note: Use vi.fn() for Vitest, not jest.fn()

    // Act - Execute the action being tested
    const result = render(<Component data={mockData} onClick={mockCallback} />);
    fireEvent.click(screen.getByRole('button'));

    // Assert - Verify the expected outcome
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

#### AAA Pattern Requirements

1. **Clear Section Separation**: Use blank lines to separate Arrange, Act, and Assert sections
2. **Comments**: Add `// Arrange`, `// Act`, and `// Assert` comments for complex tests
3. **Single Responsibility**: Each test should test one specific behavior
4. **Descriptive Names**: Test names should clearly describe what is being tested
5. **Minimal Arrange**: Keep setup code focused on what's needed for the specific test

#### Example Test Following AAA Pattern

```typescript
describe('UserProfile', () => {
  it('should display user name when data is loaded', async () => {
    // Arrange
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    };
    const mockFetch = vi.fn().mockResolvedValue(mockUser); // Use vi.fn() for Vitest

    // Act
    render(<UserProfile userId="123" fetchUser={mockFetch} />);
    await waitFor(() => screen.getByText('John Doe'));

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('123');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should show error message when fetch fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    const mockFetch = vi.fn().mockRejectedValue(mockError); // Use vi.fn() for Vitest

    // Act
    render(<UserProfile userId="123" fetchUser={mockFetch} />);
    await waitFor(() => screen.getByText('Error loading profile'));

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('123');
    expect(screen.getByText('Error loading profile')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
```

#### Benefits of AAA Pattern

- **Readability**: Tests are easy to understand at a glance
- **Maintainability**: Clear structure makes tests easier to update
- **Debugging**: Failures are easier to diagnose when sections are clear
- **Consistency**: All tests follow the same pattern across the codebase
- **Documentation**: Tests serve as living documentation of component behavior

### Important Notes

- The CI pipeline will automatically check formatting, linting, types, and tests
- Pull requests with formatting issues will fail the `format-check` and `lint` GitHub Actions
- Always run `npm run format` before committing to avoid CI failures

## Project Structure Guidelines

### Testing Approach

This project follows a **test collocation** approach for better maintainability:

- **Test files are placed in the same directory as the component or module they are testing**
- **Naming Convention**: Test files use `.test.ts` or `.test.tsx` suffix (e.g., `MyComponent.tsx` → `MyComponent.test.tsx`)
- **Benefits**: Easy to locate tests, encourages keeping tests up-to-date, cleaner relative imports

### Recommended Project Structure

For scalability and maintainability, this project should follow a **feature-based structure**:

```
src/
├── app/                    # App-level configuration
│   ├── App.tsx
│   ├── App.css
│   ├── AppRoutes.tsx
│   └── index.tsx
├── features/              # Feature-based organization
│   ├── auth/
│   │   ├── components/    # Feature-specific components
│   │   ├── context/       # Feature-specific context
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── api/           # Feature-specific API calls
│   │   ├── utils/         # Feature-specific utilities
│   │   └── pages/         # Feature pages/routes
│   ├── campaign/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── utils/
│   │   └── pages/
│   ├── dashboard/
│   │   └── ...
│   └── [other-features]/
├── shared/                # Shared across features
│   ├── components/
│   │   ├── ui/           # Generic UI components
│   │   ├── buttons/      # Reusable buttons
│   │   ├── inputs/       # Reusable inputs
│   │   ├── layout/       # Layout components
│   │   └── feedback/     # Feedback components
│   ├── hooks/            # Shared hooks
│   └── utils/            # Shared utilities
├── api/                  # Global API configuration
├── types/                # Global TypeScript types
├── lib/                  # External library configurations
└── pages/                # Standalone pages (privacy, terms, etc.)
```

### Structure Principles

1. **Feature Isolation**: Each feature is self-contained with its own components, hooks, and logic
2. **Clear Boundaries**: Shared components are clearly separated from feature-specific ones
3. **Scalability**: Easy to add new features without cluttering existing directories
4. **Maintainability**: Related files are co-located for easier debugging and development
5. **Test Collocation**: Tests remain next to their components within each feature

### Feature Folder Contents

Each feature folder should contain:

- `components/` - UI components specific to this feature
- `hooks/` - Custom hooks for this feature
- `api/` - API calls and data fetching logic
- `utils/` - Helper functions and utilities
- `context/` - React context providers if needed
- `pages/` - Route components for this feature
- `types/` - TypeScript types specific to this feature (optional)

### Import Guidelines

- Use absolute imports from `src/` for cleaner import statements
- Create barrel exports (`index.ts`) in feature folders for clean public APIs
- Avoid circular dependencies between features
- Shared components should not import from features

### When to Create a New Feature

Create a new feature folder when:

- You have a distinct business domain or user flow
- The functionality requires multiple components and supporting files
- The code is cohesive and changes together
- It represents a clear boundary in your application

### Migration Strategy

When restructuring existing code:

1. Start with one feature at a time
2. Update all import statements
3. Run tests to ensure nothing breaks
4. Update any documentation
5. Consider adding path aliases in TypeScript config

## Playwright E2E Testing Strategy

### Overview

The project uses Playwright for end-to-end testing with a container-first approach, ensuring production parity and consistent test environments.

### Key Testing Principles

1. **Container-First Architecture**: Build and test against Docker images matching production
2. **Parallel Execution**: Use sharding and matrix strategies for faster test runs
3. **Mock-First Development**: Use Playwright's route interception for predictable, fast tests
4. **Progressive Testing**: Validation → Unit Tests → Build → E2E Tests (fail-fast approach)

### Test Organization

```
e2e/
├── tests/
│   ├── brand/           # Brand-related tests
│   ├── campaign/        # Campaign management tests
│   ├── auth/            # Authentication flows
│   └── smoke/           # Critical path tests
├── fixtures/            # Test helpers and utilities
├── pages/               # Page Object Model
└── config/              # Playwright configuration
```

### Running Tests

```bash
# Run tests with UI
npx playwright test --ui

# Run specific test file
npx playwright test e2e/tests/brand/onboarding.spec.ts

# Run tests in headed mode for debugging
npx playwright test --headed

# Generate test code
npx playwright codegen localhost:3000
```

### Backend Mocking

Tests can run in three modes:

1. **Full Mock Mode**: No backend required, all API calls mocked
2. **HAR Recording**: Record and replay real API responses
3. **Hybrid Mode**: Mock external services, use real backend for core APIs

```bash
# Run with mocked backend
MOCK_API=true npx playwright test

# Run against real backend
MOCK_API=false npx playwright test
```

### CI/CD Integration

Tests run automatically on:

- Every push to main (smoke tests)
- Pull requests (full suite)
- Nightly builds (extended cross-browser tests)

The workflow follows a fail-fast approach:

1. Format/Lint/Type checks (~2 min)
2. Unit tests (~3 min)
3. Docker build (~5 min)
4. E2E tests (~15 min)

### Test Artifacts

Failed tests automatically capture:

- Videos (retain-on-failure)
- Screenshots (only-on-failure)
- Traces (on-first-retry)
- HTML reports with embedded media

Artifacts are uploaded to GitHub Actions and retained for 30 days.
