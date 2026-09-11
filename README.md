<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/36d57a27-4cb9-4744-b9e0-776b02271e56

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Pages deployment

This project is configured for a **public GitHub repository** and GitHub Pages. No secret files are included in the repository.

1. Create a new public repository on GitHub.
2. Upload the contents of this project (not the outer ZIP folder).
3. Push to the `main` branch.
4. In GitHub, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
5. The included workflow will build and publish the site automatically.

For a custom domain, configure it in GitHub Pages settings.
