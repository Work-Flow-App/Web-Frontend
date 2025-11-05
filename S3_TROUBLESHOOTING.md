# S3 White Screen Troubleshooting Guide

## Problem: White screen when accessing S3 website

This is a common issue with React apps deployed to S3. Here are the solutions:

---

## Solution 1: Check S3 Static Website Configuration ✅

### Step 1: Verify S3 Static Website Hosting is enabled

1. Go to **S3 Console** → `workfloww-frontend-app` bucket
2. Go to **Properties** tab
3. Scroll to **Static website hosting**
4. Ensure it's **Enabled**
5. **IMPORTANT**: Set both to `index.html`:
   ```
   Index document: index.html
   Error document: index.html  ← This is critical for React Router!
   ```

### Step 2: Check the Website Endpoint URL

The URL should look like:
```
http://workfloww-frontend-app.s3-website-<region>.amazonaws.com
```

**NOT** the regular S3 object URL:
```
https://s3.amazonaws.com/workfloww-frontend-app/index.html  ← WRONG
```

---

## Solution 2: Rebuild with Correct Base Path ✅

I've already added `base: '/'` to your vite.config.ts. Now rebuild:

```bash
npm run build
```

Then check the `dist/` folder:
- `index.html` should exist
- `assets/` folder should contain JS and CSS files

---

## Solution 3: Check Browser Console

Open your browser's Developer Tools (F12) and check for errors:

### Common Error 1: Failed to load resource
```
Failed to load resource: /assets/index-xxx.js
```

**Fix**: Ensure `base: '/'` is set in vite.config.ts (already done)

### Common Error 2: CORS error
```
Access to script at 'https://...' has been blocked by CORS policy
```

**Fix**: Add CORS configuration to S3 bucket:

1. Go to S3 Console → `workfloww-frontend-app`
2. Go to **Permissions** tab
3. Scroll to **Cross-origin resource sharing (CORS)**
4. Click **Edit** and add:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### Common Error 3: Blank page, no errors
This usually means assets are loading but something in your code is failing silently.

**Fix**: Check your environment variables. Ensure you deployed with:
```
VITE_API_BASE_URL=https://api.dev.workfloow.app
VITE_API_TIMEOUT=30000
```

---

## Solution 4: Verify Build Output

After running `npm run build`, check the `dist/index.html`:

```bash
# Windows PowerShell
Get-Content dist/index.html

# Or open in editor
code dist/index.html
```

It should look like:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Floow - WorkFlow Management</title>
    <script type="module" crossorigin src="/assets/index-xxx.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-xxx.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Notice the paths:
- ✅ `/assets/index-xxx.js` (relative path starting with `/`)
- ❌ `assets/index-xxx.js` (missing `/`)
- ❌ `./assets/index-xxx.js` (don't use `./`)

---

## Solution 5: Upload Files Correctly to S3

### Method A: Using AWS CLI (Recommended)
```bash
aws s3 sync dist/ s3://workfloww-frontend-app --delete
```

### Method B: Using AWS Console
1. Delete all files in the bucket first
2. Upload the **contents** of the `dist/` folder (not the dist folder itself)
3. File structure should be:
   ```
   workfloww-frontend-app/
   ├── index.html
   ├── vite.svg
   └── assets/
       ├── index-xxx.js
       ├── index-xxx.css
       └── floow_logo-xxx.svg
   ```

**WRONG structure** (dist folder uploaded):
```
workfloww-frontend-app/
└── dist/
    ├── index.html
    └── assets/
```

---

## Solution 6: Check File Permissions

All files must be readable:

```bash
# Set public read on all files
aws s3 sync dist/ s3://workfloww-frontend-app --acl public-read
```

Or verify bucket policy is applied (from `s3-bucket-policy.json`).

---

## Solution 7: Clear Browser Cache

Sometimes your browser caches the broken version:

1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select **"Empty Cache and Hard Reload"**

Or:
- Chrome/Edge: Ctrl + Shift + Delete → Clear cached images and files
- Firefox: Ctrl + Shift + Delete → Clear cache

---

## Solution 8: Test Locally First

Before deploying, test the production build locally:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` and ensure the app works. If it works locally but not on S3, the issue is with S3 configuration.

---

## Solution 9: Check Asset Paths in Built Files

Open `dist/index.html` and verify the paths:

```bash
# Check asset references
cat dist/index.html | grep -E "src=|href="
```

Should output:
```html
<script type="module" crossorigin src="/assets/index-CuD69Kdj.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-BQoTYPBv.css">
```

If you see relative paths without leading `/`, rebuild with the fixed vite.config.ts.

---

## Solution 10: Enable CloudFront (If Using)

If you're using CloudFront, you need custom error responses:

1. Go to **CloudFront Console** → Your distribution
2. Go to **Error Pages** tab
3. Create custom error response:
   - **HTTP Error Code**: 403
   - **Error Caching Minimum TTL**: 0
   - **Customize Error Response**: Yes
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: 200

4. Create another for 404:
   - **HTTP Error Code**: 404
   - **Error Caching Minimum TTL**: 0
   - **Customize Error Response**: Yes
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: 200

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Static website hosting is enabled on S3 bucket
- [ ] Error document is set to `index.html`
- [ ] Bucket policy allows public read (`s3:GetObject`)
- [ ] Files uploaded to root of bucket (not inside a `dist/` folder)
- [ ] Built with `base: '/'` in vite.config.ts
- [ ] Browser console shows no errors (F12)
- [ ] Using the static website endpoint URL (not object URL)
- [ ] Cleared browser cache
- [ ] App works with `npm run preview` locally

---

## Testing Your Deployment

### Test 1: Check if index.html loads
```bash
curl http://workfloww-frontend-app.s3-website-<region>.amazonaws.com
```

Should return HTML content.

### Test 2: Check if assets load
```bash
curl http://workfloww-frontend-app.s3-website-<region>.amazonaws.com/assets/index-xxx.js
```

Should return JavaScript content.

### Test 3: Check React Router paths
```bash
curl http://workfloww-frontend-app.s3-website-<region>.amazonaws.com/login
```

Should return the same `index.html` (not 404).

---

## Still Having Issues?

### Enable S3 Access Logging

1. Create a logging bucket: `workfloww-frontend-app-logs`
2. Enable server access logging on `workfloww-frontend-app`
3. Check logs for 403/404 errors

### Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for red (failed) requests
5. Click on failed requests to see the error

Common issues:
- **404**: File not uploaded or wrong path
- **403**: Bucket policy not applied
- **CORS**: Need CORS configuration

---

## Final Step: Rebuild and Redeploy

With the fixed vite.config.ts:

```bash
# Clean old build
rm -rf dist/

# Build with proper configuration
npm run build

# Deploy to S3
aws s3 sync dist/ s3://workfloww-frontend-app --delete --acl public-read

# Verify deployment
curl http://workfloww-frontend-app.s3-website-<region>.amazonaws.com
```

Your app should now load correctly! 🎉
