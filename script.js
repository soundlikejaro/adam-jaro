import { siteConfig, aboutInfo, projects } from './data.js';
import { privacyPolicy } from './privacy.js';
import { blogPosts } from './blog-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navHome = document.getElementById('nav-home');
    const navInfo = document.getElementById('nav-info');
    const projectGrid = document.getElementById('project-grid');

    // --- Slug Generation ---
    function generateSlug(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
            .replace(/\-\-+/g, '-');     // Replace multiple - with single -
    }

    // Auto-generate IDs
    projects.forEach(p => p.id = generateSlug(p.title));
    blogPosts.forEach(p => p.id = generateSlug(p.title));

    // --- Page Navigation ---

    function showPage(pageId, title) {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        // Update page title for SEO and user experience
        document.title = title;
        window.scrollTo(0, 0);
    }

    // --- Render Functions ---

    function renderHomePage() {
        projectGrid.innerHTML = ''; // Clear existing grid

        projects.forEach(project => {
            const thumb = document.createElement('div');
            thumb.className = 'project-thumbnail group w-full h-fit cursor-pointer';
            thumb.dataset.projectId = project.id;

            thumb.innerHTML = `
                <div class="aspect-4-3">
                    <div class="aspect-4-3-content bg-gray-100 relative overflow-hidden">
                        <img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105" loading="lazy" onerror="this.src='https://placehold.co/400x300/eee/111?text=Image+Error';">
                        
                        <!-- Desktop Overlay -->
                        <div class="project-thumbnail-desktop-overlay absolute inset-0 bg-overlay-bg/90 p-6 flex flex-col justify-end opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
                            <h3 class="text-xl font-bold text-primary-text mb-1">${project.title}</h3>
                            <p class="text-sm text-muted-text uppercase tracking-wider">${project.category}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Title -->
                <div class="project-thumbnail-mobile-title p-4 md:hidden">
                    <h3 class="text-lg font-bold">${project.title}</h3>
                    <p class="text-sm text-muted-text">${project.category}</p>
                </div>
            `;
            projectGrid.appendChild(thumb);
        });

        showPage('page-home', 'Adam Jaro - Creative Director');
    }

    // Helper to render content blocks (reused for projects and blog)
    function renderContentBlocks(contentArray, container) {
        container.innerHTML = '';
        contentArray.forEach(item => {
            let el;
            if (item.type === 'text') {
                el = document.createElement('div');
                el.className = 'project-text-block text-lg leading-relaxed max-w-prose';
                el.innerHTML = item.body;
            }
            else if (item.type === 'image') {
                el = document.createElement('img');
                el.src = item.src;
                el.alt = `Content image`;
                el.className = 'w-full h-auto project-media-item rounded-sm';
                el.loading = 'lazy';
                el.onerror = "this.src='https://placehold.co/1200x800/eee/111?text=Image+Load+Error';"
            }
            else if (item.type === 'vimeo') {
                el = document.createElement('div');
                const videoClass = item.vertical ? 'video-responsive-vertical' : 'video-responsive';
                el.className = `${videoClass} project-media-item rounded-sm overflow-hidden`;
                el.innerHTML = `<iframe src="https://player.vimeo.com/video/${item.id}?title=0&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
            }
            else if (item.type === 'youtube') {
                el = document.createElement('div');
                const videoClass = item.vertical ? 'video-responsive-vertical' : 'video-responsive';
                el.className = `${videoClass} project-media-item rounded-sm overflow-hidden`;
                el.innerHTML = `<iframe src="https://www.youtube.com/embed/${item.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            }
            else if (item.type === 'image-pair') {
                el = document.createElement('div');
                el.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 project-media-item';
                el.innerHTML = `
                    <img src="${item.src1}" alt="Detail image 1" class="w-full h-auto rounded-sm" loading="lazy" onerror="this.src='https://placehold.co/600x400/eee/111?text=Image+Error';">
                    <img src="${item.src2}" alt="Detail image 2" class="w-full h-auto rounded-sm" loading="lazy" onerror="this.src='https://placehold.co/600x400/eee/111?text=Image+Error';">
                `;
            }

            if (el) {
                container.appendChild(el);
            }
        });
    }

    function renderProjectPage(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) {
            renderHomePage();
            return;
        }

        const pageTitle = `${project.title} - Adam Jaro`;

        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-category').textContent = project.category;

        const contentContainer = document.getElementById('project-content-container');
        renderContentBlocks(project.content, contentContainer);

        // Next Project Logic
        const currentIndex = projects.findIndex(p => p.id === projectId);
        const nextBtnContainer = document.getElementById('project-next-container');
        const nextBtn = document.getElementById('project-next-btn');
        const nextTitle = document.getElementById('project-next-title');
        const nextThumb = document.getElementById('project-next-thumb');
        const backBtnBottom = document.getElementById('project-back-btn-bottom').parentElement;

        if (currentIndex !== -1 && currentIndex < projects.length - 1) {
            const nextProject = projects[currentIndex + 1];
            nextTitle.textContent = nextProject.title;
            nextThumb.src = nextProject.thumbnail;
            nextBtnContainer.classList.remove('hidden');

            // Remove old listeners to avoid stacking (cloning is a simple way to clear listeners)
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

            newNextBtn.addEventListener('click', () => {
                history.pushState(null, '', `#${nextProject.id}`);
                renderProjectPage(nextProject.id);
            });

            // Hide back button on non-last projects
            backBtnBottom.classList.add('hidden');
        } else {
            nextBtnContainer.classList.add('hidden');
            // Show back button only on last project
            backBtnBottom.classList.remove('hidden');
        }

        showPage('page-project', pageTitle);
    }

    function populateContactInfo(bioContainer, contactContainer) {
        bioContainer.innerHTML = aboutInfo.bio;
        contactContainer.innerHTML = '';

        aboutInfo.contact.forEach(item => {
            let el;
            if (item.type === 'email-placeholder') {
                el = document.createElement('a');
                const email = `${siteConfig.emailUser}@${siteConfig.emailDomain}`;
                el.href = `mailto:${email}`;
                el.textContent = email;
            }
            else {
                el = document.createElement('a');
                el.href = item.url;
                el.textContent = item.text;
            }
            el.className = 'block text-lg nav-link text-nav-link-color hover:opacity-70 transition-opacity';
            contactContainer.appendChild(el);
        });

        const socialContainer = document.createElement('div');
        socialContainer.className = 'flex space-x-4 pt-4';
        aboutInfo.social.forEach(item => {
            const el = document.createElement('a');
            el.href = item.url;
            el.textContent = item.name;
            // Handle internal links (like #blog) differently if needed, but standard href works with our routing
            if (!item.url.startsWith('#')) {
                el.target = '_blank';
                el.rel = 'noopener noreferrer';
            }
            el.className = 'text-lg nav-link font-medium text-nav-link-color hover:opacity-70 transition-opacity';
            socialContainer.appendChild(el);
        });
        contactContainer.appendChild(socialContainer);
    }

    function renderInfoPage() {
        populateContactInfo(
            document.getElementById('info-bio'),
            document.getElementById('info-contact')
        );
        showPage('page-info', 'Info - Adam Jaro');
    }

    function renderPrivacyPage() {
        const privacyContent = document.getElementById('privacy-content');
        if (privacyContent) {
            privacyContent.innerHTML = privacyPolicy;
        }
        showPage('page-privacy', 'Privacy Policy - Adam Jaro');
    }

    function renderBlogListPage() {
        const blogList = document.getElementById('blog-list');
        blogList.innerHTML = '';

        // Sort by date descending
        const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedPosts.forEach(post => {
            const item = document.createElement('div');
            item.className = 'group cursor-pointer border-b border-border-light pb-8';
            item.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                    <h3 class="text-2xl font-bold group-hover:opacity-70 transition-opacity">${post.title}</h3>
                    <span class="text-muted-text font-mono text-sm mt-1 md:mt-0">${new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="text-muted-text line-clamp-2">
                    ${post.content.find(c => c.type === 'text')?.body.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </div>
            `;
            item.addEventListener('click', () => {
                history.pushState(null, '', `#blog/${post.id}`);
                renderBlogPostPage(post.id);
            });
            blogList.appendChild(item);
        });

        showPage('page-blog', 'Blog - Adam Jaro');
    }

    function renderBlogPostPage(postId) {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) {
            renderBlogListPage();
            return;
        }

        document.getElementById('blog-post-title').textContent = post.title;
        document.getElementById('blog-post-date').textContent = new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

        const contentContainer = document.getElementById('blog-post-content');
        renderContentBlocks(post.content, contentContainer);

        // Populate Bio/Contact in Footer
        populateContactInfo(
            document.getElementById('blog-bio'),
            document.getElementById('blog-contact')
        );

        showPage('page-blog-post', `${post.title} - Blog`);
    }

    function renderFooter() {
        document.getElementById('footer-year').textContent = new Date().getFullYear();

        const footerEmailLink = document.getElementById('footer-email-link');
        const email = `${siteConfig.emailUser}@${siteConfig.emailDomain}`;
        footerEmailLink.href = `mailto:${email}`;
        footerEmailLink.textContent = email;

        const socialContainer = document.getElementById('footer-social-links');
        socialContainer.innerHTML = '';
        aboutInfo.social.forEach(item => {
            const el = document.createElement('a');
            el.href = item.url;
            el.textContent = item.name;
            if (!item.url.startsWith('#')) {
                el.target = '_blank';
                el.rel = 'noopener noreferrer';
            }
            el.className = 'text-sm nav-link font-medium hover:opacity-70 transition-opacity';
            socialContainer.appendChild(el);
        });
    }

    // --- Event Listeners ---

    function goHome(e) {
        if (e) e.preventDefault();
        history.pushState(null, '', '#');
        renderHomePage();
    }

    navHome.addEventListener('click', goHome);
    document.getElementById('project-back-btn').addEventListener('click', goHome);
    document.getElementById('project-back-btn-bottom').addEventListener('click', goHome);
    document.getElementById('info-back-btn').addEventListener('click', goHome);
    document.getElementById('blog-back-btn').addEventListener('click', goHome);
    document.getElementById('blog-view-projects-btn').addEventListener('click', goHome);

    document.getElementById('blog-post-back-btn').addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '#blog');
        renderBlogListPage();
    });

    // Add listener for privacy back button if it exists (it's dynamically added but the ID is static in HTML)
    const privacyBackBtn = document.getElementById('privacy-back-btn');
    if (privacyBackBtn) {
        privacyBackBtn.addEventListener('click', goHome);
    }

    navInfo.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '#info');
        renderInfoPage();
    });

    projectGrid.addEventListener('click', (e) => {
        const thumb = e.target.closest('.project-thumbnail');
        if (thumb && thumb.dataset.projectId) {
            e.preventDefault();
            const projectId = thumb.dataset.projectId;
            history.pushState(null, '', `#${projectId}`);
            renderProjectPage(projectId);
        }
    });

    // --- Initial Page Load & URL Handling ---

    function handleRouting() {
        const hash = window.location.hash;

        if (hash.startsWith('#blog/')) {
            const postId = hash.substring(6); // Remove '#blog/'
            renderBlogPostPage(postId);
        } else if (hash === '#blog') {
            renderBlogListPage();
        } else if (hash.startsWith('#')) {
            const projectId = hash.substring(1);
            const projectExists = projects.some(p => p.id === projectId);
            if (projectExists) {
                renderProjectPage(projectId);
            } else if (hash === '#info') {
                renderInfoPage();
            } else if (hash === '#privacy') {
                renderPrivacyPage();
            } else {
                renderHomePage();
            }
        } else {
            renderHomePage();
        }
    }

    window.addEventListener('popstate', handleRouting);

    // Initial load
    renderFooter();
    handleRouting();

    if (projectGrid.innerHTML === '' && window.location.hash === '') {
        renderHomePage();
    }

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

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieBanner();
        // Here you would initialize GA or other analytics
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        hideCookieBanner();
    });

    function hideCookieBanner() {
        cookieBanner.classList.add('translate-y-full', 'opacity-0');
        // Remove from DOM after transition to clean up
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    }
});
