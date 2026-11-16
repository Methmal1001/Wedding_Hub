import { catalog } from '~/data/catalog'
import { vendors } from '~/data/vendors'
import { listingDetails } from '~/data/listingDetails'
import { subSlug, categoryName } from '~/composables/useCatalog'

// Listing URL slug, matching weddingdirectory.lk, e.g. "Nirmana Flora" -> "Nirmana-Flora"
export const listingSlug = (name) =>
  String(name)
    .replace(/&/g, 'and')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// /listing/<sub-category>/<Listing-Name>
export const listingLink = (item) => `/listing/${subSlug(item.sub)}/${listingSlug(item.name)}`

export const findListing = (sub, name) =>
  catalog.find((l) => subSlug(l.sub) === sub && listingSlug(l.name).toLowerCase() === String(name).toLowerCase()) || null

// Everything a listing page shows, with sensible fallbacks so every listing has
// a complete page. Real (directory) businesses only get the details published
// for them – no invented reviews, hours or years.
export const getListingDetails = (item) => {
  const extra = listingDetails[item.id] || {}
  const vendor = vendors.find((v) => v.name === item.name)
  const cat = categoryName(item.categoryKey)
  const reviews = extra.reviews || []

  return {
    ...item,
    categoryName: cat,
    description:
      extra.description ||
      vendor?.description ||
      `${item.name} offers ${item.sub.toLowerCase()} in ${item.area || item.location}. Get in touch to discuss your wedding date, requirements and prices.`,
    services: extra.services || [item.sub],
    address: extra.address || vendor?.address || item.area || item.location,
    phones: extra.phones || (vendor?.phone ? [vendor.phone] : []),
    hours: extra.hours || '',
    since: extra.since || null,
    capacity: extra.capacity || '',
    reviews,
    reviewCount: item.reviews || reviews.length
  }
}
