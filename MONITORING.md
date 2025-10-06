# PM Buddy - Monitoring & Observability

This document provides guidance on monitoring the health and performance of the PM Buddy application in a production environment. The goal is to ensure reliability, identify issues proactively, and understand user behavior.

## 1. Key Metrics to Export (Prometheus)

The application backend should be instrumented to export the following key metrics in a Prometheus-compatible format.

### API Metrics

-   `api_requests_total`: (Counter) Total number of API requests, labeled by `endpoint`, `method`, and `status_code`.
-   `api_request_duration_seconds`: (Histogram) Latency of API requests, labeled by `endpoint` and `method`.
-   `api_active_requests`: (Gauge) The number of in-flight API requests.

### Gemini AI Integration Metrics

-   `gemini_requests_total`: (Counter) Total number of requests to the Gemini API, labeled by `model` and `status` (e.g., `success`, `failure`).
-   `gemini_request_duration_seconds`: (Histogram) Latency of requests to the Gemini API.
-   `gemini_rate_limit_errors_total`: (Counter) A count of 429 (Too Many Requests) errors from the Gemini API.

### Database Metrics

-   `db_query_duration_seconds`: (Histogram) Latency of database queries, labeled by `query_type` (e.g., `select`, `insert`).
-   `db_connections`: (Gauge) Number of active and idle database connections.

### Business Metrics

-   `users_total`: (Gauge) Total number of registered users.
-   `projects_total`: (Gauge) Total number of projects created.
-
-   `issues_created_total`: (Counter) Total number of issues created.

## 2. Alerting Rules (Alertmanager)

Configure the following alerts in Alertmanager (or a similar tool) to notify the on-call team of potential issues.

-   **High API Error Rate:**
    -   **IF:** `sum(rate(api_requests_total{status_code=~"5.."}[5m])) / sum(rate(api_requests_total[5m])) > 0.05`
    -   **FOR:** 5 minutes
    -   **SEVERITY:** Critical
    -   **DESCRIPTION:** The API is returning a high number of 5xx errors.

-   **High API Latency:**
    -   **IF:** `histogram_quantile(0.99, sum(rate(api_request_duration_seconds_bucket[5m])) by (le)) > 1.5`
    -   **FOR:** 10 minutes
    -   **SEVERITY:** Warning
    -   **DESCRIPTION:** The 99th percentile API latency is over 1.5 seconds.

-   **Gemini API Failure Rate:**
    -   **IF:** `sum(rate(gemini_requests_total{status="failure"}[10m])) > 3`
    -   **FOR:** 5 minutes
    -   **SEVERITY:** Warning
    -   **DESCRIPTION:** The Gemini API integration is experiencing frequent failures.

## 3. Observability Dashboard (Grafana)

Create a Grafana dashboard to visualize the key metrics. This provides an at-a-glance overview of the application's health.

### Dashboard: API Overview

-   **Panel 1: API Request Rate (Requests/sec)**
    -   Visualization: Graph
    -   Query: `sum(rate(api_requests_total[1m]))`

-   **Panel 2: API Error Rate (5xx %)**
    -   Visualization: Stat / Gauge
    -   Query: `(sum(rate(api_requests_total{status_code=~"5.."}[5m])) / sum(rate(api_requests_total[5m]))) * 100`

-   **Panel 3: API Latency (95th Percentile)**
    -   Visualization: Graph
    -   Query: `histogram_quantile(0.95, sum(rate(api_request_duration_seconds_bucket[5m])) by (le, endpoint))`

-   **Panel 4: Gemini API Health**
    -   Visualization: Table
    -   Queries:
        -   Request Rate: `rate(gemini_requests_total[5m])`
        -   Error Rate: `rate(gemini_requests_total{status="failure"}[5m])`
        -   Latency (p99): `histogram_quantile(0.99, sum(rate(gemini_request_duration_seconds_bucket[5m])) by (le))`
