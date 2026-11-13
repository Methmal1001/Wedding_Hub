<template>
  <div class="relative min-h-screen bg-ivory">
    <!-- Splash plays once per page load; useState keeps it from restarting -->
    <Transition name="splash">
      <SplashScreen v-if="!splashDone" @finished="finishSplash" />
    </Transition>

    <!-- Homepage renders underneath so images are already loaded when the splash lifts -->
    <div :aria-hidden="!splashDone" :inert="!splashDone || undefined">
      <AppNavbar />
      <main>
        <HeroSection :ready="splashDone" />
        <CategorySection />
        <VendorSection />
        <VenueSection />
        <InspirationBanner />
        <WhyChooseUs />
        <BusinessCTA />
      </main>
      <AppFooter />
    </div>

    <AppToast />
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Wedding Hub – Where Your Forever Begins',
  ogTitle: 'Wedding Hub – Sri Lanka’s Premium Wedding Directory',
  description:
    'Discover trusted wedding vendors, beautiful venues, photographers, bridal salons and inspiring wedding ideas across Sri Lanka.',
  ogDescription:
    'Discover trusted wedding vendors, beautiful venues, photographers, bridal salons and inspiring wedding ideas across Sri Lanka.',
  ogImage: '/images/hero-couple.jpg'
})

const { done: splashDone, finish } = useSplash()

const finishSplash = () => {
  finish()
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
}
</script>
