#!/usr/bin/env python3
"""Build script: Reads all markdown files + generates labs + outputs website."""
import os, html as htmlmod

MATERI_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Materi')

SECTIONS = [
    {"phase":"roadmap","phase_label":"🗺️ Roadmap","phase_color":"#a78bfa","items":[
        {"file":"00-Roadmap/roadmap-cybersecurity.md","label":"Roadmap Cybersecurity","icon":"🗺️"}]},
    {"phase":"phase1","phase_label":"Phase 1 — Fondasi","phase_color":"#60a5fa","items":[
        {"file":"Phase1-Fondasi/P1-Pengenalan-Cybersecurity.md","label":"P1 · Pengenalan Cybersecurity","icon":"🛡️"},
        {"file":"Phase1-Fondasi/P2-Jaringan-Komputer.md","label":"P2 · Jaringan Komputer","icon":"🌐"},
        {"file":"Phase1-Fondasi/P3-Linux-Fundamentals.md","label":"P3 · Linux Fundamentals","icon":"🐧"},
        {"file":"Phase1-Fondasi/P4-Linux-Networking-Hardening.md","label":"P4 · Linux Hardening","icon":"🔧"},
        {"file":"Phase1-Fondasi/P5-Kriptografi.md","label":"P5 · Kriptografi","icon":"🔐"},
        {"file":"Phase1-Fondasi/P6-PKI-TLS.md","label":"P6 · PKI & TLS/SSL","icon":"📜"}]},
    {"phase":"phase2","phase_label":"Phase 2 — Offensive","phase_color":"#f87171","items":[
        {"file":"Phase2-Offensive/P7-Reconnaissance-OSINT.md","label":"P7 · Reconnaissance & OSINT","icon":"🔍"},
        {"file":"Phase2-Offensive/P8-Network-Scanning.md","label":"P8 · Network Scanning","icon":"📡"},
        {"file":"Phase2-Offensive/P9-Exploitation-Metasploit.md","label":"P9 · Exploitation & Metasploit","icon":"💥"},
        {"file":"Phase2-Offensive/P10-OWASP-Part1.md","label":"P10 · OWASP Top 10 (Part 1)","icon":"🌐"},
        {"file":"Phase2-Offensive/P11-OWASP-Part2.md","label":"P11 · OWASP Top 10 (Part 2)","icon":"🕸️"},
        {"file":"Phase2-Offensive/P12-Privilege-Escalation.md","label":"P12 · Privilege Escalation","icon":"⬆️"}]},
    {"phase":"phase3","phase_label":"Phase 3 — Defensive","phase_color":"#34d399","items":[
        {"file":"Phase3-Defensive/P13-SOC-SIEM.md","label":"P13 · SOC & SIEM","icon":"🛡️"},
        {"file":"Phase3-Defensive/P14-Log-Analysis.md","label":"P14 · Log Analysis","icon":"📊"},
        {"file":"Phase3-Defensive/P15-Incident-Response.md","label":"P15 · Incident Response","icon":"🔬"},
        {"file":"Phase3-Defensive/P16-Network-Defense.md","label":"P16 · Network Defense","icon":"🏰"},
        {"file":"Phase3-Defensive/P17-Endpoint-EDR.md","label":"P17 · Endpoint & EDR","icon":"🖥️"}]},
    {"phase":"phase4","phase_label":"Phase 4 — Advanced","phase_color":"#fbbf24","items":[
        {"file":"Phase4-Advanced/P18-Cloud-Security.md","label":"P18 · Cloud Security","icon":"☁️"},
        {"file":"Phase4-Advanced/P19-DevSecOps.md","label":"P19 · DevSecOps","icon":"🔄"},
        {"file":"Phase4-Advanced/P20-API-Security.md","label":"P20 · API Security","icon":"🔌"},
        {"file":"Phase4-Advanced/P21-Vuln-Management.md","label":"P21 · Vuln Management","icon":"📋"},
        {"file":"Phase4-Advanced/P22-GRC.md","label":"P22 · GRC","icon":"📜"},
        {"file":"Phase4-Advanced/P23-Career.md","label":"P23 · Career Development","icon":"🚀"}]},
    {"phase":"phase5","phase_label":"Phase 5 — Final","phase_color":"#f472b6","items":[
        {"file":"Phase5-Final/P24-Final-Project.md","label":"P24 · Final Project","icon":"⚔️"}]},
]

