import fs from 'fs/promises';
import { existsSync, statSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import sharp from 'sharp';
import { projects, aboutInfo, siteConfig } from './src/data.js';
import { blogPosts } from './src/blog-data.js';
import { privacyPolicy } from './src/privacy.js';
import { labIntro, labProjects } from './src/lab-data.js';

const OUT_DIR = '.';
const SRC_DIR = './src';
const SITE = 'https://adamjaro.com';

// The Lab page (/lab/) is built but kept hidden until this is true. When true it's
// indexed by search engines and added to sitemap.xml. Linking it from the header,
// homepage and Info page is a separate step.
const LAB_PUBLIC = false;
// When public, the Lab is also linked from the header, the end of the homepage
// grid, the Info page and llms.txt.

// Responsive image widths generated for every image in src/images
const IMG_WIDTHS = [640, 960, 1600];
// Largest original we'll serve as-is; anything bigger only gets the resized versions
const MAX_SERVED_WIDTH = 1920;

// ---------- Helpers ----------

function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

// Escape text for use inside an HTML attribute
function esc(text = '') {
    return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// HTML snippet -> plain text
function plain(html = '') {
    return html
        .replace(/<\/?(em|strong|b|i|a|span)\b[^>]*>/g, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
        .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
        .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Plain-text summary of a project (first sentence), for meta descriptions and alt text
function projectSummary(project) {
    const first = project.content.find(c => c.type === 'text');
    if (!first) return `${project.title} - ${project.category}`;
    const firstSentence = plain(first.body).split(/(?<=[.!?])\s/)[0];
    return firstSentence.length > 160 ? firstSentence.substring(0, 157).trim() + '...' : firstSentence;
}

// Bullet points from a project's "Result" lists
function projectResults(project) {
    return project.content
        .filter(c => c.type === 'text')
        .flatMap(c => [...c.body.matchAll(/<li>(.*?)<\/li>/g)].map(m => plain(m[1])));
}

function projectPageTitle(project) {
    const sameAsClient = project.title.toLowerCase() === project.category.toLowerCase();
    const label = sameAsClient ? `${project.title} ${project.kind}` : `${project.title}: ${project.category} ${project.kind}`;
    return `${label} | Adam Jaro`;
}

async function contentHash(filePath) {
    const buf = await fs.readFile(filePath);
    return crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
}

// True if `out` is missing or older than `src`
function isStale(src, out) {
    return !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;
}

// Generate IDs/Slugs
projects.forEach(p => p.id = generateSlug(p.title));
blogPosts.forEach(p => p.slug = generateSlug(p.title));

// ---------- Structured data (schema.org) ----------

const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;
const currentRole = aboutInfo.experience[0];

const personSchema = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Adam Jaro',
    url: `${SITE}/`,
    image: `${SITE}${aboutInfo.photo.src}`,
    jobTitle: 'Creative Director',
    description: 'London-based creative director building brands, campaigns and the creative teams behind them, mostly in startups and scale-ups.',
    worksFor: { '@type': 'Organization', name: currentRole.org },
    hasOccupation: { '@type': 'Occupation', name: currentRole.role },
    address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
    sameAs: aboutInfo.social.filter(s => s.url.startsWith('http')).map(s => s.url),
    knowsAbout: aboutInfo.capabilities,
    award: projects.filter(p => p.award).map(p => `${p.award}: ${p.title} (${p.category})`)
};

const websiteSchema = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: 'Adam Jaro',
    inLanguage: 'en-GB',
    publisher: { '@id': PERSON_ID }
};

function graph(...nodes) {
    return { '@context': 'https://schema.org', '@graph': nodes };
}

// ---------- Images ----------

// '/images/foo.webp' -> { width, height, variants: [{ w, url }] }
const imageInfo = new Map();

async function processImages() {
    for (const sub of ['', 'video']) {
        const srcDir = path.join(SRC_DIR, 'images', sub);
        if (!existsSync(srcDir)) continue;
        const outDir = path.join(OUT_DIR, 'images', sub);
        await fs.mkdir(outDir, { recursive: true });
        const urlBase = '/images/' + (sub ? `${sub}/` : '');

        for (const file of await fs.readdir(srcDir)) {
            if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
            const srcPath = path.join(srcDir, file);
            const { width, height } = await sharp(srcPath).metadata();

            // Keep the original at its usual URL so old links still work
            await fs.copyFile(srcPath, path.join(outDir, file));

            const base = file.replace(/\.[^.]+$/, '');
            const variants = [];
            for (const w of IMG_WIDTHS) {
                if (w >= width) continue;
                const outName = `${base}-${w}.webp`;
                const outPath = path.join(outDir, outName);
                if (isStale(srcPath, outPath)) {
                    await sharp(srcPath).resize({ width: w }).webp({ quality: 78 }).toFile(outPath);
                    console.log(`Resized: ${outPath}`);
                }
                variants.push({ w, url: urlBase + outName });
            }
            if (width <= MAX_SERVED_WIDTH) variants.push({ w: width, url: urlBase + file });
            imageInfo.set(urlBase + file, { width, height, variants });
        }
    }
}

// Responsive <img>: srcset, sizes and width/height (stops layout jumping while loading)
function img(url, { alt = '', sizes = '100vw', cls = '', lazy = true, priority = false } = {}) {
    const info = imageInfo.get(url);
    const loading = lazy ? ' loading="lazy"' : '';
    const fetchPriority = priority ? ' fetchpriority="high"' : '';
    if (!info) return `<img src="${url}" alt="${esc(alt)}" class="${cls}"${loading}${fetchPriority}>`;
    const srcset = info.variants.map(v => `${v.url} ${v.w}w`).join(', ');
    const fallback = info.variants[info.variants.length - 1].url;
    return `<img src="${fallback}" srcset="${srcset}" sizes="${sizes}" width="${info.width}" height="${info.height}" alt="${esc(alt)}" class="${cls}"${loading}${fetchPriority} decoding="async">`;
}

// 1200x630 JPG for social previews (LinkedIn, WhatsApp, X etc. handle JPG most reliably)
async function makeOgImage(srcUrl, name) {
    const srcPath = path.join(SRC_DIR, srcUrl.replace(/^\//, ''));
    const outDir = path.join(OUT_DIR, 'images', 'og');
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, `${name}.jpg`);
    // Always regenerated (it's quick), so a changed thumbnail is never missed
    await sharp(srcPath).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(outPath);
    return `${SITE}/images/og/${name}.jpg`;
}

// Download a thumbnail for each YouTube/Vimeo video once, into src/images/video/
async function fetchVideoThumbnails() {
    const dir = path.join(SRC_DIR, 'images', 'video');
    await fs.mkdir(dir, { recursive: true });
    const videos = [...projects, ...blogPosts].flatMap(p => p.content).filter(c => c.type === 'youtube' || c.type === 'vimeo');

    for (const video of videos) {
        const outPath = path.join(dir, `${video.type}-${video.id}.webp`);
        if (existsSync(outPath)) continue;
        try {
            let imageUrl;
            if (video.type === 'youtube') {
                for (const quality of ['maxresdefault', 'sddefault', 'hqdefault']) {
                    const candidate = `https://i.ytimg.com/vi/${video.id}/${quality}.jpg`;
                    if ((await fetch(candidate, { method: 'HEAD' })).ok) { imageUrl = candidate; break; }
                }
            } else {
                const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${video.id}&width=1280`);
                if (res.ok) imageUrl = (await res.json()).thumbnail_url;
            }
            if (!imageUrl) throw new Error('no thumbnail found');
            const buf = Buffer.from(await (await fetch(imageUrl)).arrayBuffer());
            await sharp(buf).webp({ quality: 80 }).toFile(outPath);
            console.log(`Video thumbnail: ${outPath}`);
        } catch (err) {
            console.warn(`Could not fetch thumbnail for ${video.type} ${video.id} (${err.message}); using a normal embed.`);
        }
    }
}

// Video shows as a thumbnail link; script.js swaps in the player on click.
// Without JS (or for crawlers) it's a plain link to the video.
function videoBlock(video, label, lazy) {
    const isYouTube = video.type === 'youtube';
    const wrapperClass = video.vertical ? 'video-responsive-vertical' : 'video-responsive';
    const embed = isYouTube
        ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
        : `https://player.vimeo.com/video/${video.id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
    const watchUrl = isYouTube ? `https://www.youtube.com/watch?v=${video.id}` : `https://vimeo.com/${video.id}`;
    const thumb = `/images/video/${video.type}-${video.id}.webp`;

    if (!imageInfo.has(thumb)) {
        const fallbackEmbed = embed.replace('autoplay=1&', '').replace('?autoplay=1', '?');
        return `<div class="${wrapperClass} project-media-item rounded-sm overflow-hidden"><iframe src="${fallbackEmbed}" title="${esc(label)}" loading="lazy" frameborder="0" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe></div>`;
    }

    const sizes = video.vertical ? '(min-width: 768px) 350px, 100vw' : '(min-width: 768px) 800px, 100vw';
    return `<div class="${wrapperClass} project-media-item rounded-sm overflow-hidden">
                <a href="${watchUrl}" class="video-facade" data-embed="${embed}" data-title="${esc(label)}" aria-label="Play video: ${esc(label)}">
                    ${img(thumb, { alt: '', sizes, lazy })}
                    <span class="video-play" aria-hidden="true"></span>
                </a>
            </div>`;
}

// ---------- Build ----------

async function build() {
    console.log('Starting build...');

    // Assets first: images, CSS and JS
    await fetchVideoThumbnails();
    await processImages();

    // Compile Tailwind + custom styles into one small CSS file (scans the sources for class names)
    execFileSync(path.join('node_modules', '.bin', 'tailwindcss'),
        ['-c', 'tailwind.config.js', '-i', path.join(SRC_DIR, 'tailwind.css'), '-o', path.join(OUT_DIR, 'style.css'), '--minify'],
        { stdio: 'inherit' });
    await fs.copyFile(path.join(SRC_DIR, 'script.js'), path.join(OUT_DIR, 'script.js'));
    await fs.copyFile(path.join(SRC_DIR, 'favicon.svg'), path.join(OUT_DIR, 'favicon.svg'));
    // Video clips (src/media -> media/), copied as-is
    if (existsSync(path.join(SRC_DIR, 'media'))) {
        await fs.mkdir(path.join(OUT_DIR, 'media'), { recursive: true });
        for (const file of await fs.readdir(path.join(SRC_DIR, 'media'))) {
            if (/\.(mp4|webm)$/i.test(file)) await fs.copyFile(path.join(SRC_DIR, 'media', file), path.join(OUT_DIR, 'media', file));
        }
    }
    const cssVersion = await contentHash(path.join(OUT_DIR, 'style.css'));
    const jsVersion = await contentHash(path.join(OUT_DIR, 'script.js'));

    // Blog pages are rebuilt from scratch each time, so deleted posts don't linger online
    await fs.rm(path.join(OUT_DIR, 'blog'), { recursive: true, force: true });
    for (const file of existsSync(path.join(OUT_DIR, 'images', 'og')) ? await fs.readdir(path.join(OUT_DIR, 'images', 'og')) : []) {
        if (file.startsWith('blog-')) await fs.rm(path.join(OUT_DIR, 'images', 'og', file));
    }

    const defaultOgImage = await makeOgImage('/images/herecomestrouble.webp', 'default');

    // Read template
    const template = await fs.readFile(path.join(SRC_DIR, 'index.html'), 'utf-8');

    // Footer social links
    const socialLinksHtml = aboutInfo.social.map(item => {
        let url = item.url;
        if (url === '#blog') url = '/blog/';
        return `<a href="${url}" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-sm nav-link font-medium hover:opacity-70 transition-opacity">${item.name}</a>`;
    }).join('');

    // Helper to write file
    async function writePage(filePath, content, meta = {}) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        const url = meta.url || `${SITE}/`;
        const values = {
            content,
            footer_social: socialLinksHtml,
            site_config: `<script>window.siteConfig = ${JSON.stringify(siteConfig)};</script>`,
            structured_data: meta.schema ? `<script type="application/ld+json">${JSON.stringify(meta.schema)}</script>` : '',
            canonical: meta.noindex ? '' : `<link rel="canonical" href="${esc(url)}">`,
            meta_robots: meta.noindex ? '<meta name="robots" content="noindex">' : '',
            meta_title: esc(meta.title || 'Adam Jaro | Creative Director, London'),
            meta_description: esc(meta.description || 'Adam Jaro is a London-based creative director building brands, campaigns and creative teams.'),
            meta_url: esc(url),
            meta_type: meta.type || 'website',
            meta_image: esc(meta.image || defaultOgImage),
            meta_image_alt: esc(meta.imageAlt || 'Adam Jaro, creative director'),
            css_version: cssVersion,
            js_version: jsVersion,
            nav_lab: LAB_PUBLIC ? `<a href="/lab/" class="text-base md:text-lg font-medium tracking-wide cursor-pointer nav-link hover:opacity-70 transition-opacity" id="nav-lab">LAB</a>` : '',
        };
        // Function replacer so "$" in content is never treated as a special pattern
        const pageHtml = template.replace(/{{(\w+)}}/g, (match, key) => key in values ? values[key] : match);

        await fs.writeFile(filePath, pageHtml);
        console.log(`Generated: ${filePath}`);
    }

    // --- 1. Home Page ---
    const homeContent = `
        <section id="page-home" class="page active">
            <div class="mb-8 md:mb-12 text-left md:text-center max-w-2xl mx-auto">
                <h1 class="intro-reveal text-xl md:text-2xl font-light leading-snug" style="--n:${aboutInfo.homeIntro.split(' ').length}">${aboutInfo.homeIntro.split(' ').map((word, i) => `<span style="--i:${i}">${word}</span>`).join(' ')}</h1>
                ${aboutInfo.homeTagline ? `<p class="mt-5 text-lg md:text-xl font-light leading-snug text-muted-text">${aboutInfo.homeTagline}</p>` : ''}
                <p class="mt-5 text-sm text-muted-text">${aboutInfo.clients.slice(0, 7).join(' · ')}</p>
            </div>
            <div id="project-grid" class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
                ${projects.map((project, i) => `
                    <a href="/projects/${project.id}/" class="group relative block project-thumbnail" aria-label="${esc(`${project.title}, ${project.kind} for ${project.category}. ${project.role}`)}">
                        <div class="relative overflow-hidden aspect-[4/3]">
                            ${img(project.thumbnail, {
        alt: projectSummary(project),
        sizes: '(min-width: 640px) 50vw, 100vw',
        cls: 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105',
        lazy: i > 3,
        priority: i === 0
    })}
                            <div class="tile-overlay absolute inset-0 hidden md:flex flex-col items-center justify-center text-center p-8 opacity-0 transition-opacity duration-300 md:group-hover:opacity-100 md:group-focus-visible:opacity-100" aria-hidden="true">
                                <div class="tile-overlay-content">
                                    ${project.category.toLowerCase() !== project.title.toLowerCase() ? `<p class="text-xs uppercase tracking-[0.2em] text-white/70 mb-3">${project.category}</p>` : ''}
                                    <p class="font-display text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">${project.title}</p>
                                    <p class="text-gradient text-sm font-semibold uppercase tracking-wider mb-1">${project.kind}</p>
                                    <p class="text-sm text-white/80">${project.role}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <div class="project-thumbnail-mobile-title p-4 md:hidden" aria-hidden="true">
                        <p class="text-lg font-bold">${project.title}</p>
                        <p class="text-sm text-muted-text">${project.category} · ${project.kind}</p>
                        <p class="text-sm text-muted-text">${project.role}</p>
                    </div>
                `).join('')}
            </div>
            ${LAB_PUBLIC ? `
            <p class="max-w-6xl mx-auto mt-16 text-center text-lg text-muted-text">
                I also build things: daily games and creative tools.
                <a href="/lab/" class="font-medium text-primary-text hover:underline whitespace-nowrap">See the Lab →</a>
            </p>` : ''}
        </section>
    `;
    const projectList = {
        '@type': 'ItemList',
        name: 'Selected work',
        itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/projects/${p.id}/`, name: p.title }))
    };
    await writePage(path.join(OUT_DIR, 'index.html'), homeContent, {
        title: 'Adam Jaro | Creative Director, London',
        description: 'Adam Jaro is a London-based creative director building brands, campaigns and creative teams for startups and scale-ups.',
        url: `${SITE}/`,
        schema: graph(personSchema, websiteSchema, projectList)
    });

    // --- 2. Info Page ---
    const emailLink = (cls) => `<a href="#" class="${cls} email-inject">Email me</a>`;
    const infoContent = `
        <section id="page-info" class="page active">
            <div class="max-w-4xl mx-auto">
                <div class="mb-8"><a href="/" class="btn-pill nav-link cursor-pointer">← Back to all projects</a></div>
                <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_1fr] gap-12">
                    <div class="md:col-start-3 md:row-start-1">
                        ${img(aboutInfo.photo.src, { alt: aboutInfo.photo.alt, sizes: '(min-width: 768px) 280px, 60vw', cls: 'w-3/5 md:w-full h-auto rounded-sm', lazy: false, priority: true })}
                    </div>
                    <div id="info-bio" class="md:col-span-2 md:col-start-1 md:row-start-1 md:row-span-2 text-xl leading-relaxed font-light">
                        <h1 class="sr-only">About Adam Jaro</h1>
                        ${aboutInfo.bio}
                    </div>
                    <div id="contact" class="space-y-4 scroll-mt-32 md:col-start-3 md:row-start-2">
                        <p class="text-sm uppercase tracking-wider text-muted-text">Contact</p>
                        <p class="text-base text-muted-text">${aboutInfo.contactIntro}</p>
                        ${aboutInfo.contact.map(item => {
        if (item.type === 'email-placeholder') return emailLink('block text-lg font-medium hover:underline');
        if (item.type === 'social') return `<a href="${item.url}" target="_blank" class="block text-lg hover:underline">${item.label}</a>`;
        return '';
    }).join('')}
                        <div class="flex space-x-4 pt-2">
                            ${aboutInfo.social.map(item => {
        let url = item.url;
        if (url === '#blog') url = '/blog/';
        return `<a href="${url}" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-lg nav-link font-medium text-nav-link-color hover:opacity-70 transition-opacity">${item.name}</a>`;
    }).join('')}
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 pt-12 border-t border-border-light">
                    <div class="md:col-span-2">
                        <h2 class="text-sm uppercase tracking-wider text-muted-text mb-6">Experience</h2>
                        <ul class="space-y-4">
                            ${aboutInfo.experience.map(e => `
                            <li class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 border-b border-border-light pb-4 last:border-0">
                                <span class="text-lg"><span class="font-medium">${e.role}</span><span class="text-muted-text">, ${e.org}</span></span>
                                <span class="text-sm text-muted-text font-mono whitespace-nowrap">${e.dates}</span>
                            </li>`).join('')}
                        </ul>
                    </div>
                    <div class="space-y-10">
                        <div>
                            <h2 class="text-sm uppercase tracking-wider text-muted-text mb-4">What I do</h2>
                            <ul class="space-y-2 text-base">
                                ${aboutInfo.capabilities.map(c => {
        const href = LAB_PUBLIC && aboutInfo.capabilityLinks?.[c];
        return `<li>${href ? `<a href="${href}" class="underline hover:text-primary-text">${c} →</a>` : c}</li>`;
    }).join('')}
                            </ul>
                        </div>
                        <div>
                            <h2 class="text-sm uppercase tracking-wider text-muted-text mb-4">Recognition</h2>
                            <ul class="space-y-2 text-base">
                                ${aboutInfo.recognition.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="mt-16 pt-12 border-t border-border-light">
                    <h2 class="text-sm uppercase tracking-wider text-muted-text mb-4">Selected clients &amp; brands</h2>
                    <p class="text-lg leading-relaxed">${aboutInfo.clients.join(' · ')}</p>
                </div>

                <p class="mt-16 text-xs text-muted-text">© <span id="footer-year">${new Date().getFullYear()}</span> Adam Jaro · <a href="/privacy/" class="hover:text-primary-text">Privacy</a></p>
            </div>
        </section>
    `;
    await writePage(path.join(OUT_DIR, 'info', 'index.html'), infoContent, {
        title: 'About & contact | Adam Jaro, Creative Director',
        description: 'Adam Jaro is a London-based creative director. Creative Lead at Kooth; previously an early creative hire at Fiit and MindLabs, and agency co-founder.',
        url: `${SITE}/info/`,
        type: 'profile',
        schema: graph(personSchema, websiteSchema, {
            '@type': 'ProfilePage',
            '@id': `${SITE}/info/#page`,
            url: `${SITE}/info/`,
            name: 'About Adam Jaro',
            isPartOf: { '@id': WEBSITE_ID },
            mainEntity: { '@id': PERSON_ID }
        })
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
        title: 'Privacy Policy | Adam Jaro',
        description: 'How adamjaro.com handles your data: no tracking or advertising cookies.',
        url: `${SITE}/privacy/`
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
                    ${blogPosts.map(post => {
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // Store slug on post object for the post pages below
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
    // No posts = no blog pages at all (/blog/ shows the 404 page)
    if (blogPosts.length) {
        await writePage(path.join(OUT_DIR, 'blog', 'index.html'), blogListContent, {
            title: 'Blog | Adam Jaro',
            description: 'Thoughts and updates from Adam Jaro.',
            url: `${SITE}/blog/`
        });
    }

    // --- 5. Project Pages ---
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const nextProject = i < projects.length - 1 ? projects[i + 1] : null;
        const projectUrl = `${SITE}/projects/${project.id}/`;
        const mediaAlt = `${project.title}, ${project.kind} for ${project.category}`;
        const ogImage = await makeOgImage(project.thumbnail, project.id);

        // Render content blocks. Only the first piece of media loads straight away.
        let mediaCount = 0;
        const contentHtml = project.content.map(item => {
            if (item.type === 'text') return `<div class="project-text-block text-lg leading-relaxed max-w-prose">${item.body}</div>`;
            const lazy = mediaCount++ > 0;
            if (item.type === 'image') return img(item.src, { alt: mediaAlt, sizes: '(min-width: 896px) 896px, 100vw', cls: 'w-full h-auto project-media-item rounded-sm', lazy });
            if (item.type === 'vimeo' || item.type === 'youtube') return videoBlock(item, `${project.title}, ${project.category}`, lazy);
            if (item.type === 'image-pair') return `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 project-media-item">
                    ${img(item.src1, { alt: mediaAlt, sizes: '(min-width: 768px) 448px, 100vw', cls: 'w-full h-auto rounded-sm', lazy })}
                    ${img(item.src2, { alt: mediaAlt, sizes: '(min-width: 768px) 448px, 100vw', cls: 'w-full h-auto rounded-sm', lazy: true })}
                </div>`;
            return '';
        }).join('');

        const projectPageContent = `
            <section id="page-project" class="page active">
                <div class="max-w-4xl mx-auto">
                    <div class="mb-8"><a href="/" class="btn-pill nav-link cursor-pointer">← All Projects</a></div>
                    <header class="mb-10">
                        <h1 class="text-3xl md:text-5xl font-bold mb-2 leading-tight">${project.title}</h1>
                        <p class="text-lg text-muted-text font-medium">${project.category}</p>
                    </header>
                    <article class="space-y-8 md:space-y-12">
                        ${contentHtml}
                    </article>

                    <div class="mt-16 pt-10 border-t border-border-light text-lg">
                        <p class="text-muted-text">Want to talk about work like this?</p>
                        <a href="#" class="font-medium hover:underline email-inject">Email me</a>
                    </div>

                    ${nextProject ? `
                    <div class="mt-12 mb-4">
                        <a href="/projects/${nextProject.id}/" class="btn-pill-rich nav-link cursor-pointer">
                            ${img(nextProject.thumbnail, { alt: '', sizes: '48px' })}
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

        const creativeWork = {
            '@type': 'CreativeWork',
            '@id': `${projectUrl}#work`,
            name: project.title,
            url: projectUrl,
            description: projectSummary(project),
            genre: project.kind,
            image: ogImage,
            creator: { '@id': PERSON_ID },
            sponsor: project.category.split(' x ').map(name => ({ '@type': 'Organization', name })),
            isPartOf: { '@id': WEBSITE_ID },
            ...(project.award ? { award: project.award } : {})
        };
        const breadcrumbs = {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Work', item: `${SITE}/` },
                { '@type': 'ListItem', position: 2, name: project.title, item: projectUrl }
            ]
        };

        await writePage(path.join(OUT_DIR, 'projects', project.id, 'index.html'), projectPageContent, {
            title: projectPageTitle(project),
            description: `${project.category}: ${projectSummary(project)}`,
            image: ogImage,
            imageAlt: mediaAlt,
            type: 'article',
            url: projectUrl,
            schema: graph(creativeWork, breadcrumbs, personSchema)
        });
    }

    // --- 5b. Projects Index Redirect ---
    // /projects/ has no page of its own, so send visitors (and search engines) home
    const projectsRedirectContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Adam Jaro | Work</title>
    <meta name="robots" content="noindex">
    <link rel="canonical" href="${SITE}/">
    <meta http-equiv="refresh" content="0; url=/">
    <script>window.location.replace("/");</script>
</head>
<body>
    <p>Redirecting to <a href="/">home</a>...</p>
</body>
</html>
`;
    await fs.mkdir(path.join(OUT_DIR, 'projects'), { recursive: true });
    await fs.writeFile(path.join(OUT_DIR, 'projects', 'index.html'), projectsRedirectContent);
    console.log(`Generated: projects/index.html (Redirect)`);

    // --- 6. Blog Post Pages ---
    for (const post of blogPosts) {
        const slug = post.slug;

        // 1. Description: from data, else the first text block
        let description = post.description;
        if (!description) {
            const firstTextBlock = post.content.find(c => c.type === 'text');
            if (firstTextBlock) {
                const plainText = plain(firstTextBlock.body);
                description = plainText.substring(0, 160).trim();
                if (plainText.length > 160) description += '...';
            }
        }
        if (!description) description = `Read "${post.title}" on Adam Jaro's blog.`;

        // 2. Social image: from data, else the first image in the post
        let imageSrc = post.image;
        if (!imageSrc) {
            const firstImageBlock = post.content.find(c => c.type === 'image' || c.type === 'image-pair');
            if (firstImageBlock) imageSrc = firstImageBlock.type === 'image' ? firstImageBlock.src : firstImageBlock.src1;
        }
        const image = imageSrc && imageSrc.startsWith('/images/') ? await makeOgImage(imageSrc, `blog-${slug}`) : undefined;

        let mediaCount = 0;
        const contentHtml = post.content.map(item => {
            if (item.type === 'text') return `<div class="project-text-block text-lg leading-relaxed max-w-prose">${item.body}</div>`;
            const lazy = mediaCount++ > 0;
            if (item.type === 'image') return img(item.src, { alt: post.title, sizes: '(min-width: 896px) 896px, 100vw', cls: 'w-full h-auto project-media-item rounded-sm', lazy });
            if (item.type === 'vimeo' || item.type === 'youtube') return videoBlock(item, post.title, lazy);
            if (item.type === 'image-pair') return `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 project-media-item">
                    ${img(item.src1, { alt: post.title, sizes: '(min-width: 768px) 448px, 100vw', cls: 'w-full h-auto rounded-sm', lazy })}
                    ${img(item.src2, { alt: post.title, sizes: '(min-width: 768px) 448px, 100vw', cls: 'w-full h-auto rounded-sm', lazy: true })}
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
                        <h1 class="text-3xl md:text-5xl font-bold mb-2 leading-tight">${post.title}</h1>
                        <p class="text-lg text-muted-text font-medium">${new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>
                    <article class="space-y-8 md:space-y-12 mb-16">
                        ${contentHtml}
                    </article>

                    <div class="border-t border-border-light pt-12 pb-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div class="md:col-span-2 text-xl leading-relaxed font-light">
                                ${aboutInfo.shortBio}
                            </div>
                            <div class="space-y-4">
                                ${aboutInfo.contact.map(item => {
            if (item.type === 'email-placeholder') return `<a href="#" class="block text-lg hover:underline email-inject">Email me</a>`;
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
            title: `${post.title} | Adam Jaro Blog`,
            description,
            url: `${SITE}/blog/${slug}/`,
            type: 'article',
            image
        });
    }

    // --- 6b. Lab Page (coding side projects) ---
    const statusStyles = {
        'Live': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
        'In progress': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
        'Prototype': 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
    };
    // Looping, silent clip. script.js plays it only while it's on screen,
    // and never for people who prefer reduced motion (they see the still frame).
    const labVideo = (p) => {
        const info = imageInfo.get(p.image);
        const poster = info ? (info.variants.find(v => v.w >= 960) || info.variants[info.variants.length - 1]).url : p.image;
        const size = info ? ` width="${info.width}" height="${info.height}"` : '';
        return `<video class="lab-video w-full h-auto rounded-xl" src="${p.video}" poster="${poster}"${size} muted loop playsinline preload="none" aria-label="${esc(`${p.name}: ${p.tagline}`)}"></video>`;
    };
    // Background waveforms: real FM waves, y = sin(carrier + index * sin(modulator)).
    // Whole cycles over one period, drawn twice, so sliding left by one period loops seamlessly.
    const fmWavePath = (period, height, carrierCycles, modCycles, index) => {
        const points = [];
        for (let x = 0; x <= period * 2; x += 4) {
            const t = (x / period) * Math.PI * 2;
            const y = height / 2 + (height / 2 - 2) * Math.sin(carrierCycles * t + index * Math.sin(modCycles * t));
            points.push(`${x},${y.toFixed(1)}`);
        }
        return `M${points.join(' L')}`;
    };
    const labBackground = `
        <div class="lab-bg" aria-hidden="true">
            <div class="lab-orb lab-orb-a"></div>
            <div class="lab-orb lab-orb-b"></div>
            <div class="lab-orb lab-orb-c"></div>
            <div class="lab-grid"></div>
            <svg class="lab-wave lab-wave-a" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="${fmWavePath(1200, 120, 3, 1, 2.2)}" /></svg>
            <svg class="lab-wave lab-wave-b" viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="${fmWavePath(1200, 80, 5, 2, 1.4)}" /></svg>
        </div>`;
    const labContent = `
        ${labBackground}
        <section id="page-lab" class="page active relative z-10">
            <div class="max-w-4xl mx-auto">
                <div class="mb-8"><a href="/" class="btn-pill nav-link cursor-pointer">← Back to all projects</a></div>
                <header class="mb-12">
                    <h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">Lab</h1>
                    <div class="lab-intro text-xl leading-relaxed font-light text-muted-text max-w-2xl space-y-4">${labIntro}</div>
                </header>
                <div class="space-y-6 md:space-y-8">
                    ${labProjects.map((p, i) => `
                    <article class="lab-card grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 items-start p-5 md:p-8 rounded-2xl md:rounded-3xl">
                        <div class="md:col-span-2">
                            ${p.video
        ? labVideo(p, i)
        : p.image
        ? img(p.image, { alt: `${p.name} screenshot`, sizes: '(min-width: 768px) 340px, 100vw', cls: 'w-full h-auto rounded-xl', lazy: i > 0 })
        : `<div class="lab-tile aspect-[4/3] rounded-xl flex items-center justify-center p-6" aria-hidden="true"><span class="font-display text-3xl font-bold text-white text-center leading-tight">${p.name}</span></div>`}
                        </div>
                        <div class="md:col-span-3">
                            <div class="flex flex-wrap items-center gap-3 mb-2">
                                <h2 class="text-2xl md:text-3xl font-bold leading-tight">${p.name}</h2>
                                <span class="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyles[p.status] || 'bg-border-light text-muted-text'}">${p.status}</span>
                            </div>
                            <p class="text-lg text-muted-text mb-5">${p.tagline}</p>
                            <div class="project-text-block text-lg leading-relaxed">${p.body}</div>
                            ${p.builtWith?.length ? `<p class="mt-5 text-sm text-muted-text"><span class="uppercase tracking-wider">Built with</span> · ${p.builtWith.join(' · ')}</p>` : ''}
                            ${p.url ? `<div class="mt-6"><a href="${p.url}" target="_blank" rel="noopener" class="btn-pill nav-link">${p.urlLabel || 'Try it'} →</a></div>` : ''}
                        </div>
                    </article>`).join('')}
                </div>
            </div>
        </section>
    `;
    await writePage(path.join(OUT_DIR, 'lab', 'index.html'), labContent, {
        title: 'Lab | Adam Jaro',
        description: 'Side projects by Adam Jaro, built around music, film, nature and his own creative workflow: daily games and tools, designed and coded with Claude Code.',
        url: `${SITE}/lab/`,
        noindex: !LAB_PUBLIC
    });

    // --- 7. 404 Page (GitHub Pages serves /404.html for any missing URL) ---
    const notFoundContent = `
        <section id="page-404" class="page active">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">Page not found</h1>
                <p class="text-lg text-muted-text mb-8">That page doesn't exist, or it's moved. Here's some recent work instead.</p>
                <ul class="space-y-3 text-lg mb-10">
                    ${projects.map(p => `<li><a href="/projects/${p.id}/" class="hover:underline"><span class="font-medium">${p.title}</span> <span class="text-muted-text">${p.category}</span></a></li>`).join('')}
                </ul>
                <a href="/" class="btn-pill nav-link cursor-pointer">← Back to all projects</a>
            </div>
        </section>
    `;
    await writePage(path.join(OUT_DIR, '404.html'), notFoundContent, {
        title: 'Page not found | Adam Jaro',
        noindex: true
    });

    // --- 8. sitemap.xml ---
    // Blog is left out while it's hidden from the nav (see aboutInfo.social in src/data.js)
    const sitemapUrls = [`${SITE}/`, `${SITE}/info/`, ...projects.map(p => `${SITE}/projects/${p.id}/`), ...(LAB_PUBLIC ? [`${SITE}/lab/`] : []), `${SITE}/privacy/`];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
    await fs.writeFile(path.join(OUT_DIR, 'sitemap.xml'), sitemap);
    console.log('Generated: sitemap.xml');

    // --- 9. robots.txt ---
    // Search engines and AI assistants are all welcome. The named AI crawlers are
    // listed explicitly so it's clear they're allowed.
    const robots = `# Everyone is welcome to crawl this site
User-agent: *
Allow: /

# AI search and assistant crawlers, explicitly allowed
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
    await fs.writeFile(path.join(OUT_DIR, 'robots.txt'), robots);
    console.log('Generated: robots.txt');

    // --- 10. llms.txt (plain-text summary for AI tools, see llmstxt.org) ---
    const bioParagraphs = [...aboutInfo.bio.matchAll(/<p[^>]*>(.*?)<\/p>/gs)].map(m => plain(m[1]));
    const llms = `# Adam Jaro

> Adam Jaro is a creative director based in London. He builds brands, campaigns and the creative teams behind them, mostly in startups and scale-ups. He is currently ${currentRole.role} at ${currentRole.org}.

## About (in Adam's words)

${bioParagraphs.join('\n\n')}

## Experience

${aboutInfo.experience.map(e => `- ${e.role}, ${e.org} (${e.dates.replace('–', 'to')})`).join('\n')}

## What he does

${aboutInfo.capabilities.map(c => `- ${c}`).join('\n')}

## Recognition

${aboutInfo.recognition.map(r => `- ${plain(r)}`).join('\n')}

## Selected clients and brands

${aboutInfo.clients.join(', ')}

## Work

${projects.map(p => {
        const results = projectResults(p);
        return `- [${p.title}](${SITE}/projects/${p.id}/): ${p.kind} for ${p.category}. ${projectSummary(p)}${results.length ? ` Results: ${results.join('; ')}.` : ''}`;
    }).join('\n')}

${LAB_PUBLIC ? `## Side projects (Lab)

${labProjects.map(p => `- ${p.url ? `[${p.name}](${p.url})` : p.name} (${p.status.toLowerCase()}): ${p.tagline}. ${plain(p.body).split(/(?<=[.!?])\s/)[0]}`).join('\n')}

More: ${SITE}/lab/

` : ''}## Contact

- [About and contact](${SITE}/info/#contact)
${aboutInfo.social.filter(s => s.url.startsWith('http')).map(s => `- [${s.name}](${s.url})`).join('\n')}
`;
    await fs.writeFile(path.join(OUT_DIR, 'llms.txt'), llms);
    console.log('Generated: llms.txt');

    console.log('Build complete!');
}

build().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
