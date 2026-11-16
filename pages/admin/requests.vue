<template>
  <AdminShell title="Listing requests" eyebrow="Moderation" subtitle="Review businesses that applied through “List your business”.">
    <template #actions>
      <button type="button" class="adm-btn-ghost" @click="exportCsv"><AppIcon name="download" :size="16" />Export CSV</button>
      <NuxtLink to="/list-your-business#apply" class="adm-btn-soft"><AppIcon name="external" :size="16" />Open the form</NuxtLink>
    </template>

    <!-- Status tabs -->
    <div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-2xl bg-charcoal/[0.035] p-1">
      <button v-for="t in tabs" :key="t.id" type="button" class="adm-tab" :class="{ 'is-on': status === t.id }" @click="status = t.id">
        {{ t.label }}
        <span class="adm-count">{{ t.count }}</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="mt-4 flex flex-wrap items-center gap-2">
      <div class="relative min-w-[220px] flex-1">
        <AppIcon name="search" :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input v-model="q" type="search" class="adm-input !pl-9" placeholder="Search by business, reference, e-mail or city" aria-label="Search requests">
      </div>
      <select v-model="category" class="adm-input !w-auto" aria-label="Category">
        <option value="">All categories</option>
        <option v-for="c in weddingCategories" :key="c.key" :value="c.key">{{ c.name }}</option>
      </select>
      <select v-model="plan" class="adm-input !w-auto" aria-label="Plan">
        <option value="">All plans</option>
        <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <select v-model="sort" class="adm-input !w-auto" aria-label="Sort">
        <option value="new">Newest first</option>
        <option value="old">Oldest first</option>
        <option value="name">Name A–Z</option>
      </select>
    </div>

    <!-- Bulk actions -->
    <Transition name="fade">
      <div v-if="selected.length" class="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-rosewood-900 px-4 py-2.5 text-sm text-white">
        <strong>{{ selected.length }} selected</strong>
        <span class="text-white/60">· only pending requests can be approved or rejected in bulk</span>
        <div class="ml-auto flex gap-2">
          <button type="button" class="adm-btn !min-h-[34px] bg-emerald-500 text-white hover:bg-emerald-600" @click="bulkApprove">Approve</button>
          <button type="button" class="adm-btn !min-h-[34px] bg-white/15 text-white hover:bg-white/25" @click="bulkReject">Reject</button>
          <button type="button" class="adm-btn !min-h-[34px] text-white/80 hover:text-white" @click="selected = []">Clear</button>
        </div>
      </div>
    </Transition>

    <!-- Table -->
    <section class="adm-card mt-4 overflow-hidden">
      <div v-if="paged.length" class="overflow-x-auto">
        <table class="adm-table min-w-[880px]">
          <thead>
            <tr>
              <th class="w-10">
                <input type="checkbox" class="h-4 w-4 accent-rosewood" :checked="allChecked" aria-label="Select all on this page" @change="toggleAll">
              </th>
              <th>Business</th>
              <th>Category</th>
              <th>Plan</th>
              <th>Submitted</th>
              <th>Quality</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in paged" :key="s.ref" class="cursor-pointer" @click="openRef(s.ref)">
              <td @click.stop>
                <input v-model="selected" type="checkbox" class="h-4 w-4 accent-rosewood" :value="s.ref" :aria-label="`Select ${s.businessName}`">
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <img v-if="cover(s)" :src="cover(s)" alt="" class="h-11 w-11 rounded-xl object-cover">
                  <span v-else class="grid h-11 w-11 place-items-center rounded-xl bg-blush font-serif text-lg font-semibold text-rosewood">{{ s.businessName[0] }}</span>
                  <div class="min-w-0">
                    <p class="max-w-[200px] truncate font-medium">{{ s.businessName }}</p>
                    <p class="text-xs text-charcoal-soft">{{ s.ref }} · {{ s.city }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-charcoal-soft">{{ categoryLabel(s.category) }}</p>
                <p class="max-w-[180px] truncate text-xs text-charcoal-soft/80">{{ s.services?.join(', ') }}</p>
              </td>
              <td><AdminBadge :status="s.plan" /><p class="mt-1 text-[11px] capitalize text-charcoal-soft">{{ s.billing }}</p></td>
              <td>
                <p class="whitespace-nowrap">{{ fmtDate(s.submittedAt) }}</p>
                <p class="whitespace-nowrap text-xs text-charcoal-soft">{{ timeAgo(s.submittedAt) }}</p>
              </td>
              <td>
                <div class="flex items-center gap-2" :title="`${score(s)}% of quality checks passed`">
                  <div class="h-1.5 w-12 overflow-hidden rounded-full bg-charcoal/10">
                    <div class="h-full rounded-full" :class="score(s) >= 80 ? 'bg-emerald-500' : score(s) >= 50 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: score(s) + '%' }" />
                  </div>
                  <span class="text-xs text-charcoal-soft">{{ score(s) }}%</span>
                </div>
              </td>
              <td><AdminBadge :status="s.status" /></td>
              <td @click.stop>
                <div class="flex justify-end gap-1">
                  <template v-if="s.status === 'pending'">
                    <button type="button" class="adm-icon-btn hover:!bg-emerald-50 hover:!text-emerald-600" :aria-label="`Approve ${s.businessName}`" title="Approve" @click="actions.approve(s)"><AppIcon name="check" :size="17" /></button>
                    <button type="button" class="adm-icon-btn hover:!bg-sky-50 hover:!text-sky-600" :aria-label="`Request changes from ${s.businessName}`" title="Request changes" @click="actions.requestChanges(s)"><AppIcon name="edit" :size="16" /></button>
                    <button type="button" class="adm-icon-btn hover:!bg-red-50 hover:!text-red-600" :aria-label="`Reject ${s.businessName}`" title="Reject" @click="actions.reject(s)"><AppIcon name="close" :size="17" /></button>
                  </template>
                  <button v-if="s.status !== 'pending'" type="button" class="adm-btn-ghost !min-h-[32px]" @click="openRef(s.ref)">View</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminEmpty v-else icon="inbox" title="No requests found" :text="q || category || plan ? 'Try clearing the search or filters.' : 'New listing requests will appear here.'" />
      <AdminPager v-model:page="page" :size="PAGE" :total="filtered.length" />
    </section>

    <!-- ============ Detail drawer ============ -->
    <AdminDrawer :open="!!current" :title="current?.businessName || ''" :eyebrow="current ? `Listing request · ${current.ref}` : ''" wide @close="closeRef">
      <template v-if="current" #sub>
        <div class="mt-1.5 flex flex-wrap items-center gap-2">
          <AdminBadge :status="current.status" />
          <AdminBadge :status="current.plan" :label="`${planById(current.plan).name} · ${current.billing}`" />
          <span class="text-xs text-charcoal-soft">Submitted {{ fmtDateTime(current.submittedAt) }}</span>
        </div>
      </template>

      <template v-if="current">
        <!-- Decision note -->
        <div v-if="current.decisionNote && current.status !== 'pending'" class="mb-5 rounded-2xl p-4 text-sm ring-1" :class="noteTone">
          <p class="font-semibold">{{ noteTitle }}</p>
          <p class="mt-1">{{ current.decisionNote }}</p>
          <p class="mt-1 text-xs opacity-70">{{ current.reviewedBy }} · {{ fmtDateTime(current.reviewedAt) }}</p>
        </div>

        <!-- Photos -->
        <section v-if="d.photos?.length || d.logo" class="mb-6">
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(src, i) in d.photos.slice(0, 8)"
              :key="i"
              type="button"
              class="group relative overflow-hidden rounded-xl"
              :class="i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'"
              :aria-label="`View photo ${i + 1}`"
              @click="photo = i"
            >
              <img :src="src" alt="" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
              <span v-if="i === 0" class="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-rosewood">Cover</span>
            </button>
          </div>
          <p class="mt-2 flex items-center gap-2 text-xs text-charcoal-soft">
            <img v-if="d.logo" :src="d.logo" alt="Logo" class="h-7 w-7 rounded-full object-cover ring-1 ring-charcoal/10">
            {{ d.photos.length }} photo{{ d.photos.length === 1 ? '' : 's' }}{{ d.logo ? ' + logo' : '' }} · plan allows {{ { free: 3, silver: 15, gold: 30 }[current.plan] }}
          </p>
        </section>
        <div v-else class="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
          <AppIcon name="image" :size="18" /> No photos were uploaded{{ current.photos ? ' (they did not fit in browser storage)' : '' }}.
        </div>

        <!-- Quality checks -->
        <section class="mb-6 rounded-2xl bg-white p-4 ring-1 ring-charcoal/[0.07]">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold">Quality checks</h3>
            <span class="text-xs font-semibold" :class="score(current) >= 80 ? 'text-emerald-600' : score(current) >= 50 ? 'text-amber-600' : 'text-red-600'">{{ score(current) }}% passed</span>
          </div>
          <ul class="mt-3 grid gap-2 sm:grid-cols-2">
            <li v-for="c in checks(current)" :key="c.label" class="flex items-start gap-2 text-sm">
              <span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full" :class="c.ok ? 'bg-emerald-500 text-white' : c.warn ? 'bg-amber-400 text-white' : 'bg-red-500 text-white'">
                <AppIcon :name="c.ok ? 'check' : 'close'" :size="10" :stroke-width="3" />
              </span>
              <span :class="c.ok ? 'text-charcoal' : 'text-charcoal-soft'">{{ c.label }}</span>
            </li>
          </ul>
        </section>

        <!-- Details -->
        <div class="grid gap-4 sm:grid-cols-2">
          <section v-for="sec in details" :key="sec.title" class="rounded-2xl bg-white p-4 ring-1 ring-charcoal/[0.07]" :class="{ 'sm:col-span-2': sec.wide }">
            <h3 class="flex items-center gap-2 text-sm font-semibold"><AppIcon :name="sec.icon" :size="16" class="text-rosewood" />{{ sec.title }}</h3>
            <dl class="mt-3 space-y-2.5 text-sm">
              <div v-for="row in sec.rows.filter((r) => r.value)" :key="row.label" class="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
                <dt class="text-charcoal-soft">{{ row.label }}</dt>
                <dd class="break-words">
                  <a v-if="row.href" :href="row.href" class="font-medium text-rosewood hover:underline" target="_blank" rel="noopener noreferrer nofollow">{{ row.value }}</a>
                  <span v-else-if="Array.isArray(row.value)" class="flex flex-wrap gap-1">
                    <span v-for="v in row.value" :key="v" class="rounded-full bg-blush-light px-2 py-0.5 text-xs text-rosewood-800">{{ v }}</span>
                  </span>
                  <span v-else class="whitespace-pre-line">{{ row.value }}</span>
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <!-- Internal notes -->
        <section class="mt-6 rounded-2xl bg-white p-4 ring-1 ring-charcoal/[0.07]">
          <h3 class="flex items-center gap-2 text-sm font-semibold"><AppIcon name="note" :size="16" class="text-rosewood" />Internal notes <span class="font-normal text-charcoal-soft">(only admins see these)</span></h3>
          <ul v-if="current.notes?.length" class="mt-3 space-y-2">
            <li v-for="(n, i) in current.notes" :key="i" class="rounded-xl bg-gold-light/20 p-3 text-sm ring-1 ring-gold/20">
              {{ n.text }}
              <p class="mt-1 text-xs text-charcoal-soft">{{ n.by }} · {{ fmtDateTime(n.at) }}</p>
            </li>
          </ul>
          <form class="mt-3 flex gap-2" @submit.prevent="addNote">
            <input v-model="noteDraft" class="adm-input" placeholder="e.g. Called the vendor – photos coming tomorrow" aria-label="Add an internal note">
            <button type="submit" class="adm-btn-ghost" :disabled="!noteDraft.trim()">Add</button>
          </form>
        </section>

        <!-- History -->
        <section class="mt-6">
          <h3 class="flex items-center gap-2 text-sm font-semibold"><AppIcon name="clock" :size="16" class="text-rosewood" />History</h3>
          <ol class="mt-3 space-y-3 border-l border-charcoal/10 pl-4">
            <li v-for="(h, i) in [...(current.history || [])].reverse()" :key="i" class="relative text-sm">
              <span class="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-ivory" :class="historyDot(h.action)" />
              <p><strong class="font-semibold capitalize">{{ historyLabel(h.action) }}</strong> by {{ h.by }}</p>
              <p v-if="h.note" class="text-charcoal-soft">“{{ h.note }}”</p>
              <p class="text-xs text-charcoal-soft">{{ fmtDateTime(h.at) }}</p>
            </li>
          </ol>
        </section>
      </template>

      <template v-if="current" #footer>
        <a :href="mailto" class="adm-btn-ghost mr-auto"><AppIcon name="mail" :size="16" />E-mail vendor</a>
        <button type="button" class="adm-icon-btn hover:!bg-red-50 hover:!text-red-600" title="Delete request" aria-label="Delete request" @click="onDelete"><AppIcon name="trash" :size="17" /></button>
        <template v-if="current.status === 'pending' || current.status === 'changes'">
          <button type="button" class="adm-btn-ghost !text-red-600" @click="actions.reject(current)">Reject</button>
          <button type="button" class="adm-btn-soft" @click="actions.requestChanges(current)">Request changes</button>
          <button type="button" class="adm-btn-success" @click="actions.approve(current)"><AppIcon name="check" :size="16" />Approve</button>
        </template>
        <template v-else-if="current.status === 'approved'">
          <NuxtLink :to="listingPath(submissionToListing(current))" target="_blank" class="adm-btn-ghost"><AppIcon name="external" :size="16" />View live listing</NuxtLink>
          <button type="button" class="adm-btn-danger" @click="actions.unpublish(current)">Unpublish</button>
        </template>
        <template v-else>
          <button type="button" class="adm-btn-success" @click="actions.approve(current)"><AppIcon name="check" :size="16" />{{ current.status === 'unpublished' ? 'Re-publish' : 'Approve anyway' }}</button>
        </template>
      </template>
    </AdminDrawer>

    <!-- Photo viewer -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="photo !== null && d.photos?.length" class="fixed inset-0 z-[95] grid place-items-center bg-charcoal/90 p-4" @click.self="photo = null">
          <img :src="d.photos[photo]" alt="" class="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-lift">
          <button type="button" class="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Close photo" @click="photo = null"><AppIcon name="close" :size="20" /></button>
          <button v-if="d.photos.length > 1" type="button" class="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Previous photo" @click="photo = (photo - 1 + d.photos.length) % d.photos.length"><AppIcon name="chevronDown" :size="20" class="rotate-90" /></button>
          <button v-if="d.photos.length > 1" type="button" class="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label="Next photo" @click="photo = (photo + 1) % d.photos.length"><AppIcon name="chevronDown" :size="20" class="-rotate-90" /></button>
          <p class="absolute bottom-5 text-sm text-white/80">{{ photo + 1 }} / {{ d.photos.length }}</p>
        </div>
      </Transition>
    </Teleport>
  </AdminShell>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'
import { plans } from '~/data/businessPlans'
import { catalog } from '~/data/catalog'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Listing requests – Wedding Hub Admin' })

const route = useRoute()
const router = useRouter()
const site = useSiteData()
const actions = useAdminActions()
const { prompt } = useAdminDialog()
const { show } = useToast()

const PAGE = 8
const status = ref(String(route.query.status || 'all'))
const q = ref('')
const category = ref('')
const plan = ref('')
const sort = ref('new')
const page = ref(1)
const selected = ref([])

const tabs = computed(() => {
  const count = (st) => siteDb.submissions.filter((s) => s.status === st).length
  return [
    { id: 'all', label: 'All', count: siteDb.submissions.length },
    { id: 'pending', label: 'Pending', count: count('pending') },
    { id: 'changes', label: 'Changes requested', count: count('changes') },
    { id: 'approved', label: 'Approved', count: count('approved') },
    { id: 'rejected', label: 'Rejected', count: count('rejected') },
    { id: 'unpublished', label: 'Unpublished', count: count('unpublished') }
  ]
})

const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  const list = siteDb.submissions.filter(
    (s) =>
      (status.value === 'all' || s.status === status.value) &&
      (!category.value || s.category === category.value) &&
      (!plan.value || s.plan === plan.value) &&
      (!t || [s.businessName, s.ref, s.email, s.city].some((v) => String(v || '').toLowerCase().includes(t)))
  )
  const sorted = [...list]
  if (sort.value === 'old') sorted.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
  else if (sort.value === 'name') sorted.sort((a, b) => a.businessName.localeCompare(b.businessName))
  else sorted.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  return sorted
})
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE, page.value * PAGE))
watch([status, q, category, plan, sort], () => {
  page.value = 1
  selected.value = []
})
watch(status, (v) => router.replace({ query: { ...route.query, status: v === 'all' ? undefined : v } }))

