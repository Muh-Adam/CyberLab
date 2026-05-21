/* Interactive Labs Engine */
(function(){
'use strict';

window.CyberLabs = {

// ===== CAESAR CIPHER =====
caesar(text, shift, decode) {
    const s = decode ? (26 - shift) % 26 : shift % 26;
    return text.replace(/[a-zA-Z]/g, c => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode((c.charCodeAt(0) - base + s) % 26 + base);
    });
},

// ===== BASE64 =====
b64encode(text) { try { return btoa(unescape(encodeURIComponent(text))); } catch(e) { return 'Error: ' + e.message; } },
b64decode(text) { try { return decodeURIComponent(escape(atob(text.trim()))); } catch(e) { return 'Error: Invalid Base64'; } },

// ===== HASHING (Web Crypto API) =====
async hash(text, algo) {
    const data = new TextEncoder().encode(text);
    const map = { 'MD5': null, 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-512': 'SHA-512' };
    if (algo === 'MD5') return this.md5(text);
    const buf = await crypto.subtle.digest(map[algo], data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
},

// Simple MD5 implementation
md5(string) {
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a,b,c,d,k[0],7,-680876936); d = ff(d,a,b,c,k[1],12,-389564586);
        c = ff(c,d,a,b,k[2],17,606105819); b = ff(b,c,d,a,k[3],22,-1044525330);
        a = ff(a,b,c,d,k[4],7,-176418897); d = ff(d,a,b,c,k[5],12,1200080426);
        c = ff(c,d,a,b,k[6],17,-1473231341); b = ff(b,c,d,a,k[7],22,-45705983);
        a = ff(a,b,c,d,k[8],7,1770035416); d = ff(d,a,b,c,k[9],12,-1958414417);
        c = ff(c,d,a,b,k[10],17,-42063); b = ff(b,c,d,a,k[11],22,-1990404162);
        a = ff(a,b,c,d,k[12],7,1804603682); d = ff(d,a,b,c,k[13],12,-40341101);
        c = ff(c,d,a,b,k[14],17,-1502002290); b = ff(b,c,d,a,k[15],22,1236535329);
        a = gg(a,b,c,d,k[1],5,-165796510); d = gg(d,a,b,c,k[6],9,-1069501632);
        c = gg(c,d,a,b,k[11],14,643717713); b = gg(b,c,d,a,k[0],20,-373897302);
        a = gg(a,b,c,d,k[5],5,-701558691); d = gg(d,a,b,c,k[10],9,38016083);
        c = gg(c,d,a,b,k[15],14,-660478335); b = gg(b,c,d,a,k[4],20,-405537848);
        a = gg(a,b,c,d,k[9],5,568446438); d = gg(d,a,b,c,k[14],9,-1019803690);
        c = gg(c,d,a,b,k[3],14,-187363961); b = gg(b,c,d,a,k[8],20,1163531501);
        a = gg(a,b,c,d,k[13],5,-1444681467); d = gg(d,a,b,c,k[2],9,-51403784);
        c = gg(c,d,a,b,k[7],14,1735328473); b = gg(b,c,d,a,k[12],20,-1926607734);
        a = hh(a,b,c,d,k[5],4,-378558); d = hh(d,a,b,c,k[8],11,-2022574463);
        c = hh(c,d,a,b,k[11],16,1839030562); b = hh(b,c,d,a,k[14],23,-35309556);
        a = hh(a,b,c,d,k[1],4,-1530992060); d = hh(d,a,b,c,k[4],11,1272893353);
        c = hh(c,d,a,b,k[7],16,-155497632); b = hh(b,c,d,a,k[10],23,-1094730640);
        a = hh(a,b,c,d,k[13],4,681279174); d = hh(d,a,b,c,k[0],11,-358537222);
        c = hh(c,d,a,b,k[3],16,-722521979); b = hh(b,c,d,a,k[6],23,76029189);
        a = hh(a,b,c,d,k[9],4,-640364487); d = hh(d,a,b,c,k[12],11,-421815835);
        c = hh(c,d,a,b,k[15],16,530742520); b = hh(b,c,d,a,k[2],23,-995338651);
        a = ii(a,b,c,d,k[0],6,-198630844); d = ii(d,a,b,c,k[7],10,1126891415);
        c = ii(c,d,a,b,k[14],15,-1416354905); b = ii(b,c,d,a,k[5],21,-57434055);
        a = ii(a,b,c,d,k[12],6,1700485571); d = ii(d,a,b,c,k[3],10,-1894986606);
        c = ii(c,d,a,b,k[10],15,-1051523); b = ii(b,c,d,a,k[1],21,-2054922799);
        a = ii(a,b,c,d,k[8],6,1873313359); d = ii(d,a,b,c,k[15],10,-30611744);
        c = ii(c,d,a,b,k[6],15,-1560198380); b = ii(b,c,d,a,k[13],21,1309151649);
        a = ii(a,b,c,d,k[4],6,-145523070); d = ii(d,a,b,c,k[11],10,-1120210379);
        c = ii(c,d,a,b,k[2],15,718787259); b = ii(b,c,d,a,k[9],21,-343485551);
        x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q,a,b,x,s,t) { a = add32(add32(a,q), add32(x,t)); return add32((a<<s)|(a>>>(32-s)),b); }
    function ff(a,b,c,d,x,s,t) { return cmn((b&c)|((~b)&d),a,b,x,s,t); }
    function gg(a,b,c,d,x,s,t) { return cmn((b&d)|(c&(~d)),a,b,x,s,t); }
    function hh(a,b,c,d,x,s,t) { return cmn(b^c^d,a,b,x,s,t); }
    function ii(a,b,c,d,x,s,t) { return cmn(c^(b|(~d)),a,b,x,s,t); }
    function add32(a,b) { return (a+b) & 0xFFFFFFFF; }
    var n = string.length, state = [1732584193,-271733879,-1732584194,271733878], i;
    for (i=64; i<=n; i+=64) {
        var tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (var j=0; j<64; j++) tail[j>>2] |= string.charCodeAt(i-64+j) << ((j%4)<<3);
        md5cycle(state, tail);
    }
    var tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (var j=i-64; j<n; j++) tail[(j-i+64)>>2] |= string.charCodeAt(j) << (((j%4))<<3);
    tail[(n-i+64)>>2] |= 0x80 << (((n%4))<<3);
    if ((n-i+64) > 55) { md5cycle(state, tail); tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; }
    tail[14] = n*8;
    md5cycle(state, tail);
    var hex = '';
    for (i=0; i<4; i++) for (var j=0; j<4; j++) hex += ((state[i]>>(j*8))&0xFF).toString(16).padStart(2,'0');
    return hex;
},

// ===== AES (Web Crypto) =====
async aesEncrypt(plaintext, password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:100000, hash:'SHA-256'}, keyMaterial, {name:'AES-GCM', length:256}, false, ['encrypt']);
    const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(plaintext));
    const combined = new Uint8Array(salt.length + iv.length + ct.byteLength);
    combined.set(salt, 0); combined.set(iv, 16); combined.set(new Uint8Array(ct), 28);
    return btoa(String.fromCharCode(...combined));
},

