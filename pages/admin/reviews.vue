<template>
  <AdminShell title="Reviews" eyebrow="Moderation" subtitle="Couples’ reviews only appear on listing pages after you publish them.">
    <template #actions>
      <span class="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-charcoal-soft ring-1 ring-charcoal/10">
        <span class="h-2 w-2 rounded-full" :class="siteDb.settings.moderateReviews ? 'bg-emerald-500' : 'bg-amber-500'" />
        Moderation {{ siteDb.settings.moderateReviews ? 'on' : 'off' }}
        <NuxtLink to="/admin/settings" class="font-medium text-rosewood hover:underline">Change</NuxtLink>
      </span>
    </template>

    <div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-2xl bg-charcoal/[0.035] p-1">
      <button v-for="t in tabs" :key="t.id" type="button" class="adm-tab" :class="{ 'is-on': status === t.id }" @click="status = t.id">
        {{ t.label }} <span class="adm-count">{{ t.count }}</span>
      </button>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      <div class="relative min-w-[220px] flex-1">
        <AppIcon name="search" :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft" />
        <input v-model="q" type="search" class="adm-input !pl-9" placeholder="Search reviews" aria-label="Search reviews">
      </div>
      <select v-model="stars" class="adm-input !w-auto" aria-label="Rating">
        <option :value="0">Any rating</option>
        <option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">{{ n }} star{{ n === 1 ? '' : 's' }}</option>
      </select>
    </div>

    <TransitionGroup v-if="filtered.length" tag="div" name="fade" class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="r in filtered" :key="r.id" class="adm-card flex flex-col p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-full bg-gold-light/50 font-serif text-lg font-semibold text-rosewood-800">{{ r.name[0] }}</span>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold">{{ r.name }}</p>
              <p class="truncate text-xs text-charcoal-soft">{{ r.email }}</p>
            </div>
          </div>
          <AdminBadge :status="r.status" />
        </div>
        <div class="mt-3 flex items-center gap-0.5 text-gold" :aria-label="`${r.rating} out of 5 stars`">
          <AppIcon v-for="n in 5" :key="n" name="star" :size="15" :filled="n <= r.rating" :class="n <= r.rating ? '' : 'text-charcoal/15'" />
        </div>
        <p class="mt-2 font-semibold">{{ r.title }}</p>
        <p class="mt-1 flex-1 text-sm leading-relaxed text-charcoal-soft">{{ r.text }}</p>
        <p class="mt-3 text-xs text-charcoal-soft">
          on <NuxtLink v-if="r.link" :to="r.link" target="_blank" class="font-medium text-rosewood hover:underline">{{ r.listingName }}</NuxtLink><span v-else>{{ r.listingName }}</span>
          · {{ timeAgo(r.createdAt) }}
        </p>
        <div class="mt-4 flex gap-2 border-t border-charcoal/[0.06] pt-4">
          <button v-if="r.status !== 'published'" type="button" class="adm-btn-success flex-1" @click="setStatus(r, 'published')"><AppIcon name="check" :size="15" />Publish</button>
          <button v-if="r.status !== 'hidden'" type="button" class="adm-btn-ghost flex-1" @click="setStatus(r, 'hidden')"><AppIcon name="eyeOff" :size="15" />Hide</button>
          <button type="button" class="adm-icon-btn hover:!bg-red-50 hover:!text-red-600" :aria-label="`Delete review by ${r.name}`" title="Delete" @click="remove(r)"><AppIcon name="trash" :size="17" /></button>
        </div>
      </article>
    </TransitionGroup>
    <div v-else class="adm-card mt-4">
      <AdminEmpty icon="star" title="No reviews here" text="Reviews written on listing pages will appear here." />
    </div>
  </AdminShell>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Reviews – Wedding Hub Admin' })

const site = useSiteData()
const { confirm } = useAdminDialog()
const { show } = useToast()

const status = ref('pending')
const q = ref('')
const stars = ref(0)
const tabs = computed(() => {
  const c = (s) => siteDb.reviews.filter((r) => r.status === s).length
  return [
    { id: 'pending', label: 'Waiting', count: c('pending') },
    { id: 'published', label: 'Published', count: c('published') },
    { id: 'hidden', label: 'Hidden', count: c('hidden') },
    { id: 'all', label: 'All', count: siteDb.reviews.length }
  ]
})
const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  return siteDb.reviews.filter(
    (r) =>
      (status.value === 'all' || r.status === status.value) &&
      (!stars.value || Math.round(r.rating) === stars.value) &&
      (!t || [r.name, r.title, r.text, r.listingName].some((v) => String(v || '').toLowerCase().includes(t)))
  )
})
const setStatus = (r, s) => {
  site.setReviewStatus(r.id, s)
  show(s === 'published' ? `The review now shows on ${r.listingName}.` : 'The review is hidden from the site.', { title: s === 'published' ? 'Review published' : 'Review hidden', icon: s === 'published' ? 'check' : 'eyeOff' })
}
const remove = async (r) => {
  if (!(await confirm({ title: 'Delete this review?', message: `${r.name}’s review on ${r.listingName} will be deleted permanently.`, tone: 'danger', confirmLabel: 'Delete' }))) return
  site.deleteReview(r.id)
  show('The review has been deleted.', { title: 'Deleted', icon: 'trash' })
}
</script>
