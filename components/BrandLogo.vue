<template>
  <a
    href="#home"
    class="group inline-flex shrink-0 items-center"
    aria-label="Wedding Hub by SLTMOBITEL – back to top"
    @click.prevent="scrollTo('home')"
  >
    <img
      :src="light ? '/images/wedding-hub-logo-white.png' : '/images/wedding-hub-logo.png'"
      alt="Wedding Hub by SLTMOBITEL"
      width="1200"
      height="233"
      class="block h-auto w-[170px] transition-opacity duration-300 group-hover:opacity-85 sm:w-[205px]"
    />
  </a>
</template>

<script setup>
defineProps({ light: { type: Boolean, default: false } })
const scrollTo = useScrollTo()
</script>
