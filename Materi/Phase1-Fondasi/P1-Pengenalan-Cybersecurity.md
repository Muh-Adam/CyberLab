# 🛡️ P1 — PENGENALAN CYBERSECURITY & THREAT LANDSCAPE

> *"Security is not a product, but a process."* — Bruce Schneier

---

## 1. APA ITU CYBERSECURITY?

**Cybersecurity** (Keamanan Siber) adalah praktik melindungi sistem, jaringan, program, dan data dari serangan digital. Tujuannya:
- Mencegah akses tidak sah
- Melindungi integritas data
- Menjamin ketersediaan layanan

### Cybersecurity vs Information Security

| Aspek | Cybersecurity | Information Security |
|-------|--------------|---------------------|
| Cakupan | Dunia digital/siber | Semua bentuk informasi (digital + fisik) |
| Fokus | Melindungi dari serangan siber | Melindungi kerahasiaan, integritas, ketersediaan |
| Contoh | Firewall, IDS, enkripsi | Kebijakan akses, klasifikasi dokumen, brankas |

> **Analogi**: Information Security adalah "keamanan rumah secara keseluruhan" (kunci pintu, pagar, CCTV, brankas). Cybersecurity adalah "sistem alarm dan firewall digital" — bagian spesifik dari keamanan informasi yang fokus pada dunia digital.

---

## 2. CIA TRIAD — Fondasi Absolut Keamanan

CIA Triad adalah **tiga pilar utama** keamanan informasi. SEMUA konsep cybersecurity berputar di sekitar ini.

```
            ┌─────────────────┐
            │ CONFIDENTIALITY │
            │  (Kerahasiaan)  │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
  ┌──────────┐              ┌──────────┐
  │INTEGRITY │              │AVAILABILITY│
  │(Integritas)│            │(Ketersediaan)│
  └──────────┘              └──────────┘
```

### 2.1 Confidentiality (Kerahasiaan)

**Definisi**: Memastikan informasi hanya bisa diakses oleh pihak yang berwenang.

**Mekanisme Perlindungan**:
- **Enkripsi** — Mengubah data menjadi format yang tidak bisa dibaca tanpa kunci
- **Access Control** — Membatasi siapa yang bisa mengakses apa
- **Authentication** — Memverifikasi identitas pengguna
- **Classification** — Memberi label tingkat kerahasiaan (Public, Internal, Confidential, Top Secret)

**Contoh Pelanggaran**:
- Data pelanggan bocor karena database tidak dienkripsi
- Karyawan membaca email rekan kerja tanpa izin
- Hacker mencuri password melalui phishing

**Studi Kasus Nyata**: **Facebook-Cambridge Analytica (2018)** — Data 87 juta pengguna Facebook diakses tanpa izin oleh Cambridge Analytica untuk keperluan politik. Ini adalah pelanggaran confidentiality masif yang mengubah regulasi privasi global.

### 2.2 Integrity (Integritas)

**Definisi**: Memastikan data tidak diubah, dihapus, atau dirusak oleh pihak yang tidak berwenang.

**Mekanisme Perlindungan**:
- **Hashing** — Membuat "sidik jari" digital dari data (MD5, SHA-256)
- **Digital Signature** — Membuktikan keaslian dan integritas dokumen
- **Version Control** — Melacak setiap perubahan (seperti Git)
- **Checksums** — Memverifikasi file tidak berubah saat transfer
- **Access Controls** — Membatasi siapa yang bisa memodifikasi data

**Contoh Pelanggaran**:
- Hacker mengubah saldo rekening di database bank
- Man-in-the-Middle attack mengubah konten website
- Malware memodifikasi file sistem operasi

**Studi Kasus Nyata**: **SolarWinds (2020)** — Hacker menyisipkan backdoor ke dalam update software yang sah. Integritas kode sumber dilanggar tanpa terdeteksi selama berbulan-bulan.

### 2.3 Availability (Ketersediaan)

**Definisi**: Memastikan sistem dan data selalu tersedia saat dibutuhkan oleh pengguna yang berwenang.

**Mekanisme Perlindungan**:
- **Redundancy** — Server cadangan, RAID storage
- **Load Balancing** — Mendistribusikan beban ke banyak server
- **Backup** — Salinan data yang teratur
- **DDoS Protection** — Mitigasi serangan yang membanjiri server
- **Disaster Recovery** — Rencana pemulihan jika terjadi bencana

**Contoh Pelanggaran**:
- DDoS attack membuat website tidak bisa diakses
- Ransomware mengenkripsi semua data perusahaan
- Bencana alam menghancurkan data center tanpa backup

