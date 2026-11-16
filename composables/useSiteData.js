// Site data that the admin panel manages (front-end only – no backend).
// Everything lives in this browser's localStorage, so it is shared between
// the public site, vendor profiles and the admin panel in the same browser:
//   listing requests → approved by an admin → appear in the catalog
//   reviews / enquiries / advert bookings → moderated in the admin panel
// A real site would keep all of this on a server.
import { catalog } from '~/data/catalog'
import { weddingCategories } from '~/data/weddingCategories'
import { plans, adPlacements } from '~/data/businessPlans'

const KEYS = {
  submissions: 'wh:listings-submitted',
  overrides: 'wh:catalog-overrides',
  reviews: 'wh:reviews',
  ads: 'wh:ad-bookings',
  payments: 'wh:payments',
  activity: 'wh:activity',
  notifications: 'wh:notifications',
  enquiries: 'wh:enquiries',
  settings: 'wh:settings'
}
const SEED_KEY = 'wh:seeded-v1'

export const DEFAULT_SETTINGS = {
  autoApproveFree: false, // publish free listings without review
  moderateReviews: true, // reviews wait for approval before they appear
  notifyVendors: true, // send in-site notifications on decisions
  supportEmail: 'hello@weddinghub.lk',
  reviewSlaDays: 2
}

export const AD_PRICES = { 'home-featured': 15000, 'listing-banner': 25000, 'category-side': 12000 }

