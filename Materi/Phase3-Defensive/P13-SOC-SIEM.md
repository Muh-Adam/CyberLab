# 🛡️ P13 — SECURITY OPERATIONS CENTER (SOC) & SIEM

> *"Defense is not about preventing every attack — it's about detecting and responding fast enough."*

---

## 1. APA ITU SOC?

**SOC (Security Operations Center)** adalah tim + fasilitas yang bertanggung jawab **memonitor, mendeteksi, menganalisis, dan merespons** ancaman keamanan siber 24/7.

### SOC Tiers (Struktur Tim)

```
┌─────────────────────────────────────────────────┐
│                   SOC MANAGER                    │
│          (Strategy, reporting, escalation)       │
├─────────────────────────────────────────────────┤
│                                                  │
│  TIER 3: Threat Hunter / Senior Analyst          │
│  ├── Proactive threat hunting                    │
│  ├── Advanced malware analysis                   │
│  ├── Incident lead / forensics                   │
│  └── Tool development & tuning                   │
│                                                  │
│  TIER 2: Incident Responder / Analyst            │
│  ├── Deep-dive investigation                     │
│  ├── Incident response & containment             │
│  ├── Correlation analysis                        │
│  └── Escalation dari Tier 1                      │
│                                                  │
│  TIER 1: Alert Analyst / Monitor                 │
│  ├── Monitor SIEM dashboards                     │
│  ├── Initial alert triage (true/false positive)  │
│  ├── Ticket creation & documentation             │
│  └── Escalation ke Tier 2                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

### SOC Workflow

```
1. MONITOR    → Pantau dashboard, alert, log secara real-time
2. DETECT     → Identifikasi aktivitas mencurigakan
3. TRIAGE     → Tentukan: True Positive? False Positive?
4. INVESTIGATE→ Deep-dive: siapa, apa, kapan, di mana, bagaimana
5. RESPOND    → Contain, eradicate, recover
6. DOCUMENT   → Buat incident report, update playbook
7. IMPROVE    → Tune rules, update detection, lessons learned
```

---

## 2. APA ITU SIEM?

**SIEM (Security Information and Event Management)** = platform yang **mengumpulkan, menormalisasi, mengkorelasikan, dan menganalisis** log dari seluruh infrastruktur.

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Firewall │ │ Server   │ │ Endpoint │ │ Cloud    │
│   Logs   │ │   Logs   │ │   Logs   │ │   Logs   │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │
     └────────────┼────────────┼────────────┘
                  ▼
         ┌────────────────┐
         │   LOG COLLECTOR │ (Filebeat, Logstash, Fluentd)
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │  NORMALIZATION  │ (Format seragam)
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │  CORRELATION    │ (Hubungkan event terkait)
         │    ENGINE       │
         └────────┬───────┘
                  ▼
         ┌────────────────┐
         │  ALERTING &     │ → Dashboard, Email, Ticket
         │  DASHBOARD      │
         └────────────────┘
```

### SIEM Solutions

| SIEM | Tipe | Catatan |
|------|------|---------|
| **ELK Stack** | Open Source | Elasticsearch + Logstash + Kibana |
| **Splunk** | Commercial | Market leader, SPL query language |
| **Wazuh** | Open Source | SIEM + EDR + XDR |
| **QRadar** | Commercial | IBM, enterprise-grade |
| **Microsoft Sentinel** | Cloud | Azure-native SIEM |
| **Graylog** | Open Source | Lightweight alternative |

---

## 3. ELK STACK — Setup & Penggunaan

### 3.1 Komponen ELK

```
Elasticsearch → Database & search engine (menyimpan & index log)
Logstash      → Log processor (parsing, filtering, enrichment)
Kibana        → Visualization & dashboard (UI)
Filebeat      → Log shipper (kirim log dari source ke Logstash/ES)
```

### 3.2 Setup ELK di VM Ubuntu

