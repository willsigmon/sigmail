# 🚀 Deploy SigMail to Vercel

## Quick Fix: GitHub Email Privacy Issue

GitHub is blocking the push due to email privacy settings. Two options:

### Option 1: Temporarily Disable Email Privacy (Fastest - 2 minutes)
1. Go to https://github.com/settings/emails
2. Uncheck "Block command line pushes that expose my email"
3. Push again: `git push origin main`
4. Re-enable the setting after push

### Option 2: Force Push with Correct Email (3 minutes)
```bash
# Get your GitHub no-reply email
# Format: YOUR_ID+username@users.noreply.github.com
# Find it at: https://github.com/settings/emails

# Set it locally for this repo
git config user.email "YOUR_GITHUB_ID+willsigmon@users.noreply.github.com"

# Amend and push
git commit --amend --reset-author --no-edit
git push origin main
```

---

## After GitHub Push Succeeds

### Step 1: Create Vercel Project

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**
   - Connect your GitHub account
   - Select `willsigmon/sigmail`
3. **Configure Project**:
   - Framework Preset: **Other**
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`
   - Install Command: `pnpm install`

### Step 2: Set Environment Variables

In Vercel project settings, add these:

```bash
# Required
DATABASE_URL=your-mysql-connection-string
JWT_SECRET=your-secure-random-secret
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Optional (for AI features)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=

# Owner (optional)
OWNER_OPEN_ID=
```

**IMPORTANT**: For production database, use a cloud provider:
- **PlanetScale** (recommended): https://planetscale.com
- **TiDB Cloud**: https://tidbcloud.com
- **Railway MySQL**: https://railway.app

### Step 3: Update OAuth Redirect

1. Go to your Manus OAuth app settings
2. Add production redirect URI:
   ```
   https://your-app.vercel.app/api/oauth/callback
   ```

### Step 4: Deploy!

Click **Deploy** in Vercel. It will:
1. Install dependencies with `pnpm`
2. Build frontend with Vite
3. Bundle backend with esbuild
4. Deploy serverless functions

### Step 5: Initialize Database

After first deploy:
```bash
# Set DATABASE_URL in .env locally
DATABASE_URL=your-production-db-url

# Push schema
pnpm db:push
```

---

## Vercel Configuration (Already Set Up)

Your `vercel.json` is configured:
```json
{
  "buildCommand": "pnpm install && pnpm build",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

API routes automatically work:
- `/api/trpc/*` → `api/trpc/index.ts` (serverless function)
- `/api/oauth/callback` → `api/oauth/callback.ts` (serverless function)

---

## Verify Deployment

After deployment:

### 1. Check Homepage
```bash
curl https://your-app.vercel.app/
# Should return HTML
```

### 2. Check API
```bash
curl https://your-app.vercel.app/api/trpc/auth.me
# Should return: {"result":{"data":{"json":null}}}
```

### 3. Test OAuth
1. Visit `https://your-app.vercel.app`
2. Click login (if you added login button)
3. Should redirect to Manus OAuth
4. After login, redirects back to your app

---

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify `pnpm-lock.yaml` is committed
- Check build logs in Vercel dashboard

### API Not Working
- Verify serverless functions deployed (check Functions tab)
- Check `/api/trpc` and `/api/oauth/callback` exist
- Review function logs in Vercel

### OAuth Fails
- Verify `VITE_APP_ID` is correct
- Check redirect URI matches in Manus OAuth settings
- Ensure `JWT_SECRET` is set

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Test connection string locally first

---

## Continuous Deployment

Once set up, every push to `main` automatically deploys! 🎉

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
# Vercel auto-deploys!
```

---

## Alternative: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set env vars
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add VITE_APP_ID
```

---

## Production Checklist

- [ ] GitHub push succeeds
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Production database set up
- [ ] OAuth redirect URI updated
- [ ] Initial deployment succeeds
- [ ] Database schema pushed
- [ ] Homepage loads
- [ ] API responds
- [ ] OAuth login works

---

## Quick Commands

```bash
# Push to GitHub
git push origin main

# Deploy to Vercel (if using CLI)
vercel --prod

# Check deployment
curl https://your-app.vercel.app/api/trpc/auth.me

# View logs
vercel logs
```

---

**Your project is Vercel-ready! Just fix the GitHub push and deploy! 🚀**

