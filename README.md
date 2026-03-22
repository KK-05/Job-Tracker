# 🚀 JobTracker AI — AI-Powered Job Application Tracker

A full-stack SaaS application for tracking job applications, managing resumes, getting AI-powered resume feedback, and viewing analytics on your job search.

![Tech Stack](https://img.shields.io/badge/Next.js-black?logo=next.js) ![Express](https://img.shields.io/badge/Express-000?logo=express) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **JWT Authentication** — Secure signup/login with bcrypt password hashing
- **Application CRUD** — Track companies, roles, statuses, and job descriptions
- **Notes** — Add notes per application
- **Resume Upload** — Upload to Cloudinary (PDF/Word)
- **AI Resume Analysis** — GPT-4 powered strengths/weaknesses/suggestions
- **AI Job Match Scoring** — Compare resume to job description (0–100 score)
- **Analytics Dashboard** — Charts for applications/month, status distribution, rates
- **Responsive UI** — Dark mode, glassmorphism, gradient accents

## 🏗️ Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | Next.js 15 (App Router), Tailwind CSS, Zustand, Recharts |
| Backend   | Node.js, Express                 |
| Database  | PostgreSQL                       |
| AI        | OpenAI GPT-4                     |
| Storage   | Cloudinary                       |
| Auth      | JWT + bcrypt                     |

## 📂 Project Structure

```
job-tracker/
├── client/                 # Next.js frontend
│   └── src/
│       ├── app/            # App router pages
│       ├── components/     # Reusable UI components
│       ├── features/       # Zustand stores
│       └── services/       # API service layer
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── routes/             # Express routes
│   ├── services/           # AI & Cloudinary services
│   ├── middleware/          # Auth, validation, errors
│   ├── models/             # SQL query models
│   ├── db/                 # DB connection & schema
│   └── utils/              # JWT, errors, async handler
└── shared/                 # Shared TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Cloudinary account

### 1. Clone & Install

```bash
# Server
cd job-tracker/server
cp .env.example .env    # Fill in your credentials
npm install

# Client
cd ../client
cp .env.example .env.local
npm install
```

### 2. Set up Database

```bash
# Create a PostgreSQL database, then run the schema:
psql -d job_tracker -f server/db/schema.sql
```

### 3. Configure Environment Variables

**Server `.env`:**
```
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/job_tracker
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:3000
```

**Client `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

| Method | Endpoint                          | Auth | Description              |
|--------|-----------------------------------|------|--------------------------|
| POST   | `/api/auth/signup`                | ❌   | Register a new user      |
| POST   | `/api/auth/login`                 | ❌   | Login                    |
| GET    | `/api/auth/me`                    | ✅   | Get current user         |
| POST   | `/api/applications`               | ✅   | Create application       |
| GET    | `/api/applications`               | ✅   | List applications        |
| GET    | `/api/applications/:id`           | ✅   | Get application          |
| PUT    | `/api/applications/:id`           | ✅   | Update application       |
| DELETE | `/api/applications/:id`           | ✅   | Delete application       |
| GET    | `/api/applications/analytics/summary` | ✅ | Get analytics           |
| POST   | `/api/notes`                      | ✅   | Create note              |
| GET    | `/api/notes/:applicationId`       | ✅   | Get notes by application |
| POST   | `/api/resume/upload`              | ✅   | Upload resume            |
| GET    | `/api/resume`                     | ✅   | List resumes             |
| POST   | `/api/ai/analyze-resume`          | ✅   | AI resume analysis       |
| POST   | `/api/ai/job-match`               | ✅   | AI job match scoring     |

## 🚢 Deployment

| Component | Recommended Platform |
|-----------|---------------------|
| Frontend  | Vercel              |
| Backend   | Railway / Render    |
| Database  | Supabase / Neon     |

## 📄 License

MIT
