// Loads the site data the admin panel manages (listing requests, reviews,
// enquiries…) from browser storage, and reloads it when another tab changes
// it – e.g. an admin approves a listing while the vendor's tab is open.
export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuth()
  const start = () => {
    auth.ensureSampleUsers()
    loadSiteData()
  }
  // Server-rendered pages show the built-in catalog first, so wait until
  // hydration has finished before adding approved listings (no mismatch).
  if (nuxtApp.payload.serverRendered) nuxtApp.hook('app:mounted', start)
  else start()

  window.addEventListener('storage', (e) => {
    if (!e.key || !e.key.startsWith('wh:')) return
    if (e.key === 'wh:users' || e.key === 'wh:session') auth.init()
    else loadSiteData()
  })
})
