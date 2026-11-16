// Restores the signed-in user from browser storage and keeps the account's
// saved favourites in sync.
export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuth()

  // On server-rendered pages, wait until hydration has finished so the
  // signed-in UI (avatar, favourites badge) doesn't cause a hydration mismatch.
  // Client-only pages (/profile, /auth/*) restore immediately so their route
  // middleware sees the user.
  if (nuxtApp.payload.serverRendered) nuxtApp.hook('app:mounted', auth.init)
  else auth.init()

  const favourites = useState('favourites', () => [])
  watch(
    favourites,
    (ids) => {
      if (auth.user.value) auth.syncFavourites(ids)
    },
    { deep: true }
  )
})
