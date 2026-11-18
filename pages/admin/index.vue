<template>
  <AdminShell :title="`${greeting}, ${firstName}`" eyebrow="Dashboard" :subtitle="today">
    <template #actions>
      <NuxtLink to="/admin/requests?status=pending" class="adm-btn-primary">
        <AppIcon name="inbox" :size="16" />
        Review requests
        <span v-if="pending.length" class="rounded-full bg-white/25 px-1.5 text-[11px]">{{ pending.length }}</span>
      </NuxtLink>
    </template>

    <!-- KPIs -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key figures">
      <NuxtLink
        v-for="(k, i) in kpis"
        :key="k.label"
        :to="k.to"
        class="adm-card adm-rise group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
        :style="{ animationDelay: `${i * 60}ms` }"
      >
        <span class="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-60 transition group-hover:scale-110" :class="k.blob" aria-hidden="true" />
        <div class="relative flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium uppercase tracking-[0.14em] text-charcoal-soft">{{ k.label }}</p>
            <p class="mt-2 font-serif text-4xl font-semibold leading-none text-charcoal">{{ k.value }}</p>
          </div>
          <span class="grid h-11 w-11 place-items-center rounded-2xl" :class="k.icoCls"><AppIcon :name="k.icon" :size="20" /></span>
        </div>
        <p class="relative mt-3 text-xs text-charcoal-soft">{{ k.note }}</p>
      </NuxtLink>
    </section>

    <div class="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <!-- Activity chart -->
      <section class="adm-card adm-rise p-5 sm:p-6" style="animation-delay: 120ms">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="adm-card-title">Last 14 days</h2>
            <p class="text-xs text-charcoal-soft">New listing requests and couple enquiries per day</p>
          </div>
          <div class="flex gap-4 text-xs text-charcoal-soft">
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-rosewood" />Requests</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-gold" />Enquiries</span>
          </div>
        </div>
        <div class="relative mt-6">
          <svg :viewBox="`0 0 ${W} ${H + 22}`" class="h-56 w-full" preserveAspectRatio="none" role="img" :aria-label="chartLabel">
            <line v-for="g in 4" :key="g" x1="0" :x2="W" :y1="H - (H / 4) * g" :y2="H - (H / 4) * g" stroke="#0F1B33" stroke-opacity=".06" />
            <line x1="0" :x2="W" :y1="H" :y2="H" stroke="#0F1B33" stroke-opacity=".15" />
            <g v-for="(d, i) in days" :key="d.key">
              <rect
                :x="i * slot + slot * 0.18"
                :y="H - barH(d.requests)"
                :width="slot * 0.3"
                :height="barH(d.requests)"
                rx="3"
                class="bar fill-rosewood"
                :style="{ animationDelay: `${i * 30}ms` }"
              ><title>{{ d.label }}: {{ d.requests }} requests</title></rect>
              <rect
                :x="i * slot + slot * 0.52"
                :y="H - barH(d.enquiries)"
                :width="slot * 0.3"
                :height="barH(d.enquiries)"
                rx="3"
                class="bar fill-gold"
                :style="{ animationDelay: `${i * 30 + 15}ms` }"
              ><title>{{ d.label }}: {{ d.enquiries }} enquiries</title></rect>
              <text v-if="i % 2 === 0 || i === days.length - 1" :x="i * slot + slot / 2" :y="H + 16" text-anchor="middle" class="fill-charcoal-soft text-[10px]">{{ d.short }}</text>
            </g>
          </svg>
        </div>
      </section>

      <!-- Needs attention -->
      <section class="adm-card adm-rise flex flex-col p-5 sm:p-6" style="animation-delay: 180ms">
        <h2 class="adm-card-title">Needs your attention</h2>
        <ul class="mt-4 space-y-2.5">
          <li v-for="t in todo" :key="t.label">
            <NuxtLink :to="t.to" class="flex items-center gap-3 rounded-xl p-3 ring-1 ring-charcoal/[0.07] transition hover:bg-ivory hover:ring-rosewood/20">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl" :class="t.count ? t.cls : 'bg-emerald-50 text-emerald-600'">
                <AppIcon :name="t.count ? t.icon : 'check'" :size="18" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium text-charcoal">{{ t.label }}</span>
                <span class="block text-xs text-charcoal-soft">{{ t.count ? t.note : 'All caught up' }}</span>
              </span>
              <span class="font-serif text-2xl font-semibold" :class="t.count ? 'text-charcoal' : 'text-charcoal-soft/40'">{{ t.count }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>

    <!-- Pending requests -->
    <section class="adm-card adm-rise mt-6 overflow-hidden" style="animation-delay: 220ms">
      <div class="flex flex-wrap items-center justify-between gap-3 p-5 sm:px-6">
        <div>
          <h2 class="adm-card-title">Waiting for approval</h2>
          <p class="text-xs text-charcoal-soft">Oldest first · aim to respond within {{ siteDb.settings.reviewSlaDays }} working days</p>
        </div>
        <NuxtLink to="/admin/requests" class="text-sm font-medium text-rosewood hover:underline">All requests →</NuxtLink>
      </div>
      <div v-if="pending.length" class="overflow-x-auto">
        <table class="adm-table min-w-[720px]">
          <thead>
            <tr><th>Business</th><th>Category</th><th>Plan</th><th>Waiting</th><th class="text-right">Actions</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in pendingOldest" :key="s.ref">
              <td>
                <NuxtLink :to="`/admin/requests?ref=${s.ref}`" class="flex items-center gap-3">
                  <img v-if="cover(s)" :src="cover(s)" alt="" class="h-10 w-10 rounded-xl object-cover">
                  <span v-else class="grid h-10 w-10 place-items-center rounded-xl bg-blush text-xs font-semibold text-rosewood">{{ s.businessName[0] }}</span>
                  <span>
                    <span class="block font-medium hover:text-rosewood">{{ s.businessName }}</span>
                    <span class="block text-xs text-charcoal-soft">{{ s.ref }} · {{ s.city }}</span>
                  </span>
                </NuxtLink>
              </td>
              <td class="text-charcoal-soft">{{ categoryLabel(s.category) }}</td>
              <td><AdminBadge :status="s.plan" /></td>
              <td>
                <span :class="ageDays(s) > siteDb.settings.reviewSlaDays ? 'font-semibold text-red-600' : 'text-charcoal-soft'">{{ timeAgo(s.submittedAt) }}</span>
              </td>
              <td>
                <div class="flex justify-end gap-1.5">
                  <NuxtLink :to="`/admin/requests?ref=${s.ref}`" class="adm-btn-ghost !min-h-[34px]">Review</NuxtLink>
                  <button type="button" class="adm-btn-success !min-h-[34px]" @click="actions.approve(s)">Approve</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminEmpty v-else icon="check" title="No requests waiting" text="New listing requests from vendors will appear here." />
    </section>

    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <!-- Listings by category -->
      <section class="adm-card adm-rise p-5 sm:p-6 lg:col-span-1" style="animation-delay: 260ms">
        <h2 class="adm-card-title">Listings by category</h2>
        <ul class="mt-4 space-y-3">
          <li v-for="c in byCategory" :key="c.key">
            <div class="flex justify-between text-sm"><span class="truncate">{{ c.name }}</span><span class="font-semibold">{{ c.count }}</span></div>
            <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-blush-light">
              <div class="grow-x h-full rounded-full bg-gradient-to-r from-rosewood to-gold" :style="{ width: `${(c.count / maxCat) * 100}%` }" />
            </div>
          </li>
        </ul>
      </section>

      <!-- Plans -->
      <section class="adm-card adm-rise p-5 sm:p-6" style="animation-delay: 300ms">
        <h2 class="adm-card-title">Vendor plans</h2>
        <p class="text-xs text-charcoal-soft">Approved vendor-submitted listings</p>
        <div class="mt-4 flex items-center gap-6">
          <svg viewBox="0 0 42 42" class="h-36 w-36 shrink-0 -rotate-90" role="img" :aria-label="planLabel">
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="#E3F6FF" stroke-width="6" />
            <circle
              v-for="seg in planSegments"
              :key="seg.id"
              cx="21"
              cy="21"
              r="15.9"
              fill="none"
              :stroke="seg.color"
              stroke-width="6"
              :stroke-dasharray="`${seg.pct} ${100 - seg.pct}`"
              :stroke-dashoffset="-seg.offset"
            />
          </svg>
          <ul class="space-y-2.5 text-sm">
            <li v-for="seg in planSegments" :key="seg.id" class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ background: seg.color }" />
              <span class="w-14">{{ seg.name }}</span>
              <strong>{{ seg.count }}</strong>
            </li>
          </ul>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-ivory p-3 ring-1 ring-charcoal/[0.06]">
            <p class="text-xs text-charcoal-soft">Collected</p>
            <p class="mt-0.5 font-semibold text-emerald-700">{{ fmtLKR(revenue.paid) }}</p>
          </div>
          <div class="rounded-xl bg-ivory p-3 ring-1 ring-charcoal/[0.06]">
            <p class="text-xs text-charcoal-soft">Outstanding</p>
            <p class="mt-0.5 font-semibold text-amber-700">{{ fmtLKR(revenue.unpaid) }}</p>
          </div>
        </div>
      </section>

      <!-- Recent activity -->
      <section class="adm-card adm-rise p-5 sm:p-6" style="animation-delay: 340ms">
        <div class="flex items-center justify-between">
          <h2 class="adm-card-title">Recent activity</h2>
          <NuxtLink to="/admin/activity" class="text-sm font-medium text-rosewood hover:underline">All →</NuxtLink>
        </div>
        <ol class="relative mt-4 space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-charcoal/10">
          <li v-for="a in siteDb.activity.slice(0, 6)" :key="a.id" class="relative flex gap-3 pl-0">
            <span class="relative z-[1] mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-[3px] border-white" :class="dotCls(a.type)" />
            <div class="min-w-0 text-sm leading-snug">
              <NuxtLink :to="a.link || '/admin/activity'" class="hover:text-rosewood"><strong class="font-semibold">{{ a.actor }}</strong> {{ a.message }}</NuxtLink>
              <p class="mt-0.5 text-xs text-charcoal-soft">{{ timeAgo(a.at) }}</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  </AdminShell>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Dashboard – Wedding Hub Admin' })

