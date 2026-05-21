# 🔒 P4 — LINUX NETWORKING & SECURITY HARDENING

> *"Hardening is not about being paranoid — it's about being prepared."*

---

## 1. LINUX NETWORK TOOLS

### 1.1 Melihat Konfigurasi Jaringan

```bash
# IP address & interface
ip addr show                    # Tampilkan semua interface (modern)
ip a                            # Shorthand
ifconfig                        # Legacy (masih sering dipakai)
hostname -I                     # IP address saja

# Routing table
ip route show                   # Tampilkan routing table
route -n                        # Legacy
netstat -rn                     # Routing table via netstat

# DNS
cat /etc/resolv.conf            # DNS server yang digunakan
nslookup domain.com             # Query DNS
dig domain.com                  # Detailed DNS query
dig domain.com ANY              # Semua record
dig @8.8.8.8 domain.com         # Query pakai DNS server spesifik
host domain.com                 # Simple DNS lookup
```

### 1.2 Monitoring Koneksi

```bash
# ss (pengganti netstat — lebih cepat)
ss -tuln                        # TCP/UDP listening ports
ss -tunap                       # + process name & PID
ss -s                           # Statistik koneksi

# netstat (legacy tapi masih penting)
netstat -tuln                   # Listening ports
netstat -tunap                  # + PID/program
netstat -an                     # Semua koneksi

# Koneksi aktif — siapa yang terhubung?
ss -tunap | grep ESTABLISHED    # Koneksi aktif
lsof -i -P -n                  # File/socket yang terbuka
lsof -i :22                    # Siapa pakai port 22?

# Network tracing
traceroute domain.com           # Jalur paket ke tujuan
traceroute -T domain.com        # Pakai TCP (bypass ICMP block)
mtr domain.com                  # Real-time traceroute
ping -c 4 domain.com            # Test konektivitas
```

### 1.3 Penjelasan Output `ss -tuln`

```
State    Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN   0       128     0.0.0.0:22          0.0.0.0:*          sshd
LISTEN   0       511     0.0.0.0:80          0.0.0.0:*          nginx
LISTEN   0       128     127.0.0.1:3306      0.0.0.0:*          mysqld

Yang perlu diperhatikan:
- 0.0.0.0:22   → SSH listening di SEMUA interface (terekspos!)
- 127.0.0.1:3306 → MySQL hanya lokal (aman)
- Port yang tidak dikenal → Investigasi! Bisa jadi backdoor
```

---

## 2. SSH — SECURE SHELL

SSH adalah **cara utama** mengakses server Linux secara remote dengan aman.

### 2.1 Penggunaan Dasar

```bash
# Connect ke server
ssh user@192.168.1.100
ssh -p 2222 user@server         # Port non-standard
ssh -i ~/.ssh/key.pem user@server  # Pakai private key

# Copy file via SSH
scp file.txt user@server:/tmp/  # Upload
scp user@server:/tmp/file.txt . # Download
scp -r dir/ user@server:/tmp/   # Copy directory

# SSH Tunneling (Port Forwarding)
ssh -L 8080:localhost:80 user@server   # Local → akses port 80 server via localhost:8080
ssh -R 8080:localhost:80 user@server   # Remote → expose lokal ke server
ssh -D 9050 user@server                # Dynamic (SOCKS proxy)
```

### 2.2 Key-Based Authentication (Lebih Aman dari Password!)

```bash
# 1. Generate key pair
ssh-keygen -t ed25519 -C "noir@workstation"
# → Pilih Ed25519 (lebih aman & cepat dari RSA)
# → Simpan di ~/.ssh/id_ed25519
# → SET PASSPHRASE! (lapisan keamanan tambahan)

# 2. Copy public key ke server
ssh-copy-id user@server
# Atau manual:
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# 3. Test login tanpa password
ssh user@server
```

### 2.3 SSH Hardening (`/etc/ssh/sshd_config`)

```bash
# === CRITICAL SSH HARDENING ===

# 1. Disable root login (WAJIB!)
PermitRootLogin no

# 2. Disable password auth (pakai key saja)
PasswordAuthentication no
PubkeyAuthentication yes

# 3. Ganti port default (hindari automated scanning)
Port 2222

# 4. Batasi user yang boleh SSH
AllowUsers analyst1 analyst2
# Atau batasi group
AllowGroups sshusers

# 5. Timeout idle session
ClientAliveInterval 300
ClientAliveCountMax 2

# 6. Disable empty passwords
PermitEmptyPasswords no

# 7. Protocol version (hanya SSH v2)
Protocol 2

# 8. Batasi max auth attempts
MaxAuthTries 3

# 9. Disable X11 forwarding (kecuali dibutuhkan)
X11Forwarding no

# 10. Log level
LogLevel VERBOSE

# Restart SSH setelah konfigurasi
sudo systemctl restart sshd
```

