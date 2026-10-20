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
        image: '',
        body: `
            <p>[Placeholder] What Flauna is, who it's for and how a daily round works.</p>
            <p>[Placeholder] What I designed and built, and anything interesting about how.</p>
        `,
        builtWith: ['[Placeholder]', 'Claude Code'],
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
        name: 'Clam sync',
        tagline: 'A tool for syncing video and audio',
        status: 'In progress',
        url: '',
        urlLabel: '',
        image: '',
        body: `
            <p>[Placeholder] The problem it solves and who it's for.</p>
            <p>[Placeholder] What I designed and built.</p>
        `,
        builtWith: ['[Placeholder]', 'Claude Code'],
    },
];
