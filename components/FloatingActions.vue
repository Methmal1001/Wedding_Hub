<template>
  <!-- Bottom-right: "back to top" (homepage & catalog) + demo chat assistant -->
  <div v-if="visible" class="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
    <!-- Chat window -->
    <Transition name="chat">
      <section
        v-if="chatOpen"
        class="chat-panel absolute bottom-[4.5rem] right-0 flex max-h-[min(560px,calc(100vh-7rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-rosewood/10"
        role="dialog"
        aria-label="Wedding Hub assistant (demo)"
      >
        <header class="flex items-center gap-3 bg-gradient-to-br from-rosewood to-rosewood-800 px-5 py-4 text-white">
          <span class="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white shadow-soft ring-2 ring-white/40">
            <img src="/favicon.svg" alt="" class="h-7 w-7" width="28" height="28">
            <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-rosewood" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 class="font-serif text-lg font-semibold leading-tight">Wedding Hub Assistant</h2>
            <p class="text-xs text-white/75">Demo chat · usually replies instantly</p>
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

        <!-- Messages -->
        <div ref="scroller" class="min-h-0 flex-1 space-y-3 overflow-y-auto bg-ivory/60 px-4 py-4 text-sm leading-relaxed" aria-live="polite">
          <div v-for="m in messages" :key="m.id" class="msg-in flex" :class="m.from === 'me' ? 'justify-end' : 'justify-start'">
            <div
              class="max-w-[85%] rounded-2xl px-4 py-2.5"
              :class="m.from === 'me' ? 'rounded-br-sm bg-rosewood text-white' : 'rounded-tl-sm bg-white text-charcoal shadow-sm ring-1 ring-rosewood/10'"
            >
              <p class="whitespace-pre-line">{{ m.text }}</p>
              <NuxtLink
                v-if="m.link"
                :to="m.link.to"
                class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rosewood hover:underline"
                @click="chatOpen = false"
              >
                {{ m.link.label }} <AppIcon name="arrowRight" :size="12" />
              </NuxtLink>
            </div>
          </div>
          <div v-if="typing" class="flex justify-start" aria-label="Assistant is typing">
            <div class="flex gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-rosewood/10">
              <span v-for="i in 3" :key="i" class="dot" :style="{ animationDelay: `${i * 0.15}s` }" />
            </div>
          </div>
        </div>

        <!-- Quick replies -->
        <div class="no-scrollbar flex gap-2 overflow-x-auto border-t border-rosewood/10 bg-white px-4 pt-3">
          <button
            v-for="q in quickReplies"
            :key="q.label"
            type="button"
            class="shrink-0 rounded-full bg-rosewood-50 px-3 py-1.5 text-xs font-medium text-rosewood-700 ring-1 ring-rosewood-100 transition hover:bg-rosewood hover:text-white"
            :disabled="typing"
            @click="send(q.label)"
          >
            {{ q.label }}
          </button>
        </div>

        <!-- Input -->
        <form class="flex items-center gap-2 bg-white px-4 pb-4 pt-3" @submit.prevent="send(draft)">
          <label for="chat-input" class="sr-only">Type your message</label>
          <input
            id="chat-input"
            ref="input"
            v-model="draft"
            type="text"
            maxlength="300"
            autocomplete="off"
            placeholder="Ask about vendors, venues…"
            class="h-11 min-w-0 flex-1 rounded-full border border-rosewood/15 bg-ivory px-4 text-sm outline-none transition focus:border-rosewood/40 focus:bg-white focus:ring-4 focus:ring-rosewood/10"
          >
          <button
            type="submit"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rosewood text-white transition hover:bg-rosewood-700 disabled:opacity-40"
            :disabled="!draft.trim() || typing"
            aria-label="Send message"
          >
            <AppIcon name="arrowRight" :size="18" />
          </button>
        </form>
        <p class="bg-white pb-3 text-center text-[10px] text-charcoal-soft/70">Demo assistant – answers are pre-written, no live agent.</p>
      </section>
    </Transition>

    <!-- Back to top (with scroll progress ring) -->
    <Transition name="pop">
      <button
        v-if="showPageUp && scrolled"
        type="button"
        class="group relative grid h-12 w-12 place-items-center rounded-full bg-white text-rosewood shadow-lift ring-1 ring-rosewood/10 transition hover:-translate-y-1 hover:bg-rosewood hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Back to top"
        title="Back to top"
        @click="backToTop"
      >
        <svg viewBox="0 0 48 48" class="pointer-events-none absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="2" />
          <circle cx="24" cy="24" r="22" fill="none" stroke="#00D2E6" stroke-width="2" stroke-linecap="round" pathLength="100" :stroke-dasharray="`${progress} 100`" />
        </svg>
        <AppIcon name="arrowUp" :size="20" class="transition-transform group-hover:-translate-y-0.5" />
      </button>
    </Transition>

    <!-- Chat launcher -->
    <button
      type="button"
      class="launcher relative grid h-14 w-14 place-items-center rounded-full bg-white text-rosewood shadow-soft ring-2 ring-rosewood/25 transition hover:ring-rosewood hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      :class="{ 'is-idle': !chatOpen && !opened }"
      :aria-label="chatOpen ? 'Close chat' : 'Chat with Wedding Hub'"
      :aria-expanded="chatOpen"
      @click="chatOpen = !chatOpen"
    >
      <Transition name="swap" mode="out-in">
        <AppIcon :key="chatOpen ? 'x' : 'chat'" :name="chatOpen ? 'close' : 'message'" :filled="!chatOpen" :size="chatOpen ? 24 : 30" />
      </Transition>
      <span v-if="!opened" class="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-rosewood-900 ring-2 ring-white">1</span>
    </button>
  </div>
