# CYBER-GM Dashboard

A secure, modern, and responsive dashboard for cybersecurity operations, built with Next.js 15.

**🌐 Live Demo:** [https://cyber-gm-vgm.vercel.app/](https://cyber-gm-vgm.vercel.app/)

![Screenshot of CYBER-GM Dashboard](cyber-gm.png)

## 🚀 Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Custom JWT-based Auth
- **Email:** Resend API

## 🛠️ Prerequisites

- Node.js 18+ installed
- A Supabase account (for PostgreSQL)
- A Resend account (for Email)

## 📦 Installation

1.  Navigate to the project directory:
    ```bash
    cd app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## 🔐 Environment Configuration

Create a `.env.local` file in the `app` directory with the following variables:

```env
# Database Connection (Supabase)
DATABASE_URL="postgres://postgres.your-project:password@aws-0-region.pooler.supabase.com:6543/postgres"

# Authentication
JWT_SECRET="your-secure-random-string-at-least-32-chars"

# Email Service (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="onboarding@resend.dev" # Or your verified domain

# App URL (For email links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🗄️ Database Setup (Migrations)

This project uses raw SQL for database operations. You must create the tables manually using the provided migration scripts.

1.  Go to your Supabase Project Dashboard -> **SQL Editor**.
2.  Run the contents of the `.sql` files located in `src/lib/db/migrations/` in the following order:

    1.  `001_create_users_table.sql`
    2.  `002_add_profile_fields.sql`
    3.  `003_create_issues_table.sql`
    4.  `004_create_posts_table.sql`
    5.  `005_add_sector_to_users.sql`

## 🏃 Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚢 Deployment (Vercel)

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the **Environment Variables** listed above in Vercel Project Settings.
4.  **Important:** For `prod`, ensure `NEXT_PUBLIC_APP_URL` is set to your Vercel domain (e.g., `https://your-app.vercel.app`).

## 📁 Project Structure

- `src/app`: Page routes and layouts
- `src/api`: Backend API handlers
- `src/services`: Business logic services
- `src/repositories`: Database access layer
- `src/lib/db`: Database connection and migrations
- `src/components`: React UI components
