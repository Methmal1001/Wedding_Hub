<template>
  <!-- "Showing 1–10 of 42" + page buttons -->
  <div v-if="total > 0" class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-charcoal-soft">
    <p>Showing <strong class="text-charcoal">{{ from }}–{{ to }}</strong> of <strong class="text-charcoal">{{ total }}</strong></p>
    <div v-if="pages > 1" class="flex items-center gap-1">
      <button type="button" class="adm-icon-btn !h-8 !w-8" :disabled="page <= 1" aria-label="Previous page" @click="$emit('update:page', page - 1)">
        <AppIcon name="chevronDown" :size="16" class="rotate-90" />
      </button>
      <button
        v-for="n in pages"
        :key="n"
        type="button"
        class="h-8 min-w-[32px] rounded-lg px-2 text-xs font-semibold transition"
        :class="n === page ? 'bg-rosewood text-white' : 'text-charcoal-soft hover:bg-rosewood-50 hover:text-rosewood'"
        :aria-current="n === page ? 'page' : undefined"
        @click="$emit('update:page', n)"
      >
        {{ n }}
      </button>
      <button type="button" class="adm-icon-btn !h-8 !w-8" :disabled="page >= pages" aria-label="Next page" @click="$emit('update:page', page + 1)">
        <AppIcon name="chevronDown" :size="16" class="-rotate-90" />
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  page: { type: Number, required: true },
  size: { type: Number, default: 10 },
  total: { type: Number, required: true }
})
defineEmits(['update:page'])
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.size)))
const from = computed(() => (props.page - 1) * props.size + 1)
const to = computed(() => Math.min(props.total, props.page * props.size))
</script>
