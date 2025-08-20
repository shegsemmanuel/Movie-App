# Movie App Deployment Guide

## Deploying to Vercel

### Method 1: Deploy from movie-app directory (Recommended)

1. **Navigate to the movie-app directory:**
   ```bash
   cd movie-app
   ```

2. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **Important:** Set the root directory to `movie-app` in the project settings
4. Framework preset should auto-detect as "Vite"
5. Build command: `npm run build`
6. Output directory: `dist`

### Environment Variables

Make sure to add your TMDB API key in Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add: `VITE_TMDB_API_KEY` with your actual API key value

### Troubleshooting

- If you get "No framework detected", make sure you're deploying from the `movie-app` directory
- Ensure the `vercel.json` file is in the `movie-app` directory
- Check that all dependencies are properly listed in `package.json`

## Local Development

```bash
cd movie-app
npm install
npm run dev
```

## Build for Production

```bash
cd movie-app
npm run build
npm run preview
```
