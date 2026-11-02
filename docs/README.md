# NovaStream Technical Documentation

Welcome to the official technical documentation for **NovaStream**.

This documentation is written in clear, simple English so that any developer—even someone who is new to Next.js or Supabase, or returning to the project after several months—can understand how the website works, why it was built this way, and how to maintain or extend it safely.

---

## Table of Contents

| Guide | Topic | What You Will Learn |
|---|---|---|
| [01 — Project Overview](./01-project-overview.md) | High-Level Summary | What NovaStream does, who uses it, the technology stack, and feature status (implemented vs. planned). |
| [02 — Getting Started](./02-getting-started.md) | Local Setup | Step-by-step instructions to install packages, configure `.env.local`, run in Local Seed Mode or Live Supabase Mode, and run tests. |
| [03 — Project Architecture](./03-project-architecture.md) | System Design | Folder structure, Next.js App Router, Server vs. Client Components, and data flow diagrams. |
| [04 — Frontend Components](./04-frontend-components.md) | UI Components | Detailed reference for every React component in `src/components/`, including props, state, hooks, and SCSS Modules. |
| [05 — Database](./05-database.md) | PostgreSQL Schema | All 7 Supabase tables, columns, constraints, indexes, Entity-Relationship diagram, and real query examples. |
| [06 — Authentication & Security](./06-authentication-security.md) | Auth & RLS | How login works, the `admin_users` allowlist, `public.is_admin()`, Row Level Security (RLS), and input validation. |
| [07 — Services & Pricing](./07-services-pricing.md) | Dynamic Variants | How multi-option services, integer MAD prices, discounts, and the interactive variant selector work. |
| [08 — Multilingual System](./08-multilingual-system.md) | i18n & Darija RTL | How English (`en`), French (`fr`), and Moroccan Darija (`ar`) work using cookies, translation tables, and RTL CSS. |
| [09 — Admin Dashboard](./09-admin-dashboard.md) | Catalog Management | How `/admin` works and how to add, edit, translate, publish, or delete services and categories. |
| [10 — Image Management](./10-image-management.md) | Storage & Uploads | How images are validated and uploaded to the Supabase `service-images` bucket or selected from local presets. |
| [11 — WhatsApp Integration](./11-whatsapp-integration.md) | Customer Orders | How prefilled WhatsApp messages (`wa.me`) are built in English, French, and Moroccan Darija. |
| [12 — Deployment](./12-deployment.md) | Production Hosting | How to deploy NovaStream for free on Supabase + Netlify Free (and Cloudflare Pages considerations). |
| [13 — Troubleshooting](./13-troubleshooting.md) | Common Fixes | Solutions for common setup, build, database, storage, and localization problems. |
| [14 — Maintenance](./14-maintenance.md) | Long-Term Care | How to update dependencies, back up the database, write new migrations, and test changes safely. |
| [15 — Future Improvements](./15-future-improvements.md) | Roadmap | Honest list of partial or missing features and recommended future upgrades. |
| [Glossary](./glossary.md) | Key Terms | Simple definitions of technical terms used throughout these guides (SSR, RLS, Props, Hooks, RTL, etc.). |

---

## How to Read This Documentation

- **New to the project?** Start with [01 — Project Overview](./01-project-overview.md) and [02 — Getting Started](./02-getting-started.md).
- **Want to understand the code structure?** Read [03 — Project Architecture](./03-project-architecture.md) and [04 — Frontend Components](./04-frontend-components.md).
- **Working on the database or admin panel?** Read [05 — Database](./05-database.md), [06 — Authentication & Security](./06-authentication-security.md), and [09 — Admin Dashboard](./09-admin-dashboard.md).
- **Unfamiliar with a technical word?** Check the [Glossary](./glossary.md) at any time.

