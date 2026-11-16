<template>
  <div class="relative min-h-screen bg-ivory">
    <AppNavbar />

    <main>
      <!-- Category page: rotating main banner -->
      <CategoryHero
        v-if="activeCategory"
        :key="activeCategory.key"
        :category="activeCategory"
        :slides="heroSlides"
        :tagline="categoryTagline(activeCategory.key)"
      />

      <!-- Header (on a category page this becomes the search & category toolbar) -->
      <section class="relative z-10 border-b border-rosewood/10 bg-gradient-to-b from-blush-light via-blush-light/60 to-ivory">
        <!-- Decorative blobs are clipped on their own layer so the "More" menu can overflow the header -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-blush blur-3xl" />
          <div class="absolute -left-40 top-10 h-[320px] w-[320px] rounded-full bg-gold-light/30 blur-3xl" />
        </div>

        <div class="container-site relative pb-8" :class="activeCategory ? 'pt-7' : 'pt-10 sm:pt-14'">
          <nav v-if="!activeCategory" aria-label="Breadcrumb" class="text-xs text-charcoal-soft">
            <NuxtLink to="/" class="transition hover:text-rosewood">Home</NuxtLink>
            <span class="mx-2 text-charcoal-soft/40">/</span>
            <span class="text-rosewood">Catalog</span>
          </nav>

          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" :class="{ 'mt-4': !activeCategory }">
            <div v-if="!activeCategory">
              <h1 class="heading-xl text-[2.6rem] sm:text-6xl">Catalog</h1>
              <p class="mt-2 max-w-xl text-charcoal-soft">
                Browse Sri Lanka's finest wedding professionals – compare portfolios, prices and reviews in one place.
              </p>
            </div>

            <!-- Search + location + sort -->
            <form class="flex w-full flex-col gap-2.5 sm:flex-row" :class="{ 'lg:max-w-2xl': !activeCategory }" role="search" @submit.prevent="applySearch">
              <label class="relative flex-1">
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
              <label class="relative sm:w-44">
                <span class="sr-only">Location</span>
                <AppIcon name="pin" :size="16" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rosewood" />
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
              <label class="relative sm:w-48">
                <span class="sr-only">Sort by</span>
                <select :value="filters.sort" class="select-pill pl-4" @change="update({ sort: $event.target.value })">
                  <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <AppIcon name="chevronDown" :size="15" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-soft" />
              </label>
            </form>
          </div>

          <!-- Category chips -->
          <div class="relative flex items-center gap-2" :class="activeCategory ? 'mt-5' : 'mt-7'">
            <div class="chip-row no-scrollbar -ml-4 flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 pl-4 pr-6 sm:ml-0 sm:pl-0">
              <button
                v-for="c in primaryChips"
                :key="c.key"
                type="button"
                class="chip"
                :class="{ 'is-on': filters.category === c.key }"
                @click="update({ category: c.key })"
              >
                {{ c.label }}
              </button>
            </div>

            <!-- More dropdown -->
            <div ref="moreRef" class="relative shrink-0 pb-1">
              <button
                type="button"
                class="chip flex items-center gap-1.5"
                :class="{ 'is-on': moreActive }"
                :aria-expanded="moreOpen"
                aria-haspopup="menu"
                @click="moreOpen = !moreOpen"
              >
                {{ moreActive ? moreActive.label : 'More' }}
                <AppIcon name="chevronDown" :size="14" class="transition-transform" :class="{ 'rotate-180': moreOpen }" />
              </button>
              <Transition name="fade">
                <ul
                  v-if="moreOpen"
                  role="menu"
                  class="absolute right-0 top-[calc(100%+8px)] z-30 max-h-80 w-64 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-lift ring-1 ring-rosewood/10"
                >
                  <li v-for="c in moreChips" :key="c.key" role="none">
                    <button
                      type="button"
                      role="menuitem"
                      class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-rosewood-50"
                      :class="filters.category === c.key ? 'font-semibold text-rosewood' : 'text-charcoal'"
                      @click="pickMore(c.key)"
                    >
                      {{ c.label }}
                      <AppIcon v-if="filters.category === c.key" name="check" :size="15" />
                    </button>
                  </li>
                </ul>
              </Transition>
            </div>
          </div>
        </div>
      </section>

      <!-- Results -->
      <section class="container-site py-10 sm:py-12">
        <div :class="activeCategory ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-12' : ''">
          <div class="min-w-0">
            <!-- Sub-categories of the selected category -->
            <div v-if="activeCategory" :class="{ 'mb-10': showListings }">
              <div class="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p class="eyebrow">Browse by service</p>
                  <h2 class="mt-2 font-serif text-3xl font-semibold">{{ activeCategory.name }}</h2>
                </div>
                <p class="text-sm text-charcoal-soft">Choose a service to see its vendors</p>
              </div>
              <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                <NuxtLink
                  v-for="tile in subTiles"
                  :key="tile.name"
                  :to="catalogLink({ category: activeCategory.key, sub: tile.name, loc: filters.loc })"
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
            <!-- Listings: on a category page only shown when searching (each service has its own page) -->
            <template v-if="showListings">
            <p
              v-if="subFallback"
              class="mb-6 flex items-start gap-3 rounded-2xl bg-gold-light/30 px-4 py-3 text-sm text-charcoal ring-1 ring-gold/30"
              role="status"
            >
              <AppIcon name="sparkles" :size="18" class="mt-0.5 shrink-0 text-gold-dark" />
              <span>
                No <strong>{{ filters.sub }}</strong> listings yet – showing everything in
                <strong>{{ categoryName(filters.category) }}</strong>.
              </span>
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

            <TransitionGroup v-if="results.length" tag="div" name="list" :class="activeCategory ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'" class="relative grid gap-6 lg:gap-7">
              <CatalogCard v-for="item in visible" :key="item.id" :item="item" />
            </TransitionGroup>

            <!-- Empty state -->
            <div v-else class="card-surface flex flex-col items-center px-6 py-16 text-center">
              <span class="grid h-16 w-16 place-items-center rounded-full bg-rosewood-50 text-rosewood">
                <AppIcon name="search" :size="26" />
              </span>
              <h2 class="mt-5 font-serif text-2xl font-semibold">No professionals found</h2>
              <p class="mt-2 max-w-md text-charcoal-soft">
                Try a different search, another location, or browse every category.
              </p>
              <button type="button" class="btn-primary mt-6" @click="clearAll">Show all professionals</button>
            </div>

            <div v-if="visible.length < results.length" class="mt-12 flex justify-center">
              <button type="button" class="btn-outline" @click="limit += PAGE_SIZE">
                Load more
                <AppIcon name="chevronDown" :size="16" />
              </button>
            </div>
            </template>
          </div>

          <!-- Category page: rotating side banners -->
          <CategorySidebar
            v-if="activeCategory"
            :key="activeCategory.key"
            :category-key="activeCategory.key"
            :sub="filters.sub"
            class="lg:sticky lg:top-24 lg:self-start"
          />
        </div>
      </section>
    </main>

    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { locations } from '~/data/locations'
