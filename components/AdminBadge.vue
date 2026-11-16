<template>
  <!-- Coloured status pill used across the admin panel -->
  <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="cls">
    <span class="h-1.5 w-1.5 rounded-full" :class="dot" aria-hidden="true" />
    {{ text }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: { type: String, required: true },
  label: { type: String, default: '' }
})

// status → [label, tone]
const MAP = {
  pending: ['Pending', 'amber'],
  changes: ['Changes requested', 'sky'],
  approved: ['Approved', 'green'],
  rejected: ['Rejected', 'red'],
  unpublished: ['Unpublished', 'gray'],
  live: ['Live', 'green'],
  hidden: ['Hidden', 'gray'],
  published: ['Published', 'green'],
  new: ['New', 'amber'],
  forwarded: ['Forwarded', 'sky'],
  closed: ['Closed', 'gray'],
  spam: ['Spam', 'red'],
  confirmed: ['Confirmed', 'sky'],
  ended: ['Ended', 'gray'],
  declined: ['Declined', 'red'],
  paid: ['Paid', 'green'],
  unpaid: ['Unpaid', 'amber'],
  overdue: ['Overdue', 'red'],
  refunded: ['Refunded', 'gray'],
  void: ['Void', 'gray'],
  active: ['Active', 'green'],
  suspended: ['Suspended', 'red'],
  couple: ['Couple', 'rose'],
  vendor: ['Vendor', 'gold'],
  admin: ['Admin', 'dark'],
  free: ['Basic', 'gray'],
  silver: ['Silver', 'sky'],
  gold: ['Gold', 'gold']
}
const TONES = {
  amber: ['bg-amber-50 text-amber-800 ring-1 ring-amber-200', 'bg-amber-500'],
  sky: ['bg-sky-50 text-sky-800 ring-1 ring-sky-200', 'bg-sky-500'],
  green: ['bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200', 'bg-emerald-500'],
  red: ['bg-red-50 text-red-700 ring-1 ring-red-200', 'bg-red-500'],
  gray: ['bg-charcoal/[0.05] text-charcoal-soft ring-1 ring-charcoal/10', 'bg-charcoal-soft/60'],
  rose: ['bg-rosewood-50 text-rosewood-700 ring-1 ring-rosewood-100', 'bg-rosewood'],
  gold: ['bg-gold-light/30 text-gold-dark ring-1 ring-gold/30', 'bg-gold'],
  dark: ['bg-rosewood-900 text-white ring-1 ring-rosewood-900', 'bg-gold-light']
}
const entry = computed(() => MAP[props.status] || [props.status, 'gray'])
const text = computed(() => props.label || entry.value[0])
const cls = computed(() => TONES[entry.value[1]][0])
const dot = computed(() => TONES[entry.value[1]][1])
</script>
