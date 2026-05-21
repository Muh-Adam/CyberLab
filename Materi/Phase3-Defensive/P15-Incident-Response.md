# 🔬 P15 — INCIDENT RESPONSE & DIGITAL FORENSICS

> *"It's not a matter of IF you'll be breached, but WHEN. Your IR plan determines the damage."*

---

## 1. INCIDENT RESPONSE LIFECYCLE (NIST SP 800-61)

```
┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│1.PREPARE │──►│2.DETECT &    │──►│3.CONTAIN,    │──►│4.POST-       │
│          │   │  ANALYZE     │   │  ERADICATE,  │   │  INCIDENT    │
│          │   │              │   │  RECOVER     │   │  ACTIVITY    │
└──────────┘   └──────────────┘   └──────────────┘   └──────────────┘
     │                                                       │
     └───────────────── Lessons Learned ◄────────────────────┘
```

### Phase 1: Preparation
- IR team & roles terdefinisi
- Playbooks & runbooks tersedia
- Tools forensik siap (jump bag)
- Communication plan (siapa dihubungi, kapan)
- Backup & recovery tested
- Training & tabletop exercises

### Phase 2: Detection & Analysis
- Identifikasi insiden dari alert SIEM, user report, threat intel
- Tentukan severity & scope
- Kumpulkan evidence awal
- Dokumentasi timeline

### Phase 3: Containment, Eradication, Recovery
- **Containment**: Isolasi sistem terinfeksi (cabut dari network, JANGAN matikan!)
- **Eradication**: Hapus malware, tutup vulnerability, reset credentials
- **Recovery**: Restore dari clean backup, monitor closely

### Phase 4: Post-Incident
- Lessons learned meeting
- Update playbooks & detection rules
- Perbaiki gap yang ditemukan
- Incident report final

### Severity Levels

| Level | Nama | Contoh | Response Time |
|-------|------|--------|---------------|
| P1 | Critical | Ransomware aktif, data breach masif | Immediate (< 15 min) |
| P2 | High | Unauthorized access, malware terdeteksi | < 1 jam |
| P3 | Medium | Phishing berhasil, suspicious activity | < 4 jam |
| P4 | Low | Policy violation, scan terdeteksi | < 24 jam |

---

## 2. EVIDENCE COLLECTION & CHAIN OF CUSTODY

### Order of Volatility (Kumpulkan yang PALING VOLATIL duluan!)

```
1. CPU Registers & Cache     ← Hilang dalam nanoseconds
2. RAM / Memory              ← Hilang saat power off (KRITIS!)
3. Network Connections       ← Berubah setiap saat
4. Running Processes         ← Bisa berubah
5. Disk / Storage            ← Persistent tapi bisa di-wipe
6. Removable Media           ← USB, CD
7. Backup / Archive          ← Paling stabil
```

> **ATURAN EMAS**: JANGAN MATIKAN KOMPUTER yang dicurigai! Ambil memory dump dulu. Mematikan = menghilangkan evidence di RAM.

### Chain of Custody

```
CHAIN OF CUSTODY LOG
═══════════════════════════════════════════
Evidence ID: EVD-2025-001
Description: Memory dump server-web-01
Hash (SHA-256): a1b2c3d4e5...

Date/Time          | Action              | Person        | Notes
2025-05-21 10:00   | Acquired            | Analyst A     | Using FTK Imager
2025-05-21 10:15   | Transferred to lab  | Analyst A     | USB encrypted
2025-05-21 11:00   | Received at lab     | Forensic B    | Hash verified ✓
2025-05-21 14:00   | Analysis started    | Forensic B    | Volatility 3
```

### Akuisisi Evidence

