// Tiny toast notification store used for "coming soon" and favourite feedback.
let timer = null

export const useToast = () => {
  const toast = useState('toast', () => null)

  const show = (message, { title = '', icon = 'sparkles', duration = 3200 } = {}) => {
    toast.value = { id: Date.now(), message, title, icon }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      toast.value = null
    }, duration)
  }

  const comingSoon = (feature) =>
    show(`${feature} will be available in the next release of Wedding Hub.`, {
      title: 'Coming soon',
      icon: 'sparkles'
    })

  const hide = () => {
    toast.value = null
  }

  return { toast, show, comingSoon, hide }
}
