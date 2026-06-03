# Production Deployment & Hosting Guide for Tilak Popat Films (TPF)

This document provides a step-by-step guide to hosting your website on your custom domain **`tilakpopatfilms.in`** for 1 year.

---

## 1. Domain Registration
Before starting, purchase the domain `tilakpopatfilms.in` from a registrar.
- **Recommended Registrars**: Hostinger, GoDaddy, or Namecheap.
- **Duration**: Choose the **1-year** option.
- **Tip**: Make sure to enable DNS management access (provided by default with all registrars).

---

## 2. Set Up a Hosted PostgreSQL Database
Because your app runs in a serverless environment (Vercel), SQLite (`dev.db`) cannot be used because serverless environments are ephemeral (files get wiped on every restart). You need a hosted, cloud-based PostgreSQL database.

### Option A: Vercel Postgres (Easiest)
You can create a PostgreSQL database directly in your Vercel dashboard. It integrates automatically with your project.

### Option B: Neon.tech (Recommended & Free)
Neon is a serverless Postgres provider with a fast and free tier that easily accommodates portfolio websites.
1. Sign up on [Neon.tech](https://neon.tech/) (using your GitHub account).
2. Create a new project named `tpf-prod`.
3. In your Neon dashboard, copy the **Connection String**.
   - Make sure to select **Prisma** from the dropdown. It will look like:
     - Direct URL: `postgresql://username:password@ep-host-12345.us-east-2.aws.neon.tech/neondb?sslmode=require`
     - Pooled URL: `postgresql://username:password@ep-host-12345-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

## 3. Deploy the Website on Vercel
Vercel is the official platform for hosting Next.js projects. It offers a free **Hobby** plan which is perfect for personal and portfolio websites.

1. Sign up or log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New** -> **Project**.
3. Select your repository `TPF-Website` (connected to `github.com/tilakpopat4/TPF-Website`).
4. In the configuration page, expand the **Environment Variables** section and add the following keys from your local `.env`:
   - `DATABASE_URL`: *[Your Neon/Supabase Direct Connection URL]*
   - `DATABASE_PRISMA_DATABASE_URL`: *[Your Neon/Supabase Connection URL]*
   - `UPLOADTHING_TOKEN`: `eyJhcGlLZXkiOiJza19saXZlX2FiNjcxMzg4OTJlNTM3NDkxNGU0YmRjNjBiNjIyMGQyMDNjZjZiMWFkZGU1YTJkNTA1MTk5YzMwNTU3MGEwYTAiLCJhcHBJZCI6ImxqYmQ3ODNxY2siLCJyZWdpb25zIjpbInNlYTEiXX0=`
   - `RESEND_API_KEY`: `re_7Yrarz9W_KwHqaZN2bkVPa8vNm7L32Zad`
5. Click **Deploy**.
   - Vercel will build the project. The build process runs `npx prisma generate && npx prisma db push --accept-data-loss && next build`, which will automatically set up your database tables!

---

## 4. Map Your Custom Domain (`tilakpopatfilms.in`)
Once the site is deployed:
1. In your Vercel project, go to **Settings** -> **Domains**.
2. Type `tilakpopatfilms.in` and click **Add**.
3. Vercel will prompt you to select redirect options (it's recommended to map both `tilakpopatfilms.in` and `www.tilakpopatfilms.in`, redirecting `www` to the root domain).
4. Vercel will show two DNS records that you must add to your domain registrar's DNS panel (e.g. GoDaddy or Hostinger DNS Settings):
   - **For root domain (`@` or empty)**:
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **For `www` sub-domain**:
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`
5. Save the DNS settings at your registrar. Within 10-60 minutes, Vercel will generate an SSL certificate, and your site will be live at `https://tilakpopatfilms.in`.

---

## 5. Security Warning: Admin Dashboard Authorization
> [!WARNING]
> Currently, the `/admin` dashboard has no password validation (anyone visiting `tilakpopatfilms.in/admin` can edit or delete projects).
>
> We strongly recommend adding a password lock to the `/admin` route before making it live. If you would like, we can implement:
> 1. A simple admin password check (via a `ADMIN_PASSWORD` environment variable set in Vercel).
> 2. Full authentication using a modern library.
> Let me know if you would like me to set this up for you!

---

## 6. Configure Resend for Production Emails (Optional)
Currently, applications submitted on your recruitment page (`/work-with-tpf`) are sent using `onboarding@resend.dev` to your email `work.tilakpopatfilms@gmail.com`.
To make this professional and prevent emails from landing in spam:
1. Log in to [Resend.com](https://resend.com) (using the account linked to your Resend API Key).
2. Go to **Domains** -> **Add Domain**.
3. Type `tilakpopatfilms.in` and select your region.
4. Add the generated DNS TXT/MX records to your domain registrar (similar to the Vercel DNS steps).
5. Once verified, we can change the sender in `src/app/work-with-tpf/actions.ts` from `onboarding@resend.dev` to `recruitment@tilakpopatfilms.in`.
