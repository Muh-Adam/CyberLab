# 🔍 P7 — RECONNAISSANCE & OSINT

> *"Give me six hours to chop down a tree and I will spend the first four sharpening the axe."* — Abraham Lincoln
> Dalam pentesting: **80% waktu dihabiskan untuk reconnaissance.**

---

## 1. APA ITU RECONNAISSANCE?

Reconnaissance (recon) adalah **fase pertama** dalam setiap serangan atau penetration test — mengumpulkan informasi sebanyak mungkin tentang target SEBELUM menyerang.

```
RECONNAISSANCE ──► SCANNING ──► EXPLOITATION ──► POST-EXPLOITATION
    (kamu di sini)
```

### Passive vs Active Reconnaissance

| Aspek | Passive Recon | Active Recon |
|-------|--------------|--------------|
| **Definisi** | Mengumpulkan info TANPA menyentuh target | Berinteraksi langsung dengan target |
| **Terdeteksi?** | ❌ Tidak | ✅ Bisa terdeteksi (log, IDS) |
| **Contoh** | Google, WHOIS, Shodan, social media | Port scanning, banner grabbing, DNS zone transfer |
| **Legal?** | Umumnya legal | Butuh izin (scope pentesting) |
| **Tools** | Maltego, theHarvester, Recon-ng | Nmap, Nikto, dirb |

---

## 2. OSINT (Open Source Intelligence)

OSINT = mengumpulkan informasi dari **sumber terbuka** yang bisa diakses publik.

### 2.1 Google Dorking (Google Hacking)

Menggunakan operator pencarian Google untuk menemukan informasi sensitif yang terekspos.

```
# === OPERATOR DASAR ===
site:target.com                    # Hanya hasil dari domain target
inurl:admin                        # URL mengandung "admin"
intitle:"index of"                 # Halaman directory listing
filetype:pdf                       # Hanya file PDF
intext:"password"                  # Halaman mengandung "password"
cache:target.com                   # Versi cache Google
-site:www.target.com site:target.com  # Subdomain (exclude www)

# === GOOGLE DORKS UNTUK SECURITY ===

# Mencari login pages
site:target.com inurl:login OR inurl:admin OR inurl:dashboard

# Mencari file sensitif
site:target.com filetype:sql OR filetype:env OR filetype:log OR filetype:conf
site:target.com filetype:xls "password"
site:target.com filetype:pdf "confidential"

# Mencari directory listing (server misconfiguration)
site:target.com intitle:"index of" "parent directory"
site:target.com intitle:"index of" ".git"
site:target.com intitle:"index of" "backup"

# Mencari exposed config/credentials
site:target.com ext:env "DB_PASSWORD"
site:target.com ext:yml "password:"
site:target.com "phpinfo()" ext:php

# Mencari vulnerable pages
site:target.com inurl:".php?id="       # Potential SQL injection
site:target.com inurl:"redirect="      # Potential open redirect
site:target.com inurl:"file="          # Potential LFI

# Mencari exposed cameras/IoT
inurl:"/view/view.shtml"               # Axis cameras
intitle:"Live View / - AXIS"           # Axis network cameras
```

> ⚠️ **ETIKA**: Google Dorking terhadap target TANPA izin bisa ilegal tergantung yurisdiksi. Selalu gunakan dalam scope yang diizinkan!

### 2.2 OSINT Tools

#### theHarvester — Email, Subdomain, IP Gathering

```bash
# Cari email, subdomain, host dari berbagai sumber
theHarvester -d target.com -b google,bing,linkedin,dnsdumpster -l 200

# Output:
# Emails found: john@target.com, admin@target.com
# Hosts found: mail.target.com, vpn.target.com, dev.target.com
# IPs found: 203.0.113.10, 203.0.113.11
```

#### Maltego — Visual OSINT & Relationship Mapping

Maltego adalah tool **visual** yang memetakan hubungan antar entitas (domain, IP, email, orang, organisasi).

```
Workflow di Maltego:
1. Mulai dari domain: target.com
2. Transform: Domain → DNS Records
3. Transform: DNS → IP Addresses
4. Transform: IP → Netblocks → Other domains
5. Transform: Domain → Email addresses
6. Transform: Email → Social media profiles
7. → Hasilnya: peta visual seluruh "attack surface" target
```

#### Shodan — Search Engine untuk Devices

Shodan memindai seluruh internet dan mengindex device/service yang terekspos.

```
# Shodan Queries
hostname:target.com            # Semua device milik target
org:"Target Corp"              # Berdasarkan organisasi
port:3389 country:ID           # RDP terbuka di Indonesia
"default password" port:80     # Web server dengan default password
product:"Apache" version:"2.4.49"  # Apache versi vulnerable
ssl.cert.subject.cn:target.com # Sertifikat SSL milik target
"MongoDB Server Information" port:27017  # MongoDB tanpa auth!
vuln:CVE-2021-44228            # Device vulnerable ke Log4Shell
```

#### Recon-ng — Framework OSINT

```bash
# Masuk ke Recon-ng
recon-ng

# Install modules
marketplace install all

# Buat workspace
workspaces create target_recon

# Set target domain
db insert domains target.com

# Jalankan modules
modules load recon/domains-hosts/google_site_web
run

modules load recon/hosts-hosts/resolve
run

# Export hasil
modules load reporting/html
options set FILENAME /tmp/recon_report.html
run
```

