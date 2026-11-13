<template>
  <div
    class="splash fixed inset-0 z-[100] overflow-hidden"
    :class="{ 'is-playing': playing }"
    role="dialog"
    aria-label="Wedding Hub intro"
  >
    <!-- Background layers -->
    <div class="splash-bg absolute inset-0" />
    <div class="splash-rays absolute left-1/2 top-[44%]" />
    <div class="splash-vignette absolute inset-0" />

    <!-- Floating leaves & petals -->
    <span
      v-for="(p, i) in petals"
      :key="`p${i}`"
      class="petal"
      :style="{
        left: p.x + '%',
        width: p.s + 'px',
        height: p.s * 0.8 + 'px',
        animationDuration: p.d + 's',
        animationDelay: p.delay + 's',
        '--sway': p.sway + 'px',
        '--hue': p.c
      }"
    />

    <!-- Twinkling particles -->
    <span
      v-for="(s, i) in sparkles"
      :key="`s${i}`"
      class="sparkle"
      :style="{ left: s.x + '%', top: s.y + '%', animationDelay: s.delay + 's', width: s.s + 'px', height: s.s + 'px' }"
    />

    <!-- Step 1: top branding -->
    <div class="splash-top absolute inset-x-0 top-[5vh] flex flex-col items-center gap-2 text-center">
      <svg viewBox="0 0 40 40" class="h-8 w-8" aria-hidden="true">
        <circle cx="16" cy="23" r="8" fill="none" stroke="#B4637A" stroke-width="1.8" />
        <circle cx="24" cy="23" r="8" fill="none" stroke="#C9A86A" stroke-width="1.8" />
        <path d="M20 6.5l2.6 3.4-2.6 3.1-2.6-3.1z" fill="#C9A86A" />
      </svg>
      <p class="text-[10px] font-medium uppercase tracking-[0.5em] text-rosewood/70 sm:text-[11px]">
        Wedding Hub &nbsp;·&nbsp; Sri Lanka
      </p>
    </div>

    <!-- Stage -->
    <div class="relative flex h-full flex-col items-center justify-center px-4 pt-[5vh]">
      <!--
        Painted couple (assets/images/splash-couple.png). The same painting is
        rendered twice and clipped along the gap between them, so the groom's
        half walks in from the left, the bride's half from the right, and they
        join into the complete watercolour when they meet.
      -->
      <div v-if="art" class="stage stage--painted relative">
        <div class="meet-glow absolute left-1/2 top-[38%]" />
        <div class="floor-shadow absolute bottom-[1%] left-1/2 -translate-x-1/2" />

        <div class="painted painted--groom groom-enter absolute inset-0 z-10">
          <div class="groom-walk h-full w-full">
            <img :src="art" alt="" class="painted-img" draggable="false">
          </div>
        </div>
        <div class="painted painted--bride bride-enter absolute inset-0 z-20">
          <div class="bride-walk h-full w-full">
            <img :src="art" alt="" class="painted-img" draggable="false">
          </div>
        </div>
        <span class="sr-only">A watercolour painting of a bride and groom meeting and smiling at each other.</span>

        <div class="hearts pointer-events-none absolute left-[54%] top-[3%] z-30">
          <svg class="big-heart" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21Z"
              fill="#B4637A"
            />
          </svg>
          <svg
            v-for="(h, i) in hearts"
            :key="`ph${i}`"
            class="mini-heart"
            viewBox="0 0 24 24"
            aria-hidden="true"
            :style="{ '--hx': h.x + 'px', '--hs': h.s, animationDelay: h.delay + 's' }"
          >
            <path
              d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21Z"
              :fill="h.c"
            />
          </svg>
          <span class="burst-ring" />
        </div>
      </div>

      <!-- Fallback: hand-drawn line-art couple (used until the painting is added) -->
      <div v-else class="stage relative">
        <div class="meet-glow absolute left-1/2 top-[34%]" />
        <div class="floor-shadow absolute bottom-[-1.5%] left-1/2 -translate-x-1/2" />

        <!-- Step 2: groom walks in from the LEFT (side profile, facing right) -->
        <div class="groom-enter absolute bottom-0 left-0 z-10">
          <div class="groom-lean h-full w-full">
            <div class="groom-walk h-full w-full">
              <SplashGroom />
            </div>
          </div>
        </div>

        <!-- Step 3: bride walks in from the RIGHT (side profile, facing left) -->
        <div class="bride-enter absolute bottom-0 z-20">
          <div class="bride-lean h-full w-full">
            <div class="bride-walk h-full w-full">
              <SplashBride />
            </div>
          </div>
        </div>

        <!-- Step 4: hearts between their faces -->
        <div class="hearts pointer-events-none absolute left-1/2 top-[6%] z-30">
          <svg class="big-heart" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21Z"
              fill="#B4637A"
            />
          </svg>
          <svg
            v-for="(h, i) in hearts"
            :key="`h${i}`"
            class="mini-heart"
            viewBox="0 0 24 24"
            aria-hidden="true"
            :style="{ '--hx': h.x + 'px', '--hs': h.s, animationDelay: h.delay + 's' }"
          >
            <path
              d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21Z"
              :fill="h.c"
            />
          </svg>
          <span class="burst-ring" />
        </div>
      </div>

      <!-- Step 5: brand reveal -->
      <div class="relative z-30 mt-4 text-center sm:mt-6">
        <h1 class="brand-title font-serif font-semibold leading-none text-rosewood">
          Wedding <span class="italic text-gold-dark">Hub</span>
        </h1>
        <div class="brand-line mx-auto mt-3 flex items-center justify-center gap-3">
          <span class="h-px w-12 bg-gradient-to-r from-transparent to-gold sm:w-20" />
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 text-gold" aria-hidden="true">
            <path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z" fill="currentColor" />
          </svg>
          <span class="h-px w-12 bg-gradient-to-l from-transparent to-gold sm:w-20" />
        </div>
        <p class="brand-tagline mt-3 font-script text-[1.9rem] leading-none text-rosewood-800 sm:text-[2.6rem]">
          Where Your Forever Begins.
        </p>
      </div>
    </div>

    <!-- Skip -->
    <button
      type="button"
      class="splash-skip absolute bottom-5 right-5 z-40 rounded-full border border-rosewood/20 bg-white/50 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-rosewood backdrop-blur transition hover:bg-white sm:bottom-8 sm:right-8"
      @click="finish"
    >
      Skip intro
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['finished'])

