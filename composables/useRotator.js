// Auto-rotating index for carousels / banner slots.
// - Starts on mount only (no timers during SSR).
// - Pauses while hovered/focused (call pause/resume) and when the tab is hidden.
// - Does not auto-advance for users who prefer reduced motion.
export const useRotator = (length, interval = 5000) => {
  const index = ref(0)
  const paused = ref(false)
  // Bumped on every manual or automatic change so CSS progress bars restart.
  const tick = ref(0)
  let timer = null
  let reduced = false

  const count = () => unref(length) || 0
  const go = (i) => {
    const n = count()
    if (!n) return
    index.value = ((i % n) + n) % n
    tick.value++
    schedule()
  }
  const next = () => go(index.value + 1)
  const prev = () => go(index.value - 1)

  function schedule() {
    clearTimeout(timer)
    if (reduced || paused.value || count() < 2 || (import.meta.client && document.hidden)) return
    timer = setTimeout(next, interval)
  }
  const pause = () => {
    paused.value = true
    clearTimeout(timer)
  }
  const resume = () => {
    paused.value = false
    schedule()
  }

  const onVisibility = () => schedule()

  // Start again from the first slide when the list changes (e.g. new category).
  watch(() => count(), () => go(0))

  onMounted(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.addEventListener('visibilitychange', onVisibility)
    schedule()
  })
  onBeforeUnmount(() => {
    clearTimeout(timer)
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { index, tick, paused, go, next, prev, pause, resume, reset: () => go(0) }
}
