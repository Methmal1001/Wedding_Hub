import { catalog } from '~/data/catalog'
import { vendors } from '~/data/vendors'
import { categoryBanners } from '~/data/categoryBanners'
import { weddingCategories } from '~/data/weddingCategories'

// General wedding photos used when a category has too few photos of its own.
const FALLBACK = ['/images/hero-couple.jpg', '/images/inspiration-banner.jpg', '/images/business-cta.jpg']

const unique = (list) => [...new Set(list.filter(Boolean))]

// All photos that belong to a category: its own image, then its listings' galleries.
export const categoryPhotos = (key) => {
  const cat = weddingCategories.find((c) => c.key === key)
  return unique([cat?.image, ...catalog.filter((l) => l.categoryKey === key).flatMap((l) => l.gallery)])
}

// Rotating top-banner slides for a category page.
export const categorySlides = (key) => {
  const banner = categoryBanners[key] || { tagline: '', slides: [] }
  const photos = unique([...categoryPhotos(key), ...FALLBACK])
  return banner.slides.map((headline, i) => ({ headline, image: photos[i % photos.length] }))
}

export const categoryTagline = (key) => categoryBanners[key]?.tagline || ''

// Sub-category tiles: a matching listing photo if there is one, otherwise an
// unused category photo, so neighbouring tiles don't repeat the same picture.
export const subcategoryTiles = (key) => {
  const cat = weddingCategories.find((c) => c.key === key)
  if (!cat) return []
  const tiles = cat.subcategories.map((name) => {
    const listings = catalog.filter((l) => l.categoryKey === key && l.sub === name)
    return { name, count: listings.length, image: listings[0]?.gallery[0] || '' }
  })
  const used = new Set(tiles.map((t) => t.image).filter(Boolean))
  const pool = unique([...categoryPhotos(key), ...FALLBACK]).filter((img) => !used.has(img))
  let n = 0
  tiles.forEach((t) => {
    if (!t.image) t.image = pool.length ? pool[n++ % pool.length] : FALLBACK[0]
  })
  return tiles
}

// Sponsored side banners: vendors from this category first, then the rest.
export const sponsoredBanners = (key) => {
  const own = vendors.filter((v) => v.categoryKey === key)
  const rest = vendors.filter((v) => v.categoryKey !== key)
  return [...own, ...rest]
}

// Rotating top-banner slides for a sub-category page: that service's own
// listing photos first, then the parent category's photos.
export const subSlides = (key, sub) => {
  const own = catalog.filter((l) => l.categoryKey === key && l.sub === sub).flatMap((l) => l.gallery)
  const photos = unique([...own, ...categoryPhotos(key), ...FALLBACK])
  const headlines = [
    `Trusted ${sub} across Sri Lanka`,
    'Compare portfolios, prices and locations',
    'Contact vendors directly – no middle-man'
  ]
  return headlines.map((headline, i) => ({ headline, image: photos[i % photos.length] }))
}

// Categories that couples usually book together, used to suggest related services.
const RELATED_CATEGORIES = {
  cultural: ['registrar', 'organisers'],
  decoration: ['marquee', 'organisers'],
  organisers: ['decoration', 'entertainment'],
  attire: ['beauty', 'jewellery'],
  beauty: ['attire', 'jewellery'],
  jewellery: ['attire', 'beauty'],
  photography: ['organisers', 'stationery'],
  foods: ['cakes', 'venues'],
  entertainment: ['organisers', 'decoration'],
  cakes: ['foods', 'stationery'],
  stationery: ['cakes', 'others'],
  venues: ['decoration', 'foods'],
  transport: ['venues', 'organisers'],
  registrar: ['cultural', 'stationery'],
  marquee: ['decoration', 'venues'],
  others: ['stationery', 'transport']
}

// Related service tiles for a sub-category page: the other services in the same
// category first, then services from related categories (up to `limit`).
export const relatedSubTiles = (key, sub, limit = 8) => {
  const withCat = (k) => {
    const cat = weddingCategories.find((c) => c.key === k)
    return subcategoryTiles(k).map((t) => ({ ...t, categoryKey: k, categoryName: cat?.name || '' }))
  }
  const same = withCat(key).filter((t) => t.name !== sub)
  const others = (RELATED_CATEGORIES[key] || []).flatMap(withCat)
  // Prefer services that already have listings among the related-category ones.
  others.sort((a, b) => b.count - a.count)
  return [...same, ...others].slice(0, limit)
}