// Optional watercolour artwork. Vite resolves this at build time: if the file
// isn't there the object is empty and the line-art couple is used instead
// (no 404s, no broken images).
const artwork = import.meta.glob('../assets/images/splash-couple.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default'
})
const art = Object.values(artwork)[0] || ''

// Time the scene is shown before the fade/zoom-out begins (ms).
// The leave transition adds ~0.9s, so the full splash is ≈ 5.9s.
const SCENE_DURATION = 5000

const playing = ref(false)
let timer = null
let finished = false

// Fixed (deterministic) particle layouts so SSR and client markup match.
const petals = [
  { x: 4, s: 14, d: 7.5, delay: -1.0, sway: 60, c: '#C9A86A' },
  { x: 12, s: 10, d: 9.0, delay: -4.0, sway: -40, c: '#F7E1E3' },
  { x: 20, s: 16, d: 8.2, delay: -2.5, sway: 70, c: '#E6D3A8' },
  { x: 29, s: 11, d: 10.0, delay: -6.0, sway: -55, c: '#C9A86A' },
  { x: 37, s: 13, d: 7.8, delay: -0.5, sway: 45, c: '#FFFFFF' },
  { x: 46, s: 9, d: 9.6, delay: -3.2, sway: -35, c: '#F7E1E3' },
  { x: 55, s: 15, d: 8.4, delay: -5.1, sway: 65, c: '#E6D3A8' },
  { x: 63, s: 12, d: 9.2, delay: -1.8, sway: -60, c: '#C9A86A' },
  { x: 71, s: 10, d: 7.2, delay: -4.6, sway: 50, c: '#FFFFFF' },
  { x: 79, s: 16, d: 8.8, delay: -2.2, sway: -45, c: '#F7E1E3' },
  { x: 87, s: 12, d: 9.8, delay: -6.4, sway: 55, c: '#C9A86A' },
  { x: 95, s: 11, d: 7.6, delay: -3.6, sway: -50, c: '#E6D3A8' },
  { x: 33, s: 8, d: 11.0, delay: -7.5, sway: 30, c: '#93485F' },
  { x: 68, s: 8, d: 10.5, delay: -8.2, sway: -30, c: '#93485F' }
]