```bash
# Memory Dump (Linux)
sudo dd if=/dev/mem of=/mnt/usb/memory.raw bs=1M
# Atau gunakan LiME:
sudo insmod lime.ko "path=/mnt/usb/memory.lime format=lime"

# Disk Image (bit-by-bit copy)
sudo dd if=/dev/sda of=/mnt/external/disk.img bs=4M status=progress
# Atau gunakan dc3dd (forensic dd):
sudo dc3dd if=/dev/sda of=/mnt/external/disk.img hash=sha256 log=acquisition.log

# Hash verification
sha256sum /mnt/external/disk.img > disk_hash.txt
```

---

## 3. MEMORY FORENSICS — VOLATILITY 3

Volatility adalah **tools #1 untuk memory forensics** — menganalisis RAM dump.

### Workflow Dasar

```bash
# === SYSTEM INFO ===
vol3 -f memory.raw windows.info
# → OS version, build, architecture

# === PROCESS ANALYSIS ===
vol3 -f memory.raw windows.pslist
# → List semua proses (seperti Task Manager)

vol3 -f memory.raw windows.pstree
# → Process tree (parent-child relationship)
# Cari: cmd.exe/powershell.exe spawned dari word.exe? → Malware!

vol3 -f memory.raw windows.psscan
# → Scan process termasuk yang HIDDEN (rootkit detection!)

# === NETWORK CONNECTIONS ===
vol3 -f memory.raw windows.netscan
# → Semua koneksi jaringan aktif
# Cari: koneksi ke IP yang tidak dikenal, port aneh

# === COMMAND LINE ===
vol3 -f memory.raw windows.cmdline
# → Command line arguments setiap proses
# Cari: encoded PowerShell, suspicious arguments

# === DLL & INJECTED CODE ===
vol3 -f memory.raw windows.dlllist
# → DLL yang di-load setiap proses

vol3 -f memory.raw windows.malfind
# → Deteksi injected/hidden code di proses
# Cari: executable code di region yang tidak biasa

# === REGISTRY ===
vol3 -f memory.raw windows.registry.hivelist
vol3 -f memory.raw windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"
# → Persistence mechanisms di registry

# === FILE EXTRACTION ===
vol3 -f memory.raw windows.filescan | grep -i "password\|secret\|key"
vol3 -f memory.raw windows.dumpfiles --physaddr 0x12345678
# → Extract file dari memory

# === LINUX MEMORY ===
vol3 -f memory.raw linux.pslist
vol3 -f memory.raw linux.bash
# → Bash history dari memory (bahkan yang sudah di-clear!)
```

### Apa yang Dicari di Memory Analysis?

| Indikator | Artinya |
|-----------|---------|
| svchost.exe spawned dari bukan services.exe | Malware menyamar |
| powershell.exe dari winword.exe | Macro malware |
| Proses tanpa parent | Rootkit / hidden process |
| Koneksi ke IP luar negeri yang aneh | C2 communication |
| Executable code di non-executable region | Code injection |
| Multiple instances dari proses yang biasanya 1 | Process hollowing |

---

## 4. DISK FORENSICS — AUTOPSY

Autopsy adalah GUI forensics tool untuk analisis disk image.

```bash
# Install
sudo apt install autopsy

# Jalankan
autopsy
# → Buka browser: http://localhost:9999/autopsy

# Workflow:
# 1. New Case → masukkan case info
# 2. Add Data Source → disk image (.raw, .E01, .dd)
# 3. Run Ingest Modules:
#    - Hash Lookup (NSRL — known good files)
#    - Keyword Search ("password", "secret")
#    - Web Artifacts (browser history, cookies)
#    - Recent Documents
#    - Email Parser
#    - Deleted Files Recovery
# 4. Analyze results → timeline, file system, artifacts
```

### Artifacts Forensik Penting