const auth = useAuth()
const actions = useAdminActions()

const firstName = computed(() => auth.user.value?.name.split(' ')[0] || 'Admin')
const greeting = (() => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
})()
const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const users = computed(() => {
  void siteDb.activity.length // refresh when something happens
  return auth.listUsers()
})
const pending = computed(() => siteDb.submissions.filter((s) => s.status === 'pending'))
const pendingOldest = computed(() => [...pending.value].sort((a, b) => a.submittedAt.localeCompare(b.submittedAt)).slice(0, 5))
const live = computed(() => liveCatalog())
const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString()
const ageDays = (s) => (Date.now() - new Date(s.submittedAt)) / 864e5
const cover = (s) => s.data?.photos?.[0] || ''

const revenue = computed(() => ({
  paid: siteDb.payments.filter((p) => p.status === 'paid').reduce((t, p) => t + p.amount, 0),
  unpaid: siteDb.payments.filter((p) => p.status === 'unpaid').reduce((t, p) => t + p.amount, 0)
}))

const kpis = computed(() => {
  const overdue = pending.value.filter((s) => ageDays(s) > siteDb.settings.reviewSlaDays).length
  const newUsers = users.value.filter((u) => u.createdAt > weekAgo).length
  const newEnq = siteDb.enquiries.filter((e) => e.status === 'new').length
  return [
    { label: 'Pending requests', value: pending.value.length, note: overdue ? `${overdue} waiting longer than ${siteDb.settings.reviewSlaDays} days` : 'All within the response time', icon: 'inbox', to: '/admin/requests?status=pending', icoCls: 'bg-amber-50 text-amber-600', blob: 'bg-amber-50' },
    { label: 'Live listings', value: live.value.length, note: `${live.value.filter((l) => l.vendorSubmitted).length} added by vendors · ${live.value.filter((l) => l.featured).length} featured`, icon: 'store', to: '/admin/listings', icoCls: 'bg-rosewood-50 text-rosewood', blob: 'bg-rosewood-50' },
    { label: 'Members', value: users.value.length, note: `${newUsers} joined this week`, icon: 'users', to: '/admin/users', icoCls: 'bg-sky-50 text-sky-600', blob: 'bg-sky-50' },
    { label: 'Revenue collected', value: `${Math.round(revenue.value.paid / 1000)}k`, note: `${fmtLKR(revenue.value.unpaid)} outstanding · ${newEnq} new enquiries`, icon: 'card', to: '/admin/payments', icoCls: 'bg-emerald-50 text-emerald-600', blob: 'bg-emerald-50' }
  ]
})

