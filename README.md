# PreCon Admin

PreCon Admin is a full-stack web app for managing **pre-construction administration** workflows across two stages:

1. Planning Approval
2. Development Approval

It includes site management, checklist/task tracking, document uploads, per-task reminders, scheduling, and email/password authentication for one organization with up to 2 users.

## Tech stack (reliable + maintainable)

- **Next.js 14 + TypeScript** (frontend + backend routes)
- **Prisma ORM**
- **SQLite** for local development (easy start)
- **Nodemailer** for reminder emails
- **Session auth** (email/password)

> This gives a robust production path while staying simple and cost-effective to run.

## Features implemented

- ✅ Login and signup (email/password)
- ✅ Organization model with **2-user seat limit**
- ✅ Site details CRUD:
  - Address
  - Council
  - Area
  - Current situation
  - Future development (houses + storeys)
- ✅ Auto-generated task workflow when a new site is created
- ✅ Two-stage checklists:
  - Planning Approval tasks
  - Development Approval tasks
- ✅ Per-task:
  - status
  - due date
  - reminder days before due
  - notes (RFI / comments)
- ✅ Document upload support:
  - Form1
  - Contract of Sale
  - Survey
  - Other Documents
  - task-linked or standalone
- ✅ Light/Dark theme toggle
- ✅ Reminder scheduling records + reminder runner script

## Storage options (online, suitable, easy, cheap)

### 1) Supabase Storage + Postgres (Recommended)
- **Why**: easy setup, good free tier, S3-like storage, managed database.
- **Use case**: best balance of cost + speed of deployment.
- **Migration path**: switch Prisma datasource to Postgres and upload docs to Supabase buckets.

### 2) Cloudflare R2 + Neon Postgres
- **Why**: very low object storage cost; cheap at scale.
- **Use case**: more cost-optimized long term.
- **Tradeoff**: slightly more setup complexity than Supabase.

### 3) AWS S3 + RDS Postgres
- **Why**: enterprise-grade reliability.
- **Use case**: larger teams / compliance needs.
- **Tradeoff**: more expensive and more ops overhead.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Generate Prisma client and DB schema:

```bash
npx prisma migrate dev --name init
```

4. Seed demo org/users/site/tasks:

```bash
npm run prisma:seed
```

5. Start dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Seeded users

- owner@preconadmin.app / Password@123
- admin2@preconadmin.app / Password@123

## Reminder emails

Task reminders are generated when a due date is set and can be processed by:

```bash
npm run check:reminders
```

- If SMTP env variables are missing, reminders are printed to console (dry run).
- In production, schedule this command via cron (or platform scheduler) every 15-60 minutes.

## Future steps

1. Add role-based permissions (Owner/Admin).
2. Add activity log and audit history.
3. Add Kanban + Gantt schedule views.
4. Add advanced RFI sub-workflow (Architect/Engineer routing logic).
5. Move uploads to cloud object storage (Supabase/R2/S3).
6. Add background job queue (BullMQ) for reliable reminder delivery and retries.
7. Add integration with PlanSA task references.
8. Add export (PDF + CSV) per-site dossier.

## Notes

- Uploaded files are stored locally in `/public/uploads` for now.
- The app is intentionally designed to be extended toward production with Postgres + cloud object storage.
