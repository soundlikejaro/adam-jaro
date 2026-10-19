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
