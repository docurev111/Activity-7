# Flowdesk (Activity 7) — Task Management System

Flowdesk is a simple full‑stack app for managing **projects**, **tasks**, and **users**. Tasks belong to projects, are assigned to users, and have a **deadline** and **status** (To Do / In Progress / Completed).

## Tech

- Backend: NestJS + TypeScript + TypeORM + SQLite
- Frontend: React + Vite + Axios
- API Docs: Swagger at `/api`

## Run it

### 1) Backend

```bash
cd backend
npm install
npm run start:dev
```

API: http://localhost:3000
Swagger: http://localhost:3000/api

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: http://localhost:5173

## Notes

- The frontend includes **Light/Dark mode** (theme toggle in the header).
- SQLite DB file is created automatically on first run.
