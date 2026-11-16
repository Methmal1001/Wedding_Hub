<template>
  <footer id="contact" class="relative scroll-mt-20 overflow-hidden bg-[#2a171e] text-white/70">
    <div aria-hidden="true" class="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-rosewood/30 blur-3xl" />

    <div class="container-site relative pt-16 sm:pt-20">
      <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.5fr_0.9fr_1.1fr] lg:gap-10">
        <!-- Brand -->
        <div>
          <BrandLogo light />
          <p class="mt-5 text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Sri Lanka's No. 1 Wedding Website</p>
          <p class="mt-3 max-w-sm text-sm leading-relaxed">
            Wedding Hub offers you hundreds of wedding vendors of all categories, enabling you to find the perfect
            match that will make your dream wedding a reality.
          </p>
          <div class="mt-6 flex flex-wrap gap-2.5">
            <a
              v-for="s in socials"
              :key="s.name"
              href="#"
              class="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-blush hover:bg-blush hover:text-rosewood-800"
              :aria-label="`Wedding Hub on ${s.name}`"
              :title="s.name"
              @click.prevent="comingSoon(`Our ${s.name} page`)"
            >
              <AppIcon :name="s.icon" :size="18" />
            </a>
          </div>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="footer-title">Categories</h3>
          <ul class="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 text-sm">
            <li v-for="c in weddingCategories" :key="c.key">
              <NuxtLink :to="catalogLink({ category: c.key })" class="footer-link">{{ c.name }}</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Menu -->
        <div>
          <h3 class="footer-title">Wedding Hub</h3>
          <ul class="mt-5 space-y-2.5 text-sm">
            <li v-for="l in menu" :key="l.label">
              <a :href="l.to || (l.target ? `#${l.target}` : '#')" class="footer-link" @click.prevent="follow(l)">{{ l.label }}</a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="footer-title">Contact us</h3>
          <ul class="mt-5 space-y-4 text-sm">
            <li class="flex items-start gap-3">
              <AppIcon name="pin" :size="18" class="mt-0.5 shrink-0 text-gold" />
              <span>No. 42, Galle Road,<br>Colombo 03, Sri Lanka</span>
            </li>
            <li class="flex items-start gap-3">
              <AppIcon name="phone" :size="18" class="mt-0.5 shrink-0 text-gold" />
              <a href="tel:+94112345678" class="footer-link">+94 11 234 5678</a>
            </li>
            <li class="flex items-start gap-3">
              <AppIcon name="mail" :size="18" class="mt-0.5 shrink-0 text-gold" />
              <a href="mailto:hello@weddinghub.lk" class="footer-link">hello@weddinghub.lk</a>
            </li>
            <li class="flex items-start gap-3">
              <AppIcon name="calendar" :size="18" class="mt-0.5 shrink-0 text-gold" />
              <span>Mon – Sat, 9.00 am – 6.00 pm</span>
            </li>
          </ul>
          <button type="button" class="btn-gold mt-6 !min-h-[44px] !px-6 text-[13px]" @click="follow({ target: 'business' })">
            <AppIcon name="store" :size="16" />
            Add Your Listing
          </button>
        </div>
      </div>

      <!-- Quick Links: every sub-category -->
      <div class="mt-14 border-t border-white/10 pt-10">
        <h3 class="footer-title">Quick Links</h3>
        <ul class="mt-5 flex flex-wrap gap-x-1 gap-y-2 text-[13px]">
          <li v-for="link in quickLinks" :key="link.sub" class="flex items-center">
            <NuxtLink :to="catalogLink({ category: link.category, sub: link.sub })" class="quick-link">{{ link.sub }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs sm:flex-row">
        <p>Copyright © 2026 Wedding Hub. All Rights Reserved.</p>
        <div class="flex gap-6">
          <a href="#" class="footer-link" @click.prevent="comingSoon('Our Privacy Policy')">Privacy Policy</a>
          <a href="#" class="footer-link" @click.prevent="comingSoon('Our Terms & Conditions')">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'
import { catalogLink } from '~/composables/useCatalog'

const { comingSoon } = useToast()
const scrollTo = useScrollTo()

// Social platforms, as listed by weddingdirectory.lk
const socials = [
  { name: 'Facebook', icon: 'facebook' },
  { name: 'Blog', icon: 'blog' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'X (Twitter)', icon: 'x' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Pinterest', icon: 'pinterest' }
]

const menu = [
  { label: 'Home', target: 'home' },
  { label: 'Vendor Catalog', to: '/catalog' },
  { label: 'Blog', soon: 'The Wedding Hub blog' },
  { label: 'Wedding Ideas', target: 'inspiration' },
  { label: 'Advertise with us', target: 'business' },
  { label: 'Are you a vendor?', target: 'business' },
  { label: 'Log in', to: '/auth/login' },
  { label: 'Create an account', to: '/auth/register' }
]

const quickLinks = weddingCategories.flatMap((c) => c.subcategories.map((sub) => ({ category: c.key, sub })))

const follow = (l) => {
  if (l.soon) comingSoon(l.soon)
  else if (l.to) navigateTo(l.to)
  else scrollTo(l.target)
}
</script>

<style scoped>
.footer-title {
  @apply font-serif text-xl font-semibold text-white;
}
.footer-link {
  @apply transition-colors duration-300 hover:text-blush;
}
.quick-link {
  @apply rounded-full border border-white/10 px-3 py-1.5 text-white/65 transition-all duration-300 hover:border-blush/60 hover:bg-white/5 hover:text-blush;
}
</style>
