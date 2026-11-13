<template>
  <a
    href="#home"
    class="group inline-flex items-center gap-2.5"
    aria-label="Wedding Hub – back to top"
    @click.prevent="scrollTo('home')"
  >
    <span
      class="relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-[20deg]"
      :class="light ? 'bg-white/10 ring-1 ring-blush/40' : 'bg-rosewood shadow-soft'"
    >
      <!-- Interlocking rings monogram -->
      <svg viewBox="0 0 40 40" class="h-6 w-6" aria-hidden="true">
        <circle cx="16" cy="23" r="8" fill="none" stroke="#F7E1E3" stroke-width="2.2" />
        <circle cx="24" cy="23" r="8" fill="none" stroke="#C9A86A" stroke-width="2.2" />
        <path d="M20 6.5l2.6 3.4-2.6 3.1-2.6-3.1z" fill="#F7E1E3" />
      </svg>
    </span>
    <span class="whitespace-nowrap leading-none">
      <span
        class="block font-serif text-[1.55rem] font-semibold tracking-wide"
        :class="light ? 'text-white' : 'text-rosewood'"
      >
        Wedding <span class="italic" :class="light ? 'text-blush' : 'text-gold-dark'">Hub</span>
      </span>
      <span
        class="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.38em]"
        :class="light ? 'text-blush/70' : 'text-charcoal-soft'"
      >
        Sri Lanka
      </span>
    </span>
  </a>
</template>

<script setup>
defineProps({ light: { type: Boolean, default: false } })
const scrollTo = useScrollTo()
</script>
