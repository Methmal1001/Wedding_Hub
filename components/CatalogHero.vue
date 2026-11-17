<template>
  <section
    class="relative isolate overflow-hidden bg-rosewood-900 text-white"
    aria-roledescription="carousel"
    aria-label="Wedding Hub catalog highlights"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <div
      v-for="(slide, i) in slides"
      :key="slide.image"
      class="catalog-slide absolute inset-0 -z-10"
      :class="{ 'is-active': i === index }"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${i + 1} of ${slides.length}`"
      :aria-hidden="i !== index"
    >
      <img
        :src="slide.image"
        alt=""
        class="catalog-slide-image h-full w-full object-cover"
        :loading="i === 0 ? 'eager' : 'lazy'"
      >
    </div>
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-gradient-to-r from-rosewood-900/90 via-rosewood-900/65 to-rosewood-900/20" />
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-rosewood-900/65 to-transparent" />

    <div class="container-site flex min-h-[320px] flex-col justify-center py-10 sm:min-h-[360px] sm:py-12 lg:min-h-[400px]">
      <nav aria-label="Breadcrumb" class="text-xs text-white/70">
        <NuxtLink to="/" class="transition hover:text-white">Home</NuxtLink>
        <span class="mx-2 text-white/35">/</span>
        <span class="text-gold-light">Catalog</span>
      </nav>

      <p class="mt-6 text-[11px] font-medium uppercase tracking-[0.32em] text-gold-light">Wedding Hub · Sri Lanka</p>
      <Transition name="catalog-copy" mode="out-in">
        <div :key="index" class="mt-3 max-w-3xl" aria-live="polite">
          <h1 class="font-serif text-[2.35rem] font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            {{ slides[index]?.title }}
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {{ slides[index]?.description }}
          </p>
        </div>
      </Transition>

      <div v-if="slides.length > 1" class="mt-6 flex items-center gap-4">
        <button type="button" class="hero-arrow" aria-label="Previous banner" @click="prev">
          <AppIcon name="arrowRight" :size="16" class="rotate-180" />
        </button>
        <div class="flex items-center gap-2">
          <button
            v-for="(slide, i) in slides"
            :key="slide.image + '-dot'"
            type="button"
            class="hero-dot"
            :class="{ 'is-on': i === index }"
            :aria-label="`Show banner ${i + 1}`"
            :aria-current="i === index"
            @click="go(i)"
          >
            <span v-if="i === index" :key="tick" class="hero-dot-progress" :class="{ 'is-paused': paused }" :style="{ animationDuration: `${INTERVAL}ms` }" />
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
const INTERVAL = 6000
const slides = [
  {
    image: '/images/cat-venues.jpg',
    title: 'Find the perfect place to say “I do”',
    description: 'Explore beautiful venues and wedding professionals from across Sri Lanka.'
  },
  {
    image: '/images/cat-photographers.jpg',
    title: 'Make every moment last forever',
    description: 'Discover photographers and creatives ready to capture your celebration.'
  },
  {
    image: '/images/cat-dresses.jpg',
    title: 'Bring your wedding vision to life',
    description: 'Find the people and details that make your day unmistakably yours.'
  }
]

const { index, tick, paused, go, next, prev, pause, resume } = useRotator(computed(() => slides.length), INTERVAL)
</script>

<style scoped>
.catalog-slide {
  opacity: 0;
  transition: opacity 1s ease;
}
.catalog-slide.is-active {
  opacity: 1;
}
.catalog-slide-image {
  transform: scale(1.04);
  transition: transform 7s ease-out;
}
.catalog-slide.is-active .catalog-slide-image {
  transform: scale(1.12);
}
.hero-arrow {
  @apply grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-rosewood-800;
}
.hero-dot {
  @apply relative h-1.5 w-6 overflow-hidden rounded-full bg-white/30 transition-all duration-300 hover:bg-white/60;
}
.hero-dot.is-on {
  @apply w-12 bg-white/30;
}
.hero-dot-progress {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: #E6D3A8;
  animation: catalog-dot-progress linear forwards;
}
.hero-dot-progress.is-paused {
  animation-play-state: paused;
}
@keyframes catalog-dot-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
.catalog-copy-enter-active,
.catalog-copy-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.catalog-copy-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.catalog-copy-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .catalog-slide,
  .catalog-slide-image,
  .catalog-copy-enter-active,
  .catalog-copy-leave-active {
    transition: none;
  }
  .hero-dot-progress {
    animation: none;
    transform: none;
  }
}
</style>
