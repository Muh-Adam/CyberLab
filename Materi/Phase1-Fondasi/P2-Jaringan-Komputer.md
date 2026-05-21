# 🌐 P2 — JARINGAN KOMPUTER UNTUK SECURITY

> *"If you know the enemy and know yourself, you need not fear the result of a hundred battles."* — Sun Tzu
> Dalam cybersecurity: **jika kamu paham jaringan, kamu paham medan perang.**

---

## 1. MENGAPA JARINGAN PENTING UNTUK CYBERSECURITY?

Hampir **semua serangan siber terjadi melalui jaringan**. Tanpa pemahaman jaringan:
- Kamu tidak bisa memahami bagaimana data berpindah
- Kamu tidak bisa mendeteksi anomali traffic
- Kamu tidak bisa melakukan penetration testing
- Kamu tidak bisa mengkonfigurasi firewall atau IDS

> **Analogi**: Jaringan komputer seperti sistem jalan raya. Data adalah kendaraan. Hacker adalah penjahat yang memanfaatkan celah di jalan. Tanpa memahami peta jalan, kamu tidak bisa menjaga keamanannya.

---

## 2. MODEL OSI (Open Systems Interconnection)

Model OSI adalah **kerangka konseptual** yang membagi komunikasi jaringan menjadi 7 lapisan. Setiap lapisan punya fungsi spesifik.

```
┌─────────────────────────────────────────────────────────┐
│  Layer 7: APPLICATION    │ HTTP, FTP, SMTP, DNS, SSH    │
│  (Aplikasi)              │ → Yang user lihat & gunakan  │
├──────────────────────────┼──────────────────────────────┤
│  Layer 6: PRESENTATION   │ SSL/TLS, JPEG, ASCII, MIME   │
│  (Presentasi)            │ → Enkripsi, kompresi, format │
├──────────────────────────┼──────────────────────────────┤
│  Layer 5: SESSION        │ NetBIOS, RPC, PPTP           │
│  (Sesi)                  │ → Membuka/menutup koneksi    │
├──────────────────────────┼──────────────────────────────┤
│  Layer 4: TRANSPORT      │ TCP, UDP                     │
│  (Transport)             │ → Reliabilitas pengiriman    │
├──────────────────────────┼──────────────────────────────┤
│  Layer 3: NETWORK        │ IP, ICMP, ARP, routing       │
│  (Jaringan)              │ → Routing & addressing       │
├──────────────────────────┼──────────────────────────────┤
│  Layer 2: DATA LINK      │ Ethernet, Wi-Fi, MAC address │
│  (Data Link)             │ → Frame & switching          │
├──────────────────────────┼──────────────────────────────┤
│  Layer 1: PHYSICAL       │ Kabel, fiber optic, sinyal   │
│  (Fisik)                 │ → Bit & sinyal listrik       │
└─────────────────────────────────────────────────────────┘
```

### Mnemonik untuk Menghafal (Atas ke Bawah)
**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing

### Mnemonik (Bawah ke Atas)
**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way

### Detail Setiap Layer

#### Layer 1: Physical
- **Fungsi**: Transmisi bit mentah melalui media fisik
- **Media**: Kabel UTP (Cat5/6), fiber optic, wireless (radio)
- **Perangkat**: Hub, repeater, modem
- **Satuan data**: Bit (0 dan 1)
- **Serangan di layer ini**: Wiretapping (penyadapan kabel), jamming (wireless)

#### Layer 2: Data Link
- **Fungsi**: Transfer data antar node yang terhubung langsung, error detection
- **Addressing**: MAC Address (48-bit, contoh: `AA:BB:CC:DD:EE:FF`)
- **Perangkat**: Switch, bridge
- **Protokol**: Ethernet (802.3), Wi-Fi (802.11)
- **Satuan data**: Frame
- **Serangan di layer ini**: 
  - **ARP Spoofing** — Memalsukan MAC address untuk intercept traffic
  - **MAC Flooding** — Membanjiri switch dengan MAC palsu agar berperilaku seperti hub
  - **VLAN Hopping** — Melompat antar VLAN yang seharusnya terisolasi