### 2.3 Domain Enumeration

```bash
# WHOIS — Informasi registrasi domain
whois target.com
# → Registrant, Admin Contact, Name Servers, Creation/Expiry Date

# DNS Enumeration
dig target.com ANY                  # Semua DNS records
dig target.com MX                   # Mail servers
dig target.com NS                   # Name servers
dig target.com TXT                  # TXT records (SPF, DKIM)
host -t axfr target.com ns1.target.com  # Zone transfer (jika misconfigured!)

# Subdomain Enumeration
subfinder -d target.com -o subdomains.txt
amass enum -d target.com -o amass_output.txt

# DNS Brute Force
dnsenum target.com
fierce --domain target.com
```

### 2.4 Social Media Intelligence (SOCMINT)

| Platform | Apa yang Dicari |
|----------|----------------|
| **LinkedIn** | Karyawan, teknologi stack, job postings (reveal tech used) |
| **GitHub** | Source code, API keys, credentials yang ter-commit |
| **Twitter/X** | Pengumuman, tech talks, employee social engineering targets |
| **Facebook** | Info personal karyawan untuk social engineering |
| **Instagram** | Foto kantor (badge, screen, whiteboard) |

```bash
# GitHub Dorking
# Cari secrets di repositories publik
org:targetcorp password
org:targetcorp api_key
org:targetcorp "BEGIN RSA PRIVATE KEY"
org:targetcorp filename:.env
org:targetcorp filename:wp-config.php
```

---

## 3. OSINT METHODOLOGY

```
┌─────────────────────────────────────────┐
│         OSINT METHODOLOGY               │
├─────────────────────────────────────────┤
│                                         │
│  1. DEFINE SCOPE                        │
│     └── Apa targetnya? Domain? Person?  │
│                                         │
│  2. DOMAIN INTELLIGENCE                 │
│     ├── WHOIS lookup                    │
│     ├── DNS enumeration                 │
│     ├── Subdomain discovery             │
│     └── Certificate transparency        │
│                                         │
│  3. INFRASTRUCTURE MAPPING              │
│     ├── IP ranges & netblocks           │
│     ├── ASN lookup                      │
│     ├── Shodan/Censys scanning          │
│     └── Technology stack fingerprint    │
│                                         │
│  4. PEOPLE INTELLIGENCE                 │
│     ├── Email harvesting                │
│     ├── LinkedIn enumeration            │
│     ├── Social media OSINT             │
│     └── Organizational chart            │
│                                         │
│  5. DATA LEAKS & BREACHES              │
│     ├── HaveIBeenPwned check            │
│     ├── Dehashed / IntelX               │
│     └── Paste sites (Pastebin, etc.)    │
│                                         │
│  6. REPORTING                           │
│     ├── Kompilasi semua temuan          │
│     ├── Identifikasi attack vectors     │
│     └── Risk assessment                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. CONTOH LAPORAN OSINT

```markdown
# OSINT Report — PT Target Indonesia
## Executive Summary
Ditemukan 47 subdomain, 12 email karyawan, 3 exposed services,
dan 2 credential leaks terkait domain target.co.id.

## Findings

### Domain & Infrastructure
- Registrar: Rumahweb
- Name Servers: ns1.cloudflare.com, ns2.cloudflare.com
- IP Range: 103.xx.xx.0/24 (ASN: AS12345)
- Subdomains: 47 ditemukan (lihat Appendix A)
- Critical: dev.target.co.id (exposed without auth)
- Critical: staging-api.target.co.id (debug mode active)

### Email Addresses Found
| Email | Source |
|-------|--------|
| admin@target.co.id | WHOIS record |
| budi.santoso@target.co.id | LinkedIn |
| it-support@target.co.id | Website |

### Exposed Services (Shodan)
| IP | Port | Service | Risk |
|----|------|---------|------|
| 103.xx.xx.10 | 3389 | RDP | HIGH — exposed to internet |
| 103.xx.xx.15 | 27017 | MongoDB | CRITICAL — no auth! |
| 103.xx.xx.20 | 8080 | Jenkins | HIGH — default credentials |

### Credential Leaks
- 3 email addresses found in breach databases
- Recommendation: Force password reset for affected accounts

## Risk Assessment
Overall Risk: HIGH
Immediate action required for exposed MongoDB and RDP services.
```

---

## 5. CHECKLIST PEMAHAMAN P7

- [ ] Apa perbedaan passive dan active reconnaissance?
- [ ] Tulis 5 Google Dork untuk menemukan informasi sensitif
- [ ] Gunakan theHarvester untuk mengumpulkan info domain
- [ ] Jelaskan cara kerja Shodan dan tulis 3 query
- [ ] Apa itu DNS zone transfer dan mengapa berbahaya?
- [ ] Lakukan subdomain enumeration dengan subfinder
- [ ] Apa yang bisa ditemukan dari WHOIS lookup?
- [ ] Bagaimana GitHub bisa menjadi sumber credential leaks?
- [ ] Buat laporan OSINT sederhana untuk target fiktif
- [ ] Sebutkan 5 sumber OSINT selain Google

---

*Selanjutnya: [P8 — Network Scanning & Enumeration](./P8-Network-Scanning.md)*
