# Wedding Hub

Premium wedding directory for Sri Lanka. This is a frontend-only prototype with an animated splash screen, the homepage and a vendor catalog.

**Stack:** Nuxt 3 · Vue 3 · Tailwind CSS 3 (`@nuxtjs/tailwindcss`) · JavaScript. It has no backend, APIs or UI libraries. All data comes from `data/*.js`.

## Requirements

Node.js **20 or newer** (tested on 22.17.0). If you use nvm-windows:

```bash
nvm use 22.17.0
```

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build`, then `npm run preview`.

Restart the dev server after changing `tailwind.config.js` or `nuxt.config.js`.

## Pages

- `/` – animated splash screen + homepage
- `/catalog` – searchable vendor catalog. Filters live in the URL, e.g. `/catalog?category=photography&loc=Galle`

## Splash artwork (optional)

By default the splash shows a hand-painted (watercolour-style) SVG couple. To use your own painting instead, save a **transparent PNG** of the couple (groom on the left, bride on the right) as:

```
assets/images/splash-couple.png
```

The splash picks it up automatically after a dev-server reload or a rebuild. The painting is split along the gap between the couple, so the groom walks in from the left and the bride from the right, and they join into the full picture.

## Structure

```
components/   SplashScreen, SplashGroom, SplashBride, AppNavbar, HeroSection, SearchPanel,
              CategorySection, VendorSection, VendorCard, VenueSection, VenueCard,
              CatalogCard, InspirationBanner, WhyChooseUs, BusinessCTA, AppFooter,
              AppToast, AppIcon, BrandLogo, StarRating, SectionHeading
composables/  useSplash, useCatalog, useFavourites, useToast, useScrollTo
data/         weddingCategories.js, vendors.js, venues.js, catalog.js, locations.js
plugins/      reveal.js (v-reveal scroll animation directive)
pages/        index.vue, catalog.vue
assets/css/   main.css (Tailwind + brand utilities + keyframes)
public/images Wedding photography, vendor galleries and avatars (Unsplash, free licence)
```

## Colour palette

| Token      | Colour  | Use                                     |
| ---------- | ------- | --------------------------------------- |
| `rosewood` | #B4637A | Primary: buttons, links, heading accents |
| `blush`    | #F7E1E3 | Soft backgrounds and highlights          |
| `gold`     | #C9A86A | Accents, premium buttons, ratings        |
| `ivory`    | #FFFBF9 | Page background                          |
| `charcoal` | #33272C | Text                                     |
