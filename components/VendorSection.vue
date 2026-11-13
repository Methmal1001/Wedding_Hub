<template>
  <section id="vendors" class="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
    <!-- Soft decorative blush -->
    <div aria-hidden="true" class="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-blush/30 blur-3xl" />
    <div aria-hidden="true" class="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />

    <div class="container-site relative">
      <div class="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          :center="false"
          eyebrow="Featured Vendors"
          title="Discover Our Featured Vendors"
          subtitle="Meet the professionals who make your special day unforgettable."
        />
        <button v-reveal type="button" class="btn-outline shrink-0" @click="viewAll">
          View All Vendors
          <AppIcon name="arrowRight" :size="16" />
        </button>
      </div>

      <!-- Filter tabs -->
      <div v-reveal class="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter featured vendors">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.key"
          class="tab"
          :class="{ 'is-on': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <TransitionGroup tag="div" name="list" class="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <div v-for="(v, i) in visible" :key="v.id" v-reveal="(i % 3) * 110">
          <VendorCard :vendor="v" />
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup>
import { vendors } from '~/data/vendors'

const featured = vendors.filter((v) => v.featured)
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: 'All Featured' },
  ...[...new Map(featured.map((v) => [v.categoryKey, v.category])).entries()].map(([key, label]) => ({ key, label }))
]

const visible = computed(() =>
  activeTab.value === 'all' ? featured : featured.filter((v) => v.categoryKey === activeTab.value)
)

const viewAll = () => navigateTo('/catalog')
</script>

<style scoped>
.tab {
  @apply shrink-0 whitespace-nowrap rounded-full border border-rosewood/15 bg-ivory px-5 py-2.5 text-sm font-medium text-charcoal transition-all duration-300 hover:border-rosewood hover:text-rosewood;
}
.tab.is-on {
  @apply border-rosewood bg-rosewood text-white shadow-soft;
}
</style>
