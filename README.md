# Maintenance & Spare Parts Tracking Module – UltraTech Cement (Hirmi)

Proof-of-concept internal tool for maintenance and inventory tracking at UltraTech Cement – Hirmi Cement Works. Simulates a small module inside a large industrial ERP.

## Tech Stack
- Frontend: React, Tailwind CSS, Axios, Recharts
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT (role-based: Supervisor, Technician, Store Manager)

## Project Structure
- `server/` Express API, Mongoose models, seed script
- `client/` React app (Vite), Tailwind UI

## Setup
1. Prerequisites: Node.js v18+, MongoDB (Atlas or local)
2. Environment:
   - Create `server/.env`:
     - `MONGODB_URI=mongodb://127.0.0.1:27017/ultratech_maintenance`
     - `JWT_SECRET=change_this_secret`
     - `PORT=5000`
3. Install:
   - API server:
     - `cd server`
     - `npm install`
4. Seed sample data:
   - `npm run seed`
5. Run:
   - `npm run dev` then open http://localhost:5000/ (frontend served statically from `server/public`)

## Seeded Accounts
- Supervisor: `supervisor@ultratech.com` / `password123`
- Technician: `technician@ultratech.com` / `password123`
- Store Manager: `store@ultratech.com` / `password123`

## Core Modules
- Equipment Management: CRUD for equipment; service interval and status
- Maintenance Logging: Create logs; updates equipment last maintenance date; consumes spares
- Spare Parts Inventory: Add/update parts; reorder levels; stock management
- Alerts: Low stock and maintenance due
- Dashboard & Analytics: Summary cards, monthly activity chart, usage trends

## API Endpoints
- Auth:
  - `POST /auth/login`
- Equipment:
  - `GET /equipment`
  - `POST /equipment` (Supervisor)
  - `PUT /equipment/:id` (Supervisor)
- Maintenance:
  - `GET /maintenance` (Technician sees own logs, others see all)
  - `POST /maintenance` (Technician, Supervisor)
  - `PUT /maintenance/:id/approve` (Supervisor)
- Spares:
  - `GET /spares`
  - `POST /spares` (Store Manager, Supervisor)
  - `PUT /spares/:id` (Store Manager, Supervisor)
- Alerts:
  - `GET /alerts` (low stock, maintenance due, summary)

## Notes
- Security: Do not commit real secrets. Replace JWT secret and use Atlas in production.
- Frontend is a single static page (React via CDN) for simplicity; no Vite or build step.
- This module is intentionally minimal and focused on maintenance workflows and inventory.