const todo = computed(() => [
  { label: 'Listing requests', count: pending.value.length, note: 'Approve, reject or request changes', icon: 'inbox', to: '/admin/requests?status=pending', cls: 'bg-amber-50 text-amber-600' },
  { label: 'Reviews to moderate', count: siteDb.reviews.filter((r) => r.status === 'pending').length, note: 'Publish or hide couple reviews', icon: 'star', to: '/admin/reviews', cls: 'bg-rosewood-50 text-rosewood' },
  { label: 'New advert bookings', count: siteDb.ads.filter((a) => a.status === 'new').length, note: 'Confirm or decline banner spots', icon: 'megaphone', to: '/admin/advertising', cls: 'bg-sky-50 text-sky-600' },
  { label: 'Unpaid invoices', count: siteDb.payments.filter((p) => p.status === 'unpaid').length, note: 'Follow up with vendors', icon: 'card', to: '/admin/payments?status=unpaid', cls: 'bg-red-50 text-red-600' }
])

// ---- 14-day chart ----
const W = 700
const H = 200
const days = computed(() =>
  Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    const key = d.toISOString().slice(0, 10)
    const sameDay = (iso) => iso && new Date(iso).toDateString() === d.toDateString()
    return {
      key,
      short: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      requests: siteDb.submissions.filter((s) => sameDay(s.submittedAt)).length,
      enquiries: siteDb.enquiries.filter((e) => sameDay(e.createdAt)).length
    }
  })
)
const slot = W / 14
const maxDay = computed(() => Math.max(3, ...days.value.flatMap((d) => [d.requests, d.enquiries])))
const barH = (n) => (n ? Math.max(4, (n / maxDay.value) * (H - 10)) : 0)
const chartLabel = computed(() => `Over the last 14 days: ${days.value.reduce((t, d) => t + d.requests, 0)} listing requests and ${days.value.reduce((t, d) => t + d.enquiries, 0)} enquiries.`)

