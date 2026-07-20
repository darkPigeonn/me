# Atanasiu.dev

Portfolio + admin writings (tulisan) for Atanasiu Ivannoel.

## Setup

```bash
npm install
cp .env.example .env
# Edit ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET in .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin login (buat tulisan)

1. Buka [/admin/login](http://localhost:3000/admin/login)
2. Login dengan kredensial di `.env` (default: `admin` / `changeme123`)
3. Buat / edit / hapus tulisan
4. Centang **Publikasikan** agar muncul di [/tulisan](http://localhost:3000/tulisan)

Posts are saved to `data/posts.json`. Commit that file after publishing so writings stay on Vercel/production.

## Scripts

- `npm run dev` — development
- `npm run build` / `npm start` — production build
