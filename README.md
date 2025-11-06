# Eko Supriyono's Blog

Hey there! 👋 This is the code behind my personal blog.
It's built with Astro and uses the AstroPaper theme as a base.
Here, I mostly write about web development, Django, data visualization, devops, and any topics I am interested in.

## Wanna run this locally?

Here's how you can get it running:

1. Clone the repository.
2. Install the dependencies: npm install
3. Start the dev server: npm run dev

## Admin UI for Content Management

This blog now includes an admin interface for editing posts directly through the web! 

📝 **Features:**
- Secure authentication with JWT tokens
- Edit markdown posts with live preview
- Direct GitHub integration - changes commit to the repository
- Search and filter posts

🔧 **Setup:**
See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed setup instructions.

**Quick start:**
1. Copy `.env.example` to `.env`
2. Generate a password hash: `node scripts/generate-password-hash.mjs your-password`
3. Create a GitHub Personal Access Token with `repo` permissions
4. Update `.env` with your credentials and token
5. Access the admin at `/admin/login`

## How it gets online

This site lives on GitHub Pages! Any changes pushed to the main branch should automatically trigger a new deployment (assuming the GitHub Actions workflow is set up!).

**Note:** The admin UI requires server-side rendering. For production deployment with admin features, consider hosting on platforms that support Node.js (Vercel, Netlify, Railway, etc.) or set up a separate server for the admin interface.
