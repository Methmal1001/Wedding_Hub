<template>
  <section id="business" class="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10 lg:pb-28">
    <div class="relative isolate mx-auto max-w-site overflow-hidden rounded-[32px] bg-[#061540] shadow-lift sm:rounded-[40px]">
      <!-- photo, kept in natural colour -->
      <img
        src="/images/business-cta.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        class="absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-60"
      >
      <!-- dark on the left for the text, opening up to the photo on the right -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#03102E] via-[#06205F]/90 to-[#0049F2]/45" />
      <!-- brand glows -->
      <div aria-hidden="true" class="cta-glow absolute -right-20 -top-28 -z-10 h-[420px] w-[420px] rounded-full bg-gold-light/30 blur-3xl" />
      <div aria-hidden="true" class="cta-glow absolute -bottom-32 left-1/4 -z-10 h-[360px] w-[360px] rounded-full bg-[#4DFF00]/20 blur-3xl [animation-delay:-4s]" />
      <div aria-hidden="true" class="cta-glow absolute -left-24 top-10 -z-10 h-[320px] w-[320px] rounded-full bg-rosewood/50 blur-3xl [animation-delay:-8s]" />
      <!-- fine dot texture + rings -->
      <div aria-hidden="true" class="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div aria-hidden="true" class="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-gold-light/25" />
      <div aria-hidden="true" class="pointer-events-none absolute -right-8 -top-8 -z-10 h-80 w-80 rounded-full border border-[#4DFF00]/20" />

      <div class="grid items-center gap-12 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:px-16 lg:py-20 xl:px-20">
        <div v-reveal class="text-white">
          <p class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light ring-1 ring-white/20 backdrop-blur">
            <AppIcon name="sparkles" :size="14" />
            For wedding professionals
          </p>
          <h2 class="mt-5 font-serif text-[2.4rem] font-semibold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
            Are You a Wedding <span class="cta-accent italic">Professional?</span>
          </h2>
          <p class="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Showcase your services, connect with couples, and grow your wedding business with Wedding Hub.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/list-your-business" class="btn-gold btn-shine">
              <AppIcon name="store" :size="17" />
              List Your Business
            </NuxtLink>
            <NuxtLink to="/list-your-business#plans" class="btn border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-rosewood-900">
              View Advertising Plans
            </NuxtLink>
          </div>
          <div class="mt-8 flex items-center gap-3 text-sm text-white/80">
            <div class="flex -space-x-2">
              <span v-for="c in ['#00F2FF', '#4DFF00', '#F43F5E', '#FBBF24']" :key="c" class="h-7 w-7 rounded-full ring-2 ring-[#06205F]" :style="{ background: c }" />
            </div>
            <span><strong class="font-semibold text-white">1,100+</strong> vendors already growing with us</span>
          </div>
        </div>

        <ul v-reveal="150" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <li
            v-for="b in benefits"
            :key="b.title"
            class="benefit group relative overflow-hidden rounded-2xl bg-white/[0.08] p-5 text-white ring-1 ring-white/15 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.14] hover:ring-white/30"
          >
            <span class="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r" :class="b.bar" />
            <span class="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" :class="b.tile">
              <AppIcon :name="b.icon" :size="22" />
            </span>
            <p class="mt-4 font-serif text-xl font-semibold">{{ b.title }}</p>
            <p class="mt-1 text-sm leading-relaxed text-white/75">{{ b.text }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  { icon: 'users', title: '18,000+ couples', text: 'Reach engaged couples actively planning their wedding.', tile: 'from-[#00F2FF] to-[#0049F2] shadow-[#0049F2]/40', bar: 'from-[#00F2FF] to-[#0049F2]' },
  { icon: 'verified', title: 'Verified badge', text: 'Build trust with a profile reviewed by our team.', tile: 'from-[#4DFF00] to-[#00B894] shadow-[#00B894]/40', bar: 'from-[#4DFF00] to-[#00B894]' },
  { icon: 'trending', title: 'Grow bookings', text: 'Get enquiries straight from your profile and listings.', tile: 'from-[#FB7185] to-[#E11D48] shadow-[#E11D48]/40', bar: 'from-[#FB7185] to-[#E11D48]' },
  { icon: 'calendar', title: 'Manage availability', text: 'Show couples your open dates at a glance.', tile: 'from-[#FCD34D] to-[#F59E0B] shadow-[#F59E0B]/40', bar: 'from-[#FCD34D] to-[#F59E0B]' }
]
</script>

<style scoped>
.cta-accent {
  background: linear-gradient(90deg, #00f2ff, #7df7ff 45%, #4dff00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-right: 0.08em;
}
.cta-glow {
  animation: cta-drift 14s ease-in-out infinite alternate;
}
@keyframes cta-drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30px, 20px) scale(1.12); }
}
@media (prefers-reduced-motion: reduce) {
  .cta-glow { animation: none; }
}
</style>
