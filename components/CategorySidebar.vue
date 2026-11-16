<template>
  <aside class="space-y-6" aria-label="Sponsored and search">
    <!-- 1. Rotating sponsored vendor banner -->
    <div
      v-if="ads.length"
      class="ad-card relative overflow-hidden rounded-3xl bg-rosewood-900 text-white shadow-lift"
      aria-roledescription="carousel"
      aria-label="Featured vendors"
      @mouseenter="ad.pause"
      @mouseleave="ad.resume"
      @focusin="ad.pause"
      @focusout="ad.resume"
    >
      <div class="relative aspect-[4/5]">
        <div
          v-for="(v, i) in ads"
          :key="v.id"
          class="ad-slide absolute inset-0"
          :class="{ 'is-active': i === ad.index }"
          :aria-hidden="i !== ad.index"
        >
          <img :src="v.image" :alt="`${v.name} – ${v.category}`" class="h-full w-full object-cover" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-rosewood-900 via-rosewood-900/45 to-transparent" />

          <div class="absolute inset-x-0 bottom-0 p-5">
            <p class="text-[10px] font-medium uppercase tracking-[0.28em] text-gold-light">{{ v.category }}</p>
            <h3 class="mt-1.5 font-serif text-2xl font-semibold leading-tight">{{ v.name }}</h3>
            <p class="mt-2 flex items-start gap-1.5 text-xs text-white/75">
              <AppIcon name="pin" :size="14" class="mt-px shrink-0 text-gold-light" />
              {{ v.address }}
            </p>
            <a :href="`tel:${v.phone.replace(/[^\d+]/g, '')}`" class="mt-1 flex items-center gap-1.5 text-xs text-white/75 hover:text-white" :tabindex="i === ad.index ? 0 : -1">
              <AppIcon name="phone" :size="14" class="shrink-0 text-gold-light" />
              {{ v.phone }}
            </a>
            <NuxtLink
              :to="catalogLink({ category: v.categoryKey, q: v.name })"
              class="btn-gold mt-4 !min-h-[40px] w-full !px-4 text-[13px]"
              :tabindex="i === ad.index ? 0 : -1"
            >
              View vendor
              <AppIcon name="arrowRight" :size="15" />
            </NuxtLink>
          </div>
        </div>

        <span class="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rosewood-800">
          Featured
        </span>
        <div class="absolute right-3 top-3 flex gap-1.5">
          <button type="button" class="mini-arrow" aria-label="Previous vendor" @click="ad.prev">
            <AppIcon name="arrowRight" :size="13" class="rotate-180" />
          </button>
          <button type="button" class="mini-arrow" aria-label="Next vendor" @click="ad.next">
            <AppIcon name="arrowRight" :size="13" />
          </button>
        </div>
      </div>

      <!-- progress -->
      <div class="flex gap-1 px-5 pb-4 pt-0">
        <button
          v-for="(v, i) in ads"
          :key="`d${v.id}`"
          type="button"
          class="relative h-1 flex-1 overflow-hidden rounded-full bg-white/20"
          :aria-label="`Show ${v.name}`"
          :aria-current="i === ad.index"
          @click="ad.go(i)"
        >
          <span v-if="i < ad.index" class="absolute inset-0 bg-gold-light/70" />
          <span
            v-else-if="i === ad.index"
            :key="ad.tick"
            class="bar-fill absolute inset-0 bg-gold-light"
            :class="{ 'is-paused': ad.paused }"
            :style="{ animationDuration: AD_INTERVAL + 'ms' }"
          />
        </button>
      </div>
    </div>

    <!-- 2. Refine your search -->
    <form class="card-surface p-5" @submit.prevent="findVendors">
      <h3 class="font-serif text-xl font-semibold">Refine Your Search</h3>
      <p class="mt-1 text-xs text-charcoal-soft">Pick a category and service to find the right vendor.</p>

      <label class="mt-4 block">
        <span class="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal-soft">Vendor category</span>
        <select v-model="pickCat" class="side-select mt-1.5">
          <option v-for="c in weddingCategories" :key="c.key" :value="c.key">{{ c.name }}</option>
        </select>
      </label>
      <label class="mt-3 block">
        <span class="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal-soft">Service</span>
        <select v-model="pickSub" class="side-select mt-1.5">
          <option value="">All services</option>
          <option v-for="s in pickSubs" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>
      <button type="submit" class="btn-primary mt-5 !min-h-[44px] w-full text-sm">
        <AppIcon name="search" :size="16" />
        Find Vendors
      </button>
    </form>

    <!-- 3. Rotating promotion slot -->
    <div
      class="relative overflow-hidden rounded-3xl"
      aria-roledescription="carousel"
      aria-label="Wedding Hub promotions"
      @mouseenter="promo.pause"
      @mouseleave="promo.resume"
      @focusin="promo.pause"
      @focusout="promo.resume"
    >
      <div class="relative aspect-[5/4]">
        <div
          v-for="(p, i) in promos"
          :key="p.title"
          class="ad-slide absolute inset-0"
          :class="{ 'is-active': i === promo.index }"
          :aria-hidden="i !== promo.index"
        >
          <img :src="p.image" alt="" class="h-full w-full object-cover" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-br from-rosewood/85 via-rosewood-800/75 to-rosewood-900/90" />
          <div class="absolute inset-0 flex flex-col justify-end p-5 text-white">
            <span class="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-gold-light ring-1 ring-white/25">
              <AppIcon :name="p.icon" :size="18" />
            </span>
            <h3 class="mt-3 font-serif text-xl font-semibold leading-tight">{{ p.title }}</h3>
            <p class="mt-1 text-xs leading-relaxed text-white/80">{{ p.text }}</p>
            <button
              type="button"
              class="mt-3 inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-gold-light hover:text-white"
              :tabindex="i === promo.index ? 0 : -1"
              @click="p.action"
            >
              {{ p.cta }}
              <AppIcon name="arrowRight" :size="14" />
            </button>
          </div>
        </div>
      </div>
      <div class="absolute right-4 top-4 flex gap-1.5">
        <button
          v-for="(p, i) in promos"
          :key="`pd${i}`"
          type="button"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="i === promo.index ? 'w-5 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'"
          :aria-label="`Show promotion ${i + 1}`"
          :aria-current="i === promo.index"
          @click="promo.go(i)"
        />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'