export const SUBMISSION_STATUS = {
  pending: { label: 'Pending review', tone: 'amber' },
  changes: { label: 'Changes requested', tone: 'sky' },
  approved: { label: 'Approved', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
  unpublished: { label: 'Unpublished', tone: 'gray' }
}

// ---- reactive store (empty on the server, filled on the client) ------------
export const siteDb = reactive({
  loaded: false,
  submissions: [],
  overrides: {},
  reviews: [],
  ads: [],
  payments: [],
  activity: [],
  notifications: [],
  enquiries: [],
  settings: { ...DEFAULT_SETTINGS }
})

const readLS = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Photos are stored as data URLs and can fill the browser's storage. If the
// submissions don't fit, keep fewer photos on the oldest records.
const saveSubmissions = () => {
  if (writeLS(KEYS.submissions, siteDb.submissions)) return true
  for (const keep of [6, 3, 1, 0]) {
    const slim = siteDb.submissions.map((s, i) =>
      i === 0 || !s.data?.photos ? s : { ...s, data: { ...s.data, photos: s.data.photos.slice(0, keep) } }
    )
    if (writeLS(KEYS.submissions, slim)) return true
  }
  return false
}
const save = (name) => (name === 'submissions' ? saveSubmissions() : writeLS(KEYS[name], siteDb[name]))

export const uid = (prefix = '') => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

// Called once on the client (plugins/site.client.js), and again when another
// tab changes the data.
export const loadSiteData = () => {
  if (!import.meta.client) return
  for (const [name, key] of Object.entries(KEYS)) {
    const v = readLS(key)
    if (name === 'settings') siteDb.settings = { ...DEFAULT_SETTINGS, ...(v || {}) }
    else if (v != null) siteDb[name] = v
  }
  // Older submissions (before the admin panel) only had a summary.
  siteDb.submissions = siteDb.submissions.map((s) => ({
    history: [{ at: s.submittedAt, by: s.businessName, action: 'submitted', note: '' }],
    notes: [],
    data: {},
    ...s
  }))
  if (!readLS(SEED_KEY)) seedDemoData()
  siteDb.loaded = true
}

// ---- helpers ---------------------------------------------------------------
const catName = (key) => weddingCategories.find((c) => c.key === key)?.name || key
export const categoryPhotoPool = (key) => [...new Set(catalog.filter((l) => l.categoryKey === key).flatMap((l) => l.gallery))]
const GENERAL = ['/images/hero-couple.jpg', '/images/inspiration-banner.jpg', '/images/business-cta.jpg']
const padGallery = (photos, key) => [...new Set([...photos, ...categoryPhotoPool(key), ...GENERAL])].slice(0, Math.max(3, photos.length))

export const planById = (id) => plans.find((p) => p.id === id) || plans[0]
export const planAmount = (planId, billing) => {
  const p = planById(planId)
  return billing === 'yearly' ? p.yearly : p.monthly
}

// An approved request as a catalog listing
export const submissionToListing = (s) => {
  const d = s.data || {}
  const firstSub = weddingCategories.find((c) => c.key === s.category)?.subcategories[0] || ''
  const priced = d.price && d.priceUnit !== 'Price on request'
  return {
    id: s.listingId || `v-${s.ref}`,
    ref: s.ref,
    vendorSubmitted: true,
    name: s.businessName,
    owner: d.contactName || '',
    categoryKey: s.category,
    sub: s.services?.[0] || firstSub,
    location: s.city,
    area: d.islandWide ? `${s.city} · Island-wide` : s.city,
    rating: null,
    reviews: 0,
    price: s.price || 'Price on request',
    priceValue: priced ? Number(d.price) : null,
    gallery: padGallery(d.photos || [], s.category),
    photos: d.photos || [],
    avatar: d.logo || '',
    plan: s.plan,
    details: {
      description: d.description,
      services: s.services,
      address: [d.address, s.city].filter(Boolean).join(', '),
      phones: [s.phone].filter(Boolean),
      email: s.email,
      website: d.website,
      facebook: d.facebook,
      instagram: d.instagram,
      since: d.since ? Number(d.since) : null,
      capacity: d.capacity ? `Up to ${d.capacity} guests` : '',
      offerings: d.offerings || [],
      areas: d.islandWide ? ['Island-wide'] : d.areas || []
    }
  }
}

const applyOverride = (l) => {
  const o = siteDb.overrides[l.id]
  return o ? { ...l, ...o } : l
}

// Everything the admin can manage (including hidden listings)
export const adminCatalog = () => [
  ...catalog.map((l) => applyOverride({ ...l, source: l.directory ? 'directory' : 'sample' })),
  ...siteDb.submissions
    .filter((s) => s.status === 'approved' || s.status === 'unpublished')
    .map((s) => applyOverride({ ...submissionToListing(s), source: 'vendor', hidden: s.status === 'unpublished' }))
]

// What the public site shows: static listings + approved requests, minus
// anything an admin has hidden. Featured listings come first.
export const liveCatalog = () => {
  const extra = siteDb.submissions.filter((s) => s.status === 'approved').map(submissionToListing)
  return [...catalog, ...extra].map(applyOverride).filter((l) => !l.hidden)
}

export const isListingHidden = (id) => !!siteDb.overrides[id]?.hidden
export const publishedReviews = (listingId) =>
  siteDb.reviews.filter((r) => r.listingId === listingId && r.status === 'published')

// ---- seed demo data (first visit only) -------------------------------------
const daysAgo = (d, h = 10) => {
  const t = new Date()
  t.setDate(t.getDate() - d)
  t.setHours(h, (d * 17) % 60, 0, 0)
  return t.toISOString()
}

function seedDemoData() {
  const photos = (key, n) => categoryPhotoPool(key).slice(0, n)
  const sub = (o) => {
    const priceText =
      o.priceUnit === 'Price on request' ? 'Price on request' : `LKR ${Number(o.price).toLocaleString('en-LK')}${o.priceUnit === 'Per guest (pax)' ? ' / pax' : o.priceUnit === 'Per day' ? ' / day' : ''}`
    return {
      ref: o.ref,
      status: o.status,
      plan: o.plan,
      billing: o.billing,
      submittedAt: daysAgo(o.days, 9),
      businessName: o.name,
      category: o.category,
      services: o.services,
      city: o.city,
      email: o.email,
      phone: o.phone,
      price: priceText,
      photos: o.photos.length,
      seeded: true,
      notes: o.notes || [],
      history: [{ at: daysAgo(o.days, 9), by: o.contact, action: 'submitted', note: '' }, ...(o.history || [])],
      reviewedAt: o.history?.length ? o.history[o.history.length - 1].at : null,
      reviewedBy: o.history?.length ? 'Admin Team' : null,
      decisionNote: o.decisionNote || '',
      listingId: o.status === 'approved' ? `v-${o.ref}` : undefined,
      data: {
        businessName: o.name,
        category: o.category,
        since: o.since || '',
        services: o.services,
        description: o.description,
        contactName: o.contact,
        phone: o.phone,
        email: o.email,
        website: o.website || '',
        address: o.address,
        city: o.city,
        islandWide: !!o.islandWide,
        areas: o.areas || [],
        priceUnit: o.priceUnit,
        price: o.price,
        capacity: o.capacity || '',
        offerings: o.offerings || [],
        facebook: o.facebook || '',
        instagram: '',
        logo: '',
        photos: o.photos
      }
    }
  }

  siteDb.submissions = [
    sub({
      ref: 'WH-DEMO01', status: 'pending', days: 0, plan: 'silver', billing: 'monthly',
      name: 'Lotus Petal Décor', category: 'decoration', services: ['Florists', 'Settee Backs & Oil Lamps'], city: 'Kandy',
      contact: 'Nethmi Wijesinghe', email: 'lotuspetal@example.com', phone: '+94 77 000 0101', address: '45 Peradeniya Road',
      description: 'Fresh-flower poruwa décor, settee backs and traditional oil lamps for Kandyan weddings. We design every setup to match your colour theme and handle installation on the day.',
      priceUnit: 'Package', price: 85000, offerings: ['Poruwa décor', 'Fresh flowers', 'Lighting'], since: 2016, photos: photos('decoration', 4), areas: ['Kandy', 'Kurunegala']
    }),
    sub({
      ref: 'WH-DEMO02', status: 'pending', days: 1, plan: 'free', billing: 'monthly',
      name: 'Moonlight Strings Quartet', category: 'entertainment', services: ['Classical Musicians', 'Bands'], city: 'Colombo',
      contact: 'Dinuk Fernando', email: 'moonlightstrings@example.com', phone: '+94 71 000 0102', address: '12 Station Lane, Colombo 06',
      description: 'A string quartet for church ceremonies, poruwa entrances and cocktail hours. Classical, Sinhala and modern pop arrangements.',
      priceUnit: 'Per hour', price: 30000, offerings: ['Ceremony music', 'Cocktail set'], since: 2019, photos: photos('entertainment', 2)
    }),
    sub({
      ref: 'WH-DEMO03', status: 'pending', days: 2, plan: 'gold', billing: 'yearly',
      name: 'Saffron Leaf Caterers', category: 'foods', services: ['Caterers'], city: 'Negombo',
      contact: 'Ruwan Silva', email: 'saffronleaf@example.com', phone: '+94 76 000 0103', address: '8 Lewis Place', website: 'https://example.com/saffron-leaf',
      description: 'Sri Lankan, Indian and continental buffets for 100–1,200 guests, with live hopper and kottu stations, dessert bars and full service staff. Free tasting session for confirmed bookings.',
      priceUnit: 'Per guest (pax)', price: 3400, capacity: 1200, offerings: ['Buffet setup', 'Live stations', 'Service staff', 'Tasting session'], since: 2011, photos: photos('foods', 3), islandWide: true
    }),
    sub({
      ref: 'WH-DEMO04', status: 'pending', days: 3, plan: 'silver', billing: 'yearly',
      name: 'Island Vows Photography', category: 'photography', services: ['Photographers', 'Videographers'], city: 'Galle',
      contact: 'Tharindu Jayasuriya', email: 'islandvows@example.com', phone: '+94 75 000 0104', address: 'Church Street, Fort',
      description: 'Beach and destination wedding photography.',
      priceUnit: 'Package', price: 145000, offerings: ['Drone coverage'], photos: photos('photography', 1)
    }),
    sub({
      ref: 'WH-DEMO05', status: 'changes', days: 6, plan: 'free', billing: 'monthly',
      name: 'Ruby Bridal Studio', category: 'beauty', services: ['Salons', 'Beauticians & Hair Dressers'], city: 'Kurunegala',
      contact: 'Ishara Rathnayake', email: 'rubybridal@example.com', phone: '+94 77 000 0105', address: '22 Puttalam Road',
      description: 'Bridal dressing, hair styling and makeup for Kandyan and western brides.',
      priceUnit: 'Package', price: 55000, photos: photos('beauty', 1),
      decisionNote: 'Please add at least 3 clear photos of your bridal work and a longer description of your packages.',
      history: [{ at: daysAgo(4, 15), by: 'Admin Team', action: 'changes', note: 'Please add at least 3 clear photos of your bridal work and a longer description of your packages.' }]
    }),
    sub({
      ref: 'WH-DEMO06', status: 'approved', days: 14, plan: 'silver', billing: 'monthly',
      name: 'Hill Country Carriages', category: 'transport', services: ['Car Hire & Limousines', 'Horse Drawn Carriages'], city: 'Kandy',
      contact: 'Pradeep Herath', email: 'hillcarriages@example.com', phone: '+94 81 000 0106', address: '3 Lake Drive',
      description: 'Decorated vintage cars, luxury sedans and a white horse-drawn carriage for weddings in Kandy and the hill country. Chauffeur and ribbon décor included.',
      priceUnit: 'Per day', price: 38000, offerings: ['Chauffeur', 'Ribbon décor'], since: 2014, photos: photos('transport', 3), areas: ['Kandy', 'Ella'],
      history: [{ at: daysAgo(12, 11), by: 'Admin Team', action: 'approved', note: '' }]
    }),
    sub({
      ref: 'WH-DEMO07', status: 'approved', days: 22, plan: 'gold', billing: 'monthly',
      name: 'Sugar Bloom Cakes', category: 'cakes', services: ['Wedding Cakes', 'Cake Structures'], city: 'Colombo',
      contact: 'Shanika de Mel', email: 'sugarbloom@example.com', phone: '+94 77 000 0107', address: '91 Galle Road, Colombo 04',
      description: 'Tiered wedding cakes, cake structures and wedding cake boxes made to order. Tasting boxes available every Saturday.',
      priceUnit: 'Per item', price: 45000, offerings: ['Tasting box', 'Delivery & setup'], since: 2018, photos: photos('cakes', 3),
      history: [{ at: daysAgo(20, 16), by: 'Admin Team', action: 'approved', note: '' }]
    }),
    sub({
      ref: 'WH-DEMO08', status: 'rejected', days: 10, plan: 'free', billing: 'monthly',
      name: 'Quick Wed Deals', category: 'others', services: ['Gifts'], city: 'Colombo',
      contact: 'N/A', email: 'quickwed@example.com', phone: '+94 70 000 0108', address: '—',
      description: 'Cheap deals!!! Call now.',
      priceUnit: 'Price on request', price: '', photos: [],
      decisionNote: 'The listing has no photos, no real address and the description does not describe a wedding service.',
      history: [{ at: daysAgo(9, 12), by: 'Admin Team', action: 'rejected', note: 'The listing has no photos, no real address and the description does not describe a wedding service.' }]
    })
  ]
  siteDb.overrides = { 'v-WH-DEMO06': { featured: true }, 'v-WH-DEMO07': { verified: true }, c8: { featured: true, verified: true }, c18: { verified: true } }

  siteDb.reviews = [
    { id: 'rv1', listingId: 'c8', listingName: 'Azure Palms Beach Resort', link: '/listing/romantic-destinations-hotels/Azure-Palms-Beach-Resort', name: 'Hiruni & Malith', email: 'hiruni@example.com', title: 'A dream beach wedding', rating: 5, text: 'The staff handled everything from the poruwa setup to the sunset dinner. Our guests still talk about it.', status: 'pending', createdAt: daysAgo(0, 8) },
    { id: 'rv2', listingId: 'c12', listingName: 'Petal & Crumb Cake Studio', link: '', name: 'Kavindya', email: 'kavi@example.com', title: 'Beautiful cake, a little late', rating: 4, text: 'The cake was gorgeous and tasted great, but delivery was 30 minutes later than agreed.', status: 'pending', createdAt: daysAgo(1, 19) },
    { id: 'rv3', listingId: 'c18', listingName: 'Ceylon Feast Caterers', link: '/listing/caterers/Ceylon-Feast-Caterers', name: 'Sachini P.', email: 'sachini@example.com', title: 'Amazing food', rating: 5, text: 'Every guest complimented the live hopper station. Very professional team.', status: 'pending', createdAt: daysAgo(2, 13) },
    { id: 'rv4', listingId: 'c10', listingName: '', link: '', name: 'Dilan', email: 'dilan@example.com', title: 'Lovely lighting', rating: 5, text: 'They transformed our reception hall with fairy lights. Highly recommended.', status: 'published', createdAt: daysAgo(8, 11) },
    { id: 'rv5', listingId: 'c14', listingName: '', link: '', name: 'Win big now', email: 'spam@example.com', title: 'Visit my website for prizes', rating: 1, text: 'Click this link for free prizes!!!', status: 'hidden', createdAt: daysAgo(5, 3) }
  ]
  // Fill in names / links from the catalog
  for (const r of siteDb.reviews) {
    const l = catalog.find((x) => x.id === r.listingId)
    if (l) Object.assign(r, { listingName: l.name, link: listingPath(l) })
  }

  siteDb.enquiries = [
    { id: 'eq1', listingId: 'c8', vendorName: 'Azure Palms Beach Resort', link: '', name: 'Sanduni Perera', phone: '+94 77 000 0121', email: 'sanduni@example.com', weddingDate: daysAgo(-120).slice(0, 10), message: 'Do you have availability for 250 guests in March? We would like a beach ceremony.', status: 'new', createdAt: daysAgo(0, 7) },
    { id: 'eq2', listingId: 'c18', vendorName: 'Ceylon Feast Caterers', link: '', name: 'Ashan Gunawardena', phone: '+94 71 000 0122', email: 'ashan@example.com', weddingDate: daysAgo(-75).slice(0, 10), message: 'Please send your vegetarian menu options and per-plate prices.', status: 'new', createdAt: daysAgo(1, 14) },
    { id: 'eq3', listingId: 'c11', vendorName: '', link: '', name: 'Tharushi K.', phone: '+94 76 000 0123', email: 'tharushi@example.com', weddingDate: daysAgo(-200).slice(0, 10), message: 'Interested in a highlight video package with drone shots.', status: 'new', createdAt: daysAgo(2, 10) },
    { id: 'eq4', listingId: 'c9', vendorName: '', link: '', name: 'Nimesha', phone: '+94 75 000 0124', email: 'nimesha@example.com', weddingDate: daysAgo(-40).slice(0, 10), message: 'Bridal mehendi for the bride and 6 bridesmaids – how much?', status: 'forwarded', createdAt: daysAgo(4, 9) },
    { id: 'eq5', listingId: 'c20', vendorName: '', link: '', name: 'Kasun R.', phone: '+94 70 000 0125', email: 'kasun@example.com', weddingDate: daysAgo(-60).slice(0, 10), message: 'Need a vintage car for the homecoming in Kandy.', status: 'forwarded', createdAt: daysAgo(7, 16) },
    { id: 'eq6', listingId: 'c15', vendorName: '', link: '', name: 'Ama', phone: '+94 77 000 0126', email: 'ama@example.com', weddingDate: daysAgo(-30).slice(0, 10), message: 'Thank you, we have booked another hotel.', status: 'closed', createdAt: daysAgo(15, 12) }
  ]
  for (const e of siteDb.enquiries) {
    const l = catalog.find((x) => x.id === e.listingId)
    if (l) Object.assign(e, { vendorName: l.name, link: listingPath(l) })
  }

  const month = (n) => {
    const d = new Date()
    d.setMonth(d.getMonth() + n, 1)
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }
  const place = (id) => adPlacements.find((a) => a.id === id)?.name || id
  siteDb.ads = [
    { id: 'ad1', placementId: 'home-featured', placementName: place('home-featured'), amount: AD_PRICES['home-featured'], business: 'Azure Palms Beach Resort', phone: '+94 34 000 0131', email: 'azurepalms@example.com', month: month(0), status: 'live', createdAt: daysAgo(25), invoiceId: 'inv3' },
    { id: 'ad2', placementId: 'listing-banner', placementName: place('listing-banner'), amount: AD_PRICES['listing-banner'], business: 'Saffron Leaf Caterers', phone: '+94 76 000 0103', email: 'saffronleaf@example.com', month: month(1), status: 'new', createdAt: daysAgo(1, 17) },
    { id: 'ad3', placementId: 'category-side', placementName: place('category-side'), amount: AD_PRICES['category-side'], business: 'Lotus Petal Décor', phone: '+94 77 000 0101', email: 'lotuspetal@example.com', month: month(1), status: 'new', createdAt: daysAgo(0, 11) },
    { id: 'ad4', placementId: 'category-side', placementName: place('category-side'), amount: AD_PRICES['category-side'], business: 'Quick Wed Deals', phone: '+94 70 000 0108', email: 'quickwed@example.com', month: month(1), status: 'declined', createdAt: daysAgo(9, 13), note: 'Listing was rejected.' }
  ]

  siteDb.payments = [
    { id: 'inv1', invoiceNo: 'INV-1001', kind: 'plan', description: 'Gold plan – monthly', business: 'Sugar Bloom Cakes', email: 'sugarbloom@example.com', amount: 9900, status: 'unpaid', createdAt: daysAgo(20, 16), dueAt: daysAgo(6), sourceRef: 'WH-DEMO07' },
    { id: 'inv2', invoiceNo: 'INV-1002', kind: 'plan', description: 'Silver plan – monthly', business: 'Hill Country Carriages', email: 'hillcarriages@example.com', amount: 4900, status: 'paid', createdAt: daysAgo(12, 11), dueAt: daysAgo(-2), paidAt: daysAgo(11, 9), method: 'Bank transfer', sourceRef: 'WH-DEMO06' },
    { id: 'inv3', invoiceNo: 'INV-1003', kind: 'ad', description: 'Homepage featured vendor – ' + month(0), business: 'Azure Palms Beach Resort', email: 'azurepalms@example.com', amount: 15000, status: 'paid', createdAt: daysAgo(24), dueAt: daysAgo(10), paidAt: daysAgo(22), method: 'Card', sourceRef: 'ad1' }
  ]

  siteDb.activity = [
    { id: 'a1', at: daysAgo(0, 11), actor: 'Lotus Petal Décor', type: 'ad', message: 'requested the Category side banner', link: '/admin/advertising' },
    { id: 'a2', at: daysAgo(0, 9), actor: 'Lotus Petal Décor', type: 'listing', message: 'submitted a new listing (WH-DEMO01)', link: '/admin/requests?ref=WH-DEMO01' },
    { id: 'a3', at: daysAgo(1, 9), actor: 'Moonlight Strings Quartet', type: 'listing', message: 'submitted a new listing (WH-DEMO02)', link: '/admin/requests?ref=WH-DEMO02' },
    { id: 'a4', at: daysAgo(2, 9), actor: 'Saffron Leaf Caterers', type: 'listing', message: 'submitted a new listing (WH-DEMO03)', link: '/admin/requests?ref=WH-DEMO03' },
    { id: 'a5', at: daysAgo(4, 15), actor: 'Admin Team', type: 'listing', message: 'requested changes to Ruby Bridal Studio', link: '/admin/requests?ref=WH-DEMO05' },
    { id: 'a6', at: daysAgo(9, 12), actor: 'Admin Team', type: 'listing', message: 'rejected Quick Wed Deals', link: '/admin/requests?ref=WH-DEMO08' },
    { id: 'a7', at: daysAgo(11, 9), actor: 'Hill Country Carriages', type: 'payment', message: 'paid invoice INV-1002 (LKR 4,900)', link: '/admin/payments' },
    { id: 'a8', at: daysAgo(12, 11), actor: 'Admin Team', type: 'listing', message: 'approved Hill Country Carriages', link: '/admin/requests?ref=WH-DEMO06' },
    { id: 'a9', at: daysAgo(20, 16), actor: 'Admin Team', type: 'listing', message: 'approved Sugar Bloom Cakes', link: '/admin/requests?ref=WH-DEMO07' }
  ]
  siteDb.notifications = []

  for (const name of Object.keys(KEYS)) save(name)
  writeLS(SEED_KEY, new Date().toISOString())
}

// Wipes everything the admin panel manages and re-creates the demo data.
export const resetSiteData = () => {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
    localStorage.removeItem(SEED_KEY)
  } catch {}
  siteDb.settings = { ...DEFAULT_SETTINGS }
  seedDemoData()
}