#### Layer 3: Network
- **Fungsi**: Routing paket dari sumber ke tujuan melewati jaringan yang berbeda
- **Addressing**: IP Address (IPv4: 32-bit, IPv6: 128-bit)
- **Perangkat**: Router, Layer 3 switch
- **Protokol**: IP, ICMP, ARP, IGMP
- **Satuan data**: Packet
- **Serangan di layer ini**:
  - **IP Spoofing** — Memalsukan IP address sumber
  - **ICMP Flood (Ping of Death)** — DDoS menggunakan ICMP
  - **Route Hijacking** — Mengalihkan routing BGP

#### Layer 4: Transport
- **Fungsi**: Pengiriman data end-to-end yang reliable (atau tidak)
- **Protokol utama**: TCP (reliable), UDP (fast)
- **Satuan data**: Segment (TCP) / Datagram (UDP)
- **Port**: Mengidentifikasi aplikasi (0–65535)
- **Serangan di layer ini**:
  - **SYN Flood** — Membanjiri SYN request tanpa menyelesaikan handshake
  - **Session Hijacking** — Mencuri session TCP yang aktif
  - **Port Scanning** — Mendeteksi port terbuka (Nmap)

#### Layer 5: Session
- **Fungsi**: Mengelola sesi komunikasi (membuka, menjaga, menutup)
- **Contoh**: Login session, video call session
- **Serangan**: Session fixation, session replay

#### Layer 6: Presentation
- **Fungsi**: Translasi format data, enkripsi/dekripsi, kompresi
- **Contoh**: SSL/TLS encryption, JPEG encoding, ASCII/Unicode
- **Serangan**: SSL stripping, downgrade attack

#### Layer 7: Application
- **Fungsi**: Interface antara user dan jaringan
- **Protokol**: HTTP, HTTPS, FTP, SMTP, DNS, SSH, SNMP
- **Serangan**: SQL Injection, XSS, phishing, DNS poisoning

---

## 3. MODEL TCP/IP (Model Praktis)

Model TCP/IP adalah model **praktis** yang digunakan di internet sebenarnya. Lebih sederhana dari OSI.

```
┌─────────────────────────────────────────┐
│ TCP/IP Model    │  Setara OSI           │
├─────────────────┼───────────────────────┤
│ APPLICATION     │  Layer 7 + 6 + 5      │
│ TRANSPORT       │  Layer 4              │
│ INTERNET        │  Layer 3              │
│ NETWORK ACCESS  │  Layer 2 + 1          │
└─────────────────────────────────────────┘
```

---

## 4. PROTOKOL-PROTOKOL UTAMA

### 4.1 TCP (Transmission Control Protocol)

**Karakteristik**: Connection-oriented, reliable, ordered delivery.

**Three-Way Handshake** (Cara TCP membuat koneksi):
```
Client                    Server
  │                         │
  │ ──── SYN ──────────►    │  1. Client: "Halo, saya mau connect"
  │                         │
  │ ◄─── SYN-ACK ──────    │  2. Server: "OK, saya juga siap"
  │                         │
  │ ──── ACK ──────────►    │  3. Client: "Mantap, kita mulai"
  │                         │
  │ ◄═══ DATA TRANSFER ═►  │  4. Komunikasi dimulai
  │                         │
  │ ──── FIN ──────────►    │  5. Client: "Saya selesai"
  │ ◄─── FIN-ACK ──────    │  6. Server: "OK, saya juga"
  │ ──── ACK ──────────►    │  7. Koneksi ditutup
```

**TCP Flags** (penting untuk security):
| Flag | Nama | Fungsi |
|------|------|--------|
| SYN | Synchronize | Memulai koneksi |
| ACK | Acknowledge | Konfirmasi penerimaan |
| FIN | Finish | Menutup koneksi |
| RST | Reset | Membatalkan koneksi paksa |
| PSH | Push | Mengirim data segera tanpa buffer |
| URG | Urgent | Data prioritas tinggi |

**Relevansi Security**: SYN Flood attack memanfaatkan handshake — mengirim ribuan SYN tanpa pernah mengirim ACK, membuat server kehabisan resource.

### 4.2 UDP (User Datagram Protocol)

**Karakteristik**: Connectionless, fast, no guarantee delivery.

**Kapan digunakan**: Streaming video, gaming, DNS queries, VoIP — di mana kecepatan lebih penting dari reliability.

**Relevansi Security**: 
- UDP Flood DDoS attack
- DNS Amplification attack (mengirim query kecil, mendapat response besar)

### 4.3 HTTP/HTTPS

**HTTP (Port 80)**: Tidak terenkripsi — semua data bisa dibaca siapa saja yang menyadap.

