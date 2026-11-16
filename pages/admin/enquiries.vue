<template>
  <AdminShell title="Enquiries" eyebrow="Moderation" subtitle="Messages couples send to vendors from listing pages.">
    <template #actions>
      <button type="button" class="adm-btn-ghost" @click="exportCsv"><AppIcon name="download" :size="16" />Export CSV</button>
    </template>

    <div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-2xl bg-charcoal/[0.035] p-1">
      <button v-for="t in tabs" :key="t.id" type="button" class="adm-tab" :class="{ 'is-on': status === t.id }" @click="status = t.id">
        {{ t.label }} <span class="adm-count">{{ t.count }}</span>
      </button>
    </div>
    <div class="relative mt-4">
      <AppIcon name="search" :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
      <input v-model="q" type="search" class="adm-input !pl-9" placeholder="Search by couple, vendor, e-mail or message" aria-label="Search enquiries">
    </div>

    <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <!-- List -->
      <section class="adm-card overflow-hidden">
        <ul v-if="paged.length" class="divide-y divide-charcoal/[0.06]">
          <li v-for="e in paged" :key="e.id">
            <button
              type="button"
              class="flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-rosewood-50/50"
              :class="{ 'bg-rosewood-50/70': current?.id === e.id }"
              @click="selectedId = e.id"
            >
              <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="e.status === 'new' ? 'bg-rosewood' : 'bg-transparent'" />
              <span class="min-w-0 flex-1">
                <span class="flex items-center justify-between gap-2">
                  <span class="truncate text-sm" :class="e.status === 'new' ? 'font-semibold' : 'font-medium'">{{ e.name }}</span>
                  <span class="shrink-0 text-[11px] text-charcoal-soft">{{ timeAgo(e.createdAt) }}</span>
                </span>
                <span class="block truncate text-xs text-rosewood">to {{ e.vendorName }}</span>
                <span class="mt-0.5 block truncate text-xs text-charcoal-soft">{{ e.message }}</span>
              </span>
            </button>
          </li>
        </ul>
        <AdminEmpty v-else icon="mail" title="No enquiries" text="Enquiries from listing pages appear here." />
        <AdminPager v-model:page="page" :size="PAGE" :total="filtered.length" />
      </section>

      <!-- Detail -->
      <section class="adm-card p-5 sm:p-6 lg:sticky lg:top-[88px] lg:self-start">
        <template v-if="current">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="font-serif text-2xl font-semibold">{{ current.name }}</h2>
              <p class="text-sm text-charcoal-soft">
                to <NuxtLink v-if="current.link" :to="current.link" target="_blank" class="font-medium text-rosewood hover:underline">{{ current.vendorName }}</NuxtLink><span v-else>{{ current.vendorName }}</span>
              </p>
            </div>
            <AdminBadge :status="current.status" />
          </div>
          <dl class="mt-5 grid gap-3 rounded-2xl bg-ivory p-4 text-sm ring-1 ring-charcoal/[0.06] sm:grid-cols-2">
            <div><dt class="text-xs text-charcoal-soft">Phone</dt><dd class="font-medium"><a :href="`tel:${current.phone.replace(/[^\d+]/g, '')}`" class="hover:text-rosewood">{{ current.phone }}</a></dd></div>
            <div><dt class="text-xs text-charcoal-soft">E-mail</dt><dd class="break-all font-medium"><a :href="`mailto:${current.email}`" class="hover:text-rosewood">{{ current.email }}</a></dd></div>
            <div><dt class="text-xs text-charcoal-soft">Wedding date</dt><dd class="font-medium">{{ fmtDate(current.weddingDate) }}</dd></div>
            <div><dt class="text-xs text-charcoal-soft">Received</dt><dd class="font-medium">{{ fmtDateTime(current.createdAt) }}</dd></div>
          </dl>
          <p class="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-soft">Message</p>
          <p class="mt-2 whitespace-pre-line rounded-2xl bg-white p-4 text-sm leading-relaxed ring-1 ring-charcoal/[0.07]">{{ current.message }}</p>

          <div class="mt-6 flex flex-wrap gap-2">
            <a :href="replyLink" class="adm-btn-primary"><AppIcon name="mail" :size="16" />Reply</a>
            <button v-if="current.status !== 'forwarded'" type="button" class="adm-btn-soft" @click="setStatus('forwarded')">Mark forwarded to vendor</button>
            <button v-if="current.status !== 'closed'" type="button" class="adm-btn-ghost" @click="setStatus('closed')">Close</button>
            <button v-if="current.status !== 'new'" type="button" class="adm-btn-ghost" @click="setStatus('new')">Mark as new</button>
            <button v-if="current.status !== 'spam'" type="button" class="adm-btn-ghost !text-red-600" @click="setStatus('spam')">Spam</button>
            <button type="button" class="adm-icon-btn ml-auto hover:!bg-red-50 hover:!text-red-600" aria-label="Delete enquiry" title="Delete" @click="remove"><AppIcon name="trash" :size="17" /></button>
          </div>
        </template>
        <AdminEmpty v-else icon="mail" title="Select an enquiry" text="Choose a message on the left to read it." />
      </section>
    </div>
  </AdminShell>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Enquiries – Wedding Hub Admin' })

const site = useSiteData()
const { confirm } = useAdminDialog()
const { show } = useToast()

const PAGE = 10
const status = ref('all')
const q = ref('')
const page = ref(1)
const selectedId = ref('')
watch([status, q], () => (page.value = 1))

const tabs = computed(() => {
  const c = (s) => siteDb.enquiries.filter((e) => e.status === s).length
  return [
    { id: 'all', label: 'All', count: siteDb.enquiries.length },
    { id: 'new', label: 'New', count: c('new') },
    { id: 'forwarded', label: 'Forwarded', count: c('forwarded') },
    { id: 'closed', label: 'Closed', count: c('closed') },
    { id: 'spam', label: 'Spam', count: c('spam') }
  ]
})
const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  return siteDb.enquiries.filter(
    (e) => (status.value === 'all' || e.status === status.value) && (!t || [e.name, e.vendorName, e.email, e.message].some((v) => String(v || '').toLowerCase().includes(t)))
  )
})
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE, page.value * PAGE))
const current = computed(() => siteDb.enquiries.find((e) => e.id === selectedId.value) || paged.value[0] || null)

const replyLink = computed(() => {
  const e = current.value
  return `mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry to ${e.vendorName}`)}&body=${encodeURIComponent(`Hello ${e.name},\n\n`)}`
})
const setStatus = (s) => {
  site.setEnquiryStatus(current.value.id, s)
  show(`Enquiry marked as ${s}.`, { title: 'Updated', icon: 'check' })
}
const remove = async () => {
  if (!(await confirm({ title: 'Delete this enquiry?', message: 'This can’t be undone.', tone: 'danger', confirmLabel: 'Delete' }))) return
  site.deleteEnquiry(current.value.id)
  selectedId.value = ''
  show('The enquiry has been deleted.', { title: 'Deleted', icon: 'trash' })
}
const exportCsv = () =>
  downloadCsv(`enquiries-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['Received', 'Couple', 'Phone', 'E-mail', 'Vendor', 'Wedding date', 'Status', 'Message'],
    ...filtered.value.map((e) => [e.createdAt, e.name, e.phone, e.email, e.vendorName, e.weddingDate, e.status, e.message])
  ])
</script>
