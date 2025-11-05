# AWS Deployment Guide for WorkFloww Frontend

## Architecture Overview
- **Source**: GitHub Repository
- **Build**: AWS CodeBuild (using buildspec.yml)
- **Storage**: S3 Bucket (`workfloww-frontend-app`)
- **CDN** (Optional): CloudFront for global distribution

---

## Option 1: Direct S3 Static Website Hosting (Simple)

### Step 1: Configure S3 Bucket

1. **Enable Static Website Hosting**
   ```
   Bucket: workfloww-frontend-app
   Properties → Static website hosting → Enable
   Index document: index.html
   Error document: index.html (for React Router)
   ```

2. **Disable Block Public Access**
   ```
   Permissions → Block public access → Edit
   Uncheck: Block all public access
   Save changes → Type "confirm"
   ```

3. **Apply Bucket Policy**
   ```json
   Use: s3-bucket-policy.json
   Permissions → Bucket policy → Edit → Paste policy → Save
   ```

4. **Website URL**
   ```
   http://workfloww-frontend-app.s3-website-<region>.amazonaws.com
   ```

### Step 2: Update buildspec.yml for S3 Deployment

Add deployment commands to buildspec.yml:

```yaml
post_build:
  commands:
    - echo "Build finished on `date`"
    - echo "Deploying to S3..."
    - aws s3 sync dist/ s3://workfloww-frontend-app --delete
    - aws s3 cp s3://workfloww-frontend-app/index.html s3://workfloww-frontend-app/index.html --metadata-directive REPLACE --cache-control max-age=0 --content-type text/html
    - echo "Deployment completed!"
```

### Step 3: Configure CodeBuild IAM Role

Add S3 permissions to CodeBuild service role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::workfloww-frontend-app",
        "arn:aws:s3:::workfloww-frontend-app/*"
      ]
    }
  ]
}
```

---

## Option 2: S3 + CloudFront (Production Recommended)

### Benefits
- ✅ HTTPS support with SSL certificate
- ✅ Global CDN for faster loading
- ✅ Custom domain support
- ✅ Better caching control
- ✅ DDoS protection

### Step 1: Configure S3 Bucket (Private)

1. **Keep S3 bucket private** (no public access needed)
2. **Apply CloudFront bucket policy** (use `cloudfront-s3-policy.json`)
   - Replace `YOUR_AWS_ACCOUNT_ID` with your AWS account ID
   - Replace `YOUR_DISTRIBUTION_ID` after creating CloudFront distribution

### Step 2: Create CloudFront Distribution

1. **Go to CloudFront Console** → Create distribution

2. **Origin Settings**
   ```
   Origin domain: workfloww-frontend-app.s3.amazonaws.com
   Origin access: Origin access control (OAC)
   Create new OAC
   ```

3. **Default Cache Behavior**
   ```
   Viewer protocol policy: Redirect HTTP to HTTPS
   Allowed HTTP methods: GET, HEAD, OPTIONS
   Cache policy: CachingOptimized
   ```

4. **Settings**
   ```
   Price class: Use all edge locations (best performance)
   Alternate domain names (CNAME): app.workfloow.com (optional)
   Custom SSL certificate: Request or import certificate (if using custom domain)
   Default root object: index.html
   ```

5. **Error Pages** (Important for React Router!)
   ```
   Create custom error response:
   - HTTP error code: 403
   - Response page path: /index.html
   - HTTP response code: 200

   Create another:
   - HTTP error code: 404
   - Response page path: /index.html
   - HTTP response code: 200
   ```

### Step 3: Update S3 Bucket Policy

After creating CloudFront distribution:
1. Copy the distribution ARN
2. Update `cloudfront-s3-policy.json` with your account ID and distribution ID
3. Apply the policy to S3 bucket

### Step 4: Update buildspec.yml for CloudFront

```yaml
post_build:
  commands:
    - echo "Build finished on `date`"
    - echo "Deploying to S3..."
    - aws s3 sync dist/ s3://workfloww-frontend-app --delete
    - echo "Invalidating CloudFront cache..."
    - aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
    - echo "Deployment completed!"
