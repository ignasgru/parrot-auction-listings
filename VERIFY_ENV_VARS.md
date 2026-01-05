# Verify Environment Variables Are Set

## How to Check if Environment Variables Are Connected

### Step 1: Check Vercel Dashboard

1. Go to: <https://vercel.com/dashboard>
2. Click on your project: `parrot-auction-listings`
3. Go to **Settings** → **Environment Variables**
4. **Look for these 5 variables**:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_SHEET_ID`

### Step 2: Verify Each Variable

For each variable, check:

- ✅ Does it exist in the list?
- ✅ Are the values correct (not empty)?
- ✅ Are all checkboxes checked (Production, Preview, Development)?

### Step 3: If Variables Are Missing

If you don't see all 5 variables:

1. Click **Add New**
2. Add each variable one by one
3. Make sure to check all environments
4. Click **Save** for each

### Step 4: If Variables Exist But Still Not Working

1. **Check the values**:
   - Click on each variable to see its value
   - Make sure there are no extra spaces
   - Make sure values match exactly

2. **Redeploy**:
   - Go to **Deployments** tab
   - Click **3 dots** (⋯) → **Redeploy**
   - Wait 2-3 minutes

3. **Check if redeploy picked up variables**:
   - After redeploy, check the deployment logs
   - Look for any errors

## Common Issues

### Issue: Variables Not Set

- **Symptom**: OAuth error `invalid_client`
- **Fix**: Add all 5 environment variables in Vercel

### Issue: Variables Set But Not Applied

- **Symptom**: Still getting errors after setting variables
- **Fix**: Redeploy after adding variables (variables only apply to new deployments)

### Issue: Wrong Values

- **Symptom**: OAuth error or other errors
- **Fix**: Double-check values match exactly (no typos, no extra spaces)

### Issue: Variables Not Checked for All Environments

- **Symptom**: Works in one environment but not another
- **Fix**: Make sure Production, Preview, and Development are all checked

## Quick Test

After setting variables and redeploying:

1. Visit your Vercel URL
2. You should see "Sign in with Google" button
3. Click it - if it works, variables are set correctly
4. If you get `invalid_client` error, variables are not set or wrong

## Still Not Working?

If you've verified variables are set but still getting errors:

1. **Share what you see**:
   - Do you see all 5 variables in Vercel?
   - What are the values (first few characters)?
   - Did you redeploy after adding them?

2. **Check Google Cloud Console**:
   - Does the OAuth Client ID exist?
   - Is the redirect URI added?

3. **Check deployment logs**:
   - Go to Vercel → Deployments → Latest deployment → Logs
   - Look for any errors
