# 🔐 P5 — KRIPTOGRAFI: KONSEP & IMPLEMENTASI

> *"Cryptography is the ultimate form of non-violent direct action."* — Julian Assange

---

## 1. APA ITU KRIPTOGRAFI?

**Kriptografi** = seni dan ilmu mengamankan informasi dengan mengubahnya menjadi format yang tidak bisa dibaca tanpa kunci yang benar.

```
Plaintext  ──[Enkripsi + Kunci]──►  Ciphertext  ──[Dekripsi + Kunci]──►  Plaintext
"Hello"                              "x7$kQ9"                             "Hello"
```

### Tujuan Kriptografi (4 Pilar)

| Pilar | Fungsi | Contoh |
|-------|--------|--------|
| **Confidentiality** | Data tidak bisa dibaca pihak lain | Enkripsi AES/RSA |
| **Integrity** | Data tidak diubah selama transit | Hashing SHA-256 |
| **Authentication** | Membuktikan identitas pengirim | Digital signature |
| **Non-repudiation** | Pengirim tidak bisa menyangkal | Digital signature + timestamp |

### Sejarah Singkat Kriptografi

| Era | Teknik | Catatan |
|-----|--------|---------|
| ~700 SM | Caesar Cipher | Geser huruf N posisi |
| 1467 | Vigenère Cipher | Polyalphabetic substitution |
| WW2 | Enigma Machine | Digunakan Nazi, dipecahkan Alan Turing |
| 1976 | Diffie-Hellman | Key exchange pertama — revolusi! |
| 1977 | RSA | Asymmetric encryption pertama |
| 2001 | AES | Standar enkripsi modern (mengganti DES) |
| 2020an | Post-Quantum | Persiapan menghadapi quantum computer |

---

## 2. SYMMETRIC ENCRYPTION (Enkripsi Simetris)

**Satu kunci** untuk enkripsi DAN dekripsi. Cepat, efisien untuk data besar.

```
         Kunci yang SAMA
              │
Plaintext ──[Encrypt]──► Ciphertext ──[Decrypt]──► Plaintext
              │                           │
          Kunci: K                    Kunci: K
```

**Masalah utama**: Bagaimana mengirim kunci dengan aman? (Key Distribution Problem)

### Algoritma Symmetric

| Algoritma | Key Size | Block Size | Status |
|-----------|----------|------------|--------|
| **DES** | 56-bit | 64-bit | ❌ TIDAK AMAN — bisa di-brute-force |
| **3DES** | 168-bit | 64-bit | ⚠️ Deprecated — lambat |
| **AES-128** | 128-bit | 128-bit | ✅ Aman — standar pemerintah AS |
| **AES-256** | 256-bit | 128-bit | ✅ Sangat aman — military grade |
| **ChaCha20** | 256-bit | Stream | ✅ Aman — alternatif AES, cepat di mobile |

### AES (Advanced Encryption Standard)

AES adalah **standar enkripsi paling banyak digunakan di dunia**.

**Block Cipher Modes** (cara AES memproses data lebih besar dari 1 block):

| Mode | Nama | Keamanan | Catatan |
|------|------|----------|---------|
| **ECB** | Electronic Codebook | ❌ BURUK | Block identik → ciphertext identik (pola terlihat!) |
| **CBC** | Cipher Block Chaining | ✅ Baik | Tiap block bergantung pada block sebelumnya |
| **CTR** | Counter | ✅ Baik | Bisa diparalelkan, cepat |
| **GCM** | Galois/Counter Mode | ✅ Terbaik | Enkripsi + authentication sekaligus |

> **Rekomendasi**: Selalu gunakan **AES-256-GCM** untuk enkripsi modern. GCM memberikan confidentiality + integrity sekaligus (AEAD — Authenticated Encryption with Associated Data).

### Implementasi dengan OpenSSL

```bash
# Enkripsi file dengan AES-256-CBC
openssl enc -aes-256-cbc -salt -in rahasia.txt -out rahasia.enc -pbkdf2
# → Akan diminta password

# Dekripsi
openssl enc -aes-256-cbc -d -in rahasia.enc -out rahasia_decrypted.txt -pbkdf2

# Generate random key
openssl rand -hex 32    # 256-bit key dalam hex
openssl rand -base64 32 # 256-bit key dalam base64
```

---

## 3. ASYMMETRIC ENCRYPTION (Enkripsi Asimetris)

**Dua kunci berbeda**: Public key (untuk enkripsi) dan Private key (untuk dekripsi).

```
Alice                                          Bob
  │                                              │
  │  Bob's Public Key (bisa dibagikan ke semua)  │
  │◄─────────────────────────────────────────────│
  │                                              │
  │  Encrypt("Hello", Bob_PublicKey)             │
  │──────────── Ciphertext ─────────────────────►│
  │                                              │
  │              Decrypt(Ciphertext, Bob_PrivateKey)
  │              → "Hello"                       │
```