const allChecked = computed(() => paged.value.length > 0 && paged.value.every((s) => selected.value.includes(s.ref)))
const toggleAll = () => {
  const refs = paged.value.map((s) => s.ref)
  selected.value = allChecked.value ? selected.value.filter((r) => !refs.includes(r)) : [...new Set([...selected.value, ...refs])]
}

const cover = (s) => s.data?.photos?.[0] || ''

// ---- quality checks ----
const existingNames = computed(() => catalog.map((l) => l.name.toLowerCase()))
const checks = (s) => {
  const d = s.data || {}
  const desc = d.description || ''
  const dup =
    existingNames.value.includes(s.businessName.toLowerCase()) ||
    siteDb.submissions.some((o) => o.ref !== s.ref && o.businessName.toLowerCase() === s.businessName.toLowerCase() && o.status === 'approved')
  return [
    { label: 'At least 3 photos', ok: (d.photos?.length || 0) >= 3, warn: (d.photos?.length || 0) > 0 },
    { label: 'Description is 100+ characters', ok: desc.length >= 100, warn: desc.length >= 40 },
    { label: 'Valid phone number', ok: /^[+\d][\d\s()-]{8,}$/.test(s.phone || '') },
    { label: 'Valid e-mail address', ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email || '') },
    { label: 'Full address given', ok: (d.address || '').length >= 6 },
    { label: 'Price or “on request” set', ok: !!s.price },
    { label: 'Logo uploaded', ok: !!d.logo, warn: true },
    { label: 'No duplicate business name', ok: !dup }
  ]
}
const score = (s) => {
  const c = checks(s)
  return Math.round((c.filter((x) => x.ok).length / c.length) * 100)
}