**HTTPS (Port 443)**: HTTP + TLS encryption — data terenkripsi selama transit.

```
HTTP:  Client ←── plaintext ──► Server   (bisa disadap!)
HTTPS: Client ←── encrypted ──► Server   (aman dari sniffing)
```

**Relevansi Security**: SELALU gunakan HTTPS. HTTP memungkinkan:
- Credential sniffing (password terlihat plaintext)
- Session hijacking
- Man-in-the-Middle attack
- Content injection

### 4.4 DNS (Domain Name System) — Port 53

DNS menerjemahkan nama domain ke IP address.

```
Kamu ketik: www.google.com
                │
                ▼
        ┌──────────────┐
        │ DNS Resolver  │ (ISP / 8.8.8.8)
        └──────┬───────┘
               │ "IP untuk google.com?"
               ▼
        ┌──────────────┐
        │  Root Server  │ (.com? → ke TLD server)
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │  TLD Server   │ (.com → ke authoritative)
        └──────┬───────┘
               ▼
        ┌──────────────────────┐
        │ Authoritative Server  │ → 142.250.185.46
        └──────────────────────┘
```

**DNS Record Types**:
| Record | Fungsi | Contoh |
|--------|--------|--------|
| A | Domain → IPv4 | google.com → 142.250.185.46 |
| AAAA | Domain → IPv6 | google.com → 2607:f8b0:4004:... |
| MX | Mail server | google.com → mail.google.com |
| CNAME | Alias | www.google.com → google.com |
| NS | Name server | google.com → ns1.google.com |
| TXT | Text info | SPF, DKIM, DMARC records |
| PTR | Reverse DNS (IP → domain) | 142.250.185.46 → google.com |

**Serangan DNS**:
- **DNS Spoofing/Poisoning** — Memasukkan record palsu ke cache DNS
- **DNS Tunneling** — Menyembunyikan data di query DNS untuk bypass firewall
- **DNS Amplification DDoS** — Menggunakan DNS server untuk memperbesar traffic serangan

### 4.5 DHCP (Dynamic Host Configuration Protocol)

Otomatis memberikan IP address ke device yang terhubung ke jaringan.

**Proses DORA**:
```
1. DISCOVER → Client broadcast: "Ada DHCP server?"
2. OFFER    → Server: "Pakai IP 192.168.1.100"
3. REQUEST  → Client: "OK, saya ambil 192.168.1.100"
4. ACK      → Server: "Confirmed, IP kamu 192.168.1.100"
```

**Serangan**: DHCP Starvation (menghabiskan pool IP), Rogue DHCP Server (DHCP palsu yang memberikan gateway ke attacker).

### 4.6 ARP (Address Resolution Protocol)

Menerjemahkan IP address → MAC address di jaringan lokal.

**Serangan ARP Spoofing**:
```
Situasi Normal:
PC-A ──► Gateway (192.168.1.1 / MAC: AA:AA:AA)

ARP Spoofing:
Attacker: "Hei PC-A, gateway 192.168.1.1 itu MAC saya: CC:CC:CC"
PC-A ──► Attacker (MAC: CC:CC:CC) ──► Gateway
         (attacker baca semua traffic)
```

---

## 5. IP ADDRESSING & SUBNETTING

### 5.1 IPv4

Format: `xxx.xxx.xxx.xxx` (4 oktet, masing-masing 0–255)
Total: 32 bit → ~4.3 miliar alamat

**IP Classes**:
| Class | Range | Default Mask | Penggunaan |
|-------|-------|-------------|------------|
| A | 1.0.0.0 – 126.255.255.255 | 255.0.0.0 (/8) | Organisasi besar |
| B | 128.0.0.0 – 191.255.255.255 | 255.255.0.0 (/16) | Organisasi menengah |
| C | 192.0.0.0 – 223.255.255.255 | 255.255.255.0 (/24) | Organisasi kecil |

**Private IP Ranges** (tidak bisa diakses dari internet):
| Range | CIDR | Jumlah IP |
|-------|------|-----------|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | ~16.7 juta |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | ~1 juta |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | ~65.000 |

**Special Addresses**:
- `127.0.0.1` — Localhost (diri sendiri)
- `0.0.0.0` — Semua interface
- `255.255.255.255` — Broadcast
- `169.254.x.x` — APIPA (gagal dapat IP dari DHCP)

### 5.2 Subnetting (Dasar)

