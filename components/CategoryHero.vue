<template>
  <!-- Rotating main banner for a category page -->
  <section
    class="category-hero relative isolate overflow-hidden bg-rosewood-900 text-white"
    aria-roledescription="carousel"
    :aria-label="`${title} banner`"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <!-- Slides (cross-fade + slow zoom) -->
    <div
      v-for="(s, i) in slides"
      :key="s.image + i"
      class="slide absolute inset-0 -z-10"
      :class="{ 'is-active': i === index }"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${i + 1} of ${slides.length}`"
      :aria-hidden="i !== index"
    >
      <img :src="s.image" alt="" class="slide-img h-full w-full object-cover" :loading="i === 0 ? 'eager' : 'lazy'">
    </div>
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-gradient-to-r from-rosewood-900/90 via-rosewood-900/60 to-rosewood-900/10" />
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-rosewood-900/70 to-transparent" />

    <div class="container-site flex min-h-[360px] flex-col justify-center py-12 sm:min-h-[420px] lg:min-h-[460px]">
      <nav aria-label="Breadcrumb" class="text-xs text-white/70">
        <NuxtLink to="/" class="transition hover:text-white">Home</NuxtLink>
        <span class="mx-2 text-white/35">/</span>
        <NuxtLink to="/catalog" class="transition hover:text-white">Categories</NuxtLink>
        <span class="mx-2 text-white/35">/</span>
        <template v-if="sub">
          <NuxtLink :to="catalogLink({ category: category.key })" class="transition hover:text-white">{{ category.name }}</NuxtLink>
          <span class="mx-2 text-white/35">/</span>
        </template>
        <span class="text-gold-light">{{ title }}</span>
      </nav>

      <p class="mt-6 text-[11px] font-medium uppercase tracking-[0.32em] text-gold-light">
        {{ eyebrow || `${category.vendorCount}+ vendors · ${category.subcategories.length} ${category.subcategories.length === 1 ? 'service' : 'services'}` }}
      </p>
      <h1 class="mt-3 max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
        {{ title }}
      </h1>
      <p v-if="tagline" class="mt-3 font-script text-3xl leading-none text-blush sm:text-4xl">{{ tagline }}</p>

      <!-- Changing headline for the current slide -->
      <div class="relative mt-6 h-14 max-w-xl overflow-hidden sm:h-8" aria-live="polite">
        <Transition name="headline">
          <p :key="index" class="absolute inset-x-0 top-0 flex items-start gap-2.5 text-[15px] text-white/90 sm:text-base">
            <AppIcon name="sparkles" :size="18" class="mt-0.5 shrink-0 text-gold-light" />
            {{ slides[index]?.headline }}
          </p>
        </Transition>
      </div>

      <!-- Controls -->
      <div v-if="slides.length > 1" class="mt-6 flex items-center gap-4">
        <button type="button" class="hero-arrow" aria-label="Previous banner" @click="prev">
          <AppIcon name="arrowRight" :size="16" class="rotate-180" />
        </button>
        <div class="flex items-center gap-2">
          <button
            v-for="(s, i) in slides"
            :key="`dot${i}`"
            type="button"
            class="dot"
            :class="{ 'is-on': i === index }"
            :aria-label="`Show banner ${i + 1}`"
            :aria-current="i === index"
            @click="go(i)"
          >
            <span v-if="i === index" :key="tick" class="dot-fill" :class="{ 'is-paused': paused }" :style="{ animationDuration: INTERVAL + 'ms' }" />
          </button>
        </div>
        <button type="button" class="hero-arrow" aria-label="Next banner" @click="next">
          <AppIcon name="arrowRight" :size="16" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { catalogLink } from '~/composables/useCatalog'

const props = defineProps({
  category: { type: Object, required: true },
  slides: { type: Array, required: true },
  tagline: { type: String, default: '' },
  // Set on a sub-category page: becomes the title, and the category joins the breadcrumb.
  sub: { type: String, default: '' },
  eyebrow: { type: String, default: '' }
})

const title = computed(() => props.sub || props.category.name)

const INTERVAL = 5500
const { index, tick, paused, go, next, prev, pause, resume } = useRotator(computed(() => props.slides.length), INTERVAL)
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
  transform: scale(1.04);
  transition: transform 7s ease-out;
}
.slide.is-active .slide-img {
  transform: scale(1.12);
}

.hero-arrow {
  @apply grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-rosewood-800;
}
.dot {
  @apply relative h-1.5 w-6 overflow-hidden rounded-full bg-white/30 transition-all duration-300 hover:bg-white/60;
}
.dot.is-on {
  @apply w-12 bg-white/30;
}
.dot-fill {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: #E6D3A8;
  animation-name: dot-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
.dot-fill.is-paused {
  animation-play-state: paused;
}
@keyframes dot-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.headline-enter-active,
.headline-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.headline-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.headline-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}

@media (prefers-reduced-motion: reduce) {
  .slide,
  .slide-img {
    transition: none;
  }
  .dot-fill {
    animation: none;
    transform: none;
  }
}
</style>
