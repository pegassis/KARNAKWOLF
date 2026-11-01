# KARNAK26 – Tech Fest Website

Official website for **KARNAK26**, the tech fest of MBITS.

**Live site:** https://karnakmbits.com/

## Features

- Animated landing experience: intro animation, GSAP motion, and WebGL / Three.js visual effects
- Pages: Home, About, Main Event, Departments, Gallery, and a Karnak mini-game
- Department pages that list each department's events, with a detail page for every event
- Admin area (`/karmin`, login required) for managing event details
- Responsive layout for desktop and mobile

## Tech stack

React · TypeScript · Vite · Tailwind CSS · React Router · GSAP · Three.js / OGL · Radix UI · Material UI

## How it was built

Built by a team. We designed the page structure in **Figma**, then built the site in VS Code using **Antigravity** and **GitHub Copilot** as AI coding assistants.

**Team:** Leen Leo, Aryan C S, Christepher C Biju

## Run it locally

Needs Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173
```

> **Backend:** the admin area and registration features call a REST API (`/api/...` on port 5000). That server is not part of this repository, so those features will not work when you run only the frontend. The public pages work without it.

## Project structure

```
src/app/pages/        Home, About, Departments, Gallery, events, game, admin login
src/app/components/   Navbar, Footer, animations and visual effects, UI components
src/app/utils/        API config and storage helpers
public/               images, logos and media
```

## Credits

UI components from [shadcn/ui](https://ui.shadcn.com/) (MIT). Photos from [Unsplash](https://unsplash.com/).