Subnetting = membagi jaringan besar menjadi jaringan-jaringan kecil.

**Mengapa penting untuk security?**
- **Segmentasi jaringan** — Pisahkan server, user, IoT ke subnet berbeda
- **Kontrol akses** — Firewall bisa memfilter antar subnet
- **Isolasi breach** — Jika satu subnet compromised, yang lain tetap aman

**Contoh CIDR Notation**:
```
192.168.1.0/24  → 256 IP (254 usable)  → Subnet mask: 255.255.255.0
192.168.1.0/25  → 128 IP (126 usable)  → Subnet mask: 255.255.255.128
192.168.1.0/26  → 64 IP  (62 usable)   → Subnet mask: 255.255.255.192
192.168.1.0/28  → 16 IP  (14 usable)   → Subnet mask: 255.255.255.240
```

### 5.3 VLAN (Virtual LAN)

VLAN memungkinkan **segmentasi logis** tanpa perlu switch fisik terpisah.

```
Tanpa VLAN:
[PC HR]──┐
[PC IT]──┤──[Switch]──semua bisa komunikasi
[PC FIN]─┘

Dengan VLAN:
[PC HR]──┐                    VLAN 10 (HR)
[PC IT]──┤──[Switch]──────    VLAN 20 (IT)
[PC FIN]─┘                    VLAN 30 (Finance)
(masing-masing terisolasi, butuh router untuk berkomunikasi)
```

---

## 6. PORT NUMBERS — Pintu Masuk Aplikasi

Port adalah "pintu" virtual yang mengidentifikasi layanan/aplikasi di sebuah host.

### Port Range
| Range | Nama | Keterangan |
|-------|------|------------|
| 0–1023 | Well-Known Ports | Digunakan layanan standar (butuh root) |
| 1024–49151 | Registered Ports | Untuk aplikasi tertentu |
| 49152–65535 | Dynamic/Ephemeral | Digunakan sementara oleh client |

### Port yang WAJIB Dihafal

| Port | Protokol | Layanan | Catatan Security |
|------|----------|---------|------------------|
| 20/21 | TCP | FTP | Kirim password plaintext! Gunakan SFTP |
| 22 | TCP | SSH | Remote access terenkripsi. Jaga ketat! |
| 23 | TCP | Telnet | Plaintext! JANGAN digunakan, pakai SSH |
| 25 | TCP | SMTP | Email sending, sering dieksploitasi spam |
| 53 | TCP/UDP | DNS | Target DNS spoofing & tunneling |
| 67/68 | UDP | DHCP | Target DHCP starvation |
| 80 | TCP | HTTP | Tidak terenkripsi |
| 110 | TCP | POP3 | Email retrieval, plaintext |
| 143 | TCP | IMAP | Email retrieval, plaintext |
| 443 | TCP | HTTPS | HTTP + TLS (aman) |
| 445 | TCP | SMB | Target ransomware (EternalBlue) |
| 993 | TCP | IMAPS | IMAP + TLS |
| 995 | TCP | POP3S | POP3 + TLS |
| 1433 | TCP | MSSQL | Database Microsoft SQL Server |
| 3306 | TCP | MySQL | Database MySQL |
| 3389 | TCP | RDP | Remote Desktop, target brute force |
| 5432 | TCP | PostgreSQL | Database PostgreSQL |
| 5900 | TCP | VNC | Remote desktop, sering tanpa auth |
| 8080 | TCP | HTTP Alt | Web server alternatif / proxy |
| 8443 | TCP | HTTPS Alt | HTTPS alternatif |

---

## 7. ROUTING, SWITCHING, DAN NAT

### 7.1 Switch vs Router

| Aspek | Switch | Router |
|-------|--------|--------|
| Layer | Layer 2 (Data Link) | Layer 3 (Network) |
| Addressing | MAC Address | IP Address |
| Fungsi | Menghubungkan device di LAN yang sama | Menghubungkan jaringan yang berbeda |
| Broadcast | Meneruskan broadcast | Memblokir broadcast |

### 7.2 NAT (Network Address Translation)

NAT menerjemahkan IP private ke IP public agar device di LAN bisa mengakses internet.

```
Private Network          NAT Router          Internet
192.168.1.10 ──┐                       
192.168.1.11 ──┤──► [NAT: 203.0.113.5] ──► google.com
192.168.1.12 ──┘    (1 IP public)
```

