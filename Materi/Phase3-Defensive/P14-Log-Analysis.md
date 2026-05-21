# 📊 P14 — LOG ANALYSIS & THREAT DETECTION

> *"Logs don't lie. But you have to know how to read them."*

---

## 1. JENIS-JENIS LOG

### Windows Event Logs

| Event ID | Kategori | Arti | Mengapa Penting |
|----------|----------|------|-----------------|
| **4624** | Logon | Login berhasil | Tracking akses normal |
| **4625** | Logon | Login GAGAL | Brute force detection |
| **4634** | Logon | Logoff | Session tracking |
| **4648** | Logon | Explicit credentials logon | Lateral movement (runas) |
| **4672** | Logon | Special privileges assigned | Admin login detection |
| **4688** | Process | Proses baru dibuat | Malware execution detection |
| **4689** | Process | Proses berakhir | Process lifecycle |
| **4697** | System | Service installed | Persistence mechanism |
| **4698** | Task | Scheduled task created | Persistence mechanism |
| **4720** | Account | User account created | Unauthorized account creation |
| **4724** | Account | Password reset attempt | Account takeover |
| **4732** | Group | Member added to security group | Privilege escalation |
| **4768** | Kerberos | TGT requested | Kerberoasting detection |
| **4769** | Kerberos | Service ticket requested | Lateral movement |
| **4776** | Auth | Credential validation (NTLM) | Pass-the-Hash detection |
| **7045** | System | New service installed | Persistence |
| **1102** | Audit | Audit log cleared | Covering tracks! |

### Logon Type (Event 4624/4625)

| Type | Nama | Penjelasan |
|------|------|------------|
| 2 | Interactive | Login langsung di keyboard |
| 3 | Network | Login via network (SMB, file share) |
| 4 | Batch | Scheduled task |
| 5 | Service | Service startup |
| 7 | Unlock | Workstation unlock |
| 8 | NetworkCleartext | HTTP Basic auth (password plaintext!) |
| 9 | NewCredentials | RunAs /netonly |
| 10 | RemoteInteractive | RDP login |
| 11 | CachedInteractive | Login dengan cached credentials |

### Linux Logs

```bash
# === FILE LOG UTAMA ===
/var/log/auth.log        # Authentication events (SSH, sudo, su)
/var/log/syslog          # General system log
/var/log/kern.log        # Kernel messages
/var/log/daemon.log      # Background services
/var/log/apache2/        # Apache web server
  ├── access.log         # HTTP requests
  └── error.log          # Errors
/var/log/nginx/          # Nginx web server
/var/log/fail2ban.log    # Fail2ban actions
/var/log/audit/audit.log # Auditd events (jika diaktifkan)
/var/log/cron.log        # Cron job executions

# === BACA LOG ===
tail -f /var/log/auth.log              # Real-time monitoring
grep "Failed password" /var/log/auth.log  # Login gagal
journalctl -u sshd --since "1 hour ago"  # Systemd journal
```

---

## 2. ANALISIS LOG SERANGAN

### 2.1 Mendeteksi Brute Force SSH

```bash
# auth.log pattern untuk SSH brute force:
May 21 10:15:01 server sshd[1234]: Failed password for root from 10.0.0.5 port 54321 ssh2
May 21 10:15:02 server sshd[1234]: Failed password for root from 10.0.0.5 port 54322 ssh2
May 21 10:15:03 server sshd[1234]: Failed password for root from 10.0.0.5 port 54323 ssh2
May 21 10:15:04 server sshd[1234]: Failed password for admin from 10.0.0.5 port 54324 ssh2
# → Banyak gagal dari 1 IP, coba berbagai username = BRUTE FORCE!

# Analisis:
# Top IP dengan login gagal
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head

# Top username yang dicoba
grep "Failed password" /var/log/auth.log | awk '{print $(NF-5)}' | sort | uniq -c | sort -rn | head

# Timeline serangan
grep "Failed password" /var/log/auth.log | grep "10.0.0.5" | awk '{print $1,$2,$3}'

# Apakah ada yang berhasil login setelah brute force?
grep "Accepted password" /var/log/auth.log | grep "10.0.0.5"
```

### 2.2 Mendeteksi Web Attacks dari Access Log

```bash
# Apache/Nginx access.log format:
# IP - - [timestamp] "METHOD /path HTTP/1.1" status size "referer" "user-agent"

# SQL Injection attempts
grep -iE "(union|select|insert|update|delete|drop|--|;|'|%27)" /var/log/apache2/access.log

# XSS attempts
grep -iE "(<script|%3Cscript|onerror|onload|javascript:)" /var/log/apache2/access.log

# Directory traversal
grep -iE "(\.\.\/|\.\.\\\\|%2e%2e)" /var/log/apache2/access.log

# Scanner/tool detection
grep -iE "(nikto|sqlmap|nmap|masscan|dirb|gobuster)" /var/log/apache2/access.log

# Abnormal HTTP methods
grep -vE "(GET|POST|HEAD)" /var/log/apache2/access.log

# 404 flood (directory brute force)
awk '$9 == 404 {print $1}' /var/log/apache2/access.log | sort | uniq -c | sort -rn | head

# Large response sizes (data exfiltration?)
awk '$10 > 1000000 {print $0}' /var/log/apache2/access.log
```

