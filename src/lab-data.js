// Lab: coding side projects. The /lab/ page is built but deliberately hidden:
// it isn't linked anywhere, it's marked noindex, and it's left out of
// sitemap.xml and llms.txt. To launch it, see the LAB_PUBLIC flag in build.js.
//
// Each project:
//   name       Project name
//   tagline    One line, shown under the name
//   status     'Live' | 'In progress' | 'Prototype'
//   url        Optional link to try it (code stays private, so no repo links)
//   urlLabel   Text for that link
//   image      Optional screenshot in src/images (e.g. '/images/lab-flauna.webp'); a gradient tile shows if empty
//   video      Optional looping clip in src/media (e.g. '/media/lab-flauna.mp4'); `image` is its still frame
//   body       A short paragraph or two (HTML)
//   builtWith  List of tools/tech

export const labIntro = 'Things I build outside the day job: small tools and daily games, designed and coded with Claude Code.';

export const labProjects = [
    {
        name: 'Flauna',
        tagline: 'Daily flora & fauna trivia',
        status: 'Live',
        url: 'https://flauna.app',
        urlLabel: 'Play Flauna',
        image: '/images/lab-flauna.webp',
        video: '/media/lab-flauna.mp4',
        body: `
            <p>One species a day, the same for everyone. Five questions (what, where, who, when and why), then a result to share. Each question you answer adds a layer to a pixel-art woodland behind the game, until the scene is complete.</p>
            <p>I designed and built all of it with Claude Code: the game, the animated scene, a small admin panel for scheduling species, and a backend that keeps tomorrow's answers hidden.</p>
        `,
        builtWith: ['JavaScript', 'Cloudflare Workers', 'Claude Code'],
    },
    {
        name: 'FM synth',
        tagline: '[Working title] A daily game built around an FM synth',
        status: 'In progress',
        url: '',
        urlLabel: '',
        image: '',
        body: `
            <p>[Placeholder] What the game is and how you play it.</p>
            <p>[Placeholder] What I designed and built.</p>
        `,
        builtWith: ['[Placeholder]', 'Claude Code'],
    },
    {
        name: 'Clam Sync',
        tagline: 'Drop a folder, get a synced timeline',
        status: 'In progress',
        url: '',
        urlLabel: '',
        image: '/images/lab-clamsync.webp',
        body: `
            <p>A Mac and Windows app for video editors. Drop in a shoot's footage and it lines up every camera and sound recorder by matching their audio, then exports a synced timeline for Premiere Pro, DaVinci Resolve, Final Cut Pro or Avid. Clips are colour-coded by how they were placed, so you can see at a glance what to check.</p>
            <p>I'm an editor, not a developer. I built it to replace PluralEyes on my own shoots, with Claude Code, and it's grown into a product with its own brand: hundreds of clips over several days, cameras with their clocks set wrong, and drifting audio.</p>
        `,
        builtWith: ['Python', 'FFmpeg', 'Qt', 'Claude Code'],
    },
];