**Relevansi Security**: NAT memberikan lapisan keamanan karena device internal tidak langsung terekspos ke internet.

---

## 8. PACKET ANALYSIS DENGAN WIRESHARK

Wireshark adalah **network protocol analyzer** — tools #1 untuk menangkap dan menganalisis traffic jaringan.

### Kapan Digunakan?
- Troubleshooting jaringan
- Mendeteksi serangan (ARP spoofing, DDoS, data exfiltration)
- Analisis malware communication
- Forensik jaringan
- Memahami cara kerja protokol

### Wireshark Display Filters (Wajib Diketahui)

```bash
# Filter berdasarkan IP
ip.addr == 192.168.1.1          # Traffic dari/ke IP tertentu
ip.src == 192.168.1.1           # Traffic dari IP tertentu
ip.dst == 10.0.0.1              # Traffic ke IP tertentu

# Filter berdasarkan protokol
http                             # Hanya HTTP traffic
dns                              # Hanya DNS traffic
tcp                              # Hanya TCP traffic
arp                              # Hanya ARP traffic

# Filter berdasarkan port
tcp.port == 80                   # Traffic port 80
tcp.dstport == 443               # Traffic ke port 443
udp.port == 53                   # DNS traffic (UDP)

# Filter kombinasi
http && ip.addr == 192.168.1.1   # HTTP dari/ke IP tertentu
tcp.flags.syn == 1               # Hanya SYN packets (scanning?)
tcp.flags.syn == 1 && tcp.flags.ack == 0  # SYN tanpa ACK (SYN scan)

# Cari credentials (HTTP plaintext)
http.request.method == "POST"    # POST requests (login forms)
http contains "password"         # Paket yang mengandung "password"

# Deteksi anomali
tcp.analysis.retransmission      # Packet retransmission (masalah jaringan)
dns.qry.name contains "evil"     # DNS query mencurigakan
```

### Apa yang Dicari Saat Analisis?
1. **Traffic abnormal**: Volume tinggi dari satu IP (DDoS?)
2. **Port scanning**: Banyak SYN ke port berbeda dari IP yang sama
3. **ARP anomali**: Banyak ARP reply yang tidak diminta (ARP spoofing?)
4. **DNS tunneling**: DNS query dengan subdomain sangat panjang
5. **Data exfiltration**: Transfer data besar ke IP eksternal yang tidak dikenal
6. **Plaintext credentials**: Username/password di HTTP POST

---

## 9. STUDI KASUS: Mengapa Pemahaman Jaringan Menyelamatkan

### Kasus 1: Deteksi ARP Spoofing
Seorang SOC analyst melihat alert di Wireshark — ratusan ARP reply dari satu MAC address yang mengklaim sebagai gateway. Ini adalah tanda klasik **ARP spoofing** — attacker mencoba menjadi man-in-the-middle.

### Kasus 2: WannaCry & SMB (Port 445)
WannaCry ransomware (2017) menyebar melalui **SMB protocol (port 445)** menggunakan exploit EternalBlue. Organisasi yang menutup port 445 dari internet selamat. Yang tidak — terinfeksi massal.

### Kasus 3: DNS Exfiltration
Attacker menggunakan DNS tunneling untuk mencuri data — mengenkode data curian sebagai subdomain: `aGVsbG8=.stolen-data.evil.com`. DNS query ini melewati firewall karena DNS (port 53) biasanya diizinkan.

---

## 10. CHECKLIST PEMAHAMAN P2

- [ ] Jelaskan 7 layer OSI dan fungsi masing-masing
- [ ] Apa perbedaan TCP dan UDP? Kapan masing-masing digunakan?
- [ ] Gambarkan TCP Three-Way Handshake
- [ ] Apa itu SYN Flood attack dan bagaimana cara kerjanya?
- [ ] Sebutkan 10 port penting dan layanannya
- [ ] Apa itu NAT dan mengapa membantu keamanan?
- [ ] Apa itu VLAN dan mengapa penting untuk segmentasi?
- [ ] Apa itu ARP Spoofing dan bagaimana mendeteksinya?
- [ ] Apa itu DNS Spoofing/Tunneling?
- [ ] Tulis 5 Wireshark filter untuk mendeteksi anomali
- [ ] Apa perbedaan private IP dan public IP?
- [ ] Jelaskan cara kerja DNS resolution

---

*Selanjutnya: [P3 — Linux Fundamentals & System Administration](./P3-Linux-Fundamentals.md)*
