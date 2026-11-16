<template>
  <AdminShell title="Payments" eyebrow="Revenue" subtitle="Invoices for paid plans and banner adverts. (Demo – no real payments are taken.)">
    <template #actions>
      <button type="button" class="adm-btn-ghost" @click="exportCsv"><AppIcon name="download" :size="16" />Export CSV</button>
    </template>

    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <div v-for="s in stats" :key="s.label" class="adm-card p-5">
        <p class="text-xs uppercase tracking-[0.14em] text-charcoal-soft">{{ s.label }}</p>
        <p class="mt-2 font-serif text-2xl font-semibold sm:text-3xl" :class="s.cls">{{ fmtLKR(s.value) }}</p>
        <p class="mt-1 text-xs text-charcoal-soft">{{ s.note }}</p>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-2">
      <div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-2xl bg-charcoal/[0.035] p-1">
        <button v-for="t in tabs" :key="t.id" type="button" class="adm-tab" :class="{ 'is-on': status === t.id }" @click="status = t.id">
          {{ t.label }} <span class="adm-count">{{ t.count }}</span>
        </button>
      </div>
      <select v-model="kind" class="adm-input !w-auto" aria-label="Type">
        <option value="">Plans & adverts</option>
        <option value="plan">Plans</option>
        <option value="ad">Adverts</option>
      </select>
    </div>

    <section class="adm-card mt-4 overflow-hidden">
      <div v-if="filtered.length" class="overflow-x-auto">
        <table class="adm-table min-w-[860px]">
          <thead>
            <tr><th>Invoice</th><th>Business</th><th>For</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th><th class="text-right">Actions</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id">
              <td class="font-mono text-xs font-semibold">{{ p.invoiceNo }}</td>
              <td>
                <p class="font-medium">{{ p.business }}</p>
                <p class="text-xs text-charcoal-soft">{{ p.email }}</p>
              </td>
              <td class="text-charcoal-soft">{{ p.description }}</td>
              <td class="font-semibold">{{ fmtLKR(p.amount) }}</td>
              <td class="text-charcoal-soft">{{ fmtDate(p.createdAt) }}</td>
              <td :class="isOverdue(p) ? 'font-semibold text-red-600' : 'text-charcoal-soft'">{{ fmtDate(p.dueAt) }}</td>
              <td>
                <AdminBadge :status="isOverdue(p) ? 'overdue' : p.status" />
                <p v-if="p.paidAt" class="mt-1 text-[11px] text-charcoal-soft">{{ p.method }} · {{ fmtDate(p.paidAt) }}</p>
              </td>
              <td>
                <div class="flex justify-end gap-1.5">
                  <button v-if="p.status === 'unpaid'" type="button" class="adm-btn-success !min-h-[34px]" @click="markPaid(p)">Mark paid</button>
                  <button v-if="p.status === 'unpaid'" type="button" class="adm-btn-ghost !min-h-[34px]" @click="remind(p)">Remind</button>
                  <button v-if="p.status === 'paid'" type="button" class="adm-btn-ghost !min-h-[34px]" @click="refund(p)">Refund</button>
                  <button type="button" class="adm-icon-btn" :aria-label="`View invoice ${p.invoiceNo}`" title="View invoice" @click="openId = p.id"><AppIcon name="eye" :size="17" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminEmpty v-else icon="card" title="No invoices" text="Invoices are created when you approve a paid plan or confirm an advert." />
    </section>

    <!-- Invoice -->
    <AdminDrawer :open="!!invoice" :title="invoice?.invoiceNo || ''" eyebrow="Invoice" @close="openId = ''">
      <div v-if="invoice" id="invoice-print" class="rounded-2xl bg-white p-6 ring-1 ring-charcoal/[0.07]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-serif text-2xl font-semibold">Wedding <span class="italic text-gold-dark">Hub</span></p>
            <p class="text-xs text-charcoal-soft">{{ siteDb.settings.supportEmail }}</p>
          </div>
          <AdminBadge :status="isOverdue(invoice) ? 'overdue' : invoice.status" />
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-xs uppercase tracking-[0.14em] text-charcoal-soft">Billed to</p>
            <p class="mt-1 font-medium">{{ invoice.business }}</p>
            <p class="text-charcoal-soft">{{ invoice.email }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs uppercase tracking-[0.14em] text-charcoal-soft">Issued / due</p>
            <p class="mt-1">{{ fmtDate(invoice.createdAt) }}</p>
            <p class="text-charcoal-soft">{{ fmtDate(invoice.dueAt) }}</p>
          </div>
        </div>
        <table class="mt-6 w-full text-sm">
          <thead><tr class="border-b border-charcoal/10 text-left text-xs uppercase tracking-[0.12em] text-charcoal-soft"><th class="py-2">Description</th><th class="py-2 text-right">Amount</th></tr></thead>
          <tbody><tr class="border-b border-charcoal/[0.06]"><td class="py-3">{{ invoice.description }}</td><td class="py-3 text-right">{{ fmtLKR(invoice.amount) }}</td></tr></tbody>
          <tfoot><tr><td class="pt-3 font-semibold">Total</td><td class="pt-3 text-right font-serif text-2xl font-semibold">{{ fmtLKR(invoice.amount) }}</td></tr></tfoot>
        </table>
        <p v-if="invoice.paidAt" class="mt-4 text-xs text-emerald-700">Paid by {{ invoice.method }} on {{ fmtDate(invoice.paidAt) }}.</p>
      </div>
      <template v-if="invoice" #footer>
        <button type="button" class="adm-btn-ghost" @click="print"><AppIcon name="download" :size="16" />Print / save PDF</button>
        <button v-if="invoice.status === 'unpaid'" type="button" class="adm-btn-success" @click="markPaid(invoice)">Mark paid</button>
      </template>
    </AdminDrawer>
  </AdminShell>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Payments – Wedding Hub Admin' })

const route = useRoute()
const site = useSiteData()
const { confirm, prompt } = useAdminDialog()
const { show } = useToast()

const status = ref(String(route.query.status || 'all'))
const kind = ref('')
const openId = ref('')
const now = new Date().toISOString()
const isOverdue = (p) => p.status === 'unpaid' && p.dueAt < now

const tabs = computed(() => {
  const c = (s) => siteDb.payments.filter((p) => p.status === s).length
  return [
    { id: 'all', label: 'All', count: siteDb.payments.length },
    { id: 'unpaid', label: 'Unpaid', count: c('unpaid') },
    { id: 'paid', label: 'Paid', count: c('paid') },
    { id: 'refunded', label: 'Refunded', count: c('refunded') }
  ]
})
const filtered = computed(() => siteDb.payments.filter((p) => (status.value === 'all' || p.status === status.value) && (!kind.value || p.kind === kind.value)))

const sum = (list) => list.reduce((t, p) => t + p.amount, 0)
const stats = computed(() => {
  const month = new Date().toISOString().slice(0, 7)
  const paid = siteDb.payments.filter((p) => p.status === 'paid')
  const unpaid = siteDb.payments.filter((p) => p.status === 'unpaid')
  return [
    { label: 'Collected', value: sum(paid), note: `${paid.length} paid invoices`, cls: 'text-emerald-700' },
    { label: 'This month', value: sum(paid.filter((p) => p.paidAt?.startsWith(month))), note: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), cls: '' },
    { label: 'Outstanding', value: sum(unpaid), note: `${unpaid.length} unpaid`, cls: 'text-amber-700' },
    { label: 'Overdue', value: sum(unpaid.filter(isOverdue)), note: `${unpaid.filter(isOverdue).length} past the due date`, cls: 'text-red-600' }
  ]
})
const invoice = computed(() => siteDb.payments.find((p) => p.id === openId.value) || null)

