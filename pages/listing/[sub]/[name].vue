<template>
  <!-- Built-in listings render on the server. Listings that vendors submitted
       (and an admin approved) live in the browser, so they appear once the
       site data has loaded. -->
  <ListingView v-if="item" :key="item.id" :item="item" />

  <div v-else class="relative min-h-screen bg-ivory">
    <AppNavbar />
    <main class="container-site grid min-h-[70vh] place-items-center pb-16 pt-32 text-center">
      <div v-if="!siteDb.loaded" class="flex flex-col items-center gap-4 text-charcoal-soft" role="status">
        <span class="h-10 w-10 animate-spin rounded-full border-2 border-rosewood/20 border-t-rosewood" />
        Loading listing…
      </div>
      <div v-else class="max-w-md">
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush text-rosewood">
          <AppIcon name="search" :size="28" />
        </span>
        <h1 class="mt-5 font-serif text-4xl font-semibold text-charcoal">Listing not available</h1>
        <p class="mt-3 text-charcoal-soft">
          This listing doesn’t exist or is not published at the moment. Browse other vendors instead.
        </p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <NuxtLink :to="`/sub-category/${route.params.sub}`" class="btn-primary">See similar vendors</NuxtLink>
          <NuxtLink to="/catalog" class="btn-outline">All vendors</NuxtLink>
        </div>
      </div>
    </main>
    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { findListing } from '~/composables/useListing'

useSplash().finish()

const route = useRoute()
const item = computed(() => findListing(String(route.params.sub), String(route.params.name)))

useSeoMeta({ title: () => (item.value ? `${item.value.name} – ${item.value.sub} – Wedding Hub` : 'Listing – Wedding Hub') })
</script>
