# 📜 P22 — GOVERNANCE, RISK & COMPLIANCE (GRC)

---

## 1. FRAMEWORKS & STANDAR

### ISO 27001 — Information Security Management System (ISMS)

Standar internasional untuk **sistem manajemen keamanan informasi**. Sertifikasi ISO 27001 menunjukkan organisasi memiliki keamanan yang terstruktur.

**Struktur**:
- Clauses 4-10: Requirements (wajib untuk sertifikasi)
- Annex A: 93 kontrol keamanan (4 kategori)

**Annex A Categories**:
| Kategori | Jumlah Kontrol | Contoh |
|----------|---------------|--------|
| Organizational (5) | 37 | Policies, roles, threat intel |
| People (6) | 8 | Screening, awareness training |
| Physical (7) | 14 | Secure areas, equipment |
| Technological (8) | 34 | Access control, encryption, logging |

### NIST Cybersecurity Framework (CSF)

Framework dari NIST AS — paling banyak diadopsi di dunia.

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ IDENTIFY │─►│ PROTECT  │─►│ DETECT   │─►│ RESPOND  │─►│ RECOVER  │
│          │  │          │  │          │  │          │  │          │
│ Asset    │  │ Access   │  │ Monitor  │  │ IR Plan  │  │ Restore  │
│ Risk     │  │ Training │  │ Alert    │  │ Mitigate │  │ Improve  │
│ Govern   │  │ Data sec │  │ Analyze  │  │ Comms    │  │ Comms    │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### Standar Lainnya

| Framework | Fokus | Wajib? |
|-----------|-------|--------|
| **PCI-DSS** | Data kartu pembayaran | Ya (jika proses kartu) |
| **SOC 2** | Trust services criteria | Audit-based |
| **HIPAA** | Data kesehatan (AS) | Ya (healthcare AS) |
| **GDPR** | Data pribadi (EU) | Ya (jika handle data EU) |

---

## 2. RISK MANAGEMENT (ISO 27005)

### Risk Assessment Methodology

```
RISK = LIKELIHOOD × IMPACT

Likelihood (1-5):
1 = Rare       (< 1x per 5 tahun)
2 = Unlikely   (1x per 1-5 tahun)
3 = Possible   (1x per tahun)
4 = Likely     (1x per bulan)
5 = Almost Certain (1x per minggu+)

Impact (1-5):
1 = Negligible  (< Rp 10 juta, no data loss)
2 = Minor       (Rp 10-100 juta, limited data)
3 = Moderate    (Rp 100 juta-1 M, significant data)
4 = Major       (Rp 1-10 M, critical data breach)
5 = Catastrophic (> Rp 10 M, business failure)
```

### Risk Matrix

```
IMPACT  5 │  5  │ 10  │ 15  │ 20  │ 25  │
        4 │  4  │  8  │ 12  │ 16  │ 20  │
        3 │  3  │  6  │  9  │ 12  │ 15  │
        2 │  2  │  4  │  6  │  8  │ 10  │
        1 │  1  │  2  │  3  │  4  │  5  │
          └─────┴─────┴─────┴─────┴─────┘
            1     2     3     4     5
                    LIKELIHOOD

1-4:  LOW (Accept)     █ Green
5-9:  MEDIUM (Mitigate) █ Yellow
10-15: HIGH (Priority)  █ Orange
16-25: CRITICAL (Immediate) █ Red
```

### Risk Treatment Options

| Opsi | Aksi | Contoh |
|------|------|--------|
| **Mitigate** | Kurangi likelihood/impact | Pasang firewall, training |
| **Transfer** | Pindahkan risiko ke pihak lain | Asuransi cyber, outsource |
| **Accept** | Terima risiko (jika biaya mitigasi > dampak) | Low risk items |
| **Avoid** | Hindari aktivitas yang menimbulkan risiko | Tidak pakai software X |

### Contoh Risk Register

| ID | Asset | Threat | Vulnerability | L | I | Risk | Treatment | Control | Owner |
|----|-------|--------|---------------|---|---|------|-----------|---------|-------|
| R01 | Web Server | SQLi Attack | No input validation | 4 | 5 | 20 (Critical) | Mitigate | WAF + parameterized queries | Dev Team |
| R02 | Employee | Phishing | Low awareness | 5 | 3 | 15 (High) | Mitigate | Security training quarterly | HR + IT |
| R03 | Laptop | Theft | No disk encryption | 3 | 4 | 12 (High) | Mitigate | BitLocker/LUKS mandatory | IT Ops |
| R04 | Office | Earthquake | Building location | 1 | 5 | 5 (Medium) | Transfer | Insurance + cloud backup | Facilities |

---

## 3. BCP & DRP

### Business Continuity Plan (BCP)
Rencana agar bisnis **tetap beroperasi** selama dan setelah insiden/bencana.

### Disaster Recovery Plan (DRP)
Rencana teknis untuk **memulihkan IT infrastructure** setelah bencana.

**Key Metrics**:
| Metric | Definisi | Contoh |
|--------|----------|--------|
| **RPO** (Recovery Point Objective) | Berapa banyak data yang boleh hilang | RPO = 4 jam → backup setiap 4 jam |
| **RTO** (Recovery Time Objective) | Berapa lama downtime yang bisa ditoleransi | RTO = 2 jam → harus recovery < 2 jam |
| **MTTR** | Mean Time To Recover | Rata-rata waktu recovery |
| **MTBF** | Mean Time Between Failures | Rata-rata uptime sebelum failure |

---

## 4. REGULASI INDONESIA

| Regulasi | Isi Utama |
|----------|-----------|
| **UU ITE** (No. 11/2008, rev. 2024) | Transaksi elektronik, cybercrime, penyebaran konten ilegal |
| **UU PDP** (No. 27/2022) | Perlindungan Data Pribadi — consent, data minimization, breach notification 3×24 jam, sanksi hingga 2% revenue |
| **PP 71/2019** | Penyelenggaraan Sistem & Transaksi Elektronik (PSTE) |
| **BSSN** | Standar keamanan siber nasional, CSIRT coordination |
| **OJK** | Regulasi keamanan IT untuk sektor keuangan |

---

## 5. CHECKLIST PEMAHAMAN P22

- [ ] Jelaskan 5 fungsi NIST CSF
- [ ] Apa itu ISO 27001 dan Annex A?
- [ ] Buat risk assessment dengan risk matrix
- [ ] Buat risk register untuk perusahaan e-commerce fiktif
- [ ] Jelaskan RPO vs RTO
- [ ] Sebutkan 4 risk treatment options
- [ ] Apa isi utama UU PDP Indonesia?
- [ ] Pemetaan kontrol ISO 27001 untuk 5 skenario risiko

---

*Selanjutnya: [P23 — Career Development](./P23-Career.md)*
