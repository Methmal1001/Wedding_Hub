<template>
  <AdminShell title="Settings" eyebrow="System" subtitle="How moderation works, your admin account and the demo data.">
    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div class="space-y-6">
        <!-- Moderation -->
        <section class="adm-card p-5 sm:p-6">
          <h2 class="adm-card-title">Moderation</h2>
          <ul class="mt-4 divide-y divide-charcoal/[0.06]">
            <li v-for="t in toggles" :key="t.key" class="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p class="text-sm font-medium">{{ t.label }}</p>
                <p class="mt-0.5 text-xs text-charcoal-soft">{{ t.hint }}</p>
              </div>
              <button
                type="button"
                class="switch"
                :class="{ 'is-on': form[t.key] }"
                role="switch"
                :aria-checked="form[t.key]"
                :aria-label="t.label"
                @click="form[t.key] = !form[t.key]"
              />
            </li>
          </ul>
        </section>

        <!-- General -->
        <section class="adm-card p-5 sm:p-6">
          <h2 class="adm-card-title">General</h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="adm-label" for="set-email">Support e-mail</label>
              <input id="set-email" v-model.trim="form.supportEmail" type="email" class="adm-input" :class="{ '!border-red-400': errors.supportEmail }">
              <p v-if="errors.supportEmail" class="mt-1 text-xs text-red-600">{{ errors.supportEmail }}</p>
            </div>
            <div>
              <label class="adm-label" for="set-sla">Response time for requests (working days)</label>
              <input id="set-sla" v-model.number="form.reviewSlaDays" type="number" min="1" max="14" class="adm-input" :class="{ '!border-red-400': errors.reviewSlaDays }">
              <p v-if="errors.reviewSlaDays" class="mt-1 text-xs text-red-600">{{ errors.reviewSlaDays }}</p>
            </div>
          </div>
          <div class="mt-5 flex items-center justify-end gap-3">
            <span v-if="dirty" class="text-xs text-amber-700">Unsaved changes</span>
            <button type="button" class="adm-btn-ghost" :disabled="!dirty" @click="resetForm">Discard</button>
            <button type="button" class="adm-btn-primary" :disabled="!dirty" @click="saveSettings">Save settings</button>
          </div>
        </section>

        <!-- Data -->
        <section class="adm-card p-5 sm:p-6">
          <h2 class="adm-card-title">Demo data</h2>
          <p class="mt-1 text-sm text-charcoal-soft">
            This prototype has no server – listing requests, reviews, enquiries and invoices are stored in this browser.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" class="flex items-start gap-3 rounded-2xl p-4 text-left ring-1 ring-charcoal/10 transition hover:bg-ivory hover:ring-rosewood/30" @click="exportJson">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600"><AppIcon name="download" :size="18" /></span>
              <span><span class="block text-sm font-medium">Export all data</span><span class="block text-xs text-charcoal-soft">Download a JSON backup</span></span>
            </button>
            <button type="button" class="flex items-start gap-3 rounded-2xl p-4 text-left ring-1 ring-red-200 transition hover:bg-red-50" @click="reset">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600"><AppIcon name="refresh" :size="18" /></span>
              <span><span class="block text-sm font-medium text-red-700">Reset demo data</span><span class="block text-xs text-charcoal-soft">Restore the sample requests, reviews and invoices</span></span>
            </button>
          </div>
        </section>
      </div>

      <div class="space-y-6">
        <!-- Account -->
        <section class="adm-card overflow-hidden">
          <div class="bg-gradient-to-br from-rosewood-900 to-rosewood-800 p-5 text-white sm:p-6">
            <div class="flex items-center gap-4">
              <span class="grid h-14 w-14 place-items-center rounded-2xl bg-gold-light font-serif text-2xl font-semibold text-rosewood-900">{{ user?.name?.[0] }}</span>
              <div class="min-w-0">
                <p class="truncate font-serif text-2xl font-semibold">{{ user?.name }}</p>
                <p class="truncate text-sm text-white/70">{{ user?.email }}</p>
              </div>
            </div>
            <p class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/20"><AppIcon name="shield" :size="13" />Administrator</p>
          </div>
          <form class="space-y-3 p-5 sm:p-6" novalidate @submit.prevent="changePw">
            <h2 class="text-sm font-semibold">Change password</h2>
            <input v-model="pw.current" type="password" autocomplete="current-password" class="adm-input" placeholder="Current password" aria-label="Current password">
            <input v-model="pw.next" type="password" autocomplete="new-password" class="adm-input" placeholder="New password (8+ characters)" aria-label="New password">
            <input v-model="pw.confirm" type="password" autocomplete="new-password" class="adm-input" placeholder="Confirm new password" aria-label="Confirm new password">
            <p v-if="pwError" class="text-xs text-red-600" role="alert">{{ pwError }}</p>
            <button type="submit" class="adm-btn-primary w-full" :disabled="pwBusy">Update password</button>
          </form>
        </section>

        <!-- Demo accounts -->
        <section class="adm-card p-5 sm:p-6">
          <h2 class="adm-card-title">Demo accounts</h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li class="rounded-xl bg-ivory p-3 ring-1 ring-charcoal/[0.06]">
              <p class="font-medium">Admin</p>
              <p class="font-mono text-xs text-charcoal-soft">{{ ADMIN_ACCOUNT.email }} · {{ ADMIN_ACCOUNT.password }}</p>
            </li>
            <li class="rounded-xl bg-ivory p-3 ring-1 ring-charcoal/[0.06]">
              <p class="font-medium">Couple</p>
              <p class="font-mono text-xs text-charcoal-soft">{{ DEMO_ACCOUNT.email }} · {{ DEMO_ACCOUNT.password }}</p>
            </li>
          </ul>
          <p class="mt-3 text-xs text-charcoal-soft">A real site must check passwords and admin rights on a server – this panel is a front-end demo.</p>
        </section>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { ADMIN_ACCOUNT, DEMO_ACCOUNT } from '~/composables/useAuth'

