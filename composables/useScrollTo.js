// Smoothly scrolls to a homepage section, accounting for the sticky navbar.
// If the section isn't on the current page (e.g. on /catalog), it navigates
// to the homepage and lets the router scroll to the hash.
export const useScrollTo = () => {
  return (id) => {
    if (!import.meta.client) return
    const el = document.getElementById(id)
    if (!el) {
      navigateTo(id === 'home' ? '/' : { path: '/', hash: `#${id}` })
      return
    }
    const navOffset = 88
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