// ---- categories ----
const byCategory = computed(() =>
  weddingCategories
    .map((c) => ({ key: c.key, name: c.name, count: live.value.filter((l) => l.categoryKey === c.key).length }))
    .filter((c) => c.count)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)
)
const maxCat = computed(() => Math.max(1, ...byCategory.value.map((c) => c.count)))

// ---- plans donut ----
const planSegments = computed(() => {
  const approved = siteDb.submissions.filter((s) => s.status === 'approved')
  const total = Math.max(1, approved.length)
  let offset = 0
  return [
    { id: 'free', name: 'Basic', color: '#CFD7E3' },
    { id: 'silver', name: 'Silver', color: '#0049F2' },
    { id: 'gold', name: 'Gold', color: '#00D2E6' }
  ].map((p) => {
    const count = approved.filter((s) => s.plan === p.id).length
    const pct = (count / total) * 100
    const seg = { ...p, count, pct, offset }
    offset += pct
    return seg
  })
})
const planLabel = computed(() => planSegments.value.map((s) => `${s.name}: ${s.count}`).join(', '))

const dotCls = (type) =>
  ({ listing: 'bg-rosewood', review: 'bg-gold', enquiry: 'bg-sky-500', ad: 'bg-violet-500', payment: 'bg-emerald-500', user: 'bg-charcoal' })[type] || 'bg-charcoal-soft'
</script>

<style scoped>
.bar {
  transform-box: fill-box;
  transform-origin: bottom;
  animation: bar-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes bar-grow {
  from {
    transform: scaleY(0);
  }
}
.grow-x {
  animation: grow-x 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  transform-origin: left;
}
@keyframes grow-x {
  from {
    transform: scaleX(0);
  }
}
</style>
