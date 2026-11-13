// Global splash state. useState survives client-side navigation and
// component re-renders, so the splash only plays once per page load.
export const useSplash = () => {
  const done = useState('splash-done', () => false)
  const finish = () => {
    done.value = true
  }
  return { done, finish }
}
