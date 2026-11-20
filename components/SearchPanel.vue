<template>
  <form
    class="search-panel relative rounded-[24px] bg-white/95 p-2 shadow-lift ring-1 ring-white/60 backdrop-blur-md sm:rounded-[28px] sm:p-3"
    role="search"
    aria-label="Search wedding vendors and venues"
    @submit.prevent="submit"
  >
    <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-2 md:grid-cols-[1.35fr_1fr_auto] md:gap-0">
      <!-- What -->
      <div class="relative col-span-2 md:col-span-1">
        <label
          for="search-what"
          class="field rounded-[18px] sm:rounded-[20px] md:rounded-r-none"
          :class="{ 'ring-2 ring-gold/40': focused === 'what' }"
        >
          <span class="icon-tile bg-gradient-to-br from-rosewood-50 to-gold-light/20 text-rosewood"><AppIcon name="search" :size="18" /></span>
          <span class="min-w-0 flex-1">
            <span class="field-label">Search what?</span>
            <input
              id="search-what"
              v-model="what"
              type="text"
              autocomplete="off"
              placeholder="Vendor, venue, photographer…"
              class="field-input"
              role="combobox"
              aria-autocomplete="list"
              :aria-expanded="showSuggestions"
              aria-controls="search-suggestions"
              @focus="focused = 'what'"
              @blur="onBlur"
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
              @keydown.enter="pickHighlighted"
              @keydown.esc="focused = ''"
            >
          </span>
          <button
            v-if="what"
            type="button"
            class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-charcoal-soft hover:bg-rosewood/5 hover:text-rosewood"
            aria-label="Clear search text"
            @mousedown.prevent
            @click="what = ''"
          >
            <AppIcon name="close" :size="14" />
          </button>
        </label>

        <!-- Suggestions dropdown -->
        <Transition name="fade">
          <ul
            v-if="showSuggestions"
            id="search-suggestions"
            role="listbox"
            class="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-72 overflow-y-auto rounded-2xl bg-white p-2 text-left shadow-lift ring-1 ring-rosewood/10"
          >
            <li
              v-for="(s, i) in suggestions"
              :key="s.label"
              role="option"
              :aria-selected="i === highlighted"
              class="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
              :class="i === highlighted ? 'bg-rosewood-50 text-rosewood' : 'text-charcoal hover:bg-rosewood-50'"
              @mousedown.prevent="pick(s)"
              @mouseenter="highlighted = i"
            >
              <span class="truncate">{{ s.label }}</span>
              <span class="shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-gold-dark">{{ s.kind }}</span>
            </li>
          </ul>
        </Transition>
      </div>

      <!-- Location -->
      <label
        for="search-location"
        class="field relative rounded-[18px] sm:rounded-[20px] md:rounded-none md:border-l md:border-rosewood/10"
        :class="{ 'ring-2 ring-gold/40': focused === 'loc' }"
      >
        <span class="icon-tile bg-gradient-to-br from-green-50 to-[#4DFF00]/15 text-green-600"><AppIcon name="pin" :size="18" /></span>
        <span class="min-w-0 flex-1">
          <span class="field-label">Location</span>
          <select
            id="search-location"
            v-model="loc"
            class="field-input cursor-pointer appearance-none bg-transparent pr-6"
            @focus="focused = 'loc'"
            @blur="focused = ''"
          >
            <option value="">All of Sri Lanka</option>
            <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
          </select>
        </span>
        <AppIcon name="chevronDown" :size="16" class="pointer-events-none absolute right-4 text-charcoal-soft" />
      </label>

      <!-- Submit -->
      <button type="submit" class="btn !min-h-[46px] self-center !rounded-2xl border-2 border-rosewood bg-transparent !px-3.5 !text-sm text-rosewood hover:-translate-y-0.5 hover:bg-rosewood hover:text-white hover:shadow-lift focus-visible:bg-rosewood focus-visible:text-white sm:!min-h-[48px] sm:!px-5 md:!mx-2" aria-label="Search">
        <AppIcon name="search" :size="16" />
        <span class="hidden sm:inline">Search</span>
      </button>
    </div>

    <!-- Popular searches -->
    <div v-if="showPopular" class="hidden flex-wrap items-center gap-2 px-2 pb-1 pt-3 text-xs sm:flex">
      <span class="inline-flex items-center gap-1.5 font-medium text-charcoal-soft"><AppIcon name="trending" :size="14" class="text-gold-dark" />Popular:</span>
      <button
        v-for="p in popular"
        :key="p.label"
        type="button"
        class="rounded-full bg-white px-3 py-1.5 text-charcoal shadow-sm ring-1 ring-rosewood/10 transition hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-gold-light hover:to-[#4DFF00] hover:text-rosewood-900 hover:ring-transparent"
        @click="quick(p)"
      >
        {{ p.label }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { locations } from '~/data/locations'
import { catalog } from '~/data/catalog'
import { weddingCategories } from '~/data/weddingCategories'
import { catalogLink, categoryName } from '~/composables/useCatalog'

defineProps({ showPopular: { type: Boolean, default: true } })

// Searching opens the Catalog page with the chosen filters.
const route = useRoute()
const what = ref(String(route.query.q || ''))
const loc = ref(String(route.query.loc || ''))
const focused = ref('')
const highlighted = ref(-1)

const popular = [
  { label: 'Photographers', category: 'photography' },
  { label: 'Beach venues', q: 'beach' },
  { label: 'Bridal makeup', category: 'beauty' },
  { label: 'Kandy', loc: 'Kandy' }
]

const pool = [
  ...weddingCategories.map((c) => ({ label: c.name, kind: 'Category', category: c.key })),
  ...catalog.map((v) => ({ label: v.name, kind: categoryName(v.categoryKey), q: v.name })),
  ...weddingCategories.flatMap((c) => c.subcategories.map((s) => ({ label: s, kind: c.name, category: c.key, sub: s })))
]

const suggestions = computed(() => {
  const q = what.value.trim().toLowerCase()
  if (!q) return pool.filter((p) => p.kind === 'Category').slice(0, 6)
  return pool
    .filter((p) => p.label.toLowerCase().includes(q) || p.kind.toLowerCase().includes(q))
    .slice(0, 7)
})

const showSuggestions = computed(() => focused.value === 'what' && suggestions.value.length > 0)

watch(suggestions, () => (highlighted.value = -1))

const go = (filters) => {
  focused.value = ''
  navigateTo(catalogLink(filters))
}

const submit = () => go({ q: what.value.trim(), loc: loc.value })

const pick = (s) => {
  if (s.category) go({ category: s.category, sub: s.sub, loc: loc.value })
  else go({ q: s.q, loc: loc.value })
}

const quick = (p) => go({ q: p.q, loc: p.loc ?? loc.value, category: p.category })

const move = (dir) => {
  if (!showSuggestions.value) {
    focused.value = 'what'
    return
  }
  const n = suggestions.value.length
  highlighted.value = (highlighted.value + dir + n) % n
}

const pickHighlighted = (e) => {
  if (showSuggestions.value && highlighted.value >= 0) {
    e.preventDefault()
    pick(suggestions.value[highlighted.value])
  }
}

const onBlur = () => {
  focused.value = ''
}
</script>

<style scoped>
.field {
  @apply flex min-h-[50px] cursor-text items-center gap-3 bg-ivory px-3.5 transition-shadow duration-300 sm:min-h-[60px] sm:px-4 md:bg-transparent;
}
.field-label {
  @apply block text-[10px] font-semibold uppercase tracking-[0.2em] text-rosewood;
}
.field-input {
  @apply mt-0.5 block w-full border-0 bg-transparent p-0 text-[15px] text-charcoal placeholder:text-charcoal-soft/60 focus:outline-none focus:ring-0;
}
.icon-tile {
  @apply grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ring-black/[0.03] sm:h-10 sm:w-10;
}
</style>
