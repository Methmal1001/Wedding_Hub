<template>
  <section id="venues" class="relative py-20 sm:py-24 lg:py-28">
    <div class="container-site">
      <SectionHeading
        eyebrow="Signature Venues"
        title="Find Your Dream Wedding Venue"
        subtitle="From golden beaches in Bentota to misty hill-country retreats in Ella – handpicked venues for every love story."
      />

      <div class="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <div
          v-for="(w, i) in showcase"
          :key="w.id"
          v-reveal="(i % 3) * 110"
          :class="i === 0 ? 'sm:col-span-2' : ''"
        >
          <VenueCard :venue="w" :large="i === 0" />
        </div>
      </div>

      <div v-reveal class="mt-12 flex flex-col items-center gap-4 text-center">
        <p class="text-sm text-charcoal-soft">
          Showing {{ showcase.length }} of <span class="font-semibold text-rosewood">240+</span> venues across Sri Lanka
        </p>
        <button type="button" class="btn-primary btn-shine" @click="viewAll">
          View All Venues
          <AppIcon name="arrowRight" :size="16" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { venues } from '~/data/venues'

// 1 large + 4 regular cards make a balanced 3-column grid.
const showcase = venues.slice(0, 5)

import { catalogLink } from '~/composables/useCatalog'

const viewAll = () => navigateTo(catalogLink({ category: 'venues' }))
</script>
