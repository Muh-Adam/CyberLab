# 📜 P6 — PKI, TLS/SSL & CERTIFICATE MANAGEMENT

> *"Trust, but verify — and in PKI, the certificate IS the verification."*

---

## 1. PUBLIC KEY INFRASTRUCTURE (PKI)

PKI adalah **sistem kepercayaan** yang menghubungkan public key dengan identitas melalui sertifikat digital.

### Mengapa PKI Dibutuhkan?

**Masalah**: Bagaimana kamu tahu bahwa public key yang kamu terima benar-benar milik orang/server yang benar? Bisa saja attacker mengirim public key palsu (Man-in-the-Middle).

**Solusi**: Certificate Authority (CA) — pihak terpercaya yang memverifikasi identitas dan menandatangani sertifikat.

### Komponen PKI

```
┌──────────────────────────────────────────────────┐
│                    ROOT CA                        │
│  (Self-signed, offline, ultra-secure)            │
│  Contoh: DigiCert, Let's Encrypt, GlobalSign     │
└────────────────────┬─────────────────────────────┘
                     │ Signs
         ┌───────────┴───────────┐
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ INTERMEDIATE CA  │    │ INTERMEDIATE CA  │
│ (Online, active) │    │                  │
└────────┬────────┘    └────────┬────────┘
         │ Signs                │ Signs
    ┌────┴────┐           ┌────┴────┐
    ▼         ▼           ▼         ▼
┌────────┐┌────────┐ ┌────────┐┌────────┐
│End-Cert││End-Cert│ │End-Cert││End-Cert│
│google  ││github  │ │bank.id ││mail.go │
│.com    ││.com    │ │        ││.id     │
└────────┘└────────┘ └────────┘└────────┘
```

| Komponen | Fungsi |
|----------|--------|
| **Root CA** | CA tertinggi, self-signed, disimpan offline |
| **Intermediate CA** | Menandatangani end-entity certs, jika compromised bisa di-revoke tanpa mengganti root |
| **End-Entity Certificate** | Sertifikat untuk website, server, user |
| **Certificate Revocation List (CRL)** | Daftar sertifikat yang dicabut |
| **OCSP** | Online Certificate Status Protocol — cek realtime apakah cert masih valid |
| **Registration Authority (RA)** | Memverifikasi identitas sebelum CA menerbitkan cert |

### Chain of Trust

Browser memverifikasi sertifikat website dengan menelusuri rantai kepercayaan:

```
Browser mengakses https://google.com
     │
     ▼
1. Server kirim: [google.com cert] + [Intermediate CA cert]
2. Browser cek: Intermediate CA ditandatangani Root CA?
3. Browser cek: Root CA ada di trust store browser?
4. ✅ Semua valid → Koneksi aman (gembok hijau)
```

---

## 2. X.509 CERTIFICATE FORMAT

Sertifikat digital mengikuti standar X.509.

```bash
# Lihat isi sertifikat
openssl x509 -in certificate.pem -text -noout
```

**Field penting dalam sertifikat**:

| Field | Isi | Contoh |
|-------|-----|--------|
| **Subject** | Identitas pemilik cert | CN=*.google.com, O=Google LLC |
| **Issuer** | Siapa yang menandatangani | CN=GTS CA 1C3, O=Google Trust Services |
| **Serial Number** | ID unik sertifikat | 0A:1B:2C:3D... |
| **Not Before / Not After** | Masa berlaku | Jan 1, 2025 – Apr 1, 2025 |
| **Public Key** | Public key pemilik | RSA 2048-bit / ECDSA P-256 |
| **Signature Algorithm** | Algoritma tanda tangan | SHA256withRSA |
| **Subject Alternative Name (SAN)** | Domain tambahan | DNS:google.com, DNS:*.google.com |
| **Key Usage** | Penggunaan yang diizinkan | Digital Signature, Key Encipherment |

### Tipe Validasi Sertifikat

| Tipe | Validasi | Waktu | Harga | Tampilan |
|------|----------|-------|-------|----------|
| **DV** (Domain Validation) | Bukti kontrol domain saja | Menit | Gratis–murah | 🔒 Gembok |
| **OV** (Organization Validation) | Verifikasi organisasi | Hari | $$ | 🔒 Gembok + info org |
| **EV** (Extended Validation) | Verifikasi legal penuh | Minggu | $$$ | 🔒 Gembok + nama org (hijau) |

---

## 3. TLS/SSL — Transport Layer Security

### Sejarah

