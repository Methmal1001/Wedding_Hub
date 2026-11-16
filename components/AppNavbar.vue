<template>
  <!--
    Fixed header: always visible while scrolling. The top bar folds away once
    the page scrolls; the spacer keeps page content from sliding underneath.
  -->
  <div aria-hidden="true" class="h-[108px]" />

  <header
    class="fixed inset-x-0 top-0 z-50 transition-shadow duration-500"
    :class="{ 'shadow-header': scrolled || openMenu }"
    @keydown.esc="closeAll"
  >
    <!-- Top bar -->
    <div
      class="overflow-hidden bg-rosewood text-white transition-[height] duration-500"
      :class="scrolled ? 'h-0' : 'h-9'"
    >
      <div class="container-site flex h-9 items-center justify-between gap-4 text-[11px] tracking-[0.18em]">
        <p class="truncate uppercase">Sri Lanka's No. 1 Wedding Website</p>
        <div class="hidden items-center gap-5 uppercase sm:flex">
          <NuxtLink v-if="user" to="/profile" class="topbar-link">
            <AppIcon name="user" :size="14" />
            Hi, {{ firstName }}
          </NuxtLink>
          <template v-else>
            <NuxtLink to="/auth/login" class="topbar-link">
              <AppIcon name="user" :size="14" />
              Log in
            </NuxtLink>
            <span class="h-3 w-px bg-white/30" />
            <NuxtLink to="/auth/register" class="topbar-link">Sign up</NuxtLink>
          </template>
          <span class="h-3 w-px bg-white/30" />
          <button type="button" class="topbar-link" @click="go({ to: '/list-your-business' })">
            <AppIcon name="store" :size="14" />
            Are you a vendor?
          </button>
        </div>
      </div>
    </div>

    <!-- Main bar -->
    <div class="relative border-b border-rosewood/10 bg-ivory/95 backdrop-blur-md">
      <nav class="container-site flex h-[72px] items-center justify-between gap-4" aria-label="Main">
        <BrandLogo />

        <!-- Desktop menu -->
        <ul class="hidden items-center xl:flex">
          <li v-for="item in menu" :key="item.label" class="relative" @mouseenter="hoverOpen(item)" @mouseleave="hoverClose(item)">
            <button
              v-if="item.dropdown"
              type="button"
              class="nav-link flex items-center gap-1"
              :class="{ 'is-active': activeLink === item.label || openMenu === item.dropdown }"
              :aria-expanded="openMenu === item.dropdown"
              aria-haspopup="true"
              @click="toggle(item.dropdown)"
            >
              {{ item.label }}
              <AppIcon name="chevronDown" :size="14" class="transition-transform duration-300" :class="{ 'rotate-180': openMenu === item.dropdown }" />
            </button>
            <a
              v-else
              :href="item.to || `#${item.target}`"
              class="nav-link"
              :class="{ 'is-active': activeLink === item.label }"
              @click.prevent="go(item)"
            >
              {{ item.label }}
            </a>

            <!-- Wedding Venues dropdown -->
            <Transition name="menu">
              <div
                v-if="item.dropdown === 'venues' && openMenu === 'venues'"
                class="absolute left-1/2 top-full z-40 w-72 -translate-x-1/2 pt-3"
              >
                <ul class="rounded-2xl bg-white p-2 shadow-lift ring-1 ring-rosewood/10">
                  <li v-for="sub in venuesCategory.subcategories" :key="sub">
                    <NuxtLink :to="catalogLink({ category: 'venues', sub })" class="dropdown-link" @click="closeAll">
                      {{ sub }}
                      <AppIcon name="arrowRight" :size="14" class="opacity-40" />
                    </NuxtLink>
                  </li>
                  <li class="mt-1 border-t border-rosewood/10 pt-1">
                    <a href="#venues" class="dropdown-link !font-semibold !text-rosewood" @click.prevent="go({ target: 'venues' })">
                      Signature venues
                      <AppIcon name="sparkles" :size="14" />
                    </a>
                  </li>
                  <li>
                    <NuxtLink :to="catalogLink({ category: 'venues' })" class="dropdown-link !font-semibold !text-rosewood" @click="closeAll">
                      Browse all venues
                      <AppIcon name="arrowRight" :size="14" />
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </Transition>
          </li>
        </ul>

        <!-- Right actions -->
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          <button type="button" class="icon-btn" aria-label="Search the directory" @click="focusSearch">
            <AppIcon name="search" :size="20" />
          </button>

          <button type="button" class="btn-primary btn-shine hidden !min-h-[42px] whitespace-nowrap !px-5 lg:inline-flex" @click="go({ to: '/list-your-business' })">
            <AppIcon name="store" :size="17" />
            List Your Business
          </button>

          <!-- Account: log-in link, or avatar with a menu when signed in -->
          <NuxtLink v-if="!user" to="/auth/login" class="icon-btn relative" aria-label="Log in or create an account">
            <AppIcon name="user" :size="20" />
            <span
              v-if="favourites.length"
              :key="favourites.length"
              class="animate-heart-pop absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white ring-2 ring-ivory"
            >
              {{ favourites.length }}
            </span>
          </NuxtLink>
          <div v-else class="relative">
            <button
              type="button"
              class="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full ring-2 transition hover:ring-rosewood"
              :class="openMenu === 'account' ? 'ring-rosewood' : 'ring-rosewood/25'"
              :aria-expanded="openMenu === 'account'"
              aria-haspopup="menu"
              :aria-label="`Account menu for ${user.name}`"
              @click="toggle('account')"
            >
              <img v-if="user.avatar" :src="user.avatar" alt="" class="h-full w-full object-cover">
              <span v-else class="grid h-full w-full place-items-center bg-gradient-to-br from-rosewood to-rosewood-800 font-serif text-base font-semibold text-white">{{ userInitials }}</span>
            </button>
            <span
              v-if="favourites.length"
              :key="favourites.length"
              class="animate-heart-pop pointer-events-none absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white ring-2 ring-ivory"
            >
              {{ favourites.length }}
            </span>
            <Transition name="menu">
              <div
                v-if="openMenu === 'account'"
                class="absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-rosewood/10"
                role="menu"
              >
                <div class="bg-gradient-to-br from-rosewood to-rosewood-800 px-4 py-3.5 text-white">
                  <p class="truncate font-serif text-lg font-semibold">{{ user.name }}</p>
                  <p class="truncate text-xs text-white/75">{{ user.email }}</p>
                </div>
                <ul class="p-1.5 text-sm">
                  <li v-for="l in accountLinks" :key="l.label" role="none">
                    <NuxtLink :to="l.to" role="menuitem" class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-charcoal transition hover:bg-rosewood-50 hover:text-rosewood" @click="closeAll">
                      <AppIcon :name="l.icon" :size="16" class="text-rosewood" />
                      {{ l.label }}
                      <span v-if="l.count" class="ml-auto rounded-full bg-blush-light px-2 text-[11px] text-rosewood-700">{{ l.count }}</span>
                    </NuxtLink>
                  </li>
                  <li role="none" class="mt-1 border-t border-rosewood/10 pt-1">
                    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-charcoal transition hover:bg-rosewood-50 hover:text-rosewood" @click="doLogout">
                      <AppIcon name="arrowRight" :size="16" class="text-rosewood" />
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>

          <!-- Hamburger -->
          <button
            type="button"
            class="icon-btn !grid xl:!hidden"
            :aria-expanded="mobileOpen"
            aria-controls="mobile-menu"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
            @click="mobileOpen = !mobileOpen"
          >
            <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="22" />
          </button>
        </div>
      </nav>

      <!-- Categories mega menu (desktop) -->
      <Transition name="menu">
        <div
          v-if="openMenu === 'categories'"
          class="absolute inset-x-0 top-full z-40 hidden xl:block"
          @mouseenter="cancelClose"
          @mouseleave="hoverClose({ dropdown: 'categories' })"
        >
          <div class="container-site pt-3">
            <div class="mega grid grid-cols-[270px_1fr_300px] overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-rosewood/10">
              <!-- Category list -->
              <ul class="mega-scroll border-r border-rosewood/10 bg-blush-light/50 p-2">
                <li v-for="cat in weddingCategories" :key="cat.key">
                  <NuxtLink
                    :to="catalogLink({ category: cat.key })"
                    class="mega-cat"
                    :class="{ 'is-on': megaCat.key === cat.key }"
                    @mouseenter="megaKey = cat.key"
                    @focus="megaKey = cat.key"
                    @click="closeAll"
                  >
                    <span class="truncate">{{ cat.name }}</span>
                    <AppIcon name="chevronDown" :size="14" class="-rotate-90 shrink-0 opacity-60" />
                  </NuxtLink>
                </li>
              </ul>

              <!-- Sub-categories of the highlighted category -->
              <div class="mega-scroll p-7">
                <p class="eyebrow">{{ megaCat.vendorCount }} vendors</p>
                <h3 class="mt-2 font-serif text-3xl font-semibold text-charcoal">{{ megaCat.name }}</h3>
                <p class="mt-1 text-sm text-charcoal-soft">{{ megaCat.blurb }}</p>
                <ul class="mt-5 grid grid-cols-2 gap-x-6 gap-y-0.5">
                  <li v-for="sub in megaCat.subcategories" :key="sub">
                    <NuxtLink :to="catalogLink({ category: megaCat.key, sub })" class="mega-sub" @click="closeAll">
                      <span class="h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {{ sub }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <!-- Feature card -->
              <NuxtLink
                :to="catalogLink({ category: megaCat.key })"
                class="group relative isolate m-3 flex flex-col justify-end overflow-hidden rounded-2xl p-6 text-white"
                @click="closeAll"
              >
                <img :src="megaCat.image" :alt="megaCat.name" class="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105">
                <span class="absolute inset-0 -z-10 bg-gradient-to-t from-[#241319]/90 via-[#241319]/30 to-transparent" />
                <span class="font-serif text-2xl font-semibold leading-tight">{{ megaCat.name }}</span>
                <span class="mt-2 inline-flex items-center gap-1.5 text-sm text-blush">
                  Explore all
                  <AppIcon name="arrowRight" :size="15" class="transition-transform group-hover:translate-x-1" />
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Mobile / tablet menu -->
      <Transition name="menu">
        <div
          v-if="mobileOpen"
          id="mobile-menu"
          class="absolute inset-x-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-t border-rosewood/10 bg-ivory shadow-lift xl:hidden"
        >
          <ul class="container-site flex flex-col py-3">
            <li v-for="item in menu" :key="item.label" class="border-b border-rosewood/5">
              <!-- Accordion items -->
              <template v-if="item.dropdown">
                <button
                  type="button"
                  class="mobile-link"
                  :aria-expanded="mobileSection === item.dropdown"
                  @click="mobileSection = mobileSection === item.dropdown ? '' : item.dropdown"
                >
                  {{ item.label }}
                  <AppIcon name="chevronDown" :size="18" class="text-gold transition-transform" :class="{ 'rotate-180': mobileSection === item.dropdown }" />
                </button>

                <ul v-if="mobileSection === 'categories' && item.dropdown === 'categories'" class="pb-3">
                  <li v-for="cat in weddingCategories" :key="cat.key">
                    <button type="button" class="mobile-sub" @click="mobileCat = mobileCat === cat.key ? '' : cat.key">
                      {{ cat.name }}
                      <AppIcon name="chevronDown" :size="15" class="transition-transform" :class="{ 'rotate-180': mobileCat === cat.key }" />
                    </button>
                    <ul v-if="mobileCat === cat.key" class="mb-2 ml-4 border-l border-gold/40 pl-3">
                      <li>
                        <NuxtLink :to="catalogLink({ category: cat.key })" class="mobile-leaf !font-semibold !text-rosewood" @click="closeAll">
                          All {{ cat.name }}
                        </NuxtLink>
                      </li>
                      <li v-for="sub in cat.subcategories" :key="sub">
                        <NuxtLink :to="catalogLink({ category: cat.key, sub })" class="mobile-leaf" @click="closeAll">{{ sub }}</NuxtLink>
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul v-if="mobileSection === 'venues' && item.dropdown === 'venues'" class="pb-3">
                  <li v-for="sub in venuesCategory.subcategories" :key="sub">
                    <NuxtLink :to="catalogLink({ category: 'venues', sub })" class="mobile-leaf ml-1" @click="closeAll">{{ sub }}</NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="catalogLink({ category: 'venues' })" class="mobile-leaf ml-1 !font-semibold !text-rosewood" @click="closeAll">
                      Browse all venues
                    </NuxtLink>
                  </li>
                </ul>
              </template>

              <a v-else :href="item.to || `#${item.target}`" class="mobile-link" @click.prevent="go(item)">
                {{ item.label }}
                <AppIcon name="arrowRight" :size="18" class="text-gold" />
              </a>
            </li>

            <li class="grid grid-cols-2 gap-3 pt-5">
              <NuxtLink v-if="user" to="/profile" class="btn-outline" @click="closeAll">
                <AppIcon name="user" :size="16" />
                My profile
              </NuxtLink>
              <NuxtLink v-else to="/auth/login" class="btn-outline" @click="closeAll">
                <AppIcon name="user" :size="16" />
                Log in
              </NuxtLink>
              <button type="button" class="btn-primary" @click="go({ to: '/list-your-business' })">
                <AppIcon name="store" :size="16" />
                Are you a vendor?
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'
import { catalogLink, findSubBySlug } from '~/composables/useCatalog'

