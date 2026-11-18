<template>
  <!-- Monthly / yearly billing switch -->
  <div class="relative inline-grid grid-cols-2 rounded-full p-1 ring-1" :class="light ? 'bg-white/10 ring-white/20' : 'bg-blush-light ring-rosewood/10'" role="group" aria-label="Billing period">
    <span
      class="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-rosewood to-rosewood-700 shadow-soft transition-transform duration-500"
      :class="modelValue === 'yearly' ? 'translate-x-full' : 'translate-x-0'"
      aria-hidden="true"
    />
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="relative z-10 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors duration-300"
      :class="modelValue === o.value ? 'text-white' : light ? 'text-white/80 hover:text-white' : 'text-charcoal-soft hover:text-rosewood'"
      :aria-pressed="modelValue === o.value"
      @click="$emit('update:modelValue', o.value)"
    >
      {{ o.label }}
      <span v-if="o.badge" class="rounded-full bg-gold px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-rosewood-900">{{ o.badge }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'monthly' },
  light: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])

const options = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly', badge: '-20%' }
]
</script>
