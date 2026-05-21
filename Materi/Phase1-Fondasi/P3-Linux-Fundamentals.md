# 🐧 P3 — LINUX FUNDAMENTALS & SYSTEM ADMINISTRATION

> *"In a world without walls and fences, who needs Windows and Gates?"* — Komunitas Linux
> Dalam cybersecurity, **Linux adalah bahasa ibu.** Mayoritas server, tools hacking, dan infrastruktur security berjalan di Linux.

---

## 1. MENGAPA LINUX UNTUK CYBERSECURITY?

| Alasan | Penjelasan |
|--------|------------|
| **Server dominance** | ~96% web server di dunia menjalankan Linux |
| **Kali Linux** | Distro khusus pentesting dengan 600+ tools bawaan |
| **Open source** | Bisa diaudit, dimodifikasi, dipelajari kode sumbernya |
| **Terminal power** | CLI jauh lebih powerful daripada GUI untuk security tasks |
| **Scripting** | Bash scripting untuk automasi tugas security |
| **Gratis** | Tidak perlu lisensi |
| **Target & weapon** | Linux adalah target serangan DAN senjata untuk menyerang |

### Distro Linux untuk Cybersecurity

| Distro | Kegunaan |
|--------|----------|
| **Kali Linux** | Penetration testing, offensive security |
| **Parrot OS** | Pentesting + privacy + development |
| **Ubuntu Server** | Server deployment, lab environment |
| **REMnux** | Malware analysis & reverse engineering |
| **SIFT Workstation** | Digital forensics & incident response |
| **Security Onion** | Network security monitoring & IDS |

---

## 2. STRUKTUR FILESYSTEM LINUX

```
/  (root — akar dari segalanya)
├── /bin       → Binary executable (ls, cp, cat, grep)
├── /sbin      → System binary (hanya root: iptables, fdisk)
├── /boot      → Kernel & bootloader (vmlinuz, grub)
├── /dev       → Device files (sda, tty, null)
├── /etc       → Konfigurasi sistem (passwd, shadow, ssh)
│   ├── /etc/passwd      → Daftar user
│   ├── /etc/shadow      → Hash password (hanya root)
│   ├── /etc/hosts       → DNS lokal
│   ├── /etc/ssh/        → Konfigurasi SSH
│   ├── /etc/crontab     → Scheduled tasks
│   └── /etc/sudoers     → Konfigurasi sudo
├── /home      → Home directory user (/home/noir)
├── /lib       → Library (shared libraries, kernel modules)
├── /media     → Mount point USB/CD otomatis
├── /mnt       → Mount point manual
├── /opt       → Software pihak ketiga
├── /proc      → Virtual filesystem — info proses & kernel
│   ├── /proc/cpuinfo    → Info CPU
│   ├── /proc/meminfo    → Info RAM
│   └── /proc/[PID]/     → Info per proses
├── /root      → Home directory root user
├── /run       → Runtime data (PID files, sockets)
├── /srv       → Data untuk layanan (web, FTP)
├── /sys       → Virtual filesystem — info hardware
├── /tmp       → File temporary (dihapus saat reboot)
├── /usr       → User programs & data
│   ├── /usr/bin     → User binaries
│   ├── /usr/sbin    → System admin binaries
│   └── /usr/share   → Shared data (wordlists, man pages)
└── /var       → Variable data (logs, database, mail)
    ├── /var/log/        → LOG FILES (sangat penting!)
    │   ├── auth.log     → Login attempts
    │   ├── syslog       → System events
    │   └── kern.log     → Kernel messages
    ├── /var/www/        → Web server files
    └── /var/tmp/        → Persistent temp files
```

### File Penting untuk Security

| File | Isi | Akses |
|------|-----|-------|
| `/etc/passwd` | Daftar user (username, UID, GID, home, shell) | Semua bisa baca |
| `/etc/shadow` | Hash password user | Hanya root |
| `/etc/group` | Daftar group dan member | Semua bisa baca |
| `/etc/sudoers` | Siapa yang boleh pakai sudo | Hanya root |
| `/var/log/auth.log` | Log autentikasi (login, sudo, SSH) | Root |
| `/var/log/syslog` | Log sistem umum | Root |
| `/etc/crontab` | Scheduled tasks (bisa dieksploitasi untuk privesc) | Root |