const scrolled = ref(false)
const spyLink = ref('Home')
const openMenu = ref('') // '' | 'categories' | 'venues'
const megaKey = ref(weddingCategories[0].key)
const mobileOpen = ref(false)
const mobileSection = ref('')
const mobileCat = ref('')

const route = useRoute()
const scrollTo = useScrollTo()
const { comingSoon } = useToast()
const { favourites } = useFavourites()
const auth = useAuth()
const user = auth.user
const firstName = computed(() => (user.value?.name || '').split(' ')[0])
const userInitials = computed(() =>
  (user.value?.name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
)
const accountLinks = computed(() => [
  ...(user.value?.role === 'admin' ? [{ label: 'Admin panel', to: '/admin', icon: 'dashboard' }] : []),
  { label: 'My profile', to: '/profile', icon: 'user' },
  { label: 'Saved vendors', to: '/profile?tab=saved', icon: 'heart', count: favourites.value.length },
  { label: 'My enquiries', to: '/profile?tab=enquiries', icon: 'mail', count: user.value?.enquiries?.length || 0 },
  { label: 'Settings', to: '/profile?tab=settings', icon: 'shield' }
])
const doLogout = () => {
  closeAll()
  auth.logout()
  useToast().show('You have been logged out. See you soon!', { title: 'Logged out', icon: 'heart' })
  if (route.path.startsWith('/profile')) navigateTo('/')
}

const venuesCategory = weddingCategories.find((c) => c.key === 'venues')
const megaCat = computed(() => weddingCategories.find((c) => c.key === megaKey.value) || weddingCategories[0])

// Menu structure follows weddingdirectory.lk: Home, Categories, Venues, Blog,
// Advertise with us, Contact us.
const menu = [
  { label: 'Home', target: 'home' },
  { label: 'Categories', dropdown: 'categories' },
  { label: 'Wedding Venues', dropdown: 'venues' },
  { label: 'Blog', soon: 'The Wedding Hub blog' },
  { label: 'Advertise with us', to: '/list-your-business#advertising' },
  { label: 'Contact us', target: 'contact' }
]

const onCatalog = computed(() => ['/catalog', '/sub-category/', '/listing/'].some((p) => route.path.startsWith(p)))
const activeLink = computed(() => {
  if (route.path.startsWith('/list-your-business')) return 'Advertise with us'
  if (onCatalog.value) {
    const slug = route.params.slug || route.params.sub
    const key = slug ? findSubBySlug(String(slug))?.category.key : route.query.category
    return key === 'venues' ? 'Wedding Venues' : 'Categories'
  }
  return spyLink.value
})

// --- Dropdown behaviour: hover with a short close delay, click to toggle ---
let closeTimer = null
const cancelClose = () => clearTimeout(closeTimer)
const hoverOpen = (item) => {
  if (!item.dropdown) return
  cancelClose()
  openMenu.value = item.dropdown
}
const hoverClose = (item) => {
  if (!item.dropdown) return
  cancelClose()
  closeTimer = setTimeout(() => {
    if (openMenu.value === item.dropdown) openMenu.value = ''
  }, 180)
}
const toggle = (key) => {
  cancelClose()
  openMenu.value = openMenu.value === key ? '' : key
}
const closeAll = () => {
  openMenu.value = ''
  mobileOpen.value = false
  mobileSection.value = ''
  mobileCat.value = ''
}

const go = (item) => {
  closeAll()
  if (item.soon) comingSoon(item.soon)
  else if (item.to) navigateTo(item.to)
  else scrollTo(item.target)
}

const focusSearch = () => {
  closeAll()
  if (onCatalog.value) {
    document.querySelector('main input[type=search]')?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  scrollTo('home')
  setTimeout(() => document.getElementById('search-what')?.focus({ preventScroll: true }), 500)
}

// Close menus whenever the route changes
watch(() => route.fullPath, closeAll)

// --- Scroll state & scroll-spy (homepage) ---
const spySections = [
  ['Home', 'home'],
  ['Wedding Venues', 'venues'],
  ['Advertise with us', 'business'],
  ['Contact us', 'contact']
]
let ticking = false
const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 24
    const probe = window.scrollY + 160
    let current = 'Home'
    for (const [label, id] of spySections) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top + window.scrollY <= probe) current = label
    }
    spyLink.value = current
    ticking = false
  })
}

