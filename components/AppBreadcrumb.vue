<template>
  <!-- Breadcrumb trail shown under a page's search bar -->
  <nav aria-label="Breadcrumb" class="container-site py-3">
    <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-charcoal-soft sm:text-[13px]">
      <li class="flex items-center">
        <NuxtLink to="/" class="crumb-link inline-flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5" />
          </svg>
          Home
        </NuxtLink>
      </li>
      <li v-for="(c, i) in items" :key="`${c.label}-${i}`" class="flex min-w-0 items-center gap-1.5">
        <AppIcon name="chevronDown" :size="12" class="-rotate-90 text-charcoal-soft/50" />
        <NuxtLink v-if="c.to && i < items.length - 1" :to="c.to" class="crumb-link">{{ c.label }}</NuxtLink>
        <span v-else class="truncate font-medium text-rosewood" aria-current="page">{{ c.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
// items: [{ label, to? }] – "Home" is added automatically; the last item is the current page.
defineProps({ items: { type: Array, required: true } })
</script>

<style scoped>
.crumb-link {
  @apply transition-colors hover:text-rosewood;
}
</style>