| Artifact | Lokasi (Windows) | Informasi |
|----------|-------------------|-----------|
| **Prefetch** | C:\Windows\Prefetch | Program yang pernah dijalankan |
| **Amcache** | C:\Windows\AppCompat | Execution history |
| **ShimCache** | Registry | Program execution evidence |
| **Jump Lists** | AppData\Recent | Recent files per program |
| **LNK Files** | Desktop, Recent | Shortcut — bukti file access |
| **Browser History** | AppData\Local | Website yang dikunjungi |
| **Event Logs** | C:\Windows\System32\winevt | Activity logs |
| **$MFT** | Root NTFS | Master File Table — semua file info |
| **USB Artifacts** | Registry\USBSTOR | USB devices yang pernah terhubung |

---

## 5. MALWARE ANALYSIS BASICS

### Static Analysis (Tanpa menjalankan malware)

```bash
# File info
file suspicious.exe
strings suspicious.exe | head -50    # Readable strings
strings suspicious.exe | grep -iE "http|url|password|cmd|shell"

# Hash & VirusTotal
sha256sum suspicious.exe
# Upload hash ke virustotal.com

# PE analysis (Windows executables)
pefile suspicious.exe               # Python library
pestudio suspicious.exe             # GUI tool
```

### Dynamic Analysis (Menjalankan di sandbox — HATI-HATI!)

```bash
# Jalankan di VM terisolasi (snapshot dulu!)
# Monitor:
# - Process creation (ProcMon)
# - Network traffic (Wireshark)
# - File changes (RegShot)
# - Registry changes (RegShot)

# Automated sandbox:
# - Cuckoo Sandbox (open source)
# - Any.Run (online)
# - Hybrid Analysis (online)
```

---

## 6. INCIDENT REPORT TEMPLATE

```markdown
# INCIDENT REPORT
## IR-2025-042: Ransomware Infection on Finance Server

### Executive Summary
Pada 21 Mei 2025, ransomware LockBit terdeteksi di server finance
(SRV-FIN-01). Containment dilakukan dalam 45 menit. Tidak ada data
exfiltration terdeteksi. Recovery dari backup selesai dalam 4 jam.

### Timeline
| Waktu | Event |
|-------|-------|
| 09:15 | SIEM alert: suspicious PowerShell execution |
| 09:20 | Tier 1 escalate ke Tier 2 |
| 09:30 | Tier 2 confirm: ransomware aktif |
| 09:35 | Containment: server diisolasi dari network |
| 10:00 | Memory dump acquired |
| 10:30 | Malware identified: LockBit 3.0 |
| 11:00 | Eradication: clean reimage initiated |
| 13:15 | Recovery: restore dari backup (RPO: 4 jam) |
| 14:00 | Monitoring: no further IOC detected |

### Root Cause
Phishing email dengan attachment Word macro →
user membuka → macro download LockBit →
lateral movement via compromised service account

### Impact
- 1 server terinfeksi (SRV-FIN-01)
- 4 jam data loss (restored from backup)
- No customer data exfiltrated

### IOCs
| Type | Value |
|------|-------|
| SHA-256 | a1b2c3d4... |
| C2 IP | 185.xx.xx.xx |
| Domain | evil-update.com |
| Email | sender@phish.com |

### Recommendations
1. Block email sender di gateway
2. Disable Office macros untuk non-admin users
3. Implement application whitelisting
4. Reset compromised service account
5. Additional phishing awareness training
```

---

## 7. CHECKLIST PEMAHAMAN P15

- [ ] Jelaskan 4 fase IR lifecycle (NIST SP 800-61)
- [ ] Apa itu Order of Volatility dan mengapa penting?
- [ ] Mengapa JANGAN mematikan komputer saat insiden?
- [ ] Gunakan Volatility 3 untuk analisis memory dump
- [ ] Identifikasi proses mencurigakan dari pslist/pstree
- [ ] Jelaskan chain of custody dan fungsinya
- [ ] Sebutkan 5 Windows forensic artifacts
- [ ] Buat incident report lengkap
- [ ] Apa perbedaan static dan dynamic malware analysis?
- [ ] Lakukan disk forensics dengan Autopsy

---

*Selanjutnya: [P16 — Network Defense & IDS/IPS](./P16-Network-Defense.md)*
