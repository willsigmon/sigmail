# ⚡ Vercel Deployment - Quick Start

## 🎉 Your Code is on GitHub!

✅ **Repository**: https://github.com/willsigmon/sigmail
✅ **All fixes pushed and ready**
✅ **Vercel configuration in place**

---

## 🚀 Deploy to Vercel (5 Minutes)

### Step 1: Import Project (2 minutes)

1. **Visit**: https://vercel.com/new
2. **Sign in** with your GitHub account
3. **Import Git Repository**:
   - Search for: `willsigmon/sigmail`
   - Click **Import**

### Step 2: Configure Build (1 minute)

Vercel should auto-detect everything, but verify:

```
Framework Preset: Other
Root Directory: ./
Build Command: pnpm build
Output Directory: dist/public
Install Command: pnpm install
```

**Click "Deploy"** - Don't add environment variables yet!

### Step 3: Add Environment Variables (2 minutes)

After first deploy, go to **Settings** → **Environment Variables** and add:

#### Required Variables:
```bash
# Database (REQUIRED)
DATABASE_URL=mysql://user:pass@host:3306/sigmail

# JWT Secret (REQUIRED - generate one below)
JWT_SECRET=your-super-secret-key-here

# OAuth (REQUIRED)
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
```

#### Generate JWT Secret:
```bash
# Run this locally:
openssl rand -base64 32
# Copy the output as JWT_SECRET
```

#### Optional Variables:
```bash
# AI Features (optional)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=

# Owner (optional)
OWNER_OPEN_ID=
```

### Step 4: Redeploy

After adding env vars:
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"**
5. Click **Redeploy**

---

## 🗄️ Set Up Production Database

### Option 1: PlanetScale (Recommended - Free)

1. **Sign up**: https://planetscale.com
2. **Create database**: `sigmail`
3. **Get connection string**:
   - Go to database → Connect
   - Select "Node.js" 
   - Copy the connection string
4. **Add to Vercel**:
   ```
   DATABASE_URL=mysql://xxxx@yyy.us-east-3.psdb.cloud/sigmail?ssl={"rejectUnauthorized":true}
   ```

### Option 2: TiDB Cloud (Free Tier)

1. **Sign up**: https://tidbcloud.com
2. **Create cluster** (Serverless Tier - Free)
3. **Get connection string**
4. **Add to Vercel**

### Option 3: Railway MySQL

1. **Sign up**: https://railway.app
2. **New Project** → **Add MySQL**
3. **Copy connection string**
4. **Add to Vercel**

---

## 🔐 Configure OAuth for Production

1. **Go to your Manus OAuth app settings**
2. **Add production redirect URI**:
   ```
   https://your-app.vercel.app/api/oauth/callback
   ```
   Replace `your-app` with your actual Vercel domain

3. **Your Vercel domain** is shown in deployments (e.g., `sigmail-xyz.vercel.app`)

---

## ✅ Initialize Production Database

After Vercel deploys:

```bash
# 1. Get your production DATABASE_URL from Vercel
# 2. Add it to local .env temporarily
echo "DATABASE_URL=mysql://your-prod-db-url" >> .env

# 3. Push schema to production
pnpm db:push

# 4. Remove production URL from local .env
# (or keep it for managing prod data)
```

---

## 🧪 Test Your Deployment

### 1. Homepage
```bash
curl https://your-app.vercel.app/
# Should return HTML
```

### 2. API Health
```bash
curl https://your-app.vercel.app/api/trpc/auth.me
# Should return: {"result":{"data":{"json":null}}}
```

### 3. OAuth Login
1. Visit your Vercel URL
2. Try logging in
3. Should redirect to Manus OAuth
4. After login, redirects back

---

## 📊 Monitor Deployment

### Vercel Dashboard Tabs:

- **Deployments**: See all deployments and their status
- **Logs**: Real-time function logs
- **Analytics**: Traffic and performance
- **Settings**: Environment variables and domains

### Check Function Logs:
1. Go to **Deployments** → Click your deployment
2. Click **Functions** tab
3. Click on any function (e.g., `api/trpc`)
4. View real-time logs

---

## 🔄 Continuous Deployment

Every push to `main` auto-deploys! 🎉

```bash
# Make changes
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys new version
# 4. Updates production URL
```

---

## 🐛 Common Issues

### Build Fails

**Error**: `Command "pnpm build" failed`

**Fix**:
- Check environment variables are set
- Verify `pnpm-lock.yaml` is in repo
- Check build logs for specific error

### API Returns 404

**Error**: API endpoints return 404

**Fix**:
- Verify `api/` folder exists in repo
- Check `vercel.json` routing is correct
- Redeploy after changes

### Database Connection Fails

**Error**: `Failed to connect to database`

**Fix**:
- Verify `DATABASE_URL` is correct
- Check database allows external connections
- For PlanetScale: ensure SSL is in connection string
- Test connection string locally first

### OAuth Fails

**Error**: Redirect doesn't work

**Fix**:
- Check redirect URI in Manus matches exactly
- Verify `VITE_APP_ID` is correct in Vercel
- Check `JWT_SECRET` is set
- Look at function logs for errors

---

## 🎯 Production Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Initial deployment successful
- [ ] Environment variables added
- [ ] Redeployed with env vars
- [ ] Production database set up
- [ ] Database schema pushed
- [ ] OAuth redirect URI updated
- [ ] Homepage loads
- [ ] API responds
- [ ] Login works

---

## 💡 Pro Tips

### Custom Domain
1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `sigmail.com`)
3. Update DNS as instructed
4. SSL auto-configured

### Preview Deployments
- Every branch gets its own URL
- Perfect for testing features
- Format: `sigmail-git-branch-name.vercel.app`

### Environment Variables per Branch
- Set different values for:
  - **Production** (main branch)
  - **Preview** (PR branches)
  - **Development** (local)

### Speed Up Builds
- Enable **Turbo** in project settings
- Use build cache (enabled by default)
- Parallelize build steps

---

## 🚀 Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add VITE_APP_ID production

# Pull env vars locally (optional)
vercel env pull
```

---

## 📱 After Deployment

### Share Your App
Your app is live at:
```
https://your-app.vercel.app
```

### Monitor Performance
- **Analytics**: Vercel dashboard
- **Logs**: Function logs in real-time
- **Uptime**: 99.99% guaranteed by Vercel

### Scale Automatically
- Serverless functions auto-scale
- No server management needed
- Pay only for what you use

---

## 🎉 You're Live!

**Your SigMail app is now:**
- ✅ Deployed on Vercel
- ✅ Auto-deploying from GitHub
- ✅ Running serverless functions
- ✅ Serving static frontend
- ✅ Connected to production database
- ✅ OAuth configured

**Next**: Build features and push to deploy! 🚀

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Your GitHub**: https://github.com/willsigmon/sigmail
- **Dashboard**: https://vercel.com/dashboard
- **Support**: https://vercel.com/support

---

**Ready to deploy? Go to: https://vercel.com/new** 🎯