const sparkles = [
  { x: 8, y: 22, s: 4, delay: 0.2 },
  { x: 18, y: 64, s: 3, delay: 1.1 },
  { x: 26, y: 38, s: 5, delay: 0.7 },
  { x: 35, y: 78, s: 3, delay: 1.8 },
  { x: 42, y: 18, s: 4, delay: 1.4 },
  { x: 58, y: 24, s: 3, delay: 0.4 },
  { x: 64, y: 70, s: 5, delay: 2.1 },
  { x: 72, y: 34, s: 3, delay: 0.9 },
  { x: 81, y: 58, s: 4, delay: 1.6 },
  { x: 90, y: 28, s: 3, delay: 2.4 },
  { x: 94, y: 74, s: 4, delay: 0.6 },
  { x: 50, y: 88, s: 3, delay: 1.3 }
]

const hearts = [
  { x: -46, s: 0.7, delay: 3.0, c: '#C9A86A' },
  { x: 38, s: 0.9, delay: 3.15, c: '#93485F' },
  { x: -18, s: 0.55, delay: 3.3, c: '#E6D3A8' },
  { x: 56, s: 0.6, delay: 3.45, c: '#C9A86A' },
  { x: -60, s: 0.5, delay: 3.6, c: '#93485F' },
  { x: 20, s: 0.65, delay: 3.75, c: '#E6D3A8' }
]

const finish = () => {
  if (finished) return
  finished = true
  clearTimeout(timer)
  emit('finished')
}

onMounted(() => {
  // Start animations once the app is interactive so the CSS timeline and the
  // JS timer stay in sync, and lock page scroll during the intro.
  document.documentElement.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    playing.value = true
  })
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  timer = setTimeout(finish, reduced ? 1800 : SCENE_DURATION)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.splash {
  --fig-h: clamp(190px, 50vh, 430px);
  --ease-walk: cubic-bezier(0.25, 0.8, 0.3, 1);
  --line: #6E3446;
}

/* ---------- Background: light green with soft light ---------- */
.splash-bg {
  background:
    radial-gradient(ellipse 60% 50% at 50% 40%, #FFFDFB 0%, rgba(255, 253, 251, 0) 70%),
    radial-gradient(ellipse at 50% 40%, #FFF7F5 0%, #FBE8E9 50%, #F2D2D7 100%);
}
.splash-vignette {
  background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(110, 52, 70, 0.16) 100%);
  pointer-events: none;
}
.splash-rays {
  width: 160vmax;
  height: 160vmax;
  transform: translate(-50%, -50%);
  background: repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.35) 0deg 4deg, transparent 4deg 16deg);
  mask-image: radial-gradient(circle, #000 0%, transparent 45%);
  -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 45%);
  opacity: 0;
  pointer-events: none;
}
.is-playing .splash-rays {
  animation: fade-in-full 1.6s ease 0.2s forwards, rays-spin 40s linear infinite;
}
@keyframes fade-in-full {
  to { opacity: 1; }
}
@keyframes rays-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ---------- Leaves & sparkles ---------- */
.petal {
  position: absolute;
  top: -6%;
  border-radius: 150% 0 150% 0;
  background: linear-gradient(135deg, var(--hue), #fff 170%);
  box-shadow: inset -2px -2px 4px rgba(110, 52, 70, 0.12);
  opacity: 0.85;
  animation-name: petal-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: paused;
  pointer-events: none;
}
.is-playing .petal {
  animation-play-state: running;
}
@keyframes petal-fall {
  0% { transform: translate3d(0, 0, 0) rotate(0deg); }
  25% { transform: translate3d(var(--sway), 28vh, 0) rotate(90deg); }
  50% { transform: translate3d(0, 56vh, 0) rotate(180deg) rotateX(40deg); }
  75% { transform: translate3d(calc(var(--sway) * -1), 84vh, 0) rotate(270deg); }
  100% { transform: translate3d(0, 112vh, 0) rotate(360deg); }
}

.sparkle {
  position: absolute;
  border-radius: 9999px;
  background: #fff;
  box-shadow: 0 0 8px 2px rgba(255, 255, 240, 0.95);
  opacity: 0;
  pointer-events: none;
}
.is-playing .sparkle {
  animation: twinkle 2.6s ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(0.4); }
  50% { opacity: 0.95; transform: scale(1); }
}