async aesDecrypt(cipherB64, password) {
    const enc = new TextEncoder();
    const data = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
    const salt = data.slice(0, 16), iv = data.slice(16, 28), ct = data.slice(28);
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:100000, hash:'SHA-256'}, keyMaterial, {name:'AES-GCM', length:256}, false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
    return new TextDecoder().decode(pt);
},

// ===== SQL INJECTION SIMULATOR =====
sqlDB: [
    { id: 1, username: 'admin', password: 'SuperSecret123!', email: 'admin@target.co.id', role: 'admin' },
    { id: 2, username: 'budi', password: 'budi2025', email: 'budi@target.co.id', role: 'user' },
    { id: 3, username: 'siti', password: 'siti_pass!', email: 'siti@target.co.id', role: 'user' },
    { id: 4, username: 'raka', password: 'R4k4Str0ng', email: 'raka@target.co.id', role: 'editor' },
    { id: 5, username: 'dewi', password: 'D3wiCantik', email: 'dewi@target.co.id', role: 'user' },
],

sqlQuery(username, password) {
    const rawQuery = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    let results = [], vulnerable = false, loginSuccess = false, queryComment = '';
    
    // Check for injection patterns
    if (username.includes("'") || password.includes("'")) {
        vulnerable = true;
        // OR 1=1 pattern
        if (/['"]?\s*(OR|or)\s+\d+=\d+/.test(username) || /['"]?\s*(OR|or)\s+\d+=\d+/.test(password)) {
            results = [...this.sqlDB];
            loginSuccess = true;
            queryComment = '⚠️ OR 1=1 bypass — returns ALL rows!';
        }
        // Comment pattern: admin'--
        else if (/--/.test(username)) {
            const name = username.split("'")[0];
            results = this.sqlDB.filter(u => u.username === name);
            loginSuccess = results.length > 0;
            queryComment = "⚠️ Comment injection — password check bypassed!";
        }
        // UNION SELECT
        else if (/UNION\s+SELECT/i.test(username) || /UNION\s+SELECT/i.test(password)) {
            results = [...this.sqlDB];
            loginSuccess = true;
            queryComment = '⚠️ UNION injection — all data exposed!';
        }
        else {
            queryComment = "⚠️ SQL syntax broken — but no useful injection here.";
        }
    } else {
        results = this.sqlDB.filter(u => u.username === username && u.password === password);
        loginSuccess = results.length > 0;
        queryComment = loginSuccess ? '✅ Normal login — credentials matched.' : '❌ Login failed — wrong credentials.';
    }
    return { rawQuery, results, vulnerable, loginSuccess, queryComment };
},

// ===== XSS SIMULATOR =====
xssRender(input, mode) {
    if (mode === 'vulnerable') return input;  // No sanitization
    if (mode === 'escaped') return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    return input;
},

// ===== PASSWORD ANALYZER =====
analyzePassword(pw) {
    let score = 0, feedback = [], crackTime = '';
    if (!pw) return { score: 0, label: '', feedback: ['Enter a password'], color: '', crackTime: '' };
    if (pw.length >= 8) score++; else feedback.push('❌ Kurang dari 8 karakter');
    if (pw.length >= 12) score++; else if (pw.length >= 8) feedback.push('💡 12+ karakter lebih aman');
    if (/[a-z]/.test(pw)) score += 0.5; else feedback.push('❌ Tidak ada huruf kecil');
    if (/[A-Z]/.test(pw)) score += 0.5; else feedback.push('❌ Tidak ada huruf besar');
    if (/[0-9]/.test(pw)) score += 0.5; else feedback.push('❌ Tidak ada angka');
    if (/[^a-zA-Z0-9]/.test(pw)) score++; else feedback.push('❌ Tidak ada simbol');
    if (pw.length >= 16) score++;

    // Common passwords check
    const common = ['password','123456','qwerty','admin','letmein','welcome','monkey','master','dragon','login','abc123','password123'];
    if (common.includes(pw.toLowerCase())) { score = 0; feedback = ['🚨 Password ini ada di daftar PALING UMUM!']; }
    // Repeated chars
    if (/(.)\1{3,}/.test(pw)) { score = Math.max(0, score - 1); feedback.push('❌ Terlalu banyak karakter berulang'); }

    // Crack time estimation
    const charsetSize = (/[a-z]/.test(pw)?26:0) + (/[A-Z]/.test(pw)?26:0) + (/[0-9]/.test(pw)?10:0) + (/[^a-zA-Z0-9]/.test(pw)?32:0);
    const combinations = Math.pow(charsetSize || 1, pw.length);
    const hashesPerSec = 10e9; // 10 billion (GPU)
    const seconds = combinations / hashesPerSec;
    if (seconds < 1) crackTime = 'Instan';
    else if (seconds < 60) crackTime = Math.round(seconds) + ' detik';
    else if (seconds < 3600) crackTime = Math.round(seconds/60) + ' menit';
    else if (seconds < 86400) crackTime = Math.round(seconds/3600) + ' jam';
    else if (seconds < 31536000) crackTime = Math.round(seconds/86400) + ' hari';
    else if (seconds < 31536000*1000) crackTime = Math.round(seconds/31536000) + ' tahun';
    else crackTime = '> 1000 tahun';

    const levels = [
        { min: 0, label: 'Sangat Lemah', color: '#f87171' },
        { min: 1, label: 'Lemah', color: '#fb923c' },
        { min: 2.5, label: 'Cukup', color: '#fbbf24' },
        { min: 4, label: 'Kuat', color: '#60a5fa' },
        { min: 5, label: 'Sangat Kuat', color: '#34d399' },
    ];
    const level = [...levels].reverse().find(l => score >= l.min);
    if (feedback.length === 0) feedback.push('✅ Password sangat baik!');
    return { score: Math.min(score, 6), label: level.label, color: level.color, feedback, crackTime };
},

// ===== JWT DECODER =====
decodeJWT(token) {
    try {
        const parts = token.trim().split('.');
        if (parts.length !== 3) return { error: 'JWT harus memiliki 3 bagian (header.payload.signature)' };
        const b64url = s => atob(s.replace(/-/g,'+').replace(/_/g,'/'));
        const header = JSON.parse(b64url(parts[0]));
        const payload = JSON.parse(b64url(parts[1]));
        // Check expiry
        let expInfo = '';
        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            expInfo = expDate < new Date() ? `⚠️ EXPIRED: ${expDate.toISOString()}` : `✅ Valid until: ${expDate.toISOString()}`;
        }
        return { header, payload, signature: parts[2], expInfo };
    } catch(e) { return { error: 'Invalid JWT: ' + e.message }; }
},

