<template>
  <div class="relative min-h-screen bg-ivory">
    <AppNavbar />

    <main>
      <!-- Main banner: rotating paid ads (other vendors) -->
      <PaidBanner :category-key="listing.categoryKey" :exclude-name="listing.name" />

      <!-- Listing name, rating and actions -->
      <ListingHeader :listing="listing" @enquire="jump('enquiry')" />

      <!-- Section tabs -->
      <div class="sticky top-[72px] z-30 border-b border-rosewood/10 bg-ivory/90 backdrop-blur">
        <nav class="container-site no-scrollbar flex gap-1 overflow-x-auto py-2" aria-label="Listing sections">
          <a
            v-for="t in tabs"
            :key="t.id"
            :href="`#${t.id}`"
            class="tab"
            :class="{ 'is-on': activeTab === t.id }"
            @click.prevent="jump(t.id)"
          >
            <AppIcon :name="t.icon" :size="15" />
            {{ t.label }}
          </a>
        </nav>
      </div>

      <section class="container-site py-10 sm:py-12">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div class="min-w-0 space-y-8">
            <!-- Overview -->
            <article id="overview" class="panel">
              <p class="eyebrow">{{ listing.categoryName }}</p>
              <h2 class="panel-title mt-2">About {{ listing.name }}</h2>
              <p class="mt-4 leading-relaxed text-charcoal-soft">{{ listing.description }}</p>

              <dl class="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div v-for="f in facts" :key="f.label" class="fact">
                  <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rosewood-50 text-rosewood">
                    <AppIcon :name="f.icon" :size="18" />
                  </span>
                  <div class="min-w-0">
                    <dt class="text-[11px] uppercase tracking-[0.16em] text-charcoal-soft">{{ f.label }}</dt>
                    <dd class="mt-0.5 text-sm font-semibold text-charcoal">{{ f.value }}</dd>
                  </div>
                </div>
              </dl>
            </article>

            <!-- Services -->
            <article id="services" class="panel">
              <h2 class="panel-title">Services offered</h2>
              <ul class="mt-5 grid gap-3 sm:grid-cols-2">
                <li v-for="s in listing.services" :key="s" class="flex items-start gap-3 rounded-2xl bg-blush-light/60 px-4 py-3 text-sm text-charcoal">
                  <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rosewood text-white">
                    <AppIcon name="check" :size="12" :stroke-width="2.6" />
                  </span>
                  {{ s }}
                </li>
              </ul>
              <template v-if="listing.offerings.length">
                <h3 class="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-soft">What’s included</h3>
                <ul class="mt-3 flex flex-wrap gap-2">
                  <li v-for="o in listing.offerings" :key="o" class="rounded-full bg-gold-light/40 px-3.5 py-1.5 text-[13px] font-medium text-rosewood-800 ring-1 ring-gold/30">{{ o }}</li>
                </ul>
              </template>
            </article>

            <!-- Photos -->
            <article id="photos" class="panel">
              <div class="flex items-end justify-between gap-3">
                <h2 class="panel-title">Photo gallery</h2>
                <span class="text-xs text-charcoal-soft">{{ photos.length }} photos</span>
              </div>
              <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  v-for="(src, i) in photos"
                  :key="src"
                  type="button"
                  class="group relative overflow-hidden rounded-2xl"
                  :class="i === 0 ? 'col-span-2 aspect-[4/3] sm:row-span-2 sm:aspect-auto' : 'aspect-square'"
                  :aria-label="`Open photo ${i + 1}`"
                  @click="openLightbox(i)"
                >
                  <img :src="src" :alt="`${listing.name} photo ${i + 1}`" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy">
                  <span class="absolute inset-0 grid place-items-center bg-rosewood-900/0 text-white opacity-0 transition group-hover:bg-rosewood-900/30 group-hover:opacity-100">
                    <AppIcon name="search" :size="22" />
                  </span>
                </button>
              </div>
            </article>

            <!-- Reviews -->
            <article id="reviews" class="panel">
              <h2 class="panel-title">Couples' reviews</h2>

              <div v-if="listing.rating" class="mt-5 flex flex-wrap items-center gap-5 rounded-2xl bg-blush-light/60 p-5">
                <p class="font-serif text-5xl font-semibold text-rosewood">{{ listing.rating.toFixed(1) }}</p>
                <div>
                  <StarRating :rating="listing.rating" />
                  <p class="mt-1 text-sm text-charcoal-soft">Based on {{ reviewInfo.count }} reviews</p>
                </div>
              </div>

              <ul v-if="reviewInfo.list.length" class="mt-5 space-y-4">
                <li v-for="(r, i) in reviewInfo.list" :key="`${r.name}-${i}`" class="rounded-2xl p-5 ring-1 ring-charcoal/10">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-3">
                      <span class="grid h-10 w-10 place-items-center rounded-full bg-gold-light/50 font-serif text-lg font-semibold text-rosewood-800">{{ r.name[0] }}</span>
                      <div>
                        <p class="text-sm font-semibold text-charcoal">{{ r.name }}</p>
                        <p class="text-xs text-charcoal-soft">{{ r.date }}</p>
                      </div>
                    </div>
                    <StarRating :rating="r.rating" />
                  </div>
                  <p v-if="r.title" class="mt-3 text-sm font-semibold text-charcoal">{{ r.title }}</p>
                  <p class="text-sm leading-relaxed text-charcoal-soft" :class="r.title ? 'mt-1' : 'mt-3'">“{{ r.text }}”</p>
                </li>
              </ul>
              <p v-else class="mt-4 rounded-2xl bg-blush-light/60 px-5 py-4 text-sm text-charcoal-soft">
                No reviews yet. Worked with {{ listing.name }}? Be the first to share your experience.
              </p>

              <!-- Write a review -->
              <details class="group mt-6 rounded-2xl ring-1 ring-charcoal/10 open:ring-rosewood/25">
                <summary class="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-rosewood">
                  Write a review
                  <AppIcon name="chevronDown" :size="16" class="transition group-open:rotate-180" />
                </summary>
                <form class="grid gap-4 px-5 pb-5 sm:grid-cols-2" novalidate @submit.prevent="submitReview">
                  <label class="field">
                    <span>Your name *</span>
                    <input v-model.trim="review.name" type="text" autocomplete="name" :class="{ 'is-bad': reviewErrors.name }">
                    <small v-if="reviewErrors.name">{{ reviewErrors.name }}</small>
                  </label>
                  <label class="field">
                    <span>E-mail *</span>
                    <input v-model.trim="review.email" type="email" autocomplete="email" :class="{ 'is-bad': reviewErrors.email }">
                    <small v-if="reviewErrors.email">{{ reviewErrors.email }}</small>
                  </label>
                  <label class="field sm:col-span-2">
                    <span>Review title *</span>
                    <input v-model.trim="review.title" type="text" :class="{ 'is-bad': reviewErrors.title }">
                    <small v-if="reviewErrors.title">{{ reviewErrors.title }}</small>
                  </label>
                  <div class="field sm:col-span-2">
                    <span>Your rating</span>
                    <div class="flex gap-1" role="radiogroup" aria-label="Your rating">
                      <button
                        v-for="n in 5"
                        :key="n"
                        type="button"
                        role="radio"
                        :aria-checked="review.rating === n"
                        :aria-label="`${n} star${n > 1 ? 's' : ''}`"
                        class="text-gold transition hover:scale-110"
                        @click="review.rating = n"
                      >
                        <AppIcon name="star" :size="24" :filled="n <= review.rating" />
                      </button>
                    </div>
                  </div>
                  <label class="field sm:col-span-2">
                    <span>Write review *</span>
                    <textarea v-model.trim="review.text" rows="4" :class="{ 'is-bad': reviewErrors.text }" />
                    <small v-if="reviewErrors.text">{{ reviewErrors.text }}</small>
                  </label>
                  <div class="sm:col-span-2">
                    <button type="submit" class="btn-outline !min-h-[44px] text-sm">Submit review</button>
                  </div>
                </form>
              </details>
            </article>

            <!-- Enquiry -->
            <article id="enquiry" class="panel">
              <h2 class="panel-title">Send an enquiry to {{ listing.name }}</h2>
              <p class="mt-2 text-sm text-charcoal-soft">Tell them about your day – they usually reply within 24 hours.</p>

              <form class="mt-6 grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="submitEnquiry">
                <label class="field">
                  <span>Name *</span>
                  <input v-model.trim="enquiry.name" type="text" autocomplete="name" :class="{ 'is-bad': errors.name }">
                  <small v-if="errors.name">{{ errors.name }}</small>
                </label>
                <label class="field">
                  <span>Phone *</span>
                  <input v-model.trim="enquiry.phone" type="tel" autocomplete="tel" placeholder="07X XXX XXXX" :class="{ 'is-bad': errors.phone }">
                  <small v-if="errors.phone">{{ errors.phone }}</small>
                </label>
                <label class="field">
                  <span>E-mail *</span>
                  <input v-model.trim="enquiry.email" type="email" autocomplete="email" :class="{ 'is-bad': errors.email }">
                  <small v-if="errors.email">{{ errors.email }}</small>
                </label>
                <label class="field">
                  <span>Wedding date *</span>
                  <input v-model="enquiry.date" type="date" :min="today" :class="{ 'is-bad': errors.date }">
                  <small v-if="errors.date">{{ errors.date }}</small>
                </label>
                <label class="field sm:col-span-2">
                  <span>Message *</span>
                  <textarea v-model.trim="enquiry.message" rows="4" :placeholder="`Hi, we'd love to know more about your ${listing.sub.toLowerCase()} for our wedding…`" :class="{ 'is-bad': errors.message }" />
                  <small v-if="errors.message">{{ errors.message }}</small>
                </label>
                <fieldset class="sm:col-span-2">
                  <legend class="text-xs font-medium uppercase tracking-[0.16em] text-charcoal-soft">Send me info via</legend>
                  <div class="mt-2 flex flex-wrap gap-5 text-sm text-charcoal">
                    <label class="flex items-center gap-2"><input v-model="enquiry.viaEmail" type="checkbox" class="check"> E-mail</label>
                    <label class="flex items-center gap-2"><input v-model="enquiry.callBack" type="checkbox" class="check"> Need call back</label>
                  </div>
                </fieldset>
                <div class="sm:col-span-2">
                  <button type="submit" class="btn-primary !min-h-[48px] w-full sm:w-auto">
                    <AppIcon name="calendar" :size="17" />
                    Book Now
                  </button>
                </div>
              </form>
            </article>
          </div>

          <!-- Contact details -->
          <aside class="lg:sticky lg:top-[140px] lg:self-start">
            <div class="panel !p-0 overflow-hidden">
              <div class="bg-gradient-to-br from-rosewood to-rosewood-800 px-6 py-5 text-white">
                <p class="text-[11px] uppercase tracking-[0.24em] text-gold-light">{{ listing.priceValue ? 'Starting from' : 'Pricing' }}</p>
                <p class="mt-1 font-serif text-3xl font-semibold">{{ listing.price }}</p>
              </div>

              <ul class="space-y-4 px-6 py-6 text-sm">
                <li v-for="p in listing.phones" :key="p" class="flex items-start gap-3">
                  <AppIcon name="phone" :size="18" class="mt-0.5 shrink-0 text-rosewood" />
                  <div>
                    <p class="text-[11px] uppercase tracking-[0.16em] text-charcoal-soft">Tel</p>
                    <a :href="`tel:${p.replace(/[^\d+]/g, '')}`" class="font-semibold text-charcoal hover:text-rosewood">{{ p }}</a>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <AppIcon name="pin" :size="18" class="mt-0.5 shrink-0 text-rosewood" />
                  <div>
                    <p class="text-[11px] uppercase tracking-[0.16em] text-charcoal-soft">Address</p>
                    <p class="font-medium text-charcoal">{{ listing.address }}</p>
                    <a
                      :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.name}, ${listing.address}, Sri Lanka`)}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-rosewood hover:underline"
                    >
                      View on map
                      <AppIcon name="arrowRight" :size="12" />
                    </a>
                  </div>
                </li>
                <li v-if="listing.hours" class="flex items-start gap-3">
                  <AppIcon name="calendar" :size="18" class="mt-0.5 shrink-0 text-rosewood" />
                  <div>
                    <p class="text-[11px] uppercase tracking-[0.16em] text-charcoal-soft">Opening hours</p>
                    <p class="font-medium text-charcoal">{{ listing.hours }}</p>
                  </div>
                </li>
                <li v-if="listing.areas.length" class="flex items-start gap-3">
                  <AppIcon name="compass" :size="18" class="mt-0.5 shrink-0 text-rosewood" />
                  <div>
                    <p class="text-[11px] uppercase tracking-[0.16em] text-charcoal-soft">Areas served</p>
                    <p class="font-medium text-charcoal">{{ listing.areas.join(', ') }}</p>
                  </div>
                </li>
                <li v-if="/^https?:\/\//i.test(listing.website)" class="flex items-start gap-3">
                  <AppIcon name="layers" :size="18" class="mt-0.5 shrink-0 text-rosewood" />
                  <div class="min-w-0">
                    <p class="text-[11px] uppercase tracking-[0.16em] text-charcoal-soft">Website</p>
                    <a :href="listing.website" target="_blank" rel="noopener noreferrer nofollow" class="block truncate font-semibold text-charcoal hover:text-rosewood">{{ listing.website.replace(/^https?:\/\//, '') }}</a>
                  </div>
                </li>
              </ul>

              <div class="space-y-2.5 border-t border-rosewood/10 px-6 py-5">
                <a
                  v-if="listing.phones.length"
                  :href="`tel:${listing.phones[0].replace(/[^\d+]/g, '')}`"
                  class="btn-primary !min-h-[46px] w-full text-sm"
                >
                  <AppIcon name="phone" :size="16" />
                  Call {{ listing.phones[0] }}
                </a>
                <button type="button" class="btn-outline !min-h-[46px] w-full text-sm" @click="jump('enquiry')">
                  <AppIcon name="mail" :size="16" />
                  Send enquiry
                </button>
              </div>

              <div class="border-t border-rosewood/10 px-6 py-5">
                <p class="text-[11px] uppercase tracking-[0.16em] text-charcoal-soft">Social media</p>
                <div class="mt-3 flex gap-2">
                  <button
                    v-for="s in socials"
                    :key="s.icon"
                    type="button"
                    class="grid h-9 w-9 place-items-center rounded-full ring-1 ring-rosewood/15 text-rosewood transition hover:bg-rosewood hover:text-white"
                    :aria-label="`${listing.name} on ${s.name}`"
                    @click="comingSoon(`${listing.name}'s ${s.name} page`)"
                  >
                    <AppIcon :name="s.icon" :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <!-- Similar categories -->
        <div class="mt-16 border-t border-rosewood/10 pt-12">
          <p class="eyebrow">Explore more</p>
          <h2 class="mt-2 font-serif text-3xl font-semibold">Similar Categories</h2>
          <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            <NuxtLink
              v-for="tile in similar"
              :key="tile.categoryKey + tile.name"
              :to="catalogLink({ category: tile.categoryKey, sub: tile.name })"
              class="rel-tile group block"
            >
              <span class="block aspect-[4/3] overflow-hidden rounded-xl">
                <img :src="tile.image" alt="" class="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy">
              </span>
              <span class="mt-2.5 block px-1 text-[13px] font-semibold leading-snug text-charcoal transition group-hover:text-rosewood sm:text-sm">{{ tile.name }}</span>
              <span class="block px-1 pb-0.5 text-[11px] text-charcoal-soft">
                {{ tile.categoryName }}<template v-if="tile.count"> · {{ tile.count }} {{ tile.count > 1 ? 'listings' : 'listing' }}</template>
              </span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Lightbox -->
    <Transition name="fade">
      <div
        v-if="lightbox !== null"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-rosewood-900/90 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`${listing.name} photo ${lightbox + 1} of ${photos.length}`"
        @click.self="lightbox = null"
      >
        <img :src="photos[lightbox]" :alt="`${listing.name} photo ${lightbox + 1}`" class="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-lift">
        <button type="button" class="lb-btn right-4 top-4" aria-label="Close" @click="lightbox = null">
          <AppIcon name="close" :size="20" />
        </button>
        <button type="button" class="lb-btn left-4 top-1/2 -translate-y-1/2" aria-label="Previous photo" @click="stepLightbox(-1)">
          <AppIcon name="arrowRight" :size="18" class="rotate-180" />
        </button>
        <button type="button" class="lb-btn right-4 top-1/2 -translate-y-1/2" aria-label="Next photo" @click="stepLightbox(1)">
          <AppIcon name="arrowRight" :size="18" />
        </button>
        <p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">{{ lightbox + 1 }} / {{ photos.length }}</p>
      </div>
    </Transition>

    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { catalogLink } from '~/composables/useCatalog'