---

## 3. FIREWALL — UFW & IPTABLES

### 3.1 UFW (Uncomplicated Firewall)

UFW adalah frontend sederhana untuk iptables. Cocok untuk pemula.

```bash
# Status
sudo ufw status verbose
sudo ufw status numbered        # Dengan nomor rule

# Enable/Disable
sudo ufw enable
sudo ufw disable

# Default policy
sudo ufw default deny incoming   # BLOKIR semua masuk (recommended)
sudo ufw default allow outgoing  # Izinkan semua keluar

# Allow rules
sudo ufw allow 22/tcp           # Allow SSH
sudo ufw allow 80/tcp           # Allow HTTP
sudo ufw allow 443/tcp          # Allow HTTPS
sudo ufw allow from 192.168.1.0/24 to any port 22  # SSH hanya dari subnet lokal

# Deny rules
sudo ufw deny 23/tcp            # Block Telnet
sudo ufw deny from 10.0.0.5     # Block IP spesifik

# Delete rules
sudo ufw delete allow 80/tcp
sudo ufw delete 3               # Hapus rule nomor 3

# Rate limiting (anti brute force)
sudo ufw limit 22/tcp           # Max 6 koneksi/30 detik per IP
```

### 3.2 iptables (Advanced Firewall)

iptables lebih powerful dan fleksibel, tapi lebih kompleks.

```bash
# Lihat rules
sudo iptables -L -n -v          # List semua rules
sudo iptables -L -n --line-numbers  # Dengan nomor baris

# Struktur: iptables -A [CHAIN] [match] -j [TARGET]
# CHAIN: INPUT (masuk), OUTPUT (keluar), FORWARD (routing)
# TARGET: ACCEPT, DROP, REJECT, LOG

# Default policy — DROP semua, lalu whitelist
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Allow loopback (localhost)
sudo iptables -A INPUT -i lo -j ACCEPT

# Allow established connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (port 22)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Block IP spesifik
sudo iptables -A INPUT -s 10.0.0.5 -j DROP

# Log dropped packets
sudo iptables -A INPUT -j LOG --log-prefix "IPTables-Dropped: "

# Rate limit SSH (anti brute force)
sudo iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
sudo iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP

# Save rules (Debian/Ubuntu)
sudo iptables-save > /etc/iptables.rules
# Restore
sudo iptables-restore < /etc/iptables.rules
```

---

## 4. FAIL2BAN — Intrusion Prevention

Fail2ban **otomatis memblokir IP** yang menunjukkan perilaku mencurigakan (brute force, dll).

```bash
# Install
sudo apt install fail2ban

# Konfigurasi: /etc/fail2ban/jail.local
# (JANGAN edit jail.conf, buat jail.local)
```

```ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 3600        # Ban selama 1 jam
findtime = 600         # Window deteksi 10 menit
maxretry = 3           # Max 3 percobaan gagal
banaction = ufw        # Pakai UFW untuk ban

[sshd]
enabled  = true
port     = ssh
logpath  = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled  = true
port     = http,https
logpath  = /var/log/nginx/error.log
maxretry = 5
```

```bash
# Monitoring fail2ban
sudo fail2ban-client status              # Status umum
sudo fail2ban-client status sshd         # Status jail SSH
sudo fail2ban-client set sshd unbanip 10.0.0.5  # Unban IP
sudo fail2ban-client set sshd banip 10.0.0.5    # Manual ban

# Log fail2ban
sudo tail -f /var/log/fail2ban.log
```

---

## 5. SYSTEM HARDENING — CIS BENCHMARK

CIS (Center for Internet Security) Benchmark adalah **standar industri** untuk hardening sistem.

### Checklist Hardening Linux (15+ Kontrol)