// ---- drawer ----
const current = computed(() => siteDb.submissions.find((s) => s.ref === route.query.ref) || null)
const d = computed(() => current.value?.data || {})
const openRef = (ref) => router.push({ query: { ...route.query, ref } })
const closeRef = () => router.push({ query: { ...route.query, ref: undefined } })
const photo = ref(null)
watch(current, () => (photo.value = null))

const safeUrl = (u) => {
  if (!u) return ''
  const url = /^https?:\/\//i.test(u) ? u : `https://${u}`
  return /^https?:\/\/[\w.-]+/i.test(url) ? url : ''
}
const details = computed(() => {
  const s = current.value
  if (!s) return []
  const v = d.value
  return [
    {
      title: 'Business',
      icon: 'store',
      wide: true,
      rows: [
        { label: 'Category', value: categoryLabel(s.category) },
        { label: 'Services', value: s.services },
        { label: 'Since', value: v.since },
        { label: 'Description', value: v.description }
      ]
    },
    {
      title: 'Contact',
      icon: 'phone',
      rows: [
        { label: 'Contact', value: v.contactName },
        { label: 'Phone', value: s.phone, href: `tel:${(s.phone || '').replace(/[^\d+]/g, '')}` },
        { label: 'E-mail', value: s.email, href: `mailto:${s.email}` },
        { label: 'Website', value: v.website, href: safeUrl(v.website) },
        { label: 'Facebook', value: v.facebook },
        { label: 'Instagram', value: v.instagram }
      ]
    },
    {
      title: 'Location',
      icon: 'pin',
      rows: [
        { label: 'Address', value: v.address },
        { label: 'City', value: s.city },
        { label: 'Serves', value: v.islandWide ? 'Island-wide' : v.areas?.length ? v.areas : '' }
      ]
    },
    {
      title: 'Pricing',
      icon: 'sparkles',
      wide: true,
      rows: [
        { label: 'Price', value: s.price },
        { label: 'Capacity', value: v.capacity ? `Up to ${v.capacity} guests` : '' },
        { label: 'Included', value: v.offerings?.length ? v.offerings : '' },
        { label: 'Plan', value: `${planById(s.plan).name} · ${s.billing} · ${s.plan === 'free' ? 'Free' : fmtLKR(planAmount(s.plan, s.billing))}` }
      ]
    }
  ]
})

