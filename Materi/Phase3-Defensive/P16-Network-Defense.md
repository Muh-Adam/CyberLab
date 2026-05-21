# 🏰 P16 — NETWORK DEFENSE & IDS/IPS

> *"A firewall tells you what to block. An IDS tells you what got through."*

---

## 1. IDS vs IPS vs FIREWALL

| Komponen | Fungsi | Aksi | Posisi |
|----------|--------|------|--------|
| **Firewall** | Filter traffic berdasarkan rules (IP, port) | ALLOW / DENY | Inline (gateway) |
| **IDS** (Intrusion Detection) | Deteksi serangan, kirim alert | ALERT only | Passive (mirror/tap) |
| **IPS** (Intrusion Prevention) | Deteksi DAN blokir serangan | ALERT + BLOCK | Inline |

```
Internet ──► [Firewall] ──► [IPS (inline)] ──► Internal Network
                                  │
                            [IDS (tap/mirror)]
                                  │
                            [SIEM / Analyst]
```

### Detection Methods

| Metode | Cara Kerja | Kelebihan | Kekurangan |
|--------|-----------|-----------|------------|
| **Signature-Based** | Cocokkan traffic dengan database pattern serangan | Akurat untuk serangan known | Tidak deteksi zero-day |
| **Anomaly-Based** | Bandingkan dengan baseline "normal" | Deteksi unknown attacks | Banyak false positive |
| **Heuristic/Behavior** | Analisis perilaku mencurigakan | Balance antara keduanya | Butuh tuning |

---

## 2. SURICATA — IDS/IPS Open Source Modern

### Setup Suricata

```bash
# Install
sudo apt install suricata

# Konfigurasi: /etc/suricata/suricata.yaml
# Set HOME_NET (network yang dilindungi):
# HOME_NET: "[192.168.1.0/24, 10.0.0.0/8]"
# EXTERNAL_NET: "!$HOME_NET"

# Update rules
sudo suricata-update
sudo suricata-update list-sources
sudo suricata-update enable-source et/open   # Emerging Threats rules

# Jalankan (IDS mode — passive)
sudo suricata -c /etc/suricata/suricata.yaml -i eth0

# Jalankan (IPS mode — inline, butuh NFQ)
sudo suricata -c /etc/suricata/suricata.yaml -q 0
```

### Suricata Rules

```bash
# Format rule:
# action protocol src_ip src_port -> dst_ip dst_port (options)

# Deteksi port scanning (Nmap SYN scan)
alert tcp $EXTERNAL_NET any -> $HOME_NET any (msg:"NMAP SYN Scan Detected"; flags:S; threshold:type threshold, track by_src, count 20, seconds 10; sid:1000001; rev:1;)

# Deteksi SQL injection di HTTP
alert http $EXTERNAL_NET any -> $HOME_NET any (msg:"SQL Injection Attempt"; content:"union"; nocase; content:"select"; nocase; sid:1000002; rev:1;)

# Deteksi reverse shell
alert tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"Possible Reverse Shell"; flow:established; content:"/bin/bash"; sid:1000003; rev:1;)

# Deteksi EternalBlue (MS17-010)
alert smb $EXTERNAL_NET any -> $HOME_NET 445 (msg:"ET EXPLOIT Possible EternalBlue"; content:"|ff|SMB"; content:"|57 00 69 00 6e 00 64 00 6f 00 77 00 73|"; sid:1000004; rev:1;)

# Deteksi DNS tunneling (query panjang)
alert dns $HOME_NET any -> any 53 (msg:"Possible DNS Tunneling"; dns.query; content:"."; offset:50; sid:1000005; rev:1;)

# Deteksi brute force SSH
alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (msg:"SSH Brute Force"; flow:to_server; threshold:type threshold, track by_src, count 5, seconds 60; sid:1000006; rev:1;)
```

### Monitoring Suricata

```bash
# Log alerts
tail -f /var/log/suricata/fast.log

# EVE JSON log (structured — untuk SIEM)
tail -f /var/log/suricata/eve.json | jq .

# Statistik
suricatasc -c "dump-counters"
```

---

## 3. NETWORK SEGMENTATION

Membagi jaringan menjadi zona-zona terisolasi untuk membatasi lateral movement.

```
                    ┌─────────────┐
    Internet ──────►│  FIREWALL    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │   DMZ    │ │ INTERNAL │ │ MGMT     │
        │ (web,dns)│ │ (users)  │ │ (admin)  │
        │ VLAN 10  │ │ VLAN 20  │ │ VLAN 30  │
        └──────────┘ └──────────┘ └──────────┘
              │            │            │
         Public-facing  User workstations  Sensitive
         servers only   Limited access     Full access

RULES:
- DMZ → Internet: ALLOW (web traffic)
- DMZ → Internal: DENY (compromised DMZ = no lateral)
- Internal → DMZ: ALLOW specific ports
- Internal → MGMT: DENY (only admin can access)
- MGMT → ALL: ALLOW (admin needs access everywhere)
```

---

## 4. VPN & SECURE REMOTE ACCESS

```bash
# OpenVPN Setup (server)
sudo apt install openvpn easy-rsa

# Generate PKI
make-cadir ~/openvpn-ca
cd ~/openvpn-ca
./easyrsa init-pki
./easyrsa build-ca
./easyrsa gen-req server nopass
./easyrsa sign-req server server
./easyrsa gen-dh
openvpn --genkey secret ta.key

# WireGuard (modern, lebih cepat)
sudo apt install wireguard
wg genkey | tee privatekey | wg pubkey > publickey

# /etc/wireguard/wg0.conf (server)
# [Interface]
# PrivateKey = <server_private_key>
# Address = 10.0.0.1/24
# ListenPort = 51820
# [Peer]
# PublicKey = <client_public_key>
# AllowedIPs = 10.0.0.2/32

sudo wg-quick up wg0
```

---

## 5. HONEYPOTS

Honeypot = sistem sengaja dibuat vulnerable untuk **mendeteksi dan mempelajari** attacker.

| Tipe | Interaksi | Contoh |
|------|-----------|--------|
| **Low-Interaction** | Emulasi service sederhana | Honeyd, Cowrie (SSH) |
| **High-Interaction** | OS & service nyata | Real vulnerable VM |
| **Honeynet** | Network penuh dari honeypots | Multiple honeypots |

```bash
# Cowrie SSH Honeypot
docker run -d -p 2222:2222 cowrie/cowrie
# → Attacker yang SSH ke port 2222 = terekam semua commandnya!
# Log: /home/cowrie/log/cowrie.json
```

---

## 6. CHECKLIST PEMAHAMAN P16

- [ ] Jelaskan perbedaan IDS, IPS, dan Firewall
- [ ] Apa perbedaan signature-based dan anomaly-based detection?
- [ ] Setup Suricata sebagai IDS
- [ ] Tulis 3 Suricata rules custom
- [ ] Jelaskan network segmentation dan DMZ
- [ ] Apa itu honeypot dan kegunaannya?
- [ ] Setup VPN dengan WireGuard atau OpenVPN
- [ ] Monitor Suricata alerts
- [ ] Jelaskan host-only network di VirtualBox
- [ ] Mengapa network segmentation membatasi lateral movement?

---

*Selanjutnya: [P17 — Endpoint Security & EDR](./P17-Endpoint-EDR.md)*