**Studi Kasus Nyata**: **Serangan DDoS ke Estonia (2007)** — Seluruh infrastruktur digital Estonia (bank, media, pemerintahan) lumpuh selama berminggu-minggu akibat serangan DDoS masif.

### 2.4 Konsep Tambahan: DAD Triad (Kebalikan CIA)

| CIA | DAD (Ancaman) | Penjelasan |
|-----|---------------|------------|
| Confidentiality | **Disclosure** | Data rahasia terekspos |
| Integrity | **Alteration** | Data diubah tanpa izin |
| Availability | **Destruction/Denial** | Data/layanan dihancurkan/diblokir |

---

## 3. PRINSIP-PRINSIP DASAR KEAMANAN

### 3.1 Defense in Depth (Pertahanan Berlapis)

Tidak mengandalkan satu lapisan keamanan saja. Seperti kastil abad pertengahan: parit → tembok luar → tembok dalam → menara → ruang raja.

```
┌─────────────────────────────────────────┐
│  Layer 1: PHYSICAL (kunci, CCTV, guard) │
│  ┌───────────────────────────────────┐  │
│  │ Layer 2: PERIMETER (firewall)     │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ Layer 3: NETWORK (IDS/IPS)  │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │ Layer 4: HOST (AV,EDR)│  │  │  │
│  │  │  │  ┌─────────────────┐  │  │  │  │
│  │  │  │  │ Layer 5: APP    │  │  │  │  │
│  │  │  │  │  ┌───────────┐  │  │  │  │  │
│  │  │  │  │  │ Layer 6:  │  │  │  │  │  │
│  │  │  │  │  │   DATA    │  │  │  │  │  │
│  │  │  │  │  │(enkripsi) │  │  │  │  │  │
│  │  │  │  │  └───────────┘  │  │  │  │  │
│  │  │  │  └─────────────────┘  │  │  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3.2 Principle of Least Privilege (PoLP)

Setiap user, program, atau proses hanya mendapat hak akses **minimum** yang diperlukan untuk menjalankan tugasnya.

**Contoh**: Seorang kasir hanya perlu akses ke sistem point-of-sale, bukan ke database keuangan perusahaan.

### 3.3 Zero Trust Architecture

**"Never trust, always verify"** — Jangan pernah mempercayai siapapun secara default, baik dari dalam maupun luar jaringan.

Prinsip:
- Verifikasi setiap akses, setiap waktu
- Berikan akses minimum
- Asumsikan breach sudah terjadi
- Monitor dan log segalanya

### 3.4 Security by Design / Shift-Left

Keamanan harus dipikirkan sejak awal pengembangan, bukan ditambahkan di akhir. Memperbaiki kerentanan di tahap desain 100x lebih murah daripada setelah produksi.

---

## 4. JENIS-JENIS ANCAMAN SIBER

### 4.1 Malware (Malicious Software)

| Jenis | Cara Kerja | Contoh Terkenal |
|-------|-----------|-----------------|
| **Virus** | Menempel pada file, aktif saat file dijalankan, mereplikasi diri | ILOVEYOU (2000) |
| **Worm** | Menyebar sendiri tanpa interaksi user melalui jaringan | Morris Worm (1988), WannaCry (2017) |
| **Trojan** | Menyamar sebagai software legit, membuka backdoor | Zeus Banking Trojan |
| **Ransomware** | Mengenkripsi data korban, meminta tebusan | WannaCry, REvil, LockBit |
| **Spyware** | Memata-matai aktivitas user secara diam-diam | Pegasus (NSO Group) |
| **Adware** | Menampilkan iklan yang tidak diinginkan | Fireball |
| **Rootkit** | Menyembunyikan keberadaan malware lain, kontrol level kernel | Sony BMG Rootkit (2005) |
| **Keylogger** | Merekam setiap keystroke | Olympic Vision |
| **Botnet** | Jaringan komputer terinfeksi yang dikendalikan attacker | Mirai (IoT botnet) |
| **Fileless Malware** | Berjalan di memori, tidak meninggalkan file di disk | PowerShell-based attacks |

### 4.2 Social Engineering

Manipulasi psikologis untuk mengelabui manusia agar melakukan tindakan atau memberikan informasi rahasia. **Manusia adalah titik terlemah** dalam rantai keamanan.

| Teknik | Penjelasan | Contoh |
|--------|------------|--------|
| **Phishing** | Email/pesan palsu yang menyerupai sumber terpercaya | "Akun Anda diblokir, klik di sini" |
| **Spear Phishing** | Phishing yang ditargetkan ke individu/organisasi tertentu | Email ke CEO yang menyerupai CFO |
| **Whaling** | Spear phishing yang menargetkan eksekutif tingkat tinggi | Email ke CEO tentang "gugatan hukum" |
| **Vishing** | Phishing via telepon | "Ini dari bank, kami perlu verifikasi PIN" |
| **Smishing** | Phishing via SMS | "Paket Anda tertahan, klik link ini" |
| **Pretexting** | Membuat skenario palsu untuk mendapat kepercayaan | Menyamar sebagai IT support |
| **Baiting** | Menawarkan sesuatu untuk memancing korban | USB berisi malware "ditinggalkan" |
| **Tailgating** | Mengikuti orang berwenang masuk ke area terbatas | Masuk kantor di belakang karyawan |
| **Quid Pro Quo** | Menawarkan bantuan sebagai imbalan informasi | "Saya IT support, berikan password Anda" |

### 4.3 Serangan Jaringan

| Serangan | Penjelasan |
|----------|------------|
| **DDoS** | Membanjiri server dengan traffic sehingga tidak bisa melayani user normal |
| **Man-in-the-Middle (MitM)** | Menyusup di antara komunikasi dua pihak |
| **DNS Spoofing** | Memalsukan respon DNS untuk mengarahkan ke server palsu |
| **ARP Spoofing** | Memalsukan ARP table untuk mengalihkan traffic |
| **Session Hijacking** | Mencuri session token untuk mengambil alih sesi user |

### 4.4 Serangan Aplikasi Web

| Serangan | Penjelasan |
|----------|------------|
| **SQL Injection** | Menyisipkan query SQL berbahaya ke input aplikasi |
| **Cross-Site Scripting (XSS)** | Menyisipkan script berbahaya ke halaman web |
| **Cross-Site Request Forgery (CSRF)** | Memaksa user melakukan aksi tanpa sadar |
| **Remote Code Execution (RCE)** | Menjalankan kode arbitrary di server target |
| **Server-Side Request Forgery (SSRF)** | Membuat server melakukan request ke resource internal |

---

## 5. THREAT ACTORS — Siapa Pelakunya?

| Aktor | Motivasi | Kemampuan | Contoh |
|-------|----------|-----------|--------|
| **Script Kiddies** | Kesenangan, pamer | Rendah — menggunakan tools orang lain | Remaja yang download tool DDoS |
| **Hacktivists** | Ideologi, politik | Menengah | Anonymous, LulzSec |
| **Cybercriminals** | Uang | Menengah–Tinggi | REvil, LockBit (ransomware groups) |
| **Insider Threats** | Dendam, uang, lalai | Bervariasi — punya akses internal | Edward Snowden, karyawan tidak puas |
| **Nation-State (APT)** | Spionase, sabotase, perang | Sangat Tinggi — didanai negara | APT28 (Rusia), APT41 (China), Lazarus (Korea Utara) |
| **Competitors** | Keunggulan bisnis | Menengah | Corporate espionage |
| **Terrorist Groups** | Teror, propaganda | Menengah | ISIS cyber unit |

### Advanced Persistent Threat (APT)

APT adalah serangan yang:
- **Advanced**: Menggunakan teknik canggih, sering kali zero-day exploits
- **Persistent**: Bertahan dalam sistem target selama berbulan-bulan/bertahun-tahun
- **Threat**: Dioperasikan oleh aktor terorganisir dengan tujuan spesifik

Contoh APT terkenal:
- **APT28 (Fancy Bear)** — Rusia, GRU → Target: NATO, pemerintah Barat
- **APT29 (Cozy Bear)** — Rusia, SVR → SolarWinds attack
- **APT41 (Winnti)** — China → Target: gaming, tech, healthcare
- **Lazarus Group** — Korea Utara → Target: bank, cryptocurrency

---

## 6. KONSEP PENTING LAINNYA

### 6.1 Threat vs Vulnerability vs Risk

```
THREAT (Ancaman)          = Potensi bahaya yang bisa mengeksploitasi kelemahan
VULNERABILITY (Kerentanan) = Kelemahan dalam sistem yang bisa dieksploitasi
RISK (Risiko)             = Kemungkinan threat mengeksploitasi vulnerability × dampaknya