---

## 3. COMMAND LINE ESSENTIALS

### 3.1 Navigasi & File Management

```bash
# Navigasi
pwd                     # Print working directory (di mana saya?)
ls                      # List isi directory
ls -la                  # List detail + hidden files
ls -lah                 # + human-readable size
cd /etc                 # Pindah ke /etc
cd ~                    # Pindah ke home directory
cd ..                   # Naik satu level
cd -                    # Kembali ke directory sebelumnya

# File Operations
touch file.txt          # Buat file kosong
mkdir dirname           # Buat directory
mkdir -p a/b/c          # Buat nested directory
cp file1 file2          # Copy file
cp -r dir1 dir2         # Copy directory (recursive)
mv file1 file2          # Pindah/rename file
rm file.txt             # Hapus file
rm -rf dirname          # Hapus directory (HATI-HATI!)

# Membaca File
cat file.txt            # Tampilkan seluruh isi file
head -n 20 file.txt     # 20 baris pertama
tail -n 20 file.txt     # 20 baris terakhir
tail -f /var/log/auth.log  # Follow log real-time (sangat berguna!)
less file.txt           # Scroll-able viewer
nano file.txt           # Text editor sederhana
vim file.txt            # Text editor advanced

# Cari File
find / -name "passwd"           # Cari file bernama "passwd"
find / -perm -4000 2>/dev/null  # Cari file SUID (privesc vector!)
find / -user root -writable     # File root yang writable
locate filename                 # Cari cepat (pakai database)
which nmap                      # Lokasi executable
```

### 3.2 Text Processing (Sangat Penting untuk Log Analysis!)

```bash
# grep — Cari pattern dalam file
grep "Failed" /var/log/auth.log        # Cari "Failed" di auth.log
grep -i "error" syslog                 # Case-insensitive
grep -r "password" /etc/               # Recursive search di directory
grep -c "Failed" auth.log              # Hitung jumlah match
grep -v "INFO" syslog                  # Exclude baris yang mengandung "INFO"
grep -E "root|admin" /etc/passwd       # Regex: cari "root" ATAU "admin"

# awk — Text processing powerful
awk '{print $1}' access.log            # Print kolom pertama
awk -F: '{print $1,$7}' /etc/passwd    # Print username & shell
awk '$9 == 404' access.log             # Filter HTTP 404 errors
awk '{print $1}' access.log | sort | uniq -c | sort -rn  # Top IP visitors

# sed — Stream editor
sed 's/old/new/g' file.txt             # Replace semua "old" dengan "new"
sed -n '10,20p' file.txt               # Print baris 10-20
sed '/^#/d' config.file                # Hapus baris komentar

# cut — Potong kolom
cut -d: -f1 /etc/passwd                # Username dari passwd
cut -d' ' -f1 access.log              # IP address dari access log

# sort & uniq — Sorting dan deduplikasi
sort file.txt                          # Sort alphabetical
sort -n file.txt                       # Sort numerical
sort -rn file.txt                      # Reverse numerical sort
uniq                                   # Hapus duplikat berurutan
sort | uniq -c | sort -rn              # Hitung frekuensi (PATTERN UTAMA!)

# wc — Word count
wc -l file.txt                         # Hitung jumlah baris
cat auth.log | grep "Failed" | wc -l   # Berapa kali login gagal?

# Pipeline — Menggabungkan commands (POWER TOOL!)
cat /var/log/auth.log | grep "Failed password" | awk '{print $11}' | sort | uniq -c | sort -rn | head -10
# ↑ Ini menunjukkan: 10 IP address teratas yang gagal login (brute force detection!)
```

### 3.3 User & Permission Management

```bash
# User Management
whoami                          # Siapa saya?
id                              # UID, GID, groups
sudo su                         # Jadi root
sudo -l                         # Lihat apa yang bisa saya sudo
adduser username                # Tambah user baru
usermod -aG sudo username       # Tambah user ke group sudo
userdel -r username             # Hapus user + home directory
passwd username                 # Ganti password user
chage -l username               # Lihat password policy
chage -M 90 username            # Password expire 90 hari

# Group Management
groups username                 # Lihat group user
groupadd groupname              # Buat group
usermod -aG groupname username  # Tambah user ke group
```

