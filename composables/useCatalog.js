import { liveCatalog } from '~/composables/useSiteData'
import { weddingCategories } from '~/data/weddingCategories'

// Friendly search synonyms so everyday words match category names.
const synonyms = {
  photo: 'photograph',
  photos: 'photograph',
  camera: 'photograph',
  video: 'videograph',
  salon: 'salons beauty',
  makeup: 'beauty',
  beautician: 'beauty',
  hair: 'beauty',
  mehendi: 'mehendi',
  hall: 'venue reception',
  hotel: 'venue hotels',
  resort: 'venue',
  beach: 'bentota galle',
  flower: 'florists',
  flowers: 'florists',
  floral: 'florists',
  decor: 'decoration',
  cake: 'cakes',
  planner: 'organisers planners',
  dj: 'entertainment',
  band: 'entertainment bands',
  music: 'entertainment',
  dress: 'attire',
  saree: 'attire sarees',
  gown: 'attire',
  ring: 'jewellery',
  gold: 'jewellery',
  jewelry: 'jewellery',
  car: 'transport',
  cars: 'transport',
  catering: 'caterers foods',
  food: 'foods',
  invitation: 'stationery invitations',
  astrology: 'astrologers',
  tent: 'marquee',
  registration: 'registrar'
}

export const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' }
]

const normalise = (s) => (s || '').toString().toLowerCase().trim()

export const categoryName = (key) => weddingCategories.find((c) => c.key === key)?.name ?? ''

const haystack = (item) =>
  normalise(
    [item.name, item.owner, categoryName(item.categoryKey), item.categoryKey, item.sub, item.location, item.area].join(' ')
  )

// Listings with "price on request" always sort after priced listings.
const byPrice = (dir) => (a, b) => {
  if (a.priceValue == null && b.priceValue == null) return 0
  if (a.priceValue == null) return 1
  if (b.priceValue == null) return -1
  return dir * (a.priceValue - b.priceValue)
}

export function filterCatalog({ q = '', loc = '', category = '', sub = '', sort = 'recommended' } = {}) {
  const terms = normalise(q).split(/\s+/).filter((t) => t.length > 1)

  const list = liveCatalog().filter((item) => {
    const hay = haystack(item)
    const textOk = terms.every((t) => {
      if (hay.includes(t)) return true
      const syn = synonyms[t]
      return syn ? syn.split(' ').some((s) => hay.includes(s)) : false
    })
    const locOk = !loc || normalise(item.location) === normalise(loc)
    const catOk = !category || item.categoryKey === category
    const subOk = !sub || normalise(item.sub) === normalise(sub)
    return textOk && locOk && catOk && subOk
  })

  // Featured listings (set in the admin panel) come first.
  const sorted = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  if (sort === 'rating') sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0))
  else if (sort === 'price-asc') sorted.sort(byPrice(1))
  else if (sort === 'price-desc') sorted.sort(byPrice(-1))
  return sorted
}

// URL slug for a sub-category, matching weddingdirectory.lk
// e.g. "Settee Backs & Oil Lamps" -> "settee-backs-and-oil-lamps"
export const subSlug = (name) =>
  String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Finds { category, sub } for a slug, or null.
export function findSubBySlug(slug) {
  for (const category of weddingCategories) {
    const sub = category.subcategories.find((s) => subSlug(s) === slug)
    if (sub) return { category, sub }
  }
  return null
}

// Builds a link to the catalog with optional filters, e.g. catalogLink({ category: 'photography' }).
// A sub-category (without a text search) gets its own page: /sub-category/<slug>.
export function catalogLink({ q, loc, category, sub, sort } = {}) {
  const query = {}
  if (sub && !q) {
    if (loc) query.loc = loc
    if (sort && sort !== 'recommended') query.sort = sort
    return { path: `/sub-category/${subSlug(sub)}`, query }
  }
  if (q) query.q = q
  if (loc) query.loc = loc
  if (category) query.category = category
  if (sub) query.sub = sub
  if (sort && sort !== 'recommended') query.sort = sort
  return { path: '/catalog', query }
}