</template>

<script setup>
const route = useRoute()
const { done: splashDone } = useSplash()

// Not on the admin panel / log-in pages, and not over the homepage intro.
const visible = computed(() => !route.path.startsWith('/admin') && !route.path.startsWith('/auth') && (route.path !== '/' || splashDone.value))
const showPageUp = computed(() => route.path === '/' || route.path === '/catalog')

// ---- back to top ----
const scrolled = ref(false)
const progress = ref(0)
const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrolled.value = window.scrollY > 400
  progress.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0
}
const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// ---- demo chat ----
const chatOpen = ref(false)
const opened = ref(false)
const typing = ref(false)
const draft = ref('')
const scroller = ref(null)
const input = ref(null)
let nextId = 1
const messages = ref([
  { id: nextId++, from: 'bot', text: 'Hi there! 👋 I’m the Wedding Hub assistant.' },
  { id: nextId++, from: 'bot', text: 'I can help you find venues, photographers and other wedding vendors in Sri Lanka. What are you planning?' }
])

const quickReplies = [
  { label: 'Find a venue' },
  { label: 'Photographers' },
  { label: 'Bridal dressing' },
  { label: 'List my business' },
  { label: 'Talk to a person' }
]

// Pre-written answers (demo – nothing is sent anywhere)
const ANSWERS = [
  { match: /venue|hotel|hall|reception|beach/i, text: 'We have hotels, reception halls and beach venues across the island – Colombo, Kandy, Galle, Bentota and more.', link: { label: 'Browse wedding venues', to: '/catalog?category=venues' } },
  { match: /photo|video|camera|album/i, text: 'Our photographers and videographers cover pre-shoots, the poruwa ceremony, drone shots and highlight films.', link: { label: 'See photographers', to: '/sub-category/photographers' } },
  { match: /bridal|dress|makeup|beauty|salon|hair|saree/i, text: 'For bridal dressing, hair and makeup, have a look at our salons and beauticians.', link: { label: 'Wedding day beauty', to: '/catalog?category=beauty' } },
  { match: /cater|food|menu|buffet/i, text: 'Caterers on Wedding Hub offer Sri Lankan, Indian and continental buffets – many include a tasting session.', link: { label: 'See caterers', to: '/sub-category/caterers' } },
  { match: /cake|chocolate/i, text: 'From tiered wedding cakes to cake structures and boxes – we’ve got you covered.', link: { label: 'Cakes & chocolate', to: '/catalog?category=cakes' } },
  { match: /list|business|vendor|advertis|register my/i, text: 'Great! Listing your business is free to start, with Silver and Gold plans for extra visibility.', link: { label: 'List your business', to: '/list-your-business' } },
  { match: /price|cost|budget|cheap|how much/i, text: 'Prices depend on the vendor and package. Every listing shows a starting price, and you can send an enquiry for a quote.', link: { label: 'Browse all vendors', to: '/catalog' } },
  { match: /person|human|agent|call|contact|phone|email/i, text: 'You can reach our team at hello@weddinghub.lk or +94 11 234 5678, Monday to Saturday, 9 am – 6 pm.', link: { label: 'Contact us', to: '/contact-us' } },
  { match: /^(hi|hello|hey|ayubowan)\b/i, text: 'Hello! 😊 Ask me about venues, photographers, bridal dressing, caterers or listing your business.' },
  { match: /thank/i, text: 'You’re welcome! Wishing you a beautiful wedding. 💐' }
]
const FALLBACK = {
  text: 'I’m a demo assistant, so I can only answer a few questions for now. Try asking about venues, photographers, caterers or listing your business.',
  link: { label: 'Browse all categories', to: '/catalog' }
}

const scrollDown = () => nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' }))

const send = (text) => {
  const t = String(text || '').trim()
  if (!t || typing.value) return
  messages.value.push({ id: nextId++, from: 'me', text: t })
  draft.value = ''
  typing.value = true
  scrollDown()
  const answer = ANSWERS.find((a) => a.match.test(t)) || FALLBACK
  setTimeout(() => {
    typing.value = false
    messages.value.push({ id: nextId++, from: 'bot', text: answer.text, link: answer.link })
    scrollDown()
  }, 700 + Math.min(900, answer.text.length * 8))
}

watch(chatOpen, async (v) => {
  if (!v) return
  opened.value = true
  scrollDown()
  await nextTick()
  // Don't pop the keyboard up on phones
  if (window.matchMedia('(pointer: fine)').matches) input.value?.focus()
})
watch(() => route.fullPath, () => {
  chatOpen.value = false
  nextTick(onScroll)
})

const onKey = (e) => {
  if (e.key === 'Escape' && chatOpen.value) chatOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: bottom right;
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.92);
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.swap-enter-from {
  opacity: 0;
  transform: rotate(-90deg);
}
.swap-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
.msg-in {
  animation: msg-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
.dot {
  @apply h-2 w-2 rounded-full bg-rosewood/50;
  animation: dot 1s ease-in-out infinite;
}
@keyframes dot {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
/* Gentle pulse until the chat has been opened once */
.launcher.is-idle::before {
  content: '';
  @apply absolute inset-0 rounded-full border-2 border-rosewood/50;
  z-index: -1;
  animation: ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  75%,
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .launcher.is-idle::before,
  .dot,
  .msg-in {
    animation: none;
  }
}
</style>