```bash
# ═══ 1. UPDATE SISTEM ═══
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y

# ═══ 2. DISABLE UNNECESSARY SERVICES ═══
# Lihat service yang berjalan
systemctl list-units --type=service --state=running
# Disable yang tidak perlu
sudo systemctl disable --now cups          # Print server
sudo systemctl disable --now avahi-daemon  # mDNS
sudo systemctl disable --now bluetooth     # Bluetooth

# ═══ 3. SECURE BOOT SETTINGS ═══
# Set password GRUB
sudo grub-mkpasswd-pbkdf2
# Tambah hash ke /etc/grub.d/40_custom

# ═══ 4. FILESYSTEM HARDENING ═══
# /tmp dengan noexec (cegah eksekusi malware dari /tmp)
# Tambah di /etc/fstab:
# tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev 0 0

# ═══ 5. PASSWORD POLICY ═══
# /etc/login.defs
PASS_MAX_DAYS   90    # Max umur password
PASS_MIN_DAYS   7     # Min umur password  
PASS_WARN_AGE   14    # Warning sebelum expire

# Install libpam-pwquality untuk password complexity
sudo apt install libpam-pwquality
# /etc/security/pwquality.conf:
# minlen = 12
# dcredit = -1 (min 1 digit)
# ucredit = -1 (min 1 uppercase)
# lcredit = -1 (min 1 lowercase)
# ocredit = -1 (min 1 special char)

# ═══ 6. SECURE SUDO ═══
# Audit sudoers
sudo visudo
# Pastikan: Defaults logfile="/var/log/sudo.log"
# Pastikan: Defaults use_pty

# ═══ 7. DISABLE USB STORAGE (jika tidak diperlukan) ═══
echo "blacklist usb-storage" | sudo tee /etc/modprobe.d/disable-usb-storage.conf

# ═══ 8. AUDIT LOGGING ═══
sudo apt install auditd
sudo systemctl enable --now auditd
# Audit rules: /etc/audit/rules.d/
# Monitor file sensitif:
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo auditctl -w /etc/shadow -p wa -k shadow_changes
sudo auditctl -w /etc/sudoers -p wa -k sudoers_changes

# ═══ 9. KERNEL HARDENING (sysctl) ═══
# /etc/sysctl.d/99-security.conf
cat << 'EOF' | sudo tee /etc/sysctl.d/99-security.conf
# Disable IP forwarding
net.ipv4.ip_forward = 0
# Disable ICMP redirect acceptance
net.ipv4.conf.all.accept_redirects = 0
# Enable SYN cookies (anti SYN flood)
net.ipv4.tcp_syncookies = 1
# Disable source routing
net.ipv4.conf.all.accept_source_route = 0
# Enable reverse path filtering
net.ipv4.conf.all.rp_filter = 1
# Log martian packets
net.ipv4.conf.all.log_martians = 1
# Disable ICMP broadcast response
net.ipv4.icmp_echo_ignore_broadcasts = 1
# Randomize memory layout (ASLR)
kernel.randomize_va_space = 2
EOF
sudo sysctl -p /etc/sysctl.d/99-security.conf

# ═══ 10. REMOVE UNNECESSARY PACKAGES ═══
sudo apt purge telnet rsh-client rsh-server

# ═══ 11. FILE INTEGRITY ═══
sudo apt install aide
sudo aideinit
# Cek perubahan:
sudo aide --check

# ═══ 12. BANNER WARNING ═══
echo "Unauthorized access prohibited. All activity is monitored." | sudo tee /etc/issue
echo "Unauthorized access prohibited. All activity is monitored." | sudo tee /etc/issue.net

# ═══ 13. CRON JOB SECURITY ═══
sudo chmod 600 /etc/crontab
sudo chmod 700 /etc/cron.d /etc/cron.daily /etc/cron.hourly

# ═══ 14. WORLD-WRITABLE FILES (cek regularly!) ═══
find / -xdev -type f -perm -0002 2>/dev/null  # File yang siapa saja bisa tulis

# ═══ 15. UNOWNED FILES ═══
find / -xdev -nouser -o -nogroup 2>/dev/null   # File tanpa owner
```

---

## 6. CHECKLIST PEMAHAMAN P4

- [ ] Gunakan `ss` untuk melihat port yang listening
- [ ] Jelaskan perbedaan UFW dan iptables
- [ ] Konfigurasi SSH key-based auth dan hardening
- [ ] Setup firewall yang hanya allow SSH, HTTP, HTTPS
- [ ] Install dan konfigurasi fail2ban
- [ ] Sebutkan 10 kontrol hardening CIS Benchmark
- [ ] Apa itu SYN cookies dan mengapa penting?
- [ ] Apa itu ASLR dan bagaimana mengaktifkannya?
- [ ] Bagaimana cara audit perubahan file sensitif?
- [ ] Tulis iptables rule untuk rate-limit SSH

---

*Selanjutnya: [P5 — Kriptografi: Konsep & Implementasi](./P5-Kriptografi.md)*