// ===== SUBNET CALCULATOR =====
calcSubnet(cidr) {
    const [ip, bits] = cidr.split('/');
    const mask = bits ? parseInt(bits) : 24;
    if (mask < 0 || mask > 32) return { error: 'CIDR harus 0-32' };
    const octets = ip.split('.').map(Number);
    if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) return { error: 'IP tidak valid' };
    const ipNum = (octets[0]<<24 | octets[1]<<16 | octets[2]<<8 | octets[3]) >>> 0;
    const maskNum = mask === 0 ? 0 : (0xFFFFFFFF << (32-mask)) >>> 0;
    const network = (ipNum & maskNum) >>> 0;
    const broadcast = (network | (~maskNum >>> 0)) >>> 0;
    const firstHost = mask >= 31 ? network : (network + 1) >>> 0;
    const lastHost = mask >= 31 ? broadcast : (broadcast - 1) >>> 0;
    const totalHosts = mask >= 31 ? (mask === 32 ? 1 : 2) : Math.pow(2, 32-mask) - 2;
    const toIP = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
    const toBin = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].map(o=>o.toString(2).padStart(8,'0')).join('.');
    return {
        network: toIP(network), broadcast: toIP(broadcast),
        firstHost: toIP(firstHost), lastHost: toIP(lastHost),
        subnetMask: toIP(maskNum), maskBinary: toBin(maskNum),
        totalHosts, wildcardMask: toIP((~maskNum)>>>0), cidrNotation: toIP(network)+'/'+mask
    };
},

