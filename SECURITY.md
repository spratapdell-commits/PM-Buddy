# PM Buddy - Security Hardening Checklist

This document outlines the essential security measures to be implemented and verified before deploying the PM Buddy application to a production environment.

## 1. Data Validation & Sanitization

-   [ ] **Input Validation:** All user-supplied data (forms, API inputs, URL parameters) must be strictly validated on the backend against an expected format, type, and range.
-   [ ] **Output Encoding:** All data rendered in the UI must be contextually encoded to prevent Cross-Site Scripting (XSS). Use React's built-in JSX encoding and avoid using `dangerouslySetInnerHTML`.
-   [ ] **API Parameter Validation:** Ensure API endpoints reject requests with unexpected or malformed parameters. Use a schema validation library (e.g., Zod, Joi) on the backend.

## 2. Authentication & Session Management

-   [ ] **Strong Password Policies:** Enforce minimum password length, complexity, and disallow common passwords.
-   [ ] **Secure Credential Storage:** Passwords must be hashed using a strong, salted, adaptive algorithm (e.g., Argon2, bcrypt).
-   [ ] **Session Security:**
    -   Use secure, HTTPOnly, SameSite cookies for session tokens.
    -   Implement session timeouts (both idle and absolute).
    -   Provide a secure "log out" feature that invalidates the session on the server side.
-   [ ] **Rate Limiting:** Apply rate limiting to authentication endpoints (login, password reset, registration) to protect against brute-force attacks.

## 3. Access Control (Authorization)

-   [ ] **Principle of Least Privilege:** Users should only have the minimum permissions necessary to perform their roles (Admin, Member, Viewer).
-   [ ] **Enforce Backend Authorization:** Every API endpoint that accesses or modifies a resource must verify that the authenticated user has the required permissions to perform that action on that specific resource. Do not rely on the client-side UI to hide or show links.
-   [ ] **Secure Direct Object References:** Do not use guessable, sequential IDs in URLs where not necessary. For sensitive data, use non-sequential identifiers (e.g., UUIDs) and always check ownership/permissions on the backend.

## 4. API & Communication Security

-   [ ] **HTTPS Enforcement:** The entire application must be served over TLS 1.2 or higher. Configure HTTP Strict Transport Security (HSTS) headers.
-   [ ] **CORS Policy:** Configure a strict Cross-Origin Resource Sharing (CORS) policy on the backend to only allow requests from known frontend origins.
-   [ ] **Secret Management:**
    -   **NEVER** commit secrets (API keys, database credentials, tokens) to the Git repository.
    -   Use a dedicated secret management service (e.g., AWS Secrets Manager, HashiCorp Vault, Google Secret Manager) or environment variables injected at build/runtime.
    -   Code should reference secrets like this: `// SECRET: Add to env or secret manager`

## 5. Dependency & Environment Security

-   [ ] **Dependency Scanning:** Integrate a tool like `npm audit`, Snyk, or GitHub Dependabot into the CI/CD pipeline to automatically scan for vulnerabilities in third-party packages.
-   [ ] **Regular Updates:** Keep all dependencies, server software, and base container images regularly updated to patch known vulnerabilities.
-   [ ] **Content Security Policy (CSP):** Implement a strict CSP header to mitigate XSS and data injection attacks by specifying which domains the browser should consider to be valid sources of executable scripts.

## 6. Monitoring & Logging

-   [ ] **Audit Logs:** Ensure comprehensive audit logs are generated for security-sensitive events (e.g., login success/failure, permission changes, data deletion).
-   [ ] **Security Alerting:** Configure alerts for suspicious activities, such as multiple failed login attempts from a single IP, or attempts to access unauthorized resources.
