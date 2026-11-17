<template>
  <div class="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6 sm:flex-row">
    <button
      v-if="showPageUp && showBackToTop"
      type="button"
      class="grid h-14 w-14 place-items-center rounded-full bg-white text-rosewood shadow-lift ring-1 ring-rosewood/10 transition hover:-translate-y-1 hover:bg-rosewood-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      aria-label="Back to top"
      @click="backToTop"
    >
      <AppIcon name="arrowUp" :size="22" />
    </button>

    <section
      v-if="chatOpen"
      class="absolute bottom-20 right-0 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-rosewood/10"
      aria-label="Wedding Hub demo chat"
    >
      <header class="flex items-center justify-between bg-rosewood px-5 py-4 text-white">
        <div>
          <h2 class="font-serif text-lg font-semibold">Wedding Hub Assistant</h2>
          <p class="text-xs text-white/80">Demo chat</p>
        </div>
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close chat"
          @click="chatOpen = false"
        >
          <AppIcon name="close" :size="18" />
        </button>
      </header>
      <div class="space-y-3 p-5 text-sm leading-relaxed">
        <p class="w-fit max-w-[95%] rounded-2xl rounded-tl-sm bg-rosewood-50 px-4 py-3 text-charcoal">
          Hi! I can help you explore wedding vendors, venues, and services.
        </p>
        <p class="w-fit max-w-[95%] rounded-2xl rounded-tl-sm bg-rosewood-50 px-4 py-3 text-charcoal">
          This is a sample chat. Live support isn't connected yet.
        </p>
      </div>
    </section>

    <button
      type="button"
      class="grid h-14 w-14 place-items-center rounded-full bg-rosewood text-white shadow-lift transition hover:-translate-y-1 hover:bg-rosewood-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      :aria-label="chatOpen ? 'Close demo chat' : 'Open demo chat'"
      :aria-expanded="chatOpen"
      @click="chatOpen = !chatOpen"
    >
      <AppIcon :name="chatOpen ? 'close' : 'message'" :size="22" />
    </button>
  </div>
</template>

<script setup>
const showBackToTop = ref(false)
const chatOpen = ref(false)
const route = useRoute()
const showPageUp = computed(() => route.path === '/' || route.path === '/catalog')

const updateScrollState = () => {
  showBackToTop.value = window.scrollY > 300
}

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
})
</script>