import { catalogLink } from '~/composables/useCatalog'
import { sponsoredBanners } from '~/composables/useCategoryPage'

const props = defineProps({
  categoryKey: { type: String, required: true },
  sub: { type: String, default: '' }
})

const scrollTo = useScrollTo()

// 1. Sponsored vendors (this category's vendors first)
const AD_INTERVAL = 4500
const ads = computed(() => sponsoredBanners(props.categoryKey))
const ad = reactive(useRotator(computed(() => ads.value.length), AD_INTERVAL))

// 2. Refine search
const pickCat = ref(props.categoryKey)
const pickSub = ref(props.sub)
watch(() => props.categoryKey, (v) => { pickCat.value = v })
watch(() => props.sub, (v) => { pickSub.value = v })
const pickSubs = computed(() => weddingCategories.find((c) => c.key === pickCat.value)?.subcategories || [])
watch(pickCat, () => {
  if (!pickSubs.value.includes(pickSub.value)) pickSub.value = ''
})
const findVendors = () => navigateTo(catalogLink({ category: pickCat.value, sub: pickSub.value }))

// 3. Promotions
const promos = [
  {
    icon: 'store',
    title: 'Advertise with us',
    text: 'Put your business in front of thousands of couples planning their big day.',
    cta: 'List your business',
    image: '/images/business-cta.jpg',
    action: () => scrollTo('business')
  },
  {
    icon: 'rings',
    title: 'Find your dream venue',
    text: 'Hotels, banquet halls and destination venues across Sri Lanka.',
    cta: 'Browse venues',
    image: '/images/cat-venues.jpg',
    action: () => navigateTo(catalogLink({ category: 'venues' }))
  },
  {
    icon: 'sparkles',
    title: 'Wedding ideas & inspiration',
    text: 'Real weddings, décor themes and styling tips to spark your plans.',
    cta: 'Get inspired',
    image: '/images/inspiration-banner.jpg',
    action: () => scrollTo('inspiration')
  }
]
const promo = reactive(useRotator(promos.length, 6000))
</script>

<style scoped>
.ad-slide {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.9s ease, visibility 0s linear 0.9s;
}
.ad-slide.is-active {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.9s ease, visibility 0s;
}
.mini-arrow {
  @apply grid h-8 w-8 place-items-center rounded-full bg-rosewood-900/45 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white hover:text-rosewood-800;
}
.bar-fill {
  transform-origin: left;
  animation: bar-progress linear forwards;
}
.bar-fill.is-paused {
  animation-play-state: paused;
}
@keyframes bar-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.side-select {
  @apply h-11 w-full cursor-pointer rounded-xl border border-rosewood/15 bg-white px-3 text-sm text-charcoal outline-none transition focus:border-rosewood/40 focus:ring-4 focus:ring-rosewood/10;
}
@media (prefers-reduced-motion: reduce) {
  .ad-slide {
    transition: none;
  }
  .bar-fill {
    animation: none;
  }
}
</style>
