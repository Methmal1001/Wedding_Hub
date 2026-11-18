<template>
  <!-- Animated left-hand panel of the login / sign-up portal -->
  <div class="showcase relative isolate flex h-full flex-col overflow-hidden bg-rosewood-900 text-white">
    <!-- Cross-fading photos -->
    <div
      v-for="(src, i) in photos"
      :key="src"
      class="bg-slide absolute inset-0 -z-20"
      :class="{ 'is-active': i === photoIndex }"
      aria-hidden="true"
    >
      <img :src="src" alt="" class="h-full w-full object-cover">
    </div>
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-gradient-to-br from-rosewood-900/95 via-rosewood-800/80 to-rosewood/60" />

    <!-- Morphing glow blobs -->
    <div aria-hidden="true" class="blob blob--a" />
    <div aria-hidden="true" class="blob blob--b" />

    <!-- Falling petals -->
    <span
      v-for="(p, i) in petals"
      :key="`p${i}`"
      aria-hidden="true"
      class="petal"
      :style="{ left: p.x + '%', width: p.s + 'px', height: p.s * 0.8 + 'px', animationDuration: p.d + 's', animationDelay: p.delay + 's', '--sway': p.sway + 'px' }"
    />

    <div class="relative flex flex-1 flex-col p-8 xl:p-12">
      <NuxtLink to="/" class="inline-flex self-start" aria-label="Wedding Hub home">
        <BrandLogo light />
      </NuxtLink>

      <div class="my-auto py-10">
        <!-- Interlocking rings drawing themselves -->
        <svg viewBox="0 0 120 80" class="rings h-16 w-24" aria-hidden="true">
          <circle cx="45" cy="48" r="24" pathLength="1" fill="none" stroke="#00F2FF" stroke-width="2.2" />
          <circle cx="75" cy="48" r="24" pathLength="1" fill="none" stroke="#E3F6FF" stroke-width="2.2" />
          <path d="M60 8l5 6-5 6-5-6z" pathLength="1" fill="#00F2FF" stroke="#00F2FF" stroke-width="1" />
        </svg>

        <Transition name="swap" mode="out-in">
          <div :key="mode">
            <p class="mt-6 font-script text-4xl leading-none text-blush xl:text-5xl">
              {{ mode === 'login' ? 'Welcome back' : 'Begin your journey' }}
            </p>
            <h2 class="mt-4 max-w-md font-serif text-4xl font-semibold leading-[1.1] xl:text-5xl">
              {{ mode === 'login' ? 'Your wedding plans are waiting for you.' : 'Plan your dream wedding, all in one place.' }}
            </h2>
          </div>
        </Transition>

        <ul class="mt-8 space-y-3.5">
          <li
            v-for="(f, i) in features"
            :key="f.text"
            class="feature flex items-center gap-3 text-sm text-white/90"
            :style="{ animationDelay: 0.5 + i * 0.12 + 's' }"
          >
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-light ring-1 ring-white/20 backdrop-blur">
              <AppIcon :name="f.icon" :size="17" />
            </span>
            {{ f.text }}
          </li>
        </ul>
      </div>

      <!-- Floating stats card -->
      <div class="float-card absolute right-8 top-28 hidden rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-md 2xl:block">
        <div class="flex -space-x-2">
          <img v-for="a in avatars" :key="a" :src="a" alt="" class="h-8 w-8 rounded-full object-cover ring-2 ring-rosewood-800">
        </div>
        <p class="mt-2 text-xs text-white/80"><strong class="text-white">{{ totalVendors.toLocaleString() }}+</strong> wedding vendors</p>
      </div>

      <!-- Rotating couple quotes -->
      <div class="relative min-h-[132px] rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
        <AppIcon name="quote" :size="26" class="text-gold-light/80" />
        <Transition name="swap" mode="out-in">
          <figure :key="quoteIndex" class="mt-2">
            <blockquote class="text-sm leading-relaxed text-white/90">“{{ quotes[quoteIndex].text }}”</blockquote>
            <figcaption class="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-light">— {{ quotes[quoteIndex].name }}</figcaption>
          </figure>
        </Transition>
        <div class="absolute bottom-5 right-5 flex gap-1.5">
          <span
            v-for="(q, i) in quotes"
            :key="`q${i}`"
            class="h-1.5 rounded-full transition-all duration-500"
            :class="i === quoteIndex ? 'w-5 bg-gold-light' : 'w-1.5 bg-white/35'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'
