# 📡 P8 — NETWORK SCANNING & ENUMERATION

> *"You can't hack what you can't see."* — Scanning adalah mata dan telinga pentester.

---

## 1. SCANNING DALAM PENETRATION TESTING

```
RECON (P7) ──► SCANNING (kamu di sini) ──► EXPLOITATION ──► POST-EXPLOITATION
               │
               ├── Port Scanning (apa yang terbuka?)
               ├── Service Enumeration (apa yang berjalan?)
               ├── Version Detection (versi berapa?)
               ├── OS Detection (OS apa?)
               └── Vulnerability Scanning (ada celah apa?)
```

---

## 2. NMAP — Network Mapper (Raja Scanning)

Nmap adalah **tools scanning paling penting** dalam cybersecurity. Wajib dikuasai.

### 2.1 Scan Types

```bash
# === HOST DISCOVERY ===
nmap -sn 192.168.1.0/24           # Ping sweep (host mana yang hidup?)
nmap -sn -PS22,80,443 192.168.1.0/24  # TCP SYN ping ke port tertentu
nmap -sn -PE 192.168.1.0/24       # ICMP echo ping

# === PORT SCANNING ===

# TCP SYN Scan (Half-Open / Stealth Scan) — DEFAULT & RECOMMENDED
sudo nmap -sS 192.168.1.100
# Cara kerja: Kirim SYN → jika SYN-ACK → port OPEN → kirim RST (batal)
# Keunggulan: Cepat, tidak membuat koneksi penuh (kurang terdeteksi)

# TCP Connect Scan (tanpa root)
nmap -sT 192.168.1.100
# Cara kerja: Full TCP handshake (SYN → SYN-ACK → ACK)
# Keunggulan: Tidak butuh root privilege
# Kekurangan: Lebih mudah terdeteksi (log koneksi penuh)

# UDP Scan (lambat tapi penting!)
sudo nmap -sU 192.168.1.100
# Banyak service kritis di UDP: DNS(53), DHCP(67), SNMP(161), TFTP(69)

# Scan semua port (default hanya top 1000)
sudo nmap -p- 192.168.1.100       # Scan port 1-65535
sudo nmap -p 1-1000 target        # Range tertentu
sudo nmap -p 22,80,443,8080 target # Port spesifik
sudo nmap -p U:53,161,T:80,443 target  # Campuran UDP & TCP

# Scan cepat (top 100 ports)
sudo nmap -F 192.168.1.100

# === SERVICE & VERSION DETECTION ===
sudo nmap -sV 192.168.1.100       # Deteksi versi service
sudo nmap -sV --version-intensity 5 target  # Lebih agresif

# === OS DETECTION ===
sudo nmap -O 192.168.1.100        # Deteksi OS
sudo nmap -O --osscan-guess target # Tebakan lebih agresif

# === COMPREHENSIVE SCAN (gabungan) ===
sudo nmap -sS -sV -O -A 192.168.1.100
# -A = Aggressive: OS detection + version + script + traceroute

# === STEALTH & EVASION ===
sudo nmap -sS -T2 --data-length 50 target   # Lambat + padding
sudo nmap -sS -f target                      # Fragment packets
sudo nmap -sS -D RND:5 target               # Decoy scan (campur dengan IP palsu)
sudo nmap -sS --source-port 53 target        # Spoof source port (DNS)
```

### 2.2 Nmap Timing Templates

| Template | Flag | Speed | Use Case |
|----------|------|-------|----------|
| Paranoid | `-T0` | Sangat lambat | IDS evasion |
| Sneaky | `-T1` | Lambat | IDS evasion |
| Polite | `-T2` | Sopan | Tidak membebani network |
| Normal | `-T3` | Default | Scanning biasa |
| Aggressive | `-T4` | Cepat | Jaringan reliable |
| Insane | `-T5` | Sangat cepat | Jaringan lokal lab |

### 2.3 Nmap Output Formats

```bash
# Normal output
nmap target -oN scan_result.txt

# XML (untuk tools lain)
nmap target -oX scan_result.xml

# Grepable (untuk awk/grep)
nmap target -oG scan_result.gnmap

# Semua format sekaligus
nmap target -oA scan_results    # Buat .nmap, .xml, .gnmap
```

### 2.4 NSE — Nmap Scripting Engine

NSE memungkinkan Nmap menjalankan **script** untuk tugas spesifik.

```bash
# Kategori script
nmap --script-help default        # Lihat default scripts

# Vulnerability scanning
sudo nmap --script vuln 192.168.1.100
# → Cek Heartbleed, MS17-010, dll

# Script spesifik
sudo nmap --script http-enum target        # Enumerate web directories
sudo nmap --script smb-vuln-ms17-010 target  # Check EternalBlue
sudo nmap --script ssh-brute target        # SSH brute force
sudo nmap --script dns-brute target        # DNS subdomain brute
sudo nmap --script http-sql-injection target # SQL injection check
sudo nmap --script ssl-heartbleed target   # Heartbleed check

# Multiple scripts
sudo nmap --script "smb-vuln-*" target     # Semua SMB vulnerability scripts
sudo nmap --script "http-*" target         # Semua HTTP scripts

# Script dengan arguments
sudo nmap --script http-brute --script-args \
    http-brute.path=/admin target
```

### 2.5 Membaca Output Nmap