```

### Step 5: Configure CodeBuild IAM Role

Add CloudFront permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::workfloww-frontend-app",
        "arn:aws:s3:::workfloww-frontend-app/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

---

## Environment Variables in CodeBuild

Set these in CodeBuild project:

### Development Environment
```
VITE_API_BASE_URL=https://api.dev.workfloow.app
VITE_API_TIMEOUT=30000
```

### Production Environment
```
VITE_API_BASE_URL=https://api.workfloow.app
VITE_API_TIMEOUT=30000
```

---

## Complete CI/CD Pipeline

### Workflow:
1. **Developer pushes code** → GitHub repository
2. **CodeBuild triggers** → Runs buildspec.yml
3. **Build process**:
   - Install dependencies (`npm ci`)
   - Run linting (`npm run lint`)
   - Build production bundle (`npm run build`)
   - Deploy to S3 (`aws s3 sync`)
   - Invalidate CloudFront cache (if using CloudFront)
4. **Application live** → Users access via CloudFront URL or custom domain

---

## Custom Domain Setup (Optional)

### If using CloudFront with custom domain:

1. **Request SSL Certificate** (AWS Certificate Manager)
   ```
   Region: us-east-1 (required for CloudFront)
   Domain: app.workfloow.com
   Validation: DNS validation
   ```

2. **Add DNS Records** (Route 53 or your DNS provider)
   ```
   Type: CNAME or A (Alias)
   Name: app.workfloow.com
   Value: d111111abcdef8.cloudfront.net (your CloudFront domain)
   ```

3. **Update CloudFront Distribution**
   ```
   Alternate domain names: app.workfloow.com
   Custom SSL certificate: Select your ACM certificate
   ```

---

## Cache Control Best Practices

### For index.html (never cache):
```bash
aws s3 cp s3://workfloww-frontend-app/index.html \
  s3://workfloww-frontend-app/index.html \
  --metadata-directive REPLACE \
  --cache-control max-age=0,no-cache,no-store,must-revalidate \
  --content-type text/html
```

### For assets (long cache):
```bash
aws s3 sync dist/assets/ s3://workfloww-frontend-app/assets/ \
  --cache-control max-age=31536000,public
```

---

## Troubleshooting

### React Router 404 Issues
- Ensure error document is set to `index.html` in S3
- Add CloudFront error responses (403/404 → /index.html)

### CORS Issues
- Configure CORS in S3 bucket if needed
- Check API CORS settings for your domain

### Build Failures
- Check CodeBuild logs for specific errors
- Verify environment variables are set
- Ensure IAM roles have correct permissions

---

## Security Checklist

- ✅ Enable HTTPS (CloudFront with ACM certificate)
- ✅ Set proper CORS policies
- ✅ Use Origin Access Control (OAC) for S3 + CloudFront
- ✅ Enable CloudFront WAF for DDoS protection (optional)
- ✅ Set secure cache headers
- ✅ Keep S3 bucket private (if using CloudFront)

---

## Cost Estimation

### S3 Only (Minimal)
- Storage: ~$0.023 per GB/month
- Data transfer: ~$0.09 per GB (first 10 TB)
- Estimated: ~$5-10/month for small app

### S3 + CloudFront (Recommended)
- CloudFront: ~$0.085 per GB data transfer
- Free tier: 1 TB data transfer per month for first 12 months
- Estimated: ~$10-30/month after free tier

### CodeBuild
- Free tier: 100 build minutes per month
- After: $0.005 per build minute
- Estimated: ~$0-5/month for small teams

---

## Quick Start Commands

### Deploy manually to S3:
```bash
npm run build
aws s3 sync dist/ s3://workfloww-frontend-app --delete
```

### Invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Test website:
```bash
# S3 static website
curl http://workfloww-frontend-app.s3-website-us-east-1.amazonaws.com

# CloudFront
curl https://d111111abcdef8.cloudfront.net
```
