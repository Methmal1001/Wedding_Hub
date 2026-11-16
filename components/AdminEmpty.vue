<template>
  <div class="flex flex-col items-center px-6 py-14 text-center">
    <span class="grid h-14 w-14 place-items-center rounded-2xl bg-blush-light text-rosewood">
      <AppIcon :name="icon" :size="24" />
    </span>
    <p class="mt-4 font-serif text-xl font-semibold text-charcoal">{{ title }}</p>
    <p v-if="text" class="mt-1 max-w-sm text-sm text-charcoal-soft">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'search' },
  title: { type: String, required: true },
  text: { type: String, default: '' }
})
</script>
