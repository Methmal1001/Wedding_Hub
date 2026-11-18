<template>
  <div class="flex items-center gap-1.5" :aria-label="`Rated ${rating} out of 5`">
    <div class="flex items-center gap-0.5">
      <span v-for="i in 5" :key="i" class="relative inline-block h-3.5 w-3.5 text-amber-100">
        <AppIcon name="star" :size="14" :stroke-width="1.2" filled class="absolute inset-0" />
        <span class="absolute inset-0 overflow-hidden text-amber-400" :style="{ width: fill(i) }">
          <AppIcon name="star" :size="14" :stroke-width="1.2" filled />
        </span>
      </span>
    </div>
    <span class="text-sm font-semibold text-charcoal">{{ rating.toFixed(1) }}</span>
    <span v-if="reviews" class="text-xs text-charcoal-soft">({{ reviews }})</span>
  </div>
</template>

<script setup>
const props = defineProps({
  rating: { type: Number, required: true },
  reviews: { type: Number, default: 0 }
})

// Percentage of each star to fill (supports half/partial stars).
const fill = (i) => `${Math.max(0, Math.min(1, props.rating - (i - 1))) * 100}%`
</script>