**Kelebihan**: Tidak perlu share secret key — solved Key Distribution Problem!
**Kekurangan**: Jauh lebih lambat dari symmetric (1000x lebih lambat)

### Algoritma Asymmetric

| Algoritma | Key Size | Keamanan | Catatan |
|-----------|----------|----------|---------|
| **RSA-2048** | 2048-bit | ✅ Aman | Standar industri, berbasis faktorisasi |
| **RSA-4096** | 4096-bit | ✅ Sangat aman | Lebih lambat, untuk high-security |
| **ECC (P-256)** | 256-bit | ✅ Aman | Sama amannya dgn RSA-3072 tapi key lebih kecil |
| **Ed25519** | 256-bit | ✅ Aman | Cepat, modern, digunakan SSH |
| **Diffie-Hellman** | Varies | ✅ | Key exchange protocol |

### Hybrid Encryption (Cara Dunia Nyata Bekerja!)

Karena asymmetric lambat, dunia nyata menggunakan **hybrid**:

```
1. Generate random AES key (session key)
2. Enkripsi data dengan AES key (cepat!)
3. Enkripsi AES key dengan RSA public key
4. Kirim: [encrypted data] + [encrypted AES key]

Penerima:
1. Dekripsi AES key dengan RSA private key
2. Dekripsi data dengan AES key
```

> Ini persis cara **TLS/HTTPS** bekerja!

### Implementasi RSA dengan OpenSSL

```bash
# 1. Generate RSA private key (2048-bit)
openssl genrsa -out private.pem 2048

# 2. Extract public key dari private key
openssl rsa -in private.pem -pubout -out public.pem

# 3. Lihat isi key
openssl rsa -in private.pem -text -noout

# 4. Enkripsi file dengan public key
openssl rsautl -encrypt -inkey public.pem -pubin -in pesan.txt -out pesan.enc

# 5. Dekripsi dengan private key
openssl rsautl -decrypt -inkey private.pem -in pesan.enc -out pesan_decrypted.txt
```

---

## 4. HASH FUNCTIONS

Hash function mengubah input apapun menjadi output **fixed-length** yang unik. **Satu arah** — tidak bisa di-reverse.

```
Input: "Hello"        → SHA-256 → 185f8db32271fe25f561a6fc938b2e26...
Input: "Hello!"       → SHA-256 → 334d016f755cd6dc58c53a86e183882f...
Input: (file 4GB)     → SHA-256 → a1b2c3d4e5f6... (tetap 64 karakter)
```

**Properti Hash yang Baik**:
1. **Deterministic** — Input sama → output selalu sama
2. **Fast** — Cepat dihitung
3. **Avalanche Effect** — Perubahan 1 bit input → output berubah total
4. **Pre-image Resistant** — Tidak bisa menemukan input dari hash
5. **Collision Resistant** — Sangat sulit menemukan 2 input dengan hash sama

### Perbandingan Algoritma Hash

| Algoritma | Output | Status | Penggunaan |
|-----------|--------|--------|------------|
| **MD5** | 128-bit (32 hex) | ❌ BROKEN | Jangan untuk security! Hanya checksum |
| **SHA-1** | 160-bit (40 hex) | ❌ BROKEN | Google membuktikan collision (2017) |
| **SHA-256** | 256-bit (64 hex) | ✅ Aman | File integrity, blockchain, TLS |
| **SHA-512** | 512-bit (128 hex) | ✅ Aman | High-security applications |
| **bcrypt** | 184-bit | ✅ Aman | Password hashing (slow by design!) |
| **Argon2** | Configurable | ✅ Terbaik | Password hashing modern (PHC winner) |

### Mengapa MD5 dan SHA-1 Tidak Aman?

**Collision Attack**: Menemukan 2 input berbeda yang menghasilkan hash sama.
- MD5 collision: ditemukan 2004, bisa dilakukan dalam **detik**
- SHA-1 collision: Google SHAttered project (2017) — cost ~$110.000 computing

### Penggunaan Hash

```bash
# Hitung hash file
md5sum file.txt            # MD5 (hanya untuk checksum, bukan security)
sha256sum file.txt         # SHA-256 (recommended)
sha512sum file.txt         # SHA-512

# Verifikasi integritas file
echo "abc123hash file.txt" | sha256sum -c  # Check hash match

# Hash password (JANGAN pakai MD5/SHA langsung!)
# Pakai bcrypt/Argon2 dengan salt
python3 -c "import bcrypt; print(bcrypt.hashpw(b'password123', bcrypt.gensalt()))"
```

