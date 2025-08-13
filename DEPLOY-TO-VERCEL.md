# 🚀 How to Deploy to Vercel

Your LED Cost Calculator is ready to deploy! Here's how:

## Method 1: GitHub + Vercel (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "LED Cost Calculator ready for deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"New Project"**
3. **Import** your GitHub repository
4. Vercel will automatically detect it's a static site
5. Click **"Deploy"**
6. **Done!** Your app will be live in seconds

## Method 2: Direct Upload (Alternative)

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Drag and drop your project folder
4. Click **"Deploy"**

## Your Files Are Ready ✅

- `index.html` - Main calculator app
- `styles.css` - Beautiful styling
- `script.js` - All functionality
- `vercel.json` - Deployment config (already set up)

## What You'll Get

🌐 **Custom Domain**: `your-app-name.vercel.app`  
⚡ **Lightning Fast**: Instant loading  
📱 **Mobile Ready**: Works on all devices  
🔒 **HTTPS**: Secure by default  
🔄 **Auto Updates**: Push to GitHub = instant deploy

## Test Locally First

```bash
# Open in browser to test
open index.html
```

## Need Help?

- Vercel has amazing docs: [vercel.com/docs](https://vercel.com/docs)
- Free tier includes everything you need
- No build process required - pure HTML/CSS/JS

Your calculator will be live at: `https://your-project-name.vercel.app` 🎉
