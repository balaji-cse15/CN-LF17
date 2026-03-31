# EcoCart Impact 

A simple tool to understand the carbon footprint of your online purchases in real time.

---

##  About this project

Hey! I'm the developer behind **EcoCart Impact**.

Like most people, I shop online a lot. But at some point I started wondering — *what’s the environmental cost of all this convenience?*

We hear terms like "carbon footprint" everywhere, but it’s hard to actually understand what that means in daily life.

So I built this project to make that impact more visible and easier to relate to.

---

##  Why I built this

The main idea is pretty straightforward:

> If people can actually *see* their impact, they might make better choices.

Instead of showing just numbers, this app tries to put things into perspective — like how far you’d drive or how much energy you'd use to match a purchase.

Some things that motivated me:

* Billions of packages are shipped every year
* E-commerce contributes a noticeable share of global emissions
* Small choices (like slower shipping) can make a difference

---

##  What it does

* **Carbon estimation** → Calculates CO₂ based on product type, weight, and distance
* **Better suggestions** → Recommends greener alternatives where possible
* **History tracking** → Lets users track their past impact (if logged in)
* **Clean UI** → Fast and simple interface built for usability

---

## 🛠️ Tech stack

I used a modern stack to keep things fast and scalable:

* **Frontend:** React + TypeScript
* **Styling:** Tailwind CSS + shadcn/ui
* **Backend & DB:** Supabase (Auth + PostgreSQL)
* **State Management:** TanStack Query
* **Core Logic:** Custom carbon calculation module

--
##  Getting started

If you want to run this locally:

```bash
git clone https://github.com/balaji-cse15/CN-LF17.git
cd ecocart-impact
```

Install dependencies:

```bash
bun install
```

Create a `.env` file and add:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_public_key
```

Run the app:

```bash
bun dev
```

---

##  Testing

* Unit tests → `bun test`
* E2E tests → `npx playwright test`

---

##  Future improvements

This is still a work in progress. Some ideas I want to explore:

* Browser extension for real-time tracking on shopping sites
* Social sharing (compare impact with friends)
* Public API for developers

---

##  Final note

This project is part of my attempt to build something meaningful — not just another app, but something that can actually influence small decisions.

If you found it interesting or useful, feel free to ⭐ the repo or suggest improvements!

---
