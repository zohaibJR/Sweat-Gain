# SweatnGain Deployment Guide

## Recommended Free Hosting

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas free tier

## 1. Backend on Render

- Push this project to GitHub.
- In Render, create a new `Web Service`.
- Connect your GitHub repo.
- Set `Root Directory` to `backend`.
- Build command: `npm install`
- Start command: `npm start`

Environment variables:

- `PORT=10000`
- `MONGO_URI=your MongoDB Atlas connection string`
- `JWT_SECRET=your long random secret`
- `ADMIN_EMAIL=your admin email`
- `ADMIN_PASSWORD=your admin password`
- `CORS_ORIGIN=https://sweat-gain.vercel.app`

After deploy, copy your backend URL, for example:

- `https://sweat-gain.onrender.com`

## 2. Frontend on Vercel

- In Vercel, create a new project from the same GitHub repo.
- Set `Root Directory` to `gymfitnessfrontend`.
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Environment variable:

- `VITE_API_URL=https://sweat-gain.onrender.com`

## 3. Important Note About Uploads

Payment screenshots are currently stored on the Render server filesystem in `backend/uploads`.
On Render free hosting, those uploaded files can disappear after restart or redeploy because the disk is ephemeral.

This means:

- the app will deploy and work
- uploaded screenshots are not permanently safe yet

For production, move image uploads to Cloudinary, ImageKit, Supabase Storage, or similar.

## 4. Local Development

Backend `.env`:

- copy `backend/.env.example` to `backend/.env`

Frontend `.env`:

- copy `gymfitnessfrontend/.env.example` to `gymfitnessfrontend/.env`

Run locally:

- backend: `npm start`
- frontend: `npm run dev`