const onDocClick = (e) => {
  if (!e.target.closest('header')) openMenu.value = ''
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocClick)
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick)
  clearTimeout(closeTimer)
})
</script>

<style scoped>
.shadow-header {
  box-shadow: 0 10px 30px -14px rgba(110, 52, 70, 0.25);
}
.icon-btn {
  @apply grid h-11 w-11 place-items-center rounded-full text-charcoal transition-all duration-300 hover:bg-rosewood/5 hover:text-rosewood;
}
.topbar-link {
  @apply inline-flex items-center gap-1.5 uppercase text-white/90 transition hover:text-white;
}

.nav-link {
  @apply relative whitespace-nowrap px-3 py-2 text-[14px] font-medium tracking-wide text-charcoal transition-colors duration-300 hover:text-rosewood 2xl:px-4;
}
.nav-link.is-active {
  @apply text-rosewood;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  height: 1.5px;
  width: 0;
  background: linear-gradient(90deg, #c9a86a, #b4637a);
  transition: width 0.35s ease, left 0.35s ease;
}
.nav-link:hover::after,
.nav-link.is-active::after {
  left: 0.75rem;
  width: calc(100% - 1.5rem);
}

.dropdown-link {
  @apply flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-charcoal transition hover:bg-rosewood-50 hover:text-rosewood;
}

/* Mega menu */
.mega-scroll {
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}
.mega-cat {
  @apply flex items-center justify-between gap-2 rounded-xl px-3.5 py-2 text-[14px] text-charcoal transition;
}
.mega-cat.is-on {
  @apply bg-white font-semibold text-rosewood shadow-soft;
}
.mega-sub {
  @apply flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-charcoal-soft transition hover:bg-rosewood-50 hover:text-rosewood;
}

/* Mobile */
.mobile-link {
  @apply flex w-full items-center justify-between py-4 font-serif text-xl font-semibold text-charcoal transition-colors hover:text-rosewood;
}
.mobile-sub {
  @apply flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-[15px] font-medium text-charcoal hover:bg-rosewood-50;
}
.mobile-leaf {
  @apply block rounded-lg px-2 py-2 text-sm text-charcoal-soft hover:bg-rosewood-50 hover:text-rosewood;
}
</style>