```
SSL 1.0 (1994) → Tidak pernah dirilis (terlalu banyak bug)
SSL 2.0 (1995) → ❌ Deprecated (DROWN attack)
SSL 3.0 (1996) → ❌ Deprecated (POODLE attack)
TLS 1.0 (1999) → ❌ Deprecated (BEAST attack)
TLS 1.1 (2006) → ❌ Deprecated
TLS 1.2 (2008) → ✅ Masih digunakan
TLS 1.3 (2018) → ✅ RECOMMENDED — lebih cepat & lebih aman
```

> **Catatan**: Meskipun SSL sudah deprecated, orang masih menyebut "SSL" secara umum. Yang benar sekarang adalah **TLS**.

### TLS 1.2 Handshake

```
Client                              Server
  │                                    │
  │──── ClientHello ──────────────►   │  (supported ciphers, random)
  │                                    │
  │◄─── ServerHello ──────────────    │  (chosen cipher, random)
  │◄─── Certificate ──────────────    │  (server's X.509 cert)
  │◄─── ServerKeyExchange ────────    │  (DH params)
  │◄─── ServerHelloDone ─────────    │
  │                                    │
  │──── ClientKeyExchange ────────►   │  (client's DH public)
  │──── ChangeCipherSpec ─────────►   │  (switching to encrypted)
  │──── Finished ─────────────────►   │  (encrypted)
  │                                    │
  │◄─── ChangeCipherSpec ─────────    │
  │◄─── Finished ─────────────────    │  (encrypted)
  │                                    │
  │◄═══ ENCRYPTED APPLICATION DATA ══►│  (semua data terenkripsi!)
  
  Total: 2 round-trips (lebih lambat)
```

### TLS 1.3 Handshake (Lebih Cepat!)

```
Client                              Server
  │                                    │
  │──── ClientHello + KeyShare ───►   │  (cipher + DH key sekaligus!)
  │                                    │
  │◄─── ServerHello + KeyShare ───    │
  │◄─── Certificate ──────────────    │
  │◄─── Finished ─────────────────    │
  │                                    │
  │──── Finished ─────────────────►   │
  │                                    │
  │◄═══ ENCRYPTED APPLICATION DATA ══►│
  
  Total: 1 round-trip (50% lebih cepat!)
  + 0-RTT resumption untuk koneksi berulang
```

### Perbaikan TLS 1.3 vs 1.2

| Aspek | TLS 1.2 | TLS 1.3 |
|-------|---------|---------|
| Handshake | 2 round-trip | 1 round-trip |
| Cipher suites | Banyak (termasuk yang lemah) | Hanya yang kuat |
| RSA key exchange | ✅ (no forward secrecy) | ❌ Dihapus! |
| Forward Secrecy | Opsional (ECDHE) | Wajib (selalu ECDHE) |
| 0-RTT Resumption | Tidak ada | ✅ Ada |
| Compression | ✅ (CRIME attack) | ❌ Dihapus |

### Cipher Suite Explained

Contoh cipher suite TLS 1.2:
```
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
 │    │     │        │    │    │
 │    │     │        │    │    └── Hash: SHA-384 (PRF)
 │    │     │        │    └─────── Mode: GCM (authenticated)
 │    │     │        └──────────── Encryption: AES-256
 │    │     └───────────────────── Authentication: RSA cert
 │    └─────────────────────────── Key Exchange: ECDHE (forward secrecy!)
 └──────────────────────────────── Protocol: TLS
```

TLS 1.3 menyederhanakan:
```
TLS_AES_256_GCM_SHA384
(Key exchange selalu ECDHE, auth terpisah)
```

### Forward Secrecy — Mengapa Penting?

**Tanpa Forward Secrecy (RSA key exchange)**:
- Jika private key bocor → SEMUA traffic historis bisa didekripsi
- NSA bisa menyimpan traffic terenkripsi, menunggu key bocor

**Dengan Forward Secrecy (ECDHE)**:
- Setiap session menggunakan key sementara (ephemeral)
- Jika private key bocor → hanya session baru yang terancam
- Traffic historis tetap aman!

---

## 4. HANDS-ON: Setup PKI Internal

### Membuat Root CA → Intermediate CA → Server Certificate