const noteTitle = computed(() => ({ approved: 'Approval note', rejected: 'Rejection reason', changes: 'Changes requested', unpublished: 'Unpublished because' })[current.value?.status] || 'Note')
const noteTone = computed(() => ({ approved: 'bg-emerald-50 text-emerald-900 ring-emerald-200', rejected: 'bg-red-50 text-red-800 ring-red-200', changes: 'bg-sky-50 text-sky-900 ring-sky-200' })[current.value?.status] || 'bg-charcoal/[0.04] ring-charcoal/10')
const historyLabel = (a) => ({ changes: 'Changes requested', submitted: 'Submitted', resubmitted: 'Resubmitted' })[a] || a
const historyDot = (a) => ({ approved: 'bg-emerald-500', rejected: 'bg-red-500', changes: 'bg-sky-500', unpublished: 'bg-charcoal-soft' })[a] || 'bg-rosewood'

const mailto = computed(() => {
  const s = current.value
  if (!s) return '#'
  const subject = `Your Wedding Hub listing ${s.ref}`
  return `mailto:${s.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hello ${s.data?.contactName || ''},\n\n`)}`
})

const noteDraft = ref('')
const addNote = () => {
  site.addSubmissionNote(current.value.ref, noteDraft.value)
  noteDraft.value = ''
}
const onDelete = async () => {
  if (await actions.remove(current.value)) closeRef()
}

// ---- bulk ----
const selectedPending = () => siteDb.submissions.filter((s) => selected.value.includes(s.ref) && s.status === 'pending')
const bulkApprove = async () => {
  const list = selectedPending()
  if (!list.length) return show('None of the selected requests are pending.', { title: 'Nothing to approve', icon: 'sparkles' })
  const res = await prompt({
    title: `Approve ${list.length} listing${list.length === 1 ? '' : 's'}?`,
    message: list.map((s) => s.businessName).join(', '),
    tone: 'success',
    icon: 'check',
    confirmLabel: 'Approve all',
    checks: [{ key: 'verified', label: 'Mark as verified', value: true }]
  })
  if (!res) return
  list.forEach((s) => site.approveListing(s.ref, res.checks))
  selected.value = []
  show(`${list.length} listing${list.length === 1 ? ' is' : 's are'} now live.`, { title: 'Approved', icon: 'check' })
}
const bulkReject = async () => {
  const list = selectedPending()
  if (!list.length) return show('None of the selected requests are pending.', { title: 'Nothing to reject', icon: 'sparkles' })
  const res = await prompt({
    title: `Reject ${list.length} listing${list.length === 1 ? '' : 's'}?`,
    message: 'Every vendor will see the same reason.',
    tone: 'danger',
    confirmLabel: 'Reject all',
    input: { label: 'Reason', required: true, presets: REJECT_REASONS }
  })
  if (!res) return
  list.forEach((s) => site.rejectListing(s.ref, res.value))
  selected.value = []
  show(`${list.length} request${list.length === 1 ? ' was' : 's were'} rejected.`, { title: 'Rejected', icon: 'close' })
}

const exportCsv = () =>
  downloadCsv(`listing-requests-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['Reference', 'Business', 'Category', 'Services', 'City', 'Plan', 'Billing', 'Status', 'Submitted', 'Contact', 'Phone', 'E-mail', 'Price'],
    ...filtered.value.map((s) => [s.ref, s.businessName, categoryLabel(s.category), s.services?.join('; '), s.city, s.plan, s.billing, s.status, s.submittedAt, s.data?.contactName, s.phone, s.email, s.price])
  ])
</script>
