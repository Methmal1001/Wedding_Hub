<template>
  <div class="relative min-h-screen bg-ivory">
    <AppNavbar />

    <main>
      <CategoryHero
        v-if="activeCategory"
        :key="activeCategory.key"
        :category="activeCategory"
        :slides="activeCategorySlides"
        :tagline="categoryTagline(activeCategory.key)"
      />
      <CatalogHero v-else />

      <div class="sticky top-[72px] z-40 border-y border-rosewood/10 bg-ivory/95 shadow-sm backdrop-blur-md">
        <form class="container-site grid grid-cols-2 gap-2.5 py-3 sm:flex sm:gap-2.5" role="search" @submit.prevent="applySearch">
          <label class="relative col-span-2 sm:min-w-0 sm:flex-1">
            <span class="sr-only">Search Wedding Hub services</span>
            <AppIcon name="search" :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-soft" />
            <input
              v-model="draftQ"
              type="search"
              placeholder="Search Wedding Hub services"
              class="h-12 w-full rounded-full border border-rosewood/15 bg-white pl-11 pr-4 text-[15px] text-charcoal shadow-sm outline-none transition placeholder:text-charcoal-soft/60 focus:border-rosewood/40 focus:ring-4 focus:ring-rosewood/10"
              @input="debouncedSearch"
            >
          </label>
          <label class="relative min-w-0 sm:w-44 sm:shrink-0">
            <span class="sr-only">Location</span>
            <AppIcon name="pin" :size="16" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
            <select
              :value="filters.loc"
              class="select-pill pl-10"
              @change="update({ loc: $event.target.value })"
            >
              <option value="">All locations</option>
              <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
            </select>
            <AppIcon name="chevronDown" :size="15" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-soft" />
          </label>
          <label class="relative min-w-0 sm:w-48 sm:shrink-0">
            <span class="sr-only">Sort by</span>
            <select :value="filters.sort" class="select-pill pl-4" @change="update({ sort: $event.target.value })">
              <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <AppIcon name="chevronDown" :size="15" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-soft" />
          </label>
        </form>
      </div>
      <AppBreadcrumb :items="crumbs" class="border-b border-rosewood/10" />

      <!-- Category page: services + rotating side banners (no vendor profiles) -->
      <section v-if="!showListings" class="container-site py-10 sm:py-12">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-12">
          <div class="min-w-0">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p class="eyebrow">Browse by service</p>
                <h2 class="mt-2 font-serif text-3xl font-semibold">{{ activeCategory.name }}</h2>
              </div>
              <p class="text-sm text-charcoal-soft">Choose a service to see its vendors</p>
            </div>
            <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              <NuxtLink
                v-for="tile in activeSubcategories"
                :key="tile.name"
                :to="catalogLink({ category: activeCategory.key, sub: tile.name })"
                class="sub-tile group block"
              >
                <span class="block aspect-[4/3] overflow-hidden rounded-xl">
                  <img :src="tile.image" alt="" class="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy">
                </span>
                <span class="mt-2.5 block px-1 text-left text-[13px] font-semibold leading-snug text-charcoal transition group-hover:text-rosewood sm:text-sm">
                  {{ tile.name }}
                </span>
                <span class="block px-1 pb-0.5 text-left text-[11px] text-charcoal-soft">
                  {{ tile.count ? `${tile.count} listing${tile.count > 1 ? 's' : ''}` : 'Explore' }}
                </span>
              </NuxtLink>
            </div>
          </div>
          <CategorySidebar :key="activeCategory.key" :category-key="activeCategory.key" class="lg:sticky lg:top-[150px] lg:self-start" />
        </div>
      </section>

      <!-- Results -->
      <section v-else class="container-site py-10 sm:py-12">
        <p
          v-if="subFallback"
          class="mb-6 flex items-start gap-3 rounded-2xl bg-gold-light/30 px-4 py-3 text-sm text-charcoal ring-1 ring-gold/30"
          role="status"
        >
          <AppIcon name="sparkles" :size="18" class="mt-0.5 shrink-0 text-gold-dark" />
          <span>No exact matches found – showing other available listings.</span>
        </p>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-charcoal-soft" aria-live="polite">
            Showing <span class="font-semibold text-charcoal">{{ visible.length }}</span> of
            <span class="font-semibold text-charcoal">{{ results.length }}</span>
            {{ results.length === 1 ? 'professional' : 'professionals' }}
            <template v-if="summary"> for <span class="font-semibold text-rosewood">{{ summary }}</span></template>
          </p>
          <button v-if="hasFilters" type="button" class="text-sm font-medium text-rosewood underline-offset-4 hover:underline" @click="clearAll">
            Clear all filters
          </button>
        </div>

        <TransitionGroup v-if="results.length" tag="div" name="list" class="relative grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6 lg:gap-7">
          <CatalogCard v-for="item in visible" :key="item.id" :item="item" compact />
        </TransitionGroup>

        <div v-else class="card-surface flex flex-col items-center px-6 py-16 text-center">
          <span class="grid h-16 w-16 place-items-center rounded-full bg-rosewood-50 text-rosewood">
            <AppIcon name="search" :size="26" />
          </span>
          <template v-if="starFilter">
            <h2 class="mt-5 font-serif text-2xl font-semibold">No {{ starFilter }}-star professionals yet</h2>
            <p class="mt-2 max-w-md text-charcoal-soft">
              None of the matching professionals currently has a {{ starFilter }}-star rating. Try another rating or see them all.
            </p>
            <button type="button" class="btn-primary mt-6" @click="update({ sort: 'all' })">Show all ratings</button>
          </template>
          <template v-else>
            <h2 class="mt-5 font-serif text-2xl font-semibold">No professionals found</h2>
            <p class="mt-2 max-w-md text-charcoal-soft">
              Try a different search or location.
            </p>
            <button type="button" class="btn-primary mt-6" @click="clearAll">Show all professionals</button>
          </template>
        </div>

        <div v-if="visible.length < results.length" class="mt-12 flex justify-center">
          <button type="button" class="btn-outline" @click="limit += pageSize">
            Load more
            <AppIcon name="chevronDown" :size="16" />
          </button>
        </div>
      </section>
    </main>

    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import CatalogHero from '~/components/CatalogHero.vue'
