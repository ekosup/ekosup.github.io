# Deployment Guide

This guide explains how to deploy the blog with the admin UI on different hosting platforms.

## Important Note

The admin UI requires **server-side rendering (SSR)** to function. This means:

- ✅ **Static blog pages** can be deployed to GitHub Pages (as before)
- ❌ **Admin UI** requires a Node.js server and cannot run on GitHub Pages
- 🔄 **Hybrid approach**: Deploy static pages to GitHub Pages, admin UI to a Node.js platform

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent support for Astro with zero configuration.

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Astro

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`:
     - `ADMIN_JWT_SECRET`
     - `ADMIN_USERNAME`
     - `ADMIN_PASSWORD_HASH`
     - `GITHUB_TOKEN`
     - `GITHUB_OWNER`
     - `GITHUB_REPO`
     - `GITHUB_BRANCH`

3. **Deploy**
   - Click "Deploy"
   - Your site will be live with both static pages and admin UI

**Advantages:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available
- Preview deployments for PRs

### Option 2: Netlify

Similar to Vercel, Netlify has great Astro support.

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.example`

4. **Deploy**
   - Netlify will build and deploy your site

**Advantages:**
- Easy setup
- Automatic HTTPS
- Form handling
- Free tier available

### Option 3: Railway

Railway is excellent for Node.js applications.

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Create a new project from GitHub repo

2. **Add Environment Variables**
   - In Railway dashboard, add variables from `.env.example`

3. **Deploy**
   - Railway will automatically detect and deploy

**Advantages:**
- Simple Node.js hosting
- Built-in database support if needed
- $5 free credit per month

### Option 4: Self-Hosted (VPS)

For complete control, deploy to your own server.

**Requirements:**
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt)

**Steps:**

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Start the server**
   ```bash
   node dist/server/entry.mjs
   ```

3. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start dist/server/entry.mjs --name blog
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:4321;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 5: Hybrid Deployment (GitHub Pages + Separate Admin)

Keep static blog on GitHub Pages, deploy admin UI separately.

**Static Blog (GitHub Pages):**
1. Remove the admin pages from the build
2. Keep `output: "static"` in `astro.config.ts`
3. Deploy as usual to GitHub Pages

**Admin UI (Separate):**
1. Create a separate project with just admin pages
2. Deploy to Vercel/Netlify/Railway
3. Configure CORS if needed

This approach keeps your blog on GitHub Pages (free, fast) while admin UI runs on a Node.js platform.

## Environment Variables Setup

For any deployment, you'll need:

### 1. Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Generate Password Hash
```bash
node scripts/generate-password-hash.mjs your-secure-password
```

### 3. Create GitHub Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy the token

### 4. Set Environment Variables
Add these to your hosting platform:
```
ADMIN_JWT_SECRET=<your-jwt-secret>
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<your-password-hash>
GITHUB_TOKEN=<your-github-token>
GITHUB_OWNER=ekosup
GITHUB_REPO=ekosup.github.io
GITHUB_BRANCH=main
```

## Security Checklist

Before deploying to production:

- [ ] Change default admin username and password
- [ ] Use a strong JWT secret (32+ random characters)
- [ ] Keep GitHub token secure (never commit it)
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set appropriate rate limits if available
- [ ] Review GitHub token permissions (only `repo` needed)
- [ ] Consider IP whitelist for admin access
- [ ] Regularly rotate credentials

## Testing Before Deployment

1. **Test locally**
   ```bash
   npm run build
   npm run preview
   ```

2. **Test authentication**
   - Visit `/admin/login`
   - Login with credentials
   - Verify dashboard loads

3. **Test GitHub integration**
   - Try editing a post
   - Verify changes commit to GitHub
   - Check commit appears in repository

## Troubleshooting

### "Failed to fetch posts" Error
- Verify `GITHUB_TOKEN` is set correctly
- Check token has `repo` permissions
- Verify repository owner/name are correct

### "Unauthorized" on Login
- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` are set
- Verify password hash was generated correctly
- Check JWT secret is set

### Build Fails
- Ensure Node.js 18+ is installed
- Run `npm install` to install all dependencies
- Check for TypeScript errors with `npm run astro check`

### Admin Pages 404
- Verify `output: "hybrid"` in `astro.config.ts`
- Check adapter is installed: `@astrojs/node`
- Ensure `prerender = false` is set on admin pages

## Performance Considerations

- Static pages are served from CDN (fast)
- Admin pages run server-side (slower but necessary)
- GitHub API has rate limits (60 requests/hour unauthenticated, 5000 with token)
- Consider caching post list if needed

## Cost Estimates

- **Vercel**: Free tier includes 100GB bandwidth, then $20/month
- **Netlify**: Free tier includes 100GB bandwidth, then $19/month
- **Railway**: $5 free credit/month, then $10-20/month
- **VPS**: $5-10/month for basic server
- **GitHub Pages**: Always free (for static content only)

## Recommendation

For most users, **Vercel** is the best choice:
- Zero configuration
- Generous free tier
- Excellent performance
- Automatic deployments
- Preview URLs for testing

For users wanting to keep GitHub Pages, use the **Hybrid Deployment** approach.