import { weddingCategories } from '~/data/weddingCategories'
import { filterCatalog, sortOptions, categoryName, catalogLink } from '~/composables/useCatalog'
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
const PAGE_SIZE = 9
const limit = ref(PAGE_SIZE)

// The URL query is the single source of truth, so filtered views can be shared.
const filters = computed(() => ({
  q: String(route.query.q || ''),
  loc: String(route.query.loc || ''),
  category: String(route.query.category || ''),
  sub: String(route.query.sub || ''),
  sort: String(route.query.sort || 'recommended')
}))

// If a sub-category has no listings yet, fall back to its whole category
// and tell the user, instead of showing an empty page.
const exact = computed(() => filterCatalog(filters.value))
const subFallback = computed(() => !!filters.value.sub && exact.value.length === 0)
const results = computed(() =>
  subFallback.value ? filterCatalog({ ...filters.value, sub: '' }) : exact.value
)
const visible = computed(() => results.value.slice(0, limit.value))
const hasFilters = computed(() => !!(filters.value.q || filters.value.loc || filters.value.category || filters.value.sub))

const summary = computed(() => {
  const parts = []
  if (filters.value.sub && !subFallback.value) parts.push(filters.value.sub)
  else if (filters.value.category) parts.push(categoryName(filters.value.category))
  if (filters.value.q) parts.push(`“${filters.value.q}”`)
  if (filters.value.loc) parts.push(`in ${filters.value.loc}`)
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
  limit.value = PAGE_SIZE
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

// Chips
// Most-browsed categories as chips; the rest live under "More".
const PRIMARY = ['venues', 'photography', 'attire', 'beauty', 'decoration', 'jewellery']
const primaryChips = [
  { key: '', label: 'View all' },
  ...PRIMARY.map((key) => ({ key, label: categoryName(key) }))
]
const moreChips = weddingCategories
  .filter((c) => !PRIMARY.includes(c.key))
  .map((c) => ({ key: c.key, label: c.name }))

// Sub-category chips for the selected category
const activeCategory = computed(() => weddingCategories.find((c) => c.key === filters.value.category))
// A category page lists its services only; vendor cards appear on each
// service's own page, or here when the visitor searches or picks a location.
const showListings = computed(() => !activeCategory.value || !!(filters.value.q || filters.value.loc))
const heroSlides = computed(() => (activeCategory.value ? categorySlides(activeCategory.value.key) : []))
const subTiles = computed(() => (activeCategory.value ? subcategoryTiles(activeCategory.value.key) : []))
useSeoMeta({
  title: () => (activeCategory.value ? `${activeCategory.value.name} – Wedding Hub` : 'Catalog – Wedding Hub'),
  description: 'Browse wedding photographers, venues, bridal salons, florists, cakes and more across Sri Lanka.'
})

const moreActive = computed(() => moreChips.find((c) => c.key === filters.value.category))

const moreOpen = ref(false)
const moreRef = ref(null)
const pickMore = (key) => {
  moreOpen.value = false
  update({ category: key })
}
const onDocClick = (e) => {
  if (moreRef.value && !moreRef.value.contains(e.target)) moreOpen.value = false
}
const onKey = (e) => {
  if (e.key === 'Escape') moreOpen.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
  clearTimeout(t)
})
</script>

<style scoped>
.chip {
  @apply shrink-0 whitespace-nowrap rounded-full border border-rosewood/15 bg-white px-4 py-2 text-sm font-medium text-charcoal transition-all duration-300 hover:border-rosewood hover:text-rosewood;
}
.chip.is-on {
  @apply border-rosewood bg-rosewood text-white shadow-soft hover:text-white;
}
/* Fade the right edge of the scrolling chip row so it reads as scrollable */
.chip-row {
  mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
}
@media (min-width: 1024px) {
  .chip-row {
    mask-image: none;
    -webkit-mask-image: none;
  }
}
.sub-chip {
  @apply rounded-full bg-white px-3.5 py-1.5 text-[13px] text-charcoal-soft ring-1 ring-charcoal/10 transition hover:text-rosewood hover:ring-rosewood/40;
}
.sub-chip.is-on {
  @apply bg-rosewood-50 font-semibold text-rosewood-700 ring-rosewood/30;
}
.sub-tile {
  @apply relative rounded-2xl bg-white p-2 ring-1 ring-charcoal/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft hover:ring-rosewood/30;
}
.sub-tile.is-on {
  @apply bg-rosewood-50 ring-2 ring-rosewood;
}
.select-pill {
  @apply h-12 w-full cursor-pointer appearance-none rounded-full border border-rosewood/15 bg-white pr-10 text-[15px] text-charcoal shadow-sm outline-none transition focus:border-rosewood/40 focus:ring-4 focus:ring-rosewood/10;
}
</style>
