# Deployment Guide

## Frontend (Vercel/Netlify)
1. Import `traffic-congestion-app/frontend`.
2. Build command: `npm run build`
3. Output dir: `dist`
4. Env: `VITE_API_URL=<backend-public-url>`

## Backend (Render/Railway)
1. Deploy from `traffic-congestion-app/backend`.
2. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Install command: `pip install -r requirements.txt`
4. Persistent disk recommended for model/data files.

## Database
- Student local: SQLite (default)
- Production optional: PostgreSQL (Supabase/Neon)

## Model Artifacts
- Keep generated joblib files in persistent storage.
- Optional: retrain weekly via scheduled job.

## Environment Variables
- `VITE_API_URL`
- `PYTHONUNBUFFERED=1`

## Production Checklist
- Enable CORS origin restrictions
- Add API auth/token if public
- Add logging + monitoring
- Configure autosleep/warmup strategy on free tiers
