// Site Configuration
export const siteConfig = {
    emailUser: 'hello',
    emailDomain: 'adamjaro.com'
};

// About / Info Page Content
export const aboutInfo = {
    // Short version, used at the foot of blog posts
    shortBio: `
        <p class="mb-4">Adam Jaro is a creative director based in London.</p>
        <p>He builds brands, campaigns and the creative teams behind them, mostly in startups and scale-ups.</p>
    `,
    // Full version, used on the Info page
    bio: `
        <p class="mb-6">I'm a creative director in London. I got into this because I love making things, and ten years on I still do.</p>
        <p class="mb-6">Most of my career has been in startups and scale-ups, usually as one of the first creative hires, working directly with the founder or CMO. At Fiit I directed the rebrand that helped grow sales 1.5x and took a national TV ad from brief to broadcast in two weeks. At MindLabs I built a team of six that shipped 1,500+ assets and tuned creative against performance data to a 5:1 ROI. I also co-founded an agency that passed £100k in its first year, working with Emilia Wickstead and the Royal Albert Hall.</p>
        <p class="mb-6">Now I'm Creative Lead at Kooth Digital Health: a company-wide brand refresh, national campaigns (including an award-winning one with The Diana Award), and the pitch and board decks most creative directors never touch.</p>
        <p>The job is the same wherever I am: set a clear creative bar, build the team and process that can hit it at speed, and stay hands-on enough to show what good looks like. I design, I direct, and I build things too. This site included, with Claude Code.</p>
    `,
    // Homepage intro. Each word fades from white into the brand gradient on load.
    homeIntro: 'Creative director in London. I build brands, campaigns and the creative teams behind them, mostly in startups and scale-ups.',
    // Optional second homepage line; leave empty to hide it.
    // Previous: "Ten years in, I still love making things. I've just got better at convincing people it was their idea."
    homeTagline: '',
    photo: { src: '/images/adam-jaro.webp', alt: 'Adam Jaro holding a Sony cinema camera on a shoot' },
    experience: [
        { role: 'Creative Lead', org: 'Kooth Digital Health', dates: '2024 – now' },
        { role: 'Co-founder & Creative Director', org: 'Social Custard', dates: '2023 – 2025' },
        { role: 'Head of Production', org: 'MindLabs', dates: '2021 – 2022' },
        { role: 'Creative Lead / Lead Video Producer', org: 'Fiit', dates: '2018 – 2020' },
        { role: 'Senior Creative Producer', org: 'Qubit', dates: '2018' },
        { role: 'Founder & Creative Director', org: 'Soundlikejaro', dates: '2014 – now' },
    ],
    capabilities: [
        'Creative direction & brand strategy',
        'Brand identity & systems',
        'Integrated campaigns: TV, OOH, digital, social',
        'Performance creative & paid social',
        'Building and leading creative teams',
        'Pitch, investor & board materials',
        'AI-assisted design and build',
    ],
    recognition: [
        'Brand Film Award 2026: <em>The Pretender</em>, Kooth x The Diana Award',
        '<em>The Pretender</em> featured on ITV',
    ],
    clients: [
        'Kooth', 'The Diana Award', 'Royal Albert Hall', 'Emilia Wickstead', 'Fiit', 'MindLabs',
        'Channel 4', 'The FA', 'Hussle', 'British Soft Drinks Association', 'The Trouble Club',
        'UCL', 'Sephora', 'L’Occitane',
    ],
    contactIntro: 'For projects, collaborations, or just a conversation:',
    contact: [
        { type: 'email-placeholder' },
        // { type: 'phone', text: '+44 7123 456 789', url: 'tel:+447123456789' },
    ],
    social: [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/adamjaro' },
        // Blog link hidden until there are a few posts worth showing. Pages still build at /blog/.
        // { name: 'Blog', url: '#blog' }
    ]
};



