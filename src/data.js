// Site Configuration
export const siteConfig = {
    emailUser: 'hello',
    emailDomain: 'adamjaro.com'
};

// About / Info Page Content
export const aboutInfo = {
    bio: `
        <p class="mb-4">Adam Jaro is a multi-disciplinary creative based in London.</p>
        <p>Specialising in creative direction, filmmaking and editing, his work combines a strong visual language with authentic, human-led storytelling.</p>
    `,
    contact: [
        { type: 'email-placeholder' },
        // { type: 'phone', text: '+44 7123 456 789', url: 'tel:+447123456789' },
    ],
    social: [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/adamjaro' },
        { name: 'Blog', url: '#blog' }
    ]
};



// Project Content
export const projects = [
    {
        title: 'The Pretender',
        category: 'Kooth x The Diana Award',
        thumbnail: '/images/thepretender.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>A UK-wide campaign supported by original data highlighting the number of young people hiding the fact that they are being bullied.</p>
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Scriptwriting and creative direction</li>
                        <li>Crew casting and production oversight</li>
                        <li>Talent partnership with Sylvia Young</li>
                    </ul>
                `
            },
            {
                type: 'youtube',
                id: 'LghkNyH47X4'
            },
            {
                type: 'text',
                body: `
                    <p>The Diana Award run a large-scale anti-bullying campaign annually. For this edition, we created a central film supported by national digital OOH and press activity. The work was picked up by multiple outlets, including a dedicated piece on ITV.</p>
                    <p>To create a piece that felt raw and authentic, free from gimmicks. Kooth&rsquo;s mission is to connect with young people in a real, unfiltered way, so the film focused on the emotional truth of the lead actor above all else.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>National reach via digital OOH and press distribution</li>
                        <li>Coverage across multiple major publications</li>
                        <li>Featured on ITV in a primetime segment</li>
                    </ul>
                `
            }
        ]
    },
    {
        title: 'Your Move',
        category: 'Kooth',
        thumbnail: '/images/yourmove1.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>A multi-platform, multi-asset UK campaign designed to cut through conventional mental wellbeing messaging and connect with young people in a bold, unexpected way.</p>
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Developed the creative strategy and campaign identity</li>
                        <li>Pushed for out-of-the-box branding to position Kooth as confident, relevant, and youth-first</li>
                        <li>Oversaw design and production across print, digital, merchandise, and experiential activations</li>
                    </ul>
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
                    <p>&ldquo;Your Move&rdquo; reimagined mental wellbeing outreach through bold graphics, direct language, and disruptive formats to capture young people&rsquo;s imagination,&nbsp;and more importantly, their attention.</p>
                    <p>Mental health campaigns often struggle to engage young audiences because the messaging feels generic or disconnected. The challenge was to create something fresh, visually striking, and authentic enough to resonate with teens while staying true to Kooth&rsquo;s mission.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Nationwide visibility across schools, digital platforms, and social media</li>
                        <li>Direct engagement with tens of thousands of students through print and experiential activations</li>
                        <li>Elevated Kooth&rsquo;s brand perception among young people as confident, relevant, and approachable</li>
                    </ul>
                `
            },
            {
                type: 'image',
                src: '/images/yourmove3.webp'
            }
        ]
    },
    {
        title: 'Here comes trouble',
        category: 'Trouble Club',
        thumbnail: '/images/herecomestrouble.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>As part of a wider visual refresh for The Trouble Club, a female-focused community and talks organisation - the aim was to inject buzz and energy into the brand, drawing in new members and appealing to a younger audience.</p>
                `
            },
            {
                type: 'vimeo',
                id: '1139979402'
            },
            {
                type: 'text',
                body: `
                    <p><strong>My Role:</strong></p>
                    <ul>
                        <li>Shaped the campaign concept and narrative approach</li>
                        <li>Directed shoots across multiple events to capture authentic energy and member stories</li>
                        <li>Oversaw editing and production of a suite of campaign assets for multi-channel use</li>
                    </ul>
                    <p>We filmed at three of The Trouble Club’s busiest events over several months, capturing the atmosphere, excitement, and community spirit. Member interviews highlighted the energy and inclusivity of the club, positioning it as a vibrant and relevant space for younger audiences.</p>
                    <p>The Trouble Club needed to modernise its image and speak to a younger audience without losing its established credibility. The challenge was to translate the vibrancy of its in-person events into a brand narrative that felt fresh, authentic, and digital-first.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Provided a refreshed, energetic visual identity across multiple digital touch points</li>
                        <li>Elevated brand appeal to younger audiences</li>
                        <li>Equipped The Trouble Club with versatile campaign assets for web, social, and marketing</li>
                    </ul>
                `
            },
            {
                type: 'image',
                src: '/images/herecomestrouble-2.webp'
            }
        ]
    },
    {
        title: 'Together, we create the amazing',
        category: 'Royal Albert Hall America',
        thumbnail: '/images/RAHA.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Royal Albert Hall America commissioned a promotional film to inspire and secure investment from US-based donors. The goal was to communicate the mission and cultural legacy of the Royal Albert Hall while creating a sense of magic and wonder to drive investor commitment.</p>
                `
            },
            {
                type: 'vimeo',
                id: '1139980503'
            },
            {
                type: 'text',
                body: `
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Developed the campaign strategy and narrative approach</li>
                        <li>Scripted the film to balance heritage storytelling with investor messaging</li>
                        <li>Directed production, combining archival footage from 150+ years of history with new material</li>
                        <li>Collaborated closely with the Royal Albert Hall America team to align messaging with fundraising goals</li>
                    </ul>
                    <p>The film served as a cornerstone piece for RAHA’s US fundraising activity. It wove together archival highlights, iconic performances, and a forward-looking message of impact to engage potential investors at an emotional and aspirational level. Tiered investment opportunities were seamlessly integrated into the narrative.</p>
                    <p>The challenge was to create a fundraising film that avoided feeling corporate or transactional. Instead, it needed to honour the cultural importance of the Royal Albert Hall, highlight its global influence, and build an emotional case for long-term investment.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Delivered a flagship film to support international fundraising efforts</li>
                        <li>Positioned the Royal Albert Hall as both historic and future-facing</li>
                        <li>Equipped RAHA with a versatile storytelling asset to engage high-value US investors</li>
                    </ul>
                `
            }
        ]
    },
    {
        title: 'The light show',
        category: 'British Soft Drinks Association',
        thumbnail: '/images/thelightshow.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>The British Soft Drinks Association wanted to highlight the health benefits of low- and no-sugar drinks compared to traditional soft drinks. The challenge: cut through scepticism and create engaging, shareable content that would resonate with younger audiences while supporting BSDA’s wider health messaging.</p>
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
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Led the overall creative direction of the campaign and event</li>
                        <li>Partnered with a PR agency to design and deliver a high-energy, interactive experience</li>
                        <li>Directed an on-site film crew to capture content for BSDA’s channels</li>
                        <li>Oversaw influencer briefing and content guidelines to ensure authenticity and brand alignment</li>
                    </ul>
                    <p>We hosted The Light Show, a one-day influencer event featuring ~30 creators at a bespoke venue packed with games and interactive installations. Influencers were encouraged to document their experiences organically on their own platforms, creating a ripple of authentic peer-to-peer content. Alongside this, our production team captured high-quality edits for BSDA’s owned channels.</p>
                    <p>The challenge was ensuring credibility in a sensitive conversation around health while keeping the tone playful and engaging enough to win over younger audiences. It required striking the right balance between branded messaging and influencer authenticity.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Delivered a sold-out influencer event with ~30 attendees and hundreds of organic posts</li>
                        <li>Generated strong positive engagement across influencer and BSDA-owned channels</li>
                        <li>Successfully reframed health messaging in a way that felt fun, shareable, and accessible</li>
                    </ul>
                `
            }
        ]
    },
    {
        title: 'London fashion week SS24',
        category: 'Emilia Wickstead',
        thumbnail: '/images/LFW24.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Luxury fashion brand Emilia Wickstead wanted their SS24 London Fashion Week showcase to stand out and create a lasting impression beyond the runway. The ambition was to host a live event that felt both exclusive and cinematic, while maximising global reach through live-streaming and digital content.</p>
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
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Directed the full film production of the SS24 show, including a multi-camera livestream to thousands of viewers</li>
                        <li>Oversaw creative and technical execution for both in-person and digital audiences</li>
                        <li>Produced multiple social-first edits and two versions of the full show (long and short form) for Emilia Wickstead’s owned channels</li>
                        <li>Worked closely with the client to align the film direction with their brand and collection vision</li>
                    </ul>
                    <p>We staged the show in a striking historic London venue, creating a unique atmosphere that elevated the presentation. The event ran across multiple days to allow for full setup and rehearsal, ensuring seamless execution on the day. The combination of live event direction and digital-first storytelling allowed Emilia Wickstead to extend the reach of their collection far beyond those in the room.</p>
                    <p>Fashion Week is crowded, competitive, and fast-paced. The challenge was to deliver a flawless livestream and suite of content that felt premium, aligned with Emilia Wickstead’s brand identity, and distinct from other LFW shows.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Live-streamed to thousands, amplifying reach beyond the live audience</li>
                        <li>Delivered a suite of social edits optimised for different platforms, boosting engagement</li>
                        <li>Received overwhelmingly positive feedback from both the client and attendees</li>
                        <li>Helped position Emilia Wickstead as a brand willing to innovate within the traditional LFW format</li>
                    </ul>
                `
            },
            {
                type: 'youtube',
                id: '6p-dCFqKph0'
            }
        ]
    },
    {
        title: 'Unwind',
        category: 'MindLabs',
        thumbnail: '/images/unwind.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>MindLabs, a mindfulness app, wanted to push beyond standard guided meditations and create immersive experiences that combined powerful visuals with bespoke sound design. The goal was to help users feel transported into new environments and connect more deeply with their practice.</p>
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
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Led the creative vision for two flagship series: Unwind (breathwork) and 5 Senses (meditation)</li>
                        <li>Developed and directed immersive audio-visual concepts to enhance the user experience</li>
                        <li>Collaborated with world-class sound artists to curate bespoke soundscapes</li>
                        <li>Directed remote-location shoots across striking natural settings, ensuring both technical and creative excellence</li>
                    </ul>
                    <p>Unwind: Filmed deep underground in a 300-year-old abandoned mine in Wales, blending visuals with soundscapes designed to create a sense of grounding and release.</p>
                    <p>Five Senses: Shot across remote natural environments, each meditation tied to a sensory theme, allowing users to experience the richness of sound and visuals as part of their practice.</p>
                    <p>Meditation content is often repetitive and formulaic. The challenge was to design experiences that felt innovative, immersive, and authentic while remaining accessible and calming for app users. This required balancing technical complexity (remote shoots, immersive soundscapes) with the simplicity and clarity essential to mindfulness content.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Elevated the quality and distinctiveness of MindLabs’ content library</li>
                        <li>Created a new benchmark for immersive meditation experiences in the wellness space</li>
                        <li>Helped the brand differentiate itself in a crowded market, resonating strongly with its audience</li>
                    </ul>
                `
            }
        ]
    },
    {
        title: 'Join the mental health revolution',
        category: 'MindLabs',
        thumbnail: '/images/mindlabs.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>To launch the MindLabs brand, app, and product, we needed a bold statement that would stand out in the crowded mental health and wellness space. The aim was to build hype, showcase the transformative potential of the app, and position MindLabs as the next-generation platform for mental wellbeing.</p>
                `
            },
            {
                type: 'youtube',
                id: '3hyFlY0MaPU'
            },
            {
                type: 'text',
                body: `
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Developed the core concept and narrative for the hero film</li>
                        <li>Directed the shoot, ensuring each story authentically reflected the product’s real-world impact</li>
                        <li>Oversaw production and post-production to deliver a premium, cinematic feel</li>
                        <li>Adapted the film into multiple cutdowns for performance marketing and social channels</li>
                    </ul>
                    <p>The hero film followed three different people, each using MindLabs in their daily lives. Through their stories, we highlighted the emotional and practical benefits of the app while keeping the visuals high-energy and contemporary to resonate with a digital-native audience.</p>
                    <p>The wellness space is saturated with generic, soft-focus content. The challenge was to break away from clichés and create something polished, modern, and relatable that would inspire trust while feeling fresh and exciting.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Served as the centrepiece of MindLabs’ brand launch, anchoring their marketing strategy</li>
                        <li>Delivered a premium, polished hero asset adaptable across channels</li>
                        <li>Used extensively in performance marketing campaigns, contributing to rapid brand awareness growth</li>
                        <li>Helped establish MindLabs’ reputation as a forward-thinking player in the mental wellbeing industry</li>
                    </ul>
                `
            }
        ]
    },
    {
        title: 'Bring the gym home',
        category: 'Fiit',
        thumbnail: '/images/bringthegymhome.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>During the first lockdown, demand for home fitness solutions surged almost overnight. Fiit needed to act fast to capture attention, build brand visibility, and drive signups while the market was exploding with new competition. The solution: a bold, national TV campaign with urgency at its core.</p>
                `
            },
            {
                type: 'youtube',
                id: 'TfCjyTuvBVE'
            },
            {
                type: 'text',
                body: `
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Developed the campaign concept and script to position Fiit as the go-to home fitness platform</li>
                        <li>Directed and produced the TVC under extremely tight time constraints (2 weeks from brief to delivery)</li>
                        <li>Oversaw editing and post-production to ensure a polished, broadcast-ready asset</li>
                        <li>Managed creative workflows with speed and agility, balancing quick turnaround with high production values</li>
                    </ul>
                    <p>“Bring the Gym Home” launched across national TV channels, emphasising Fiit’s ability to deliver the gym experience into people’s homes at a time when it mattered most. The ad showcased Fiit’s unique energy and modern design, helping it stand out in a rapidly saturating market.</p>
                    <p>Lockdown created both the opportunity and the pressure. We had just two weeks to script, shoot, edit, and deliver a national TVC — without compromising on creative quality. It required creative problem-solving, nimble production, and total focus.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Aired nationally for over three months, generating significant buzz and brand visibility</li>
                        <li>Contributed to a surge in signups during the peak of lockdown</li>
                        <li>Established Fiit as a leading digital-first fitness brand at a critical growth moment</li>
                    </ul>
                `
            }
        ]
    },
    {
        title: 'Hussle x Fiit',
        category: 'Hussle x Fiit',
        thumbnail: '/images/HusslexFiit.webp',
        content: [
            {
                type: 'text',
                body: `
                    <p>Fiit partnered with Hussle to expand access for users, enabling them to train with the Fiit app in any Hussle-affiliated gym. The objective was to raise awareness of the partnership while reinforcing Fiit’s core message: you can get fit with Fiit anywhere.</p>
                `
            },
            {
                type: 'youtube',
                id: '7Ol7shA_EYA'
            },
            {
                type: 'text',
                body: `
                    <p><strong>My role:</strong></p>
                    <ul>
                        <li>Conceptualised the campaign idea of one seamless workout sequence shot across different environments</li>
                        <li>Directed the hero film showcasing a Fiit workout in a Hussle gym, later replicated in a home and park setting</li>
                        <li>Oversaw production and post-production to ensure continuity and brand consistency across all assets</li>
                        <li>Delivered cutdowns and campaign assets optimised for social and digital channels</li>
                    </ul>
                    <p>The creative centred on a continuous workout sequence performed in multiple locations, visually emphasising Fiit’s flexibility across settings, from gyms to homes to outdoor spaces. This narrative gave the campaign a strong, repeatable structure that worked across partnership launches and Fiit’s own brand comms.</p>
                    <p>The key challenge was to create a campaign that worked both as a partnership announcement with Hussle and as a standalone piece of brand storytelling. It needed to feel fresh, energetic, and on-brand while easily adaptable for future use.</p>
                    <p><strong>Impact:</strong></p>
                    <ul>
                        <li>Successfully launched the Fiit x Hussle partnership, raising awareness among both user bases</li>
                        <li>Delivered a suite of multi-location assets with a clear, flexible creative framework</li>
                        <li>Reinforced Fiit’s brand positioning as the fitness app you can use anywhere</li>
                    </ul>
                `
            }
        ]
    },
];
