<template>
  <section id="home" class="relative isolate z-10 flex flex-col bg-white [overflow-x:clip] pb-10 pt-4 sm:pb-12 sm:pt-7 lg:min-h-[calc(100svh-108px)] lg:justify-start lg:pb-10 lg:pt-7">
    <!-- ===== Background: wedding rings gently floating down ===== -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span class="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-gold-light/10 blur-3xl" />
      <span class="absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-rosewood/[0.06] blur-3xl" />
      <div
        v-for="(r, i) in rings"
        :key="i"
        class="ring-fall"
        :class="{ 'hidden sm:block': r.desktopOnly }"
        :style="{
          left: r.x + '%',
          '--size': r.s + 'px',
          '--dur': r.d + 's',
          '--delay': r.delay + 's',
          '--sway': r.sway + 'px',
          '--spin': r.spin + 'deg',
          '--op': r.op
        }"
      >
        <div class="ring-sway">
          <svg :viewBox="r.pair ? '0 0 66 50' : '0 0 40 50'" class="ring-svg" :style="{ width: r.pair ? 'calc(var(--size) * 1.65)' : 'var(--size)' }">
            <defs>
              <!-- polished metal: light / mid / deep tones alternate like reflections -->
              <linearGradient :id="`m${i}`" x1="0" y1="0" x2="1" y2="1">
                <stop v-for="(c, k) in metals[r.metal]" :key="k" :offset="k / (metals[r.metal].length - 1)" :stop-color="c" />
              </linearGradient>
              <linearGradient :id="`d${i}`" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ffffff" />
                <stop offset="0.45" stop-color="#e3f6ff" />
                <stop offset="0.7" stop-color="#9fdcff" />
                <stop offset="1" stop-color="#f4fbff" />
              </linearGradient>
            </defs>

            <!-- band(s) -->
            <g v-for="cx in (r.pair ? [24, 42] : [20])" :key="cx">
              <circle :cx="cx" cy="32" r="13.5" fill="none" :stroke="`url(#m${i})`" :stroke-width="cx === 42 ? 3.4 : 4.4" />
              <circle :cx="cx" cy="32" r="15.6" fill="none" stroke="rgba(60,40,10,0.18)" stroke-width="0.5" />
              <circle :cx="cx" cy="32" r="11.4" fill="none" stroke="rgba(60,40,10,0.22)" stroke-width="0.5" />
              <path :d="`M${cx - 9} 23.5 A 12.6 12.6 0 0 1 ${cx + 6} 20.6`" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.1" stroke-linecap="round" />
            </g>

            <!-- engagement setting: prongs + faceted diamond + sparkle -->
            <g v-if="r.gem" :transform="`translate(${r.pair ? 4 : 0} 0)`">
              <path d="M16.6 19.2 L18.2 15.4 H21.8 L23.4 19.2 Z" :fill="`url(#m${i})`" />
              <polygon points="20,4.5 26.2,10 20,17.4 13.8,10" :fill="`url(#d${i})`" stroke="rgba(120,170,210,0.7)" stroke-width="0.45" />
              <path d="M13.8 10 H26.2 M17 10 L20 4.5 L23 10 L20 17.4 Z" fill="none" stroke="rgba(255,255,255,0.95)" stroke-width="0.45" />
              <path class="sparkle" d="M26.5 2.2 L27.3 4.6 L29.7 5.4 L27.3 6.2 L26.5 8.6 L25.7 6.2 L23.3 5.4 L25.7 4.6 Z" fill="#fff" />
            </g>
          </svg>
        </div>
      </div>
    </div>

    <h1 class="sr-only">Wedding Hub – everything you need for your perfect wedding in Sri Lanka</h1>

    <div class="w-full">
      <!-- Search (placed above the banner) – highlighted with a greeting and glowing border for signed-in users -->
      <div class="container-site relative z-20 mb-6 sm:mb-10 lg:mb-14" :class="ready ? 'hero-in' : 'opacity-0'">
        <div style="animation-delay: 0.1s">
          <Transition name="greet">
            <div v-if="user" class="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 sm:mb-3">
              <p class="flex items-center gap-2 text-sm text-charcoal sm:gap-2.5 sm:text-[15px]">
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-[#4DFF00] text-rosewood-900 sm:h-8 sm:w-8">
                  <AppIcon name="sparkles" :size="16" />
                </span>
                <span>Welcome back, <strong class="font-semibold text-rosewood">{{ firstName }}</strong><span class="hidden sm:inline"> – what are you looking for today?</span></span>
              </p>
              <NuxtLink to="/profile" class="hidden text-sm font-medium text-rosewood underline-offset-4 hover:underline sm:inline">My saved vendors →</NuxtLink>
            </div>
          </Transition>
          <div class="search-shell is-on" :class="{ 'is-spot': spotlight }">
            <span class="shell-border" aria-hidden="true" />
            <SearchPanel />
          </div>
        </div>
      </div>
      <!-- banner row is wider than the page container: it uses the free side space -->
      <div
        class="mx-auto grid w-full max-w-[1680px] items-center gap-10 px-4 sm:px-6 lg:px-8 xl:px-10 lg:grid-cols-[minmax(0,1.95fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12"
        :class="ready ? 'hero-in' : 'opacity-0'"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured"
        @mouseenter="main.pause(true)"
        @mouseleave="main.pause(false)"
        @focusin="main.pause(true)"
        @focusout="main.pause(false)"
      >
        <!-- ===== Large image banner (pictures only) – bleeds to the left edge ===== -->
        <div class="image-col relative">
          <!-- decorative layers behind the picture -->
          <span aria-hidden="true" class="frame-tilt absolute inset-0 rounded-[32px] bg-gradient-to-br from-rosewood via-gold to-[#4DFF00] opacity-90" />
          <span aria-hidden="true" class="absolute -left-5 -top-5 hidden h-28 w-28 rounded-[28px] border-2 border-dashed border-gold/50 sm:block" />
          <span aria-hidden="true" class="absolute -bottom-6 -right-6 hidden h-40 w-40 rounded-full bg-[radial-gradient(#0049F2_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-25 sm:block" />
          <div
            class="image-frame relative aspect-[4/3] overflow-hidden rounded-[32px] bg-rosewood-50 shadow-lift ring-4 ring-white sm:aspect-[16/9] lg:aspect-auto lg:h-[clamp(300px,calc(100svh-440px),640px)]"
            @touchstart.passive="onTouchStart"
            @touchend="onTouchEnd"
          >
            <div
              v-for="(s, i) in slides"
              :key="s.image"
              class="slide-img-wrap absolute inset-0"
              :class="{ 'is-active': i === main.index.value }"
              :aria-hidden="i !== main.index.value"
            >
              <img
                :src="s.image"
                :alt="s.alt"
                class="slide-img h-full w-full object-cover"
                :class="i % 2 ? 'origin-right' : 'origin-left'"
                :style="{ objectPosition: s.pos || 'center' }"
                :fetchpriority="i === 0 ? 'high' : 'low'"
                :loading="i === 0 ? 'eager' : 'lazy'"
              >
            </div>
            <!-- soft light edge, no text on the picture -->
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-rosewood-900/25 via-transparent to-transparent" />

            <!-- floating trust badge -->
            <div class="badge-float absolute left-4 top-4 flex items-center gap-3 rounded-2xl bg-white/90 px-3.5 py-2.5 shadow-lift backdrop-blur sm:left-6 sm:top-6">
              <span class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold-light to-[#4DFF00] text-rosewood-900"><AppIcon name="check" :size="18" /></span>
              <span class="leading-tight">
                <span class="block text-sm font-semibold text-charcoal">1,100+ verified vendors</span>
                <span class="block text-[11px] text-charcoal-soft">Trusted by 18k couples</span>
              </span>
            </div>

            <!-- slide thumbnails -->
            <div class="absolute bottom-4 right-4 flex gap-2 sm:bottom-6 sm:right-6">
              <button
                v-for="(s, i) in slides"
                :key="s.image"
                type="button"
                class="thumb relative h-11 w-11 overflow-hidden rounded-xl ring-2 transition-all duration-300 sm:h-14 sm:w-14"
                :class="i === main.index.value ? 'scale-105 ring-white' : 'opacity-70 ring-white/40 hover:opacity-100'"
                :aria-label="`Show slide ${i + 1}: ${s.eyebrow}`"
                :aria-current="i === main.index.value"
                @click="main.go(i)"
              >
                <img :src="s.image" alt="" class="h-full w-full object-cover" loading="lazy">
              </button>
            </div>
          </div>
        </div>

        <!-- ===== Wording for the current slide ===== -->
        <div class="relative">
          <div class="grid">
            <div
              v-for="(s, i) in slides"
              :key="s.title"
              class="copy [grid-area:1/1]"
              :class="{ 'is-active': i === main.index.value }"
              :aria-hidden="i !== main.index.value"
            >
              <p class="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">
                <span class="h-px w-8 bg-gradient-to-r from-gold to-[#4DFF00]" />
                {{ s.eyebrow }}
              </p>
              <h2 class="mt-4 font-serif text-[2.3rem] font-semibold leading-[1.05] text-charcoal sm:text-5xl lg:text-[2.1rem] xl:text-[2.55rem]">
                {{ s.title }}
                <span class="block">
                  {{ s.titleB }} <span class="accent italic">{{ s.accent }}</span>{{ s.titleC }}
                </span>
              </h2>
              <p class="mt-4 line-clamp-3 max-w-lg text-[15px] leading-relaxed text-charcoal-soft lg:text-[14px] xl:text-[15px]">{{ s.text }}</p>

              <div class="mt-7 flex flex-wrap gap-3">
                <component
                  :is="s.primary.to ? NuxtLink : 'button'"
                  :to="s.primary.to"
                  :type="s.primary.to ? undefined : 'button'"
                  class="btn-gold btn-shine !min-h-[48px] !px-6 text-sm"
                  :tabindex="i === main.index.value ? 0 : -1"
                  @click="s.primary.scroll && scrollTo(s.primary.scroll)"
                >
                  {{ s.primary.label }}
                  <AppIcon name="arrowRight" :size="17" />
                </component>
                <component
                  :is="s.secondary.to ? NuxtLink : 'button'"
                  :to="s.secondary.to"
                  :type="s.secondary.to ? undefined : 'button'"
                  class="btn-outline !min-h-[48px] !px-6 text-sm"
                  :tabindex="i === main.index.value ? 0 : -1"
                  @click="s.secondary.scroll && scrollTo(s.secondary.scroll)"
                >
                  {{ s.secondary.label }}
                </component>
              </div>

              <dl class="hero-stats mt-6 grid max-w-md grid-cols-3 gap-3 border-t border-rosewood/10 pt-5">
                <div v-for="st in s.stats || stats" :key="st.label">
                  <dt class="truncate text-[10px] uppercase tracking-[0.14em] text-charcoal-soft xl:text-[10.5px]">{{ st.label }}</dt>
                  <dd class="mt-1 font-serif text-xl font-semibold text-rosewood xl:text-2xl">{{ st.value }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Controls -->
          <div class="mt-6 flex items-center gap-3">
            <p class="font-serif text-lg font-semibold tabular-nums text-charcoal" aria-live="polite">
              {{ String(main.index.value + 1).padStart(2, '0') }}<span class="text-sm text-charcoal-soft/70"> / {{ String(slides.length).padStart(2, '0') }}</span>
            </p>
            <div class="flex flex-1 gap-1.5">
              <button
                v-for="(s, i) in slides"
                :key="s.title"
                type="button"
                class="relative h-1 flex-1 overflow-hidden rounded-full bg-rosewood/10 transition hover:bg-rosewood/20 sm:max-w-[64px]"
                :aria-label="`Show slide ${i + 1}`"
                @click="main.go(i)"
              >
                <span
                  class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rosewood via-gold to-[#4DFF00]"
                  :style="{ width: i < main.index.value ? '100%' : i === main.index.value ? `${main.progress.value * 100}%` : '0%' }"
                />
              </button>
            </div>
            <div class="flex gap-2">
              <button type="button" class="ctrl-btn" aria-label="Previous slide" @click="main.prev()">
                <AppIcon name="arrowRight" :size="17" class="rotate-180" />
              </button>
              <button type="button" class="ctrl-btn" aria-label="Next slide" @click="main.next()">
                <AppIcon name="arrowRight" :size="17" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { NuxtLink } from '#components'

const props = defineProps({ ready: { type: Boolean, default: true } })
const scrollTo = useScrollTo()

// Signed-in users get a highlighted search area; right after logging in it
// also plays a short spotlight pulse (once per browser session).
const { user } = useAuth()
const firstName = computed(() => (user.value?.name || '').split(' ')[0] || 'there')
const spotlight = ref(false)
const SPOT_KEY = 'wh:search-spotlight'
const playSpotlight = () => {
  try {
    if (sessionStorage.getItem(SPOT_KEY)) return
    sessionStorage.setItem(SPOT_KEY, '1')
  } catch {}
  spotlight.value = true
  setTimeout(() => (spotlight.value = false), 3200)
}
watch(user, (now, before) => {
  if (now && !before) playSpotlight()
  if (!now) {
    try { sessionStorage.removeItem(SPOT_KEY) } catch {}
  }
})

const stats = [
  { label: 'Vendors', value: '1,100+' },
  { label: 'Venues', value: '240+' },
  { label: 'Happy couples', value: '18k' }
]

const slides = [
  {
    image: '/images/hero-couple.jpg',
    alt: 'Bride and groom holding a romantic bouquet',
    pos: '30% center',
    eyebrow: 'Make your dream wedding a reality',
    title: 'Everything You Need',
    titleB: 'For Your',
    accent: 'Perfect',
    titleC: ' Wedding.',
    text: 'Discover the best wedding professionals, beautiful venues, and inspiring ideas to make your special day unforgettable.',
    primary: { label: 'Explore Vendors', scroll: 'vendors' },
    secondary: { label: 'Discover Venues', scroll: 'venues' }
  },
  {
    image: '/images/categories/venues.jpg',
    alt: 'Elegant wedding reception hall',
    eyebrow: '240+ venues across the island',
    title: 'Say “I do” somewhere',
    titleB: '',
    accent: 'unforgettable',
    titleC: '.',
    text: 'From beachfront resorts in Bentota to hill-country hideaways in Kandy and Ella – find the venue that feels like you.',
    primary: { label: 'Browse venues', to: '/catalog?category=venues' },
    secondary: { label: 'Beach weddings', to: '/catalog?q=Bentota' },
    stats: [
      { label: 'Venues', value: '240+' },
      { label: 'Cities', value: '12' },
      { label: 'Avg. rating', value: '4.8★' }
    ]
  },
  {
    image: '/images/categories/photography.jpg',
    alt: 'Wedding photographer capturing a couple',
    eyebrow: 'Photography & videography',
    title: 'Every glance, every',
    titleB: 'tear,',
    accent: 'captured',
    titleC: '.',
    text: 'Award-winning photographers and film-makers who tell your story beautifully – view portfolios and send enquiries in minutes.',
    primary: { label: 'Find photographers', to: '/catalog?category=photography' },
    secondary: { label: 'All categories', to: '/catalog' },
    stats: [
      { label: 'Photographers', value: '180+' },
      { label: 'Portfolios', value: '2k+' },
      { label: 'Reply time', value: '< 24h' }
    ]
  },
  {
    image: '/images/categories/beauty.jpg',
    alt: 'Bride getting her make-up done',
    pos: 'center 30%',
    eyebrow: 'Bridal beauty & attire',
    title: 'Look and feel',
    titleB: 'your most',
    accent: 'radiant',
    titleC: '.',
    text: 'Bridal salons, make-up artists, dressmakers and jewellers – everything for your big-day look in one place.',
    primary: { label: 'Explore beauty', to: '/catalog?category=beauty' },
    secondary: { label: 'Bridal attire', to: '/catalog?category=attire' },
    stats: [
      { label: 'Salons', value: '150+' },
      { label: 'Designers', value: '90+' },
      { label: 'Jewellers', value: '60+' }
    ]
  }
]

// Wedding rings drifting down the background (fixed values so SSR = client)
const metals = {
  gold: ['#fff4c7', '#f0c75a', '#b8860b', '#f8df8f', '#c99a2e', '#7a5a12'],
  platinum: ['#ffffff', '#dfe4ea', '#8f99a8', '#f5f7fa', '#b4bcc7', '#6f7987'],
  rose: ['#ffe4d6', '#efab8e', '#b9694f', '#f8cbb6', '#d18c71', '#8e4b38']
}
const rings = [
  { x: 3, s: 36, d: 17, delay: -2, sway: 30, spin: 200, op: 0.9, metal: 'gold', pair: true, gem: true },
  { x: 11, s: 24, d: 13, delay: -9, sway: -22, spin: -240, op: 0.8, metal: 'platinum', gem: true },
  { x: 19, s: 30, d: 19, delay: -14, sway: 26, spin: 180, op: 0.75, metal: 'rose', desktopOnly: true },
  { x: 27, s: 20, d: 14, delay: -5, sway: -18, spin: 280, op: 0.85, metal: 'gold' },
  { x: 35, s: 40, d: 22, delay: -11, sway: 34, spin: -200, op: 0.7, metal: 'platinum', pair: true, gem: true, desktopOnly: true },
  { x: 44, s: 22, d: 15, delay: -1, sway: -24, spin: 240, op: 0.85, metal: 'rose', gem: true },
  { x: 52, s: 30, d: 18, delay: -7, sway: 28, spin: -260, op: 0.75, metal: 'gold', gem: true, desktopOnly: true },
  { x: 60, s: 26, d: 16, delay: -12, sway: -30, spin: 200, op: 0.85, metal: 'rose', pair: true, gem: true },
  { x: 68, s: 18, d: 12, delay: -3, sway: 20, spin: -300, op: 0.85, metal: 'platinum' },
  { x: 76, s: 36, d: 21, delay: -16, sway: -34, spin: 160, op: 0.75, metal: 'gold', pair: true, gem: true, desktopOnly: true },
  { x: 84, s: 24, d: 14, delay: -6, sway: 24, spin: -220, op: 0.85, metal: 'platinum', gem: true },
  { x: 91, s: 30, d: 18, delay: -10, sway: -26, spin: 240, op: 0.75, metal: 'rose', desktopOnly: true },
  { x: 97, s: 22, d: 15, delay: -4, sway: 18, spin: -180, op: 0.85, metal: 'gold', pair: true, gem: true }
]

// Auto-rotator: index + 0..1 progress, pausable, idles in hidden tabs.
const useRotator = (count, ms) => {
  const index = ref(0)
  const progress = ref(0)
  let hold = false
  let timer = null
  let last = 0
  const tick = () => {
    const now = performance.now()
    const dt = now - last
    last = now
    if (hold || document.hidden) return
    progress.value += dt / ms
    if (progress.value >= 1) next()
  }
  const go = (i) => { index.value = (i + count) % count; progress.value = 0 }
  const next = () => go(index.value + 1)
  const prev = () => go(index.value - 1)
  const pause = (v) => { hold = v }
  const start = () => { if (!timer) { last = performance.now(); timer = setInterval(tick, 50) } }
  const stop = () => { clearInterval(timer); timer = null }
  return { index, progress, go, next, prev, pause, start, stop }
}

const main = useRotator(slides.length, 6500)

let touchX = 0
const onTouchStart = (e) => { touchX = e.touches[0].clientX }
const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - touchX
  if (Math.abs(dx) > 45) (dx < 0 ? main.next() : main.prev())
}

onMounted(() => {
  if (user.value) {
    if (props.ready) setTimeout(playSpotlight, 900)
    else watch(() => props.ready, (v) => v && setTimeout(playSpotlight, 900))
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (props.ready) main.start()
  else {
    const off = watch(() => props.ready, (v) => { if (v) { main.start(); off() } })
  }
})
onBeforeUnmount(() => main.stop())
</script>

<style scoped>
/* tilted gradient card peeking out behind the picture */
.frame-tilt {
  transform: rotate(-3deg) translate(-6px, 10px);
  filter: blur(0.3px);
}
@media (min-width: 640px) {
  .frame-tilt { transform: rotate(-3.5deg) translate(-12px, 14px); }
}
.badge-float {
  animation: badge-bob 5s ease-in-out infinite;
}
@keyframes badge-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ---- image slides: cross-fade + slow zoom ---- */
.slide-img-wrap {
  opacity: 0;
  transition: opacity 1.1s ease;
}
.slide-img-wrap.is-active {
  opacity: 1;
}
.slide-img {
  transform: scale(1.14);
  transition: transform 8s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-img-wrap.is-active .slide-img {
  transform: scale(1);
}

/* ---- wording: stacked in one grid cell, staggered fade-up ---- */
.copy {
  visibility: hidden;
  transition: visibility 0s linear 0.5s;
}
.copy.is-active {
  visibility: visible;
  transition: none;
}
.copy > * {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.copy.is-active > * {
  animation: copy-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.copy.is-active > *:nth-child(2) { animation-delay: 0.1s; }
.copy.is-active > *:nth-child(3) { animation-delay: 0.2s; }
.copy.is-active > *:nth-child(4) { animation-delay: 0.3s; }
.copy.is-active > *:nth-child(5) { animation-delay: 0.4s; }
@keyframes copy-in {
  to { opacity: 1; transform: none; }
}

.accent {
  background: linear-gradient(90deg, #0049f2, #00b8d9 60%, #2fcf00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-right: 0.08em;
}

.ctrl-btn {
  @apply grid h-11 w-11 place-items-center rounded-full text-rosewood ring-1 ring-rosewood/20 transition hover:bg-rosewood hover:text-white hover:ring-rosewood;
}

/* ---- highlighted search (signed-in users) ---- */
.search-shell {
  position: relative;
  border-radius: 31px;
  transition: box-shadow 0.6s ease, transform 0.6s ease;
}
.search-shell.is-on {
  padding: 3px;
  isolation: isolate;
  box-shadow: 0 0 0 6px rgba(0, 210, 230, 0.12), 0 24px 60px -18px rgba(0, 73, 242, 0.45);
}
/* rotating brand-colour border */
/* flowing brand-colour ring (clipped on its own so dropdowns can overflow) */
.shell-border {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(90deg, #0049f2, #00f2ff, #4dff00, #00f2ff, #0049f2, #00f2ff, #4dff00);
  background-size: 300% 100%;
  animation: border-flow 6s linear infinite;
}
.shell-border::after {
  content: '';
  position: absolute;
  inset: -6px;
  z-index: -1;
  border-radius: 36px;
  background: inherit;
  background-size: inherit;
  animation: inherit;
  filter: blur(14px);
  opacity: 0.35;
}
@keyframes border-flow {
  to { background-position: 300% 0; }
}
.search-shell.is-on :deep(.search-panel) {
  background: #fff;
}
.search-shell.is-spot {
  animation: spot 1.05s ease-in-out 3;
}
@keyframes border-spin {
  to { transform: rotate(360deg); }
}
@keyframes spot {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 210, 230, 0.12), 0 24px 60px -18px rgba(0, 73, 242, 0.45); }
  50% { transform: scale(1.012); box-shadow: 0 0 0 14px rgba(0, 210, 230, 0.22), 0 30px 80px -14px rgba(0, 73, 242, 0.6); }
}
.greet-enter-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.greet-enter-from { opacity: 0; transform: translateY(8px); }

/* ---- falling rings ---- */
.ring-fall {
  position: absolute;
  top: 0;
  opacity: 0;
  animation: ring-fall var(--dur) linear var(--delay) infinite;
  will-change: transform;
}
.ring-sway {
  animation: ring-sway calc(var(--dur) / 3) ease-in-out var(--delay) infinite alternate;
}
.ring-svg {
  display: block;
  height: auto;
  filter: drop-shadow(0 5px 8px rgba(70, 50, 10, 0.18)) drop-shadow(0 0 1px rgba(0, 0, 0, 0.08));
  animation: ring-spin var(--dur) linear var(--delay) infinite;
}
@keyframes ring-fall {
  0% { transform: translateY(-80px); opacity: 0; }
  8% { opacity: var(--op); }
  88% { opacity: var(--op); }
  100% { transform: translateY(calc(100vh + 160px)); opacity: 0; }
}
@keyframes ring-sway {
  from { transform: translateX(calc(var(--sway) * -1)); }
  to { transform: translateX(var(--sway)); }
}
.sparkle {
  transform-origin: 26.5px 5.4px;
  animation: twinkle-gem 1.8s ease-in-out infinite;
}
@keyframes twinkle-gem {
  0%, 100% { opacity: 0.2; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
}
/* short laptop screens: keep banner + search within one screen */
@media (min-width: 1024px) and (max-height: 820px) {
  .hero-stats { display: none; }
  #home { padding-top: 1.75rem; padding-bottom: 1.5rem; }
}
@keyframes ring-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(var(--spin)); }
}

@media (prefers-reduced-motion: reduce) {
  .ring-fall, .sparkle { display: none; }
  .badge-float { animation: none; }
  .shell-border, .shell-border::after, .search-shell.is-spot { animation: none; }
  .copy.is-active > * { animation: none; opacity: 1; transform: none; }
  .slide-img { transition: none; transform: none; }
}
</style>
