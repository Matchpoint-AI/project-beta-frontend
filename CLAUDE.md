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