import CategoryHero from '~/components/CategoryHero.vue'
import { locations } from '~/data/locations'
import { filterCatalog, sortOptions, catalogLink, normaliseSort } from '~/composables/useCatalog'
import { weddingCategories } from '~/data/weddingCategories'
import { categorySlides, categoryTagline, subcategoryTiles } from '~/composables/useCategoryPage'

// Visiting the catalog counts as having seen the intro, so going back to the
// homepage from here never replays the splash screen.
useSplash().finish()

const route = useRoute()
const router = useRouter()

// Old-style links (/catalog?category=x&sub=y) open the sub-category page.
if (route.query.sub && !route.query.q) {
  await navigateTo(catalogLink({ sub: String(route.query.sub), loc: String(route.query.loc || ''), sort: String(route.query.sort || '') }), { replace: true })
}
const DESKTOP_PAGE_SIZE = 15
const MOBILE_PAGE_SIZE = 6
const pageSize = ref(DESKTOP_PAGE_SIZE)
const limit = ref(DESKTOP_PAGE_SIZE)

// The URL query is the single source of truth, so filtered views can be shared.
const filters = computed(() => ({
  q: String(route.query.q || ''),
  loc: String(route.query.loc || ''),
  category: String(route.query.category || ''),
  sub: String(route.query.sub || ''),
  sort: normaliseSort(String(route.query.sort || 'recommended'))
}))