/* ---------- Step 1 ---------- */
.splash-top {
  opacity: 0;
}
.is-playing .splash-top {
  animation: fade-down 1s ease 0.1s forwards;
}
@keyframes fade-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: none; }
}

/* ---------- Stage geometry ----------
   Both SVGs use a 260×460 viewBox. The bride's box starts 200 units in,
   so the couple overlaps into one 460×460 scene. */
.stage {
  height: var(--fig-h);
  width: var(--fig-h);
}
.groom-enter,
.bride-enter {
  height: var(--fig-h);
  width: calc(var(--fig-h) * 260 / 460);
}
.bride-enter {
  left: calc(var(--fig-h) * 200 / 460);
}

/* ---------- Line-art drawing ---------- */
.stage :deep(.figure path),
.stage :deep(.figure circle) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.stage :deep(.figure) {
  fill-opacity: 0;
}
.stage :deep(.figure .lace) {
  stroke-dasharray: 0.012 0.01;
  stroke-dashoffset: 0;
  opacity: 0;
}
.is-playing .groom-enter :deep(.figure path),
.is-playing .groom-enter :deep(.figure circle) {
  animation: draw-line 1.9s cubic-bezier(0.45, 0, 0.25, 1) 0.25s forwards;
}
.is-playing .bride-enter :deep(.figure path),
.is-playing .bride-enter :deep(.figure circle) {
  animation: draw-line 1.9s cubic-bezier(0.45, 0, 0.25, 1) 0.5s forwards;
}
.is-playing .groom-enter :deep(.figure) {
  animation: fill-in 1.1s ease 1.2s forwards;
}
.is-playing .bride-enter :deep(.figure) {
  animation: fill-in 1.1s ease 1.45s forwards;
}
.is-playing .stage :deep(.figure .lace) {
  animation: fade-in-full 0.8s ease 2s forwards;
}
@keyframes draw-line {
  to { stroke-dashoffset: 0; }
}
@keyframes fill-in {
  to { fill-opacity: 1; }
}

/* ---------- Step 2 & 3: walking in from opposite sides ---------- */
.groom-enter {
  transform: translateX(-80vw);
}
.bride-enter {
  transform: translateX(80vw);
}
.is-playing .groom-enter {
  animation: enter-left 1.9s var(--ease-walk) 0.25s forwards;
}
.is-playing .bride-enter {
  animation: enter-right 1.9s var(--ease-walk) 0.5s forwards;
}
@keyframes enter-left {
  from { transform: translateX(-80vw); }
  to { transform: translateX(0); }
}
@keyframes enter-right {
  from { transform: translateX(80vw); }
  to { transform: translateX(0); }
}

/* Body bob while walking (even count, so it ends at rest) */
.is-playing .groom-walk {
  animation: walk-bob 0.475s ease-in-out 0.25s 4 alternate;
}
.is-playing .bride-walk {
  animation: walk-bob 0.475s ease-in-out 0.5s 4 alternate;
}
@keyframes walk-bob {
  from { transform: translateY(0); }
  to { transform: translateY(-5px); }
}

/* Groom's stride: legs swing from the hip, ending together */
.stage :deep(.leg) {
  transform-box: view-box;
  transform-origin: 0 0;
}
.is-playing .stage :deep(.leg--near) {
  animation: stride 0.95s ease-in-out 0.25s 2;
}
.is-playing .stage :deep(.leg--far) {
  animation: stride 0.95s ease-in-out 0.25s 2 reverse;
}
@keyframes stride {
  0%, 50%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-11deg); }
  75% { transform: rotate(11deg); }
}

