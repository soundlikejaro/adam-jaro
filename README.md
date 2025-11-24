# Adam Jaro - Website Documentation

This website is built as a Static Site Generator (SSG). This means all pages are pre-built into HTML files, making the site very fast and SEO-friendly.

## How to Edit Content

### 1. Adding or Editing Projects
Open `src/data.js`. This file contains the list of all projects.
- **To add a project**: Copy an existing project block and paste it at the top of the list. Update the `title`, `category`, `thumbnail`, and `content` fields.
- **To edit a project**: Simply change the values in the corresponding project block.

### 2. Adding or Editing Blog Posts
Open `src/blog-data.js`.
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

1.  Open your terminal.
2.  Navigate to the project folder.
3.  Run the build command:
    ```bash
    npm run build
    ```
4.  This will regenerate all the HTML files in the root directory.
5.  You can now open `index.html` to see your changes.
