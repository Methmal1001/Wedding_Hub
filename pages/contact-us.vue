<template>
  <div class="min-h-screen bg-ivory">
    <AppNavbar />

    <main>
      <section class="relative isolate overflow-hidden bg-rosewood-900 text-white">
        <img src="/images/business-cta.jpg" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover opacity-20">
        <div aria-hidden="true" class="absolute inset-0 -z-10 bg-gradient-to-br from-rosewood-900 via-rosewood-900/90 to-rosewood-800/75" />
        <div aria-hidden="true" class="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

        <div class="container-site relative py-16 sm:py-20 lg:py-24">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white">
            <AppIcon name="arrowRight" :size="15" class="rotate-180" />
            Back to home
          </NuxtLink>
          <p class="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold-light ring-1 ring-white/20">
            <AppIcon name="mail" :size="14" />
            We’re here to help
          </p>
          <h1 class="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
            Let’s talk about your
            <span class="italic text-gold-light"> big day.</span>
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Questions about finding a vendor or growing your wedding business? Send us a note and explore the best way to reach our team.
          </p>
        </div>
      </section>

      <section class="container-site grid gap-8 py-14 sm:py-18 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:py-20">
        <div class="space-y-7">
          <div>
            <p class="eyebrow">Get in touch</p>
            <h2 class="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">We’d love to hear from you</h2>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-charcoal-soft">
              Reach out with a question, feedback, or a little more about what you’re planning. We’ll point you in the right direction.
            </p>
          </div>

          <div class="space-y-3">
            <a
              href="mailto:hello@weddinghub.lk"
              class="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-rosewood/5 transition hover:-translate-y-0.5 hover:ring-rosewood/20"
            >
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rosewood-50 text-rosewood">
                <AppIcon name="mail" :size="20" />
              </span>
              <span>
                <span class="block text-xs font-medium uppercase tracking-[0.16em] text-charcoal-soft">Email</span>
                <span class="mt-1 block font-medium text-charcoal group-hover:text-rosewood">hello@weddinghub.lk</span>
              </span>
            </a>

            <a
              href="tel:+94112345678"
              class="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-rosewood/5 transition hover:-translate-y-0.5 hover:ring-rosewood/20"
            >
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blush-light text-rosewood">
                <AppIcon name="phone" :size="20" />
              </span>
              <span>
                <span class="block text-xs font-medium uppercase tracking-[0.16em] text-charcoal-soft">Phone</span>
                <span class="mt-1 block font-medium text-charcoal group-hover:text-rosewood">+94 11 234 5678</span>
              </span>
            </a>

            <div class="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-rosewood/5">
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold-dark">
                <AppIcon name="pin" :size="20" />
              </span>
              <div>
                <p class="text-xs font-medium uppercase tracking-[0.16em] text-charcoal-soft">Visit us</p>
                <p class="mt-1 font-medium leading-relaxed text-charcoal">No. 42, Galle Road,<br>Colombo 03, Sri Lanka</p>
                <a
                  href="https://maps.google.com/?q=No.+42,+Galle+Road,+Colombo+03,+Sri+Lanka"
                  target="_blank"
                  rel="noreferrer"
                  class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-rosewood hover:underline"
                >
                  View on map
                  <AppIcon name="external" :size="14" />
                </a>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 border-t border-rosewood/10 pt-5 text-sm text-charcoal-soft">
            <AppIcon name="clock" :size="18" class="shrink-0 text-gold-dark" />
            <p>Office hours: Monday – Saturday, 9.00 am – 6.00 pm</p>
          </div>

          <div class="rounded-2xl bg-gradient-to-br from-rosewood-900 to-rosewood-800 p-5 text-white sm:p-6">
            <p class="font-serif text-xl font-semibold">Are you a wedding professional?</p>
            <p class="mt-1 text-sm leading-relaxed text-white/75">Introduce your business to couples planning their day.</p>
            <NuxtLink to="/list-your-business" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-light transition hover:text-white">
              List your business
              <AppIcon name="arrowRight" :size="16" />
            </NuxtLink>
          </div>
        </div>

        <div class="rounded-[28px] bg-white p-6 shadow-lift ring-1 ring-rosewood/10 sm:p-9">
          <p class="eyebrow">Send a message</p>
          <h2 class="mt-2 font-serif text-3xl font-semibold text-charcoal">How can we help?</h2>
          <p class="mt-2 text-sm leading-relaxed text-charcoal-soft">
            Fill in the form and tell us a little about what you need.
          </p>

          <div v-if="submitted" class="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-800 ring-1 ring-emerald-200" role="status">
            Thanks, {{ submittedName }}. This prototype doesn’t send or store messages yet. Please use the email or phone details to reach us.
          </div>

          <form class="mt-7 space-y-5" @submit.prevent="submitMessage">
            <div class="grid gap-5 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-charcoal">First name <span class="text-rosewood">*</span></span>
                <input v-model="form.firstName" name="firstName" type="text" autocomplete="given-name" required class="contact-field" placeholder="Your first name">
              </label>
              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-charcoal">Last name <span class="text-rosewood">*</span></span>
                <input v-model="form.lastName" name="lastName" type="text" autocomplete="family-name" required class="contact-field" placeholder="Your last name">
              </label>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-charcoal">Email address <span class="text-rosewood">*</span></span>
                <input v-model="form.email" name="email" type="email" autocomplete="email" required class="contact-field" placeholder="you@example.com">
              </label>
              <label class="block">
                <span class="mb-1.5 block text-sm font-medium text-charcoal">Phone number <span class="text-rosewood">*</span></span>
                <input v-model="form.phone" name="phone" type="tel" autocomplete="tel" required class="contact-field" placeholder="+94">
              </label>
            </div>

            <label class="block">
              <span class="mb-1.5 block text-sm font-medium text-charcoal">Message <span class="text-rosewood">*</span></span>
              <textarea v-model="form.message" name="message" rows="5" required class="contact-field resize-y" placeholder="Tell us how we can help..." />
            </label>

            <p class="text-xs leading-relaxed text-charcoal-soft">
              This is a demo contact form. Submissions are not sent or saved.
            </p>
            <button type="submit" class="btn-primary btn-shine w-full sm:w-auto">
              Submit message
              <AppIcon name="arrowRight" :size="16" />
            </button>
          </form>
        </div>
      </section>
    </main>

    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Contact Us – Wedding Hub',
  description: 'Get in touch with Wedding Hub for help finding wedding vendors or listing your wedding business in Sri Lanka.'
})

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: ''
})

const submitted = ref(false)
const submittedName = ref('')

const submitMessage = () => {
  submittedName.value = form.firstName.trim() || 'there'
  submitted.value = true
}
</script>

<style scoped>
.contact-field {
  @apply min-h-12 w-full rounded-xl border border-rosewood/15 bg-ivory px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-charcoal-soft/55 focus:border-rosewood focus:ring-2 focus:ring-rosewood/10;
}
</style>
