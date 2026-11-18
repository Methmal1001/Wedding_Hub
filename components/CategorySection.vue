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
          class="category-card group relative isolate block aspect-[4/5] w-full sm:aspect-[5/4] overflow-hidden rounded-[22px] text-left shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:rounded-3xl"
          :aria-label="`Browse ${cat.name} – ${cat.vendorCount} vendors`"
          @click="openCategory(cat)"
        >
          <img
            :src="cat.image"
            :alt="cat.name"
            loading="lazy"
            class="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          >
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-[#03102E]/90 via-[#03102E]/25 to-transparent" />
          <div class="absolute inset-0 -z-10 bg-rosewood/0 transition-colors duration-500 group-hover:bg-rosewood/25" />

          <span class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white opacity-0 ring-1 ring-white/40 backdrop-blur transition-all duration-500 group-hover:opacity-100 sm:right-4 sm:top-4">
            <AppIcon name="arrowRight" :size="16" class="-rotate-45" />
          </span>

          <div class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p class="text-[10px] font-medium uppercase tracking-[0.2em] text-blush sm:text-[11px]">
              {{ cat.vendorCount }} vendors
            </p>
            <h3 class="mt-1 font-serif text-[1.2rem] font-semibold leading-tight text-white sm:text-[1.5rem]">
              {{ cat.name }}
            </h3>
            <p class="mt-1 hidden max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100 sm:block">
              {{ cat.blurb }}
            </p>
            <span class="mt-2.5 block h-px w-8 bg-blush transition-all duration-500 group-hover:w-16" />
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