### Permission System

```
┌──────────────────────────────────────────────┐
│  -rwxr-xr-- 1 root staff 4096 Jan 1 file.txt│
│  │├─┤├─┤├─┤                                  │
│  │ │   │  │                                   │
│  │ │   │  └── Others: read only (r--)        │
│  │ │   └───── Group: read + execute (r-x)    │
│  │ └───────── Owner: read+write+exec (rwx)   │
│  └─────────── Type: - file, d directory      │
└──────────────────────────────────────────────┘

r (read)    = 4    → Bisa baca
w (write)   = 2    → Bisa tulis/edit
x (execute) = 1    → Bisa eksekusi/masuk directory
```

```bash
# chmod — Ubah permission
chmod 755 script.sh     # rwxr-xr-x (owner full, others read+exec)
chmod 644 file.txt      # rw-r--r-- (owner read+write, others read)
chmod 600 secret.key    # rw------- (hanya owner bisa akses)
chmod 777 file.txt      # rwxrwxrwx (JANGAN! Semua bisa segalanya)
chmod +x script.sh      # Tambah execute permission
chmod -w file.txt       # Hapus write permission
chmod u+s binary        # Set SUID bit (jalankan sebagai owner!)

# chown — Ubah ownership
chown user:group file.txt
chown -R user:group dir/    # Recursive

# umask — Default permission untuk file baru
umask                       # Lihat umask saat ini
umask 027                   # File baru: 640, Dir baru: 750
```

### Special Permissions (Penting untuk Privilege Escalation!)

| Bit | Nama | Efek | Risiko Security |
|-----|------|------|-----------------|
| **SUID (4)** | Set User ID | File dijalankan sebagai owner (biasanya root) | Jika ada bug → instant root! |
| **SGID (2)** | Set Group ID | File dijalankan sebagai group owner | Akses group privilege |
| **Sticky (1)** | Sticky Bit | Hanya owner yang bisa hapus file di directory | Proteksi /tmp |

```bash
# Cari file SUID (potential privesc!)
find / -perm -4000 -type f 2>/dev/null

# Contoh output:
/usr/bin/passwd      # Normal — perlu root untuk edit /etc/shadow
/usr/bin/sudo        # Normal — sudo perlu root
/usr/bin/nmap        # BERBAHAYA! Nmap SUID → bisa spawn root shell
/usr/bin/find        # BERBAHAYA! find SUID → bisa exec sebagai root
```

### 3.4 Process Management

```bash
# Lihat proses
ps aux                 # Semua proses (BSD style)
ps -ef                 # Semua proses (System V style)
ps aux | grep ssh      # Cari proses SSH
top                    # Real-time process monitor
htop                   # Better top (kalau terinstall)

# Kill proses
kill PID               # Kirim SIGTERM (minta berhenti baik-baik)
kill -9 PID            # Kirim SIGKILL (paksa mati)
killall processname    # Kill semua proses dengan nama tertentu
pkill -f "pattern"     # Kill berdasarkan pattern

# Service management (systemd)
systemctl status sshd          # Status service SSH
systemctl start sshd           # Start service
systemctl stop sshd            # Stop service
systemctl enable sshd          # Auto-start saat boot
systemctl disable sshd         # Jangan auto-start
systemctl list-units --type=service  # List semua service

# Background processes
command &              # Jalankan di background
nohup command &        # Tetap jalan setelah terminal ditutup
jobs                   # List background jobs
fg %1                  # Bawa job ke foreground
```

### 3.5 Package Management

```bash
# Debian/Ubuntu (apt)
apt update                     # Update daftar paket
apt upgrade                    # Upgrade semua paket
apt install nmap               # Install Nmap
apt remove nmap                # Hapus Nmap
apt search wireshark           # Cari paket
apt list --installed           # List paket terinstall

# RedHat/CentOS (yum/dnf)
yum update                     # Update
yum install nmap               # Install
dnf install nmap               # Sama (Fedora/CentOS 8+)
```

---

## 4. BASH SCRIPTING UNTUK SECURITY