```bash
# ═══ STEP 1: ROOT CA ═══
# Generate Root CA private key
openssl genrsa -aes256 -out rootCA.key 4096
# → Masukkan passphrase yang kuat!

# Generate Root CA certificate (self-signed, 10 tahun)
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 \
    -out rootCA.crt \
    -subj "/C=ID/ST=Jakarta/O=MyLab Security/CN=MyLab Root CA"

# ═══ STEP 2: INTERMEDIATE CA ═══
# Generate Intermediate CA key
openssl genrsa -aes256 -out intermediateCA.key 4096

# Generate CSR (Certificate Signing Request)
openssl req -new -key intermediateCA.key \
    -out intermediateCA.csr \
    -subj "/C=ID/ST=Jakarta/O=MyLab Security/CN=MyLab Intermediate CA"

# Sign dengan Root CA
openssl x509 -req -in intermediateCA.csr \
    -CA rootCA.crt -CAkey rootCA.key -CAcreateserial \
    -out intermediateCA.crt -days 1825 -sha256

# ═══ STEP 3: SERVER CERTIFICATE ═══
# Generate server key (tanpa passphrase untuk web server)
openssl genrsa -out server.key 2048

# Generate CSR
openssl req -new -key server.key \
    -out server.csr \
    -subj "/C=ID/ST=Jakarta/O=MyLab/CN=lab.mylab.local"

# Buat config untuk SAN (Subject Alternative Name)
cat > server_ext.cnf << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = lab.mylab.local
DNS.2 = *.mylab.local
IP.1 = 192.168.1.100
EOF

# Sign dengan Intermediate CA
openssl x509 -req -in server.csr \
    -CA intermediateCA.crt -CAkey intermediateCA.key -CAcreateserial \
    -out server.crt -days 365 -sha256 \
    -extfile server_ext.cnf

# ═══ STEP 4: VERIFY CHAIN ═══
# Buat chain file
cat intermediateCA.crt rootCA.crt > ca-chain.crt

# Verify
openssl verify -CAfile ca-chain.crt server.crt
# Output: server.crt: OK
```

### Konfigurasi Nginx HTTPS

```nginx
server {
    listen 443 ssl http2;
    server_name lab.mylab.local;

    ssl_certificate     /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    ssl_trusted_certificate /etc/nginx/ssl/ca-chain.crt;

    # TLS hardening
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;

    # HSTS (paksa HTTPS)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    root /var/www/html;
    index index.html;
}
```

---

## 5. SSL/TLS VULNERABILITIES & ATTACKS

| Attack | Target | Penjelasan |
|--------|--------|------------|
| **POODLE** | SSL 3.0 | Downgrade attack → decrypt cookies |
| **BEAST** | TLS 1.0 CBC | Decrypt HTTPS cookies |
| **Heartbleed** | OpenSSL | Baca memori server (CVE-2014-0160) |
| **CRIME** | TLS Compression | Exploit compression untuk leak data |
| **DROWN** | SSLv2 | Decrypt TLS menggunakan SSLv2 server |
| **ROBOT** | RSA key exchange | Bleichenbacher attack pada RSA |
| **SSL Stripping** | HTTPS→HTTP | Downgrade koneksi ke HTTP (tool: sslstrip) |

### Cara Test SSL/TLS Security

```bash
# Test dengan OpenSSL
openssl s_client -connect google.com:443 -tls1_3

# Test dengan nmap
nmap --script ssl-enum-ciphers -p 443 target.com

# Test dengan testssl.sh (comprehensive!)
git clone https://github.com/drwetter/testssl.sh
./testssl.sh https://target.com
```

---

## 6. LET'S ENCRYPT — Free SSL/TLS Certificates

Let's Encrypt menyediakan sertifikat DV **gratis** dengan automated renewal.

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Dapatkan sertifikat (auto-konfigurasi Nginx)
sudo certbot --nginx -d domain.com -d www.domain.com

# Renewal otomatis (crontab)
sudo certbot renew --dry-run  # Test dulu
# Certbot sudah auto-setup timer: systemctl list-timers
```

---

## 7. CHECKLIST PEMAHAMAN P6

- [ ] Jelaskan komponen PKI dan chain of trust
- [ ] Apa perbedaan Root CA dan Intermediate CA?
- [ ] Apa itu X.509 dan field pentingnya?
- [ ] Jelaskan perbedaan TLS 1.2 dan TLS 1.3
- [ ] Apa itu Forward Secrecy dan mengapa penting?
- [ ] Baca cipher suite dan jelaskan setiap komponen
- [ ] Setup Root CA → Intermediate CA → Server cert dengan OpenSSL
- [ ] Konfigurasi HTTPS di Nginx dengan best practices
- [ ] Sebutkan 3 serangan terhadap SSL/TLS
- [ ] Apa itu HSTS dan mengapa penting?

---

## 🎉 SELESAI PHASE 1 — FONDASI CYBERSECURITY

Kamu sekarang memiliki fondasi yang solid:
- ✅ Konsep dasar keamanan (CIA Triad, threats, actors)
- ✅ Jaringan komputer (OSI, TCP/IP, protocols, Wireshark)
- ✅ Linux (filesystem, CLI, permissions, scripting)
- ✅ Hardening (SSH, firewall, fail2ban, CIS)
- ✅ Kriptografi (symmetric, asymmetric, hashing)
- ✅ PKI & TLS (certificates, handshake, HTTPS)

*Selanjutnya: [Phase 2 — Offensive Security](../../Phase2-Offensive/)*
