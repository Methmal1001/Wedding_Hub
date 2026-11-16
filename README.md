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
- `/catalog?category=<key>` – category page (rotating banner, service tiles, side banners)
- `/sub-category/<service>` – service page with listings (grid / image view)
- `/listing/<service>/<Listing-Name>` – listing details page
- `/auth/login`, `/auth/register` – animated log-in and sign-up portal (`/login` and `/register` redirect here)
- `/profile` – user profile: countdown, checklist, saved vendors, enquiries, edit profile, settings

## Accounts (demo only)

There is no backend, so accounts are stored in the browser's `localStorage` (passwords are salted and hashed, but this is still only suitable for a demo – a real site must authenticate on a server). Each browser has its own accounts.

Demo account: `demo@weddinghub.lk` / `Demo@2026` – or press **Try the demo account** on the log-in page.

## Splash animation

The splash couple is a hand-drawn, single-line sketch (`components/SplashBride.vue` and `components/SplashGroom.vue`, both inline SVG). The bride walks in from the left and the groom from the right while their outlines draw themselves. They meet face to face and join hands, then the logo and tagline appear.

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
