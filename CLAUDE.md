# Yoshlar Base: instructions for Claude Code

Read this file and `PLAN.md` before writing any code. `PLAN.md` is the source of truth for scope, data model and build order.

## Product in one sentence

Yoshlar Base is a modern digital home for young people in Uzbekistan: a place to join clubs, find trusted opportunities, turn ideas into teams (MIYA), and build a visible record of what they actually did.

It is NOT: a news/info aggregator, a social network, a Telegram clone, a job board, a government portal, an AI wrapper, an LMS, or an "all-in-one app with 100 features".

Core principle: help users leave the app and do something real (attend a club, apply to a program, join a team). Do not optimize for time spent in the app. No infinite feeds.

## Working with the founder

- The founder writes in Uzbek. Reply in Uzbek; technical terms stay in English.
- Be concise: conclusion first, then the key reason, then the next action. No long architecture lectures.
- Give the practical option first when there are several.
- Push back when something is technically weak, too complex, or harms the product. Do not blindly execute.
- Before changing existing code, understand it. Do not replace working code without a reason.

## Scope (MVP v1)

Five spaces only: **Home, Clubs, Opportunities, MIYA (idea board), Profile**.

Do NOT build in v1, even if it seems easy: challenges, O'yingoh (activity-gated games), services/freelance marketplace, payments, AI features, chat or direct messages, public profiles, follower counts, ads, phone-number collection, email/password auth, a custom admin panel.

If a task seems to need one of these, stop and ask.

## Stack

- Next.js (App Router, TypeScript) + Tailwind, deployed on Vercel. Code lives in `web/`.
- Supabase (Postgres). All database access goes through the server (server components, route handlers, server actions) using the service role key. The browser never talks to the database directly. Enable RLS with deny-all as defense in depth.
- Telegram bot (grammY) as a webhook route inside the Next.js app. Daily reminders via Vercel Cron.
- Sessions: signed httpOnly cookie (JWT, `jose`). No passwords.
- Do not add dependencies without a clear reason. Prefer the platform's built-ins.

## Accounts and safety (non-negotiable)

Users may be 13-17. Safety is by design.

- Account = Telegram ID. Login is a bot deep link, no password, no email, **no phone number**.
- Store only: Telegram ID, first name (or nickname), age range, region, interests. Age range buckets: 13-15, 16-17, 18-25. Never store exact birth date, surname, phone, photo or email.
- No public profiles. No user-to-user DMs.
- Contact between users happens only after a mutual accept (MIYA join request), and **only within the same age group**: under-18 users are never connected with 18+ users in v1.
- Every user-generated item (MIYA ideas) goes through moderation (`pending` -> `open`) before being visible.
- Every public entity has a "Report" action. Provide an "Delete my account" action that really deletes personal data.
- Never log or expose Telegram IDs in public pages or analytics dashboards.
- Validate and sanitize all user input. Rate-limit the bot and write endpoints.
- Open legal question (founder is checking): Uzbekistan personal-data rules (consent, server location). Keep data minimal and do not add new personal-data fields without asking.

## Data rules

- Never create fake data that looks real. Seed/sample rows must have `is_sample = true` and a visible "NAMUNA" label in the UI.
- Opportunities must show: title, type, organizer, closing date ("Ariza oxirgi kuni"), age range, eligibility, region, official source link, last verified date. Prefer official sources. Items past the closing date are shown as closed automatically.
- Profile is built automatically from real actions (club attendance, club membership, ideas, accepted join requests). Users do not type their own achievements.

## Design principles

Inspired by Apple and Linear: modern, minimal, calm, trustworthy, premium, human.

- Strong clean typography (Inter or similar), generous whitespace, clear hierarchy: the most important action is obvious.
- One accent color on a neutral base. Light theme first.
- Subtle, purposeful motion only.
- Avoid: neon, rainbow palettes, excessive gradients, glowing cards, glassmorphism, random blobs, 3D, "AI-looking" illustrations, corporate-dashboard or government-portal look, childish style.
- Simple reusable components; consistent UI.
- Mobile-first (most users are on phones). Keep it fast. Accessibility matters: contrast, focus states, labels, tap targets >= 44px.
- All UI text is Uzbek (Latin script), kept in one strings file so Russian can be added later. Tone: friendly, direct, not bureaucratic.

## Development rules

1. Understand before changing. 2. Don't over-engineer. 3. Simple architecture. 4. Reusable components. 5. Consistent UI. 6. No random dependencies. 7. Mark fake data. 8. Don't build features because they are technically interesting. 9. Mobile responsiveness. 10. Performance. 11. Accessibility. 12. Security, especially for user content and minors.

Work milestone by milestone as listed in `PLAN.md`. Finish and verify one milestone (acceptance criteria met, app builds, lint passes) before starting the next. Commit after each milestone with a clear message.

## Environment variables (never commit values)

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, `SESSION_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`. Keep `.env.example` up to date.
