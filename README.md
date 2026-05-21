# 🛡️ Cybersecurity Engineer Bootcamp Roadmap & Interactive Portal

> *"The only truly secure system is one that is powered off, cast in a block of concrete, and sealed in a lead-lined room with armed guards."* — Gene Spafford

Selamat datang di **Cybersecurity Engineer Bootcamp**. Ini adalah repositori pembelajaran komprehensif yang dirancang untuk membimbing Anda dari konsep fondasi dasar hingga keahlian tingkat lanjut (advanced) dalam dunia keamanan siber. 

Proyek ini mencakup kurikulum sistematis **24 pertemuan** yang dibagi menjadi **5 Phase**, dilengkapi dengan portal web interaktif premium serta **8 Lab Simulasi** yang dapat dijalankan langsung di browser Anda.

---

## 🗺️ Peta Kurikulum (24 Pertemuan)

Materi disusun secara berjenjang untuk memastikan pemahaman teori yang kuat dan keterampilan praktis yang siap kerja.

```
FONDASI (P1-P6) ──► OFFENSIVE (P7-P12) ──► DEFENSIVE (P13-P17) ──► ADVANCED (P18-P23) ──► FINAL (P24)
```

### 1. Phase 1 — Fondasi Keamanan & Jaringan 🌐
Membangun fondasi dasar sistem operasi, jaringan komputer, dan teori kriptografi.
*   **P1:** Pengenalan Cybersecurity, CIA Triad, Threat Modeling, & Cyber Kill Chain.
*   **P2:** Jaringan Komputer untuk Security (OSI, TCP/IP, DNS, TLS, Wireshark).
*   **P3:** Linux Fundamentals (Filesystem, CLI, Permissions, & Bash Scripting).
*   **P4:** Linux Networking & Hardening (SSH Hardening, Firewall UFW/IPTables, Fail2ban).
*   **P5:** Kriptografi: Konsep & Implementasi (Symmetric, Asymmetric, Hashing, Signatures).
*   **P6:** PKI, TLS/SSL, & Certificate Management.

### 2. Phase 2 — Offensive Security (Ethical Hacking) 💥
Mempelajari taktik, teknik, dan prosedur penyerangan untuk menguji ketangguhan sistem.
*   **P7:** Reconnaissance & OSINT (Google Dorking, Shodan, Recon Methodology).
*   **P8:** Network Scanning & Service Enumeration (Nmap, Vulnerability Scanning).
*   **P9:** Exploitation Fundamentals & Metasploit (Buffer Overflow, Reverse Shells, msfvenom).
*   **P10:** Web Application Hacking: OWASP Top 10 - Part 1 (SQLi, Auth Bypass, IDOR).
*   **P11:** Web Application Hacking: OWASP Top 10 - Part 2 (XSS, CSRF, SSRF, XXE).
*   **P12:** Privilege Escalation & Post-Exploitation (Linux/Windows Privesc, Lateral Movement).

### 3. Phase 3 — Defensive Security (Blue Team) 🛡️
Fokus pada pemantauan, deteksi ancaman, analisis log, dan penanganan insiden.
*   **P13:** Security Operations Center (SOC) & SIEM (SOC Tiers, ELK Stack, KQL).
*   **P14:** Log Analysis & Threat Detection (Windows/Linux Logs, MITRE ATT&CK).
*   **P15:** Incident Response & Digital Forensics (Volatility, Autopsy, Evidence Handling).
*   **P16:** Network Defense: Firewall, IDS/IPS (Suricata Rules, Honeypots, Segmentation).
*   **P17:** Endpoint Security & EDR (Wazuh Agent/Server, YARA Rules, Threat Intel).

### 4. Phase 4 — Advanced & Specialized Topics ☁️
Topik tingkat lanjut yang mencakup modern cloud, siklus rilis aman, dan tata kelola keamanan.
*   **P18:** Cloud Security (Shared Responsibility, AWS IAM, Docker & K8s Hardening).
*   **P19:** DevSecOps & Secure SDLC (SAST/DAST, Software Composition Analysis, Gitleaks).
*   **P20:** API Security & Modern Application Security (OWASP API Top 10, JWT Attacks).
*   **P21:** Vulnerability Management & Laporan Pentest Profesional (CVSS Scoring, OpenVAS).
*   **P22:** Governance, Risk, & Compliance (ISO 27001, NIST CSF, UU PDP Indonesia).
*   **P23:** Career Development, Portofolio & Sertifikasi Industri (eJPT, Sec+, OSCP, CISSP).

