// Pages that need a signed-in user (e.g. /profile). Accounts live in the
// browser, so this only runs on the client (those pages are client-rendered).
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const { user } = useAuth()
  if (!user.value) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
})
