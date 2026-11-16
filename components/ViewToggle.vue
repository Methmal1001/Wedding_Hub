<template>
  <!-- Switch between photo cards ("image") and compact rows ("grid") -->
  <div class="inline-flex rounded-full bg-white p-1 ring-1 ring-charcoal/10" role="group" aria-label="Listing view">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition"
      :class="modelValue === opt.value ? 'bg-rosewood text-white shadow-soft' : 'text-charcoal-soft hover:text-rosewood'"
      :aria-pressed="modelValue === opt.value"
      @click="$emit('update:modelValue', opt.value)"
    >
      <AppIcon :name="opt.icon" :size="15" />
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: 'grid' } })
defineEmits(['update:modelValue'])

const options = [
  { value: 'grid', label: 'Grid view', icon: 'grid' },
  { value: 'image', label: 'Image view', icon: 'image' }
]
</script>