---

## 3. MITRE ATT&CK FRAMEWORK

MITRE ATT&CK memetakan **taktik** (WHY) dan **teknik** (HOW) yang digunakan adversary.

### 14 Taktik ATT&CK

| ID | Taktik | Deskripsi | Contoh Teknik |
|----|--------|-----------|---------------|
| TA0043 | Reconnaissance | Gathering info target | OSINT, scanning |
| TA0042 | Resource Dev | Menyiapkan infrastruktur | Beli domain, buat malware |
| TA0001 | Initial Access | Masuk ke target | Phishing, exploit public app |
| TA0002 | Execution | Menjalankan kode | PowerShell, CMD, scripting |
| TA0003 | Persistence | Tetap ada setelah reboot | Registry run key, cron, service |
| TA0004 | Privilege Escalation | Naik hak akses | SUID, sudo, kernel exploit |
| TA0005 | Defense Evasion | Menghindari deteksi | Obfuscation, disable AV |
| TA0006 | Credential Access | Mencuri credentials | Mimikatz, keylogger |
| TA0007 | Discovery | Mempelajari environment | ipconfig, whoami, net user |
| TA0008 | Lateral Movement | Pindah antar sistem | PtH, RDP, PsExec |
| TA0009 | Collection | Mengumpulkan data target | Screen capture, keylog |
| TA0011 | Command & Control | Komunikasi ke C2 server | HTTP/DNS C2, reverse shell |
| TA0010 | Exfiltration | Mengeluarkan data | Upload ke cloud, DNS tunnel |
| TA0040 | Impact | Merusak/disrupt | Ransomware, wiper, DDoS |

### Threat Hunting dengan ATT&CK

```
Hypothesis-Driven Hunting:
1. Hipotesis: "Adversary mungkin menggunakan PowerShell encoded 
   commands untuk execution (T1059.001)"
2. Data Source: Windows Event Log (Event ID 4688, Sysmon Event 1)
3. Query: Cari powershell.exe dengan -enc atau -EncodedCommand
4. Analisis: Decode Base64 → apakah malicious?
5. Result: True/False positive → update detection rule
```

---

## 4. ZEEK (BRO) — Network Traffic Logging

Zeek menganalisis traffic jaringan dan menghasilkan log terstruktur.

```bash
# Zeek log types:
conn.log     # Semua koneksi (IP, port, duration, bytes)
dns.log      # DNS queries dan responses
http.log     # HTTP requests/responses
ssl.log      # TLS/SSL connections
files.log    # File transfers
weird.log    # Anomali protokol
notice.log   # Alerts dari Zeek

# Analisis Zeek logs:
# DNS tunneling detection (query dengan subdomain sangat panjang)
awk -F'\t' 'length($10) > 50 {print $10}' dns.log

# Koneksi ke port yang tidak biasa
awk -F'\t' '$5 !~ /^(80|443|53|22|25)$/ && $8 > 1000000' conn.log

# HTTP requests mencurigakan
grep -i "sqlmap\|nikto\|nmap" http.log
```

---

## 5. THREAT HUNTING REPORT TEMPLATE

```markdown
# Threat Hunting Report

## Hunt Hypothesis
Adversary menggunakan DNS tunneling untuk C2 communication

## Data Sources
- Zeek dns.log
- ELK Stack DNS index
- Firewall DNS logs

## Investigation Steps
1. Query DNS log untuk subdomain > 50 karakter
2. Identifikasi domain dengan entropy tinggi
3. Korelasikan dengan known-bad IOC feeds
4. Cek volume DNS query per host (anomaly baseline)

## Findings
| Indicator | Value | Assessment |
|-----------|-------|------------|
| Domain | x8k2m.evil.com | MALICIOUS — C2 domain |
| Source IP | 192.168.1.50 | Host terinfeksi |
| Query Count | 4,521/hour | Abnormal (baseline: 100/hour) |
| First Seen | 2025-05-15 03:00 | After-hours activity |

## MITRE ATT&CK Mapping
- T1071.004 — Application Layer Protocol: DNS
- T1041 — Exfiltration Over C2 Channel

## Recommendations
1. Block domain evil.com di DNS sinkhole
2. Isolate host 192.168.1.50
3. Full forensics investigation pada host
4. Add detection rule untuk DNS query length > 50
```

---

## 6. CHECKLIST PEMAHAMAN P14

- [ ] Sebutkan 10 Windows Event ID penting dan artinya
- [ ] Analisis auth.log untuk deteksi brute force
- [ ] Analisis access.log untuk deteksi SQL injection
- [ ] Jelaskan 14 taktik MITRE ATT&CK
- [ ] Lakukan threat hunting berdasarkan hipotesis
- [ ] Tulis threat hunting report
- [ ] Map teknik serangan ke MITRE ATT&CK
- [ ] Identifikasi IOC dari log analysis
- [ ] Apa itu Zeek dan jenis log yang dihasilkan?
- [ ] Perbedaan reactive detection vs proactive threat hunting

---

*Selanjutnya: [P15 — Incident Response & Digital Forensics](./P15-Incident-Response.md)*