RISK = THREAT × VULNERABILITY × IMPACT
```

**Contoh**:
- **Threat**: Hacker yang ingin mencuri data
- **Vulnerability**: Server web menggunakan password default "admin:admin"
- **Impact**: Data 1 juta pelanggan bocor
- **Risk**: TINGGI (threat aktif, vulnerability mudah dieksploitasi, impact besar)

### 6.2 Attack Surface

Area total yang bisa diserang oleh attacker. Semakin besar attack surface, semakin besar risiko.

Komponen attack surface:
- Port yang terbuka
- Aplikasi yang berjalan
- User accounts
- API endpoints
- Physical access points
- Third-party dependencies

### 6.3 Kill Chain (Cyber Kill Chain — Lockheed Martin)

Tahapan serangan siber:

```
1. RECONNAISSANCE    → Mengumpulkan informasi target
2. WEAPONIZATION     → Membuat exploit/payload
3. DELIVERY          → Mengirimkan payload (email, web, USB)
4. EXPLOITATION      → Mengeksploitasi kerentanan
5. INSTALLATION      → Memasang backdoor/malware
6. COMMAND & CONTROL → Mengendalikan sistem dari jarak jauh
7. ACTIONS ON OBJ.   → Mencapai tujuan (exfil data, ransomware)
```

**Mengapa penting?** Defender bisa memutus rantai di tahap manapun. Semakin awal terdeteksi, semakin kecil dampaknya.

### 6.4 MITRE ATT&CK Framework

Framework yang memetakan taktik dan teknik serangan secara komprehensif. Digunakan oleh:
- **Red Team**: Untuk merencanakan serangan
- **Blue Team**: Untuk mendeteksi dan merespons
- **Threat Intelligence**: Untuk memahami aktor ancaman

14 Taktik utama: Reconnaissance → Resource Development → Initial Access → Execution → Persistence → Privilege Escalation → Defense Evasion → Credential Access → Discovery → Lateral Movement → Collection → Command and Control → Exfiltration → Impact

---

## 7. REGULASI & ETIKA KEAMANAN SIBER

### Regulasi Global

| Regulasi | Wilayah | Fokus |
|----------|---------|-------|
| **GDPR** | Uni Eropa | Perlindungan data pribadi |
| **HIPAA** | AS | Data kesehatan |
| **PCI-DSS** | Global | Data kartu pembayaran |
| **SOX** | AS | Pelaporan keuangan |
| **CCPA** | California, AS | Privasi konsumen |

### Regulasi Indonesia

| Regulasi | Tahun | Isi Utama |
|----------|-------|-----------|
| **UU ITE** (No. 11/2008, revisi 2024) | 2008 | Transaksi elektronik, cybercrime, defamasi online |
| **PP PDPB** (UU No. 27/2022) | 2022 | Perlindungan Data Pribadi — "GDPR-nya Indonesia" |
| **Permenkominfo** | Various | Aturan teknis keamanan sistem elektronik |
| **BSSN Guidelines** | Various | Standar keamanan siber nasional |

### Etika Profesi Cybersecurity

1. **Jangan pernah meretas tanpa izin** — Bahkan untuk "kebaikan". Unauthorized access adalah kejahatan.
2. **Responsible Disclosure** — Jika menemukan kerentanan, laporkan ke pemilik sistem, bukan dipublikasikan.
3. **Jaga kerahasiaan** — Data dan temuan klien bersifat rahasia.
4. **Terus belajar** — Ancaman berevolusi, pengetahuan harus ikut.
5. **Gunakan kemampuan untuk melindungi** — *"With great power comes great responsibility."*

### Klasifikasi Hacker

| Tipe | Penjelasan | Legal? |
|------|------------|--------|
| **White Hat** | Hacker etis, meretas dengan izin untuk meningkatkan keamanan | ✅ Ya |
| **Black Hat** | Meretas untuk keuntungan pribadi / merusak | ❌ Tidak |
| **Grey Hat** | Meretas tanpa izin tapi tidak bermaksud jahat | ⚠️ Abu-abu |
| **Red Hat** | White hat yang secara agresif menyerang black hat | ⚠️ Abu-abu |
| **Blue Hat** | External security tester yang diundang perusahaan | ✅ Ya |
| **Green Hat** | Pemula yang sedang belajar | ✅ Ya (jika etis) |

---

## 8. CHECKLIST PEMAHAMAN P1

Setelah mempelajari materi ini, kamu harus bisa menjawab:

- [ ] Apa perbedaan Cybersecurity dan Information Security?
- [ ] Jelaskan CIA Triad dengan contoh masing-masing
- [ ] Apa kebalikan CIA Triad (DAD)?
- [ ] Sebutkan dan jelaskan 5 jenis malware
- [ ] Apa itu social engineering? Sebutkan 5 tekniknya
- [ ] Apa perbedaan threat, vulnerability, dan risk?
- [ ] Sebutkan 5 threat actor dan motivasinya
- [ ] Jelaskan Cyber Kill Chain dan mengapa penting
- [ ] Apa itu Defense in Depth?
- [ ] Apa itu Zero Trust? Apa prinsipnya?
- [ ] Sebutkan 3 regulasi cybersecurity Indonesia
- [ ] Apa perbedaan White Hat, Black Hat, dan Grey Hat?

---

*Selanjutnya: [P2 — Jaringan Komputer untuk Security](./P2-Jaringan-Komputer.md)*
