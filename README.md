# Web Test Automation Framework

This is a test automation framework built using Playwright with TypeScript. The framework is designed to run web UI tests in parallel and serial modes.

## Getting Started

### Prerequisites

The following software are required:

- nodejs : Download and Install Node JS from
  ```sh
  https://nodejs.org/en/download/
  ```
  
### Installation

1. Clone the repo using below URL

```sh
https://github.com/rrrishi123/web-test
```

2. Navigate to folder and install npm packages using:

```sh
npm install
```
3. For first time installation run below command to download required browsers

```sh
npx playwright install
```
4. For MAC and Ubuntu OS before running please exexute below code as per your environment qa|dev
```sh
export npm_config_ENV="qa"
```

## Framework Structure
```
├── lib/                     # Common libraries and utilities
├── logs/                    # Test execution logs
├── pageFactory/             # Page Objects
├── tests/                   # Test files
└── playwright-report/       # HTML test reports
```
## Running Tests
The framework provides multiple ways to run tests:

Run Single Test File:
```sh
npm run test:single         # Runs searchTest.spec.ts
npm run test:single2        # Runs searchHistoryTest.spec.ts
```

Run All Tests with @Smoke Tag:
```sh
npm run test:parallel       # Runs in parallel mode
npm run test:serial         # Runs in serial mode with --workers=1
```

Run Tests in UI Mode:
```sh
npm run test:ui            # Opens Playwright UI Mode
```

## Test Reports
After test execution, you can find the reports in:
- HTML Report: playwright-report/index.html
- Test Logs: logs/info.log

## Configurations
The framework uses following configuration files:
- playwright.config.ts: Playwright specific configurations
- testConfig.ts: Test environment configurations
- CustomReporterConfig.ts: Custom test reporting configurations

## Tags
- Tests can be tagged for different execution strategies:
  - @Smoke: For smoke test suite

## Key Features
- Page Object Model Design Pattern
- Custom HTML Reporter
- Parallel Test Execution
- Environment Based Configuration
- Custom Logger Implementation
- Type Safety with TypeScript

## Dependencies
Key dependencies include:
- @playwright/test
- typescript
- winston (for logging)
- Various ESLint plugins for code quality
