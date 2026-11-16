<template>
  <article class="card-surface group flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
    <!-- Cover -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="vendor.image"
        :alt="`${vendor.name} – ${vendor.category} in ${vendor.location}`"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-rosewood backdrop-blur">
        {{ vendor.category }}
      </span>

      <button
        type="button"
        class="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition-all duration-300 hover:scale-110"
        :class="fav ? 'bg-rosewood text-white' : 'bg-white/90 text-rosewood hover:bg-white'"
        :aria-pressed="fav"
        :aria-label="fav ? `Remove ${vendor.name} from favourites` : `Save ${vendor.name} to favourites`"
        @click="toggleFavourite(vendor)"
      >
        <AppIcon :key="String(fav)" name="heart" :size="18" :filled="fav" :class="{ 'animate-heart-pop': fav }" />
      </button>

      <p class="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-medium text-white">
        <AppIcon name="pin" :size="14" />
        {{ vendor.location }}, Sri Lanka
      </p>
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-serif text-[1.55rem] font-semibold leading-tight text-charcoal transition-colors group-hover:text-rosewood">
          {{ vendor.name }}
        </h3>
        <span
          v-if="vendor.verified"
          class="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700"
          title="Verified by Wedding Hub"
        >
          <AppIcon name="verified" :size="13" />
          Verified
        </span>
      </div>

      <StarRating v-if="vendor.rating" class="mt-2" :rating="vendor.rating" :reviews="vendor.reviews" />

      <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-charcoal-soft">
        {{ vendor.description }}
      </p>

      <!-- Listing contact details (shown for directory listings) -->
      <ul v-if="vendor.address || vendor.phone" class="mt-3 space-y-1.5 text-[13px] text-charcoal-soft">
        <li v-if="vendor.address" class="flex items-start gap-2">
          <AppIcon name="pin" :size="15" class="mt-0.5 shrink-0 text-rosewood" />
          <span>{{ vendor.address }}</span>
        </li>
        <li v-if="vendor.phone" class="flex items-start gap-2">
          <AppIcon name="phone" :size="15" class="mt-0.5 shrink-0 text-rosewood" />
          <span>{{ vendor.phone }}</span>
        </li>
      </ul>

      <div class="mt-auto flex items-center justify-between gap-3 border-t border-rosewood/5 pt-4" :class="vendor.address ? 'mt-5' : 'mt-5'">
        <p class="text-xs text-charcoal-soft">
          {{ /^LKR/.test(vendor.priceFrom) ? 'From' : 'Price' }}
          <span class="block text-sm font-semibold text-charcoal">{{ vendor.priceFrom }}</span>
        </p>
        <NuxtLink v-if="listing" :to="listingLink(listing)" class="btn-outline !min-h-[42px] !px-5 text-[13px]">
          View Details
          <AppIcon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-0.5" />
        </NuxtLink>
        <button
          v-else
          type="button"
          class="btn-outline !min-h-[42px] !px-5 text-[13px]"
          @click="comingSoon(`The ${vendor.name} profile page`)"
        >
          View Details
          <AppIcon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { catalog } from '~/data/catalog'
import { listingLink } from '~/composables/useListing'

const props = defineProps({ vendor: { type: Object, required: true } })
const { isFavourite, toggleFavourite } = useFavourites()
const { comingSoon } = useToast()
const fav = computed(() => isFavourite(props.vendor.id))
// The same business in the catalog, so "View Details" can open its listing page.
const listing = computed(() => catalog.find((l) => l.name === props.vendor.name))
</script>
