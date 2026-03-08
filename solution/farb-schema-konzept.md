# VM Metrics Analytics Platform - Farb- und Schema-Konzept

## Farbpalette

### Primäre Farben

| Verwendung | Farbname | Hex-Code |
|------------|----------|----------|
| Primary Brand | Deep Blue | `#1E3A5F` |
| Secondary | Slate | `#475569` |
| Accent | Electric Blue | `#3B82F6` |

### Data Layer Farben (Medallion Architecture)

| Layer | Farbname | Hex-Code | Verwendung |
|-------|----------|----------|------------|
| Bronze | Bronze | `#CD7F32` | Raw Data, Eingangsdaten |
| Silver | Silver | `#C0C0C0` | Bereinigte, validierte Daten |
| Gold | Gold | `#FFD700` | Aggregierte, konsumierbare Daten |

### Systemkomponenten

| Komponente | Farbname | Hex-Code |
|------------|----------|----------|
| InfluxDB | Purple | `#9B59B6` |
| Databricks | Electric Blue | `#3B82F6` |
| Grafana | Orange | `#F97316` |
| Power BI | Yellow | `#EAB308` |
| GitHub Actions | Gray | `#6B7280` |
| Terraform | Purple | `#7C3AED` |

### CI/CD Pipeline

| Stage | Farbname | Hex-Code |
|-------|----------|----------|
| Code Review | Blue | `#3498DB` |
| Tests | Green | `#2ECC71` |
| Security | Red | `#E74C3C` |
| Build | Orange | `#F39C12` |
| Staging | Yellow | `#F1C40F` |
| Production | Red | `#E74C3C` |

### Status Farben

| Status | Farbname | Hex-Code |
|--------|----------|----------|
| Success/Healthy | Green | `#22C55E` |
| Warning | Yellow | `#EAB308` |
| Error/Critical | Red | `#EF4444` |
| Info | Blue | `#3B82F6` |

---

## Schema Konzept

### Datenfluss Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VM METRICS FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  SOURCES │     │ INGEST   │     │PROCESSING│     │CONSUMPTION│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                             
   VMs (100+)  ──▶  InfluxDB   ──▶  Databricks  ──▶  Dashboards
   (Telegraf)      (Time Series)   (Spark/Delta)     & Alerts
```

### Medallion Architecture Schema

```yaml
Bronze Layer:
  - cpu_raw:   timestamp, vm_id, core_id, usage_user, usage_system, ...
  - mem_raw:   timestamp, vm_id, total_bytes, used_bytes, available_bytes, ...
  - disk_raw:  timestamp, vm_id, device, read_bytes, write_bytes, ...
  - net_raw:   timestamp, vm_id, interface, bytes_recv, bytes_sent, errors

Silver Layer:
  - cpu_metrics:   usage_user, usage_system, usage_total (validated, deduplicated)
  - memory_metrics: used_percent, total_bytes, available_bytes (computed %)
  - disk_metrics:  used_percent, read_bytes/s, write_bytes/s (per device)
  - network_metrics: bytes_recv/s, bytes_sent/s, errors (rates computed)

Gold Layer:
  - vm_health_hourly:    avg/max/p95 CPU, memory %, disk %, health_score
  - capacity_summary:    current utilization, status (HEALTHY/WARNING/CRITICAL)
  - anomaly_flags:      detected anomalies, severity, recommendation
```

### CI/CD Pipeline Schema

```yaml
CI Pipeline:
  - Lint & Format:     Ruff, Black, isort, MyPy
  - Unit Tests:         pytest + 80% coverage
  - Security Scan:      Bandit + pip-audit
  - Build Wheel:       Validate Bundle

CD - Staging (Automatic):
  - Build Artifacts
  - Configure Secrets
  - Deploy DABs
  - Smoke Tests

CD - Production (Manual):
  - Validate Request ('DEPLOY-TO-PROD')
  - Build & Deploy DABs
  - Verify Jobs & Catalog
  - Post-Deploy Health Check
  - Notify + GitHub Release
```

---

## Style Guide

### Diagramme

- **Farbschema für Medallion**: Bronze → Silver → Gold (aufsteigend nach Wert)
- ** Pfeilrichtungen**: Links nach rechts oder oben nach unten
- **Konsistenz**: Gleiche Farben für gleiche Komponenten in allen Diagrammen

### Konsumenten

| Dashboard | Farbe | Icon |
|-----------|-------|------|
| Grafana | `#F97316` | 📈 |
| Power BI | `#EAB308` | 📊 |
| Alerts | `#EF4444` | 🚨 |

### Entwicklungsumgebungen

| Environment | Farbe | Deployment |
|-------------|-------|------------|
| DEV | `#22C55E` | Auto |
| STAGING | `#F1C40F` | Auto |
| PROD | `#E74C3C` | Manual |