LABS = [
    {"id":"lab_crypto","label":"Lab: Kriptografi","icon":"🔐"},
    {"id":"lab_sqli","label":"Lab: SQL Injection","icon":"💉"},
    {"id":"lab_xss","label":"Lab: XSS Attack","icon":"🕸️"},
    {"id":"lab_password","label":"Lab: Password Analyzer","icon":"🔑"},
    {"id":"lab_jwt","label":"Lab: JWT Decoder","icon":"🎫"},
    {"id":"lab_network","label":"Lab: Network Tools","icon":"📡"},
    {"id":"lab_cvss","label":"Lab: CVSS Calculator","icon":"📊"},
    {"id":"lab_hex","label":"Lab: Hex Viewer","icon":"🔬"},
]

def read_md():
    data = {}
    for s in SECTIONS:
        for it in s["items"]:
            fp = os.path.join(MATERI_DIR, it["file"])
            with open(fp,'r',encoding='utf-8') as f: data[it["file"]] = f.read()
            print(f"  ✓ {it['file']}")
    return data

def sidebar_html():
    lines = []
    for s in SECTIONS:
        lines.append(f'<div class="nav-phase"><div class="nav-phase-title" style="--phase-color:{s["phase_color"]}"><span class="phase-dot" style="background:{s["phase_color"]}"></span>{s["phase_label"]}</div><div class="nav-items">')
        for it in s["items"]:
            iid = it["file"].replace("/","_").replace(".md","").replace("-","_")
            lines.append(f'<a class="nav-item" data-section="{iid}" href="#{iid}"><span class="nav-icon">{it["icon"]}</span><span class="nav-label">{it["label"]}</span></a>')
        lines.append('</div></div>')
    # Labs section
    lines.append('<div class="nav-phase"><div class="nav-phase-title" style="--phase-color:#22d3ee"><span class="phase-dot" style="background:#22d3ee"></span>🧪 Interactive Labs</div><div class="nav-items">')
    for lab in LABS:
        lines.append(f'<a class="nav-item" data-section="{lab["id"]}" href="#{lab["id"]}"><span class="nav-icon">{lab["icon"]}</span><span class="nav-label">{lab["label"]}</span></a>')
    lines.append('</div></div>')
    return "\n".join(lines)

def content_html(data):
    lines = []
    first = True
    for s in SECTIONS:
        for it in s["items"]:
            iid = it["file"].replace("/","_").replace(".md","").replace("-","_")
            a = ' active' if first else ''
            c = htmlmod.escape(data.get(it["file"],""))
            lines.append(f'<section class="content-section{a}" id="{iid}"><div class="markdown-raw" style="display:none">{c}</div><div class="markdown-body"></div></section>')
            first = False
    # Add lab sections
    lines.append(get_lab_html())
    return "\n".join(lines)