```
PORT      STATE    SERVICE     VERSION
22/tcp    open     ssh         OpenSSH 7.6p1 Ubuntu 4ubuntu0.3
80/tcp    open     http        Apache httpd 2.4.29 ((Ubuntu))
443/tcp   open     ssl/http    Apache httpd 2.4.29
3306/tcp  filtered mysql
8080/tcp  closed   http-proxy

STATE meanings:
- open     → Port accepting connections (target utama!)
- closed   → Port accessible tapi tidak ada service
- filtered → Firewall/filter memblokir (tidak bisa ditentukan)
```

---

## 3. SERVICE ENUMERATION

Setelah tahu port terbuka, langkah selanjutnya adalah **enumerate** (mengumpulkan detail) setiap service.

### 3.1 SMB Enumeration (Port 445)

```bash
# Enumerate shares
smbclient -L //target -N           # List shares (no password)
smbmap -H target                    # Map shares & permissions
enum4linux -a target                # All-in-one SMB enumeration

# Connect ke share
smbclient //target/share -N        # Connect tanpa password
smbclient //target/share -U username

# Nmap SMB scripts
nmap --script smb-enum-shares,smb-enum-users target
nmap --script smb-vuln-* target    # Check SMB vulnerabilities
```

### 3.2 FTP Enumeration (Port 21)

```bash
# Check anonymous login
ftp target
# Username: anonymous
# Password: (kosong atau email)

# Nmap FTP scripts
nmap --script ftp-anon target       # Check anonymous access
nmap --script ftp-brute target      # Brute force
```

### 3.3 SSH Enumeration (Port 22)

```bash
# Banner grabbing
nc -v target 22
ssh -v target                       # Verbose connection (lihat info)

# Nmap SSH scripts
nmap --script ssh-auth-methods target  # Authentication methods
nmap --script ssh2-enum-algos target   # Supported algorithms
```

### 3.4 HTTP/HTTPS Enumeration (Port 80/443)

```bash
# Whatweb — Technology fingerprinting
whatweb target.com

# Nikto — Web vulnerability scanner
nikto -h http://target.com

# Directory brute force
dirb http://target.com /usr/share/wordlists/dirb/common.txt
gobuster dir -u http://target.com -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
feroxbuster -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/common.txt

# Curl — Manual inspection
curl -I http://target.com           # Headers only
curl -v https://target.com          # Verbose (lihat TLS info)
curl http://target.com/robots.txt   # Robots.txt (sering reveal paths!)
```

### 3.5 SNMP Enumeration (Port 161 UDP)

```bash
# SNMP walk (jika community string diketahui)
snmpwalk -v2c -c public target
snmpwalk -v2c -c public target 1.3.6.1.2.1.1  # System info

# Brute force community strings
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt target

# Nmap
nmap -sU -p 161 --script snmp-brute target
```

---

## 4. VULNERABILITY SCANNING

### 4.1 OpenVAS (GVM) — Open Source Vulnerability Scanner

```bash
# Setup (di VM Ubuntu)
sudo apt install gvm
sudo gvm-setup         # Setup awal (lama, ~30 menit)
sudo gvm-start         # Start service

# Akses via browser: https://localhost:9392
# Default: admin / (password dari setup)

# Workflow:
# 1. Buat Target → masukkan IP/range
# 2. Buat Task → pilih scan config (Full and fast)
# 3. Start Task → tunggu selesai
# 4. View Report → analisis hasil
```

### 4.2 Nessus — Industry Standard (Free: Nessus Essentials)

```
Nessus Essentials (gratis, max 16 IP):
1. Download dari tenable.com
2. Install di Kali/Ubuntu
3. Akses https://localhost:8834
4. Buat scan → masukkan target → run
5. Hasil: vulnerability dengan CVSS score & remediation
```

---

## 5. NETWORK MAPPING

```bash
# Discover semua host di network
sudo nmap -sn 192.168.1.0/24 -oG - | grep "Up" | awk '{print $2}'

# Comprehensive network map
sudo nmap -sS -sV -O 192.168.1.0/24 -oX network_map.xml

# Visualisasi dengan Zenmap (GUI Nmap)
zenmap    # Import XML, generate topology map
```

---

## 6. CHEAT SHEET: Nmap Commands yang Paling Sering Dipakai

```bash
# Quick scan (reconnaissance awal)
sudo nmap -sS -sV -O -T4 --top-ports 1000 target -oA quick_scan

# Full scan (comprehensive)
sudo nmap -sS -sV -O -sC -p- -T4 target -oA full_scan

# Vulnerability scan
sudo nmap --script vuln -p- target -oA vuln_scan

# Stealth scan
sudo nmap -sS -T2 -f --data-length 24 -D RND:5 target

# UDP scan (top 100)
sudo nmap -sU --top-ports 100 -sV target

# Specific service deep dive
sudo nmap -p 445 --script "smb-vuln-*" target
sudo nmap -p 80,443 --script "http-*" target
```

---

## 7. CHECKLIST PEMAHAMAN P8

- [ ] Apa perbedaan SYN scan, Connect scan, dan UDP scan?
- [ ] Kapan menggunakan timing template T2 vs T4?
- [ ] Lakukan full port scan dan interpretasi hasilnya
- [ ] Gunakan NSE untuk vulnerability scanning
- [ ] Enumerate SMB shares pada target
- [ ] Lakukan directory brute force pada web server
- [ ] Apa perbedaan port open, closed, dan filtered?
- [ ] Setup dan jalankan OpenVAS scan
- [ ] Export hasil scan Nmap dalam format XML
- [ ] Buat network map dari hasil scanning

---

*Selanjutnya: [P9 — Exploitation Fundamentals & Metasploit](./P9-Exploitation-Metasploit.md)*