const activeCategory = computed(() => weddingCategories.find((category) => category.key === filters.value.category) || null)
const activeCategorySlides = computed(() => activeCategory.value ? categorySlides(activeCategory.value.key) : [])
// A category opens as its own page (services + side banners). Vendor profiles
// only show there when the visitor searches or picks a location.
const crumbs = computed(() => {
  if (!activeCategory.value) return filters.value.q ? [{ label: 'Catalog', to: '/catalog' }, { label: `Search: “${filters.value.q}”` }] : [{ label: 'Catalog' }]
  return [{ label: 'Categories', to: '/catalog' }, { label: activeCategory.value.name }]
})
const showListings = computed(() => !activeCategory.value || !!(filters.value.q || filters.value.loc))
const activeSubcategories = computed(() => activeCategory.value ? subcategoryTiles(activeCategory.value.key) : [])

// If a sub-category has no listings yet, fall back to its whole category
// and tell the user, instead of showing an empty page.
const exact = computed(() => filterCatalog(filters.value))
// e.g. 4 when the rating dropdown is set to '4 stars'
const starFilter = computed(() => (String(filters.value.sort).startsWith('stars-') ? Number(filters.value.sort.split('-')[1]) : 0))
const subFallback = computed(() => !!filters.value.sub && exact.value.length === 0)
const results = computed(() =>
  subFallback.value ? filterCatalog({ ...filters.value, sub: '' }) : exact.value
)
const visible = computed(() => results.value.slice(0, limit.value))
const hasFilters = computed(() => !!(filters.value.q || filters.value.loc || filters.value.category || filters.value.sub))

const summary = computed(() => {
  const parts = []
  if (filters.value.q) parts.push(`“${filters.value.q}”`)
  if (filters.value.loc) parts.push(`in ${filters.value.loc}`)
  if (activeCategory.value) parts.push(activeCategory.value.name)
  return parts.join(' ')
})

const update = (patch) => {
  // Changing the category clears any sub-category filter.
  const next = { ...filters.value, ...patch }
  if ('category' in patch && !('sub' in patch)) next.sub = ''
  const query = {}
  if (next.q) query.q = next.q
  if (next.loc) query.loc = next.loc
  if (next.category) query.category = next.category
  if (next.sub) query.sub = next.sub
  if (next.sort && next.sort !== 'recommended') query.sort = next.sort
  limit.value = pageSize.value
  router.replace({ query })
}

// Search box: keep a local draft and push it to the URL after a short pause.
const draftQ = ref(filters.value.q)
watch(() => filters.value.q, (v) => {
  if (v !== draftQ.value) draftQ.value = v
})
let t = null
const debouncedSearch = () => {
  clearTimeout(t)
  t = setTimeout(() => update({ q: draftQ.value.trim() }), 300)
}
const applySearch = () => {
  clearTimeout(t)
  update({ q: draftQ.value.trim() })
}

const clearAll = () => {
  draftQ.value = ''
  update({ q: '', loc: '', category: '', sub: '' })
}

const syncPageSize = () => {
  const nextPageSize = window.innerWidth < 640 ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE
  if (pageSize.value !== nextPageSize) {
    pageSize.value = nextPageSize
    limit.value = nextPageSize
  }
}

useSeoMeta({
  title: () => activeCategory.value ? `${activeCategory.value.name} – Wedding Hub` : 'Catalog – Wedding Hub',
  description: () => activeCategory.value
    ? `Browse ${activeCategory.value.name.toLowerCase()} wedding services and vendors across Sri Lanka.`
    : 'Browse wedding photographers, venues, bridal salons, florists, cakes and more across Sri Lanka.'
})

onMounted(() => {
  syncPageSize()
  window.addEventListener('resize', syncPageSize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncPageSize)
  clearTimeout(t)
})
</script>

<style scoped>
.sub-tile {
  @apply relative rounded-2xl bg-white p-2 ring-1 ring-charcoal/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft hover:ring-rosewood/30;
}
.select-pill {
  @apply h-12 w-full cursor-pointer appearance-none rounded-full border border-rosewood/15 bg-white pr-10 text-[15px] text-charcoal shadow-sm outline-none transition focus:border-rosewood/40 focus:ring-4 focus:ring-rosewood/10;
}
</style>