/* Bride's gown & veil sway as she walks */
.stage :deep(.skirt),
.stage :deep(.veil) {
  transform-box: fill-box;
  transform-origin: 50% 0%;
}
.is-playing .stage :deep(.skirt) {
  animation: gown-sway 0.95s ease-in-out 0.5s 2;
}
.is-playing .stage :deep(.veil) {
  animation: veil-flow 2s ease-out 0.5s 1;
}
@keyframes gown-sway {
  0%, 100% { transform: skewX(0deg); }
  25% { transform: skewX(-2deg); }
  75% { transform: skewX(2deg); }
}
@keyframes veil-flow {
  0% { transform: skewX(-12deg) scaleX(1.08); }
  100% { transform: none; }
}


/* ---------- Painted (watercolour) couple ---------- */
.stage--painted {
  height: var(--fig-h);
  width: calc(var(--fig-h) * 2 / 3);
}
.stage--painted .groom-enter,
.stage--painted .bride-enter {
  left: 0;
  width: 100%;
  height: 100%;
}
/* Multiply makes the white watercolour paper disappear into the background */
.painted {
  mix-blend-mode: multiply;
}
.painted-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  opacity: 0;
  filter: blur(8px) saturate(0.6);
}
.is-playing .painted--groom .painted-img {
  animation: paint-in 1.6s ease-out 0.25s forwards;
}
.is-playing .painted--bride .painted-img {
  animation: paint-in 1.6s ease-out 0.5s forwards;
}
@keyframes paint-in {
  to { opacity: 1; filter: blur(0) saturate(1); }
}
/* Split along the natural gap between the couple (between their faces,
   linked arms, bouquet and hem) so each half reads as one person */
.painted--groom {
  clip-path: polygon(0 0, 54% 0, 54% 22%, 51% 35%, 46% 50%, 45% 75%, 43% 100%, 0 100%);
}
.painted--bride {
  clip-path: polygon(54% 0, 100% 0, 100% 100%, 43% 100%, 45% 75%, 46% 50%, 51% 35%, 54% 22%);
}
.stage--painted .big-heart {
  width: calc(var(--fig-h) * 0.07);
  height: calc(var(--fig-h) * 0.07);
}

/* ---------- Step 4: they meet face to face ---------- */
/* Arms hang while walking, then rise so their hands join */
.stage :deep(.arm) {
  transform-box: view-box;
  transform-origin: 0 0;
  transform: rotate(32deg);
}
.is-playing .stage :deep(.arm) {
  animation: arm-raise 0.9s cubic-bezier(0.34, 1.2, 0.64, 1) 2.3s forwards;
}
@keyframes arm-raise {
  to { transform: rotate(0deg); }
}

/* Gentle lean towards each other – foreheads almost touching */
.groom-lean {
  transform-origin: 66% 98%;
}
.bride-lean {
  transform-origin: 42% 98%;
}
.is-playing .groom-lean {
  animation: lean-groom 1s cubic-bezier(0.34, 1.3, 0.64, 1) 2.65s forwards;
}
.is-playing .bride-lean {
  animation: lean-bride 1s cubic-bezier(0.34, 1.3, 0.64, 1) 2.65s forwards;
}
@keyframes lean-groom {
  to { transform: rotate(2.6deg); }
}
@keyframes lean-bride {
  to { transform: rotate(-2.6deg); }
}

