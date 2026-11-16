<template>
  <AdminShell title="Listings" eyebrow="Directory" subtitle="Everything couples can find in the catalog. Feature, verify or hide any listing.">
    <template #actions>
      <button type="button" class="adm-btn-ghost" @click="exportCsv"><AppIcon name="download" :size="16" />Export CSV</button>
      <NuxtLink to="/catalog" target="_blank" class="adm-btn-soft"><AppIcon name="external" :size="16" />Open catalog</NuxtLink>
    </template>

    <!-- Summary -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <button
        v-for="s in summary"
        :key="s.id"
        type="button"
        class="adm-card p-4 text-left transition hover:-translate-y-0.5"
        :class="{ '!ring-2 !ring-rosewood/40': view === s.id }"
        @click="view = view === s.id ? 'all' : s.id"
      >
        <p class="text-xs text-charcoal-soft">{{ s.label }}</p>
        <p class="mt-1 font-serif text-3xl font-semibold">{{ s.count }}</p>
      </button>
    </div>

    <!-- Filters -->
    <div class="mt-4 flex flex-wrap items-center gap-2">
      <div class="relative min-w-[220px] flex-1">
        <AppIcon name="search" :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input v-model="q" type="search" class="adm-input !pl-9" placeholder="Search by name, owner, service or city" aria-label="Search listings">
      </div>
      <select v-model="category" class="adm-input !w-auto" aria-label="Category">
        <option value="">All categories</option>
        <option v-for="c in weddingCategories" :key="c.key" :value="c.key">{{ c.name }}</option>
      </select>
      <select v-model="source" class="adm-input !w-auto" aria-label="Source">
        <option value="">All sources</option>
        <option value="vendor">Added by vendors</option>
        <option value="directory">Directory</option>
        <option value="sample">Sample</option>
      </select>
    </div>

    <section class="adm-card mt-4 overflow-hidden">
      <div v-if="paged.length" class="overflow-x-auto">
        <table class="adm-table min-w-[900px]">
          <thead>
            <tr><th>Listing</th><th>Category</th><th>Location</th><th>Source</th><th>Rating</th><th class="text-center">Featured</th><th class="text-center">Verified</th><th>Status</th><th class="text-right">Actions</th></tr>
          </thead>
          <TransitionGroup tag="tbody" name="fade">
            <tr v-for="l in paged" :key="l.id" :class="{ 'opacity-60': l.hidden }">
              <td>
                <div class="flex items-center gap-3">
                  <img :src="l.gallery[0]" alt="" class="h-11 w-11 rounded-xl object-cover" loading="lazy">
                  <div class="min-w-0">
                    <p class="max-w-[220px] truncate font-medium">{{ l.name }}</p>
                    <p class="text-xs text-charcoal-soft">{{ l.owner || l.price }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-charcoal-soft">{{ categoryLabel(l.categoryKey) }}</p>
                <p class="max-w-[170px] truncate text-xs text-charcoal-soft/80">{{ l.sub }}</p>
              </td>
              <td class="text-charcoal-soft">{{ l.location }}</td>
              <td>
                <span class="rounded-full px-2 py-0.5 text-[11px] font-medium" :class="sourceCls[l.source]">{{ sourceLabel[l.source] }}</span>
              </td>
              <td>
                <span v-if="l.rating" class="flex items-center gap-1"><AppIcon name="star" :size="13" filled class="text-gold" />{{ l.rating.toFixed(1) }} <span class="text-xs text-charcoal-soft">({{ l.reviews }})</span></span>
                <span v-else class="text-xs text-charcoal-soft">—</span>
              </td>
              <td class="text-center">
                <button
                  type="button"
                  class="switch"
                  :class="{ 'is-on': l.featured }"
                  role="switch"
                  :aria-checked="!!l.featured"
                  :aria-label="`Feature ${l.name}`"
                  @click="site.setListingFlag(l, 'featured', !l.featured)"
                />
              </td>
              <td class="text-center">
                <button
                  type="button"
                  class="switch switch--green"
                  :class="{ 'is-on': l.verified }"
                  role="switch"
                  :aria-checked="!!l.verified"
                  :aria-label="`Verify ${l.name}`"
                  @click="site.setListingFlag(l, 'verified', !l.verified)"
                />
              </td>
              <td><AdminBadge :status="l.hidden ? 'hidden' : 'live'" /></td>
              <td>
                <div class="flex justify-end gap-1">
                  <NuxtLink v-if="!l.hidden" :to="listingPath(l)" target="_blank" class="adm-icon-btn" :aria-label="`View ${l.name}`" title="View on site"><AppIcon name="eye" :size="17" /></NuxtLink>
                  <NuxtLink v-if="l.ref" :to="`/admin/requests?ref=${l.ref}`" class="adm-icon-btn" title="Open request" :aria-label="`Open the request for ${l.name}`"><AppIcon name="inbox" :size="17" /></NuxtLink>
                  <button
                    v-if="l.source !== 'vendor' || !l.hidden"
                    type="button"
                    class="adm-icon-btn"
                    :title="l.hidden ? 'Show on site' : 'Hide from site'"
                    :aria-label="`${l.hidden ? 'Show' : 'Hide'} ${l.name}`"
                    @click="toggleHidden(l)"
                  >
                    <AppIcon :name="l.hidden ? 'eye' : 'eyeOff'" :size="17" />
                  </button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
      <AdminEmpty v-else icon="store" title="No listings found" text="Try clearing the search or filters." />
      <AdminPager v-model:page="page" :size="PAGE" :total="filtered.length" />
    </section>
  </AdminShell>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Listings – Wedding Hub Admin' })

const route = useRoute()
const site = useSiteData()
const actions = useAdminActions()
const { confirm } = useAdminDialog()
const { show } = useToast()

const PAGE = 10
const q = ref(String(route.query.q || ''))
const category = ref('')
const source = ref('')
const view = ref('all')
const page = ref(1)
watch(() => route.query.q, (v) => (q.value = String(v || '')))

const sourceLabel = { vendor: 'Vendor', directory: 'Directory', sample: 'Sample' }
const sourceCls = { vendor: 'bg-rosewood-50 text-rosewood-700', directory: 'bg-sky-50 text-sky-700', sample: 'bg-charcoal/[0.05] text-charcoal-soft' }

const all = computed(() => adminCatalog())
const summary = computed(() => [
  { id: 'all', label: 'All listings', count: all.value.length },
  { id: 'live', label: 'Live', count: all.value.filter((l) => !l.hidden).length },
  { id: 'hidden', label: 'Hidden', count: all.value.filter((l) => l.hidden).length },
  { id: 'featured', label: 'Featured', count: all.value.filter((l) => l.featured).length },
  { id: 'verified', label: 'Verified', count: all.value.filter((l) => l.verified).length }
])

const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  return all.value.filter(
    (l) =>
      (view.value === 'all' || (view.value === 'live' ? !l.hidden : !!l[view.value])) &&
      (!category.value || l.categoryKey === category.value) &&
      (!source.value || l.source === source.value) &&
      (!t || [l.name, l.owner, l.sub, l.location].some((v) => String(v || '').toLowerCase().includes(t)))
  )
})
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE, page.value * PAGE))
watch([q, category, source, view], () => (page.value = 1))