// Project Content
export const projects = [
    {
        title: 'The Pretender',
        category: 'Kooth x The Diana Award',
        kind: 'campaign film',
        award: 'Brand Film Awards 2026, Winner',
        thumbnail: '/images/thepretender.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Kooth's own research found that one in three young people who are bullied don't tell anyone at home. For The Diana Award's annual anti-bullying campaign, we wanted to make that hidden experience impossible to ignore.</p>
                `
            },
            {
                type: 'youtube',
                id: 'LghkNyH47X4'
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I led the campaign from the research insight through to launch. I wrote the script, set the creative direction across film, national digital OOH and press, and worked with The Diana Award's team so the campaign did a job for both organisations. I cast the lead through Sylvia Young Theatre School and directed the film with a small crew.</p>
                    <p>The brief I set was simple: no gimmicks. The story is built from real experiences young people shared with Kooth's practitioners, and the film stays on one face and lets it carry the weight.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Winner, Brand Film Awards 2026</li><li>Featured on ITV, with coverage across national press</li><li>Ran nationally across digital OOH</li></ul>
                `
            }
        ]
    },
    {
        title: 'Your Move',
        category: 'Kooth',
        kind: 'youth mental health campaign',
        thumbnail: '/images/yourmove1.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Mental health campaigns aimed at teenagers tend to sound the same, and teenagers tune them out. Your Move was Kooth's campaign to reach young people in schools and online with something that felt like it was made for them, not at them.</p>
                `
            },
            {
                type: 'image-pair',
                src1: '/images/yourmove1.webp',
                src2: '/images/yourmove2.webp'
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I set the creative strategy and built the campaign identity, then made the case internally for going much bolder than Kooth's usual look. Once that was agreed, I led the design and production work across print, digital, merchandise and in-school activations, keeping one clear idea running through every format.</p>
                    <p>The bold graphics and direct language were a deliberate bet: a health brand can be trusted and still feel like it belongs to the audience it's talking to.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Rolled out nationally across schools, digital and social</li><li>Put printed materials and activations in front of tens of thousands of students</li><li>Gave Kooth a more confident voice with young people</li></ul>
                `
            },
            {
                type: 'image',
                src: '/images/yourmove3.webp'
            }
        ]
    },
    {
        title: 'Join the mental health revolution',
        category: 'MindLabs',
        kind: 'launch film',
        thumbnail: '/images/mindlabs.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>MindLabs was a mental wellbeing app launching into a crowded, soft-focus category. As one of the first creative hires, I needed a launch idea that would make it look like the next generation of the category, and a creative engine that could keep feeding marketing after launch day.</p>
                `
            },
            {
                type: 'youtube',
                id: '3hyFlY0MaPU'
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I developed the launch concept: three real people, each using MindLabs in their daily life, shot to feel high-energy and contemporary rather than soft-focus. I directed the hero film and planned the shoot so it gave us far more than one ad.</p>
                    <p>That footage became the starting point for the performance creative. Cutdowns, variants and new hooks went into the weekly testing cycle my team ran against conversion data.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Anchored the brand and app launch across every channel</li><li>Used extensively across paid social and performance campaigns</li></ul>
                `
            }
        ]
    },
    {
        title: 'Bring the gym home',
        category: 'Fiit',
        kind: 'national TV ad',
        thumbnail: '/images/bringthegymhome.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>When the first lockdown hit, every home fitness app was suddenly chasing the same people. Fiit's CMO wanted national TV on air within weeks, while the moment was still there.</p>
                `
            },
            {
                type: 'youtube',
                id: 'TfCjyTuvBVE'
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I wrote the concept and script and ran the project from brief to national broadcast in two weeks, on a £100k budget. That meant assembling the crew and deciding quickly what to cut to make the deadline without losing the idea.</p>
                    <p>The idea was as direct as the timeline: the gym, at home, now. It put Fiit's product and energy front and centre at the moment people were looking for exactly that.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Aired nationally for over three months at the peak of lockdown demand</li><li>Contributed to a surge in sign-ups</li></ul>
                `
            }
        ]
    },
    {
        title: 'The light show',
        category: 'British Soft Drinks Association',
        kind: 'influencer event',
        thumbnail: '/images/thelightshow.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>The British Soft Drinks Association wanted younger audiences to take a fresh look at low- and no-sugar drinks. Health messaging from an industry body is an easy thing to be sceptical about, so it had to come from people that audience already trusts.</p>
                `
            },
            {
                type: 'vimeo',
                id: '1139982703',
                vertical: true
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I led the creative direction for the campaign and the event at its centre, working alongside a PR agency. The Light Show was a one-day event for around 30 creators, in a venue built around games and interactive installations, so they had things worth posting about.</p>
                    <p>I wrote the influencer briefs and content guidelines to keep the message on track without scripting anyone, and ran a film crew on the day to produce edits for BSDA's own channels.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Sold-out event with around 30 creators</li><li>Hundreds of organic posts across creators' own channels</li><li>A library of content for BSDA's owned channels from a single day</li></ul>
                `
            }
        ]
    },
    {
        title: 'Together, we create the amazing',
        category: 'Royal Albert Hall America',
        kind: 'fundraising film',
        thumbnail: '/images/RAHA.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Royal Albert Hall America raises money from US donors to support the Hall's work. They needed a film that would sit at the centre of their fundraising and make the case for long-term giving, without feeling like a sales pitch.</p>
                `
            },
            {
                type: 'vimeo',
                id: '1139980503'
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I started with the fundraising problem rather than the film. Working with the RAHA team, I shaped the narrative around what donors needed to feel before they'd commit, then wrote the script so the tiered giving opportunities sat inside the story rather than tacked on at the end.</p>
                    <p>I directed the production, combining new footage with archive from more than 150 years of the Hall's history.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>The flagship film for RAHA's US fundraising</li><li>A versatile asset for engaging high-value US donors</li><li>Presents the Hall as both historic and forward-looking</li></ul>
                `
            }
        ]
    },
    {
        title: 'London fashion week SS24',
        category: 'Emilia Wickstead',
        kind: 'show livestream',
        thumbnail: '/images/LFW24.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Emilia Wickstead wanted their SS24 London Fashion Week show to reach far beyond the people in the room, and to feel as considered on screen as it did on the runway.</p>
                `
            },
            {
                type: 'vimeo',
                id: '1139983564',
                vertical: true
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>As co-founder of Social Custard, I led our team through the project. We planned a multi-camera livestream from a historic London venue, ran setup and rehearsals over several days, and delivered the live show to thousands of viewers.</p>
                    <p>I set the plan for everything that came after the show too: long and short versions of the full show and a run of social edits for each platform, all agreed with Emilia Wickstead's team against their brand and the collection.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Livestreamed to thousands beyond the live audience</li><li>A full suite of show films and social edits for Emilia Wickstead's channels</li></ul>
                `
            },
            {
                type: 'youtube',
                id: '6p-dCFqKph0'
            }
        ]
    },
    {
        title: 'Hussle x Fiit',
        category: 'Hussle x Fiit',
        kind: 'partnership launch film',
        thumbnail: '/images/HusslexFiit.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Fiit partnered with Hussle so members could train with the Fiit app in any Hussle gym. The launch needed to announce the partnership and, at the same time, push Fiit's bigger message: you can train with Fiit anywhere.</p>
                `
            },
            {
                type: 'youtube',
                id: '7Ol7shA_EYA'
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I came up with one simple, repeatable idea: a single continuous workout that moves between a Hussle gym, a living room and a park without breaking. It tells the partnership story and the brand story in the same shot.</p>
                    <p>I directed the hero film and planned the production so the same structure could be cut down for social and reused for future partnerships.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Launched the partnership to both user bases</li><li>A creative framework Fiit could reuse beyond this launch</li><li>Reinforced Fiit's position as the fitness app you can use anywhere</li></ul>
                `
            }
        ]
    },
    {
        title: 'Here comes trouble',
        category: 'Trouble Club',
        kind: 'brand campaign',
        thumbnail: '/images/herecomestrouble.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>The Trouble Club is a community and talks organisation for women. Its events were full of energy, but its image needed modernising to appeal to a younger audience without losing the credibility it had built.</p>
                `
            },
            {
                type: 'vimeo',
                id: '1139979402'
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I shaped the campaign concept as part of a wider visual refresh: let the members sell it. We filmed at three of the club's busiest events over several months, capturing the atmosphere and interviewing members about what the club means to them.</p>
                    <p>I directed the shoots and led the edit into a set of campaign assets built for web, social and marketing.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>A refreshed, more energetic brand across the club's digital channels</li><li>Greater appeal to the younger audience the club wanted to reach</li><li>A flexible asset library the team could keep using</li></ul>
                `
            },
            {
                type: 'image',
                src: '/images/herecomestrouble-2.webp'
            }
        ]
    },
    {
        title: 'Unwind',
        category: 'MindLabs',
        kind: 'breathwork and meditation series',
        thumbnail: '/images/unwind.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>At MindLabs, content was the product as well as the marketing. Most meditation content is interchangeable, so we wanted series that felt distinct enough to be a reason to choose the app.</p>
                `
            },
            {
                type: 'vimeo',
                id: '1139986546',
                vertical: true
            },
            {
                type: 'text',
                body: `
                    <p><strong>What I did</strong></p>
                    <p>I led the creative vision for two flagship series: Unwind (breathwork) and Five Senses (meditation). I worked with sound artists on bespoke soundscapes and directed shoots in remote locations, including a 300-year-old abandoned mine in Wales for Unwind.</p>
                    <p>The challenge was keeping ambitious productions simple and calming for the person using them, and making them repeatable enough to run as series alongside everything else my team was producing.</p>
                    <p><strong>Result</strong></p>
                    <ul><li>Two flagship series in the MindLabs app</li><li>Gave the content library a distinct identity in a crowded category</li></ul>
                `
            }
        ]
    },
];
