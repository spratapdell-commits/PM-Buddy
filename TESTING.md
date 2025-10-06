# PM Buddy - Testing Strategy

This document outlines the testing strategy for the PM Buddy application, covering unit tests, integration tests, and end-to-end (E2E) tests.

## 1. Unit Tests (Jest & React Testing Library)

Unit tests focus on individual components and functions in isolation.

-   **Goal:** Achieve >80% code coverage for critical utility functions and complex components.
-   **Location:** `*.test.ts` or `*.test.tsx` files co-located with the source files.
-   **Key Scenarios:**
    -   **Ranking Logic:** Test the `getRankBetween` utility with various inputs (e.g., start, end, middle, rebalancing cases).
    -   **Rule Engine:** Test the `runSimulation` function with different issue states and rule conditions to verify correct evaluation.
    -   **Data Transformations:** Test functions that aggregate or transform data for charts (e.g., `calculateThroughput`, `calculateLeadTime`).
    -   **Component Rendering:** Test that components render correctly based on different props (e.g., a `Card` component showing the 'blocked' state).
    -   **OAuth Callbacks:** Test the (simulated) OAuth callback handlers with mock provider responses to ensure they correctly identify or link user accounts.

## 2. End-to-End (E2E) Tests (Cypress)

E2E tests simulate real user workflows from start to finish in a browser-like environment.

-   **Goal:** Cover all critical user paths to prevent regressions in core functionality.
-   **Location:** A dedicated `/cypress` directory.
-   **Key Scenarios:**
    -   **Authentication:**
        -   A user can log in with an email/password.
        -   An unauthenticated user trying to access a protected page is redirected to login and then back to the original page after logging in.
        -   A user clicks "Login with Google", simulates the OAuth callback, and is redirected to the dashboard.
        -   A logged-in user navigates to settings and successfully links their GitHub account.
    -   **Board Interaction:**
        -   A user can drag an issue from "To Do" to "In Progress". The UI should update optimistically, an API call should be made, and the change should persist on reload.
        -   Dragging an issue to a column that is at its WIP limit should fail, show a notification, and the UI should roll back to its original state.
    -   **Issue Creation & Planning:**
        -   A user can create a new issue using the AI (Gemini) input.
        -   A user can create a new issue from the backlog, drag it to re-prioritize it, and then drag it into a planned sprint.
    -   **Dashboards & Reports:**
        -   A user can add a "My Work" widget to their dashboard, and it should display their assigned issues.
        -   A user navigates to the Reports page, switches to the Burndown chart tab, and the chart renders with data.
        -   A user clicks on a data point in the Velocity chart, and a drill-down modal appears with the relevant issues.
    -   **Releases & Pipeline:**
        -   A user can create a new release.
        -   A user can generate release notes for that release.
        -   A user can click "Promote" and a simulated CI webhook updates the environment status in the UI.

## 3. CI/CD Pipeline Configuration (Sample `ci.yaml`)

This sample pipeline runs on every pull request to the `main` branch, gating merges on successful tests.

```yaml
# .github/workflows/ci.yaml
name: PM Buddy CI

on:
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Run E2E tests
        run: npm run cypress:run
```
