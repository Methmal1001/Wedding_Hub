<template>
  <div class="min-h-screen bg-[#FAF6F4] text-charcoal">
    <!-- ============ Sidebar ============ -->
    <Transition name="fade">
      <div v-if="menuOpen" class="fixed inset-0 z-40 bg-charcoal/50 lg:hidden" @click="menuOpen = false" />
    </Transition>
    <aside
      class="sidebar fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-rosewood-900 text-white transition-transform duration-300 lg:translate-x-0"
      :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Admin navigation"
    >
      <div class="flex h-[68px] items-center gap-3 border-b border-white/10 px-5">
        <span class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold text-rosewood-900">
          <AppIcon name="rings" :size="20" />
        </span>
        <div class="leading-tight">
          <p class="font-serif text-xl font-semibold">Wedding <span class="italic text-gold-light">Hub</span></p>
          <p class="text-[10px] uppercase tracking-[0.3em] text-white/50">Admin panel</p>
        </div>
        <button type="button" class="ml-auto grid h-9 w-9 place-items-center rounded-xl text-white/70 hover:bg-white/10 lg:hidden" aria-label="Close menu" @click="menuOpen = false">
          <AppIcon name="close" :size="18" />
        </button>
      </div>

      <nav class="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        <div v-for="g in nav" :key="g.title" class="mb-4">
          <p class="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">{{ g.title }}</p>
          <NuxtLink
            v-for="item in g.items"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ 'is-on': isActive(item.to) }"
            @click="menuOpen = false"
          >
            <AppIcon :name="item.icon" :size="18" />
            <span class="flex-1">{{ item.label }}</span>
            <span v-if="item.badge" class="rounded-full bg-gold px-2 py-px text-[11px] font-bold text-rosewood-900">{{ item.badge }}</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="border-t border-white/10 p-3">
        <NuxtLink to="/" class="nav-link">
          <AppIcon name="external" :size="18" />
          <span class="flex-1">View website</span>
        </NuxtLink>
        <div class="mt-2 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-light font-semibold text-rosewood-900">{{ initials }}</span>
          <div class="min-w-0 flex-1 leading-tight">
            <p class="truncate text-sm font-medium">{{ user?.name }}</p>
            <p class="truncate text-[11px] text-white/50">{{ user?.email }}</p>
          </div>
          <button type="button" class="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white" aria-label="Log out" title="Log out" @click="logout">
            <AppIcon name="logout" :size="17" />
          </button>
        </div>
      </div>
    </aside>

    <!-- ============ Main ============ -->
    <div class="lg:pl-[264px]">
      <header class="sticky top-0 z-30 border-b border-charcoal/[0.07] bg-[#FAF6F4]/90 backdrop-blur">
        <div class="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button type="button" class="adm-icon-btn lg:hidden" aria-label="Open menu" @click="menuOpen = true">
            <AppIcon name="menu" :size="20" />
          </button>

          <!-- Quick search -->
          <div ref="searchBox" class="relative min-w-0 flex-1 sm:max-w-md">
            <AppIcon name="search" :size="17" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
            <input
              v-model="q"
              type="search"
              class="adm-input !h-10 !rounded-full !pl-9"
              placeholder="Search requests, listings, users…"
              aria-label="Search the admin panel"
              @focus="searchOpen = true"
              @keydown.esc="searchOpen = false"
            >
            <Transition name="menu">
              <div v-if="searchOpen && q.trim().length > 1" class="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-charcoal/10">
                <ul v-if="results.length" class="max-h-[60vh] overflow-y-auto py-2">
                  <li v-for="r in results" :key="r.key">
                    <NuxtLink :to="r.to" class="flex items-center gap-3 px-4 py-2.5 hover:bg-rosewood-50" @click="searchOpen = false; q = ''">
                      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blush-light text-rosewood"><AppIcon :name="r.icon" :size="15" /></span>
                      <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-medium text-charcoal">{{ r.title }}</span>
                        <span class="block truncate text-xs text-charcoal-soft">{{ r.sub }}</span>
                      </span>
                    </NuxtLink>
                  </li>
                </ul>
                <p v-else class="px-4 py-5 text-center text-sm text-charcoal-soft">No matches for “{{ q }}”.</p>
              </div>
            </Transition>
          </div>

          <div class="ml-auto flex items-center gap-1.5">
            <!-- Activity bell -->
            <div ref="bellBox" class="relative">
              <button type="button" class="adm-icon-btn relative" aria-label="Recent activity" :aria-expanded="bellOpen" @click="toggleBell">
                <AppIcon name="bell" :size="19" />
                <span v-if="unseen" class="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-rosewood px-1 text-[9px] font-bold text-white">{{ unseen > 9 ? '9+' : unseen }}</span>
              </button>
              <Transition name="menu">
                <div v-if="bellOpen" class="absolute right-0 top-12 z-40 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-charcoal/10">
                  <p class="border-b border-charcoal/10 px-4 py-3 text-sm font-semibold">Recent activity</p>
                  <ul class="max-h-[60vh] overflow-y-auto">
                    <li v-for="a in recent" :key="a.id">
                      <NuxtLink :to="a.link || '/admin/activity'" class="flex gap-3 px-4 py-3 hover:bg-rosewood-50" @click="bellOpen = false">
                        <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="a.at > seenAt ? 'bg-rosewood' : 'bg-charcoal/15'" />
                        <span class="min-w-0 text-sm leading-snug">
                          <strong class="font-semibold">{{ a.actor }}</strong> {{ a.message }}
                          <span class="mt-0.5 block text-xs text-charcoal-soft">{{ timeAgo(a.at) }}</span>
                        </span>
                      </NuxtLink>
                    </li>
                  </ul>
                  <NuxtLink to="/admin/activity" class="block border-t border-charcoal/10 px-4 py-2.5 text-center text-sm font-medium text-rosewood hover:bg-rosewood-50" @click="bellOpen = false">
                    View all activity
                  </NuxtLink>
                </div>
              </Transition>
            </div>
            <NuxtLink to="/admin/settings" class="adm-icon-btn hidden sm:grid" aria-label="Settings"><AppIcon name="settings" :size="19" /></NuxtLink>
          </div>
        </div>
      </header>

      <main class="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <!-- Page heading -->
        <div class="adm-rise flex flex-wrap items-end justify-between gap-4">
          <div class="min-w-0">
            <p v-if="eyebrow" class="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark">{{ eyebrow }}</p>
            <h1 class="font-serif text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">{{ title }}</h1>
            <p v-if="subtitle" class="mt-1 text-sm text-charcoal-soft">{{ subtitle }}</p>
          </div>
          <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
            <slot name="actions" />
          </div>
        </div>

        <div class="mt-6">
          <slot />
        </div>
      </main>
    </div>

    <AdminDialog />
    <AppToast />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' }
})

