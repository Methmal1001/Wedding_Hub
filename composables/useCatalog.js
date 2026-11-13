import { catalog } from '~/data/catalog'
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

  const list = catalog.filter((item) => {
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

  const sorted = [...list]
  if (sort === 'rating') sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0))
  else if (sort === 'price-asc') sorted.sort(byPrice(1))
  else if (sort === 'price-desc') sorted.sort(byPrice(-1))
  return sorted
}

// Builds a link to the catalog with optional filters, e.g. catalogLink({ category: 'photography' })
export function catalogLink({ q, loc, category, sub, sort } = {}) {
  const query = {}
  if (q) query.q = q
  if (loc) query.loc = loc
  if (category) query.category = category
  if (sub) query.sub = sub
  if (sort && sort !== 'recommended') query.sort = sort
  return { path: '/catalog', query }
}
