# ✅ Deployment Checklist - SigMail

## Status: Ready to Deploy! 🚀

---

## ✅ Completed (Local)

- [x] Fixed all TypeScript errors
- [x] Created production build configuration
- [x] Added Vercel serverless functions
- [x] Configured routing for Vercel
- [x] Created comprehensive documentation
- [x] Pushed all code to GitHub
- [x] Local dev server working (http://localhost:3003)

---

## 📋 Deploy to Vercel (Do This Now!)

### Step 1: Import to Vercel (2 min)
- [ ] Go to https://vercel.com/new
- [ ] Sign in with GitHub
- [ ] Click "Import Git Repository"
- [ ] Select: `willsigmon/sigmail`
- [ ] Click "Import"

### Step 2: Configure (1 min)
- [ ] Framework: **Other** (should auto-detect)
- [ ] Build Command: `pnpm build` (auto-set)
- [ ] Output Dir: `dist/public` (auto-set)
- [ ] Click **"Deploy"** (without env vars for now)

### Step 3: Wait for Build (2 min)
- [ ] Watch build logs
- [ ] Should complete successfully
- [ ] Note your deployment URL: `sigmail-xyz.vercel.app`

---

## 🔧 Configure Environment (Do This Second!)

### Step 4: Add Environment Variables (5 min)

Go to: **Project Settings** → **Environment Variables**

#### Required Variables:

```bash
# 1. Database (use PlanetScale for free tier)
DATABASE_URL=mysql://user:pass@host:3306/sigmail

# 2. JWT Secret (generate with command below)
JWT_SECRET=<your-generated-secret>

# 3. OAuth (from Manus)
VITE_APP_ID=<your-manus-app-id>
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

#### Add These Variables:
- [ ] `DATABASE_URL`
- [ ] `JWT_SECRET`
- [ ] `VITE_APP_ID`
- [ ] `OAUTH_SERVER_URL`
- [ ] `VITE_OAUTH_PORTAL_URL`

### Step 5: Redeploy (1 min)
- [ ] Go to **Deployments** tab
- [ ] Click **"..."** on latest
- [ ] Click **"Redeploy"**
- [ ] Wait for completion

---

## 🗄️ Set Up Database (Do This Third!)

### Option A: PlanetScale (Recommended - Free)

1. Sign up: https://planetscale.com
   - [ ] Create account
   - [ ] Create database: `sigmail`
   - [ ] Get connection string
   - [ ] Add to Vercel as `DATABASE_URL`

### Option B: TiDB Cloud (Free)

1. Sign up: https://tidbcloud.com
   - [ ] Create serverless cluster
   - [ ] Get connection string
   - [ ] Add to Vercel

### Option C: Railway (Simple)

1. Sign up: https://railway.app
   - [ ] Create MySQL database
   - [ ] Copy connection string
   - [ ] Add to Vercel

---

## 🔐 Configure OAuth (Do This Fourth!)

### Step 6: Update Manus OAuth App

1. Go to Manus OAuth settings
   - [ ] Find your OAuth app
   - [ ] Add production redirect URI:
     ```
     https://your-app.vercel.app/api/oauth/callback
     ```
   - [ ] Replace `your-app` with actual Vercel domain
   - [ ] Save changes

---

## 🚀 Initialize Production Database (Do This Fifth!)

### Step 7: Push Database Schema

```bash
# 1. Temporarily add production DB URL to local .env
echo "DATABASE_URL=<your-production-db-url>" >> .env

# 2. Push schema to production
pnpm db:push

# 3. Verify it worked
# Should see: "✓ Changes applied"
```

- [ ] Add production `DATABASE_URL` to local `.env`
- [ ] Run `pnpm db:push`
- [ ] Verify 15 tables created
- [ ] Remove production URL from local `.env` (optional)

---

## ✅ Verify Deployment (Final Check!)

### Step 8: Test Production

#### A. Test Homepage
```bash
curl https://your-app.vercel.app/
```
- [ ] Returns HTML (200 OK)

#### B. Test API
```bash
curl https://your-app.vercel.app/api/trpc/auth.me
```
- [ ] Returns: `{"result":{"data":{"json":null}}}`

#### C. Test OAuth
- [ ] Visit your Vercel URL in browser
- [ ] Click login (if you have login UI)
- [ ] Redirects to Manus OAuth
- [ ] After login, redirects back to your app
- [ ] User is logged in

---

## 🎉 Success Criteria

All these should be ✅:

- [ ] ✅ Code on GitHub
- [ ] ✅ Deployed to Vercel
- [ ] ✅ Environment variables set
- [ ] ✅ Database created
- [ ] ✅ Schema pushed
- [ ] ✅ OAuth configured
- [ ] ✅ Homepage loads
- [ ] ✅ API responds
- [ ] ✅ Can log in

---

## 🔄 Continuous Deployment Setup

### It's Already Working! 🎉

Every push to `main` auto-deploys:

```bash
# Make changes
git add .
git commit -m "feat: cool new feature"
git push origin main

# Vercel automatically:
# ✓ Detects push
# ✓ Runs build
# ✓ Deploys
# ✓ Updates live site
```

---

## 📊 Monitor Your Deployment

### Vercel Dashboard

**Check these tabs:**
- [ ] **Overview** - Deployment status
- [ ] **Deployments** - All deployments
- [ ] **Logs** - Real-time function logs
- [ ] **Analytics** - Traffic stats
- [ ] **Settings** - Configuration

**Watch for:**
- ✅ Green checkmark = deployed
- ⏳ Yellow = building
- ❌ Red = failed (check logs)

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Vercel build fails

**Check**:
- [ ] All env vars are set
- [ ] `pnpm-lock.yaml` is in repo
- [ ] Build logs for errors

**Fix**: Redeploy after fixing

### API 404s

**Issue**: `/api/trpc` returns 404

**Check**:
- [ ] `api/` folder exists in GitHub
- [ ] `vercel.json` is correct
- [ ] Functions tab shows functions

**Fix**: Verify files pushed, redeploy

### Database Won't Connect

**Issue**: Can't connect to database

**Check**:
- [ ] `DATABASE_URL` is correct
- [ ] Database allows external connections
- [ ] SSL configured (for PlanetScale)

**Fix**: Test connection locally first

### OAuth Redirect Fails

**Issue**: OAuth doesn't redirect back

**Check**:
- [ ] Redirect URI exact match in Manus
- [ ] `VITE_APP_ID` is correct
- [ ] `JWT_SECRET` is set
- [ ] Check function logs

**Fix**: Update redirect URI, redeploy

---

## 🎯 Quick Reference

**Your URLs:**
- Local: http://localhost:3003
- GitHub: https://github.com/willsigmon/sigmail
- Vercel: https://your-app.vercel.app

**Key Commands:**
```bash
# Deploy via Git
git push origin main

# Test API locally
./test-api.sh

# Push DB schema
pnpm db:push

# Build locally
pnpm build
```

**Documentation:**
- Quick Start: `VERCEL_QUICKSTART.md`
- Full Guide: `DEPLOY_TO_VERCEL.md`
- Dev Guide: `DEV_GUIDE.md`
- Start Here: `START_HERE.md`

---

## 💡 Pro Tips

1. **Test Locally First**
   - Always run `pnpm build` locally
   - Verify it works before pushing

2. **Use Preview Deployments**
   - Create feature branches
   - Each gets its own URL
   - Perfect for testing

3. **Monitor Logs**
   - Check function logs regularly
   - Catch errors early
   - Debug faster

4. **Keep Secrets Secret**
   - Never commit `.env` files
   - Use Vercel env vars
   - Rotate secrets regularly

---

## 🎉 You're All Set!

**Everything is ready:**
- ✅ Code fixed and tested
- ✅ Pushed to GitHub
- ✅ Documentation complete
- ✅ Vercel configuration ready
- ✅ Deployment guide available

**Next action:**
👉 **Go to https://vercel.com/new and deploy!** 👈

---

**Time to make it live! 🚀**

