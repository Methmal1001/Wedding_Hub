<template>
  <section id="business" class="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10 lg:pb-28">
    <div class="relative isolate mx-auto max-w-site overflow-hidden rounded-[32px] bg-rosewood-800 sm:rounded-[40px]">
      <img
        src="/images/business-cta.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        class="absolute inset-0 -z-10 h-full w-full object-cover opacity-25 mix-blend-luminosity"
      >
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-rosewood/95 via-rosewood-800/90 to-[#241319]/95" />
      <!-- Decorative rings -->
      <div aria-hidden="true" class="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-blush/15" />
      <div aria-hidden="true" class="pointer-events-none absolute -right-8 -top-8 -z-10 h-80 w-80 rounded-full border border-gold/15" />

      <div class="grid items-center gap-12 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:px-20 lg:py-24">
        <div v-reveal class="text-white">
          <p class="eyebrow !text-blush">For wedding professionals</p>
          <h2 class="mt-4 font-serif text-[2.4rem] font-semibold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
            Are You a Wedding <span class="italic text-blush">Professional?</span>
          </h2>
          <p class="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Showcase your services, connect with couples, and grow your wedding business with Wedding Hub.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/list-your-business" class="btn-gold btn-shine">
              <AppIcon name="store" :size="17" />
              List Your Business
            </NuxtLink>
            <NuxtLink to="/list-your-business#plans" class="btn-ghost-light">
              View Advertising Plans
            </NuxtLink>
          </div>
        </div>

        <ul v-reveal="150" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <li
            v-for="b in benefits"
            :key="b.title"
            class="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-blush/40 hover:bg-white/10"
          >
            <span class="grid h-11 w-11 place-items-center rounded-xl bg-blush/15 text-blush">
              <AppIcon :name="b.icon" :size="22" />
            </span>
            <p class="mt-4 font-serif text-xl font-semibold">{{ b.title }}</p>
            <p class="mt-1 text-sm leading-relaxed text-white/70">{{ b.text }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>

const benefits = [
  { icon: 'users', title: '18,000+ couples', text: 'Reach engaged couples actively planning their wedding.' },
  { icon: 'verified', title: 'Verified badge', text: 'Build trust with a profile reviewed by our team.' },
  { icon: 'trending', title: 'Grow bookings', text: 'Get enquiries straight from your profile and listings.' },
  { icon: 'calendar', title: 'Manage availability', text: 'Show couples your open dates at a glance.' }
]
</script>
