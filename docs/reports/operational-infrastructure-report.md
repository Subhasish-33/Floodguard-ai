# Operational Infrastructure Report
## FloodGuard AI — Enterprise Security, Telemetry, and High-Throughput API Architecture

### 1. Ingestion Security & Hardening

Phase-4 implements strict production-grade security boundaries around the FastAPI server, preventing potential denial-of-service vectors, ensuring data integrity, and tracing command operator actions.

```
 [ Incoming Request ]
         │
         ├───► [ Rate Limiting Middleware (SlowAPI) ]
         │       Checks IP/Operator Token (Default 100 req/min)
         │
         ├───► [ Security Headers Middleware ]
         │       Injects XSS, Frame-Options, HSTS boundaries
         │
         ├───► [ Request Tracing Middleware ]
         │       Injects a unique UUID x-request-id header
         │
         ▼
 [ Router / Controller ]
```

#### 1.1. Network Security Protections:
- **slowapi Integration**: Rejects anomalous high-frequency polling. Key administrative operations (e.g. incident creation or weather ingestion triggers) are limited to 30 requests per minute.
- **Custom Security Headers**:
  - `X-Frame-Options: DENY` (Mitigates clickjacking)
  - `X-Content-Type-Options: nosniff` (Mitigates MIME sniffing)
  - `Strict-Transport-Security` (Enforces HTTPS boundaries)
- **Granular CORS Settings**: Configurable via settings, restricting origin domains.

---

### 2. High-Performance Caching Architecture

Weather API requests (such as the 15-minute polling updates from OpenWeatherMap) are throttled and served from an **in-memory TTL (Time-To-Live) cache**.

- **Implementation**: Utilizes `app/core/cache.py` with thread-safe lock controls.
- **Stale-While-Revalidate**: Serves cached data instantly if it is younger than the target threshold (e.g., 900 seconds), resolving subsequent calls in <5ms.
- **Enterprise Extensibility**: The caching interface is fully abstract. By altering the `CACHE_BACKEND` environment variable, operations can transition from in-memory cache directly to a production **Redis** cluster without rewriting any application controllers.

---

### 3. Observability & Telemetry Pipeline

#### 3.1. Structured JSON Logging (`structlog`)
To facilitate seamless parsing under production log shippers (such as FluentBit, Logstash, Datadog Agent, or GCP Cloud Logging), the backend utilizes `structlog` to emit structured JSON streams:

```json
{"time":"2026-05-20T17:19:33Z","level":"INFO","logger":"floodguard.startup","msg":"FloodGuard API starting — environment=development live_weather=False database=False"}
```

Every request injects the `x-request-id` into the logger context, allowing engineers to trace an entire API call transaction (from entrance, cache search, down to PostGIS retrieval) with a single query.

#### 3.2. Prometheus Telemetry Endpoint
Exposes `/api/telemetry/metrics` to export raw metric values:
- **`http_requests_total`**: Counter tracking request volume by status code and route.
- **`simulation_computation_duration_seconds`**: Histogram monitoring grid step execution time.
- **`weather_api_latency_seconds`**: Monitor third-party ingestion speeds.
