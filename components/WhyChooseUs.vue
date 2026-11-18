<template>
  <section id="why-us" class="relative py-20 sm:py-24 lg:py-28">
    <div class="container-site">
      <SectionHeading
        eyebrow="Why Wedding Hub"
        title="Planning Made Beautifully Simple"
        subtitle="Thousands of Sri Lankan couples trust Wedding Hub to bring every detail of their celebration together."
      />

      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <div v-for="(f, i) in features" :key="f.title" v-reveal="i * 100">
          <article class="feature group relative h-full overflow-hidden rounded-3xl border border-rosewood/10 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift sm:p-8">
            <span class="absolute right-6 top-5 font-serif text-5xl font-semibold text-blush/60 transition-colors duration-500 group-hover:text-white/15">
              0{{ i + 1 }}
            </span>
            <span class="relative grid h-14 w-14 place-items-center rounded-2xl bg-rosewood-50 text-rosewood transition-all duration-500 group-hover:bg-white/15 group-hover:text-blush">
              <AppIcon :name="f.icon" :size="26" :stroke-width="1.5" />
            </span>
            <h3 class="relative mt-6 font-serif text-2xl font-semibold leading-tight text-charcoal transition-colors duration-500 group-hover:text-white">
              {{ f.title }}
            </h3>
            <p class="relative mt-3 text-sm leading-relaxed text-charcoal-soft transition-colors duration-500 group-hover:text-white/80">
              {{ f.text }}
            </p>
          </article>
        </div>
      </div>

      <!-- Testimonial strip -->
      <figure v-reveal class="mx-auto mt-16 max-w-3xl text-center">
        <AppIcon name="quote" :size="36" class="mx-auto text-gold" />
        <blockquote class="mt-4 font-serif text-2xl italic leading-snug text-charcoal sm:text-[2rem]">
          “We found our photographer, florist and a dreamy venue in Galle in a single weekend. Wedding Hub made
          planning feel like part of the celebration.”
        </blockquote>
        <figcaption class="mt-5 text-sm text-charcoal-soft">
          <span class="font-semibold text-rosewood">Nethmi &amp; Kavindu</span> · Married in Galle, 2026
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: 'shield',
    title: 'Trusted Wedding Vendors',
    text: 'Every verified professional is reviewed by our team, with genuine ratings from real couples.'
  },
  {
    icon: 'compass',
    title: 'Easy Vendor Discovery',
    text: 'Search by service and location to compare photographers, salons, venues and more in minutes.'
  },
  {
    icon: 'sparkles',
    title: 'Beautiful Wedding Inspiration',
    text: 'Curated ideas from poruwa décor to beach ceremonies to help you shape your perfect day.'
  },
  {
    icon: 'layers',
    title: 'Everything in One Place',
    text: 'Shortlist favourites, plan your budget and connect with vendors from a single elegant hub.'
  }
]
</script>

<style scoped>
.feature::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #0049F2 0%, #002A8F 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
}
.feature:hover::before {
  opacity: 1;
}
</style>
