<template>
  <section id="inspiration" class="px-4 sm:px-6 lg:px-10">
    <div class="relative isolate mx-auto max-w-site overflow-hidden rounded-[32px] sm:rounded-[40px]">
      <img
        src="/images/inspiration-banner.jpg"
        alt="Bride and groom walking hand in hand across golden hills at sunset"
        loading="lazy"
        class="parallax-img absolute inset-0 -z-10 h-[120%] w-full object-cover"
        :style="{ transform: `translate3d(0, ${offset}px, 0)` }"
      >
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#03102E]/85 via-[#0A1F5C]/55 to-[#0A1F5C]/10" />

      <div class="grid items-center gap-10 px-6 py-20 sm:px-12 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:px-20 lg:py-32">
        <div v-reveal class="max-w-xl text-white">
          <p class="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em] text-blush sm:text-xs">
            <span class="h-px w-10 bg-blush/70" /> Wedding Ideas &amp; Inspiration
          </p>
          <h2 class="mt-5 font-serif text-[2.4rem] font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Your Dream Wedding <span class="italic text-blush">Starts Here.</span>
          </h2>
          <p class="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            Get inspired, discover amazing wedding ideas, and find the perfect professionals for your special day.
          </p>
          <button type="button" class="btn-gold btn-shine mt-8" @click="comingSoon('The Wedding Inspiration gallery')">
            Explore Wedding Inspiration
            <AppIcon name="sparkles" :size="17" />
          </button>
        </div>

        <!-- Idea tags -->
        <ul v-reveal="200" class="flex flex-wrap gap-2.5 lg:justify-end">
          <li
            v-for="idea in ideas"
            :key="idea"
            class="cursor-default rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:border-blush hover:bg-blush hover:text-rosewood-800"
          >
            {{ idea }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const { comingSoon } = useToast()

const ideas = [
  'Poruwa ceremony décor',
  'Beach weddings',
  'Kandyan bridal looks',
  'Tropical florals',
  'Hill-country elopements',
  'Homecoming outfits',
  'Pre-shoot locations'
]

// Gentle parallax on the banner image.
const offset = ref(0)
let el = null
let raf = 0
const update = () => {
  raf = 0
  if (!el) return
  const rect = el.getBoundingClientRect()
  // Image is 120% tall with -10% top, so it may shift ±10% of the banner height.
  const max = rect.height * 0.1
  const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
  offset.value = Math.max(-max, Math.min(max, progress * max))
}
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(update)
}

onMounted(() => {
  el = document.getElementById('inspiration')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
.parallax-img {
  top: -10%;
  will-change: transform;
}
</style>
