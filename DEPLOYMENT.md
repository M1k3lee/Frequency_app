# GitHub Pages Deployment Guide

This project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

## Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
1. Build the project when you push to `main`
2. Deploy the built files to GitHub Pages
3. Make your app available at: `https://M1k3lee.github.io/Frequency_app/`

## Manual Setup (First Time Only)

If this is your first time setting up GitHub Pages:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub: `https://github.com/M1k3lee/Frequency_app`
   - Click on **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
   - Save the settings

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the **Actions** tab in your GitHub repository
   - You should see the "Deploy to GitHub Pages" workflow running
   - Once it completes, your site will be live!

## Local Testing

To test the production build locally with the correct base path:

```bash
# Build with production settings
npm run build:gh-pages

# Preview the build
npm run preview
```

Or use a local server:

```bash
# Install a simple HTTP server if needed
npm install -g http-server

# Serve the dist folder
cd dist
http-server -p 8080
```

Then visit `http://localhost:8080/Frequency_app/` to test.

## Troubleshooting

### Site shows 404 or blank page
- Make sure GitHub Pages is enabled in repository settings
- Check that the base path in `vite.config.ts` matches your repository name
- Verify the workflow completed successfully in the Actions tab

### Assets not loading
- Ensure the base path is set correctly: `/Frequency_app/` (with trailing slash)
- Clear your browser cache
- Check the browser console for 404 errors

### Workflow fails
- Check the Actions tab for error messages
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version compatibility (18+)

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

## Notes

- The site will automatically rebuild and deploy on every push to `main`
- The build uses the production base path: `/Frequency_app/`
- All static assets (images, fonts, etc.) will work correctly with this setup