definePageMeta({ middleware: 'admin' })
useHead({ title: 'Settings – Wedding Hub Admin' })

const auth = useAuth()
const user = auth.user
const site = useSiteData()
const { confirm } = useAdminDialog()
const { show } = useToast()

const toggles = [
  { key: 'moderateReviews', label: 'Moderate reviews', hint: 'New reviews wait in Reviews until you publish them. When off, they appear straight away.' },
  { key: 'autoApproveFree', label: 'Auto-approve free listings', hint: 'Basic (free) listings go live without review. Paid plans always need approval.' },
  { key: 'notifyVendors', label: 'Notify vendors', hint: 'Vendors see approval, rejection and invoice messages in their profile.' }
]

const form = reactive({ ...siteDb.settings })
const errors = reactive({})
const dirty = computed(() => Object.keys(form).some((k) => form[k] !== siteDb.settings[k]))
const resetForm = () => Object.assign(form, siteDb.settings)
const saveSettings = () => {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supportEmail)) errors.supportEmail = 'Enter a valid e-mail address.'
  if (!(form.reviewSlaDays >= 1 && form.reviewSlaDays <= 14)) errors.reviewSlaDays = 'Choose between 1 and 14 days.'
  if (Object.keys(errors).length) return
  site.updateSettings({ ...form })
  show('Your settings have been saved.', { title: 'Saved', icon: 'check' })
}

const exportJson = () => {
  const blob = new Blob([JSON.stringify(site.exportData(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: `wedding-hub-data-${new Date().toISOString().slice(0, 10)}.json` })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
const reset = async () => {
  const ok = await confirm({
    title: 'Reset the demo data?',
    message: 'All listing requests, reviews, enquiries, adverts, invoices and activity in this browser are replaced with the sample data. User accounts are kept.',
    tone: 'danger',
    confirmLabel: 'Reset data'
  })
  if (!ok) return
  resetSiteData()
  Object.assign(form, siteDb.settings)
  show('The sample data has been restored.', { title: 'Data reset', icon: 'refresh' })
}

const pw = reactive({ current: '', next: '', confirm: '' })
const pwError = ref('')
const pwBusy = ref(false)
const changePw = async () => {
  pwError.value = ''
  if (!pw.current) return (pwError.value = 'Enter your current password.')
  if (pw.next.length < 8) return (pwError.value = 'The new password needs at least 8 characters.')
  if (pw.next !== pw.confirm) return (pwError.value = 'The new passwords don’t match.')
  pwBusy.value = true
  try {
    await auth.changePassword(pw.current, pw.next)
    Object.assign(pw, { current: '', next: '', confirm: '' })
    show('Your password has been changed.', { title: 'Password updated', icon: 'check' })
  } catch (e) {
    pwError.value = e.message
  } finally {
    pwBusy.value = false
  }
}
</script>

<style scoped>
.switch {
  @apply relative inline-block h-6 w-11 shrink-0 rounded-full bg-charcoal/15 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosewood/40;
}
.switch::after {
  content: '';
  @apply absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300;
}
.switch.is-on {
  @apply bg-emerald-500;
}
.switch.is-on::after {
  transform: translateX(20px);
}
</style>
