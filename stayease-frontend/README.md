# StayEase Frontend (React + Vite + Tailwind v4)

Production-ready UI for the StayEase accommodation management system. Aligns with the Spring Boot backend (JWT auth, role-based OWNER/USER) and matches all exposed REST endpoints.

## Prerequisites
- Node.js 18+
- Backend running at `http://localhost:8080` (default)

## Setup
```bash
cd stayease-frontend
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if backend URL differs
npm run dev            # http://localhost:5173
```

## Stack
- Vite (React + TypeScript)
- Tailwind CSS v4 (`@tailwindcss/vite`, no config file)
- React Router 7, TanStack Query, React Hook Form + Zod
- Axios client with JWT interceptor, role-based route guards
- UI: custom components (cards, badges, tables), react-hot-toast

## Key Paths
- `src/routes/router.tsx` – all routes, public + owner areas
- `src/auth` – auth context, protected route, token storage
- `src/api` – typed API client and endpoint wrappers
- `src/pages` – public pages (landing, search, property detail, auth)
- `src/pages/owner` – owner dashboard, properties, rooms/beds, bookings, inquiries (placeholder)

## Notes
- Demo accounts from backend seeder: `owner@test.com` / `password123`, `user@test.com` / `password123`
- Inquiry POST (`/inquiries`) is wired but backend controller is missing; UI shows a note if it fails.
- Auth: JWT stored in localStorage with global 401/403 handling (auto logout + redirect to `/login`).

## Scripts
- `npm run dev` – start dev server
- `npm run build` – type-check and build
- `npm run preview` – preview production build