const toggleHidden = async (l) => {
  // Vendor listings are unpublished through their request (with a reason).
  if (l.source === 'vendor') {
    const s = siteDb.submissions.find((x) => x.ref === l.ref)
    if (s) await actions.unpublish(s)
    return
  }
  if (!l.hidden) {
    const ok = await confirm({ title: `Hide ${l.name}?`, message: 'It disappears from the catalog, search and its listing page until you show it again.', tone: 'danger', confirmLabel: 'Hide listing' })
    if (!ok) return
  }
  site.setListingFlag(l, 'hidden', !l.hidden)
  show(`${l.name} is ${l.hidden ? 'visible again' : 'now hidden'}.`, { title: l.hidden ? 'Listing restored' : 'Listing hidden', icon: l.hidden ? 'eye' : 'eyeOff' })
}

const exportCsv = () =>
  downloadCsv(`listings-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['ID', 'Name', 'Category', 'Service', 'Location', 'Source', 'Rating', 'Price', 'Featured', 'Verified', 'Hidden'],
    ...filtered.value.map((l) => [l.id, l.name, categoryLabel(l.categoryKey), l.sub, l.location, l.source, l.rating || '', l.price, !!l.featured, !!l.verified, !!l.hidden])
  ])
</script>

<style scoped>
.switch {
  @apply relative inline-block h-6 w-11 rounded-full bg-charcoal/15 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosewood/40;
}
.switch::after {
  content: '';
  @apply absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300;
}
.switch.is-on {
  @apply bg-gold;
}
.switch--green.is-on {
  @apply bg-emerald-500;
}
.switch.is-on::after {
  transform: translateX(20px);
}
</style>
