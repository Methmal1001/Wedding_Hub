<template>
  <article
    class="group relative flex h-full flex-col rounded-[28px] bg-white p-2.5 shadow-soft ring-1 ring-rosewood/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
  >
    <!-- Three-photo collage -->
    <div class="relative grid grid-cols-3 gap-1.5 overflow-hidden rounded-[22px]">
      <div v-for="(src, i) in item.gallery" :key="src" class="aspect-[4/5] overflow-hidden" :class="tileRadius(i)">
        <img
          :src="src"
          :alt="`${item.name} – ${item.sub} photo ${i + 1}`"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        >
      </div>

      <button
        type="button"
        class="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all duration-300 hover:scale-110"
        :class="fav ? 'bg-rosewood text-white' : 'bg-white/90 text-rosewood hover:bg-white'"
        :aria-pressed="fav"
        :aria-label="fav ? `Remove ${item.name} from favourites` : `Save ${item.name} to favourites`"
        @click="toggleFavourite(item)"
      >
        <AppIcon :key="String(fav)" name="heart" :size="16" :filled="fav" :class="{ 'animate-heart-pop': fav }" />
      </button>
    </div>

    <!-- Avatar (or monogram logo) overlapping the collage -->
    <div class="relative -mt-10 flex justify-center">
      <div class="relative">
        <img
          v-if="item.avatar"
          :src="item.avatar"
          :alt="`${item.owner}, ${item.name}`"
          loading="lazy"
          class="h-20 w-20 rounded-full object-cover shadow-soft ring-4 ring-white transition-transform duration-500 group-hover:scale-105"
        >
        <span
          v-else
          class="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-rosewood to-rosewood-800 font-serif text-2xl font-semibold tracking-wide text-white shadow-soft ring-4 ring-white transition-transform duration-500 group-hover:scale-105"
          aria-hidden="true"
        >
          {{ initials }}
        </span>
        <span
          v-if="item.verified"
          class="absolute -right-0.5 bottom-0.5 grid h-6 w-6 place-items-center rounded-full bg-white text-emerald-600 shadow"
          title="Verified by Wedding Hub"
        >
          <AppIcon name="verified" :size="16" />
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="flex flex-1 flex-col items-center px-3 pb-4 pt-3 text-center">
      <h3 class="font-serif text-[1.45rem] font-semibold leading-tight text-charcoal transition-colors group-hover:text-rosewood">
        {{ item.name }}
      </h3>
      <p class="mt-0.5 text-xs text-charcoal-soft">{{ item.owner ? `by ${item.owner}` : category }}</p>

      <p class="mt-2 flex items-center gap-2 text-sm text-charcoal-soft">
        <template v-if="item.rating">
          <span class="flex items-center gap-1 font-semibold text-charcoal">
            <AppIcon name="star" :size="14" filled class="text-gold" />
            {{ item.rating.toFixed(1) }}
          </span>
          <span class="text-charcoal-soft/50">•</span>
        </template>
        <span class="flex items-center gap-1">
          <AppIcon name="pin" :size="14" class="text-rosewood" />
          {{ item.area || item.location }}
        </span>
      </p>

      <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span class="rounded-full bg-rosewood-50 px-3.5 py-1.5 text-[13px] font-semibold text-rosewood-700 ring-1 ring-rosewood-100">
          {{ item.price }}
        </span>
        <span class="rounded-full px-3.5 py-1.5 text-[13px] text-charcoal-soft ring-1 ring-charcoal/10">
          {{ item.sub }}
        </span>
      </div>

      <NuxtLink
        :to="listingLink(item)"
        class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-rosewood transition hover:gap-2.5 hover:text-rosewood-800"
      >
        View profile
        <AppIcon name="arrowRight" :size="15" />
      </NuxtLink>
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

// Small inner gaps; only the outer corners of the collage are rounded.
const tileRadius = (i) => (i === 0 ? 'rounded-l-[22px] rounded-r-md' : i === 2 ? 'rounded-r-[22px] rounded-l-md' : 'rounded-md')
</script>