### 4.1 Dasar Bash Script

```bash
#!/bin/bash
# Shebang line ↑ — memberitahu sistem untuk menjalankan dengan bash

# Variabel
name="SecurityBot"
echo "Halo, saya $name"

# Input
read -p "Masukkan IP target: " target_ip
echo "Scanning $target_ip..."

# Kondisi
if [ "$target_ip" == "" ]; then
    echo "Error: IP tidak boleh kosong!"
    exit 1
fi

# Loop
for port in 22 80 443 8080; do
    echo "Checking port $port..."
done

# While loop
while read -r line; do
    echo "Processing: $line"
done < input_file.txt
```

### 4.2 Script Praktis: User Management Automation

```bash
#!/bin/bash
# Script: Automated User Management
# Fungsi: Buat user, set permission, password expiry, generate report

LOG_FILE="/var/log/user_management.log"
REPORT_FILE="/tmp/user_report_$(date +%Y%m%d).txt"

log_action() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

create_user() {
    local username=$1
    local group=$2
    
    if id "$username" &>/dev/null; then
        log_action "WARNING: User $username already exists"
        return 1
    fi
    
    useradd -m -g "$group" -s /bin/bash "$username"
    echo "${username}:ChangeMe123!" | chpasswd
    chage -M 90 -W 14 "$username"  # Password expire 90 hari, warn 14 hari
    passwd -e "$username"           # Force password change on first login
    
    log_action "CREATED: User $username in group $group"
}

generate_report() {
    echo "=== USER REPORT $(date) ===" > "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Total users: $(wc -l < /etc/passwd)" >> "$REPORT_FILE"
    echo "Users with shell access:" >> "$REPORT_FILE"
    grep -v "nologin\|false" /etc/passwd | awk -F: '{print $1, $7}' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "Users in sudo group:" >> "$REPORT_FILE"
    getent group sudo | awk -F: '{print $4}' >> "$REPORT_FILE"
    
    log_action "Report generated: $REPORT_FILE"
}

# Main
log_action "=== Script started ==="
create_user "analyst1" "security"
create_user "analyst2" "security"
generate_report
log_action "=== Script completed ==="
```

### 4.3 Script Praktis: Brute Force Detector

```bash
#!/bin/bash
# Deteksi brute force dari auth.log

AUTH_LOG="/var/log/auth.log"
THRESHOLD=5

echo "=== BRUTE FORCE DETECTION REPORT ==="
echo "Threshold: $THRESHOLD failed attempts"
echo "Log: $AUTH_LOG"
echo "Date: $(date)"
echo "======================================="
echo ""

echo "Top 10 IP dengan login gagal:"
grep "Failed password" "$AUTH_LOG" \
    | awk '{print $(NF-3)}' \
    | sort \
    | uniq -c \
    | sort -rn \
    | head -10 \
    | while read count ip; do
        if [ "$count" -ge "$THRESHOLD" ]; then
            echo "[!] ALERT: $ip — $count attempts (BLOCKING RECOMMENDED)"
        else
            echo "[i] INFO:  $ip — $count attempts"
        fi
    done

echo ""
echo "Top targeted usernames:"
grep "Failed password" "$AUTH_LOG" \
    | awk '{print $(NF-5)}' \
    | sort \
    | uniq -c \
    | sort -rn \
    | head -10
```

---

## 5. CHECKLIST PEMAHAMAN P3

- [ ] Jelaskan struktur filesystem Linux dan fungsi directory utama
- [ ] Di mana password hash disimpan di Linux?
- [ ] Apa arti permission `755` dan `644`?
- [ ] Apa itu SUID bit dan mengapa berbahaya?
- [ ] Bagaimana cara mencari file SUID di sistem?
- [ ] Tulis pipeline untuk mendeteksi brute force dari auth.log
- [ ] Apa perbedaan `kill` dan `kill -9`?
- [ ] Bagaimana cara menambah user dan memberikan akses sudo?
- [ ] Jelaskan fungsi grep, awk, sed, dan cut
- [ ] Buat bash script sederhana untuk automasi tugas security

---

*Selanjutnya: [P4 — Linux Networking & Security Hardening](./P4-Linux-Networking-Hardening.md)*
