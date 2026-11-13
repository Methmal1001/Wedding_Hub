<template>
  <section id="home" class="relative isolate flex min-h-[calc(100svh-108px)] items-center">
    <!-- Background photograph -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <img
        src="/images/hero-couple.jpg"
        alt="Bride and groom holding a romantic bouquet in warm golden light"
        class="h-full w-full object-cover object-[30%_center]"
        :class="{ 'hero-bg-zoom': ready }"
        fetchpriority="high"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-[#241319]/90 via-[#3a1d29]/70 to-[#3a1d29]/30" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#241319]/70 via-transparent to-transparent" />
    </div>

    <!-- Decorative floating elements -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block">
      <span class="animate-float-soft absolute right-[12%] top-[18%] h-24 w-24 rounded-full border border-blush/25" />
      <span class="animate-float-soft absolute right-[22%] top-[30%] h-3 w-3 rounded-full bg-blush/60 [animation-delay:-2s]" />
      <span class="animate-float-soft absolute bottom-[30%] right-[8%] h-40 w-40 rounded-full border border-gold/20 [animation-delay:-4s]" />
    </div>

    <div class="container-site relative py-14 sm:py-16 lg:py-14">
      <div class="max-w-3xl" :class="ready ? 'hero-in' : 'opacity-0'">
        <p class="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em] text-blush sm:text-xs">
          <span class="h-px w-10 bg-blush/70" />
          Make your dream wedding a reality
        </p>

        <h1 class="mt-5 font-serif text-[2.75rem] font-semibold leading-[1.02] text-white sm:text-6xl lg:text-[4.6rem]">
          Everything You Need
          <span class="block">
            For Your <span class="italic text-blush">Perfect</span> Wedding.
          </span>
        </h1>

        <p class="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          Discover the best wedding professionals, beautiful venues, and inspiring ideas to make your special day
          unforgettable.
        </p>

        <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button type="button" class="btn-gold btn-shine" @click="scrollTo('vendors')">
            Explore Wedding Vendors
            <AppIcon name="arrowRight" :size="17" />
          </button>
          <button type="button" class="btn-ghost-light" @click="scrollTo('venues')">
            Discover Wedding Venues
          </button>
        </div>

        <!-- Trust stats -->
        <dl class="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6 text-white">
          <div v-for="s in stats" :key="s.label">
            <dt class="text-[11px] uppercase tracking-[0.18em] text-white/60">{{ s.label }}</dt>
            <dd class="mt-1 font-serif text-2xl font-semibold text-blush sm:text-3xl">{{ s.value }}</dd>
          </div>
        </dl>
      </div>

      <!-- Search -->
      <div class="relative z-20 mt-10 max-w-5xl lg:mt-10" :class="ready ? 'hero-in' : 'opacity-0'">
        <div style="animation-delay: 0.8s">
          <SearchPanel />
        </div>
      </div>
    </div>

    <!-- Scroll cue -->
    <button
      type="button"
      class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 transition hover:text-white lg:flex"
      aria-label="Scroll to wedding services"
      @click="scrollTo('services')"
    >
      Scroll
      <span class="relative h-10 w-[1px] overflow-hidden bg-white/20">
        <span class="scroll-dot absolute left-0 top-0 h-3 w-full bg-blush" />
      </span>
    </button>
  </section>
</template>

<script setup>
defineProps({ ready: { type: Boolean, default: true } })
const scrollTo = useScrollTo()

const stats = [
  { label: 'Vendors', value: '1,100+' },
  { label: 'Venues', value: '240+' },
  { label: 'Happy couples', value: '18k' }
]
</script>

<style scoped>
.scroll-dot {
  animation: scroll-dot 1.8s ease-in-out infinite;
}
@keyframes scroll-dot {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(350%); }
}
</style>
