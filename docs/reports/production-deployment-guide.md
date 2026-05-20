# Production Deployment Guide
## FloodGuard AI — Enterprise Containerized Infrastructure Deployment

This guide details the steps to build, configure, deploy, and monitor the **FloodGuard AI** platform in production-grade environments.

---

### 1. Deployment Prerequisites

Before deploying, ensure you have the following assets and accounts ready:
1. **Docker Engine & Compose**: Required for container orchestration.
2. **Postgres Database with PostGIS**: Either self-hosted or a managed Supabase database.
3. **OpenWeatherMap API Key**: Required for active, live district meteorological ingestion.
4. **Domain Name & SSL Certificates**: For public-facing HTTPS command endpoints.

---

### 2. Environment Configuration Matrix

Create your production configuration files by copying the templates:
- **Backend (.env)**: `backend/.env`
- **Frontend (.env.local)**: `frontend/.env.local`

#### 2.1. Critical Backend Keys:
| Parameter | Default | Production Value | Description |
| :--- | :--- | :--- | :--- |
| `ENV` | `development` | `production` | Enforces production routing and security bounds. |
| `DATABASE_URL` | `sqlite:///` | `postgresql://user:pass@host:5432/db` | Production PostGIS database connection. |
| `OPENWEATHER_API_KEY` | `mock` | `your_api_key_here` | Ingests real meteorological data. |
| `CACHE_BACKEND` | `memory` | `redis` | Upgrades API cache to clustered Redis nodes. |
| `REDIS_URL` | `""` | `redis://default:pass@redis-host:6379/0` | Clustered Redis connection string. |

#### 2.2. Critical Frontend Keys:
| Parameter | Default | Production Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | `https://api.yourdomain.com` | Base URL pointing to the FastAPI load balancer. |
| `VITE_SUPABASE_URL` | `""` | `https://project.supabase.co` | Supabase endpoint. |
| `VITE_SUPABASE_ANON_KEY`| `""` | `anon_key_here` | Client-side Supabase authentication key. |

---

### 3. Containerized Quickstart (Docker Compose)

To launch the entire platform (Frontend, Backend, and a local PostGIS DB) instantly using standard docker orchestration:

```bash
# From the project root, build and run the services in detached mode
docker-compose -f infra/docker-compose.yml up --build -d

# Verify container statuses
docker-compose -f infra/docker-compose.yml ps

# Follow logs from the backend
docker-compose -f infra/docker-compose.yml logs -f backend
```

---

### 4. Cloud Infrastructure Topologies

#### 4.1. Option A: AWS Deployment (ECS + Fargate + RDS Postgres)
- **Frontend**: Upload `frontend/dist/` to an **AWS S3** bucket and configure an **AWS CloudFront** CDN distribution for global caching (LCP < 1.0s).
- **Backend**: Package the backend container using `infra/Dockerfile.backend`, host on **AWS ECS Fargate** with autoscaling triggered at >70% CPU usage.
- **Database**: Spin up an **AWS RDS Aurora Serverless** Postgres database with the PostGIS extension activated.

#### 4.2. Option B: Serverless Cloud Run (GCP)
- **Frontend**: Deploy the optimized production Nginx build to **Firebase Hosting** or **Google Cloud Storage + Cloud CDN**.
- **Backend**: Deploy the backend container directly to **Google Cloud Run**. Enable CPU allocation during request processing to minimize cold-start latencies.
- **Database**: Connect to **Google Cloud SQL** for PostgreSQL via secure Unix socket sidecars.

---

### 5. Production Backups & Hardening

1. **Daily PostGIS Snapshots**:
```bash
# Generate spatial schema and data dumps
pg_dump -h db-host -U postgres -d floodguard -f floodguard_backup_$(date +%F).sql
```
2. **Rate Limiting Checks**: Ensure `slowapi` boundaries are active on the load balancer to mitigate heavy automated scrape routines.
3. **Log Shipping**: Ship JSON logs emitted from `structlog` directly to a centralized logging collector (e.g. AWS CloudWatch, Datadog, or Elasticsearch) to preserve audit trails during emergencies.
