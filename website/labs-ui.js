/* Labs UI — Event handlers & initialization */
(function(){
'use strict';

// ===== SQL INJECTION =====
window.runSQLi = function() {
    const u = document.getElementById('sqliUser').value;
    const p = document.getElementById('sqliPass').value;
    const r = CyberLabs.sqlQuery(u, p);
    const el = document.getElementById('sqliResult');
    
    let qHTML = r.rawQuery
        .replace(/(SELECT|FROM|WHERE|AND|OR|UNION)/gi, '<span class="keyword">$1</span>')
        .replace(/('--.*)/g, '<span class="comment">$1</span>');
    if (r.vulnerable) {
        const injected = u.includes("'") ? u.substring(u.indexOf("'")) : p.substring(p.indexOf("'"));
        qHTML = qHTML.replace(new RegExp(injected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').substring(0,20)), '<span class="injection">' + injected.substring(0,40) + '</span>');
    }

    let html = '<div class="sql-sim"><div class="sql-sim-header"><span class="dot" style="background:'+(r.vulnerable?'var(--accent-red)':'var(--accent-green)')+'"></span>'+(r.vulnerable?'⚠️ VULNERABLE QUERY':'✅ Normal Query')+'</div><div class="sql-sim-body">';
    html += '<div class="sql-query-display">' + qHTML + '</div>';
    html += '<p style="font-size:13px;margin:8px 0;color:'+(r.loginSuccess?'var(--accent-green)':'var(--accent-red)')+';font-weight:600">' + r.queryComment + '</p>';
    
    if (r.results.length > 0) {
        html += '<table class="sql-result-table"><thead><tr><th>id</th><th>username</th><th>password</th><th>email</th><th>role</th></tr></thead><tbody>';
        r.results.forEach(row => {
            html += `<tr><td>${row.id}</td><td>${row.username}</td><td>${row.password}</td><td>${row.email}</td><td>${row.role}</td></tr>`;
        });
        html += '</tbody></table>';
        html += '<p style="font-size:12px;color:var(--accent-red);margin-top:8px">🚨 '+r.results.length+' row(s) returned — data exposed!</p>';
    } else {
        html += '<p style="color:var(--text-muted);font-size:13px">No rows returned.</p>';
    }
    html += '</div></div>';
    el.innerHTML = html;
};

window.runSQLiSafe = function() {
    const u = document.getElementById('sqliUserSafe').value;
    const p = document.getElementById('sqliPassSafe').value;
    const el = document.getElementById('sqliResultSafe');
    const safe = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const params = [u, p];
    const results = CyberLabs.sqlDB.filter(row => row.username === u && row.password === p);
    
    let html = '<div class="sql-sim"><div class="sql-sim-header"><span class="dot"></span>🔒 Prepared Statement (Parameterized)</div><div class="sql-sim-body">';
    html += '<div class="sql-query-display"><span class="keyword">SELECT</span> * <span class="keyword">FROM</span> users <span class="keyword">WHERE</span> username = <span class="string">?</span> <span class="keyword">AND</span> password = <span class="string">?</span></div>';
    html += '<p style="font-size:12px;color:var(--text-muted)">Parameters: [<span style="color:var(--accent-green)">"'+u.replace(/</g,'&lt;')+'"</span>, <span style="color:var(--accent-green)">"'+p.replace(/</g,'&lt;')+'"</span>]</p>';
    
    if (results.length > 0) {
        html += '<p style="color:var(--accent-green);font-weight:600;font-size:13px">✅ Login berhasil (credentials valid).</p>';
    } else {
        html += '<p style="color:var(--accent-red);font-weight:600;font-size:13px">❌ Login gagal — injection tidak bisa menembus prepared statement.</p>';
        html += '<p style="color:var(--text-muted);font-size:12px">Input diperlakukan sebagai DATA, bukan SQL code.</p>';
    }
    html += '</div></div>';
    el.innerHTML = html;
};

// ===== PASSWORD ANALYZER =====
window.analyzePW = function() {
    const pw = document.getElementById('pwInput').value;
    const r = CyberLabs.analyzePassword(pw);
    const bars = document.querySelectorAll('#pwMeter .pw-meter-bar');
    const levels = ['active-weak','active-fair','active-good','active-good','active-strong'];
    bars.forEach((b, i) => {
        b.className = 'pw-meter-bar';
        if (i < Math.ceil(r.score)) b.classList.add(levels[Math.min(i, levels.length-1)]);
    });
    
    let html = '';
    if (pw) {
        html += `<span style="color:${r.color};font-weight:700;font-size:16px">${r.label}</span>\n`;
        html += `<span class="muted">Estimasi crack time (GPU): </span><span style="color:${r.color};font-weight:600">${r.crackTime}</span>\n\n`;
        r.feedback.forEach(f => html += f + '\n');
    }
    document.getElementById('pwOutput').innerHTML = html || 'Ketik password untuk melihat analisis...';
};

// ===== JWT DECODER =====
window.decodeJWTLab = function() {
    const token = document.getElementById('jwtInput').value;
    const r = CyberLabs.decodeJWT(token);
    const el = document.getElementById('jwtOutput');
    if (r.error) { el.innerHTML = '<span class="danger">' + r.error + '</span>'; return; }
    
    let html = '<span class="info">═══ HEADER ═══</span>\n';
    html += JSON.stringify(r.header, null, 2) + '\n\n';
    
    // Check for vulnerable algorithms
    if (r.header.alg === 'none') html += '<span class="danger">🚨 VULNERABILITY: Algorithm "none" — signature tidak diverifikasi!</span>\n\n';
    if (r.header.alg === 'HS256') html += '<span class="warn">⚠️ HMAC-SHA256 — pastikan secret key kuat (bukan "secret")</span>\n\n';
    
    html += '<span class="info">═══ PAYLOAD ═══</span>\n';
    html += JSON.stringify(r.payload, null, 2) + '\n\n';
    
    if (r.payload.role) html += '<span class="warn">💡 Role: "' + r.payload.role + '" — coba ubah ke "admin" (mass assignment)</span>\n';
    if (r.expInfo) html += r.expInfo + '\n';
    
    html += '\n<span class="info">═══ SIGNATURE ═══</span>\n';
    html += '<span class="muted">' + r.signature.substring(0, 40) + '...</span>';
    
    el.innerHTML = html;
};

// ===== SUBNET CALCULATOR =====
window.calcSubnetLab = function() {
    const input = document.getElementById('subnetInput').value;
    const r = CyberLabs.calcSubnet(input);
    const el = document.getElementById('subnetOut');
    if (r.error) { el.innerHTML = '<span class="danger">' + r.error + '</span>'; return; }
    
    el.innerHTML = 
        '<span class="info">Network:       </span>' + r.network + '\n' +
        '<span class="info">Broadcast:     </span>' + r.broadcast + '\n' +
        '<span class="info">First Host:    </span>' + r.firstHost + '\n' +
        '<span class="info">Last Host:     </span>' + r.lastHost + '\n' +
        '<span class="info">Subnet Mask:   </span>' + r.subnetMask + '\n' +
        '<span class="info">Wildcard Mask: </span>' + r.wildcardMask + '\n' +
        '<span class="info">Total Hosts:   </span><span class="success">' + r.totalHosts.toLocaleString() + '</span>\n' +
        '<span class="info">CIDR:          </span>' + r.cidrNotation + '\n\n' +
        '<span class="muted">Mask Binary: ' + r.maskBinary + '</span>';
};

// ===== PORT REFERENCE =====
function initPorts() {
    const el = document.getElementById('portGrid');
    if (!el) return;
    const ports = [
        {n:20,s:'FTP Data',p:'TCP'},{n:21,s:'FTP Control',p:'TCP'},{n:22,s:'SSH',p:'TCP'},
        {n:23,s:'Telnet',p:'TCP'},{n:25,s:'SMTP',p:'TCP'},{n:53,s:'DNS',p:'TCP/UDP'},
        {n:67,s:'DHCP Server',p:'UDP'},{n:68,s:'DHCP Client',p:'UDP'},{n:80,s:'HTTP',p:'TCP'},
        {n:110,s:'POP3',p:'TCP'},{n:123,s:'NTP',p:'UDP'},{n:135,s:'MS RPC',p:'TCP'},
        {n:139,s:'NetBIOS',p:'TCP'},{n:143,s:'IMAP',p:'TCP'},{n:161,s:'SNMP',p:'UDP'},
        {n:389,s:'LDAP',p:'TCP'},{n:443,s:'HTTPS',p:'TCP'},{n:445,s:'SMB',p:'TCP'},
        {n:993,s:'IMAPS',p:'TCP'},{n:995,s:'POP3S',p:'TCP'},{n:1433,s:'MSSQL',p:'TCP'},
        {n:1521,s:'Oracle',p:'TCP'},{n:3306,s:'MySQL',p:'TCP'},{n:3389,s:'RDP',p:'TCP'},
        {n:5432,s:'PostgreSQL',p:'TCP'},{n:5900,s:'VNC',p:'TCP'},{n:6379,s:'Redis',p:'TCP'},
        {n:8080,s:'HTTP Proxy',p:'TCP'},{n:8443,s:'HTTPS Alt',p:'TCP'},{n:27017,s:'MongoDB',p:'TCP'},
    ];
    el.innerHTML = ports.map(p => `<div class="port-card"><div class="port-num">${p.n}</div><div class="port-name">${p.s}</div><div class="port-proto">${p.p}</div></div>`).join('');
}

// ===== CVSS CALCULATOR =====
function initCVSS() {
    const el = document.getElementById('cvssMetrics');
    if (!el) return;
    const metrics = [
        {id:'AV',label:'Attack Vector',opts:[{v:'N',l:'Network'},{v:'A',l:'Adjacent'},{v:'L',l:'Local'},{v:'P',l:'Physical'}]},
        {id:'AC',label:'Attack Complexity',opts:[{v:'L',l:'Low'},{v:'H',l:'High'}]},
        {id:'PR',label:'Privileges Required',opts:[{v:'N',l:'None'},{v:'L',l:'Low'},{v:'H',l:'High'}]},
        {id:'UI',label:'User Interaction',opts:[{v:'N',l:'None'},{v:'R',l:'Required'}]},
        {id:'S',label:'Scope',opts:[{v:'U',l:'Unchanged'},{v:'C',l:'Changed'}]},
        {id:'C',label:'Confidentiality',opts:[{v:'N',l:'None'},{v:'L',l:'Low'},{v:'H',l:'High'}]},
        {id:'I',label:'Integrity',opts:[{v:'N',l:'None'},{v:'L',l:'Low'},{v:'H',l:'High'}]},
        {id:'A',label:'Availability',opts:[{v:'N',l:'None'},{v:'L',l:'Low'},{v:'H',l:'High'}]},
    ];
    
    window._cvssState = {AV:'N',AC:'L',PR:'N',UI:'N',S:'U',C:'N',I:'N',A:'N'};
    
    el.innerHTML = metrics.map(m => {
        const opts = m.opts.map(o => `<button class="cvss-opt${window._cvssState[m.id]===o.v?' selected':''}" data-metric="${m.id}" data-val="${o.v}" onclick="setCVSS(this)">${o.l}</button>`).join('');
        return `<div class="cvss-metric"><label>${m.label}</label><div class="cvss-options">${opts}</div></div>`;
    }).join('');
    
    updateCVSS();
}

window.setCVSS = function(btn) {
    const metric = btn.dataset.metric;
    const val = btn.dataset.val;
    window._cvssState[metric] = val;
    // Update selected state
    btn.parentElement.querySelectorAll('.cvss-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updateCVSS();
};

function updateCVSS() {
    const r = CyberLabs.cvssCalc(window._cvssState);
    const el = document.getElementById('cvssDisplay');
    el.style.borderColor = r.color;
    el.innerHTML = `<div class="cvss-score-num" style="color:${r.color}">${r.score.toFixed(1)}</div><div class="cvss-score-label" style="color:${r.color}">${r.severity}</div>`;
}

// ===== HEX VIEWER =====
window.processHexFile = function() {
    const file = document.getElementById('hexFileInput').files[0];
    if (!file) return;
    const infoEl = document.getElementById('hexFileInfo');
    const hexEl = document.getElementById('hexOutput');
    
    infoEl.innerHTML = '<span class="info">Processing...</span>';
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        const bytes = new Uint8Array(e.target.result);
        
        // File info
        const hashBuf = await crypto.subtle.digest('SHA-256', bytes);
        const hashHex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2,'0')).join('');
        
        let info = '<span class="info">File:      </span>' + file.name + '\n';
        info += '<span class="info">Size:      </span>' + bytes.length.toLocaleString() + ' bytes (' + (bytes.length/1024).toFixed(2) + ' KB)\n';
        info += '<span class="info">Type:      </span>' + (file.type || 'unknown') + '\n';
        info += '<span class="info">SHA-256:   </span><span class="success">' + hashHex + '</span>\n';
        
        // Magic bytes detection
        let magic = '';
        if (bytes[0]===0x89 && bytes[1]===0x50) magic = '🖼️ PNG Image';
        else if (bytes[0]===0xFF && bytes[1]===0xD8) magic = '🖼️ JPEG Image';
        else if (bytes[0]===0x50 && bytes[1]===0x4B) magic = '📦 ZIP/DOCX/XLSX Archive';
        else if (bytes[0]===0x25 && bytes[1]===0x50) magic = '📄 PDF Document';
        else if (bytes[0]===0x7F && bytes[1]===0x45) magic = '🐧 ELF Executable (Linux)';
        else if (bytes[0]===0x4D && bytes[1]===0x5A) magic = '🪟 PE Executable (Windows)';
        else if (bytes[0]===0x1F && bytes[1]===0x8B) magic = '📦 GZIP Compressed';
        if (magic) info += '<span class="info">Magic:     </span><span class="warn">' + magic + '</span>';
        
        infoEl.innerHTML = info;
        hexEl.style.display = 'block';
        hexEl.textContent = CyberLabs.hexView(bytes, 512);
    };
    reader.readAsArrayBuffer(file);
};

// ===== INIT ALL LABS =====
function initLabs() {
    // Wait for DOM
    const check = setInterval(() => {
        if (document.getElementById('portGrid')) {
            clearInterval(check);
            initPorts();
            initCVSS();
        }
    }, 200);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLabs);
else initLabs();

})();
