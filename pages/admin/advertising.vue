<template>
  <AdminShell title="Advertising" eyebrow="Revenue" subtitle="Banner spot bookings from “Advertise with us”.">
    <template #actions>
      <NuxtLink to="/list-your-business#advertising" target="_blank" class="adm-btn-soft"><AppIcon name="external" :size="16" />Advertising page</NuxtLink>
    </template>

    <!-- Placements -->
    <div class="grid gap-4 md:grid-cols-3">
      <article v-for="p in placements" :key="p.id" class="adm-card relative overflow-hidden p-5">
        <span class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blush-light" aria-hidden="true" />
        <div class="relative flex items-start justify-between gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-rosewood text-white"><AppIcon :name="p.icon" :size="20" /></span>
          <span class="text-right text-xs text-charcoal-soft">{{ fmtLKR(p.amount) }}<br>per month</span>
        </div>
        <h2 class="relative mt-4 font-semibold">{{ p.name }}</h2>
        <p class="relative text-xs text-charcoal-soft">{{ p.where }}</p>
        <div class="relative mt-4 rounded-xl bg-ivory p-3 text-sm ring-1 ring-charcoal/[0.06]">
          <p class="text-[11px] uppercase tracking-[0.14em] text-charcoal-soft">Running now</p>
          <p class="mt-0.5 truncate font-medium">{{ p.live?.business || 'Available' }}</p>
        </div>
        <p class="relative mt-3 text-xs text-charcoal-soft">{{ p.queue }} upcoming · {{ p.waiting }} waiting for a decision</p>
      </article>
    </div>

    <div class="no-scrollbar -mx-1 mt-6 flex gap-1 overflow-x-auto rounded-2xl bg-charcoal/[0.035] p-1">
      <button v-for="t in tabs" :key="t.id" type="button" class="adm-tab" :class="{ 'is-on': status === t.id }" @click="status = t.id">
        {{ t.label }} <span class="adm-count">{{ t.count }}</span>
      </button>
    </div>

    <section class="adm-card mt-4 overflow-hidden">
      <div v-if="filtered.length" class="overflow-x-auto">
        <table class="adm-table min-w-[860px]">
          <thead>
            <tr><th>Business</th><th>Placement</th><th>Month</th><th>Amount</th><th>Requested</th><th>Status</th><th class="text-right">Actions</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in filtered" :key="a.id">
              <td>
                <p class="font-medium">{{ a.business }}</p>
                <p class="text-xs text-charcoal-soft"><a :href="`mailto:${a.email}`" class="hover:text-rosewood">{{ a.email }}</a> · {{ a.phone }}</p>
              </td>
              <td class="text-charcoal-soft">{{ a.placementName }}</td>
              <td>{{ a.month }}</td>
              <td class="font-medium">{{ fmtLKR(a.amount) }}</td>
              <td class="text-charcoal-soft">{{ timeAgo(a.createdAt) }}</td>
              <td>
                <AdminBadge :status="a.status" />
                <p v-if="a.note" class="mt-1 max-w-[180px] truncate text-[11px] text-charcoal-soft" :title="a.note">{{ a.note }}</p>
              </td>
              <td>
                <div class="flex justify-end gap-1.5">
                  <template v-if="a.status === 'new'">
                    <button type="button" class="adm-btn-ghost !min-h-[34px] !text-red-600" @click="decline(a)">Decline</button>
                    <button type="button" class="adm-btn-success !min-h-[34px]" @click="confirmAd(a)">Confirm</button>
                  </template>
                  <button v-else-if="a.status === 'confirmed'" type="button" class="adm-btn-primary !min-h-[34px]" @click="setStatus(a, 'live')">Start running</button>
                  <button v-else-if="a.status === 'live'" type="button" class="adm-btn-ghost !min-h-[34px]" @click="setStatus(a, 'ended')">End</button>
                  <NuxtLink v-if="a.invoiceId" to="/admin/payments" class="adm-btn-ghost !min-h-[34px]"><AppIcon name="card" :size="15" />Invoice</NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminEmpty v-else icon="megaphone" title="No bookings" text="Advert requests from the “List your business” page appear here." />
    </section>
  </AdminShell>
</template>

<script setup>
import { adPlacements } from '~/data/businessPlans'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Advertising – Wedding Hub Admin' })

const site = useSiteData()
const { confirm, prompt } = useAdminDialog()
const { show } = useToast()

const status = ref('all')
const tabs = computed(() => {
  const c = (s) => siteDb.ads.filter((a) => a.status === s).length
  return [
    { id: 'all', label: 'All', count: siteDb.ads.length },
    ...['new', 'confirmed', 'live', 'ended', 'declined'].map((s) => ({ id: s, label: s[0].toUpperCase() + s.slice(1), count: c(s) }))
  ]
})
const filtered = computed(() => siteDb.ads.filter((a) => status.value === 'all' || a.status === status.value))

const placements = computed(() =>
  adPlacements.map((p) => {
    const mine = siteDb.ads.filter((a) => a.placementId === p.id)
    return {
      ...p,
      amount: AD_PRICES[p.id],
      live: mine.find((a) => a.status === 'live'),
      queue: mine.filter((a) => a.status === 'confirmed').length,
      waiting: mine.filter((a) => a.status === 'new').length
    }
  })
)

const confirmAd = async (a) => {
  const ok = await confirm({
    title: `Confirm ${a.placementName}?`,
    message: `${a.business} – ${a.month}. An invoice for ${fmtLKR(a.amount)} is issued and the advertiser is notified.`,
    tone: 'success',
    confirmLabel: 'Confirm booking'
  })
  if (!ok) return
  site.setAdStatus(a.id, 'confirmed')
  show(`${a.business}'s booking is confirmed and invoiced.`, { title: 'Booking confirmed', icon: 'check' })
}
const decline = async (a) => {
  const res = await prompt({
    title: 'Decline this booking?',
    message: `${a.business} – ${a.placementName}, ${a.month}`,
    tone: 'danger',
    confirmLabel: 'Decline',
    input: { label: 'Reason (sent to the advertiser)', required: true, presets: ['This spot is fully booked that month', 'The business has no approved listing', 'The artwork does not meet our guidelines'] }
  })
  if (!res) return
  site.setAdStatus(a.id, 'declined', res.value)
  show('The advertiser has been told.', { title: 'Booking declined', icon: 'close' })
}
const setStatus = (a, s) => {
  site.setAdStatus(a.id, s)
  show(s === 'live' ? `${a.business}'s banner is now running.` : 'The campaign has ended.', { title: 'Booking updated', icon: 'check' })
}
</script>
