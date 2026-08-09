# DressMe deployment

DressMe is deployed as a Vite frontend on Vercel, an Express API on Render, and a Render PostgreSQL database.

## Backend (Render)

Set the Render service root directory to `DATABASE`.

- Build command: `npm ci && npm run build`
- Pre-deploy command: `npm run prisma:migrate:deploy`
- Start command: `npm run start`
- Health check path: `/api/health`

Set these environment variables in Render:

```env
DATABASE_URL=<Render PostgreSQL external connection string>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=<provided automatically by Render>
FRONTEND_URL=https://your-app.vercel.app,https://your-app-git-*.vercel.app
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

`FRONTEND_URL` accepts a comma-separated allowlist. Use a wildcard only for the preview URL pattern you control. Do not seed production with sample data unless that is intentional; the existing seed script is for development/demo data.

For local development, copy `DATABASE/.env.example` to `DATABASE/.env`, provide a local PostgreSQL `DATABASE_URL`, then run `npm run dev`. Use `npm run prisma:migrate` only for creating local development migrations.

## Frontend (Vercel)

Set the Vercel project root directory to `FRONTEND`.

- Build command: `npm run build`
- Output directory: `dist`

Set these environment variables for Production and Preview deployments:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=<cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned-upload-preset>
```

`FRONTEND/vercel.json` rewrites SPA routes to `index.html`, so direct visits and refreshes to pages such as `/wishlist`, `/cart`, and `/products/:slug` are served by React Router.

For local frontend development, create `FRONTEND/.env` with the local API URL and run `npm run dev`.

## Release checks

1. Run `npm run build` in both `DATABASE` and `FRONTEND`.
2. Confirm `GET https://<render-service>/api/health` returns HTTP 200.
3. Confirm the Render pre-deploy migration command completes before starting the API. The start command intentionally does not run migrations a second time.
4. Open a Vercel preview URL, sign in, and refresh a protected route such as `/wishlist`.
