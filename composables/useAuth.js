// Front-end only accounts (no backend): users live in this browser's
// localStorage. Passwords are salted + hashed (SHA-256) before storing, but
// this is a demo – a real site must authenticate on a server.
const USERS_KEY = 'wh:users'
const SESSION_KEY = 'wh:session'

export const DEMO_ACCOUNT = { email: 'demo@weddinghub.lk', password: 'Demo@2026' }

// ---- storage helpers (every access can throw in private mode etc.) ---------
const read = (store, key, fallback) => {
  try {
    const raw = store?.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const write = (store, key, value) => {
  try {
    if (value === null) store?.removeItem(key)
    else store?.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
const local = () => (import.meta.client ? window.localStorage : null)
const session = () => (import.meta.client ? window.sessionStorage : null)

const loadUsers = () => read(local(), USERS_KEY, [])
const saveUsers = (users) => {
  if (!write(local(), USERS_KEY, users)) throw new Error('Your browser storage is full or blocked, so the account could not be saved.')
}

// ---- password hashing -----------------------------------------------------
const randomId = (bytes = 12) => {
  const a = new Uint8Array(bytes)
  crypto.getRandomValues(a)
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('')
}
const hashPassword = async (password, salt) => {
  const text = `${salt}:${password}`
  if (crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback for non-secure origins (e.g. http on a LAN IP): simple FNV-1a.
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return `fnv-${(h >>> 0).toString(16)}`
}

// Public user object – never expose the hash/salt to components.
const toPublic = (u) => {
  if (!u) return null
  const { passwordHash, salt, ...rest } = u
  return rest
}

export const normaliseEmail = (e) => String(e || '').trim().toLowerCase()

export const passwordStrength = (pw = '') => {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const level = Math.min(4, score)
  return { score: level, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][level] }
}

export const WEDDING_CHECKLIST = [
  { id: 'budget', label: 'Set our wedding budget' },
  { id: 'nakath', label: 'Get auspicious times (nakath)' },
  { id: 'venue', label: 'Book the venue' },
  { id: 'photo', label: 'Book photographer & videographer' },
  { id: 'attire', label: 'Choose bridal & groom wear' },
  { id: 'beauty', label: 'Book bridal dressing' },
  { id: 'invites', label: 'Send invitations' },
  { id: 'cake', label: 'Order the wedding cake' }
]

export const useAuth = () => {
  const user = useState('auth:user', () => null)
  const ready = useState('auth:ready', () => false)
  const favourites = useState('favourites', () => [])

  const persist = (patch) => {
    if (!user.value) return
    const users = loadUsers()
    const i = users.findIndex((u) => u.id === user.value.id)
    if (i === -1) return
    users[i] = { ...users[i], ...patch, updatedAt: new Date().toISOString() }
    saveUsers(users)
    user.value = toPublic(users[i])
  }

  const startSession = (u, remember) => {
    write(remember ? local() : session(), SESSION_KEY, { userId: u.id })
    write(remember ? session() : local(), SESSION_KEY, null)
    // Keep anything saved as a guest, plus the account's own favourites.
    favourites.value = [...new Set([...(u.favourites || []), ...favourites.value])]
    user.value = toPublic(u)
    persist({ favourites: favourites.value, lastLoginAt: new Date().toISOString() })
  }

  // Restore the session (called once by plugins/auth.client.js)
  const init = () => {
    const s = read(session(), SESSION_KEY, null) || read(local(), SESSION_KEY, null)
    const u = s && loadUsers().find((x) => x.id === s.userId)
    if (u) {
      user.value = toPublic(u)
      favourites.value = [...new Set([...(u.favourites || []), ...favourites.value])]
    }
    ready.value = true
  }

  const register = async (data) => {
    const users = loadUsers()
    const email = normaliseEmail(data.email)
    if (users.some((u) => u.email === email)) throw new Error('An account with this e-mail already exists. Try logging in instead.')
    const salt = randomId()
    const record = {
      id: `u_${randomId(8)}`,
      role: data.role === 'vendor' ? 'vendor' : 'couple',
      name: data.name.trim(),
      email,
      phone: (data.phone || '').trim(),
      city: data.city || '',
      partnerName: (data.partnerName || '').trim(),
      weddingDate: data.weddingDate || '',
      businessName: (data.businessName || '').trim(),
      businessCategory: data.businessCategory || '',
      bio: '',
      avatar: '',
      favourites: [],
      enquiries: [],
      checklist: [],
      createdAt: new Date().toISOString(),
      salt,
      passwordHash: await hashPassword(data.password, salt)
    }
    saveUsers([...users, record])
    startSession(record, true)
    return user.value
  }

  const login = async (email, password, remember = true) => {
    const u = loadUsers().find((x) => x.email === normaliseEmail(email))
    if (!u || (await hashPassword(password, u.salt)) !== u.passwordHash) {
      throw new Error('That e-mail and password don’t match. Please try again.')
    }
    startSession(u, remember)
    return user.value
  }

  // Creates the demo account the first time it is used.
  const ensureDemoAccount = async () => {
    if (loadUsers().some((u) => u.email === DEMO_ACCOUNT.email)) return
    const date = new Date()
    date.setDate(date.getDate() + 180)
    const salt = randomId()
    saveUsers([
      ...loadUsers(),
      {
        id: `u_${randomId(8)}`,
        role: 'couple',
        name: 'Sanduni Perera',
        partnerName: 'Kasun',
        email: DEMO_ACCOUNT.email,
        phone: '+94 77 000 0000',
        city: 'Colombo',
        weddingDate: date.toISOString().slice(0, 10),
        businessName: '',
        businessCategory: '',
        bio: 'Planning a garden wedding with a traditional poruwa ceremony.',
        avatar: '',
        favourites: ['c8', 'c9', 'c18'],
        enquiries: [],
        checklist: ['budget', 'nakath'],
        createdAt: new Date().toISOString(),
        salt,
        passwordHash: await hashPassword(DEMO_ACCOUNT.password, salt)
      }
    ])
  }

  const logout = () => {
    write(local(), SESSION_KEY, null)
    write(session(), SESSION_KEY, null)
    user.value = null
    favourites.value = []
  }

  const updateProfile = (patch) => {
    const clean = { ...patch }
    delete clean.id
    delete clean.email
    delete clean.passwordHash
    delete clean.salt
    persist(clean)
  }

  const changePassword = async (current, next) => {
    const users = loadUsers()
    const u = users.find((x) => x.id === user.value?.id)
    if (!u || (await hashPassword(current, u.salt)) !== u.passwordHash) throw new Error('Your current password is incorrect.')
    const salt = randomId()
    persist({ salt, passwordHash: await hashPassword(next, salt) })
  }

  const deleteAccount = () => {
    if (!user.value) return
    saveUsers(loadUsers().filter((u) => u.id !== user.value.id))
    logout()
  }

  const addEnquiry = (enquiry) => {
    if (!user.value) return
    const list = [{ id: randomId(6), sentAt: new Date().toISOString(), ...enquiry }, ...(user.value.enquiries || [])]
    persist({ enquiries: list })
  }

  const toggleChecklist = (id) => {
    if (!user.value) return
    const set = new Set(user.value.checklist || [])
    set.has(id) ? set.delete(id) : set.add(id)
    persist({ checklist: [...set] })
  }

  // Called when favourites change (see plugins/auth.client.js)
  const syncFavourites = (ids) => persist({ favourites: ids })

  return {
    user,
    ready,
    isLoggedIn: computed(() => !!user.value),
    init,
    register,
    login,
    logout,
    ensureDemoAccount,
    updateProfile,
    changePassword,
    deleteAccount,
    addEnquiry,
    toggleChecklist,
    syncFavourites
  }
}