import { getListingDetails } from '~/composables/useListing'
import { categoryPhotos, subcategoryTiles, relatedSubTiles } from '~/composables/useCategoryPage'
import { weddingCategories } from '~/data/weddingCategories'

useSplash().finish()

// The page (pages/listing/[sub]/[name].vue) finds the listing and passes it in.
const props = defineProps({ item: { type: Object, required: true } })
const route = useRoute()
const site = useSiteData()
const listing = getListingDetails(props.item)
// Reviews stay reactive: ones an admin publishes appear once the site data has loaded.
const reviewInfo = computed(() => {
  const d = getListingDetails(props.item)
  return { list: d.reviews, count: d.reviewCount }
})

useSeoMeta({
  title: `${listing.name} – ${listing.sub} – Wedding Hub`,
  description: listing.description
})

const { show, comingSoon } = useToast()

// Listing photos first, then category / general wedding photos so the banner
// and the gallery always have five pictures.
const GENERAL = ['/images/hero-couple.jpg', '/images/inspiration-banner.jpg', '/images/business-cta.jpg']
const photos = [...new Set([...listing.gallery, ...categoryPhotos(listing.categoryKey), ...GENERAL])].slice(0, 5)

const facts = [
  { label: 'Category', value: listing.categoryName, icon: 'layers' },
  { label: 'Service', value: listing.sub, icon: 'sparkles' },
  { label: 'Location', value: listing.area || listing.location, icon: 'pin' },
  { label: 'Pricing', value: listing.price, icon: 'store' },
  listing.since && { label: 'In business since', value: String(listing.since), icon: 'calendar' },
  listing.capacity && { label: 'Capacity', value: listing.capacity, icon: 'users' },
  listing.rating && { label: 'Rating', value: `${listing.rating.toFixed(1)} / 5`, icon: 'star' }
].filter(Boolean)

