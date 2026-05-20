# Phase-2 Readiness Checklist

## Product Readiness

- [x] Command-center dashboard baseline complete.
- [x] District interaction and risk layer controls implemented.
- [x] Data ingestion contract established.
- [ ] Real Odisha production datasets fully onboarded and validated.
- [ ] Stakeholder scenario scripts finalized for pilot demonstrations.

## Engineering Readiness

- [x] Modular scene and state architecture in place.
- [x] Build pipeline validates production bundle.
- [x] Dataset sync script integrated in workflow.
- [ ] Automated tests for geospatial utilities and store logic.
- [ ] API contract definitions for simulation and inference endpoints.

## Data and Model Readiness

- [x] Placeholder heatmap engine integrated.
- [ ] District historical flood labels curated.
- [ ] Real-time weather/rainfall adapter integrated.
- [ ] Model training and validation pipeline established.

## Operations Readiness

- [ ] Logging and telemetry stack integrated.
- [ ] Environment-level deployment configs for staging/prod.
- [ ] Incident management runbook drafted.
- [ ] Security review and access control model finalized.

## Immediate Next Sprint Targets

1. Integrate real Odisha district boundary and DEM datasets at target resolution.
2. Implement flood propagation core engine as independent module under `simulation/`.
3. Add village nodes and graph-based evacuation routing prototype.
4. Expose backend endpoints for risk scoring and timeline playback.