// ---- actions ----------------------------------------------------------------
export const useSiteData = () => {
  const auth = useAuth()
  const actorName = () => auth.user.value?.name || 'Admin Team'

  const log = (type, message, link = '', actor = actorName()) => {
    siteDb.activity.unshift({ id: uid('a'), at: new Date().toISOString(), actor, type, message, link })
    siteDb.activity.splice(400)
    save('activity')
  }

  const notify = (email, { title, message, link = '', tone = 'info' }) => {
    if (!email || !siteDb.settings.notifyVendors) return
    siteDb.notifications.unshift({ id: uid('n'), email: email.toLowerCase(), title, message, link, tone, at: new Date().toISOString(), read: false })
    siteDb.notifications.splice(300)
    save('notifications')
  }
  const notificationsFor = (email) => siteDb.notifications.filter((n) => n.email === String(email || '').toLowerCase())
  const markNotificationsRead = (email) => {
    notificationsFor(email).forEach((n) => (n.read = true))
    save('notifications')
  }

  const nextInvoiceNo = () => {
    const nums = siteDb.payments.map((p) => Number(String(p.invoiceNo).replace(/\D/g, '')) || 1000)
    return `INV-${Math.max(1000, ...nums) + 1}`
  }
  const createInvoice = ({ kind, description, business, email, amount, sourceRef }) => {
    const due = new Date()
    due.setDate(due.getDate() + 14)
    const inv = { id: uid('inv'), invoiceNo: nextInvoiceNo(), kind, description, business, email, amount, status: 'unpaid', createdAt: new Date().toISOString(), dueAt: due.toISOString(), sourceRef }
    siteDb.payments.unshift(inv)
    save('payments')
    return inv
  }
  const setInvoiceStatus = (id, status, method = '') => {
    const inv = siteDb.payments.find((p) => p.id === id)
    if (!inv) return
    inv.status = status
    if (status === 'paid') {
      inv.paidAt = new Date().toISOString()
      inv.method = method || inv.method || 'Bank transfer'
    }
    save('payments')
    log('payment', `marked invoice ${inv.invoiceNo} as ${status}`, '/admin/payments')
  }

  // ---- listing requests ----
  const findSubmission = (ref) => siteDb.submissions.find((s) => s.ref === ref)
  const submissionsFor = (u) =>
    u ? siteDb.submissions.filter((s) => s.userId === u.id || s.email?.toLowerCase() === u.email?.toLowerCase()) : []

  const pushHistory = (s, action, note = '', by = actorName()) => {
    s.history = [...(s.history || []), { at: new Date().toISOString(), by, action, note }]
  }

  // Called by the "List your business" form. Resubmitting an existing ref
  // updates it and sends it back for review.
  const submitListing = (record) => {
    const existing = findSubmission(record.ref)
    let s
    if (existing) {
      Object.assign(existing, record, { status: 'pending', decisionNote: '' })
      pushHistory(existing, 'resubmitted', '', record.businessName)
      s = existing
      log('listing', `resubmitted their listing (${s.ref})`, `/admin/requests?ref=${s.ref}`, s.businessName)
    } else {
      s = { history: [], notes: [], ...record }
      pushHistory(s, 'submitted', '', record.businessName)
      siteDb.submissions.unshift(s)
      log('listing', `submitted a new listing (${s.ref})`, `/admin/requests?ref=${s.ref}`, s.businessName)
    }
    const ok = save('submissions')
    if (siteDb.settings.autoApproveFree && s.plan === 'free') approveListing(s.ref, { note: 'Approved automatically (free plan).' }, 'Auto-approval')
    return { record: s, storedPhotos: ok }
  }

  const approveListing = (ref, { featured = false, verified = false, note = '' } = {}, by = actorName()) => {
    const s = findSubmission(ref)
    if (!s) return
    s.status = 'approved'
    s.listingId ||= `v-${s.ref}`
    s.reviewedAt = new Date().toISOString()
    s.reviewedBy = by
    s.decisionNote = note
    pushHistory(s, 'approved', note, by)
    const o = { ...(siteDb.overrides[s.listingId] || {}) }
    if (featured) o.featured = true
    if (verified) o.verified = true
    delete o.hidden
    siteDb.overrides[s.listingId] = o
    save('submissions')
    save('overrides')
    const listing = submissionToListing(s)
    let invoiceText = ''
    if (s.plan !== 'free' && !siteDb.payments.some((p) => p.sourceRef === s.ref)) {
      const inv = createInvoice({
        kind: 'plan',
        description: `${planById(s.plan).name} plan – ${s.billing}`,
        business: s.businessName,
        email: s.email,
        amount: planAmount(s.plan, s.billing),
        sourceRef: s.ref
      })
      invoiceText = ` Invoice ${inv.invoiceNo} for ${fmtLKR(inv.amount)} has been issued.`
    }
    notify(s.email, {
      title: 'Your listing is live! 🎉',
      message: `${s.businessName} has been approved and is now visible to couples.${invoiceText}`,
      link: listingPath(listing),
      tone: 'success'
    })
    log('listing', `approved ${s.businessName}`, `/admin/requests?ref=${s.ref}`, by)
  }

  const rejectListing = (ref, reason) => {
    const s = findSubmission(ref)
    if (!s) return
    s.status = 'rejected'
    s.reviewedAt = new Date().toISOString()
    s.reviewedBy = actorName()
    s.decisionNote = reason
    pushHistory(s, 'rejected', reason)
    save('submissions')
    notify(s.email, { title: 'Your listing was not approved', message: `${s.businessName}: ${reason}`, link: '/list-your-business#apply', tone: 'danger' })
    log('listing', `rejected ${s.businessName}`, `/admin/requests?ref=${s.ref}`)
  }

  const requestChanges = (ref, message) => {
    const s = findSubmission(ref)
    if (!s) return
    s.status = 'changes'
    s.reviewedAt = new Date().toISOString()
    s.reviewedBy = actorName()
    s.decisionNote = message
    pushHistory(s, 'changes', message)
    save('submissions')
    notify(s.email, { title: 'Changes needed on your listing', message: `${s.businessName}: ${message}`, link: `/list-your-business?edit=${s.ref}#apply`, tone: 'warn' })
    log('listing', `requested changes to ${s.businessName}`, `/admin/requests?ref=${s.ref}`)
  }

  const unpublishListing = (ref, reason) => {
    const s = findSubmission(ref)
    if (!s) return
    s.status = 'unpublished'
    s.decisionNote = reason
    pushHistory(s, 'unpublished', reason)
    save('submissions')
    notify(s.email, { title: 'Your listing has been unpublished', message: `${s.businessName}: ${reason}`, link: '/profile', tone: 'danger' })
    log('listing', `unpublished ${s.businessName}`, `/admin/requests?ref=${s.ref}`)
  }

  const addSubmissionNote = (ref, text) => {
    const s = findSubmission(ref)
    if (!s || !text.trim()) return
    s.notes = [...(s.notes || []), { at: new Date().toISOString(), by: actorName(), text: text.trim() }]
    save('submissions')
  }

  const deleteSubmission = (ref) => {
    const s = findSubmission(ref)
    if (!s) return
    siteDb.submissions = siteDb.submissions.filter((x) => x.ref !== ref)
    if (s.listingId) delete siteDb.overrides[s.listingId]
    save('submissions')
    save('overrides')
    log('listing', `deleted the request from ${s.businessName} (${ref})`, '/admin/requests')
  }

  // ---- listings (feature / verify / hide) ----
  const setListingFlag = (listing, flag, value) => {
    const o = { ...(siteDb.overrides[listing.id] || {}) }
    if (value) o[flag] = true
    else delete o[flag]
    siteDb.overrides[listing.id] = o
    save('overrides')
    const verbs = { featured: ['featured', 'removed the featured badge from'], verified: ['verified', 'removed verification from'], hidden: ['hid', 'restored'] }
    log('listing', `${value ? verbs[flag][0] : verbs[flag][1]} ${listing.name}`, '/admin/listings')
  }

  // ---- reviews ----
  const addReview = (review) => {
    const r = { id: uid('rv'), createdAt: new Date().toISOString(), status: siteDb.settings.moderateReviews ? 'pending' : 'published', ...review }
    siteDb.reviews.unshift(r)
    save('reviews')
    log('review', `wrote a ${r.rating}★ review for ${r.listingName}`, '/admin/reviews', r.name)
    return r
  }
  const setReviewStatus = (id, status) => {
    const r = siteDb.reviews.find((x) => x.id === id)
    if (!r) return
    r.status = status
    save('reviews')
    log('review', `${status === 'published' ? 'published' : 'hid'} a review on ${r.listingName}`, '/admin/reviews')
  }
  const deleteReview = (id) => {
    const r = siteDb.reviews.find((x) => x.id === id)
    siteDb.reviews = siteDb.reviews.filter((x) => x.id !== id)
    save('reviews')
    if (r) log('review', `deleted a review on ${r.listingName}`, '/admin/reviews')
  }

  // ---- enquiries ----
  const addEnquiry = (e) => {
    siteDb.enquiries.unshift({ id: uid('eq'), createdAt: new Date().toISOString(), status: 'new', ...e })
    siteDb.enquiries.splice(500)
    save('enquiries')
    log('enquiry', `sent an enquiry to ${e.vendorName}`, '/admin/enquiries', e.name)
  }
  const setEnquiryStatus = (id, status) => {
    const e = siteDb.enquiries.find((x) => x.id === id)
    if (!e) return
    e.status = status
    save('enquiries')
    log('enquiry', `marked an enquiry for ${e.vendorName} as ${status}`, '/admin/enquiries')
  }
  const deleteEnquiry = (id) => {
    siteDb.enquiries = siteDb.enquiries.filter((x) => x.id !== id)
    save('enquiries')
  }

  // ---- advert bookings ----
  const addAdBooking = (b) => {
    const placement = adPlacements.find((a) => a.id === b.placementId)
    siteDb.ads.unshift({ id: uid('ad'), createdAt: new Date().toISOString(), status: 'new', placementName: placement?.name || b.placementId, amount: AD_PRICES[b.placementId] || 0, ...b })
    save('ads')
    log('ad', `requested the ${placement?.name || 'advert'} spot for ${b.month}`, '/admin/advertising', b.business)
  }
  const setAdStatus = (id, status, note = '') => {
    const ad = siteDb.ads.find((x) => x.id === id)
    if (!ad) return
    ad.status = status
    if (note) ad.note = note
    if (status === 'confirmed' && !ad.invoiceId) {
      const inv = createInvoice({ kind: 'ad', description: `${ad.placementName} – ${ad.month}`, business: ad.business, email: ad.email, amount: ad.amount, sourceRef: ad.id })
      ad.invoiceId = inv.id
      notify(ad.email, { title: 'Advert booking confirmed', message: `${ad.placementName} for ${ad.month} is confirmed. Invoice ${inv.invoiceNo}: ${fmtLKR(inv.amount)}.`, link: '/profile', tone: 'success' })
    }
    if (status === 'declined') notify(ad.email, { title: 'Advert booking declined', message: `${ad.placementName} for ${ad.month}${note ? `: ${note}` : '.'}`, link: '/list-your-business#advertising', tone: 'danger' })
    save('ads')
    log('ad', `marked the ${ad.placementName} booking from ${ad.business} as ${status}`, '/admin/advertising')
  }

  const updateSettings = (patch) => {
    siteDb.settings = { ...siteDb.settings, ...patch }
    save('settings')
    log('settings', 'updated the site settings', '/admin/settings')
  }

  const exportData = () => ({
    exportedAt: new Date().toISOString(),
    ...Object.fromEntries(Object.keys(KEYS).map((k) => [k, siteDb[k]]))
  })

  return {
    db: siteDb,
    log,
    notify,
    notificationsFor,
    markNotificationsRead,
    findSubmission,
    submissionsFor,
    submitListing,
    approveListing,
    rejectListing,
    requestChanges,
    unpublishListing,
    addSubmissionNote,
    deleteSubmission,
    setListingFlag,
    addReview,
    setReviewStatus,
    deleteReview,
    addEnquiry,
    setEnquiryStatus,
    deleteEnquiry,
    addAdBooking,
    setAdStatus,
    createInvoice,
    setInvoiceStatus,
    updateSettings,
    exportData
  }
}

// ---- small formatting helpers shared by the admin pages --------------------
export const fmtLKR = (n) => `LKR ${Number(n || 0).toLocaleString('en-LK')}`
export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
export const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
export const timeAgo = (iso) => {
  if (!iso) return ''
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`
  return fmtDate(iso)
}
export const categoryLabel = catName

// /listing/<service>/<Name> – same rules as composables/useListing.js
const slugSub = (name) =>
  String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const slugName = (name) => String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
export const listingPath = (l) => `/listing/${slugSub(l.sub)}/${slugName(l.name)}`