const route = useRoute()
const auth = useAuth()
const user = auth.user
const { show } = useToast()

const counts = computed(() => ({
  requests: siteDb.submissions.filter((s) => s.status === 'pending').length,
  reviews: siteDb.reviews.filter((r) => r.status === 'pending').length,
  enquiries: siteDb.enquiries.filter((e) => e.status === 'new').length,
  ads: siteDb.ads.filter((a) => a.status === 'new').length,
  payments: siteDb.payments.filter((p) => p.status === 'unpaid').length
}))

const nav = computed(() => [
  { title: 'Overview', items: [{ to: '/admin', label: 'Dashboard', icon: 'dashboard' }] },
  {
    title: 'Moderation',
    items: [
      { to: '/admin/requests', label: 'Listing requests', icon: 'inbox', badge: counts.value.requests },
      { to: '/admin/reviews', label: 'Reviews', icon: 'star', badge: counts.value.reviews },
      { to: '/admin/enquiries', label: 'Enquiries', icon: 'mail', badge: counts.value.enquiries }
    ]
  },
  {
    title: 'Directory',
    items: [
      { to: '/admin/listings', label: 'Listings', icon: 'store' },
      { to: '/admin/users', label: 'Users', icon: 'users' }
    ]
  },
  {
    title: 'Revenue',
    items: [
      { to: '/admin/advertising', label: 'Advertising', icon: 'megaphone', badge: counts.value.ads },
      { to: '/admin/payments', label: 'Payments', icon: 'card', badge: counts.value.payments }
    ]
  },
  {
    title: 'System',
    items: [
      { to: '/admin/activity', label: 'Activity log', icon: 'activity' },
      { to: '/admin/settings', label: 'Settings', icon: 'settings' }
    ]
  }
])
const isActive = (to) => (to === '/admin' ? route.path === '/admin' || route.path === '/admin/' : route.path.startsWith(to))

