// Promise-based confirm / prompt dialogs for the admin panel
// (rendered by components/AdminDialog.vue inside AdminShell).
//
//   const ok = await confirm({ title: 'Delete?', tone: 'danger' })
//   const res = await prompt({ title: 'Reject', input: { label: 'Reason', required: true } })
//   res → null when cancelled, otherwise { value, checks }
export const useAdminDialog = () => {
  const state = useState('admin:dialog', () => null)

  const open = (opts) =>
    new Promise((resolve) => {
      state.value = { confirmLabel: 'Confirm', tone: 'primary', ...opts, resolve }
    })

  const close = (result) => {
    state.value?.resolve(result)
    state.value = null
  }

  const confirm = async (opts) => !!(await open(opts))
  const prompt = (opts) => open(opts)

  return { state, confirm, prompt, close }
}