const socials = [
  { name: 'Facebook', icon: 'facebook' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'YouTube', icon: 'youtube' }
]

// Similar categories: this listing's own service first, then related services.
const similar = (() => {
  const cat = weddingCategories.find((c) => c.key === listing.categoryKey)
  const own = subcategoryTiles(listing.categoryKey)
    .filter((t) => t.name === listing.sub)
    .map((t) => ({ ...t, categoryKey: listing.categoryKey, categoryName: cat?.name || '' }))
  return [...own, ...relatedSubTiles(listing.categoryKey, listing.sub, 7)]
})()

// --- Tabs + scroll spy -------------------------------------------------------
const tabs = [
  { id: 'overview', label: 'Overview', icon: 'compass' },
  { id: 'services', label: 'Services', icon: 'check' },
  { id: 'photos', label: 'Photos', icon: 'image' },
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'enquiry', label: 'Enquiry', icon: 'mail' }
]
const activeTab = ref('overview')
const OFFSET = 140 // fixed header + sticky tabs
const jump = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 4, behavior: 'smooth' })
}
const onScroll = () => {
  let current = tabs[0].id
  for (const t of tabs) {
    const el = document.getElementById(t.id)
    if (el && el.getBoundingClientRect().top - OFFSET <= 40) current = t.id
  }
  activeTab.value = current
}

