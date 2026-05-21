# 📋 P21 — VULNERABILITY MANAGEMENT & LAPORAN PENTEST PROFESIONAL

---

## 1. VULNERABILITY MANAGEMENT LIFECYCLE

```
1. DISCOVER    → Identifikasi semua aset (inventory)
2. ASSESS      → Scan vulnerability (OpenVAS, Nessus)
3. PRIORITIZE  → Ranking berdasarkan CVSS + konteks bisnis
4. REMEDIATE   → Patch, mitigate, atau accept risk
5. VERIFY      → Re-scan untuk konfirmasi fix
6. REPORT      → Dokumentasi & metric tracking
     ↻ (Repeat continuously)
```

---

## 2. CVSS v3.1 (Common Vulnerability Scoring System)

### Scoring Components

| Metric Group | Metrics | Range |
|-------------|---------|-------|
| **Base** | Attack Vector, Complexity, Privileges, User Interaction, Scope, CIA Impact | 0.0–10.0 |
| **Temporal** | Exploit maturity, Remediation level, Report confidence | Modifier |
| **Environmental** | Importance to your org | Modifier |

### CVSS Score Ranges

| Score | Severity | Contoh |
|-------|----------|--------|
| 0.0 | None | Informational |
| 0.1–3.9 | **Low** | Information disclosure minor |
| 4.0–6.9 | **Medium** | XSS reflected, missing headers |
| 7.0–8.9 | **High** | SQL injection, RCE authenticated |
| 9.0–10.0 | **Critical** | RCE unauthenticated, zero-click |

### Contoh Perhitungan

```
Log4Shell (CVE-2021-44228):
- Attack Vector: Network (N)     → Bisa dari internet
- Attack Complexity: Low (L)     → Trivial
- Privileges Required: None (N)  → Tanpa auth
- User Interaction: None (N)     → Zero-click
- Scope: Changed (C)             → Bisa affect komponen lain
- Confidentiality: High (H)
- Integrity: High (H)
- Availability: High (H)

CVSS: 10.0 (CRITICAL)
Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H
```

---

## 3. CVE, NVD, CWE

| Database | Isi | URL |
|----------|-----|-----|
| **CVE** | ID unik untuk setiap vulnerability | cve.mitre.org |
| **NVD** | Detail teknis + CVSS score | nvd.nist.gov |
| **CWE** | Klasifikasi jenis weakness | cwe.mitre.org |
| **Exploit-DB** | Public exploits & PoC | exploit-db.com |

```
Contoh:
CVE-2021-44228 → Log4Shell
CWE-917        → Improper Neutralization of Special Elements (Expression Language Injection)
CVSS: 10.0     → Critical
Exploit: Available on Exploit-DB
```

---

## 4. OpenVAS/GVM SCANNING

```bash
# Setup GVM di VM Ubuntu
sudo apt install gvm
sudo gvm-setup    # ~30 menit
sudo gvm-start

# Akses: https://localhost:9392
# Workflow:
# 1. Configuration → Targets → New Target (IP/range)
# 2. Scans → Tasks → New Task (pilih target + scan config)
# 3. Start scan → tunggu selesai
# 4. Scans → Reports → View results
# 5. Export sebagai PDF/CSV
```

---

## 5. LAPORAN PENTEST PROFESIONAL

### Struktur Laporan

```markdown
# PENETRATION TEST REPORT
## PT Target Indonesia — External Network Assessment

### 1. EXECUTIVE SUMMARY (untuk manajemen)
- Scope, timeline, methodology
- Overall risk rating: HIGH
- Key findings summary (3-5 bullet points)
- "Ditemukan 3 critical, 5 high, 12 medium vulnerabilities"

### 2. METHODOLOGY
- OWASP Testing Guide / PTES / OSSTMM
- Tools: Nmap, Burp Suite, Metasploit, SQLMap
- Testing period: 15-21 Mei 2025

### 3. FINDINGS (per vulnerability)

#### Finding #1: SQL Injection on Login Page
| Attribute | Detail |
|-----------|--------|
| Severity | CRITICAL (CVSS 9.8) |
| CVSS Vector | AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |
| CWE | CWE-89: SQL Injection |
| Location | https://target.com/login (parameter: username) |
| Status | Open |

**Description**: Login page vulnerable to SQL injection
allowing authentication bypass and database extraction.

**Proof of Concept**:
- Input: `admin' OR 1=1 --`
- Result: Logged in as admin without password
- [Screenshot: login_bypass.png]

**Impact**: Full database access including 50,000 customer
records with PII (name, email, phone, address).

**Recommendation**:
1. Implement parameterized queries (prepared statements)
2. Deploy WAF with SQL injection rules
3. Input validation on all user inputs

**Reference**: OWASP SQL Injection Prevention Cheat Sheet

### 4. RISK MATRIX
| # | Finding | CVSS | Severity | Status |
|---|---------|------|----------|--------|
| 1 | SQL Injection | 9.8 | Critical | Open |
| 2 | Default Credentials | 9.1 | Critical | Open |
| 3 | XSS Stored | 8.1 | High | Open |

### 5. REMEDIATION ROADMAP
| Priority | Finding | Fix | Timeline |
|----------|---------|-----|----------|
| Immediate | SQLi, Default Creds | Patch + reset | 48 hours |
| Short-term | XSS, CSRF | Code fix | 2 weeks |
| Medium-term | Missing headers | Config | 1 month |

### 6. APPENDIX
- Full scan results
- Tool output
- Screenshots
- Methodology details
```

---

## 6. CHECKLIST PEMAHAMAN P21

- [ ] Jelaskan vulnerability management lifecycle
- [ ] Hitung CVSS score untuk 3 skenario
- [ ] Jelaskan perbedaan CVE, NVD, CWE
- [ ] Jalankan OpenVAS scan dan analisis hasil
- [ ] Tulis laporan pentest profesional lengkap
- [ ] Prioritaskan vulnerability berdasarkan CVSS + business context
- [ ] Apa itu remediation roadmap?

---

*Selanjutnya: [P22 — Governance, Risk & Compliance](./P22-GRC.md)*
