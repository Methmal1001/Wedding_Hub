<template>
  <AdminShell title="Activity log" eyebrow="System" subtitle="Everything vendors, couples and admins have done, newest first.">
    <template #actions>
      <button type="button" class="adm-btn-ghost" @click="exportCsv"><AppIcon name="download" :size="16" />Export CSV</button>
    </template>

    <div class="flex flex-wrap items-center gap-2">
      <div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-2xl bg-charcoal/[0.035] p-1">
        <button v-for="t in types" :key="t.id" type="button" class="adm-tab" :class="{ 'is-on': type === t.id }" @click="type = t.id">{{ t.label }}</button>
      </div>
      <div class="relative min-w-[200px] flex-1">
        <AppIcon name="search" :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input v-model="q" type="search" class="adm-input !pl-9" placeholder="Search activity" aria-label="Search activity">
      </div>
    </div>

    <section class="adm-card mt-4 p-5 sm:p-6">
      <template v-if="groups.length">
        <div v-for="g in groups" :key="g.day" class="mb-6 last:mb-0">
          <h2 class="sticky top-[68px] z-[1] -mx-2 mb-3 bg-white/95 px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-soft backdrop-blur">{{ g.day }}</h2>
          <ol class="space-y-1">
            <li v-for="a in g.items" :key="a.id">
              <NuxtLink :to="a.link || '#'" class="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-rosewood-50/60">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl" :class="typeCls(a.type)"><AppIcon :name="typeIcon(a.type)" :size="16" /></span>
                <span class="min-w-0 flex-1 text-sm leading-snug">
                  <strong class="font-semibold">{{ a.actor }}</strong> {{ a.message }}
                  <span class="mt-0.5 block text-xs text-charcoal-soft">{{ new Date(a.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }} · {{ a.type }}</span>
                </span>
              </NuxtLink>
            </li>
          </ol>
        </div>
      </template>
      <AdminEmpty v-else icon="activity" title="No activity" text="Nothing matches these filters." />
    </section>
  </AdminShell>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Activity log – Wedding Hub Admin' })

const type = ref('all')
const q = ref('')
const types = [
  { id: 'all', label: 'All' },
  { id: 'listing', label: 'Listings' },
  { id: 'user', label: 'Users' },
  { id: 'review', label: 'Reviews' },
  { id: 'enquiry', label: 'Enquiries' },
  { id: 'ad', label: 'Adverts' },
  { id: 'payment', label: 'Payments' },
  { id: 'settings', label: 'Settings' }
]
const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  return siteDb.activity.filter((a) => (type.value === 'all' || a.type === type.value) && (!t || `${a.actor} ${a.message}`.toLowerCase().includes(t)))
})
const dayLabel = (iso) => {
  const d = new Date(iso)
  const today = new Date()
  const y = new Date()
  y.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}
const groups = computed(() => {
  const map = new Map()
  for (const a of filtered.value) {
    const k = dayLabel(a.at)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(a)
  }
  return [...map].map(([day, items]) => ({ day, items }))
})
const typeIcon = (t) => ({ listing: 'inbox', user: 'user', review: 'star', enquiry: 'mail', ad: 'megaphone', payment: 'card', settings: 'settings' })[t] || 'activity'
const typeCls = (t) =>
  ({ listing: 'bg-rosewood-50 text-rosewood', user: 'bg-charcoal/[0.06] text-charcoal', review: 'bg-gold-light/40 text-gold-dark', enquiry: 'bg-sky-50 text-sky-600', ad: 'bg-violet-50 text-violet-600', payment: 'bg-emerald-50 text-emerald-600' })[t] ||
  'bg-charcoal/[0.06] text-charcoal-soft'
const exportCsv = () =>
  downloadCsv(`activity-${new Date().toISOString().slice(0, 10)}.csv`, [['Time', 'Type', 'Who', 'What'], ...filtered.value.map((a) => [a.at, a.type, a.actor, a.message])])
</script>
