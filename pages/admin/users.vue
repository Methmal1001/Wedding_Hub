<template>
  <AdminShell title="Users" eyebrow="Directory" subtitle="Couples, vendors and admins with an account on this browser.">
    <template #actions>
      <button type="button" class="adm-btn-ghost" @click="exportCsv"><AppIcon name="download" :size="16" />Export CSV</button>
    </template>

    <div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-2xl bg-charcoal/[0.035] p-1">
      <button v-for="t in tabs" :key="t.id" type="button" class="adm-tab" :class="{ 'is-on': role === t.id }" @click="role = t.id">
        {{ t.label }} <span class="adm-count">{{ t.count }}</span>
      </button>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <div class="relative min-w-[220px] flex-1">
        <AppIcon name="search" :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input v-model="q" type="search" class="adm-input !pl-9" placeholder="Search by name, e-mail, phone or business" aria-label="Search users">
      </div>
      <select v-model="state" class="adm-input !w-auto" aria-label="Account status">
        <option value="">Any status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <section class="adm-card mt-4 overflow-hidden">
      <div v-if="paged.length" class="overflow-x-auto">
        <table class="adm-table min-w-[820px]">
          <thead>
            <tr><th>User</th><th>Role</th><th>City</th><th>Joined</th><th>Last login</th><th>Activity</th><th>Status</th><th class="text-right" /></tr>
          </thead>
          <tbody>
            <tr v-for="u in paged" :key="u.id" class="cursor-pointer" @click="openUser(u.id)">
              <td>
                <div class="flex items-center gap-3">
                  <img v-if="u.avatar" :src="u.avatar" alt="" class="h-10 w-10 rounded-full object-cover">
                  <span v-else class="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold" :class="avatarCls(u.role)">{{ initials(u.name) }}</span>
                  <div class="min-w-0">
                    <p class="flex items-center gap-1.5 font-medium">{{ u.name }}<span v-if="u.id === me?.id" class="rounded bg-gold-light/50 px-1.5 text-[10px] font-semibold text-gold-dark">You</span></p>
                    <p class="truncate text-xs text-charcoal-soft">{{ u.email }}</p>
                  </div>
                </div>
              </td>
              <td><AdminBadge :status="u.role" /><p v-if="u.businessName" class="mt-1 max-w-[160px] truncate text-[11px] text-charcoal-soft">{{ u.businessName }}</p></td>
              <td class="text-charcoal-soft">{{ u.city || '—' }}</td>
              <td class="text-charcoal-soft">{{ fmtDate(u.createdAt) }}</td>
              <td class="text-charcoal-soft">{{ u.lastLoginAt ? timeAgo(u.lastLoginAt) : 'Never' }}</td>
              <td class="text-xs text-charcoal-soft">
                <span class="mr-2 inline-flex items-center gap-1"><AppIcon name="heart" :size="12" />{{ u.favourites?.length || 0 }}</span>
                <span class="inline-flex items-center gap-1"><AppIcon name="mail" :size="12" />{{ u.enquiries?.length || 0 }}</span>
              </td>
              <td><AdminBadge :status="u.status === 'suspended' ? 'suspended' : 'active'" /></td>
              <td class="text-right"><AppIcon name="arrowRight" :size="16" class="text-charcoal-soft" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminEmpty v-else icon="users" title="No users found" text="Try clearing the search or filters." />
      <AdminPager v-model:page="page" :size="PAGE" :total="filtered.length" />
    </section>

    <!-- User drawer -->
    <AdminDrawer :open="!!current" :title="current?.name || ''" eyebrow="User account" @close="closeUser">
      <template v-if="current" #sub>
        <div class="mt-1.5 flex flex-wrap items-center gap-2">
          <AdminBadge :status="current.role" />
          <AdminBadge :status="current.status === 'suspended' ? 'suspended' : 'active'" />
          <span class="text-xs text-charcoal-soft">Member since {{ fmtDate(current.createdAt) }}</span>
        </div>
      </template>

      <template v-if="current">
        <div v-if="current.status === 'suspended'" class="mb-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          <p class="font-semibold">This account is suspended and can’t log in.</p>
          <p v-if="current.suspendedReason" class="mt-1">Reason: {{ current.suspendedReason }}</p>
        </div>

        <dl class="grid gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-charcoal/[0.07] sm:grid-cols-2">
          <div v-for="r in info" :key="r.label">
            <dt class="text-xs text-charcoal-soft">{{ r.label }}</dt>
            <dd class="mt-0.5 break-words font-medium">{{ r.value || '—' }}</dd>
          </div>
        </dl>

        <!-- Role -->
        <section class="mt-5 rounded-2xl bg-white p-4 ring-1 ring-charcoal/[0.07]">
          <h3 class="text-sm font-semibold">Role</h3>
          <p class="text-xs text-charcoal-soft">Admins can open this panel. Vendors get the business tools in their profile.</p>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <button
              v-for="r in USER_ROLES"
              :key="r"
              type="button"
              class="rounded-xl px-3 py-2.5 text-sm font-medium capitalize ring-1 transition disabled:cursor-not-allowed disabled:opacity-50"
              :class="current.role === r ? 'bg-rosewood text-white ring-rosewood' : 'ring-charcoal/10 hover:ring-rosewood/40'"
              :disabled="isMe"
              @click="setRole(r)"
            >
              {{ r }}
            </button>
          </div>
          <p v-if="isMe" class="mt-2 text-xs text-charcoal-soft">You can’t change your own role.</p>
        </section>

        <!-- Listings by this user -->
        <section v-if="userSubs.length" class="mt-5">
          <h3 class="text-sm font-semibold">Listing requests</h3>
          <ul class="mt-2 space-y-2">
            <li v-for="s in userSubs" :key="s.ref">
              <NuxtLink :to="`/admin/requests?ref=${s.ref}`" class="flex items-center justify-between gap-3 rounded-xl bg-white p-3 text-sm ring-1 ring-charcoal/[0.07] hover:ring-rosewood/30">
                <span><strong class="font-medium">{{ s.businessName }}</strong> <span class="text-xs text-charcoal-soft">{{ s.ref }}</span></span>
                <AdminBadge :status="s.status" />
              </NuxtLink>
            </li>
          </ul>
        </section>

        <!-- Enquiries -->
        <section v-if="current.enquiries?.length" class="mt-5">
          <h3 class="text-sm font-semibold">Enquiries sent ({{ current.enquiries.length }})</h3>
          <ul class="mt-2 space-y-2">
            <li v-for="e in current.enquiries.slice(0, 5)" :key="e.id" class="rounded-xl bg-white p-3 text-sm ring-1 ring-charcoal/[0.07]">
              <p class="font-medium">{{ e.vendorName }}</p>
              <p class="line-clamp-2 text-xs text-charcoal-soft">{{ e.message }}</p>
              <p class="mt-1 text-[11px] text-charcoal-soft">{{ fmtDateTime(e.sentAt) }}</p>
            </li>
          </ul>
        </section>
      </template>

      <template v-if="current" #footer>
        <a :href="`mailto:${current.email}`" class="adm-btn-ghost mr-auto"><AppIcon name="mail" :size="16" />E-mail</a>
        <template v-if="!isMe">
          <button type="button" class="adm-icon-btn hover:!bg-red-50 hover:!text-red-600" title="Delete account" aria-label="Delete account" @click="remove"><AppIcon name="trash" :size="17" /></button>
          <button v-if="current.status === 'suspended'" type="button" class="adm-btn-success" @click="reactivate">Reactivate</button>
          <button v-else type="button" class="adm-btn-danger" @click="suspend">Suspend</button>
        </template>
      </template>
    </AdminDrawer>
  </AdminShell>
