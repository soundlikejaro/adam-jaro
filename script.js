document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    function updateThemeIcons() {
        if (document.documentElement.classList.contains('dark')) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    // Initialize icons
    updateThemeIcons();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
            } else {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            }
            updateThemeIcons();
        });
    }

    // --- Dynamic Sticky Header ---
    // The header turns into a glass bar once you scroll
    const headerBar = document.getElementById('header-bar');

    function handleScroll() {
        headerBar.classList.toggle('glass', window.scrollY > 50);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    // --- Click-to-play videos ---
    // Each video starts as a thumbnail link; the player only loads when pressed.
    document.querySelectorAll('.video-facade').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const iframe = document.createElement('iframe');
            iframe.src = link.dataset.embed;
            iframe.title = link.dataset.title || 'Video';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
            iframe.allowFullscreen = true;
            iframe.setAttribute('frameborder', '0');
            link.replaceWith(iframe);
            iframe.focus();
        });
    });

    // --- Looping clips (Lab page) ---
    // Play only while on screen; leave the still frame for reduced-motion users.
    const loopVideos = document.querySelectorAll('video.lab-video');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (loopVideos.length && !reduceMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.play().catch(() => {});
                else entry.target.pause();
            });
        }, { threshold: 0.25 });
        loopVideos.forEach(video => observer.observe(video));
    }

    // --- Lab filters: show by type, and jump to a project ---
    const labFilters = document.getElementById('lab-filters');
    if (labFilters) {
        const typeSelect = document.getElementById('lab-filter-type');
        const jumpSelect = document.getElementById('lab-jump');
        const cards = [...document.querySelectorAll('.lab-card')];
        labFilters.hidden = false;

        const applyFilter = () => {
            const type = typeSelect.value;
            cards.forEach(card => { card.hidden = type !== 'all' && card.dataset.type !== type; });
        };
        typeSelect.addEventListener('change', applyFilter);

        jumpSelect.addEventListener('change', () => {
            const card = document.getElementById(jumpSelect.value);
            if (!card) return;
            // If the filter is hiding it, show everything again first
            if (card.hidden) { typeSelect.value = 'all'; applyFilter(); }
            card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            history.replaceState(null, '', '#' + card.id);
            jumpSelect.value = '';
        });
    }

    // --- Lab background: dots that move out of the way of the mouse ---
    // Mouse/trackpad only, and not for reduced-motion users (they keep the still CSS grid).
    const labBg = document.querySelector('.lab-bg');
    if (labBg && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        const canvas = document.createElement('canvas');
        canvas.className = 'lab-dots';
        labBg.appendChild(canvas);
        labBg.classList.add('has-dots-canvas');
        const ctx = canvas.getContext('2d');

        const GAP = 22;        // same spacing as the CSS grid
        const RADIUS = 200;    // how far the cursor's influence reaches
        const PUSH = 22;       // max distance a dot moves
        const EASE = 0.14;     // how quickly dots follow (0-1)
        let width = 0, height = 0, dots = [];
        let mouse = { x: -9999, y: -9999 };
        let running = false;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            dots = [];
            for (let y = GAP / 2; y < height; y += GAP) {
                for (let x = GAP / 2; x < width; x += GAP) dots.push({ x, y, ox: 0, oy: 0, glow: 0 });
            }
            draw();
        };

        // Draws one frame; returns true while any dot is still moving
        const draw = () => {
            const dark = document.documentElement.classList.contains('dark');
            const base = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.16)';
            let moving = false;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = base;
            ctx.beginPath();
            const lit = [];
            for (const d of dots) {
                const dx = d.x - mouse.x, dy = d.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                let tx = 0, ty = 0, tg = 0;
                if (dist < RADIUS && dist > 0.01) {
                    const strength = (1 - dist / RADIUS) ** 1.6;
                    tx = (dx / dist) * PUSH * strength;
                    ty = (dy / dist) * PUSH * strength;
                    tg = strength;
                }
                d.ox += (tx - d.ox) * EASE;
                d.oy += (ty - d.oy) * EASE;
                d.glow += (tg - d.glow) * EASE;
                if (Math.abs(tx - d.ox) > 0.05 || Math.abs(ty - d.oy) > 0.05 || Math.abs(tg - d.glow) > 0.005) moving = true;
                if (d.glow > 0.02) { lit.push(d); continue; }
                ctx.moveTo(d.x + d.ox + 1.1, d.y + d.oy);
                ctx.arc(d.x + d.ox, d.y + d.oy, 1.1, 0, Math.PI * 2);
            }
            ctx.fill();
            // Dots near the cursor: a little bigger, tinted towards the brand pink.
            // Grouped into a few brightness steps so each step is one fill.
            const STEPS = 8;
            const buckets = Array.from({ length: STEPS }, () => []);
            for (const d of lit) buckets[Math.min(STEPS - 1, Math.floor(d.glow * STEPS))].push(d);
            buckets.forEach((group, i) => {
                if (!group.length) return;
                const glow = (i + 0.5) / STEPS;
                ctx.fillStyle = `rgba(234,51,103,${(dark ? 0.25 : 0.2) + glow * 0.55})`;
                ctx.beginPath();
                const r = 1.1 + glow * 1.1;
                for (const d of group) {
                    ctx.moveTo(d.x + d.ox + r, d.y + d.oy);
                    ctx.arc(d.x + d.ox, d.y + d.oy, r, 0, Math.PI * 2);
                }
                ctx.fill();
            });
            return moving;
        };

        const loop = () => {
            if (draw()) requestAnimationFrame(loop);
            else running = false;
        };
        const start = () => {
            if (!running) { running = true; requestAnimationFrame(loop); }
        };

        window.addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; start(); }, { passive: true });
        document.addEventListener('mouseleave', () => { mouse = { x: -9999, y: -9999 }; start(); });
        let resizeTimer;
        window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });
        if (themeToggle) themeToggle.addEventListener('click', () => requestAnimationFrame(draw));
        resize();
    }

    // (Cookie banner removed: the site sets no tracking cookies. Theme choice is kept in localStorage.)

    // --- Footer Year & Email Injection ---
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Inject Email (Obfuscation)
    const emailUser = window.siteConfig.emailUser;
    const emailDomain = window.siteConfig.emailDomain;
    const emailAddress = `${emailUser}@${emailDomain}`;

    // 1. Footer Email
    const footerEmailLink = document.getElementById('footer-email-link');
    if (footerEmailLink) {
        footerEmailLink.href = `mailto:${emailAddress}`;
        footerEmailLink.textContent = emailAddress;
    }

    // 2. Info/Blog Page Email Placeholders
    const emailPlaceholders = document.querySelectorAll('.email-inject');
    emailPlaceholders.forEach(el => {
        el.href = `mailto:${emailAddress}`;
        el.textContent = emailAddress;
    });
});
