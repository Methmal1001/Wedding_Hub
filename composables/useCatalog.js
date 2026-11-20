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

// One dropdown that both orders and filters by star rating.
export const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'all', label: 'All ratings' },
  { value: 'stars-5', label: '★★★★★  5 stars' },
  { value: 'stars-4', label: '★★★★☆  4 stars' },
  { value: 'stars-3', label: '★★★☆☆  3 stars' },
  { value: 'stars-2', label: '★★☆☆☆  2 stars' },
  { value: 'stars-1', label: '★☆☆☆☆  1 star' }
]

// Old links (?sort=rating / price-asc / price-desc) still work.
export const normaliseSort = (sort) => {
  if (sort === 'rating') return 'all'
  return sortOptions.some((o) => o.value === sort) ? sort : 'recommended'
}

// A listing counts as "N stars" when its rating rounds to N
// (4.5–5.0 = 5 stars, 3.5–4.4 = 4 stars, …) – the same way stars are shown.
export const starBand = (rating) => (rating ? Math.min(5, Math.max(1, Math.round(rating))) : 0)

// ---- "Recommended" ranking ----
// 1. Featured listings (chosen in the admin panel) always come first.
// 2. Then a trust score: the rating, weighted by how many reviews back it up
//    (a 4.9 from 200 reviews beats a 5.0 from 3), plus a small boost for
//    listings the admin team has verified.
// 3. New listings without reviews yet sit just below well-reviewed ones.
const PRIOR_RATING = 4.2 // typical rating on the site
const PRIOR_WEIGHT = 25 // reviews needed before a listing's own rating dominates
export const recommendedScore = (item) => {
  const n = item.reviews || 0
  const trust = item.rating
    ? (n / (n + PRIOR_WEIGHT)) * item.rating + (PRIOR_WEIGHT / (n + PRIOR_WEIGHT)) * PRIOR_RATING
    : 3.6
  return (item.featured ? 100 : 0) + (item.verified ? 0.3 : 0) + trust
}
const byRating = (a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0)

const normalise = (s) => (s || '').toString().toLowerCase().trim()

export const categoryName = (key) => weddingCategories.find((c) => c.key === key)?.name ?? ''

const haystack = (item) =>
  normalise(
    [item.name, item.owner, categoryName(item.categoryKey), item.categoryKey, item.sub, item.location, item.area].join(' ')
  )

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

  const mode = normaliseSort(sort)
  if (mode === 'recommended') return [...list].sort((a, b) => recommendedScore(b) - recommendedScore(a))
  // "All ratings": every listing, highest rated first (unrated last)
  if (mode === 'all') return [...list].sort(byRating)
  // "N stars": only listings in that star band
  const n = Number(mode.split('-')[1])
  return list.filter((item) => starBand(item.rating) === n).sort(byRating)
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