</template>

<script setup>
import { USER_ROLES } from '~/composables/useAuth'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Users – Wedding Hub Admin' })

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const site = useSiteData()
const { confirm, prompt } = useAdminDialog()
const { show } = useToast()
const me = auth.user

// Accounts are read from storage; bump `version` after every change.
const version = ref(0)
const users = computed(() => {
  void version.value
  return auth.listUsers().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
})

const PAGE = 10
const role = ref('all')
const q = ref('')
const state = ref('')
const page = ref(1)
watch([role, q, state], () => (page.value = 1))

const tabs = computed(() => [
  { id: 'all', label: 'All', count: users.value.length },
  ...USER_ROLES.map((r) => ({ id: r, label: r[0].toUpperCase() + r.slice(1) + 's', count: users.value.filter((u) => u.role === r).length }))
])
const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  return users.value.filter(
    (u) =>
      (role.value === 'all' || u.role === role.value) &&
      (!state.value || (state.value === 'suspended' ? u.status === 'suspended' : u.status !== 'suspended')) &&
      (!t || [u.name, u.email, u.phone, u.businessName].some((v) => String(v || '').toLowerCase().includes(t)))
  )
})
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE, page.value * PAGE))

const initials = (n = '') =>
  n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
const avatarCls = (r) => ({ admin: 'bg-rosewood-900 text-gold-light', vendor: 'bg-gold-light/60 text-gold-dark' })[r] || 'bg-blush text-rosewood'

