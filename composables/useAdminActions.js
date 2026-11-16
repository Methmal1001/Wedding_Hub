// Approve / reject / request-changes flows with their dialogs and toasts,
// shared by the dashboard and the listing requests page.
export const REJECT_REASONS = [
  'Incomplete business details',
  'Photos are missing or unclear',
  'Duplicate of an existing listing',
  'Not a wedding-related service',
  'Contact details could not be verified'
]
export const CHANGE_REQUESTS = [
  'Please add at least 3 clear photos of your work.',
  'Please write a longer description of your services and packages.',
  'Please add a full business address.',
  'Please check your phone number – we could not reach you.'
]

export const useAdminActions = () => {
  const site = useSiteData()
  const { confirm, prompt } = useAdminDialog()
  const { show } = useToast()

  const approve = async (s) => {
    const paid = s.plan !== 'free'
    const res = await prompt({
      title: `Approve ${s.businessName}?`,
      message: `The listing goes live in the catalog straight away${paid ? ` and an invoice for the ${planById(s.plan).name} plan (${fmtLKR(planAmount(s.plan, s.billing))}) is issued` : ''}. The vendor is notified.`,
      tone: 'success',
      icon: 'check',
      confirmLabel: 'Approve & publish',
      checks: [
        { key: 'verified', label: 'Mark as verified', hint: 'Shows a green tick – contact details have been checked.', value: true },
        { key: 'featured', label: 'Feature this listing', hint: 'Shown first in search results.', value: s.plan === 'gold' }
      ]
    })
    if (!res) return false
    site.approveListing(s.ref, res.checks)
    show(`${s.businessName} is now live in the catalog.`, { title: 'Listing approved', icon: 'check' })
    return true
  }

  const reject = async (s) => {
    const res = await prompt({
      title: `Reject ${s.businessName}?`,
      message: 'The vendor will see this reason in their profile.',
      tone: 'danger',
      confirmLabel: 'Reject listing',
      input: { label: 'Reason', required: true, presets: REJECT_REASONS, placeholder: 'Explain why the listing can’t be published…' }
    })
    if (!res) return false
    site.rejectListing(s.ref, res.value)
    show(`${s.businessName} was rejected and the vendor has been told why.`, { title: 'Listing rejected', icon: 'close' })
    return true
  }

  const requestChanges = async (s) => {
    const res = await prompt({
      title: 'Request changes',
      message: `${s.businessName} goes back to the vendor, who can update and resubmit it.`,
      tone: 'warn',
      icon: 'edit',
      confirmLabel: 'Send to vendor',
      input: { label: 'What needs to change?', required: true, presets: CHANGE_REQUESTS }
    })
    if (!res) return false
    site.requestChanges(s.ref, res.value)
    show(`We’ve asked ${s.businessName} to update their listing.`, { title: 'Changes requested', icon: 'mail' })
    return true
  }

  const unpublish = async (s) => {
    const res = await prompt({
      title: `Unpublish ${s.businessName}?`,
      message: 'The listing is removed from the catalog until you approve it again.',
      tone: 'danger',
      confirmLabel: 'Unpublish',
      input: { label: 'Reason', required: true, presets: ['Plan payment overdue', 'Reported by couples', 'Requested by the vendor'] }
    })
    if (!res) return false
    site.unpublishListing(s.ref, res.value)
    show(`${s.businessName} is no longer visible on the site.`, { title: 'Listing unpublished', icon: 'eyeOff' })
    return true
  }

  const remove = async (s) => {
    const ok = await confirm({
      title: 'Delete this request?',
      message: `${s.businessName} (${s.ref}) and its history will be deleted permanently. This can’t be undone.`,
      tone: 'danger',
      confirmLabel: 'Delete'
    })
    if (!ok) return false
    site.deleteSubmission(s.ref)
    show('The request has been deleted.', { title: 'Deleted', icon: 'trash' })
    return true
  }

  return { approve, reject, requestChanges, unpublish, remove }
}

// CSV download used by several admin pages
export const downloadCsv = (filename, rows) => {
  const esc = (v) => {
    let s = String(v ?? '')
    // Stop spreadsheet apps from running user text as a formula
    if (/^[=@\t\r]|^[+-](?![\d\s])/.test(s)) s = `'${s}`
    return `"${s.replace(/"/g, '""')}"`
  }
  const csv = rows.map((r) => r.map(esc).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
