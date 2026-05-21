# 🖥️ P17 — ENDPOINT SECURITY & EDR

> *"The endpoint is the new perimeter."* — Dengan remote work, setiap laptop adalah gerbang masuk.

---

## 1. EVOLUSI ENDPOINT SECURITY

```
Antivirus (AV)          → Signature-based, scan file
     ↓
Next-Gen AV (NGAV)      → + Behavioral analysis, machine learning
     ↓
EDR                      → + Real-time monitoring, investigation, response
     ↓
XDR                      → + Correlate endpoint + network + cloud + email
```

| Komponen | Deteksi | Response | Visibility |
|----------|---------|----------|------------|
| **Antivirus** | Signature only | Quarantine file | File-level |
| **NGAV** | Signature + behavior | Quarantine + block | Process-level |
| **EDR** | Signature + behavior + anomaly | Full IR capability | Everything |
| **XDR** | Cross-platform correlation | Automated orchestration | Entire environment |

---

## 2. WAZUH — Open Source EDR/XDR

### 2.1 Arsitektur Wazuh

```
┌──────────────────┐     ┌──────────────────┐
│  WAZUH AGENT     │     │  WAZUH AGENT     │
│  (Linux Server)  │     │  (Windows PC)    │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         └────────┬───────────────┘
                  ▼
         ┌────────────────┐
         │  WAZUH SERVER   │ (Manager + API)
         │  - Rule engine  │
         │  - Decoder      │
         │  - Active resp. │
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │  WAZUH INDEXER  │ (OpenSearch / Elasticsearch)
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │  WAZUH DASHBOARD│ (Kibana-like UI)
         └────────────────┘
```

### 2.2 Kemampuan Wazuh

| Fitur | Deskripsi |
|-------|-----------|
| **File Integrity Monitoring (FIM)** | Deteksi perubahan file kritis |
| **Log Collection & Analysis** | Kumpulkan dan analisis log dari semua agent |
| **Vulnerability Detection** | Scan CVE pada software terinstall |
| **Rootkit Detection** | Deteksi rootkit di endpoint |
| **Active Response** | Otomatis blokir IP, kill proses |
| **Compliance** | Cek kepatuhan CIS, PCI-DSS, HIPAA |
| **SCA (Security Config Assessment)** | Audit konfigurasi keamanan |

### 2.3 Setup Wazuh

```bash
# === WAZUH SERVER (VM Ubuntu, 4GB+ RAM) ===
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
sudo bash wazuh-install.sh -a
# → Output: URL dashboard + credentials

# === WAZUH AGENT (di setiap endpoint) ===
# Linux agent:
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --dearmor -o /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee /etc/apt/sources.list.d/wazuh.list
apt update && apt install wazuh-agent
# Set manager IP di /var/ossec/etc/ossec.conf
systemctl enable --now wazuh-agent

# Windows agent:
# Download MSI dari packages.wazuh.com → install → set manager IP
```

### 2.4 Wazuh Rules & Active Response

```xml
<!-- Custom rule: Deteksi multiple sudo failures -->
<rule id="100001" level="10">
  <if_matched_sid>5401</if_matched_sid>
  <same_source_ip />
  <description>Multiple sudo authentication failures from same IP</description>
  <options>alert_by_email</options>
  <group>authentication_failures,</group>
</rule>

<!-- Active Response: Auto-block IP setelah brute force -->
<!-- /var/ossec/etc/ossec.conf -->
<active-response>
  <command>firewall-drop</command>
  <location>local</location>
  <rules_id>100001</rules_id>
  <timeout>3600</timeout>
</active-response>
```

---

## 3. YARA RULES — Malware Detection

YARA = "pattern matching swiss knife" — mendeteksi malware berdasarkan pattern/signature custom.

### Struktur YARA Rule

