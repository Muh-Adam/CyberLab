# 🔌 P20 — API SECURITY & MODERN APPLICATION SECURITY

> *"APIs are the new attack surface. They expose your business logic directly."*

---

## 1. OWASP API SECURITY TOP 10 (2023)

| # | Risiko | Penjelasan | Contoh |
|---|--------|------------|--------|
| API1 | **BOLA** (Broken Object Level Auth) | Akses object milik user lain | `GET /api/users/1002` (bukan milik kamu) |
| API2 | **Broken Authentication** | Auth lemah/bypass | Token tanpa expiry, no rate limit |
| API3 | **BOPLA** (Broken Object Property Level Auth) | Ubah property yang seharusnya read-only | Mass assignment: `{"role":"admin"}` |
| API4 | **Unrestricted Resource Consumption** | Tanpa rate limiting | DDoS via API, bill inflation |
| API5 | **Broken Function Level Auth** | Akses function admin sebagai user biasa | `DELETE /api/users/1002` oleh non-admin |
| API6 | **Unrestricted Access to Sensitive Flows** | Business flow abuse | Automated coupon abuse, ticket scalping |
| API7 | **Server-Side Request Forgery** | SSRF via API parameter | `{"url":"http://169.254.169.254/"}` |
| API8 | **Security Misconfiguration** | Config default, CORS terlalu permissive | `Access-Control-Allow-Origin: *` |
| API9 | **Improper Inventory Management** | API lama/debug masih aktif | `/api/v1/` (deprecated, no auth) |
| API10 | **Unsafe Consumption of APIs** | Trust 3rd-party API tanpa validasi | No input validation dari external API |

---

## 2. JWT (JSON Web Token) VULNERABILITIES

### Struktur JWT

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.signature
     HEADER                PAYLOAD               SIGNATURE
     (Base64)              (Base64)               (HMAC/RSA)

# Decode:
# Header:  {"alg":"HS256"}
# Payload: {"user":"admin","role":"user","exp":1716300000}
```

### JWT Attacks

```bash
# 1. Algorithm None Attack
# Ubah header: {"alg":"none"} → hapus signature
# Server yang vulnerable menerima tanpa verifikasi!

# 2. Weak Secret
# Crack HMAC secret dengan hashcat:
hashcat -m 16500 jwt_token.txt /usr/share/wordlists/rockyou.txt
# Jika secret = "secret123" → bisa forge JWT apapun!

# 3. Algorithm Confusion (RS256 → HS256)
# Server pakai RS256 (asymmetric) → attacker ganti ke HS256
# → Sign dengan PUBLIC key (yang publik!) sebagai HMAC secret

# 4. KID Injection
# Header: {"alg":"HS256","kid":"../../etc/passwd"}
# Server menggunakan file passwd sebagai signing key
```

### JWT Best Practices
- Gunakan **RS256** atau **ES256** (asymmetric)
- Set **expiration time** pendek (15 menit)
- Validasi **semua claims** (iss, aud, exp)
- **Blacklist** token yang di-revoke
- Simpan di **HttpOnly cookie**, bukan localStorage

---

## 3. API TESTING TOOLS

```bash
# Postman — manual API testing
# Import collection → set auth → test endpoints

# Burp Suite — intercept & modify API requests
# Proxy browser/app → intercept JSON requests → modify

# curl — command line API testing
curl -X GET http://target/api/users/1 \
    -H "Authorization: Bearer eyJ..." \
    -H "Content-Type: application/json"

# Test BOLA:
curl http://target/api/users/1001  # Your data
curl http://target/api/users/1002  # Someone else? → BOLA!

# Test Mass Assignment:
curl -X PUT http://target/api/users/1001 \
    -H "Content-Type: application/json" \
    -d '{"name":"hacker","role":"admin"}'  # role seharusnya read-only!

# crAPI (vulnerable API app for practice)
docker-compose -f crapi/docker-compose.yml up -d
# → Practice all OWASP API Top 10 vulnerabilities
```

---

## 4. OAUTH 2.0 MISCONFIGURATIONS

| Misconfiguration | Risiko |
|------------------|--------|
| Open redirect di callback URL | Token theft via redirect |
| CSRF tanpa state parameter | Authorization code theft |
| Token di URL fragment | Leaks via Referer header |
| Scope terlalu luas | Over-privileged access |
| No PKCE (mobile/SPA) | Authorization code interception |

---

## 5. CHECKLIST PEMAHAMAN P20

- [ ] Jelaskan OWASP API Security Top 10
- [ ] Apa itu BOLA dan bagaimana testing-nya?
- [ ] Decode JWT dan identifikasi vulnerability
- [ ] Crack JWT weak secret dengan hashcat
- [ ] Test API dengan Burp Suite dan curl
- [ ] Jelaskan OAuth 2.0 misconfigurations
- [ ] Deploy crAPI dan eksploitasi 5 vulnerability

---

*Selanjutnya: [P21 — Vulnerability Management & Pentest Report](./P21-Vuln-Management.md)*
