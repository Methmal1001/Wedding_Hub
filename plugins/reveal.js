// v-reveal: fades/slides elements in when they enter the viewport.
// Usage: <div v-reveal> or <div v-reveal="150"> (delay in ms)
// The class is applied on the client only (keeps SSR/hydration markup identical);
// the splash screen covers the page while this happens, so there is no flash.
export default defineNuxtPlugin((nuxtApp) => {
  let observer = null

  const getObserver = () => {
    if (observer || typeof IntersectionObserver === 'undefined') return observer
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    },
    mounted(el, binding) {
      el.classList.add('reveal')
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      const obs = getObserver()
      if (obs) obs.observe(el)
      else el.classList.add('is-visible')
    },
    unmounted(el) {
      observer?.unobserve(el)
    }
  })
})
