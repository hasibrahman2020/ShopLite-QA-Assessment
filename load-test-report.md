# ShopLite API Load Test Report

**Environment Setup:**
- **Machine:** Local Developer Machine (Windows, Node.js)
- **Target:** Local Mock API (`GET http://127.0.0.1:4000/api/products`)
- **Test Runs:** 3 iterations executed using the provided dependency-free load generator.

### Baseline: Single-User Profile
- **VUs:** 1
- **Duration:** 15s
- **Throughput:** 890.9 req/s
- **Latency:** p95 = 1.6 ms, p99 = 2.3 ms
- **Errors:** 0%

---

### Verdict against Specification §11

#### §11.1 Under 50 concurrent users for 60s
- **Requirement:** p95 < 800 ms, p99 < 1,500 ms, error rate < 1%
- **Observed:** 
  - **VUs:** 50
  - **Latency:** p95 = 151.6 ms, p99 = 208.1 ms
  - **Errors:** 0.00%
- **Verdict:** **PASS**. The endpoint remained highly responsive under maximum expected concurrency without dropping any requests or exceeding the absolute latency thresholds.

#### §11.2 p95 degradation at 20 concurrent users
- **Requirement:** p95 must not exceed 2× its single-user latency.
- **Observed:**
  - **VUs:** 20
  - **Target Limit (2× Baseline):** 3.2 ms (1.6 ms × 2)
  - **Actual Latency:** p95 = 52.1 ms
- **Verdict:** **FAIL**. The latency severely degrades, reaching over 32 times the baseline rather than staying within the mandated 2× limit. 

#### §11.3 Throughput and proportional latency growth
- **Requirement:** Throughput must not collapse; latency growth must stay proportional.
- **Observed:** 
  - Throughput dropped continuously as concurrency rose: 890.9 req/s (1 VU) → 565.6 req/s (20 VUs) → 407.3 req/s (50 VUs).
- **Verdict:** **FAIL**. The throughput collapsed significantly (over a 50% drop from baseline at 50 VUs). The API's blocking architecture causes subsequent requests to queue, degrading performance disproportionately rather than plateauing gracefully.