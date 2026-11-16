// Front-end only accounts (no backend): users live in this browser's
// localStorage. Passwords are salted + hashed (SHA-256) before storing, but
// this is a demo – a real site must authenticate on a server.
const USERS_KEY = 'wh:users'
const SESSION_KEY = 'wh:session'

export const DEMO_ACCOUNT = { email: 'demo@weddinghub.lk', password: 'Demo@2026' }
export const ADMIN_ACCOUNT = { email: 'admin@weddinghub.lk', password: 'Admin@2026' }
export const USER_ROLES = ['couple', 'vendor', 'admin']

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
const SEED_USERS_KEY = 'wh:users-seeded-v1'
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
    if (u && u.status === 'suspended') {
      write(local(), SESSION_KEY, null)
      write(session(), SESSION_KEY, null)
    } else if (u) {
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
    // The demo accounts are created the first time someone logs in with them.
    if (normaliseEmail(email) === DEMO_ACCOUNT.email) await ensureDemoAccount()
    if (normaliseEmail(email) === ADMIN_ACCOUNT.email) await ensureAdminAccount()
    const u = loadUsers().find((x) => x.email === normaliseEmail(email))
    if (!u || (await hashPassword(password, u.salt)) !== u.passwordHash) {
      throw new Error('That e-mail and password don’t match. Please try again.')
    }
    if (u.status === 'suspended') {
      throw new Error('This account has been suspended. Please contact hello@weddinghub.lk for help.')
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

  const ensureAdminAccount = async () => {
    if (loadUsers().some((u) => u.email === ADMIN_ACCOUNT.email)) return
    const salt = randomId()
    saveUsers([
      ...loadUsers(),
      {
        id: `u_${randomId(8)}`,
        role: 'admin',
        name: 'Admin Team',
        email: ADMIN_ACCOUNT.email,
        phone: '+94 11 000 0100',
        city: 'Colombo',
        partnerName: '',
        weddingDate: '',
        businessName: '',
        businessCategory: '',
        bio: 'Wedding Hub moderation team.',
        avatar: '',
        favourites: [],
        enquiries: [],
        checklist: [],
        createdAt: new Date().toISOString(),
        salt,
        passwordHash: await hashPassword(ADMIN_ACCOUNT.password, salt)
      }
    ])
  }

  // A few sample members so the admin's user list isn't empty. They can't log
  // in (no password is set).
  const ensureSampleUsers = () => {
    if (!import.meta.client || read(local(), SEED_USERS_KEY, null)) return
    const ago = (d) => new Date(Date.now() - d * 864e5).toISOString()
    const base = { city: 'Colombo', partnerName: '', weddingDate: '', businessName: '', businessCategory: '', bio: '', avatar: '', favourites: [], enquiries: [], checklist: [], salt: '', passwordHash: 'no-login' }
    const sample = [
      { name: 'Hiruni Wickramasinghe', email: 'hiruni@example.com', role: 'couple', partnerName: 'Malith', city: 'Galle', phone: '+94 77 000 0141', createdAt: ago(3), lastLoginAt: ago(0.2), favourites: ['c8', 'c11'] },
      { name: 'Ashan Gunawardena', email: 'ashan@example.com', role: 'couple', partnerName: 'Dilini', city: 'Negombo', phone: '+94 71 000 0142', createdAt: ago(9), lastLoginAt: ago(1) },
      { name: 'Tharushi Kumari', email: 'tharushi@example.com', role: 'couple', partnerName: 'Nuwan', city: 'Kandy', phone: '+94 76 000 0143', createdAt: ago(18), lastLoginAt: ago(6) },
      { name: 'Ishara Rathnayake', email: 'rubybridal@example.com', role: 'vendor', businessName: 'Ruby Bridal Studio', businessCategory: 'beauty', city: 'Kurunegala', phone: '+94 77 000 0105', createdAt: ago(7), lastLoginAt: ago(4) },
      { name: 'Nethmi Wijesinghe', email: 'lotuspetal@example.com', role: 'vendor', businessName: 'Lotus Petal Décor', businessCategory: 'decoration', city: 'Kandy', phone: '+94 77 000 0101', createdAt: ago(1), lastLoginAt: ago(0.4) },
      { name: 'Win Big Promotions', email: 'spam@example.com', role: 'couple', city: 'Colombo', phone: '+94 70 000 0144', createdAt: ago(5), status: 'suspended', suspendedReason: 'Posted spam reviews.' }
    ]
    const users = loadUsers()
    const add = sample.filter((s) => !users.some((u) => u.email === s.email)).map((s) => ({ ...base, id: `u_${randomId(8)}`, ...s }))
    if (write(local(), USERS_KEY, [...users, ...add])) write(local(), SEED_USERS_KEY, true)
  }

  // ---- admin: manage members ----
  const listUsers = () => loadUsers().map(toPublic)
  const adminUpdateUser = (id, patch) => {
    const users = loadUsers()
    const i = users.findIndex((u) => u.id === id)
    if (i === -1) return
    const allowed = ['role', 'status', 'suspendedReason', 'name', 'phone', 'city', 'businessName', 'businessCategory']
    const clean = Object.fromEntries(Object.entries(patch).filter(([k]) => allowed.includes(k)))
    users[i] = { ...users[i], ...clean, updatedAt: new Date().toISOString() }
    saveUsers(users)
    if (user.value?.id === id) user.value = toPublic(users[i])
  }
  const adminDeleteUser = (id) => {
    if (id === user.value?.id) return
    saveUsers(loadUsers().filter((u) => u.id !== id))
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
    isAdmin: computed(() => user.value?.role === 'admin'),
    init,
    register,
    login,
    logout,
    ensureDemoAccount,
    ensureAdminAccount,
    ensureSampleUsers,
    listUsers,
    adminUpdateUser,
    adminDeleteUser,
    updateProfile,
    changePassword,
    deleteAccount,
    addEnquiry,
    toggleChecklist,
    syncFavourites
  }
}