```bash
# Prerequisites
sudo apt update && sudo apt install -y openjdk-17-jdk curl gnupg

# Add Elastic repository
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elastic.gpg
echo "deb [signed-by=/usr/share/keyrings/elastic.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

sudo apt update

# Install Elasticsearch
sudo apt install -y elasticsearch
sudo systemctl enable --now elasticsearch

# Install Kibana
sudo apt install -y kibana
sudo systemctl enable --now kibana
# Akses: http://localhost:5601

# Install Logstash
sudo apt install -y logstash

# Install Filebeat (log shipper)
sudo apt install -y filebeat
sudo filebeat modules enable system apache nginx
sudo filebeat setup
sudo systemctl enable --now filebeat
```

### 3.3 Kibana KQL (Kibana Query Language)

```bash
# === BASIC QUERIES ===
status:404                           # Semua event dengan status 404
source.ip:192.168.1.100              # Dari IP tertentu
event.action:"login" AND event.outcome:"failure"  # Login gagal
NOT source.ip:10.0.0.0/8            # Exclude private IPs

# === WILDCARD ===
user.name:admin*                     # User yang dimulai "admin"
host.name:web-*                      # Host web-*

# === RANGE ===
http.response.status_code >= 400     # HTTP errors
@timestamp >= "2025-01-01"           # Setelah tanggal

# === DETECTION QUERIES ===

# Brute force detection (banyak login gagal)
event.action:"authentication_failure" AND source.ip:*
# → Visualisasi: Top IPs by count

# Port scanning detection
destination.port:* AND source.ip:192.168.1.50
# → Jika 1 IP menghubungi banyak port = scanning

# Suspicious PowerShell
process.name:"powershell.exe" AND process.command_line:*encoded*
# → Encoded PowerShell = sering dipakai malware

# Data exfiltration (transfer besar ke luar)
network.bytes > 10000000 AND destination.ip NOT 10.0.0.0/8
# → Transfer > 10MB ke IP eksternal
```

### 3.4 Membuat Detection/Correlation Rules

```json
// Contoh: Brute Force Detection Rule
// Alert jika > 5 login gagal dari 1 IP dalam 5 menit

// Di Kibana → Security → Rules → Create New Rule
{
  "name": "Brute Force Login Attempt",
  "description": "Detects multiple failed login attempts from single IP",
  "type": "threshold",
  "query": "event.action:\"authentication_failure\"",
  "threshold": {
    "field": "source.ip",
    "value": 5
  },
  "timeline_id": "default",
  "severity": "high",
  "risk_score": 75,
  "interval": "5m",
  "actions": [
    {
      "action_type": "email",
      "params": {
        "to": "soc@company.com",
        "subject": "ALERT: Brute Force Detected"
      }
    }
  ]
}
```

---

## 4. ALERT TRIAGE — True vs False Positive

| Istilah | Arti | Contoh |
|---------|------|--------|
| **True Positive** | Alert benar, serangan nyata | Brute force yang benar-benar terjadi |
| **False Positive** | Alert salah, bukan serangan | Admin melakukan test berulang |
| **True Negative** | Tidak ada alert, tidak ada serangan | Normal operations |
| **False Negative** | Tidak ada alert, TAPI ada serangan | Serangan lolos deteksi! (PALING BAHAYA) |

### Triage Workflow

```
1. Alert masuk → Baca detail alert
2. Enrichment → Cek IP reputation, threat intel, context
3. Correlation → Ada event terkait lain?
4. Determination:
   ├── False Positive → Close, tune rule
   ├── True Positive → Escalate ke Tier 2 / IR
   └── Suspicious → Investigate further
5. Document → Catat keputusan dan alasan
```

---

## 5. CHECKLIST PEMAHAMAN P13

- [ ] Jelaskan struktur SOC (Tier 1, 2, 3) dan tanggung jawabnya
- [ ] Apa itu SIEM dan 4 fungsi utamanya?
- [ ] Setup ELK Stack di VM Ubuntu
- [ ] Tulis 5 KQL query untuk deteksi serangan
- [ ] Buat 3 detection dashboard di Kibana
- [ ] Tulis correlation rule untuk brute force detection
- [ ] Jelaskan perbedaan True Positive dan False Positive
- [ ] Apa yang dimaksud alert triage?
- [ ] Ingest sample log dan analisis di Kibana
- [ ] Jelaskan perbedaan Elasticsearch, Logstash, Kibana, Filebeat

---

*Selanjutnya: [P14 — Log Analysis & Threat Detection](./P14-Log-Analysis.md)*
