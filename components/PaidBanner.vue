<template>
  <!-- Rotating paid (sponsored) banner ads -->
  <section
    v-if="ads.length"
    class="relative isolate overflow-hidden bg-rosewood-900 text-white"
    aria-roledescription="carousel"
    aria-label="Sponsored banners"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <div
      v-for="(ad, i) in ads"
      :key="ad.id"
      class="slide absolute inset-0"
      :class="{ 'is-active': i === index }"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${i + 1} of ${ads.length}: ${ad.name}`"
      :aria-hidden="i !== index"
    >
      <img :src="ad.image" alt="" class="slide-img h-full w-full object-cover" :loading="i === 0 ? 'eager' : 'lazy'">
      <div class="absolute inset-0 bg-gradient-to-r from-rosewood-900/95 via-rosewood-900/70 to-rosewood-900/10" />
    </div>

    <div class="container-site relative flex min-h-[360px] flex-col justify-center pb-20 pt-10 sm:min-h-[420px] sm:pb-24">
      <!-- All ad texts share one grid cell, so the banner fits the tallest one -->
      <div class="grid max-w-2xl">
        <div
          v-for="(ad, i) in ads"
          :key="`c${ad.id}`"
          class="ad-copy [grid-area:1/1]"
          :class="{ 'is-active': i === index }"
          :aria-hidden="i !== index"
        >
          <p class="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-light">
            <span class="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-rosewood-800">Sponsored</span>
            {{ ad.category }}
          </p>
          <p class="mt-3 font-serif text-[2.1rem] font-semibold leading-[1.05] sm:text-5xl">{{ ad.name }}</p>
          <p class="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{{ ad.description }}</p>
          <p class="mt-3 flex items-start gap-1.5 text-xs text-white/70 sm:text-sm">
            <AppIcon name="pin" :size="15" class="mt-px shrink-0 text-gold-light" />
            {{ ad.address }}
          </p>
          <div class="mt-5 flex flex-wrap gap-2.5">
            <NuxtLink
              :to="ad.to"
              class="btn-gold !min-h-[44px] !px-5 text-sm"
              :tabindex="i === index ? 0 : -1"
            >
              View vendor
              <AppIcon name="arrowRight" :size="15" />
            </NuxtLink>
            <a
              :href="`tel:${ad.phone.replace(/[^\d+]/g, '')}`"
              class="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur transition hover:bg-white hover:text-rosewood-800"
              :tabindex="i === index ? 0 : -1"
            >
              <AppIcon name="phone" :size="15" />
              {{ ad.phone }}
            </a>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div v-if="ads.length > 1" class="mt-6 flex items-center gap-4">
        <button type="button" class="ctl" aria-label="Previous banner" @click="prev">
          <AppIcon name="arrowRight" :size="15" class="rotate-180" />
        </button>
        <div class="flex items-center gap-2">
          <button
            v-for="(ad, i) in ads"
            :key="`d${ad.id}`"
            type="button"
            class="dot"
            :class="{ 'is-on': i === index }"
            :aria-label="`Show ${ad.name}`"
            :aria-current="i === index"
            @click="go(i)"
          >
            <span v-if="i === index" :key="tick" class="dot-fill" :class="{ 'is-paused': paused }" :style="{ animationDuration: INTERVAL + 'ms' }" />
          </button>
        </div>
        <button type="button" class="ctl" aria-label="Next banner" @click="next">
          <AppIcon name="arrowRight" :size="15" />
        </button>
      </div>
    </div>

    <NuxtLink
      to="/list-your-business#advertising"
      class="absolute right-4 top-4 hidden rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-white/80 ring-1 ring-white/20 backdrop-blur transition hover:bg-white hover:text-rosewood-800 sm:block"
    >
      Advertise here
    </NuxtLink>
  </section>
</template>

<script setup>
import { vendors } from '~/data/vendors'
import { catalog } from '~/data/catalog'
import { catalogLink } from '~/composables/useCatalog'
import { listingLink } from '~/composables/useListing'

const props = defineProps({
  // Ads from this category are shown first.
  categoryKey: { type: String, default: '' },
  // Never advertise the listing that is being viewed.
  excludeName: { type: String, default: '' }
})

const INTERVAL = 5500

const ads = computed(() => {
  const list = vendors.filter((v) => v.name !== props.excludeName)
  const own = list.filter((v) => v.categoryKey === props.categoryKey)
  const rest = list.filter((v) => v.categoryKey !== props.categoryKey)
  return [...own, ...rest].map((v) => {
    const listing = catalog.find((l) => l.name === v.name)
    return { ...v, to: listing ? listingLink(listing) : catalogLink({ category: v.categoryKey }) }
  })
})

const { index, tick, paused, go, next, prev, pause, resume } = useRotator(computed(() => ads.value.length), INTERVAL)
</script>

<style scoped>
.slide {
  opacity: 0;
  transition: opacity 1.1s ease;
}
.slide.is-active {
  opacity: 1;
}
.slide-img {
  transform: scale(1.03);
  transition: transform 7s ease-out;
}
.slide.is-active .slide-img {
  transform: scale(1.1);
}
.ad-copy {
  opacity: 0;
  visibility: hidden;
  transform: translateY(14px);
  transition: opacity 0.6s ease, transform 0.6s ease, visibility 0s linear 0.6s;
}
.ad-copy.is-active {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s, visibility 0s;
}
.ctl {
  @apply grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-rosewood-800;
}
.dot {
  @apply relative h-1.5 w-6 overflow-hidden rounded-full bg-white/30 transition-all duration-300 hover:bg-white/60;
}
.dot.is-on {
  @apply w-12;
}
.dot-fill {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: #E6D3A8;
  animation: dot-progress linear forwards;
}
.dot-fill.is-paused {
  animation-play-state: paused;
}
@keyframes dot-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
  .slide,
  .slide-img,
  .ad-copy {
    transition: none;
  }
  .dot-fill {
    animation: none;
    transform: none;
  }
}
</style>
