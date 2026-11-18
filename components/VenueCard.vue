<template>
  <article
    class="group relative isolate flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
    :class="large ? 'sm:min-h-[560px]' : ''"
  >
    <img
      :src="venue.image"
      :alt="`${venue.name}, a ${venue.type.toLowerCase()} wedding venue in ${venue.location}`"
      loading="lazy"
      class="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
    >
    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-[#03102E]/95 via-[#03102E]/35 to-transparent transition-opacity duration-500 group-hover:from-[#0A1F5C]/95" />

    <!-- Top badges -->
    <div class="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
      <span class="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-rosewood backdrop-blur">
        {{ venue.type }}
      </span>
      <button
        type="button"
        class="grid h-10 w-10 shrink-0 place-items-center rounded-full backdrop-blur transition-all duration-300 hover:scale-110"
        :class="fav ? 'bg-white text-rose-600 ring-1 ring-rose-200' : 'bg-white/90 text-rose-500 hover:bg-white'"
        :aria-pressed="fav"
        :aria-label="fav ? `Remove ${venue.name} from favourites` : `Save ${venue.name} to favourites`"
        @click="toggleFavourite(venue)"
      >
        <AppIcon :key="String(fav)" name="heart" :size="18" :filled="fav" :class="{ 'animate-heart-pop': fav }" />
      </button>
    </div>

    <!-- Content -->
    <div class="p-5 text-white sm:p-7">
      <div class="flex items-center gap-2 text-sm">
        <AppIcon name="star" :size="15" filled class="text-amber-400" />
        <span class="font-semibold">{{ venue.rating.toFixed(1) }}</span>
        <span class="text-white/60">({{ venue.reviews }} reviews)</span>
      </div>

      <h3 class="mt-2 font-serif font-semibold leading-tight" :class="large ? 'text-3xl sm:text-4xl' : 'text-[1.7rem]'">
        {{ venue.name }}
      </h3>

      <p class="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
        <AppIcon name="pin" :size="15" class="text-green-400" />
        {{ venue.location }}, Sri Lanka
      </p>

      <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-sm">
        <div>
          <dt class="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-blush/80">
            <AppIcon name="users" :size="13" /> Capacity
          </dt>
          <dd class="mt-1 font-medium">{{ venue.capacity }}</dd>
        </div>
        <div>
          <dt class="text-[10px] uppercase tracking-[0.18em] text-blush/80">Price guide</dt>
          <dd class="mt-1 font-medium">{{ venue.price }}</dd>
        </div>
      </dl>

      <button
        type="button"
        class="btn-gold mt-5 w-full !min-h-[46px] sm:w-auto"
        @click="comingSoon(`The ${venue.name} venue page`)"
      >
        View Venue
        <AppIcon name="arrowRight" :size="16" class="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  venue: { type: Object, required: true },
  large: { type: Boolean, default: false }
})
const { isFavourite, toggleFavourite } = useFavourites()
const { comingSoon } = useToast()
const fav = computed(() => isFavourite(props.venue.id))
</script>