const initials = computed(() =>
  (user.value?.name || 'A')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
)

const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))

// ---- quick search ----
const q = ref('')
const searchOpen = ref(false)
const searchBox = ref(null)
const results = computed(() => {
  const t = q.value.trim().toLowerCase()
  if (t.length < 2) return []
  const has = (...v) => v.some((x) => String(x || '').toLowerCase().includes(t))
  const reqs = siteDb.submissions
    .filter((s) => has(s.businessName, s.ref, s.email))
    .slice(0, 4)
    .map((s) => ({ key: `r${s.ref}`, icon: 'inbox', title: s.businessName, sub: `Listing request · ${s.ref}`, to: `/admin/requests?ref=${s.ref}` }))
  const listings = adminCatalog()
    .filter((l) => has(l.name, l.owner, l.sub))
    .slice(0, 4)
    .map((l) => ({ key: `l${l.id}`, icon: 'store', title: l.name, sub: `Listing · ${l.sub}`, to: `/admin/listings?q=${encodeURIComponent(l.name)}` }))
  const users = auth
    .listUsers()
    .filter((u) => has(u.name, u.email, u.businessName))
    .slice(0, 4)
    .map((u) => ({ key: `u${u.id}`, icon: 'user', title: u.name, sub: `User · ${u.email}`, to: `/admin/users?id=${u.id}` }))
  return [...reqs, ...listings, ...users]
})

// ---- activity bell ----
const SEEN_KEY = 'wh:admin-seen'
const seenAt = ref('')
const bellOpen = ref(false)
const bellBox = ref(null)
const recent = computed(() => siteDb.activity.slice(0, 8))
const unseen = computed(() => siteDb.activity.filter((a) => a.at > seenAt.value).length)
const toggleBell = () => {
  bellOpen.value = !bellOpen.value
  if (!bellOpen.value) return
  // Mark as seen a moment later so the dots are visible while the menu opens.
  setTimeout(() => {
    seenAt.value = new Date().toISOString()
    try {
      localStorage.setItem(SEEN_KEY, seenAt.value)
    } catch {}
  }, 1500)
}

const onDocClick = (e) => {
  if (searchBox.value && !searchBox.value.contains(e.target)) searchOpen.value = false
  if (bellBox.value && !bellBox.value.contains(e.target)) bellOpen.value = false
}
onMounted(() => {
  try {
    seenAt.value = localStorage.getItem(SEEN_KEY) || ''
  } catch {}
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

const logout = async () => {
  auth.logout()
  show('You have been logged out of the admin panel.', { title: 'Logged out', icon: 'check' })
  await navigateTo('/auth/login')
}
</script>

<style scoped>
.nav-link {
  @apply relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white;
}
.nav-link.is-on {
  @apply bg-white/[0.12] font-medium text-white;
}
.nav-link.is-on::before {
  content: '';
  @apply absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-gold;
}
</style>