def get_lab_html():
    return '''
<!-- ===== LAB: KRIPTOGRAFI ===== -->
<section class="content-section" id="lab_crypto">
<div class="markdown-body">
<h1>🔐 Lab Interaktif: Kriptografi</h1>
<p style="color:var(--text-secondary)">Praktikkan konsep kriptografi langsung di browser.</p>
<hr>

<div class="lab-container">
<h3>🔄 Caesar Cipher</h3>
<div class="lab-grid">
<div class="lab-group"><label>Plaintext</label><input class="lab-input" id="caesarInput" placeholder="Masukkan teks..."></div>
<div class="lab-group"><label>Shift (1-25)</label><input class="lab-input" id="caesarShift" type="number" value="3" min="1" max="25"></div>
</div>
<div class="lab-btn-row">
<button class="lab-btn" onclick="document.getElementById('caesarOut').textContent=CyberLabs.caesar(document.getElementById('caesarInput').value,+document.getElementById('caesarShift').value,false)">Encrypt →</button>
<button class="lab-btn success" onclick="document.getElementById('caesarOut').textContent=CyberLabs.caesar(document.getElementById('caesarInput').value,+document.getElementById('caesarShift').value,true)">← Decrypt</button>
</div>
<div class="lab-output" id="caesarOut">Hasil akan muncul di sini...</div>
</div>

<div class="lab-container">
<h3>📝 Base64 Encode/Decode</h3>
<div class="lab-group"><label>Input</label><textarea class="lab-textarea" id="b64Input" placeholder="Masukkan teks atau base64..."></textarea></div>
<div class="lab-btn-row">
<button class="lab-btn" onclick="document.getElementById('b64Out').textContent=CyberLabs.b64encode(document.getElementById('b64Input').value)">Encode →</button>
<button class="lab-btn success" onclick="document.getElementById('b64Out').textContent=CyberLabs.b64decode(document.getElementById('b64Input').value)">← Decode</button>
</div>
<div class="lab-output" id="b64Out">Hasil akan muncul di sini...</div>
</div>

<div class="lab-container">
<h3>#️⃣ Hash Generator</h3>
<div class="lab-grid">
<div class="lab-group"><label>Input Text</label><input class="lab-input" id="hashInput" placeholder="Teks untuk di-hash..."></div>
<div class="lab-group"><label>Algorithm</label><select class="lab-select" id="hashAlgo"><option>MD5</option><option>SHA-1</option><option selected>SHA-256</option><option>SHA-512</option></select></div>
</div>
<div class="lab-btn-row"><button class="lab-btn" onclick="CyberLabs.hash(document.getElementById('hashInput').value,document.getElementById('hashAlgo').value).then(h=>{document.getElementById('hashOut').innerHTML='<span class=info>'+document.getElementById('hashAlgo').value+':</span>\\n'+h+'\\n\\n<span class=muted>Length: '+h.length+' hex chars ('+h.length*4+' bits)</span>'})">Generate Hash</button></div>
<div class="lab-output" id="hashOut">Hash akan muncul di sini...</div>
</div>

<div class="lab-container">
<h3>🔒 AES-256-GCM Encryption</h3>
<div class="lab-grid">
<div class="lab-group"><label>Plaintext / Ciphertext</label><textarea class="lab-textarea" id="aesInput" placeholder="Teks untuk dienkripsi..."></textarea></div>
<div class="lab-group"><label>Password (Key)</label><input class="lab-input" id="aesKey" placeholder="Masukkan password..." type="password"></div>
</div>
<div class="lab-btn-row">
<button class="lab-btn" onclick="CyberLabs.aesEncrypt(document.getElementById('aesInput').value,document.getElementById('aesKey').value).then(c=>{document.getElementById('aesOut').innerHTML='<span class=info>Encrypted (Base64):</span>\\n'+c}).catch(e=>{document.getElementById('aesOut').innerHTML='<span class=danger>Error: '+e.message+'</span>'})">🔒 Encrypt</button>
<button class="lab-btn success" onclick="CyberLabs.aesDecrypt(document.getElementById('aesInput').value,document.getElementById('aesKey').value).then(p=>{document.getElementById('aesOut').innerHTML='<span class=success>Decrypted:</span>\\n'+p}).catch(e=>{document.getElementById('aesOut').innerHTML='<span class=danger>Error: Wrong password or invalid ciphertext</span>'})">🔓 Decrypt</button>
</div>
<div class="lab-output" id="aesOut">Hasil enkripsi/dekripsi muncul di sini...</div>
</div>
</div></section>

<!-- ===== LAB: SQL INJECTION ===== -->
<section class="content-section" id="lab_sqli">
<div class="markdown-body">
<h1>💉 Lab Interaktif: SQL Injection Simulator</h1>
<p style="color:var(--text-secondary)">Simulasi serangan SQL injection pada login page. Database berisi 5 user fiktif.</p>
<hr>

<div class="lab-container">
<h3>🔐 Login Form (Vulnerable!)</h3>
<p style="color:var(--text-muted);font-size:13px;">Coba payload: <code>admin\' --</code> atau <code>\' OR 1=1 --</code> atau <code>\' UNION SELECT * FROM users --</code></p>
<div class="lab-grid">
<div class="lab-group"><label>Username</label><input class="lab-input" id="sqliUser" placeholder="Username..."></div>
<div class="lab-group"><label>Password</label><input class="lab-input" id="sqliPass" placeholder="Password..." type="text"></div>
</div>
<div class="lab-btn-row">
<button class="lab-btn danger" onclick="runSQLi()">🔓 Login (Vulnerable)</button>
<button class="lab-btn" onclick="document.getElementById('sqliUser').value='admin\\' --';document.getElementById('sqliPass').value='anything'">💡 Payload 1: Comment</button>
<button class="lab-btn" onclick="document.getElementById('sqliUser').value='\\' OR 1=1 --';document.getElementById('sqliPass').value=''">💡 Payload 2: OR 1=1</button>
<button class="lab-btn" onclick="document.getElementById('sqliUser').value='\\' UNION SELECT * FROM users --';document.getElementById('sqliPass').value=''">💡 Payload 3: UNION</button>
</div>
<div id="sqliResult"></div>
</div>

<div class="lab-container">
<h3>🛡️ Login Form (Secured — Prepared Statement)</h3>
<p style="color:var(--text-muted);font-size:13px;">Form ini menggunakan parameterized query. Coba payload yang sama — tidak akan berhasil.</p>
<div class="lab-grid">
<div class="lab-group"><label>Username</label><input class="lab-input" id="sqliUserSafe" placeholder="Username..."></div>
<div class="lab-group"><label>Password</label><input class="lab-input" id="sqliPassSafe" placeholder="Password..."></div>
</div>
<div class="lab-btn-row"><button class="lab-btn success" onclick="runSQLiSafe()">🔒 Login (Secured)</button></div>
<div id="sqliResultSafe"></div>
</div>
</div></section>

<!-- ===== LAB: XSS ===== -->
<section class="content-section" id="lab_xss">
<div class="markdown-body">
<h1>🕸️ Lab Interaktif: XSS (Cross-Site Scripting)</h1>
<p style="color:var(--text-secondary)">Lihat perbedaan output antara server vulnerable dan server yang aman.</p>
<hr>

<div class="lab-container">
<h3>⚠️ Reflected XSS Simulator</h3>
<p style="color:var(--text-muted);font-size:13px;">Coba: <code>&lt;b&gt;bold&lt;/b&gt;</code>, <code>&lt;img src=x onerror=alert(1)&gt;</code>, <code>&lt;h1&gt;Hacked!&lt;/h1&gt;</code></p>
<div class="lab-group"><label>Search Input</label><input class="lab-input" id="xssInput" placeholder='Coba: <script>alert("XSS")</script>'></div>
<div class="lab-btn-row">
<button class="lab-btn danger" onclick="document.getElementById('xssVuln').innerHTML='Hasil pencarian untuk: '+CyberLabs.xssRender(document.getElementById('xssInput').value,'vulnerable')">🔓 Render (Vulnerable)</button>
<button class="lab-btn success" onclick="document.getElementById('xssSafe').textContent='Hasil pencarian untuk: '+document.getElementById('xssInput').value">🔒 Render (Escaped)</button>
</div>
<div class="lab-grid" style="margin-top:12px">
<div><label style="font-size:12px;color:var(--accent-red);font-weight:600">❌ VULNERABLE OUTPUT</label><div class="xss-preview" id="xssVuln">Output akan muncul di sini...</div></div>
<div><label style="font-size:12px;color:var(--accent-green);font-weight:600">✅ ESCAPED OUTPUT</label><div class="xss-preview" id="xssSafe" style="white-space:pre-wrap">Output akan muncul di sini...</div></div>
</div>
</div>
</div></section>

<!-- ===== LAB: PASSWORD ===== -->
<section class="content-section" id="lab_password">
<div class="markdown-body">
<h1>🔑 Lab Interaktif: Password Strength Analyzer</h1>
<p style="color:var(--text-secondary)">Analisis kekuatan password secara real-time. Estimasi waktu crack GPU (10 billion hash/s).</p>
<hr>

<div class="lab-container">
<h3>🔍 Analisis Password</h3>
<div class="lab-group"><label>Password</label><input class="lab-input" id="pwInput" placeholder="Masukkan password..." oninput="analyzePW()"></div>
<div class="pw-meter" id="pwMeter"><div class="pw-meter-bar"></div><div class="pw-meter-bar"></div><div class="pw-meter-bar"></div><div class="pw-meter-bar"></div><div class="pw-meter-bar"></div></div>
<div class="lab-output" id="pwOutput">Ketik password untuk melihat analisis...</div>
</div>
</div></section>

<!-- ===== LAB: JWT ===== -->
<section class="content-section" id="lab_jwt">
<div class="markdown-body">
<h1>🎫 Lab Interaktif: JWT Decoder</h1>
<p style="color:var(--text-secondary)">Decode dan analisis JSON Web Token. Identifikasi vulnerability.</p>
<hr>

<div class="lab-container">
<h3>🔍 Decode JWT</h3>
<div class="lab-group"><label>JWT Token</label><textarea class="lab-textarea" id="jwtInput" placeholder="Paste JWT token di sini...">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6ImFkbWluIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTYzMDAwMDAsImV4cCI6MTcxNjMwMzYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea></div>
<div class="lab-btn-row"><button class="lab-btn" onclick="decodeJWTLab()">🔍 Decode</button></div>
<div class="lab-output" id="jwtOutput">Klik Decode untuk melihat isi JWT...</div>
</div>
</div></section>

<!-- ===== LAB: NETWORK ===== -->
<section class="content-section" id="lab_network">
<div class="markdown-body">
<h1>📡 Lab Interaktif: Network Tools</h1>
<p style="color:var(--text-secondary)">Subnet calculator dan referensi port umum.</p>
<hr>

<div class="lab-container">
<h3>🧮 Subnet Calculator</h3>
<div class="lab-group"><label>IP / CIDR</label><input class="lab-input" id="subnetInput" placeholder="192.168.1.0/24" value="192.168.1.0/24"></div>
<div class="lab-btn-row"><button class="lab-btn" onclick="calcSubnetLab()">Calculate</button></div>
<div class="lab-output" id="subnetOut">Klik Calculate...</div>
</div>

<div class="lab-container">
<h3>🚪 Common Ports Reference</h3>
<div class="port-grid" id="portGrid"></div>
</div>
</div></section>

<!-- ===== LAB: CVSS ===== -->
<section class="content-section" id="lab_cvss">
<div class="markdown-body">
<h1>📊 Lab Interaktif: CVSS v3.1 Calculator</h1>
<p style="color:var(--text-secondary)">Hitung CVSS score untuk vulnerability assessment.</p>
<hr>

<div class="lab-container">
<h3>📐 Base Score Metrics</h3>
<div id="cvssMetrics"></div>
<div class="cvss-score-display" id="cvssDisplay"><div class="cvss-score-num" style="color:var(--text-muted)">0.0</div><div class="cvss-score-label" style="color:var(--text-muted)">None</div></div>
</div>
</div></section>

<!-- ===== LAB: HEX VIEWER ===== -->
<section class="content-section" id="lab_hex">
<div class="markdown-body">
<h1>🔬 Lab Interaktif: File Hex Viewer & Hash Calculator</h1>
<p style="color:var(--text-secondary)">Upload file untuk melihat hex dump dan menghitung hash (SHA-256).</p>
<hr>

<div class="lab-container">
<h3>📂 Upload File</h3>
<input type="file" id="hexFileInput" class="lab-input" style="padding:8px" onchange="processHexFile()">
<div class="lab-output" id="hexFileInfo" style="margin-top:12px;min-height:30px">Pilih file untuk dianalisis...</div>
<div class="lab-output" id="hexOutput" style="margin-top:8px;font-size:12px;line-height:1.4;display:none"></div>
</div>
</div></section>
'''

