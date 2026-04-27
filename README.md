# Number Community – Tech Stack Overview

## Core Technologies

- **Frontend Framework**: React 19 (Vite)
- **Frontend Language**: TypeScript
- **Frontend Styling**: Tailwind CSS
- **Data Fetching**: TanStack React Query
- **Frontend State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Backend Runtime**: Node.js + Express
- **Backend Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Neon-ready)
- **Validation**: Zod
- **Authentication**: JWT + bcryptjs

---

### 3. Data & Auth Flow

- Register/Login endpoints return token + user data
- JWT token is attached from frontend store via Axios interceptor
- Protected routes are guarded with backend auth middleware
- Server validates request payloads using Zod
- Prisma handles persistence and DB queries

---

## Key Features

- **Community-by-Numbers Thread**: Users start numeric discussions and post operation-based replies (`add`, `sub`, `mul`, `div`)
- **Nested Tree Preview**: Discussion thread is rendered as a hierarchical calculation tree
- **Auth UX**: Login/register modal, success/error toasts, persisted session, and reload-based sync
- **User-Friendly Messaging**: Action-focused labels and clear API error handling on both client and server

---

## Run Locally

### 1) Install Dependencies

```bash
# root (if needed)
npm install

# client
cd client
npm install

# server
cd ../server
npm install
```

### 2) Start Development Servers

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

### 3) Build

```bash
# client build
cd client
npm run build

# server build
cd ../server
npm run build
```

---

## Environment Notes

- Set backend `.env` values before running:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `PORT` (optional)
- Frontend can use:
  - `VITE_API_BASE_URL` (defaults to `http://localhost:3000`)