### Password Hashing: Mengapa Beda dari Hash Biasa?

Password hashing HARUS:
- **Slow** (bcrypt, Argon2) — supaya brute force mahal
- **Salted** — tambah random string agar hash sama untuk password sama menjadi berbeda
- **Memory-hard** (Argon2) — supaya GPU cracking tidak efektif

```
Tanpa salt:
"password123" → SHA-256 → ef92b778... (semua user dengan password sama = hash sama!)

Dengan salt:
"password123" + "x8k2m" → bcrypt → $2b$12$LJ3m... (unik per user!)
"password123" + "p9q1r" → bcrypt → $2b$12$Kx9n... (berbeda!)
```

### Password Cracking dengan Hashcat

```bash
# Crack MD5 hash dengan wordlist
hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt
# -m 0 = MD5
# -m 100 = SHA-1
# -m 1400 = SHA-256
# -m 3200 = bcrypt

# Crack dengan rules (mutasi: password → P@ssw0rd)
hashcat -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Brute force (semua kombinasi)
hashcat -m 0 hash.txt -a 3 ?a?a?a?a?a?a  # 6 karakter, semua charset
```

---

## 5. DIGITAL SIGNATURE

Digital signature membuktikan **keaslian** dan **integritas** dokumen.

```
SIGNING (Pengirim):
Document ──[Hash]──► Digest ──[Encrypt dgn Private Key]──► Signature

VERIFYING (Penerima):
Signature ──[Decrypt dgn Public Key]──► Digest₁
Document  ──[Hash]──► Digest₂
Digest₁ == Digest₂? → ✅ Valid! (dokumen asli dan tidak diubah)
```

```bash
# Sign file
openssl dgst -sha256 -sign private.pem -out signature.bin document.pdf

# Verify signature
openssl dgst -sha256 -verify public.pem -signature signature.bin document.pdf
# Output: "Verified OK" atau "Verification Failure"
```

---

## 6. IMPLEMENTASI PYTHON: Hybrid Encryption System

```python
#!/usr/bin/env python3
"""
Hybrid Encryption System
RSA (key exchange) + AES-256-GCM (data encryption) + SHA-256 (integrity)
"""

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes, serialization
import os

# === 1. GENERATE RSA KEY PAIR ===
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)
public_key = private_key.public_key()

# === 2. ENCRYPT (Pengirim) ===
def encrypt_message(message: bytes, recipient_public_key):
    # Generate random AES-256 key
    aes_key = AESGCM.generate_key(bit_length=256)
    nonce = os.urandom(12)  # 96-bit nonce untuk GCM
    
    # Encrypt data dengan AES-GCM
    aesgcm = AESGCM(aes_key)
    ciphertext = aesgcm.encrypt(nonce, message, None)
    
    # Encrypt AES key dengan RSA public key
    encrypted_aes_key = recipient_public_key.encrypt(
        aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    
    return encrypted_aes_key, nonce, ciphertext

# === 3. DECRYPT (Penerima) ===
def decrypt_message(encrypted_aes_key, nonce, ciphertext, recipient_private_key):
    # Decrypt AES key dengan RSA private key
    aes_key = recipient_private_key.decrypt(
        encrypted_aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    
    # Decrypt data dengan AES-GCM
    aesgcm = AESGCM(aes_key)
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    
    return plaintext

# === DEMO ===
message = b"Data rahasia: password database adalah Sup3rS3cur3!"
enc_key, nonce, ciphertext = encrypt_message(message, public_key)
decrypted = decrypt_message(enc_key, nonce, ciphertext, private_key)

print(f"Original:  {message.decode()}")
print(f"Encrypted: {ciphertext[:50].hex()}...")
print(f"Decrypted: {decrypted.decode()}")
print(f"Match: {message == decrypted}")
```

---

## 7. CHECKLIST PEMAHAMAN P5

- [ ] Apa perbedaan symmetric dan asymmetric encryption?
- [ ] Mengapa AES-GCM lebih baik dari AES-ECB?
- [ ] Apa itu hybrid encryption dan mengapa digunakan?
- [ ] Mengapa MD5 dan SHA-1 tidak aman?
- [ ] Apa perbedaan hashing dan encryption?
- [ ] Mengapa password harus di-hash dengan bcrypt/Argon2, bukan SHA-256?
- [ ] Apa itu salt dan mengapa penting?
- [ ] Bagaimana digital signature bekerja?
- [ ] Enkripsi file dengan OpenSSL (AES-256-CBC)
- [ ] Generate RSA key pair dengan OpenSSL

---

*Selanjutnya: [P6 — PKI, TLS/SSL & Certificate Management](./P6-PKI-TLS.md)*
