// Lab: coding side projects. The /lab/ page is built but deliberately hidden:
// it isn't linked anywhere, it's marked noindex, and it's left out of
// sitemap.xml and llms.txt. To launch it, see the LAB_PUBLIC flag in build.js.
//
// Each project:
//   name       Project name
//   tagline    One line, shown under the name
//   type       'Game' | 'Tool' (used by the filter at the top of the page)
//   status     'Live' | 'In progress' | 'Prototype'
//   url        Optional link to try it (code stays private, so no repo links)
//   urlLabel   Text for that link
//   image      Optional screenshot in src/images (e.g. '/images/lab-flauna.webp'); a gradient tile shows if empty
//   video      Optional looping clip in src/media (e.g. '/media/lab-flauna.mp4'); `image` is its still frame
//   body       A short paragraph or two (HTML)
//   builtWith  List of tools/tech

// Intro paragraphs at the top of the Lab page (HTML)
export const labIntro = `
    <p>Things I make outside the day job, built around what I'm into: music and synths, film and video, nature, camping and cycling.</p>
    <p>Some fix a problem in my own workflow, like Clam Sync, which syncs a shoot's footage so I don't have to. Others turn an interest into a small daily game. I design and code them all with Claude Code, and most start with the same question: could I make that?</p>
`;

export const labProjects = [
    {
        name: 'Flauna',
        tagline: 'Daily flora & fauna trivia',
        type: 'Game',
        status: 'Live',
        url: 'https://flauna.app',
        urlLabel: 'Play Flauna',
        image: '/images/lab-flauna.webp',
        video: '/media/lab-flauna.mp4',
        body: `
            <p>One species a day, the same for everyone. Five questions (what, where, who, when and why), then a result to share. Each question you answer adds a layer to a pixel-art woodland behind the game, until the scene is complete.</p>
            <p>I designed and built all of it: the game, the animated scene, a small admin panel for scheduling species, and a backend that keeps tomorrow's answers hidden.</p>
        `,
        builtWith: ['JavaScript', 'Cloudflare Workers', 'Claude Code'],
    },
    {
        name: 'FM synth',
        tagline: 'A daily puzzle on a four-track FM synth',
        type: 'Game',
        status: 'In progress',
        url: '',
        urlLabel: '',
        image: '/images/lab-fm.webp',
        body: `
            <p>A pocket synth with four tracks: bass, keys, lead and drums. Every day there's a new puzzle, the same for everyone: a tempo and three rules about the shape, sound and placement of your pattern, checked live as you play. Or skip the puzzle, make something in free mode and share it with a link.</p>
            <p>I designed and built the whole thing: the FM synth engine and its sound editor, a touch-first piano roll, the daily puzzles, and short share links that open straight into your pattern.</p>
        `,
        builtWith: ['TypeScript', 'Web Audio', 'Cloudflare Workers', 'Claude Code'],
    },
    {
        name: 'Clam Sync',
        tagline: 'Drop a folder, get a synced timeline',
        type: 'Tool',
        status: 'In progress',
        url: '',
        urlLabel: '',
        image: '/images/lab-clamsync.webp',
        body: `
            <p>A Mac and Windows app for video editors. Drop in a shoot's footage and it lines up every camera and sound recorder by matching their audio, then exports a synced timeline for Premiere Pro, DaVinci Resolve, Final Cut Pro or Avid. Clips are colour-coded by how they were placed, so you can see at a glance what to check.</p>
            <p>I'm an editor, not a developer. I built it to replace PluralEyes on my own shoots, and it's grown into a full product, made for real shoots: hundreds of clips over several days, cameras with their clocks set wrong, and audio that drifts.</p>
        `,
        builtWith: ['Python', 'FFmpeg', 'Qt', 'Claude Code'],
    },
];
