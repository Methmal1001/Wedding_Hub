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

    <!-- Stage -->
    <div class="relative flex h-full flex-col items-center justify-center px-4 pt-[5vh]">
      <!-- Hand-drawn couple sketch (public/images/splash-couple.png) -->
      <div class="stage relative">
        <div class="meet-glow absolute left-[57%] top-[22%]" />
        <div class="floor-shadow absolute bottom-[0.5%] left-1/2 -translate-x-1/2" />

        <!-- Step 2 & 3: the sketch "draws" itself from top to bottom, then breathes gently -->
        <div class="sketch-float relative z-10 h-full w-full">
          <img
            src="/images/splash-couple.png"
            alt="A pencil sketch of a bride and groom embracing, the groom holding a bouquet"
            width="691"
            height="1100"
            class="sketch h-full w-full select-none object-contain"
            draggable="false"
            fetchpriority="high"
          >
          <!-- pencil-tip shimmer that follows the drawing edge -->
          <span class="sketch-pen" aria-hidden="true" />
        </div>

        <!-- Step 4: hearts between their faces -->
        <div class="hearts pointer-events-none absolute left-[57%] top-[5%] z-30">
          <svg class="big-heart" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21Z" fill="#E11D48" />
          </svg>
          <svg
            v-for="(h, i) in hearts"
            :key="`h${i}`"
            class="mini-heart"
            viewBox="0 0 24 24"
            aria-hidden="true"
            :style="{ '--hx': h.x + 'px', '--hs': h.s, animationDelay: h.delay + 's' }"
          >
            <path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21Z" :fill="h.c" />
          </svg>
          <span class="burst-ring" />
        </div>
      </div>

      <!-- Step 5: brand reveal -->
      <div class="relative z-30 mt-4 text-center sm:mt-6">
        <h1 class="brand-title" aria-label="Wedding Hub">WeddingHub</h1>
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

// Time the scene is shown before the fade/zoom-out begins (ms).
// The leave transition adds ~0.9s, so the full splash is ≈ 5.9s.
const SCENE_DURATION = 5000

const playing = ref(false)
let timer = null
let finished = false

// Fixed (deterministic) particle layouts so SSR and client markup match.
const petals = [
  { x: 4, s: 14, d: 7.5, delay: -1.0, sway: 60, c: '#00D2E6' },
  { x: 12, s: 10, d: 9.0, delay: -4.0, sway: -40, c: '#E3F6FF' },
  { x: 20, s: 16, d: 8.2, delay: -2.5, sway: 70, c: '#4DFF00' },
  { x: 29, s: 11, d: 10.0, delay: -6.0, sway: -55, c: '#00D2E6' },
  { x: 37, s: 13, d: 7.8, delay: -0.5, sway: 45, c: '#FFFFFF' },
  { x: 46, s: 9, d: 9.6, delay: -3.2, sway: -35, c: '#E3F6FF' },
  { x: 55, s: 15, d: 8.4, delay: -5.1, sway: 65, c: '#4DFF00' },
  { x: 63, s: 12, d: 9.2, delay: -1.8, sway: -60, c: '#00D2E6' },
  { x: 71, s: 10, d: 7.2, delay: -4.6, sway: 50, c: '#FFFFFF' },
  { x: 79, s: 16, d: 8.8, delay: -2.2, sway: -45, c: '#E3F6FF' },
  { x: 87, s: 12, d: 9.8, delay: -6.4, sway: 55, c: '#00D2E6' },
  { x: 95, s: 11, d: 7.6, delay: -3.6, sway: -50, c: '#4DFF00' },
  { x: 33, s: 8, d: 11.0, delay: -7.5, sway: 30, c: '#0039C2' },
  { x: 68, s: 8, d: 10.5, delay: -8.2, sway: -30, c: '#0039C2' }
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
  { x: -46, s: 0.7, delay: 3.0, c: '#F43F5E' },
  { x: 38, s: 0.9, delay: 3.15, c: '#E11D48' },
  { x: -18, s: 0.55, delay: 3.3, c: '#FB7185' },
  { x: 56, s: 0.6, delay: 3.45, c: '#F43F5E' },
  { x: -60, s: 0.5, delay: 3.6, c: '#BE123C' },
  { x: 20, s: 0.65, delay: 3.75, c: '#FB7185' }
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
  --fig-h: clamp(220px, 54vh, 480px);
  --ease-walk: cubic-bezier(0.25, 0.8, 0.3, 1);
  --line: #002A8F;
}

