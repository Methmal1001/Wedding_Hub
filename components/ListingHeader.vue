<template>
  <!-- Listing identity card: sits just under the paid banner -->
  <section class="container-site relative z-10 -mt-10 sm:-mt-14">
    <div class="rounded-[28px] bg-white p-5 shadow-lift ring-1 ring-rosewood/10 sm:p-7">
      <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-y-1 text-xs text-charcoal-soft">
        <NuxtLink to="/" class="transition hover:text-rosewood">Home</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <NuxtLink to="/catalog" class="transition hover:text-rosewood">Categories</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <NuxtLink :to="catalogLink({ category: listing.categoryKey })" class="transition hover:text-rosewood">{{ listing.categoryName }}</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <NuxtLink :to="catalogLink({ category: listing.categoryKey, sub: listing.sub })" class="transition hover:text-rosewood">{{ listing.sub }}</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <span class="text-rosewood">{{ listing.name }}</span>
      </nav>

      <div class="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-4 sm:gap-5">
          <img
            v-if="listing.avatar"
            :src="listing.avatar"
            :alt="listing.owner || listing.name"
            class="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-soft ring-4 ring-blush-light sm:h-24 sm:w-24"
          >
          <span
            v-else
            class="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rosewood to-rosewood-800 font-serif text-3xl font-semibold text-white shadow-soft ring-4 ring-blush-light sm:h-24 sm:w-24"
            aria-hidden="true"
          >
            {{ initials }}
          </span>

          <div class="min-w-0">
            <p class="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-dark">
              {{ listing.sub }}
              <span v-if="listing.verified" class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] tracking-normal text-emerald-700 ring-1 ring-emerald-200">
                <AppIcon name="verified" :size="12" />
                Verified
              </span>
            </p>
            <h1 class="mt-1.5 font-serif text-[2rem] font-semibold leading-[1.05] text-charcoal sm:text-5xl">{{ listing.name }}</h1>
            <p class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-charcoal-soft">
              <span v-if="listing.rating" class="flex items-center gap-1 font-semibold text-charcoal">
                <AppIcon name="star" :size="15" filled class="text-gold" />
                {{ listing.rating.toFixed(1) }}
                <span v-if="listing.reviewCount" class="font-normal text-charcoal-soft">({{ listing.reviewCount }} reviews)</span>
              </span>
              <span class="flex items-center gap-1">
                <AppIcon name="pin" :size="15" class="text-rosewood" />
                {{ listing.area || listing.location }}
              </span>
              <span v-if="listing.owner">by {{ listing.owner }}</span>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <a v-if="listing.phones.length" :href="`tel:${listing.phones[0].replace(/[^\d+]/g, '')}`" class="btn-primary !min-h-[46px] !px-5 text-sm">
            <AppIcon name="phone" :size="16" />
            Call now
          </a>
          <button type="button" class="btn-outline !min-h-[46px] !px-5 text-sm" @click="$emit('enquire')">
            <AppIcon name="mail" :size="16" />
            Send enquiry
          </button>
          <button
            type="button"
            class="icon-btn"
            :class="{ 'is-on': fav }"
            :aria-pressed="fav"
            :aria-label="fav ? 'Remove from favourites' : 'Save to favourites'"
            @click="toggleFavourite(listing)"
          >
            <AppIcon :key="String(fav)" name="heart" :size="17" :filled="fav" :class="{ 'animate-heart-pop': fav }" />
          </button>
          <button type="button" class="icon-btn" aria-label="Share" @click="share">
            <AppIcon name="arrowRight" :size="17" class="-rotate-45" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { catalogLink } from '~/composables/useCatalog'

const props = defineProps({ listing: { type: Object, required: true } })
defineEmits(['enquire'])

const { isFavourite, toggleFavourite } = useFavourites()
const { show } = useToast()
const fav = computed(() => isFavourite(props.listing.id))

const initials = computed(() =>
  props.listing.name
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
)

const share = async () => {
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: props.listing.name, url })
      return
    }
    await navigator.clipboard.writeText(url)
    show('Link copied to clipboard')
  } catch {
    // Share sheet dismissed or clipboard blocked – nothing to do.
  }
}
</script>

<style scoped>
.icon-btn {
  @apply grid h-[46px] w-[46px] place-items-center rounded-full text-rosewood ring-1 ring-rosewood/25 transition hover:bg-rosewood-50;
}
.icon-btn.is-on {
  @apply bg-rosewood text-white ring-rosewood hover:bg-rosewood-700;
}
</style>