// --- Lightbox ----------------------------------------------------------------
const lightbox = ref(null)
const openLightbox = (i) => {
  lightbox.value = i
}
const stepLightbox = (d) => {
  lightbox.value = (lightbox.value + d + photos.length) % photos.length
}
const onKey = (e) => {
  if (lightbox.value === null) return
  if (e.key === 'Escape') lightbox.value = null
  if (e.key === 'ArrowRight') stepLightbox(1)
  if (e.key === 'ArrowLeft') stepLightbox(-1)
}
watch(lightbox, (v) => {
  document.documentElement.style.overflow = v === null ? '' : 'hidden'
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})

// --- Forms (dummy – nothing is sent anywhere) -----------------------------------
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const today = new Date().toISOString().slice(0, 10)

const blankEnquiry = () => ({ name: '', phone: '', email: '', date: '', message: '', viaEmail: true, callBack: false })
const enquiry = reactive(blankEnquiry())
const auth = useAuth()
// Pre-fill the enquiry with the signed-in user's details.
const prefill = () => {
  const u = auth.user.value
  if (!u) return
  if (!enquiry.name) enquiry.name = u.name
  if (!enquiry.phone) enquiry.phone = u.phone || ''
  if (!enquiry.email) enquiry.email = u.email
  if (!enquiry.date && u.weddingDate && u.weddingDate >= today) enquiry.date = u.weddingDate
}
watch(() => auth.user.value?.id, prefill)
onMounted(prefill)
const errors = reactive({})
const submitEnquiry = () => {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!enquiry.name) errors.name = 'Please enter your name.'
  if (!/^[+\d][\d\s()-]{8,}$/.test(enquiry.phone)) errors.phone = 'Please enter a valid phone number.'
  if (!EMAIL.test(enquiry.email)) errors.email = 'Please enter a valid e-mail address.'
  if (!enquiry.date) errors.date = 'Please choose your wedding date.'
  if (!enquiry.message) errors.message = 'Please add a short message.'
  if (Object.keys(errors).length) return
  // Every enquiry is visible to the admin team (Admin → Enquiries).
  site.addEnquiry({
    listingId: listing.id,
    vendorName: listing.name,
    link: route.path,
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email,
    weddingDate: enquiry.date,
    message: enquiry.message,
    userId: auth.user.value?.id || ''
  })
  // Signed-in users can find the enquiry again under Profile → My enquiries.
  auth.addEnquiry({
    listingId: listing.id,
    vendorName: listing.name,
    sub: listing.sub,
    link: route.path,
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email,
    weddingDate: enquiry.date,
    message: enquiry.message,
    viaEmail: enquiry.viaEmail,
    callBack: enquiry.callBack
  })
  show(
    auth.user.value
      ? `Your enquiry has been sent to ${listing.name}. You can track it in your profile.`
      : `Your enquiry has been sent to ${listing.name}. They'll be in touch soon.`,
    { title: 'Enquiry sent', icon: 'check' }
  )
  Object.assign(enquiry, blankEnquiry())
  prefill()
}

