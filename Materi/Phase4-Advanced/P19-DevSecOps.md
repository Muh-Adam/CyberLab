# 🔄 P19 — DEVSECOPS & SECURE SDLC

> *"Shift left: find bugs at $100, not $10,000."*

---

## 1. SECURE SDLC & SHIFT-LEFT

```
TRADITIONAL:  Plan → Design → Develop → Test → Deploy → SECURITY (terlambat!)
SHIFT-LEFT:   Plan+SEC → Design+SEC → Develop+SEC → Test+SEC → Deploy+SEC

Biaya fix bug:
- Design phase:    $100
- Development:     $1,000
- Testing:         $5,000
- Production:      $30,000+
```

### DevSecOps Pipeline

```
CODE → BUILD → TEST → DEPLOY → MONITOR
 │       │       │       │         │
 ▼       ▼       ▼       ▼         ▼
Pre-commit  SAST   DAST   Config   Runtime
Hooks     (static) (dynamic) Scan  Protection
Secret    SCA      Pentest  Image   SIEM/EDR
Scan      (deps)            Scan    WAF
```

---

## 2. SAST — Static Application Security Testing

Menganalisis **source code** tanpa menjalankannya.

```bash
# Semgrep (open source, cepat)
semgrep --config auto ./src/
semgrep --config p/owasp-top-ten ./src/

# Contoh temuan Semgrep:
# ❌ SQL Injection detected:
# query = "SELECT * FROM users WHERE id = " + user_input
# ✅ Fix: Use parameterized query

# SonarQube (comprehensive, Docker)
docker run -d --name sonarqube -p 9000:9000 sonarqube:community
# Akses: http://localhost:9000 (admin/admin)
# Scan project:
# sonar-scanner -Dsonar.projectKey=myapp -Dsonar.sources=./src
```

---

## 3. DAST — Dynamic Application Security Testing

Menguji aplikasi yang **sedang berjalan** (black-box).

```bash
# OWASP ZAP (headless scan)
docker run -t zaproxy/zap-stable zap-baseline.py -t http://target:8080

# ZAP full scan
docker run -t zaproxy/zap-stable zap-full-scan.py -t http://target:8080

# Output: HTML report dengan findings (XSS, SQLi, CSRF, dll)
```

---

## 4. SCA — Software Composition Analysis

Scan **dependencies/libraries** untuk known vulnerabilities (CVE).

```bash
# OWASP Dependency-Check
dependency-check --project myapp --scan ./

# npm audit (Node.js)
npm audit
npm audit fix

# pip-audit (Python)
pip-audit

# Snyk (multi-language)
snyk test
```

---

## 5. SECRET DETECTION

```bash
# Gitleaks — scan Git repo untuk secrets
gitleaks detect --source=. --report-format=json --report-path=leaks.json

# Trufflehog — scan Git history
trufflehog git file://./

# Temuan umum:
# AWS Access Key: AKIA...
# Private Key: -----BEGIN RSA PRIVATE KEY-----
# API Token: ghp_xxxx (GitHub)
# Database URL: postgres://user:password@host/db
```

---

## 6. CI/CD INTEGRATION (GitHub Actions)

```yaml
# .github/workflows/security.yml
name: Security Pipeline
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # SAST
      - name: Semgrep SAST
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/owasp-top-ten
      
      # Secret Detection
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
      
      # SCA
      - name: Dependency Check
        run: npm audit --audit-level=high
      
      # Container Scan
      - name: Trivy Image Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:${{ github.sha }}'
          severity: 'HIGH,CRITICAL'
```

---

## 7. CHECKLIST PEMAHAMAN P19

- [ ] Jelaskan Shift-Left dan mengapa penting
- [ ] Perbedaan SAST, DAST, SCA
- [ ] Jalankan Semgrep scan pada kode
- [ ] Setup SonarQube dan scan project
- [ ] Jalankan OWASP ZAP scan
- [ ] Deteksi secrets dengan Gitleaks
- [ ] Buat GitHub Actions security pipeline
- [ ] Apa itu secure coding practices?

---

*Selanjutnya: [P20 — API Security](./P20-API-Security.md)*