// ---- drawer ----
const current = computed(() => users.value.find((u) => u.id === route.query.id) || null)
const isMe = computed(() => current.value?.id === me.value?.id)
const openUser = (id) => router.push({ query: { ...route.query, id } })
const closeUser = () => router.push({ query: { ...route.query, id: undefined } })
const userSubs = computed(() => (current.value ? site.submissionsFor(current.value) : []))
const info = computed(() => {
  const u = current.value
  return [
    { label: 'E-mail', value: u.email },
    { label: 'Phone', value: u.phone },
    { label: 'City', value: u.city },
    u.role === 'couple' && { label: 'Partner', value: u.partnerName },
    u.role === 'couple' && { label: 'Wedding date', value: u.weddingDate ? fmtDate(u.weddingDate) : '' },
    u.role === 'vendor' && { label: 'Business', value: u.businessName },
    u.role === 'vendor' && { label: 'Category', value: u.businessCategory ? categoryLabel(u.businessCategory) : '' },
    { label: 'Last login', value: u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : 'Never' },
    { label: 'Saved vendors', value: String(u.favourites?.length || 0) },
    { label: 'Checklist', value: `${u.checklist?.length || 0} done` }
  ].filter(Boolean)
})

const refresh = () => version.value++
const setRole = async (r) => {
  const u = current.value
  if (r === u.role) return
  if (r === 'admin') {
    const ok = await confirm({ title: `Make ${u.name} an admin?`, message: 'They will be able to approve listings, manage users and change settings.', confirmLabel: 'Make admin', icon: 'shield' })
    if (!ok) return
  }
  auth.adminUpdateUser(u.id, { role: r })
  site.log('user', `changed ${u.name}'s role to ${r}`, `/admin/users?id=${u.id}`)
  refresh()
  show(`${u.name} is now ${r === 'admin' ? 'an' : 'a'} ${r}.`, { title: 'Role updated', icon: 'check' })
}
const suspend = async () => {
  const u = current.value
  const res = await prompt({
    title: `Suspend ${u.name}?`,
    message: 'They will be logged out and can’t log in until you reactivate the account.',
    tone: 'danger',
    confirmLabel: 'Suspend account',
    input: { label: 'Reason', required: true, presets: ['Spam or fake reviews', 'Abusive messages', 'Fake business', 'Requested by the user'] }
  })
  if (!res) return
  auth.adminUpdateUser(u.id, { status: 'suspended', suspendedReason: res.value })
  site.log('user', `suspended ${u.name}`, `/admin/users?id=${u.id}`)
  refresh()
  show(`${u.name}'s account is suspended.`, { title: 'Account suspended', icon: 'shield' })
}
const reactivate = () => {
  const u = current.value
  auth.adminUpdateUser(u.id, { status: 'active', suspendedReason: '' })
  site.log('user', `reactivated ${u.name}`, `/admin/users?id=${u.id}`)
  refresh()
  show(`${u.name} can log in again.`, { title: 'Account reactivated', icon: 'check' })
}
const remove = async () => {
  const u = current.value
  const ok = await confirm({ title: `Delete ${u.name}?`, message: 'The account, saved vendors and enquiry history are deleted permanently. Listing requests stay in Listing requests.', tone: 'danger', confirmLabel: 'Delete account' })
  if (!ok) return
  auth.adminDeleteUser(u.id)
  site.log('user', `deleted the account of ${u.name}`, '/admin/users')
  closeUser()
  refresh()
  show('The account has been deleted.', { title: 'Deleted', icon: 'trash' })
}

const exportCsv = () =>
  downloadCsv(`users-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['Name', 'E-mail', 'Phone', 'Role', 'City', 'Business', 'Joined', 'Last login', 'Status'],
    ...filtered.value.map((u) => [u.name, u.email, u.phone, u.role, u.city, u.businessName, u.createdAt, u.lastLoginAt || '', u.status || 'active'])
  ])
</script>
