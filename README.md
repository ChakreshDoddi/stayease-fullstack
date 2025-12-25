StayEase
========

Full-Stack PG/Hostel Booking & Management Platform

StayEase is a full-stack accommodation platform for PG/hostel-style rentals (similar to dorms in concept, but for private listings with rooms and beds). It helps users discover stays and book a specific bed, and helps owners manage properties, rooms, beds, and booking workflows.

Why this project?
-----------------
Many PG/hostel owners still manage availability using WhatsApp/Excel. That creates confusion and inconsistent availability. StayEase solves this by making beds the source of truth, so bookings update real inventory and availability stays accurate.

Key Features
------------

User features
- Browse featured properties
- Search with filters (city, rent range, etc.)
- View property details, rooms, and availability
- Create bookings (reserves a specific bed)
- View booking history

Owner features
- Create/update properties
- Create rooms under a property
- Auto-generate beds (B1, B2, B3...) when a room is created
- View bookings and update booking lifecycle: PENDING -> CONFIRMED -> CHECKED_IN -> CHECKED_OUT
- Prevents invalid transitions

Core design decision
- Beds are the source of truth. Instead of storing only "room has 3 beds", the system stores bed records like B1, B2, B3. Bookings reserve a specific bed and availability is recalculated at room/property level.

Tech Stack
----------

Frontend
- React + TypeScript (Vite)
- Tailwind CSS
- Axios (API client)

Backend
- Java 21 + Spring Boot
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- MySQL

Repository Structure
- stayease-frontend/  # React + TypeScript UI
- stayease-backend/   # Spring Boot REST API + MySQL

Quick Start (Local Setup)
-------------------------

Prerequisites
- Java 21
- Node.js 18+
- MySQL 8+

1) Backend Setup (Spring Boot)

Step 1 - Create database
```sql
CREATE DATABASE stayease_db;
```

Step 2 - Configure DB credentials
- Update this file: `stayease-backend/src/main/resources/application.yml`.
- Important: do not commit real passwords/secrets. Use your local credentials. See `application.yml.example` for a template.

Step 3 - Run backend
```bash
cd stayease-backend
./mvnw spring-boot:run
```

Backend runs on: http://localhost:8080

2) Frontend Setup (React)

Step 1 - Configure environment
```bash
cd stayease-frontend
cp .env.example .env
```

Make sure `.env` has:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

Step 2 - Install and run
```bash
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

Demo Accounts (Auto-seeded)
- User:  user@test.com  / password123
- Owner: owner@test.com / password123
- Admin: admin@test.com / admin123

API Reference
- See: `stayease-frontend/API_DOCUMENTATION.md`

Optional: Seed More Demo Data
- Scripts are in: `stayease-backend/scripts/`

Example (requires an OWNER JWT token):
```bash
node scripts/seed-demo.js --base http://localhost:8080 --token <OWNER_JWT> --count 50
```

To get the OWNER token:
- Login using owner@test.com / password123
- Copy the accessToken from the login response
- Use it as `--token` in the script command

Notes / Current Limitations
- Frontend has an inquiry submission flow, but backend inquiry endpoints may be incomplete depending on the branch/state.
- Swagger/OpenAPI config exists, but swagger dependency may need to be added for UI.

Production Improvements (Next Steps)
- Docker Compose for one-command setup (frontend + backend + MySQL)
- Move secrets/config to environment variables
- Add locking/transactions to prevent double-booking under concurrency
- Add unit + integration tests (booking transitions, search filters)
- Add Swagger/OpenAPI fully for easier API testing

Author
- Chakresh Doddi
