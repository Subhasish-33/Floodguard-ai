# Future AI Integration Recommendations (Post Phase-2)

1. **Rainfall nowcasting** – ingest IMD radar + satellite QPE, feed GRU/Temporal Fusion Transformer to modulate `rainfallIntensity` automatically.
2. **Surrogate flood models** – train CNN surrogates on coarse CA outputs for sub-second inference at 1 km resolution.
3. **Village risk ranking** – logistic + spatial graph penalties using census features attached to `VillageEntity`.
4. **Evacuation RL** – optimize routes with constrained MDP policy leveraging predicted depth snapshots.
5. **Federated updates** – distribute model improvements from district deployments without centralizing sensitive datasets.
6. **Confidence overlays** – show uncertainty ribbons on heatmap via quantile regression heads.
7. **Observability** – capture simulation telemetry into lakehouse for continual learning loops.

Each module should plug into the existing `FloodSimulationRequest`/response envelope to avoid breaking API consumers.
