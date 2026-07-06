# PurrPedia — Video Demo Script
**Target: 2-3 minutes | Tone: Fun, fast-paced, confident**

---

## INTRO (10 sec)
> "Hey! This is PurrPedia — the internet's cat encyclopedia. Built for HackTheKitty 2026 with Next.js, Temporal workflows, and a whole lot of cat love. Let me show you what it does."

**[Screen: Landing page hero section]**

---

## 1. LANDING PAGE (15 sec)
- Scroll slowly through the landing page
- Point out: animated ticker, floating emojis, rotating cat facts, glow-pulse CTA
- Hover the mouse to show the **paw cursor** and **paw trail**
- Click anywhere to trigger a **meow sound**

> "Right off the bat — custom paw cursor, paw prints that follow your mouse, and synthesized cat meows. No audio files — all Web Audio API."

---

## 2. BREED INDEX (20 sec)
- Click "Breeds" in nav
- Show the grid loading with skeleton shimmer
- Type "Bengal" in search → show instant filter
- Click on a breed card → show the detail page
- Highlight: image gallery, trait rating bars, Wikipedia summary, temperament tags

> "247 cat breeds, all from TheCatAPI. Full profiles with photos, trait ratings, and live Wikipedia summaries. Search by name, origin, or temperament."

---

## 3. CAT FACTS — Swipeable (15 sec)
- Navigate to /facts
- Swipe through 3-4 facts (arrow keys or click)
- Show category badges and color theming per category
- Click a fact card to trigger meow

> "TikTok-style swipeable cat facts. Keyboard nav, touch swipe, and every card has a different color based on category. Click to meow."

---

## 4. WHICH CAT ARE YOU? — Quiz (25 sec)
- Navigate to /quiz
- Answer 3-4 questions quickly (show progress bar moving)
- Skip ahead to result screen
- Show the breed result card with traits, tagline, description

> "Personality quiz — 7 questions, maps you to one of 10 breeds. I got Sphynx — 'The Eccentric Showstopper'. Sounds about right."

---

## 5. CAT NAME GENERATOR (15 sec)
- Navigate to /name-generator
- Hit "Generate Cat Names" button
- Show 4 generated names
- Click one to copy
- Hit generate again to get more

> "Name generator for when you adopt a cat and need something more dignified than 'Mr. Whiskers'. Click to copy — 'Professor Biscuit McFluffington, Destroyer of Curtains'. You're welcome."

---

## 6. AUTH & DASHBOARD (20 sec)
- Click "Get Started" → show login page
- Explain magic link auth (no password)
- Show the dashboard (if logged in) — digest status, postcard history, quick stats

> "Magic link auth — no passwords. Enter your email, get a link, you're in. Dashboard shows your digest subscription status and postcard history."

---

## 7. DAILY DIGEST (10 sec)
- Show the subscribe page briefly
- Explain: auto-detects timezone, delivers at 8am daily

> "Subscribe to a daily digest — cat fact, breed spotlight, and photo every morning at 8am your timezone. Powered by Temporal durable workflows — even survives server restarts."

---

## 8. PURR POSTCARDS (20 sec)
- Navigate to /postcards/new (need to be logged in)
- Show the Fabric.js canvas editor
- Pick a template, add a sticker, type a message
- Show the scheduling date picker
- Explain: sends email on scheduled date via Temporal

> "Purr Postcards — design a cat postcard with our canvas editor. Stickers, text, backgrounds. Schedule it for any date — birthdays, holidays, random Tuesdays. Temporal handles the delivery."

---

## 9. BONUS: Theme Toggle + Mobile (10 sec)
- Toggle light/dark theme
- Open dev tools → show mobile view briefly

> "Light and dark theme. Fully responsive — works on mobile with touch swipe and hamburger nav."

---

## CLOSING (10 sec)
> "PurrPedia — 5 features, zero cat left behind. Built with Next.js 16, Prisma, Temporal, Fabric.js, and Tailwind. All code written during the hackathon period. Thanks for watching!"

**[Screen: Landing page CTA with glow pulse]**

---

## RECORDING TIPS
- Use **Loom** (free, easy, gives you a shareable link instantly)
- Screen record at **1080p** with your mic on
- Keep it **under 3 minutes** — judges have lots of submissions
- Show the **live deployed URL** in the browser bar so they can try it
- Be enthusiastic — you built something cool, act like it
- If something breaks during recording, just narrate around it — "this normally does X"
