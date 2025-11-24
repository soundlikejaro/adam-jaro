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
    const header = document.getElementById('main-header');

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('bg-white/60', 'dark:bg-[#111111]/60', 'backdrop-blur-md', 'border-b', 'border-border-light');
        } else {
            header.classList.remove('bg-white/60', 'dark:bg-[#111111]/60', 'backdrop-blur-md', 'border-b', 'border-border-light');
        }
    }

    window.addEventListener('scroll', handleScroll);
    // Check initial scroll position
    handleScroll();

    // --- Cookie Consent Logic ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.remove('translate-y-full', 'opacity-0');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieBanner();
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            hideCookieBanner();
        });
    }

    function hideCookieBanner() {
        cookieBanner.classList.add('translate-y-full', 'opacity-0');
        // Remove from DOM after transition to clean up
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    }

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
