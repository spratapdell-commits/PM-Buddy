# PM Buddy - Deployment & Rollback Runbook

This document provides a standard operating procedure for deploying new versions of the PM Buddy application and rolling back if necessary.

## 1. Pre-Deployment Checklist

-   [ ] All code changes have been reviewed and approved via pull request.
-   [ ] All CI checks (linting, unit tests, E2E tests) have passed on the release commit.
-   [ ] Database migration scripts have been written and tested in a staging environment.
-   [ ] A snapshot or backup of the production database has been taken.
-   [ ] The release has been tagged in Git (e.g., `v1.1.0`).

## 2. Deployment Strategy: Blue-Green

A blue-green deployment strategy is recommended to minimize downtime and risk.

1.  **Provision Green Environment:** Spin up a new, identical set of production infrastructure (servers, containers) for the "green" environment.
2.  **Deploy New Version:** Deploy the new version of the application to the green environment.
3.  **Run Migrations:** Run the database migration scripts against the production database. These scripts must be backward-compatible so the "blue" (old) version can still function.
4.  **Test Green:** Run smoke tests against the green environment to ensure it's healthy and operating correctly.
5.  **Switch Traffic:** Update the load balancer or DNS to route all incoming traffic from the blue environment to the green environment.
6.  **Monitor:** Closely monitor application logs, error rates, and performance metrics for any anomalies after the switch.
7.  **Decommission Blue:** Once confident in the new version's stability (e.g., after 1-2 hours of monitoring), decommission the old blue environment.

## 3. Rollback Procedure

If a critical issue is discovered after deployment, follow this procedure to roll back to the previous version.

1.  **Immediate Action:** Switch traffic at the load balancer/DNS level back to the old "blue" environment (which was kept running). This is a near-instantaneous rollback of the application code.
2.  **Database Rollback:**
    -   **CRITICAL:** This is the most complex step. If the migrations were not fully backward-compatible, a database rollback is necessary.
    -   Restore the database from the pre-deployment snapshot/backup taken in Step 1. This will result in data loss for any writes that occurred after the backup was taken.
    -   If migrations were backward-compatible, this step may not be needed, but a thorough assessment is required.
3.  **Post-Mortem:** Conduct a post-mortem to understand the cause of the failure and improve the deployment process.

## 4. Database Backup & Restore

-   **Backup Strategy:** Configure automated, daily snapshots of the production database. Retain backups for at least 30 days.
-   **Restore Drill:** Regularly practice restoring backups in a staging environment to ensure the process works and to document the time it takes.

## 5. Migrating from JIRA to PM Buddy (Sample Notes)

A migration script will be needed to transfer data from JIRA. This script would use the JIRA REST API.

**Data Mapping:**

| JIRA Field         | PM Buddy Field | Notes                                                                   |
| ------------------ | -------------- | ----------------------------------------------------------------------- |
| `key`              | `key`          | Direct mapping.                                                         |
| `fields.summary`   | `summary`      | Direct mapping.                                                         |
| `fields.description` | `description`  | JIRA's ADF (Atlassian Document Format) needs to be converted to Markdown. |
| `fields.issuetype.name` | `type`         | Map names: e.g., "Story" -> `IssueType.STORY`.                        |
| `fields.status.name` | `status`       | Map status names to PM Buddy column titles. A custom mapping UI may be needed. |
| `fields.assignee`  | `assignees`    | Map JIRA user accounts to PM Buddy users via email address.             |
| `fields.customfield_10016` (Story Points) | `storyPoints`  | JIRA custom field IDs vary; this must be configurable. |