### 5. Phase 5 — Final Project ⚔️
*   **P24:** Final Project: Red Team vs Blue Team Live Simulation & Reporting.

---

## 🧪 Portal Web Interaktif & Lab Simulasi

Repositori ini dilengkapi dengan portal web modern bertema **Premium Dark** yang menyajikan seluruh modul pembelajaran secara dinamis di satu tempat, lengkap dengan **8 Simulator Lab Keamanan** yang berjalan secara klien-sisi (client-side):

1.  **🔐 Lab Kriptografi:** Enkripsi/Dekripsi Caesar Cipher, Base64 converter, Generator Hash (MD5, SHA-256, SHA-512), dan enkripsi tingkat tinggi AES-256-GCM menggunakan Web Crypto API.
2.  **💉 Simulator SQL Injection:** Login page interaktif yang mensimulasikan login rentan vs aman (Prepared Statements), visualisasi query SQL mentah yang diinjeksi, dan dumping database simulator.
3.  **🕸️ Lab XSS Attack:** Visualisasi side-by-side output rentan (Reflected XSS) dengan output aman (HTML Escaped) secara real-time.
4.  **🔑 Password Strength Analyzer:** Alat analisis kekuatan sandi real-time yang memprediksi waktu pembongkaran sandi (crack time) menggunakan komputasi brute-force GPU.
5.  **🎫 JWT Decoder:** Pengurai header dan payload JSON Web Token dengan pemeriksaan otomatis terhadap algoritma rentan (`none` atau rawan HMAC brute force).
6.  **📡 Network Tools:** Kalkulator Subnet IP/CIDR interaktif dan tabel referensi cepat 30 port jaringan umum.
7.  **📊 CVSS v3.1 Calculator:** Kalkulator interaktif penentu tingkat kerawanan kerentanan berdasarkan metrik dasar NIST (Attack Vector, Scope, CIA Impact, dll).
8.  **🔬 File Hex Viewer & Hash:** Analisis byte file lokal, deteksi *magic bytes* (tipe file), dan penghitungan SHA-256 checksum secara instan.

---

## 🚀 Cara Menjalankan Portal Web

Portal web ini bersifat statis dan mandiri, tidak memerlukan instalasi backend yang rumit.

### Metode 1: Buka Langsung (Tanpa Instalasi)
Cukup navigasikan ke folder `/website/` dan klik ganda file **`index.html`** untuk membukanya di browser favorit Anda.

### Metode 2: Menggunakan Local Web Server (Python)
Untuk memastikan fungsionalitas browser yang lebih lancar (terutama saat menangani pembacaan file lokal), Anda dapat menjalankan web server lokal:

```bash
# Masuk ke folder website
cd website/

# Jalankan server bawaan Python
python3 -m http.server 8000
```
Setelah itu, buka browser Anda dan akses: `http://localhost:8000`

---

## 🔨 Cara Memperbarui Website (Build Script)

Jika Anda melakukan perubahan atau penambahan pada file materi berformat `.md` di dalam folder `Materi/`, Anda dapat memperbarui konten web portal secara otomatis dengan build script Python yang disediakan:

```bash
# Menjalankan build script untuk memperbarui website/index.html
python3 website/build.py
```

---

## 📁 Struktur Repositori

```
├── README.md               # Dokumentasi utama proyek ini
├── Materi/                 # File sumber markdown pelajaran (.md)
│   ├── 00-Roadmap/
│   ├── Phase1-Fondasi/
│   ├── Phase2-Offensive/
│   ├── Phase3-Defensive/
│   ├── Phase4-Advanced/
│   └── Phase5-Final/
└── website/                # File portal web interaktif
    ├── build.py            # Script generator index.html otomatis
    ├── index.html          # File web utama yang berisi materi & lab
    ├── style.css           # Styling visual web (Premium Dark Theme)
    ├── labs.css            # Styling khusus komponen lab simulator
    ├── app.js              # Logika kontrol web (Navigasi, search, progress)
    ├── labs.js             # Engine simulasi keamanan (kripto, SQLi, dsb)
    └── labs-ui.js          # Logika visual & integrasi lab ke antarmuka web
```

---

## ⚠️ Disclaimer

Seluruh simulasi eksploitasi, taktik serangan, dan kode pengujian dalam repositori ini disediakan **hanya untuk tujuan edukasi dan peningkatan kesadaran keamanan**. Pengujian sistem secara ofensif hanya boleh dilakukan pada lingkungan lab milik sendiri atau sistem yang telah memberikan izin resmi tertulis. Penyalahgunaan taktik di luar batas hukum sepenuhnya menjadi tanggung jawab masing-masing individu.
