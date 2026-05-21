/* ========================================
   CYBERSECURITY BOOTCAMP — APP LOGIC
   ======================================== */

(function() {
    'use strict';

    // State
    let currentSection = null;
    const completedSections = JSON.parse(localStorage.getItem('cyberbootcamp_done') || '[]');

    // DOM
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');
    const searchInput = document.getElementById('searchInput');
    const sidebarNav = document.getElementById('sidebarNav');
    const contentWrapper = document.getElementById('contentWrapper');
    const breadcrumb = document.getElementById('breadcrumb');
    const btnMarkDone = document.getElementById('btnMarkDone');
    const btnScrollTop = document.getElementById('btnScrollTop');
    const progressFill = document.getElementById('progressFill');
    const progressValue = document.getElementById('progressValue');

    // Configure marked
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: false,
            mangle: false,
        });
    }

    // ========== INIT ==========
    function init() {
        renderAllMarkdown();
        setupNavigation();
        setupSearch();
        setupMobileMenu();
        setupButtons();
        restoreCompleted();
        
        // Load from hash or first section
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            navigateTo(hash);
        } else {
            const firstNav = document.querySelector('.nav-item');
            if (firstNav) navigateTo(firstNav.dataset.section);
        }
    }

    // ========== MARKDOWN RENDERING ==========
    function renderAllMarkdown() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            const raw = section.querySelector('.markdown-raw');
            const body = section.querySelector('.markdown-body');
            if (raw && body && typeof marked !== 'undefined') {
                const md = raw.textContent;
                body.innerHTML = marked.parse(md);
                colorizeCodeBlocks(body);
            }
        });
    }

    function colorizeCodeBlocks(container) {
        container.querySelectorAll('pre code').forEach(block => {
            let html = block.innerHTML;
            // Colorize comments
            html = html.replace(/(#[^\n]*)/g, '<span style="color:#64748b;font-style:italic">$1</span>');
            // Colorize strings
            html = html.replace(/(&quot;[^&]*&quot;|"[^"]*")/g, '<span style="color:#34d399">$1</span>');
            // Colorize keywords
            const keywords = ['sudo','nmap','openssl','msfconsole','curl','grep','awk','find','cat','echo','docker','apt','pip','npm','git','python3','bash','chmod','chown','mkdir','cd','ls'];
            keywords.forEach(kw => {
                const re = new RegExp('\\b(' + kw + ')\\b', 'g');
                html = html.replace(re, '<span style="color:#60a5fa">$1</span>');
            });
            block.innerHTML = html;
        });
    }

    // ========== NAVIGATION ==========
    function setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(item.dataset.section);
                closeMobileMenu();
            });
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash && document.getElementById(hash)) {
                navigateTo(hash);
            }
        });
    }

    function navigateTo(sectionId) {
        currentSection = sectionId;

        // Update active section
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.classList.add('active');
            navItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        // Update breadcrumb
        if (navItem) {
            breadcrumb.textContent = navItem.querySelector('.nav-label').textContent;
        }

        // Update mark done button
        updateMarkDoneButton();

        // Scroll to top
        const cw = document.getElementById('contentWrapper');
        if (cw) cw.scrollTop = 0;
        window.scrollTo({ top: 0 });

        // Update hash without scrolling
        history.replaceState(null, null, '#' + sectionId);
    }

    // ========== SEARCH ==========
    function setupSearch() {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.nav-item').forEach(item => {
                const label = item.querySelector('.nav-label').textContent.toLowerCase();
                item.style.display = label.includes(query) || !query ? '' : 'none';
            });
            document.querySelectorAll('.nav-phase').forEach(phase => {
                const visibleItems = phase.querySelectorAll('.nav-item:not([style*="display: none"])');
                phase.style.display = visibleItems.length > 0 || !query ? '' : 'none';
            });
        });

        // Keyboard shortcut: Ctrl+K to focus search
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            if (e.key === 'Escape') {
                searchInput.blur();
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    }

    // ========== MOBILE MENU ==========
    function setupMobileMenu() {
        menuToggle.addEventListener('click', toggleMobileMenu);
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }

    function toggleMobileMenu() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========== BUTTONS ==========
    function setupButtons() {
        btnMarkDone.addEventListener('click', toggleDone);
        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function toggleDone() {
        if (!currentSection) return;
        const idx = completedSections.indexOf(currentSection);
        if (idx >= 0) {
            completedSections.splice(idx, 1);
        } else {
            completedSections.push(currentSection);
        }
        localStorage.setItem('cyberbootcamp_done', JSON.stringify(completedSections));
        updateMarkDoneButton();
        restoreCompleted();
    }

    function updateMarkDoneButton() {
        if (!currentSection) return;
        const isDone = completedSections.includes(currentSection);
        btnMarkDone.classList.toggle('marked', isDone);
        const span = btnMarkDone.querySelector('span');
        if (span) span.textContent = isDone ? 'Selesai ✓' : 'Tandai Selesai';
    }

    // ========== PROGRESS ==========
    function restoreCompleted() {
        const totalSections = document.querySelectorAll('.nav-item').length;
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('done', completedSections.includes(item.dataset.section));
        });

        const count = completedSections.length;
        progressValue.textContent = `${count} / ${totalSections}`;
        progressFill.style.width = `${(count / totalSections) * 100}%`;
    }

    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        const currentIdx = navItems.findIndex(n => n.dataset.section === currentSection);

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (currentIdx > 0) {
                e.preventDefault();
                navigateTo(navItems[currentIdx - 1].dataset.section);
            }
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (currentIdx < navItems.length - 1) {
                e.preventDefault();
                navigateTo(navItems[currentIdx + 1].dataset.section);
            }
        }
    });

    // ========== START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