import { listingDetails } from '~/data/listingDetails'

defineProps({ mode: { type: String, default: 'login' } })

const photos = ['/images/hero-couple.jpg', '/images/inspiration-banner.jpg', '/images/cat-venues.jpg', '/images/cat-photographers.jpg']
const { index: photoIndex } = useRotator(photos.length, 6000)

const quotes = Object.values(listingDetails)
  .flatMap((d) => d.reviews || [])
  .filter((r) => r.rating === 5)
  .slice(0, 5)
const { index: quoteIndex } = useRotator(quotes.length, 5200)

const features = [
  { icon: 'heart', text: 'Save your favourite vendors' },
  { icon: 'mail', text: 'Send enquiries & keep track of them' },
  { icon: 'calendar', text: 'Wedding countdown & planning checklist' },
  { icon: 'store', text: 'Vendors: put your business in front of couples' }
]

const avatars = ['1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e', '1494790108377-be9c29b29330', '1500648767791-00dcc994a43e'].map(
  (id) => `/images/avatars/${id}.jpg`
)
const totalVendors = weddingCategories.reduce((sum, c) => sum + c.vendorCount, 0)

const petals = [
  { x: 6, s: 12, d: 9, delay: -2, sway: 50 },
  { x: 18, s: 9, d: 11, delay: -6, sway: -40 },
  { x: 32, s: 14, d: 10, delay: -1, sway: 60 },
  { x: 47, s: 10, d: 12, delay: -8, sway: -50 },
  { x: 61, s: 13, d: 9.5, delay: -4, sway: 45 },
  { x: 75, s: 9, d: 11.5, delay: -3, sway: -35 },
  { x: 88, s: 12, d: 10.5, delay: -7, sway: 55 }
]
</script>

<style scoped>
.bg-slide {
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 1.6s ease, transform 8s ease-out;
}
.bg-slide.is-active {
  opacity: 0.55;
  transform: scale(1.14);
}

.blob {
  position: absolute;
  z-index: -5;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.55;
  animation: blob-move 14s ease-in-out infinite alternate;
}
.blob--a {
  left: -10%;
  top: 8%;
  height: 340px;
  width: 340px;
  background: #0049F2;
}
.blob--b {
  bottom: -12%;
  right: -12%;
  height: 380px;
  width: 380px;
  background: #00D2E6;
  opacity: 0.35;
  animation-delay: -6s;
}
@keyframes blob-move {
  0% { transform: translate(0, 0) scale(1); border-radius: 42% 58% 60% 40%; }
  50% { transform: translate(40px, -30px) scale(1.12); border-radius: 58% 42% 38% 62%; }
  100% { transform: translate(-30px, 30px) scale(0.95); border-radius: 50%; }
}

.petal {
  position: absolute;
  top: -5%;
  z-index: -1;
  border-radius: 150% 0 150% 0;
  background: linear-gradient(135deg, #E3F6FF, #fff 160%);
  opacity: 0.55;
  animation: petal-fall linear infinite;
  pointer-events: none;
}
@keyframes petal-fall {
  0% { transform: translate3d(0, 0, 0) rotate(0deg); }
  50% { transform: translate3d(var(--sway), 55vh, 0) rotate(200deg); }
  100% { transform: translate3d(0, 110vh, 0) rotate(380deg); }
}

.rings circle,
.rings path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.8s cubic-bezier(0.45, 0, 0.25, 1) forwards;
}
.rings circle:nth-child(2) {
  animation-delay: 0.35s;
}
.rings path {
  fill-opacity: 0;
  animation: draw 0.8s ease 1.2s forwards, fill 0.6s ease 1.8s forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes fill {
  to { fill-opacity: 1; }
}

.feature {
  opacity: 0;
  transform: translateX(-16px);
  animation: feature-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes feature-in {
  to { opacity: 1; transform: none; }
}

.float-card {
  animation: bob 5s ease-in-out infinite;
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .blob,
  .petal,
  .float-card {
    animation: none;
  }
  .petal {
    display: none;
  }
  .rings circle,
  .rings path,
  .feature {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 1;
    transform: none;
    fill-opacity: 1;
  }
}
</style>
