# Admin UI Setup Guide

This blog now includes an admin interface for editing blog posts directly through the web interface. The admin UI connects to GitHub to update markdown files in the repository.

## Features

- 🔐 Secure authentication with JWT tokens
- 📝 Edit blog posts with markdown support
- 🔍 Search and filter posts
- 💾 Direct GitHub integration - changes are committed to the repository
- 🎨 Consistent styling with the blog theme

## Setup Instructions

### 1. Create Environment Variables

Create a `.env` file in the root of your project (use `.env.example` as a template):

```bash
cp .env.example .env
```

### 2. Configure Authentication

#### Generate Admin Password Hash

Use the included script to generate a bcrypt password hash:

```bash
node scripts/generate-password-hash.mjs your-secure-password
```

This will output the hash to add to your `.env` file.

Update `.env`:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<your-bcrypt-hash>
```

#### Generate JWT Secret

Generate a secure random string for JWT tokens:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `.env`:
```
ADMIN_JWT_SECRET=<your-secret-key>
```

### 3. Configure GitHub Access

Create a GitHub Personal Access Token with `repo` permissions:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Blog Admin UI")
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

Update `.env`:
```
GITHUB_TOKEN=<your-github-token>
GITHUB_OWNER=ekosup
GITHUB_REPO=ekosup.github.io
GITHUB_BRANCH=main
```

### 4. Test the Admin UI

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:4321/admin/login`

3. Login with your credentials

4. You should see the admin dashboard with a list of all blog posts

5. Click "Edit" on any post to edit its content

6. Make changes and click "Save Changes" to commit to GitHub

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong passwords** - The admin password should be complex and unique
3. **Keep JWT secret secure** - Rotate it periodically
4. **Rotate GitHub token** - If compromised, revoke and generate a new one
5. **HTTPS in production** - Always use HTTPS in production to protect credentials
6. **HTTP-only cookies** - The authentication uses HTTP-only cookies to prevent XSS attacks
7. **Token expiration** - JWT tokens expire after 24 hours for security

## Production Deployment

When deploying to production (e.g., GitHub Pages, Netlify, Vercel):

1. **Set environment variables** in your hosting platform's dashboard
2. **Do not include `.env` in your repository**
3. **Ensure HTTPS is enabled** (most modern hosts do this automatically)
4. **Test authentication** before making the site public

### GitHub Actions / CI/CD

If using GitHub Actions for deployment, add the environment variables as GitHub Secrets:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add each environment variable as a secret
3. Reference them in your workflow file

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter your username and password
3. You'll be redirected to the admin dashboard

### Editing a Post

1. From the dashboard, click "Edit" next to any post
2. Modify the markdown content in the editor
3. Optionally add a custom commit message
4. Click "Save Changes"
5. The changes will be committed directly to your GitHub repository

### Logging Out

Click the "Logout" button in the top-right corner of the admin dashboard.

## Troubleshooting

### "Unauthorized" Error
- Check that your `.env` file is properly configured
- Verify your username and password hash are correct
- Ensure JWT secret is set

### "Failed to fetch posts" Error
- Verify your GitHub token is valid and has `repo` permissions
- Check that the repository owner and name are correct
- Ensure the `src/content/blog` path exists in your repository

### Posts Not Updating
- Verify the GitHub token has write permissions
- Check the browser console for error messages
- Ensure you have the correct SHA (file version) when updating

## API Endpoints

The admin UI uses the following API endpoints:

- `POST /api/admin/login` - Authenticate user
- `POST /api/admin/logout` - Logout user
- `GET /api/admin/posts` - List all blog posts
- `GET /api/admin/posts/[filename]` - Get specific post content
- `PUT /api/admin/posts/[filename]` - Update post content

All endpoints except login require authentication via cookie.
