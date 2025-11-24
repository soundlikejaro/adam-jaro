import fs from 'fs/promises';
import path from 'path';
import { projects, aboutInfo, siteConfig } from './src/data.js';
import { blogPosts } from './src/blog-data.js';
import { privacyPolicy } from './src/privacy.js';

const OUT_DIR = '.';
const SRC_DIR = './src';

function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

// Generate IDs/Slugs
projects.forEach(p => p.id = generateSlug(p.title));
blogPosts.forEach(p => p.slug = generateSlug(p.title));

async function build() {
    console.log('Starting build...');

    // Read template
    const template = await fs.readFile(path.join(SRC_DIR, 'index.html'), 'utf-8');

    // Helper to write file
    async function writePage(filePath, content, meta = {}) {
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });

        // Calculate relative path to root
        // filePath is like 'projects/the-pretender/index.html' (relative to OUT_DIR)
        // We want to go up from 'projects/the-pretender' to root
        // path.relative(dir, OUT_DIR) gives us '..' or '../..'
        // But wait, OUT_DIR is '.'
        // Let's use path.relative(dir, '.')
        let relativeRoot = path.relative(dir, '.');
        if (relativeRoot === '') relativeRoot = '.';
        // Ensure trailing slash if it's not empty, or just use it as prefix
        // If relativeRoot is '.', we want './'
        // If relativeRoot is '..', we want '../'
        relativeRoot += '/';

        // Generate Social Links HTML
        const socialLinksHtml = aboutInfo.social.map(item => {
            // For internal links like #blog, we might want to resolve them to real URLs if possible,
            // but for now let's keep them as is or map #blog to /blog/
            let url = item.url;
            if (url === '#blog') url = '/blog/';

            return `<a href="${url}" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-sm nav-link font-medium hover:opacity-70 transition-opacity">${item.name}</a>`;
        }).join('');

        let pageHtml = template
            .replace('{{content}}', content)
            .replace('{{footer_social}}', socialLinksHtml)
            .replace(/{{root}}/g, relativeRoot)
            .replace('{{site_config}}', `<script>window.siteConfig = ${JSON.stringify(siteConfig)};</script>`)
            .replace(/{{meta_title}}/g, meta.title || 'Adam Jaro - Creative Director')
            .replace(/{{meta_description}}/g, meta.description || 'Multi-disciplinary creative director based in London.')
            .replace(/{{meta_url}}/g, meta.url || 'https://adamjaro.com/')
            .replace(/{{meta_image}}/g, meta.image || 'https://adamjaro.com/images/herecomestrouble.webp');

        await fs.writeFile(filePath, pageHtml);
        console.log(`Generated: ${filePath}`);
    }

    // --- 1. Home Page ---
    const homeContent = `
        <section id="page-home" class="page active">
            <div class="mb-6 md:mb-8 text-left md:text-center max-w-2xl mx-auto">
                <p class="text-lg md:text-xl text-muted-text font-light">Creative director. Brand & advertising. London, UK.</p>
            </div>
            <div id="project-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
                ${projects.map(project => `
                    <div class="group relative cursor-pointer project-thumbnail" onclick="window.location.href='/projects/${project.id}/'">
                        <div class="relative overflow-hidden aspect-[4/3]">
                            <img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            <div class="project-thumbnail-desktop-overlay absolute inset-0 bg-overlay-bg/90 p-6 flex flex-col justify-end opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
                                <h3 class="text-xl font-bold text-primary-text mb-1">${project.title}</h3>
                                <p class="text-sm text-muted-text uppercase tracking-wider">${project.category}</p>
                            </div>
                        </div>
                    </div>
                    <div class="project-thumbnail-mobile-title p-4 md:hidden">
                        <h3 class="text-lg font-bold">${project.title}</h3>
                        <p class="text-sm text-muted-text">${project.category}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
    await writePage(path.join(OUT_DIR, 'index.html'), homeContent, {
        title: 'Adam Jaro - Creative Director',
        description: 'Creative director based in London. Brand & advertising.',
        url: 'https://adamjaro.com/'
    });

    // --- 2. Info Page ---
    const infoContent = `
        <section id="page-info" class="page active">
            <div class="max-w-4xl mx-auto">
                <div class="mb-8"><a href="/" class="btn-pill nav-link cursor-pointer">← Back to all projects</a></div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div id="info-bio" class="md:col-span-2 text-xl leading-relaxed font-light">
                        ${aboutInfo.bio}
                    </div>
                    <div id="info-contact" class="space-y-4">
                        ${aboutInfo.contact.map(item => {
        if (item.type === 'email-placeholder') return `<a href="#" class="block text-lg hover:underline email-inject">Email Loading...</a>`;
        if (item.type === 'social') return `<a href="${item.url}" target="_blank" class="block text-lg hover:underline">${item.label}</a>`;
        return '';
    }).join('')}
                        <div class="flex space-x-4 pt-4">
                            ${aboutInfo.social.map(item => {
        let url = item.url;
        if (url === '#blog') url = '/blog/';
        return `<a href="${url}" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-lg nav-link font-medium text-nav-link-color hover:opacity-70 transition-opacity">${item.name}</a>`;
    }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    await writePage(path.join(OUT_DIR, 'info', 'index.html'), infoContent, {
        title: 'Info - Adam Jaro',
        description: 'About Adam Jaro - Creative Director.',
        url: 'https://adamjaro.com/info/'
    });

    // --- 3. Privacy Page ---
    const privacyContent = `
        <section id="page-privacy" class="page active">
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <a href="/" class="btn-pill nav-link cursor-pointer">← Back</a>
                </div>
                <div id="privacy-content" class="text-lg leading-relaxed font-light">
                    ${privacyPolicy}
                </div>
            </div>
        </section>
    `;
    await writePage(path.join(OUT_DIR, 'privacy', 'index.html'), privacyContent, {
        title: 'Privacy Policy - Adam Jaro',
        url: 'https://adamjaro.com/privacy/'
    });

    // --- 4. Blog List Page ---
    const blogListContent = `
        <section id="page-blog" class="page active">
            <div class="max-w-4xl mx-auto">
                <div class="mb-8">
                    <a href="/" class="btn-pill nav-link cursor-pointer">← Home</a>
                </div>
                <header class="mb-10">
                    <h2 class="text-3xl md:text-5xl font-bold mb-2 leading-tight">Blog</h2>
                </header>
                <div id="blog-list" class="space-y-8">
                    ${blogPosts.map((post, index) => {
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // Store slug on post object for later use
        post.slug = slug;
        return `
                            <a href="/blog/${slug}/" class="block group cursor-pointer border-b border-border-light pb-8 last:border-0">
                                <div class="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
                                    <h3 class="text-2xl font-bold group-hover:opacity-70 transition-opacity">${post.title}</h3>
                                    <span class="text-sm text-muted-text font-mono mt-1 md:mt-0">${new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div class="text-lg leading-relaxed line-clamp-3 text-muted-text mb-4">
                                    ${post.content.find(c => c.type === 'text')?.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                </div>
                                <div class="text-sm font-bold uppercase tracking-wider hover:underline">Read more →</div>
                            </a>
                        `;
    }).join('')}
                </div>
            </div>
        </section>
    `;
    // Note: We need to ensure blogPosts have slugs assigned before generating individual pages
    // The map above assigns them, but let's be safe and do it explicitly if needed.
    // Actually, the map runs before we generate individual pages, so it's fine.

    await writePage(path.join(OUT_DIR, 'blog', 'index.html'), blogListContent, {
        title: 'Blog - Adam Jaro',
        description: 'Thoughts and updates from Adam Jaro.',
        url: 'https://adamjaro.com/blog/'
    });

    // --- 5. Project Pages ---
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const nextProject = i < projects.length - 1 ? projects[i + 1] : null;

        // Render content blocks
        const contentHtml = project.content.map(item => {
            if (item.type === 'text') return `<div class="project-text-block text-lg leading-relaxed max-w-prose">${item.body}</div>`;
            if (item.type === 'image') return `<img src="${item.src}" alt="Content image" class="w-full h-auto project-media-item rounded-sm" loading="lazy">`;
            if (item.type === 'vimeo') {
                const videoClass = item.vertical ? 'video-responsive-vertical' : 'video-responsive';
                return `<div class="${videoClass} project-media-item rounded-sm overflow-hidden"><iframe src="https://player.vimeo.com/video/${item.id}?title=0&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
            }
            if (item.type === 'youtube') {
                const videoClass = item.vertical ? 'video-responsive-vertical' : 'video-responsive';
                return `<div class="${videoClass} project-media-item rounded-sm overflow-hidden"><iframe src="https://www.youtube.com/embed/${item.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
            }
            if (item.type === 'image-pair') return `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 project-media-item">
                    <img src="${item.src1}" alt="Detail image 1" class="w-full h-auto rounded-sm" loading="lazy">
                    <img src="${item.src2}" alt="Detail image 2" class="w-full h-auto rounded-sm" loading="lazy">
                </div>`;
            return '';
        }).join('');

        const projectPageContent = `
            <section id="page-project" class="page active">
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8"><a href="/" class="btn-pill nav-link cursor-pointer">← All Projects</a></div>
                    <header class="mb-10">
                        <h2 class="text-3xl md:text-5xl font-bold mb-2 leading-tight">${project.title}</h2>
                        <p class="text-lg text-muted-text font-medium">${project.category}</p>
                    </header>
                    <article class="space-y-8 md:space-y-12">
                        ${contentHtml}
                    </article>
                    
                    ${nextProject ? `
                    <div class="mt-12 mb-4">
                        <a href="/projects/${nextProject.id}/" class="btn-pill-rich nav-link cursor-pointer">
                            <img src="${nextProject.thumbnail}" alt="Next Project">
                            <span class="content">
                                <span class="label">Next Project</span>
                                <span class="title">${nextProject.title}</span>
                            </span>
                            <span class="text-xl ml-2">→</span>
                        </a>
                    </div>
                    ` : `
                    <div class="mt-12 mb-8"><a href="/" class="btn-pill nav-link cursor-pointer">← Back to all projects</a></div>
                    `}
                </div>
            </section>
        `;

        await writePage(path.join(OUT_DIR, 'projects', project.id, 'index.html'), projectPageContent, {
            title: `${project.title} - Adam Jaro`,
            description: `${project.title} - ${project.category}`,
            image: `https://adamjaro.com${project.thumbnail}`,
            url: `https://adamjaro.com/projects/${project.id}/`
        });

    }

    // --- 5b. Projects Index Redirect ---
    // Create /projects/index.html that redirects to home
    const projectsRedirectContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="refresh" content="0; url=/">
            <script>window.location.href = "/";</script>
        </head>
        <body>
            <p>Redirecting to <a href="/">home</a>...</p>
        </body>
        </html>
    `;
    // We use fs.writeFile directly here as we don't need the full template
    const projectsDir = path.join(OUT_DIR, 'projects');
    await fs.mkdir(projectsDir, { recursive: true });
    await fs.writeFile(path.join(projectsDir, 'index.html'), projectsRedirectContent);
    console.log(`Generated: projects/index.html (Redirect)`);

    // --- 6. Blog Post Pages ---
    for (const post of blogPosts) {
        // Slug was assigned in the list generation loop, but let's re-calculate to be safe if that loop didn't run first (though it did)
        // Actually, since we are in the same execution context, the mutation to 'post' object persists.
        // But let's be robust.
        const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const contentHtml = post.content.map(item => {
            if (item.type === 'text') return `<div class="project-text-block text-lg leading-relaxed max-w-prose">${item.body}</div>`;
            if (item.type === 'image') return `<img src="${item.src}" alt="Blog image" class="w-full h-auto project-media-item rounded-sm" loading="lazy">`;
            if (item.type === 'image-pair') return `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 project-media-item">
                    <img src="${item.src1}" alt="Detail image 1" class="w-full h-auto rounded-sm" loading="lazy">
                    <img src="${item.src2}" alt="Detail image 2" class="w-full h-auto rounded-sm" loading="lazy">
                </div>`;
            return '';
        }).join('');

        const blogPostContent = `
            <section id="page-blog-post" class="page active">
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8">
                        <a href="/blog/" class="btn-pill nav-link cursor-pointer">← All Posts</a>
                    </div>
                    <header class="mb-10">
                        <h2 class="text-3xl md:text-5xl font-bold mb-2 leading-tight">${post.title}</h2>
                        <p class="text-lg text-muted-text font-medium">${new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>
                    <article class="space-y-8 md:space-y-12 mb-16">
                        ${contentHtml}
                    </article>

                    <div class="border-t border-border-light pt-12 pb-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div class="md:col-span-2 text-xl leading-relaxed font-light">
                                ${aboutInfo.bio}
                            </div>
                            <div class="space-y-4">
                                ${aboutInfo.contact.map(item => {
            if (item.type === 'email-placeholder') return `<a href="#" class="block text-lg hover:underline email-inject">Email Loading...</a>`;
            if (item.type === 'social') return `<a href="${item.url}" target="_blank" class="block text-lg hover:underline">${item.label}</a>`;
            return '';
        }).join('')}
                                <div class="flex space-x-4 pt-4">
                                    ${aboutInfo.social.map(item => {
            let url = item.url;
            if (url === '#blog') url = '/blog/';
            return `<a href="${url}" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-lg nav-link font-medium text-nav-link-color hover:opacity-70 transition-opacity">${item.name}</a>`;
        }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-border-light pt-10 mt-0">
                        <a href="/" class="btn-pill nav-link">View my work →</a>
                    </div>
                </div>
            </section>
        `;

        await writePage(path.join(OUT_DIR, 'blog', slug, 'index.html'), blogPostContent, {
            title: `${post.title} - Adam Jaro Blog`,
            description: `Read "${post.title}" on Adam Jaro's blog.`,
            url: `https://adamjaro.com/blog/${slug}/`
        });
    }

    // --- 7. Copy Assets ---
    async function copyDir(src, dest) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                await copyDir(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    await fs.copyFile(path.join(SRC_DIR, 'style.css'), path.join(OUT_DIR, 'style.css'));
    await fs.copyFile(path.join(SRC_DIR, 'script.js'), path.join(OUT_DIR, 'script.js'));
    await fs.copyFile(path.join(SRC_DIR, 'favicon.svg'), path.join(OUT_DIR, 'favicon.svg'));
    await copyDir(path.join(SRC_DIR, 'images'), path.join(OUT_DIR, 'images'));

    console.log('Build complete!');
}

build().catch(console.error);
