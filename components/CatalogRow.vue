<template>
  <!-- Compact "grid view" listing: photo on the left, details on the right -->
  <article
    class="group relative flex gap-4 rounded-3xl bg-white p-3 shadow-soft ring-1 ring-rosewood/5 transition-all duration-300 hover:shadow-lift hover:ring-rosewood/15 sm:gap-5"
  >
    <div class="relative min-h-[132px] w-28 shrink-0 self-stretch overflow-hidden rounded-2xl sm:min-h-[150px] sm:w-48">
      <img
        :src="item.gallery[0]"
        :alt="`${item.name} – ${item.sub}`"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      >
      <span
        v-if="item.verified"
        class="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow"
      >
        <AppIcon name="verified" :size="12" />
        Verified
      </span>
    </div>

    <div class="flex min-w-0 flex-1 flex-col py-1 pr-1">
      <div class="flex items-start gap-3">
        <img
          v-if="item.avatar"
          :src="item.avatar"
          :alt="item.owner || item.name"
          loading="lazy"
          class="hidden h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white shadow-soft sm:block"
        >
        <span
          v-else
          class="hidden h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rosewood to-rosewood-800 font-serif text-base font-semibold text-white shadow-soft sm:grid"
          aria-hidden="true"
        >
          {{ initials }}
        </span>

        <div class="min-w-0 flex-1">
          <h3 class="truncate font-serif text-xl font-semibold leading-tight text-charcoal transition-colors group-hover:text-rosewood sm:text-[1.4rem]">
            {{ item.name }}
          </h3>
          <p class="mt-0.5 truncate text-xs text-charcoal-soft">{{ item.owner ? `by ${item.owner}` : category }}</p>
        </div>

        <button
          type="button"
          class="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 transition hover:scale-110"
          :class="fav ? 'bg-rose-50 text-rose-600 ring-rose-300' : 'bg-white text-rose-500 ring-rose-200 hover:bg-rose-50'"
          :aria-pressed="fav"
          :aria-label="fav ? `Remove ${item.name} from favourites` : `Save ${item.name} to favourites`"
          @click="toggleFavourite(item)"
        >
          <AppIcon :key="String(fav)" name="heart" :size="16" :filled="fav" :class="{ 'animate-heart-pop': fav }" />
        </button>
      </div>

      <p class="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-charcoal-soft">
        <template v-if="item.rating">
          <span class="flex items-center gap-1 font-semibold text-charcoal">
            <AppIcon name="star" :size="14" filled class="text-amber-400" />
            {{ item.rating.toFixed(1) }}
            <span v-if="item.reviews" class="font-normal text-charcoal-soft">({{ item.reviews }})</span>
          </span>
          <span class="text-charcoal-soft/50">•</span>
        </template>
        <span class="flex items-center gap-1">
          <AppIcon name="pin" :size="14" class="text-green-600" />
          {{ item.area || item.location }}
        </span>
      </p>

      <div class="mt-auto flex flex-wrap items-center gap-2 pt-3">
        <span class="rounded-full bg-rosewood-50 px-3 py-1 text-xs font-semibold text-rosewood-700 ring-1 ring-rosewood-100">
          {{ item.price }}
        </span>
        <span class="hidden rounded-full px-3 py-1 text-xs text-charcoal-soft ring-1 ring-charcoal/10 sm:inline">
          {{ item.sub }}
        </span>
        <NuxtLink
          :to="listingLink(item)"
          class="ml-auto inline-flex items-center gap-1.5 rounded-full bg-rosewood px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rosewood-700"
        >
          View details
          <AppIcon name="arrowRight" :size="13" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { categoryName } from '~/composables/useCatalog'
import { listingLink } from '~/composables/useListing'

const props = defineProps({ item: { type: Object, required: true } })
const { isFavourite, toggleFavourite } = useFavourites()
const fav = computed(() => isFavourite(props.item.id))
const category = computed(() => categoryName(props.item.categoryKey))

// Monogram for listings without an owner photo, e.g. "Raja Jewellers" -> "RJ"
const initials = computed(() =>
  props.item.name
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
)
</script>