// ===== CVSS v3.1 CALCULATOR =====
cvssCalc(metrics) {
    const AV = {N:0.85, A:0.62, L:0.55, P:0.2};
    const AC = {L:0.77, H:0.44};
    const PR_U = {N:0.85, L:0.62, H:0.27};
    const PR_C = {N:0.85, L:0.68, H:0.50};
    const UI = {N:0.85, R:0.62};
    const CIA = {H:0.56, L:0.22, N:0};

    const iss = 1 - ((1-CIA[metrics.C||'N']) * (1-CIA[metrics.I||'N']) * (1-CIA[metrics.A||'N']));
    const PR = (metrics.S === 'C') ? PR_C : PR_U;
    const exploit = 8.22 * AV[metrics.AV||'N'] * AC[metrics.AC||'L'] * PR[metrics.PR||'N'] * UI[metrics.UI||'N'];
    let impact;
    if (metrics.S === 'C') impact = 7.52*(iss-0.029) - 3.25*Math.pow(iss-0.02, 15);
    else impact = 6.42 * iss;

    if (impact <= 0) return { score: 0, severity: 'None', color: '#64748b' };
    let score;
    if (metrics.S === 'C') score = Math.min(1.08*(impact+exploit), 10);
    else score = Math.min(impact+exploit, 10);
    score = Math.ceil(score * 10) / 10;

    let severity, color;
    if (score === 0) { severity='None'; color='#64748b'; }
    else if (score <= 3.9) { severity='Low'; color='#fbbf24'; }
    else if (score <= 6.9) { severity='Medium'; color='#fb923c'; }
    else if (score <= 8.9) { severity='High'; color='#f87171'; }
    else { severity='Critical'; color='#dc2626'; }
    return { score, severity, color };
},

// ===== HEX VIEWER =====
hexView(bytes, maxBytes) {
    const max = maxBytes || 256;
    const lines = [];
    for (let i = 0; i < Math.min(bytes.length, max); i += 16) {
        const offset = i.toString(16).padStart(8, '0');
        const hexPart = [];
        let asciiPart = '';
        for (let j = 0; j < 16; j++) {
            if (i + j < bytes.length) {
                hexPart.push(bytes[i+j].toString(16).padStart(2,'0'));
                const c = bytes[i+j];
                asciiPart += (c >= 32 && c <= 126) ? String.fromCharCode(c) : '.';
            } else {
                hexPart.push('  ');
                asciiPart += ' ';
            }
        }
        lines.push(`${offset}  ${hexPart.slice(0,8).join(' ')}  ${hexPart.slice(8).join(' ')}  |${asciiPart}|`);
    }
    if (bytes.length > max) lines.push(`\n... (${bytes.length - max} more bytes)`);
    return lines.join('\n');
}

};
})();
