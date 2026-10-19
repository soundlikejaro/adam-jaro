# Adam Jaro - Website Documentation

This website is built as a Static Site Generator (SSG). This means all pages are pre-built into HTML files, making the site very fast and SEO-friendly.

## How to Edit Content

### 1. Adding or Editing Projects
Open `src/data.js`. This file contains the list of all projects.
- **To add a project**: Copy an existing project block and paste it at the top of the list. Update the `title`, `category`, `thumbnail`, and `content` fields.
- **To edit a project**: Simply change the values in the corresponding project block.

### 2. Adding or Editing Blog Posts
The blog is currently switched off: with no posts, no `/blog/` pages are built. Open `src/blog-data.js` to add one (there's an example in the comments). To show the Blog link in the nav, uncomment it in `aboutInfo.social` in `src/data.js`.
- **To add a post**: Add a new object to the `blogPosts` array.
  ```javascript
  {
      title: 'New Post Title',
      date: '2025-11-25',
      content: [
          { type: 'text', body: '<p>Your content here...</p>' }
      ]
  }
  ```
- **To edit a post**: Modify the existing entries.

### 3. Updating Info / Bio
Open `src/data.js` and look for the `aboutInfo` object at the bottom. You can update the `bio`, `contact` details, and `social` links there.

## How to Publish Changes

After making changes to any file in the `src/` folder, you must **rebuild** the site for the changes to take effect.

1.  Open your terminal and go to the project folder.
2.  The first time only, install the build tools: `npm install`
3.  Run the build command:
    ```bash
    npm run build
    ```
4.  This regenerates all the HTML files in the root directory, plus:
    - `style.css`, compiled from Tailwind and `src/style.css` (edit `src/style.css`, never the root one)
    - resized copies of every image in `src/images` (`-640`, `-960`, `-1600`)
    - social share images in `images/og/`
    - `sitemap.xml`, `robots.txt`, `llms.txt` and `404.html`
5.  Commit and push. GitHub Pages serves the root folder.

New YouTube/Vimeo videos get their thumbnail downloaded into `src/images/video/` on the next build. To refresh a thumbnail, delete its file there and rebuild.

Each project in `src/data.js` has a short `kind` (e.g. `national TV ad`). It's used in page titles, structured data and `llms.txt`, so keep it plain and descriptive. An optional `award` field is added to the structured data.
