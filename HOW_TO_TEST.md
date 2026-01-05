# How to Test Your App

## Quick Test Steps

### 1. Wait for Deployment

After pushing changes, wait 2-3 minutes for Vercel to deploy:

- Go to: <https://vercel.com/dashboard>
- Select your project: `parrot-auction-listings`
- Check **Deployments** tab - wait for green checkmark ✅

### 2. Visit Your App

Open your browser and go to:

```text
https://parrot-auction-listings-ignas-s-projects.vercel.app
```

### 3. What You Should See

Since authentication is disabled, you should see:

- ✅ **Home page** loads immediately (no login screen)
- ✅ **Navigation menu** at the top
- ✅ **All pages accessible** without login

### 4. Test Each Feature

#### Test Home Page (`/`)

- Should load without errors
- Should show navigation links

#### Test Map Page (`/map`)

- Visit: `https://parrot-auction-listings-ignas-s-projects.vercel.app/map`
- Should show warehouse map
- May show empty if no Google Sheets data (this is normal)

#### Test Bins Page (`/bins`)

- Visit: `https://parrot-auction-listings-ignas-s-projects.vercel.app/bins`
- Should show list of bins
- May show "No bins found" if no Google Sheets data (this is normal)

#### Test Search Page (`/find`)

- Visit: `https://parrot-auction-listings-ignas-s-projects.vercel.app/find`
- Should show search interface

### 5. Test API Routes

Open browser console (F12) and check Network tab:

- `/api/bins` - Should return `{ bins: [] }` (empty if no data)
- `/api/zones` - Should return `{ warehouse: { w: 75, h: 50 }, zones: [] }`
- `/api/lots` - Should return `{ lots: [] }`

All should return **200 OK** (not 401 Unauthorized)

## Expected Behavior

### ✅ Working (No Auth)

- App loads without login screen
- All pages accessible
- API routes return data (or empty arrays)
- No authentication errors

### ⚠️ Normal (No Google Sheets)

- Empty data arrays (`bins: []`, `lots: []`)
- "No bins found" messages
- Map shows empty warehouse

This is **normal** if:

- Google Sheets not configured
- No data in Google Sheets
- Google Sheets API not accessible (no OAuth tokens)

## Troubleshooting

### Issue: Still seeing login screen

- **Fix**: Make sure latest deployment is live (check Vercel dashboard)
- Wait a few more minutes for deployment

### Issue: 404 errors

- **Fix**: Check Vercel dashboard for deployment status
- Make sure deployment completed successfully

### Issue: API returns 401

- **Fix**: This shouldn't happen now (auth is disabled)
- If it does, check that latest code is deployed

### Issue: Empty data everywhere

- **Fix**: This is normal if Google Sheets isn't configured
- To get real data, you need:
  - `GOOGLE_SHEET_ID` environment variable set
  - Google Sheets API access (requires OAuth or service account)

## Test Checklist

- [ ] App loads without login screen
- [ ] Home page (`/`) works
- [ ] Map page (`/map`) loads
- [ ] Bins page (`/bins`) loads
- [ ] Search page (`/find`) loads
- [ ] API routes return 200 (not 401)
- [ ] No console errors in browser (F12)

## Next Steps

Once you confirm the app works:

1. **If you want real data**: Configure Google Sheets and add OAuth
2. **If you want to keep it simple**: App works without data (shows empty states)
3. **If you want to add auth back**: I can help you set it up properly

## Quick Test Command

You can also test locally:

```bash
cd /Users/ignasgru/parrot-ops
npm run dev
```

Then visit: `http://localhost:3000`
