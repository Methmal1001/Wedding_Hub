<template>
  <section id="services" class="relative py-20 sm:py-24 lg:py-28">
    <div class="container-site">
      <SectionHeading
        eyebrow="Wedding Services"
        title="Explore Wedding Services"
        subtitle="Find everything you need to create your perfect wedding."
      />

      <div class="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        <div v-for="(cat, i) in weddingCategories" :key="cat.key" v-reveal="(i % 4) * 90">
          <button
            type="button"
            class="cat-card group relative isolate block aspect-[4/5] w-full overflow-hidden rounded-[22px] text-left shadow-soft ring-1 ring-rosewood/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:aspect-[5/4] sm:rounded-3xl"
            :aria-label="`Browse ${cat.name} – ${cat.vendorCount} vendors`"
            @click="openCategory(cat)"
          >
            <!-- photo -->
            <img
              :src="cat.image"
              :alt="cat.name"
              loading="lazy"
              class="cat-img absolute inset-0 -z-10 h-full w-full object-cover"
            >
            <!-- bottom shade so the white name reads clearly -->
            <div class="absolute inset-0 -z-10 bg-gradient-to-t from-[#03102E]/90 via-[#03102E]/25 to-transparent" />
            <!-- brand overlay that appears on hover -->
            <div class="cat-overlay absolute inset-0 -z-10 bg-gradient-to-t from-rosewood-900/95 via-rosewood-800/80 to-rosewood/40" />

            <!-- corner arrow -->
            <span class="cat-arrow absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rosewood shadow-soft sm:right-4 sm:top-4 sm:h-10 sm:w-10">
              <AppIcon name="arrowRight" :size="16" class="-rotate-45" />
            </span>

            <!-- DEFAULT: name straight on the photo (no background) -->
            <div class="cat-label absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <div class="flex items-center justify-between gap-2">
                <h3 class="cat-name min-w-0 font-serif text-[1.15rem] font-semibold leading-tight text-white sm:text-[1.55rem]">
                  {{ cat.name }}
                </h3>
                <span class="hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-white/60 sm:inline-block">
                  {{ cat.vendorCount }}+
                </span>
              </div>
              <p class="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80 sm:hidden">{{ cat.vendorCount }} vendors</p>
              <span class="mt-2.5 block h-[3px] w-10 rounded-full bg-gradient-to-r from-gold-light to-[#4DFF00]" />
            </div>

            <!-- HOVER: details panel -->
            <div class="cat-details absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
              <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-light sm:text-[11px]">
                {{ cat.vendorCount }} vendors
              </p>
              <h3 class="mt-1 font-serif text-[1.2rem] font-semibold leading-tight text-white sm:text-[1.55rem]">
                {{ cat.name }}
              </h3>
              <p class="mt-1.5 hidden text-sm leading-snug text-white/80 sm:block">{{ cat.blurb }}</p>
              <ul class="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                <li
                  v-for="sub in cat.subcategories.slice(0, 3)"
                  :key="sub"
                  class="max-w-full truncate rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white ring-1 ring-white/25 backdrop-blur"
                >
                  {{ sub }}
                </li>
              </ul>
              <span class="mt-3.5 inline-flex items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-gold-light to-[#4DFF00] px-3.5 py-1.5 text-xs font-semibold text-rosewood-900 sm:mt-4 sm:px-4 sm:py-2 sm:text-[13px]">
                Explore services
                <AppIcon name="arrowRight" :size="14" />
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'

import { catalogLink } from '~/composables/useCatalog'

// Clicking a category opens the Catalog filtered to that service.
const openCategory = (cat) => navigateTo(catalogLink({ category: cat.key }))
</script>

<style scoped>
.cat-name {
  text-shadow: 0 2px 12px rgba(3, 16, 46, 0.55);
}
.cat-img {
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.cat-overlay {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.cat-arrow {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s, color 0.3s;
}
.cat-label {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
}
.cat-details > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.45s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* hover (and keyboard focus) state */
.cat-card:hover .cat-img,
.cat-card:focus-visible .cat-img {
  transform: scale(1.1);
}
.cat-card:hover .cat-overlay,
.cat-card:focus-visible .cat-overlay {
  opacity: 1;
}
.cat-card:hover .cat-arrow,
.cat-card:focus-visible .cat-arrow {
  transform: rotate(45deg);
  background-color: #fff;
  color: #0049f2;
}
.cat-card:hover .cat-label,
.cat-card:focus-visible .cat-label {
  opacity: 0;
  transform: translateY(30px);
}
.cat-card:hover .cat-details > *,
.cat-card:focus-visible .cat-details > * {
  opacity: 1;
  transform: none;
}
.cat-card:hover .cat-details > :nth-child(2) { transition-delay: 0.05s; }
.cat-card:hover .cat-details > :nth-child(3) { transition-delay: 0.1s; }
.cat-card:hover .cat-details > :nth-child(4) { transition-delay: 0.15s; }
.cat-card:hover .cat-details > :nth-child(5) { transition-delay: 0.2s; }

/* touch screens have no hover: keep the clean default card */
@media (hover: none) {
  .cat-card:hover .cat-label { opacity: 1; transform: none; }
  .cat-card:hover .cat-details > * { opacity: 0; }
  .cat-card:hover .cat-overlay { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .cat-img, .cat-label, .cat-details > *, .cat-arrow { transition: none; }
}
</style>