def build_html(sidebar, content):
    return f'''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="description" content="Cybersecurity Engineer Bootcamp — Materi lengkap 24 pertemuan + Interactive Labs.">
<title>Cybersecurity Engineer Bootcamp</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="labs.css">
</head>
<body>
<header class="mobile-header" id="mobileHeader">
<button class="menu-toggle" id="menuToggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
<div class="mobile-title">CyberSec Bootcamp</div>
</header>
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<aside class="sidebar" id="sidebar">
<div class="sidebar-header"><div class="logo"><div class="logo-icon">🛡️</div><div class="logo-text"><span class="logo-title">CyberSec</span><span class="logo-subtitle">Engineer Bootcamp</span></div></div></div>
<div class="sidebar-search"><input type="text" id="searchInput" placeholder="Cari materi... (Ctrl+K)" autocomplete="off"><svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
<nav class="sidebar-nav" id="sidebarNav">{sidebar}</nav>
<div class="sidebar-footer"><div class="progress-info"><span class="progress-label">Progress</span><span class="progress-value" id="progressValue">0 / 25</span></div><div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div></div>
</aside>
<main class="main-content" id="mainContent">
<div class="content-header" id="contentHeader"><div class="breadcrumb" id="breadcrumb">Roadmap</div><div class="header-actions">
<button class="btn-action" id="btnMarkDone" title="Tandai selesai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span>Tandai Selesai</span></button>
<button class="btn-action" id="btnScrollTop" title="Ke atas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg></button>
</div></div>
<div class="content-wrapper" id="contentWrapper">{content}</div>
</main>
<script src="labs.js"></script>
<script src="app.js"></script>
<script src="labs-ui.js"></script>
</body></html>'''

def main():
    print("🔨 Building Cybersecurity Bootcamp Website + Labs...")
    data = read_md()
    sb = sidebar_html()
    ct = content_html(data)
    full = build_html(sb, ct)
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
    with open(out,'w',encoding='utf-8') as f: f.write(full)
    print(f"\n✅ Website generated: {out} ({len(full):,} bytes)")

if __name__ == "__main__":
    main()
