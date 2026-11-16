// Admin pages: only signed-in users with the "admin" role.
// Front-end only – a real site must also check the role on the server.
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const { user } = useAuth()
  if (!user.value) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
  if (user.value.role !== 'admin') {
    useToast().show('The admin panel is only available to the Wedding Hub team.', { title: 'Admins only', icon: 'shield' })
    return navigateTo('/profile')
  }
})