/* ---------- Background: soft blush light ---------- */
.splash-bg {
  background:
    radial-gradient(ellipse 60% 50% at 50% 40%, #FBFDFF 0%, rgba(251, 253, 255, 0) 70%),
    radial-gradient(ellipse at 50% 40%, #F5FAFF 0%, #E6F4FF 50%, #C7E4FA 100%);
}
.splash-vignette {
  background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 42, 143, 0.16) 100%);
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
  box-shadow: inset -2px -2px 4px rgba(0, 42, 143, 0.12);
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
   The sketch image is 691×1100. */
.stage {
  height: var(--fig-h);
  width: calc(var(--fig-h) * 691 / 1100);
}

/* ---------- Sketch reveal: drawn top-to-bottom like a pencil ---------- */
.sketch {
  opacity: 0;
  -webkit-mask-image: linear-gradient(to bottom, #000 42%, transparent 58%);
  mask-image: linear-gradient(to bottom, #000 42%, transparent 58%);
  -webkit-mask-size: 100% 260%;
  mask-size: 100% 260%;
  -webkit-mask-position: 0 100%;
  mask-position: 0 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  transform: translateY(14px) scale(0.97);
  filter: blur(2px);
}
.is-playing .sketch {
  animation: sketch-draw 2.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards;
}
@keyframes sketch-draw {
  0% { opacity: 0; -webkit-mask-position: 0 100%; mask-position: 0 100%; transform: translateY(14px) scale(0.97); filter: blur(2px); }
  12% { opacity: 1; }
  100% { opacity: 1; -webkit-mask-position: 0 0; mask-position: 0 0; transform: none; filter: blur(0); }
}

/* glowing pencil tip that travels down with the reveal */
.sketch-pen {
  position: absolute;
  left: 8%;
  right: 8%;
  top: 0;
  height: 3px;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, rgba(0, 210, 230, 0.9), rgba(77, 255, 0, 0.8), transparent);
  filter: blur(1px);
  box-shadow: 0 0 18px rgba(0, 210, 230, 0.6);
  opacity: 0;
}
.is-playing .sketch-pen {
  animation: pen-run 2.6s cubic-bezier(0.45, 0, 0.25, 1) 0.3s forwards;
}
@keyframes pen-run {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* gentle breathing sway once drawn */
.is-playing .sketch-float {
  animation: sketch-breathe 4.5s ease-in-out 2.9s infinite;
}
@keyframes sketch-breathe {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(-0.4deg); }
}

.meet-glow {
  width: calc(var(--fig-h) * 1.3);
  height: calc(var(--fig-h) * 1.3);
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(235, 248, 255, 0.65) 35%, rgba(227, 246, 255, 0) 70%);
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
  background: radial-gradient(ellipse, rgba(0, 42, 143, 0.25) 0%, transparent 70%);
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
  filter: drop-shadow(0 6px 12px rgba(225, 29, 72, 0.35));
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
  border: 1.5px solid rgba(244, 63, 94, 0.7);
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
  font-family: 'Birthstone Bounce', 'Great Vibes', cursive;
  font-weight: 500;
  font-size: clamp(3.6rem, 13vw, 7rem);
  line-height: 1.05;
  padding: 0 0.25em 0.12em; /* room for swashes so the gradient isn't clipped */
  background: linear-gradient(100deg, #0039c2 0%, #0049f2 45%, #00b8d9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 6px 14px rgba(0, 42, 143, 0.18));
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
  .sketch { opacity: 1 !important; -webkit-mask-image: none !important; mask-image: none !important; transform: none !important; filter: none !important; }
  .sketch-pen { display: none; }
  .splash *,
  .splash :deep(*) {
    animation: none !important;
  }
  .groom-enter,
  .bride-enter,
  .stage :deep(.arm) {
    transform: none;
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
