# ⚔️ P24 — FINAL PROJECT: RED TEAM vs BLUE TEAM SIMULATION

---

## 1. OVERVIEW

Final project mengintegrasikan **seluruh kompetensi** dari 23 pertemuan sebelumnya ke dalam simulasi Red Team vs Blue Team yang realistis.

```
┌─────────────────────────────────────────────────────────┐
│                    LAB ENVIRONMENT                       │
│                                                          │
│  ATTACKER (Red Team)          TARGET NETWORK             │
│  ┌──────────┐                 ┌──────────────────────┐  │
│  │ Kali     │ ──── attack ──► │ DMZ: Web Server      │  │
│  │ Linux    │                 │ Internal: DB Server   │  │
│  └──────────┘                 │ Internal: File Server │  │
│                               └──────────────────────┘  │
│  DEFENDER (Blue Team)                                    │
│  ┌──────────┐                 ┌──────────────────────┐  │
│  │ SOC      │ ◄── monitor ─── │ SIEM (ELK/Wazuh)     │  │
│  │ Analyst  │                 │ IDS (Suricata)        │  │
│  └──────────┘                 │ EDR (Wazuh Agent)     │  │
│                               └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. RED TEAM METHODOLOGY

### Phase 1: Reconnaissance (30 menit)
```bash
# OSINT & passive recon
whois target-domain.lab
theHarvester -d target.lab -b all
# Active recon
nmap -sn 192.168.1.0/24                    # Host discovery
nmap -sS -sV -O -sC -p- 192.168.1.0/24 -oA full_scan  # Full scan
```

### Phase 2: Exploitation (1-2 jam)
```bash
# Exploit vulnerable web app
sqlmap -u "http://target/page?id=1" --dbs --dump
# Exploit network service
msfconsole
use exploit/...
set RHOSTS target
exploit
```

### Phase 3: Post-Exploitation (1 jam)
```bash
# Privilege escalation
sudo -l                          # Check sudo misconfig
find / -perm -4000 2>/dev/null   # SUID binaries
# Lateral movement
hashdump                         # Credential harvesting
# Data exfiltration
# Persistence
```

### Phase 4: Documentation
```markdown
# Red Team Report
## Attack Chain Documentation

### Kill Chain
1. Recon: Found web server on port 80 (Apache 2.4.29)
2. Weaponize: SQLi payload for login bypass
3. Deliver: Via HTTP POST to /login
4. Exploit: SQL injection → DB dump → admin creds
5. Install: Reverse shell via file upload vuln
6. C2: Meterpreter reverse_tcp on port 4444
7. Action: Escalated to root via sudo misconfiguration,
           pivoted to internal DB server, exfiltrated data

### Findings Summary
| # | Finding | Severity | CVSS |
|---|---------|----------|------|
| 1 | SQL Injection | Critical | 9.8 |
| 2 | File Upload RCE | Critical | 9.1 |
| 3 | Sudo Misconfiguration | High | 7.8 |
| 4 | No Network Segmentation | High | 7.5 |
| 5 | Weak Passwords | Medium | 6.5 |

### MITRE ATT&CK Mapping
- T1190: Exploit Public-Facing Application
- T1059: Command and Scripting Interpreter
- T1548: Abuse Elevation Control Mechanism
- T1021: Remote Services (Lateral Movement)
- T1041: Exfiltration Over C2 Channel
```

---

## 3. BLUE TEAM METHODOLOGY

### Real-Time Monitoring
```bash
# SIEM monitoring (Kibana/Wazuh Dashboard)
# Watch for:
# - Port scanning alerts
# - Authentication failures
# - New process creation (suspicious)
# - Outbound connections to unknown IPs
# - File integrity changes

# Suricata IDS alerts
tail -f /var/log/suricata/fast.log

# Wazuh active monitoring
# Dashboard → Security Events → filter by severity
```

### Detection & Response Timeline
```markdown
# Blue Team Incident Report

## Detection & Response Timeline

| Time | Event | Action | Analyst |
|------|-------|--------|---------|
| 10:05 | Suricata: Port scan detected from 192.168.1.50 | Alert triaged | Analyst A |
| 10:12 | Wazuh: Multiple auth failures on web server | Monitoring | Analyst A |
| 10:15 | SIEM: SQL injection pattern in HTTP logs | Escalate to T2 | Analyst A |
| 10:20 | T2: Confirmed SQLi exploitation | Initiated IR | Analyst B |
| 10:25 | Wazuh: New reverse shell process detected | Containment start | Analyst B |
| 10:30 | Action: Isolated web server from network | Contained | Analyst B |
| 10:35 | Action: Blocked attacker IP at firewall | Blocked | Analyst B |
| 10:45 | Forensics: Memory dump acquired | Evidence | Analyst B |
| 11:00 | Analysis: Full attack chain reconstructed | Documented | Analyst B |

## IOCs Identified
| Type | Value | Source |
|------|-------|--------|
| IP | 192.168.1.50 | Suricata, auth.log |
| Process | /tmp/shell.elf | Wazuh FIM |
| Hash | a1b2c3d4... | Malware sample |
| URL | /login (SQLi) | Access.log |

## Detection Gaps
1. File upload exploitation not detected (no WAF rule)
2. Lateral movement to DB server detected 15 min late
3. No alert for sudo privilege escalation

## Improvement Recommendations
1. Add WAF rules for file upload validation
2. Implement network segmentation (DMZ ↔ Internal)
3. Add Suricata rule for sudo abuse patterns
4. Reduce MTTR from 25 min to < 15 min
```

---

## 4. PRESENTASI (20 Menit)

### Struktur Presentasi

```
Slide 1: Title & Team Members (1 min)
Slide 2: Lab Environment Setup (2 min)
Slide 3-5: Attack/Defense Methodology (5 min)
Slide 6-8: Key Findings & Timeline (5 min)
Slide 9: MITRE ATT&CK Mapping (2 min)
Slide 10: Detection Gaps & Improvements (3 min)
Slide 11: Lessons Learned (2 min)
```

---

## 5. GRADING CRITERIA

| Komponen | Bobot | Kriteria |
|----------|-------|----------|
| Technical Execution | 40% | Depth of attack/defense, tools used |
| Documentation | 25% | Report quality, PoC screenshots, timeline |
| Presentation | 20% | Clarity, professionalism, Q&A handling |
| Teamwork | 15% | Collaboration, communication, debrief |

---

## 🎓 CONGRATULATIONS!

Kamu telah menyelesaikan seluruh materi **Cybersecurity Engineer Bootcamp — 24 Pertemuan**.

### Apa yang Sudah Kamu Pelajari:

| Phase | Topik | Skill |
|-------|-------|-------|
| **1** | Fondasi | CIA Triad, Networking, Linux, Crypto, PKI |
| **2** | Offensive | OSINT, Scanning, Exploitation, Web Hacking, Privesc |
| **3** | Defensive | SOC, SIEM, Forensics, IDS/IPS, EDR |
| **4** | Advanced | Cloud, DevSecOps, API Security, GRC, Career |
| **5** | Final | Red Team vs Blue Team Integration |

### Next Steps:
1. 🎯 Ambil sertifikasi pertama (eJPT atau Security+)
2. 🏋️ Latihan di TryHackMe/HackTheBox setiap hari
3. 📝 Tulis blog teknis & bangun portfolio
4. 🐛 Mulai bug bounty di HackerOne
5. 🤝 Bergabung dengan komunitas cybersecurity Indonesia
6. 📚 Terus belajar — ancaman berevolusi, kamu harus ikut!

> *"The expert in anything was once a beginner."* — Helen Hayes
