<template>
  <!-- Listing identity card: sits just under the paid banner -->
  <section class="container-site relative z-10 -mt-10 sm:-mt-14">
    <div class="rounded-[28px] bg-white p-5 shadow-lift ring-1 ring-rosewood/10 sm:p-7">
      <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-y-1 text-xs text-charcoal-soft">
        <NuxtLink to="/" class="transition hover:text-rosewood">Home</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <NuxtLink to="/catalog" class="transition hover:text-rosewood">Categories</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <NuxtLink :to="catalogLink({ category: listing.categoryKey })" class="transition hover:text-rosewood">{{ listing.categoryName }}</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <NuxtLink :to="catalogLink({ category: listing.categoryKey, sub: listing.sub })" class="transition hover:text-rosewood">{{ listing.sub }}</NuxtLink>
        <span class="mx-2 text-charcoal-soft/40">/</span>
        <span class="text-rosewood">{{ listing.name }}</span>
      </nav>

      <div class="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-4 sm:gap-5">
          <img
            v-if="listing.avatar"
            :src="listing.avatar"
            :alt="listing.owner || listing.name"
            class="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-soft ring-4 ring-blush-light sm:h-24 sm:w-24"
          >
          <span
            v-else
            class="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rosewood to-rosewood-800 font-serif text-3xl font-semibold text-white shadow-soft ring-4 ring-blush-light sm:h-24 sm:w-24"
            aria-hidden="true"
          >
            {{ initials }}
          </span>

          <div class="min-w-0">
            <p class="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-dark">
              {{ listing.sub }}
              <span v-if="listing.verified" class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] tracking-normal text-emerald-700 ring-1 ring-emerald-200">
                <AppIcon name="verified" :size="12" />
                Verified
              </span>
            </p>
            <h1 class="mt-1.5 font-serif text-[2rem] font-semibold leading-[1.05] text-charcoal sm:text-5xl">{{ listing.name }}</h1>
            <p class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-charcoal-soft">
              <span v-if="listing.rating" class="flex items-center gap-1 font-semibold text-charcoal">
                <AppIcon name="star" :size="15" filled class="text-amber-400" />
                {{ listing.rating.toFixed(1) }}
                <span v-if="listing.reviewCount" class="font-normal text-charcoal-soft">({{ listing.reviewCount }} reviews)</span>
              </span>
              <span class="flex items-center gap-1">
                <AppIcon name="pin" :size="15" class="text-green-600" />
                {{ listing.area || listing.location }}
              </span>
              <span v-if="listing.owner">by {{ listing.owner }}</span>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <a v-if="listing.phones.length" :href="`tel:${listing.phones[0].replace(/[^\d+]/g, '')}`" class="btn-primary !min-h-[46px] !px-5 text-sm">
            <AppIcon name="phone" :size="16" />
            Call now
          </a>
          <button type="button" class="btn-outline !min-h-[46px] !px-5 text-sm" @click="$emit('enquire')">
            <AppIcon name="mail" :size="16" />
            Send enquiry
          </button>
          <button
            type="button"
            class="icon-btn"
            :class="fav ? '!bg-rose-50 !text-rose-600 !ring-rose-300' : '!text-rose-500 hover:!bg-rose-50'"
            :aria-pressed="fav"
            :aria-label="fav ? 'Remove from favourites' : 'Save to favourites'"
            @click="toggleFavourite(listing)"
          >
            <AppIcon :key="String(fav)" name="heart" :size="17" :filled="fav" :class="{ 'animate-heart-pop': fav }" />
          </button>
          <!-- Share: device share sheet, copy link, or share to an app -->
          <div ref="shareBox" class="relative">
            <button
              type="button"
              class="icon-btn"
              :class="{ 'is-on': shareOpen }"
              aria-label="Share this listing"
              title="Share"
              aria-haspopup="menu"
              :aria-expanded="shareOpen"
              @click="shareOpen = !shareOpen"
            >
              <AppIcon name="share" :size="18" />
            </button>
            <Transition name="share-pop">
              <div
                v-if="shareOpen"
                class="absolute bottom-[calc(100%+10px)] right-0 z-50 w-60 rounded-2xl bg-white p-1.5 shadow-lift ring-1 ring-rosewood/10"
                role="menu"
              >
                <p class="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-charcoal-soft">Share this listing</p>
                <button v-if="canNativeShare" type="button" role="menuitem" class="share-item" @click="nativeShare">
                  <span class="share-ico bg-rosewood-50 text-rosewood"><AppIcon name="share" :size="15" /></span>
                  Share via…
                </button>
                <button type="button" role="menuitem" class="share-item" @click="copyLink">
                  <span class="share-ico" :class="copied ? 'bg-emerald-50 text-emerald-600' : 'bg-gold-light/40 text-gold-dark'">
                    <AppIcon :name="copied ? 'check' : 'copy'" :size="15" />
                  </span>
                  {{ copied ? 'Link copied!' : 'Copy link' }}
                </button>
                <a v-for="t in shareTargets" :key="t.label" :href="t.href" target="_blank" rel="noopener noreferrer" role="menuitem" class="share-item" @click="shareOpen = false">
                  <span class="share-ico" :class="t.cls"><AppIcon :name="t.icon" :size="15" /></span>
                  {{ t.label }}
                </a>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { catalogLink } from '~/composables/useCatalog'