const blankReview = () => ({ name: '', email: '', title: '', rating: 5, text: '' })
const review = reactive(blankReview())
const reviewErrors = reactive({})
const submitReview = () => {
  Object.keys(reviewErrors).forEach((k) => delete reviewErrors[k])
  if (!review.name) reviewErrors.name = 'Please enter your name.'
  if (!EMAIL.test(review.email)) reviewErrors.email = 'Please enter a valid e-mail address.'
  if (!review.title) reviewErrors.title = 'Please add a title.'
  if (!review.text) reviewErrors.text = 'Please write your review.'
  if (Object.keys(reviewErrors).length) return
  // Reviews wait in Admin → Reviews until they're approved (see Settings).
  const saved = site.addReview({
    listingId: listing.id,
    listingName: listing.name,
    link: route.path,
    name: review.name,
    email: review.email,
    title: review.title,
    rating: review.rating,
    text: review.text
  })
  show(
    saved.status === 'published'
      ? 'Thank you! Your review has been published. Reload the page to see it.'
      : 'Thank you! Your review will appear once our team has checked it.',
    { title: 'Review submitted', icon: 'check' }
  )
  Object.assign(review, blankReview())
}
</script>

<style scoped>
.panel {
  @apply scroll-mt-36 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-rosewood/5 sm:p-8;
}
.panel-title {
  @apply font-serif text-2xl font-semibold text-charcoal sm:text-[1.75rem];
}
.fact {
  @apply flex items-center gap-3 rounded-2xl bg-ivory p-3 ring-1 ring-rosewood/10;
}
.tab {
  @apply flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-charcoal-soft transition hover:text-rosewood;
}
.tab.is-on {
  @apply bg-rosewood text-white shadow-soft hover:text-white;
}
.field {
  @apply flex flex-col gap-1.5;
}
.field > span {
  @apply text-xs font-medium uppercase tracking-[0.16em] text-charcoal-soft;
}
.field input,
.field textarea {
  @apply w-full rounded-xl border border-rosewood/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-charcoal-soft/50 focus:border-rosewood/40 focus:ring-4 focus:ring-rosewood/10;
}
.field .is-bad {
  @apply border-red-400 focus:ring-red-100;
}
.field small {
  @apply text-xs text-red-600;
}
.check {
  @apply h-4 w-4 rounded accent-rosewood;
}
.rel-tile {
  @apply relative rounded-2xl bg-white p-2 ring-1 ring-charcoal/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft hover:ring-rosewood/30;
}
.lb-btn {
  @apply absolute grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white hover:text-rosewood-800;
}
</style>