const markPaid = async (p) => {
  const res = await prompt({
    title: `Mark ${p.invoiceNo} as paid?`,
    message: `${p.business} · ${fmtLKR(p.amount)}`,
    tone: 'success',
    confirmLabel: 'Mark paid',
    input: { label: 'Payment method', value: 'Bank transfer', required: true, presets: ['Bank transfer', 'Card', 'Cash', 'Cheque'] }
  })
  if (!res) return
  site.setInvoiceStatus(p.id, 'paid', res.value)
  show(`${p.invoiceNo} is marked as paid.`, { title: 'Payment recorded', icon: 'check' })
}
const refund = async (p) => {
  if (!(await confirm({ title: `Refund ${p.invoiceNo}?`, message: `${fmtLKR(p.amount)} to ${p.business}. Record the refund here after sending the money.`, tone: 'danger', confirmLabel: 'Mark refunded' }))) return
  site.setInvoiceStatus(p.id, 'refunded')
  show(`${p.invoiceNo} is marked as refunded.`, { title: 'Refund recorded', icon: 'check' })
}
const remind = (p) => {
  site.notify(p.email, { title: 'Payment reminder', message: `Invoice ${p.invoiceNo} for ${fmtLKR(p.amount)} is due on ${fmtDate(p.dueAt)}.`, link: '/profile', tone: 'warn' })
  site.log('payment', `sent a payment reminder for ${p.invoiceNo} to ${p.business}`, '/admin/payments')
  show(`${p.business} will see the reminder in their profile.`, { title: 'Reminder sent', icon: 'bell' })
}
// Only the invoice is printed (see the style block below)
const print = () => {
  document.body.classList.add('print-invoice')
  window.print()
  document.body.classList.remove('print-invoice')
}

const exportCsv = () =>
  downloadCsv(`invoices-${new Date().toISOString().slice(0, 10)}.csv`, [
    ['Invoice', 'Business', 'E-mail', 'Type', 'Description', 'Amount (LKR)', 'Issued', 'Due', 'Status', 'Paid on', 'Method'],
    ...filtered.value.map((p) => [p.invoiceNo, p.business, p.email, p.kind, p.description, p.amount, p.createdAt, p.dueAt, p.status, p.paidAt || '', p.method || ''])
  ])
</script>

<style>
/* Print only the invoice (while body has .print-invoice) */
@media print {
  body.print-invoice * {
    visibility: hidden;
  }
  body.print-invoice #invoice-print,
  body.print-invoice #invoice-print * {
    visibility: visible;
  }
  body.print-invoice #invoice-print {
    position: fixed;
    inset: 0;
    box-shadow: none;
  }
}
</style>