const props = defineProps({ listing: { type: Object, required: true } })
defineEmits(['enquire'])

const { isFavourite, toggleFavourite } = useFavourites()
const { show } = useToast()
const fav = computed(() => isFavourite(props.listing.id))

const initials = computed(() =>
  props.listing.name
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
)

// ---- share menu ----
const shareOpen = ref(false)
const shareBox = ref(null)
const copied = ref(false)
const canNativeShare = ref(false)
const pageUrl = ref('')
const shareText = computed(() => `${props.listing.name} on Wedding Hub`)
const shareTargets = computed(() => {
  const url = encodeURIComponent(pageUrl.value)
  const text = encodeURIComponent(shareText.value)
  return [
    { label: 'WhatsApp', icon: 'whatsapp', cls: 'bg-[#25D366]/10 text-[#1EBE5A]', href: `https://wa.me/?text=${text}%20${url}` },
    { label: 'Facebook', icon: 'facebook', cls: 'bg-[#1877F2]/10 text-[#1877F2]', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: 'X (Twitter)', icon: 'x', cls: 'bg-charcoal/[0.06] text-charcoal', href: `https://twitter.com/intent/tweet?text=${text}&url=${url}` },
    { label: 'E-mail', icon: 'mail', cls: 'bg-sky-50 text-sky-600', href: `mailto:?subject=${text}&body=${text}%0A${url}` }
  ]
})

const nativeShare = async () => {
  shareOpen.value = false
  try {
    await navigator.share({ title: props.listing.name, text: shareText.value, url: pageUrl.value })
  } catch {
    // Share sheet dismissed – nothing to do.
  }
}

// Clipboard API needs a secure page (https/localhost); fall back to execCommand.
const copyLink = async () => {
  let ok = false
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    ok = true
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: pageUrl.value })
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    try {
      ok = document.execCommand('copy')
    } catch {}
    ta.remove()
  }
  if (!ok) return show('Your browser blocked copying. Copy the address from the address bar instead.', { title: 'Couldn’t copy', icon: 'close' })
  copied.value = true
  show('The link to this listing is on your clipboard.', { title: 'Link copied', icon: 'check' })
  setTimeout(() => {
    copied.value = false
    shareOpen.value = false
  }, 1200)
}

const onDocClick = (e) => {
  if (shareBox.value && !shareBox.value.contains(e.target)) shareOpen.value = false
}
const onKey = (e) => {
  if (e.key === 'Escape') shareOpen.value = false
}
onMounted(() => {
  pageUrl.value = window.location.href.split('#')[0]
  canNativeShare.value = typeof navigator.share === 'function'
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.icon-btn {
  @apply grid h-[46px] w-[46px] place-items-center rounded-full text-rosewood ring-1 ring-rosewood/25 transition hover:bg-rosewood-50;
}
.icon-btn.is-on {
  @apply bg-rosewood text-white ring-rosewood hover:bg-rosewood-700;
}
.share-item {
  @apply flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-charcoal transition hover:bg-rosewood-50;
}
.share-ico {
  @apply grid h-8 w-8 shrink-0 place-items-center rounded-lg;
}
.share-pop-enter-active,
.share-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: bottom right;
}
.share-pop-enter-from,
.share-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.95);
}
</style>
