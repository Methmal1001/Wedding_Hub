<template>
  <div class="relative min-h-screen bg-ivory">
    <AppNavbar />

    <main>
      <!-- ============ Hero ============ -->
      <section class="relative isolate overflow-hidden bg-rosewood-900 text-white">
        <img src="/images/business-cta.jpg" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover opacity-30">
        <div aria-hidden="true" class="absolute inset-0 -z-10 bg-gradient-to-br from-rosewood-900 via-rosewood-800/90 to-rosewood/70" />
        <div aria-hidden="true" class="glow glow--a" />
        <div aria-hidden="true" class="glow glow--b" />

        <div class="container-site grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p class="hero-in inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold-light ring-1 ring-white/20 backdrop-blur">
              <AppIcon name="store" :size="13" />
              For wedding businesses
            </p>
            <h1 class="hero-in mt-6 font-serif text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl lg:text-[4.2rem]" style="animation-delay: 0.1s">
              Grow your wedding business with
              <span class="relative whitespace-nowrap italic text-gold-light">
                Wedding Hub
                <svg class="underline-draw absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 9C80 2 220 2 297 8" pathLength="1" fill="none" stroke="#00F2FF" stroke-width="3" stroke-linecap="round" />
                </svg>
              </span>
            </h1>
            <p class="hero-in mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg" style="animation-delay: 0.2s">
              Sri Lanka’s couples come here to find their photographers, venues, salons and more. List your business for free and start receiving enquiries.
            </p>
            <div class="hero-in mt-8 flex flex-wrap gap-3" style="animation-delay: 0.3s">
              <button type="button" class="btn-gold btn-shine" @click="jump('apply')">
                <AppIcon name="sparkles" :size="17" />
                List your business – free
              </button>
              <button type="button" class="btn-ghost-light" @click="jump('plans')">See plans & pricing</button>
            </div>
            <dl class="hero-in mt-10 grid max-w-lg grid-cols-3 gap-4" style="animation-delay: 0.4s">
              <div v-for="s in heroStats" :key="s.label" class="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
                <dt class="sr-only">{{ s.label }}</dt>
                <dd class="font-serif text-3xl font-semibold leading-none">{{ s.value }}</dd>
                <p class="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/70">{{ s.label }}</p>
              </div>
            </dl>
          </div>

          <!-- Collage -->
          <div class="relative mx-auto hidden h-[470px] w-full max-w-[480px] sm:block" aria-hidden="true">
            <div class="collage collage--a">
              <img src="/images/cat-photographers.jpg" alt="" class="h-full w-full object-cover">
            </div>
            <div class="collage collage--b">
              <img src="/images/cat-venues.jpg" alt="" class="h-full w-full object-cover">
            </div>
            <div class="collage collage--c">
              <img src="/images/cat-bridal-salons.jpg" alt="" class="h-full w-full object-cover">
            </div>

            <div class="float-card float-card--a">
              <span class="grid h-10 w-10 place-items-center rounded-full bg-rosewood text-white"><AppIcon name="mail" :size="18" /></span>
              <div>
                <p class="text-xs font-semibold text-charcoal">New enquiry</p>
                <p class="text-[11px] text-charcoal-soft">Ishani &amp; Dilan · 14 Feb 2027</p>
              </div>
            </div>
            <div class="float-card float-card--b">
              <span class="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-500"><AppIcon name="star" :size="18" filled /></span>
              <div>
                <p class="text-xs font-semibold text-charcoal">New 5★ review</p>
                <p class="text-[11px] text-charcoal-soft">“Simply magical!”</p>
              </div>
            </div>
            <div class="float-card float-card--c">
              <span class="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white"><AppIcon name="verified" :size="18" /></span>
              <p class="text-xs font-semibold text-charcoal">Verified vendor</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ Category marquee ============ -->
      <div class="overflow-hidden border-b border-rosewood/10 bg-white py-4" aria-label="Categories you can list in">
        <div class="marquee flex w-max gap-10">
          <span v-for="(c, i) in [...weddingCategories, ...weddingCategories]" :key="`m${i}`" class="flex items-center gap-10 whitespace-nowrap font-serif text-xl text-charcoal-soft" :aria-hidden="i >= weddingCategories.length">
            {{ c.name }}
            <AppIcon name="sparkles" :size="14" class="text-gold" />
          </span>
        </div>
      </div>

      <!-- ============ Benefits ============ -->
      <section id="why" class="container-site py-20 sm:py-24">
        <SectionHeading eyebrow="Why Wedding Hub" title="Everything you need to win more weddings" subtitle="Simple tools that put your business in front of couples who are ready to book." />
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(b, i) in benefits" :key="b.title" v-reveal :style="{ transitionDelay: (i % 3) * 0.08 + 's' }">
            <article class="benefit group h-full">
              <span class="benefit-icon"><AppIcon :name="b.icon" :size="22" /></span>
              <h3 class="mt-5 font-serif text-2xl font-semibold text-charcoal">{{ b.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-charcoal-soft">{{ b.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- ============ How it works ============ -->
      <section id="how" class="relative overflow-hidden bg-gradient-to-b from-blush-light to-ivory py-20 sm:py-24">
        <div class="container-site">
          <SectionHeading eyebrow="How it works" title="Live in four simple steps" />
          <ol class="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden="true" class="absolute left-[12%] right-[12%] top-8 hidden h-0.5 bg-gradient-to-r from-rosewood/10 via-rosewood/40 to-rosewood/10 md:block" />
            <li v-for="(s, i) in howSteps" :key="s.title" v-reveal class="relative text-center" :style="{ transitionDelay: i * 0.1 + 's' }">
              <span class="step-badge">
                <AppIcon :name="s.icon" :size="24" />
                <span class="step-no">{{ i + 1 }}</span>
              </span>
              <h3 class="mt-5 font-serif text-xl font-semibold text-charcoal">{{ s.title }}</h3>
              <p class="mx-auto mt-1.5 max-w-[240px] text-sm text-charcoal-soft">{{ s.text }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- ============ Plans ============ -->
      <section id="plans" class="container-site scroll-mt-24 py-20 sm:py-24">
        <SectionHeading eyebrow="Plans & pricing" title="Start free, upgrade when you’re ready" subtitle="No set-up fees. Change or cancel your plan at any time." />
        <div class="mt-8 flex justify-center">
          <BillingToggle v-model="billing" />
        </div>
        <div class="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          <div v-for="(p, i) in plans" :key="p.id" v-reveal :style="{ transitionDelay: i * 0.08 + 's' }">
            <article class="plan h-full" :class="{ 'plan--popular': p.popular, 'plan--chosen': plan === p.id }">
              <span v-if="p.popular" class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-soft">
                Most popular
              </span>
              <div class="flex items-center gap-3">
                <span class="grid h-12 w-12 place-items-center rounded-2xl" :class="p.popular ? 'bg-white/15 text-gold-light' : 'bg-rosewood-50 text-rosewood'">
                  <AppIcon :name="p.icon" :size="22" />
                </span>
                <div>
                  <h3 class="font-serif text-2xl font-semibold">{{ p.name }}</h3>
                  <p class="text-xs" :class="p.popular ? 'text-white/70' : 'text-charcoal-soft'">{{ p.tagline }}</p>
                </div>
              </div>

              <div class="mt-6 flex items-end gap-1.5">
                <Transition name="price" mode="out-in">
                  <p :key="billing + p.id" class="font-serif text-5xl font-semibold leading-none">
                    {{ p.monthly === 0 ? 'Free' : lkrShort(billing === 'yearly' ? p.yearly : p.monthly) }}
                  </p>
                </Transition>
                <p v-if="p.monthly" class="pb-1 text-sm" :class="p.popular ? 'text-white/70' : 'text-charcoal-soft'">LKR / {{ billing === 'yearly' ? 'year' : 'month' }}</p>
              </div>
              <p class="mt-2 h-5 text-xs" :class="p.popular ? 'text-gold-light' : 'text-emerald-700'">
                <template v-if="p.monthly && billing === 'yearly'">You save LKR {{ (p.monthly * 12 - p.yearly).toLocaleString('en-LK') }} a year</template>
                <template v-else-if="!p.monthly">Free forever – no card needed</template>
              </p>

              <ul class="mt-6 space-y-3 text-sm">
                <li v-for="feat in p.features" :key="feat.text" class="flex items-start gap-2.5" :class="feat.on ? '' : 'opacity-45'">
                  <span
                    class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                    :class="feat.on ? (p.popular ? 'bg-gold text-rosewood-900' : 'bg-rosewood text-white') : p.popular ? 'bg-white/15' : 'bg-blush-light text-charcoal-soft'"
                  >
                    <AppIcon :name="feat.on ? 'check' : 'close'" :size="11" :stroke-width="2.8" />
                  </span>
                  <span :class="feat.on ? '' : 'line-through decoration-1'">{{ feat.text }}</span>
                </li>
              </ul>

              <button type="button" class="mt-8 w-full" :class="p.popular ? 'btn-gold' : 'btn-outline'" @click="choosePlan(p.id)">
                {{ plan === p.id ? 'Selected – continue' : p.cta }}
                <AppIcon name="arrowRight" :size="16" />
              </button>
            </article>
          </div>
        </div>
        <p class="mt-6 text-center text-xs text-charcoal-soft">Prices are in Sri Lankan rupees. Sample prices for this demo site.</p>
      </section>

      <!-- ============ Advertising ============ -->
      <section id="advertising" class="scroll-mt-24 bg-rosewood-900 py-20 text-white sm:py-24">
        <div class="container-site">
          <div class="mx-auto max-w-2xl text-center">
            <p class="text-[11px] font-medium uppercase tracking-[0.32em] text-gold-light">Advertise with us</p>
            <h2 class="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Put your brand in the spotlight</h2>
            <p class="mt-4 text-white/75">Rotating banner adverts in the places couples look the most. Pick a placement and a month – we’ll handle the rest.</p>
          </div>
          <div class="mt-12 grid gap-6 lg:grid-cols-3">
            <div v-for="(a, i) in adPlacements" :key="a.id" v-reveal :style="{ transitionDelay: i * 0.08 + 's' }">
              <article class="ad-card h-full">
                <!-- Mini mock-up of the placement -->
                <div class="mock" aria-hidden="true">
                  <div class="mock-bar"><span /><span /><span /></div>
                  <div v-if="a.preview === 'hero'" class="space-y-2 p-3">
                    <div class="mock-hl h-16 rounded-lg" />
                    <div class="mx-3 -mt-5 h-7 rounded-lg bg-white shadow" />
                    <div class="grid grid-cols-3 gap-1.5"><span class="mock-line" /><span class="mock-line" /><span class="mock-line" /></div>
                  </div>
                  <div v-else-if="a.preview === 'side'" class="grid grid-cols-[1fr_32%] gap-2 p-3">
                    <div class="space-y-1.5"><span class="mock-line block" /><span class="mock-line block w-4/5" /><div class="grid grid-cols-2 gap-1.5 pt-1"><span class="h-8 rounded bg-white/15" /><span class="h-8 rounded bg-white/15" /></div></div>
                    <div class="mock-hl h-full min-h-[64px] rounded-lg" />
                  </div>
                  <div v-else class="space-y-2 p-3">
                    <span class="mock-line block w-1/2" />
                    <div class="grid grid-cols-3 gap-1.5"><span class="mock-hl h-12 rounded-lg" /><span class="h-12 rounded-lg bg-white/15" /><span class="h-12 rounded-lg bg-white/15" /></div>
                  </div>
                </div>

                <div class="mt-5 flex items-center gap-3">
                  <span class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold-light ring-1 ring-white/20"><AppIcon :name="a.icon" :size="18" /></span>
                  <h3 class="font-serif text-xl font-semibold">{{ a.name }}</h3>
                </div>
                <p class="mt-2 text-sm text-white/70">{{ a.where }}</p>
                <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <p class="text-sm font-semibold text-gold-light">{{ a.price }}</p>
                  <button type="button" class="rounded-full bg-white px-4 py-2 text-xs font-semibold text-rosewood-800 transition hover:bg-gold-light" @click="openAd(a)">
                    Book this spot
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ Listing form ============ -->
      <section id="apply" class="relative scroll-mt-24 overflow-hidden py-20 sm:py-24">
        <div aria-hidden="true" class="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blush blur-3xl" />
        <div aria-hidden="true" class="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-gold-light/40 blur-3xl" />
        <div class="container-site relative">
          <SectionHeading eyebrow="Get started" title="List your business" subtitle="It takes about 5 minutes. Your progress is saved automatically." />
          <div class="mt-12">
            <BusinessListingForm v-model:plan="plan" v-model:billing="billing" />
          </div>
        </div>
      </section>

      <!-- ============ Vendor stories ============ -->
      <section class="bg-gradient-to-b from-ivory to-blush-light py-20 sm:py-24">
        <div class="container-site">
          <SectionHeading eyebrow="Vendor stories" title="Loved by wedding professionals" />
          <div class="mt-12 grid gap-6 md:grid-cols-3">
            <div v-for="(s, i) in stories" :key="s.name" v-reveal :style="{ transitionDelay: i * 0.08 + 's' }">
              <figure class="h-full rounded-3xl bg-white p-7 shadow-soft ring-1 ring-rosewood/5">
                <AppIcon name="quote" :size="30" class="text-gold" />
                <blockquote class="mt-4 text-[15px] leading-relaxed text-charcoal">“{{ s.text }}”</blockquote>
                <figcaption class="mt-6 flex items-center gap-3">
                  <img v-if="s.avatar" :src="s.avatar" :alt="s.name" class="h-12 w-12 rounded-full object-cover ring-2 ring-blush">
                  <div>
                    <p class="text-sm font-semibold text-charcoal">{{ s.name }}</p>
                    <NuxtLink v-if="s.link" :to="s.link" class="text-xs text-rosewood hover:underline">{{ s.business }}</NuxtLink>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ FAQ ============ -->
      <section id="faq" class="container-site py-20 sm:py-24">
        <SectionHeading eyebrow="FAQ" title="Questions? We’ve got answers" />
        <div class="mx-auto mt-12 max-w-3xl space-y-3">
          <div v-for="(q, i) in faqs" :key="q.q" class="faq" :class="{ 'is-open': openFaq === i }">
            <button type="button" class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? -1 : i">
              <span class="font-serif text-lg font-semibold text-charcoal sm:text-xl">{{ q.q }}</span>
              <span class="faq-icon"><AppIcon name="chevronDown" :size="16" /></span>
            </button>
            <div class="faq-body">
              <div class="overflow-hidden">
                <p class="px-6 pb-5 text-sm leading-relaxed text-charcoal-soft">{{ q.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ Final CTA ============ -->
      <section class="container-site pb-20">
        <div class="relative isolate overflow-hidden rounded-[36px] bg-gradient-to-br from-rosewood to-rosewood-800 px-6 py-14 text-center text-white sm:px-12">
          <div aria-hidden="true" class="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div aria-hidden="true" class="absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-blush/30 blur-3xl" />
          <p class="font-script text-4xl text-blush">Ready when you are</p>
          <h2 class="mx-auto mt-2 max-w-2xl font-serif text-4xl font-semibold sm:text-5xl">Couples are searching for businesses like yours</h2>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" class="btn-gold btn-shine" @click="jump('apply')">List your business – free</button>
            <NuxtLink v-if="!user" :to="{ path: '/auth/register', query: { type: 'vendor' } }" class="btn-ghost-light">Create a vendor account</NuxtLink>
            <NuxtLink v-else to="/profile" class="btn-ghost-light">Go to my profile</NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Advertising enquiry dialog -->
    <Transition name="fade">
      <div v-if="ad" class="fixed inset-0 z-[90] grid place-items-center bg-rosewood-900/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" :aria-label="`Book: ${ad.name}`" @click.self="ad = null">
        <form class="dialog w-full max-w-md rounded-[28px] bg-white p-6 shadow-lift sm:p-8" novalidate @submit.prevent="sendAd">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-dark">Book a banner</p>
              <h3 class="mt-1 font-serif text-2xl font-semibold text-charcoal">{{ ad.name }}</h3>
              <p class="mt-0.5 text-sm text-rosewood">{{ ad.price }}</p>
            </div>
            <button type="button" class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-charcoal-soft hover:bg-rosewood-50 hover:text-rosewood" aria-label="Close" @click="ad = null">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
          <div class="mt-6 space-y-4">
            <AuthInput v-model="adForm.business" label="Business name" icon="store" :error="adErrors.business" />
            <AuthInput v-model="adForm.phone" label="Phone number" icon="phone" type="tel" :error="adErrors.phone" />
            <AuthInput v-model="adForm.email" label="E-mail address" icon="mail" type="email" :error="adErrors.email" />
            <AuthInput v-model="adForm.month" label="Preferred month" icon="calendar" as="select">
              <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
            </AuthInput>
          </div>
          <button type="submit" class="btn-primary mt-6 w-full">
            <AppIcon name="mail" :size="16" />
            Send booking request
          </button>
        </form>
      </div>
    </Transition>

    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'
import { locations } from '~/data/locations'
import { catalog } from '~/data/catalog'
import { plans, adPlacements, faqs, vendorStories } from '~/data/businessPlans'
import { listingLink } from '~/composables/useListing'

useSeoMeta({
  title: 'List your business – Wedding Hub',
  description: 'List your wedding business on Wedding Hub for free. Reach couples across Sri Lanka, receive enquiries and grow your bookings.'
})
useSplash().finish()

const route = useRoute()
const { show } = useToast()
const user = useAuth().user

const plan = ref(['free', 'silver', 'gold'].includes(String(route.query.plan)) ? String(route.query.plan) : 'free')
const billing = ref('monthly')

const totalVendors = weddingCategories.reduce((s, c) => s + c.vendorCount, 0)
const heroStats = [
  { value: `${(Math.floor(totalVendors / 100) * 100).toLocaleString()}+`, label: 'Vendors' },
  { value: weddingCategories.length, label: 'Categories' },
  { value: locations.length, label: 'Cities' }
]

const benefits = [
  { icon: 'users', title: 'Reach ready-to-book couples', text: 'Couples browse by category, service and city – so the people who find you are actively planning their wedding.' },
  { icon: 'mail', title: 'Enquiries straight to you', text: 'Get enquiries with the couple’s wedding date, phone and e-mail. Reply quickly and win the booking.' },
  { icon: 'image', title: 'A beautiful listing page', text: 'Show off your photos, services, prices and reviews on a page designed to impress.' },
  { icon: 'verified', title: 'Build trust', text: 'Verified badges and couples’ reviews help new clients choose you with confidence.' },
  { icon: 'trending', title: 'Stand out in search', text: 'Upgrade for priority placement and featured spots on category pages.' },
  { icon: 'sparkles', title: 'Banner advertising', text: 'Promote your brand with rotating banners on the busiest pages of the site.' }
]

const howSteps = [
  { icon: 'store', title: 'Create your listing', text: 'Add your business details, services and prices.' },
  { icon: 'image', title: 'Upload photos', text: 'Show your best work – the cover photo matters most.' },
  { icon: 'shield', title: 'We review it', text: 'Our team checks every listing within 1–2 working days.' },
  { icon: 'heart', title: 'Get enquiries', text: 'Go live and start hearing from couples.' }
]

const stories = vendorStories.map((s) => {
  const item = catalog.find((c) => c.id === s.avatarId)
  return { ...s, avatar: item?.avatar, link: item ? listingLink(item) : '' }
})

const lkrShort = (n) => Number(n).toLocaleString('en-LK')

const jump = (id) => {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
}
const choosePlan = (id) => {
  plan.value = id
  const p = plans.find((x) => x.id === id)
  show(`${p.name} plan selected. Fill in your details below to get started.`, { title: 'Great choice!', icon: 'check' })
  jump('apply')
}

const openFaq = ref(0)

// ---- advertising dialog ----
const months = Array.from({ length: 6 }, (_, i) => {
  const d = new Date()
  d.setMonth(d.getMonth() + i + 1, 1)
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})
const ad = ref(null)
const site = useSiteData()
const adForm = reactive({ business: '', phone: '', email: '', month: months[0] })
const adErrors = reactive({})
const openAd = (a) => {
  ad.value = a
  Object.keys(adErrors).forEach((k) => delete adErrors[k])
  const u = user.value
  if (u) {
    adForm.business ||= u.businessName || ''
    adForm.phone ||= u.phone || ''
    adForm.email ||= u.email
  }
}
const sendAd = () => {
  Object.keys(adErrors).forEach((k) => delete adErrors[k])
  if (adForm.business.trim().length < 2) adErrors.business = 'Enter your business name.'
  if (!/^[+\d][\d\s()-]{8,}$/.test(adForm.phone.trim())) adErrors.phone = 'Enter a valid phone number.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adForm.email.trim())) adErrors.email = 'Enter a valid e-mail address.'
  if (Object.keys(adErrors).length) return
  // Goes to Admin → Advertising
  site.addAdBooking({
    placementId: ad.value.id,
    business: adForm.business.trim(),
    phone: adForm.phone.trim(),
    email: adForm.email.trim(),
    month: adForm.month
  })
  show(`We’ve received your request for “${ad.value.name}” in ${adForm.month}. Our team will contact you shortly.`, { title: 'Request sent', icon: 'check', duration: 4500 })
  ad.value = null
}
const onKey = (e) => {
  if (e.key === 'Escape') ad.value = null
}
watch(ad, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
})

// Open at a section when linked with a hash, e.g. /list-your-business#plans
onMounted(() => {
  document.addEventListener('keydown', onKey)
  if (route.hash) setTimeout(() => jump(route.hash.slice(1)), 300)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.hero-in {
  animation: hero-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes hero-rise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: none; }
}
.underline-draw path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.1s ease 0.8s forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
.glow {
  position: absolute;
  z-index: -5;
  border-radius: 9999px;
  filter: blur(70px);
  animation: glow-move 14s ease-in-out infinite alternate;
}
.glow--a {
  left: -8%;
  top: -10%;
  height: 360px;
  width: 360px;
  background: rgba(0, 73, 242, 0.55);
}
.glow--b {
  bottom: -20%;
  right: 10%;
  height: 420px;
  width: 420px;
  background: rgba(0, 210, 230, 0.35);
  animation-delay: -7s;
}
@keyframes glow-move {
  to { transform: translate(50px, 30px) scale(1.15); }
}

/* Collage */
.collage {
  position: absolute;
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.45);
  border: 6px solid rgba(255, 255, 255, 0.92);
  animation: collage-in 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.collage--a {
  left: 0;
  top: 30px;
  height: 300px;
  width: 230px;
  transform: rotate(-6deg);
  animation-delay: 0.2s;
}
.collage--b {
  right: 0;
  top: 0;
  height: 250px;
  width: 210px;
  transform: rotate(5deg);
  animation-delay: 0.35s;
}
.collage--c {
  bottom: 0;
  left: 32%;
  height: 230px;
  width: 220px;
  transform: rotate(-2deg);
  animation-delay: 0.5s;
}
@keyframes collage-in {
  from { opacity: 0; translate: 0 40px; }
  to { opacity: 1; translate: 0 0; }
}
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.96);
  padding: 0.6rem 0.9rem 0.6rem 0.6rem;
  box-shadow: 0 18px 40px -16px rgba(0, 26, 87, 0.55);
  animation: card-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both, bob 5s ease-in-out infinite;
}
.float-card--a {
  left: -24px;
  bottom: 120px;
  animation-delay: 0.9s, 1.7s;
}
.float-card--b {
  right: -16px;
  top: 220px;
  animation-delay: 1.1s, 2.4s;
}
.float-card--c {
  left: 44%;
  top: -12px;
  animation-delay: 1.3s, 3s;
}
@keyframes card-in {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: none; }
}
@keyframes bob {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}

.marquee {
  animation: marquee 45s linear infinite;
}
.marquee:hover {
  animation-play-state: paused;
}
@keyframes marquee {
  to { transform: translateX(-50%); }
}

.benefit {
  @apply rounded-3xl bg-white p-7 shadow-soft ring-1 ring-rosewood/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift;
}
.benefit-icon {
  @apply grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rosewood-50 to-blush text-rosewood transition duration-500 group-hover:rotate-6 group-hover:from-rosewood group-hover:to-rosewood-700 group-hover:text-white;
}

.step-badge {
  @apply relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-rosewood shadow-lift ring-1 ring-rosewood/10;
}
.step-no {
  @apply absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-gold text-[11px] font-bold text-rosewood-900 ring-2 ring-white;
}

.plan {
  @apply relative flex flex-col rounded-[28px] bg-white p-7 text-charcoal shadow-soft ring-1 ring-rosewood/10 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:p-8;
}
.plan > button {
  @apply mt-auto;
}
.plan--popular {
  @apply bg-gradient-to-br from-rosewood to-rosewood-800 text-white ring-0 lg:-translate-y-3 lg:hover:-translate-y-4;
}
.plan--chosen {
  @apply ring-2 ring-gold;
}
.price-enter-active,
.price-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.price-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.price-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.ad-card {
  @apply rounded-[28px] bg-white/5 p-6 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1.5 hover:bg-white/10;
}
.mock {
  @apply h-[112px] overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15;
}
.mock-bar {
  @apply flex gap-1 border-b border-white/10 px-3 py-2;
}
.mock-bar span {
  @apply h-1.5 w-1.5 rounded-full bg-white/30;
}
.mock-line {
  @apply h-2 rounded bg-white/20;
}
.mock-hl {
  background: linear-gradient(110deg, #00D2E6 0%, #00F2FF 40%, #00D2E6 80%);
  background-size: 200% 100%;
  animation: shimmer 2.6s linear infinite;
}
@keyframes shimmer {
  to { background-position: -200% 0; }
}

.faq {
  @apply rounded-2xl bg-white shadow-soft ring-1 ring-rosewood/5 transition;
}
.faq.is-open {
  @apply ring-rosewood/25;
}
.faq-icon {
  @apply grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush-light text-rosewood transition duration-300;
}
.faq.is-open .faq-icon {
  @apply rotate-180 bg-rosewood text-white;
}
.faq-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}
.faq.is-open .faq-body {
  grid-template-rows: 1fr;
}

.dialog {
  animation: card-in 0.4s cubic-bezier(0.34, 1.3, 0.64, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-in,
  .collage,
  .float-card,
  .marquee,
  .glow,
  .mock-hl,
  .dialog {
    animation: none;
  }
  .underline-draw path {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
