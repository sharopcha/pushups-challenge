# GitHub Secrets Setup - Quick Reference

Add these **5 secrets** to your GitHub repository for automated deployment:

## How to Add Secrets

1. Go to: https://github.com/sharopcha/pushups-challenge/settings/secrets/actions
2. Click **"New repository secret"** for each one below

---

## Required Secrets

### 1. VERCEL_TOKEN
**What**: Your Vercel API token for deployments  
**Where to get it**:
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: "GitHub Actions"
4. Copy the token

**Value**: `vercel_xxxxxxxxxxxxxxxxxxxxx`

---

### 2. VERCEL_ORG_ID
**What**: Your Vercel organization/account ID  
**Where to get it**:
```bash
# Run in your project directory:
npx vercel link
cat .vercel/project.json
```
Look for `"orgId"` in the output

**Value**: `team_xxxxxxxxxxxxx` or `user_xxxxxxxxxxxxx`

---

### 3. VERCEL_PROJECT_ID
**What**: Your Vercel project ID  
**Where to get it**:
```bash
# Same as above:
cat .vercel/project.json
```
Look for `"projectId"` in the output

**Value**: `prj_xxxxxxxxxxxxx`

---

### 4. NEXT_PUBLIC_SUPABASE_URL
**What**: Your **production** Supabase project URL  
**Where to get it**:
1. Go to https://supabase.com/dashboard
2. Select your **production** project (not local!)
3. Settings → API
4. Copy "Project URL"

**Value**: `https://xxxxxxxxxxxxx.supabase.co`

⚠️ **Important**: This should be your cloud/production Supabase, NOT `http://127.0.0.1:54321`

---

### 5. NEXT_PUBLIC_SUPABASE_ANON_KEY
**What**: Your **production** Supabase anonymous/public key  
**Where to get it**:
1. Same location as above (Settings → API)
2. Copy "anon/public" key

**Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)

⚠️ **Important**: This is the **anon** key, not the service_role key!

---

## Verification Checklist

After adding all secrets, verify:
- [ ] All 5 secrets are added to GitHub
- [ ] Supabase URL starts with `https://` (not `http://127.0.0.1`)
- [ ] Supabase anon key is a long JWT token
- [ ] Vercel project is linked (`npx vercel link` completed)
- [ ] You also added Supabase vars to Vercel dashboard (Settings → Environment Variables)

---

## What Happens Next?

Once you push to GitHub:
1. GitHub Actions workflow starts
2. It uses these secrets to:
   - Authenticate with Vercel
   - Deploy your app
   - Set Supabase environment variables
3. Your app goes live at `https://pushups-challenge.vercel.app` (or similar)

---

## Still Need Help?

See the full deployment guide for step-by-step instructions!
