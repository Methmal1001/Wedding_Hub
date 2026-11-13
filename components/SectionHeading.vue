<template>
  <div v-reveal :class="center ? 'mx-auto text-center' : ''" class="max-w-2xl">
    <p v-if="eyebrow" class="eyebrow" :class="center ? 'ornament' : ''">{{ eyebrow }}</p>
    <h2 class="heading-xl mt-4 text-[2.15rem] sm:text-5xl lg:text-[3.4rem]">
      <slot>{{ title }}</slot>
    </h2>
    <p v-if="subtitle" class="mt-4 text-base leading-relaxed text-charcoal-soft sm:text-lg">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  center: { type: Boolean, default: true }
})
</script>