.meet-glow {
  width: calc(var(--fig-h) * 1.3);
  height: calc(var(--fig-h) * 1.3);
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 236, 0.65) 35%, rgba(247, 225, 227, 0) 70%);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.4);
}
.is-playing .meet-glow {
  animation: glow-in 1.4s ease-out 2.5s forwards;
}
@keyframes glow-in {
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.floor-shadow {
  width: calc(var(--fig-h) * 0.95);
  height: calc(var(--fig-h) * 0.06);
  border-radius: 9999px;
  background: radial-gradient(ellipse, rgba(110, 52, 70, 0.25) 0%, transparent 70%);
  opacity: 0;
}
.is-playing .floor-shadow {
  animation: fade-in-full 0.8s ease 2.2s forwards;
}

/* Hearts */
.hearts {
  width: 2px;
  height: 2px;
}
.big-heart {
  position: absolute;
  left: 50%;
  top: 0;
  width: calc(var(--fig-h) * 0.085);
  height: calc(var(--fig-h) * 0.085);
  transform: translate(-50%, -50%) scale(0);
  filter: drop-shadow(0 6px 12px rgba(110, 52, 70, 0.3));
}
.is-playing .big-heart {
  animation: big-heart 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) 3s forwards, heartbeat 1.2s ease-in-out 4.1s infinite;
}
@keyframes big-heart {
  0% { transform: translate(-50%, 0%) scale(0); opacity: 0; }
  100% { transform: translate(-50%, -120%) scale(1); opacity: 1; }
}
@keyframes heartbeat {
  0%, 100% { transform: translate(-50%, -120%) scale(1); }
  20% { transform: translate(-50%, -120%) scale(1.14); }
  40% { transform: translate(-50%, -120%) scale(1); }
}

.mini-heart {
  position: absolute;
  left: 50%;
  top: 0;
  width: 20px;
  height: 20px;
  opacity: 0;
}
.is-playing .mini-heart {
  animation: heart-rise 2.2s ease-out forwards;
}
@keyframes heart-rise {
  0% { opacity: 0; transform: translate(-50%, 10px) scale(calc(var(--hs) * 0.4)); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--hx)), calc(var(--fig-h) * -0.24)) scale(var(--hs)) rotate(12deg); }
}

.burst-ring {
  position: absolute;
  left: 50%;
  top: 0;
  width: calc(var(--fig-h) * 0.4);
  height: calc(var(--fig-h) * 0.4);
  border-radius: 9999px;
  border: 1.5px solid rgba(201, 168, 106, 0.75);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}
.is-playing .burst-ring {
  animation: burst 1.3s ease-out 2.95s forwards;
}
@keyframes burst {
  0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2.2); }
}

/* ---------- Step 5: brand reveal ---------- */
.brand-title {
  font-size: clamp(2.8rem, 9vw, 5.4rem);
  letter-spacing: 0.01em;
  opacity: 0;
}
.brand-line,
.brand-tagline {
  opacity: 0;
}
.is-playing .brand-title {
  animation: brand-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) 3.15s forwards;
}
.is-playing .brand-line {
  animation: line-in 0.9s ease 3.5s forwards;
}
.is-playing .brand-tagline {
  animation: brand-in 1s cubic-bezier(0.22, 1, 0.36, 1) 3.7s forwards;
}
@keyframes brand-in {
  from { opacity: 0; transform: translateY(14px); filter: blur(6px); letter-spacing: 0.12em; }
  to { opacity: 1; transform: none; filter: blur(0); letter-spacing: 0.01em; }
}
@keyframes line-in {
  from { opacity: 0; transform: scaleX(0.2); }
  to { opacity: 1; transform: scaleX(1); }
}

.splash-skip {
  opacity: 0;
}
.is-playing .splash-skip {
  animation: fade-in-full 0.6s ease 0.8s forwards;
}

/* Short screens (e.g. phones in landscape) */
@media (max-height: 520px) {
  .splash {
    --fig-h: clamp(140px, 46vh, 240px);
  }
  .splash-top {
    display: none;
  }
}

/* Reduced motion: show the final composed scene immediately */
@media (prefers-reduced-motion: reduce) {
  .splash *,
  .splash :deep(*) {
    animation: none !important;
  }
  .groom-enter,
  .bride-enter,
  .stage :deep(.arm) {
    transform: none;
  }
  .painted-img {
    opacity: 1;
    filter: none;
  }
  .stage :deep(.figure path),
  .stage :deep(.figure circle) {
    stroke-dashoffset: 0;
  }
  .stage :deep(.figure) {
    fill-opacity: 1;
  }
  .splash-top,
  .brand-title,
  .brand-line,
  .brand-tagline,
  .meet-glow,
  .big-heart {
    opacity: 1;
  }
  .big-heart {
    transform: translate(-50%, -120%) scale(1);
  }
  .meet-glow {
    transform: translate(-50%, -50%) scale(1);
  }
  .petal,
  .sparkle {
    display: none;
  }
}
</style>
