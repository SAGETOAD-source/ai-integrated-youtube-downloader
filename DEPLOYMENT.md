# Deployment

Recommended simple setup:

- Backend: Render Web Service using `backend/Dockerfile`
- Frontend: Vercel static Vite app

## 1. Push To GitHub

Create a new GitHub repository and push this project folder.

## 2. Deploy Backend On Render

Create a Render Web Service from the GitHub repo.

- Runtime: Docker
- Root directory: `backend`
- Dockerfile path: `Dockerfile`
- Port: `8000`

Environment variables:

```text
FRONTEND_ORIGINS=https://your-frontend-url.vercel.app
OPENAI_API_KEY=your_key_here
```

`OPENAI_API_KEY` is optional. Without it, the app uses fallback analysis.

After deploy, test:

```text
https://your-backend-url.onrender.com/api/health
```

## 3. Deploy Frontend On Vercel

Import the same GitHub repo in Vercel.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Environment variable:

```text
VITE_API_BASE=https://your-backend-url.onrender.com
```

After the frontend deploys, copy the Vercel URL and add it to the backend `FRONTEND_ORIGINS` value on Render.

## Notes

Cloud platforms may block or rate-limit YouTube downloading from shared server IPs. Keep `yt-dlp` updated because YouTube changes frequently.