```yara
rule Detect_Mimikatz {
    meta:
        description = "Detects Mimikatz password dumping tool"
        author = "Security Analyst"
        severity = "critical"
        date = "2025-05-21"
    
    strings:
        $s1 = "mimikatz" ascii nocase
        $s2 = "sekurlsa" ascii
        $s3 = "kerberos::list" ascii
        $s4 = "privilege::debug" ascii
        $hex1 = { 6D 69 6D 69 6B 61 74 7A }  // "mimikatz" in hex
    
    condition:
        uint16(0) == 0x5A4D and    // MZ header (Windows PE)
        filesize < 5MB and
        any of ($s*) or $hex1
}

rule Detect_Webshell {
    meta:
        description = "Detects common PHP webshells"
    
    strings:
        $php = "<?php" ascii
        $eval = "eval(" ascii
        $base64 = "base64_decode(" ascii
        $system = "system(" ascii
        $exec = "exec(" ascii
        $passthru = "passthru(" ascii
        $shell_exec = "shell_exec(" ascii
    
    condition:
        $php and any of ($eval, $base64) and
        any of ($system, $exec, $passthru, $shell_exec)
}

rule Detect_Ransomware_Note {
    meta:
        description = "Detects common ransomware notes"
    
    strings:
        $s1 = "Your files have been encrypted" ascii nocase
        $s2 = "bitcoin" ascii nocase
        $s3 = "decrypt" ascii nocase
        $s4 = "ransom" ascii nocase
        $s5 = ".onion" ascii
    
    condition:
        3 of ($s*)
}
```

### Menggunakan YARA

```bash
# Scan file
yara rules.yar suspicious_file.exe

# Scan directory
yara -r rules.yar /home/user/Downloads/

# Scan running processes
yara -p 4 rules.yar /proc/

# Dengan Wazuh (otomatis scan)
# Tambah di ossec.conf agent:
# <localfile>
#   <log_format>command</log_format>
#   <command>yara /var/ossec/ruleset/yara/rules.yar /tmp/ 2>/dev/null</command>
# </localfile>
```

---

## 4. THREAT INTELLIGENCE FEEDS

Threat Intel = informasi tentang ancaman yang bisa digunakan untuk **proaktif mendeteksi** serangan.

| Feed | Tipe | Gratis? |
|------|------|---------|
| **AlienVault OTX** | IOCs, pulses | ✅ |
| **Abuse.ch** | Malware, botnet, SSL blocklist | ✅ |
| **MISP** | Threat sharing platform | ✅ (self-hosted) |
| **VirusTotal** | File/URL/IP reputation | ✅ (limited) |
| **Shodan** | Internet-facing device intel | ✅ (limited) |

### Integrasi Threat Intel ke Wazuh

```xml
<!-- CDB List untuk IP blocklist -->
<!-- /var/ossec/etc/lists/malicious_ips -->
10.0.0.5:known_attacker
185.xx.xx.xx:c2_server
203.xx.xx.xx:botnet

<!-- Rule yang menggunakan CDB list -->
<rule id="100010" level="12">
  <if_sid>5710</if_sid>
  <list field="srcip" lookup="address_match_key">etc/lists/malicious_ips</list>
  <description>Connection from known malicious IP: $(srcip)</description>
</rule>
```

---

## 5. CHECKLIST PEMAHAMAN P17

- [ ] Jelaskan perbedaan AV, NGAV, EDR, XDR
- [ ] Setup Wazuh server dan agent
- [ ] Buat custom Wazuh rule
- [ ] Konfigurasi active response (auto-block)
- [ ] Tulis YARA rule untuk deteksi malware
- [ ] Scan file/directory dengan YARA
- [ ] Jelaskan File Integrity Monitoring
- [ ] Integrasikan threat intel feed ke Wazuh
- [ ] Apa itu threat intelligence dan 3 sumbernya?
- [ ] Monitor Wazuh dashboard untuk alert

---

## 🎉 SELESAI PHASE 3 — DEFENSIVE SECURITY

- ✅ SOC & SIEM (ELK Stack, KQL)
- ✅ Log Analysis & Threat Detection (MITRE ATT&CK)
- ✅ Incident Response & Digital Forensics (Volatility, Autopsy)
- ✅ Network Defense (IDS/IPS, Suricata, Segmentation)
- ✅ Endpoint Security & EDR (Wazuh, YARA)

*Selanjutnya: [Phase 4 — Advanced & Specialized](../../Phase4-Advanced/)*
