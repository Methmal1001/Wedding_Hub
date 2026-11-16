<template>
  <div class="relative min-h-screen bg-ivory">
    <AppNavbar />

    <main>
      <!-- Rotating main banner -->
      <CategoryHero
        :key="slug"
        :category="category"
        :sub="sub"
        :slides="slides"
        :tagline="categoryTagline(category.key)"
        :eyebrow="`${category.name} · ${all.length} ${all.length === 1 ? 'listing' : 'listings'}`"
      />

      <!-- Toolbar: search within this service, location, sort -->
      <section class="border-b border-rosewood/10 bg-gradient-to-b from-blush-light via-blush-light/60 to-ivory">
        <form class="container-site flex flex-col gap-2.5 py-6 sm:flex-row" role="search" @submit.prevent="applySearch">
          <label class="relative flex-1">
            <span class="sr-only">Search {{ sub }}</span>
            <AppIcon name="search" :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-soft" />
            <input
              v-model="draftQ"
              type="search"
              :placeholder="`Search ${sub}`"
              class="h-12 w-full rounded-full border border-rosewood/15 bg-white pl-11 pr-4 text-[15px] text-charcoal shadow-sm outline-none transition placeholder:text-charcoal-soft/60 focus:border-rosewood/40 focus:ring-4 focus:ring-rosewood/10"
              @input="debouncedSearch"
            >
          </label>
          <label class="relative sm:w-48">
            <span class="sr-only">Location</span>
            <AppIcon name="pin" :size="16" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rosewood" />
            <select :value="filters.loc" class="select-pill pl-10" @change="update({ loc: $event.target.value })">
              <option value="">All locations</option>
              <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
            </select>
            <AppIcon name="chevronDown" :size="15" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-soft" />
          </label>
          <label class="relative sm:w-52">
            <span class="sr-only">Sort by</span>
            <select :value="filters.sort" class="select-pill pl-4" @change="update({ sort: $event.target.value })">
              <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <AppIcon name="chevronDown" :size="15" class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-soft" />
          </label>
        </form>
      </section>

      <section class="container-site py-10 sm:py-12">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-12">
          <div class="min-w-0">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p class="eyebrow">{{ category.name }}</p>
                <h2 class="mt-2 font-serif text-3xl font-semibold">{{ sub }}</h2>
              </div>
              <NuxtLink :to="catalogLink({ category: category.key })" class="sub-chip inline-flex items-center gap-1.5">
                <AppIcon name="arrowRight" :size="14" class="rotate-180" />
                All {{ category.name }}
              </NuxtLink>
            </div>

            <!-- Listings -->
            <template v-if="results.length">
              <div class="mb-6 mt-6 flex flex-wrap items-center justify-between gap-3">
                <p class="text-sm text-charcoal-soft" aria-live="polite">
                  Showing <span class="font-semibold text-charcoal">{{ rangeStart }}–{{ rangeEnd }}</span> of
                  <span class="font-semibold text-charcoal">{{ results.length }}</span>
                  {{ results.length === 1 ? 'professional' : 'professionals' }} for
                  <span class="font-semibold text-rosewood">{{ sub }}</span>
                  <template v-if="filters.q"> matching “{{ filters.q }}”</template>
                  <template v-if="filters.loc"> in {{ filters.loc }}</template>
                </p>
                <div class="flex items-center gap-3">
                  <button v-if="filters.q || filters.loc" type="button" class="text-sm font-medium text-rosewood underline-offset-4 hover:underline" @click="clearFilters">
                    Clear filters
                  </button>
                  <ViewToggle :model-value="view" @update:model-value="setView" />
                </div>
              </div>

              <TransitionGroup
                :key="view"
                tag="div"
                name="list"
                class="relative grid"
                :class="view === 'grid' ? 'grid-cols-1 gap-4' : 'gap-6 sm:grid-cols-2 lg:gap-7 xl:grid-cols-3'"
              >
                <template v-for="item in pageItems" :key="item.id">
                  <CatalogRow v-if="view === 'grid'" :item="item" />
                  <CatalogCard v-else :item="item" />
                </template>
              </TransitionGroup>

              <!-- Pagination -->
              <nav v-if="pageCount > 1" class="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                <button type="button" class="page-btn" :disabled="page === 1" aria-label="Previous page" @click="goPage(page - 1)">
                  <AppIcon name="arrowRight" :size="15" class="rotate-180" />
                </button>
                <button
                  v-for="n in pageCount"
                  :key="n"
                  type="button"
                  class="page-btn"
                  :class="{ 'is-on': n === page }"
                  :aria-current="n === page ? 'page' : undefined"
                  @click="goPage(n)"
                >
                  {{ n }}
                </button>
                <button type="button" class="page-btn" :disabled="page === pageCount" aria-label="Next page" @click="goPage(page + 1)">
                  <AppIcon name="arrowRight" :size="15" />
                </button>
                <span class="ml-2 text-xs text-charcoal-soft">Page {{ page }} of {{ pageCount }}</span>
              </nav>
            </template>

            <!-- Nothing in this service (yet / for these filters) -->
            <template v-else>
              <div class="card-surface mt-6 flex flex-col items-center px-6 py-12 text-center">
                <span class="grid h-16 w-16 place-items-center rounded-full bg-rosewood-50 text-rosewood">
                  <AppIcon name="search" :size="26" />
                </span>
                <h3 class="mt-5 font-serif text-2xl font-semibold">
                  {{ filters.q || filters.loc ? 'No matches for these filters' : `No ${sub} listings yet` }}
                </h3>
                <p class="mt-2 max-w-md text-sm text-charcoal-soft">
                  <template v-if="filters.q || filters.loc">Try another search or location.</template>
                  <template v-else>New vendors are joining all the time. Meanwhile, explore other {{ category.name }} professionals below.</template>
                </p>
                <div class="mt-6 flex flex-wrap justify-center gap-3">
                  <button v-if="filters.q || filters.loc" type="button" class="btn-primary" @click="clearFilters">Clear filters</button>
                  <NuxtLink to="/list-your-business" class="btn-outline">List your business here</NuxtLink>
                </div>
              </div>

              <div v-if="!filters.q && !filters.loc && alsoInCategory.length" class="mt-12">
                <div class="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p class="eyebrow">You may also like</p>
                    <h3 class="mt-2 font-serif text-2xl font-semibold">Other {{ category.name }} vendors</h3>
                  </div>
                  <ViewToggle :model-value="view" @update:model-value="setView" />
                </div>
                <div class="mt-6 grid" :class="view === 'grid' ? 'grid-cols-1 gap-4' : 'gap-6 sm:grid-cols-2 lg:gap-7 xl:grid-cols-3'">
                  <template v-for="item in alsoInCategory" :key="item.id">
                    <CatalogRow v-if="view === 'grid'" :item="item" />
                    <CatalogCard v-else :item="item" />
                  </template>
                </div>
              </div>
            </template>

            <!-- Related services -->
            <div v-if="related.length" class="mt-14 border-t border-rosewood/10 pt-10">
              <p class="eyebrow">Explore more</p>
              <h3 class="mt-2 font-serif text-2xl font-semibold">Related Categories</h3>
              <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                <NuxtLink
                  v-for="tile in related"
                  :key="tile.categoryKey + tile.name"
                  :to="catalogLink({ category: tile.categoryKey, sub: tile.name })"
                  class="rel-tile group block"
                >
                  <span class="block aspect-[4/3] overflow-hidden rounded-xl">
                    <img :src="tile.image" alt="" class="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy">
                  </span>
                  <span class="mt-2.5 block px-1 text-[13px] font-semibold leading-snug text-charcoal transition group-hover:text-rosewood sm:text-sm">
                    {{ tile.name }}
                  </span>
                  <span class="block px-1 pb-0.5 text-[11px] text-charcoal-soft">
                    {{ tile.categoryName }}<template v-if="tile.count"> · {{ tile.count }} {{ tile.count > 1 ? 'listings' : 'listing' }}</template>
                  </span>
                </NuxtLink>
              </div>
            </div>

            <!-- About this service -->
            <div class="mt-10 rounded-3xl bg-blush-light/60 p-6 ring-1 ring-rosewood/10 sm:p-8">
              <h3 class="font-serif text-2xl font-semibold">{{ sub }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-charcoal-soft">
                Looking for {{ sub.toLowerCase() }} for your wedding? Wedding Hub brings together {{ category.name.toLowerCase() }}
                professionals from across Sri Lanka in one place. Compare portfolios, locations and prices, save your
                favourites, and contact vendors directly to plan a day that truly reflects the two of you.
              </p>
            </div>
          </div>

          <!-- Rotating side banners -->
          <CategorySidebar
            :key="slug"
            :category-key="category.key"
            :sub="sub"
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
import { liveCatalog } from '~/composables/useSiteData'
import { filterCatalog, sortOptions, catalogLink, findSubBySlug } from '~/composables/useCatalog'
import { subSlides, categoryTagline, relatedSubTiles } from '~/composables/useCategoryPage'

useSplash().finish()

const route = useRoute()
const router = useRouter()
const scrollTo = useScrollTo()

const slug = computed(() => String(route.params.slug || ''))
const match = computed(() => findSubBySlug(slug.value))
if (!match.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}
const category = computed(() => match.value.category)
const sub = computed(() => match.value.sub)

useSeoMeta({
  title: () => `${sub.value} – ${category.value.name} – Wedding Hub`,
  description: () => `Find ${sub.value} for your wedding in Sri Lanka. Compare vendors, locations and prices on Wedding Hub.`
})

const slides = computed(() => subSlides(category.value.key, sub.value))

// Filters live in the URL so the page can be shared.
const filters = computed(() => ({
  q: String(route.query.q || ''),
  loc: String(route.query.loc || ''),
  sort: String(route.query.sort || 'recommended'),
  page: Math.max(1, parseInt(route.query.page, 10) || 1)
}))

// Listing layout: "grid" (compact rows, default) or "image" (photo cards).
const view = computed(() => (route.query.view === 'image' ? 'image' : 'grid'))
const setView = (v) => update({ view: v, page: filters.value.page })

const all = computed(() => liveCatalog().filter((l) => l.categoryKey === category.value.key && l.sub === sub.value))
const results = computed(() =>
  filterCatalog({ q: filters.value.q, loc: filters.value.loc, category: category.value.key, sub: sub.value, sort: filters.value.sort })
)

const PAGE_SIZE = 6
const pageCount = computed(() => Math.max(1, Math.ceil(results.value.length / PAGE_SIZE)))
const page = computed(() => Math.min(filters.value.page, pageCount.value))
const pageItems = computed(() => results.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
const rangeStart = computed(() => (results.value.length ? (page.value - 1) * PAGE_SIZE + 1 : 0))
const rangeEnd = computed(() => Math.min(page.value * PAGE_SIZE, results.value.length))

const alsoInCategory = computed(() =>
  liveCatalog().filter((l) => l.categoryKey === category.value.key && l.sub !== sub.value).slice(0, 6)
)
const related = computed(() => relatedSubTiles(category.value.key, sub.value))

const update = (patch) => {
  const next = { ...filters.value, view: view.value, page: 1, ...patch }
  const query = {}
  if (next.view === 'image') query.view = 'image'
  if (next.q) query.q = next.q
  if (next.loc) query.loc = next.loc
  if (next.sort && next.sort !== 'recommended') query.sort = next.sort
  if (next.page > 1) query.page = String(next.page)
  router.replace({ query })
}
const goPage = (n) => {
  update({ page: n })
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
const clearFilters = () => {
  draftQ.value = ''
  update({ q: '', loc: '' })
}
onBeforeUnmount(() => clearTimeout(t))
</script>

<style scoped>
.select-pill {
  @apply h-12 w-full cursor-pointer appearance-none rounded-full border border-rosewood/15 bg-white pr-10 text-[15px] text-charcoal shadow-sm outline-none transition focus:border-rosewood/40 focus:ring-4 focus:ring-rosewood/10;
}
.sub-chip {
  @apply rounded-full bg-white px-3.5 py-1.5 text-[13px] text-charcoal-soft ring-1 ring-charcoal/10 transition hover:text-rosewood hover:ring-rosewood/40;
}
.rel-tile {
  @apply relative rounded-2xl bg-white p-2 ring-1 ring-charcoal/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft hover:ring-rosewood/30;
}
.page-btn {
  @apply grid h-10 min-w-[40px] place-items-center rounded-full bg-white px-3 text-sm font-medium text-charcoal ring-1 ring-charcoal/10 transition hover:text-rosewood hover:ring-rosewood/40 disabled:pointer-events-none disabled:opacity-40;
}
.page-btn.is-on {
  @apply bg-rosewood text-white ring-rosewood hover:text-white;
}
</style>
