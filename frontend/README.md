# Agile Media Solutions — Website

A modern, responsive marketing website for **Agile Media Solutions**, built with HTML, CSS, and JavaScript. It includes a fixed navigation bar, hero banner with slideshow, sections for Who We Are, Services, Media Brands, Signature Events, Case Studies, Insights & Press, Careers, Stay Connected, Contact form, and footer with newsletter and social links.

## Run locally (no Docker)

**If you get "127.0.0.1 refused to connect" when clicking Careers:** the browser is trying to reach a local server that isn't running. Fix it by running the site from the `agile-media-website` folder:

- **Easiest:** Double-click `Start-Site.bat` in the `agile-media-website` folder. It starts a server and opens the site; then Careers and all menu links work.
- Or open `index.html` by double-clicking it in File Explorer (from inside `agile-media-website`). Then links like Careers will open correctly.
- Or from a terminal in `agile-media-website`: `python -m http.server 8080`, then visit **http://localhost:8080/index.html**.

1. Serve the files from the **agile-media-website** folder, for example:
   - **Python 3:** `python -m http.server 8080`
   - **Node (npx):** `npx serve -p 8080`
   - Or double-click `index.html` in that folder (no server needed; all page links work).

2. Visit `http://localhost:8080/index.html` (or open the file). Then use the menu to open Careers, Services, etc.

## Run with Docker

### Build and run with Docker CLI

```bash
docker build -t agile-media .
docker run -p 8080:80 agile-media
```

Then open **http://localhost:8080** in your browser.

### Run with Docker Compose

```bash
docker-compose up
```

Then open **http://localhost:8080**. To run in the background:

```bash
docker-compose up -d
```

To stop:

```bash
docker-compose down
```

## Project structure

```
agile-media-website/
├── index.html      # Main page and all sections
├── styles.css      # Design system, layout, responsive, animations
├── script.js      # Nav toggle, hero slideshow, scroll animations, form validation
├── images/        # Optional: add images here
├── Dockerfile     # Nginx Alpine image serving the site
├── docker-compose.yml
└── README.md
```

## Features

- **Navigation:** Logo left, links center (with “Our Brands” dropdown), hamburger menu on smaller screens.
- **Hero:** Full-height hero with rotating slideshow (every 5 seconds), headline, description, and three CTAs (Work With Us, Explore Our Brands, Contact Us).
- **Sections:** Who We Are, What We Do, Services (animated cards), Our Media Brands, Signature Events, Case Studies (carousel), Insights & Press, Sectors, Studio, Agile Press Group, Digital Engagement, Partnerships, Careers, Stay Connected, Contact form.
- **Animations:** Hero line animation, scroll-triggered fade-in for cards, hover effects on cards and buttons, smooth scrolling.
- **Footer:** Company/Press/Contact columns, newsletter signup, copyright, legal links, social icons.
- **Responsive:** Layout adapts for mobile, tablet, and desktop; mobile nav and dropdown behavior as described above.

## Tech stack

- HTML5
- CSS3 (custom properties, Flexbox, Grid, media queries)
- Vanilla JavaScript (no frameworks)

The site is static and can be served by any web server or via Docker with nginx as in the provided Dockerfile and docker-compose setup.
