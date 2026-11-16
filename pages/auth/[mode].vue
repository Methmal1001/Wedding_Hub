<template>
  <div class="auth-page relative min-h-screen bg-ivory lg:grid lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)]">
    <!-- Left: animated showcase (desktop) -->
    <div class="sticky top-0 hidden h-screen lg:block">
      <AuthShowcase :mode="mode" />
    </div>

    <!-- Right: forms -->
    <div class="relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden="true" class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blush blur-3xl" />
      <div aria-hidden="true" class="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-gold-light/40 blur-3xl" />

      <header class="relative flex items-center justify-between px-5 py-5 sm:px-10">
        <NuxtLink to="/" class="lg:invisible" aria-label="Wedding Hub home"><BrandLogo /></NuxtLink>
        <NuxtLink to="/" class="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-charcoal-soft transition hover:bg-rosewood-50 hover:text-rosewood">
          <AppIcon name="arrowRight" :size="15" class="rotate-180" />
          Back to home
        </NuxtLink>
      </header>

      <main class="relative flex flex-1 items-center justify-center px-5 pb-12 sm:px-10">
        <div class="card-in w-full max-w-[460px]">
          <div class="relative rounded-[32px] bg-white/85 p-6 shadow-lift ring-1 ring-rosewood/10 backdrop-blur-xl sm:p-9" :class="{ 'shake': shaking }">
            <!-- Mode switch -->
            <div class="relative grid grid-cols-2 rounded-full bg-blush-light p-1 ring-1 ring-rosewood/10" role="tablist" aria-label="Log in or sign up">
              <span class="switch-pill" :class="mode === 'register' ? 'translate-x-full' : 'translate-x-0'" aria-hidden="true" />
              <NuxtLink
                v-for="t in modeTabs"
                :key="t.mode"
                :to="{ path: `/auth/${t.mode}`, query: carryQuery }"
                replace
                role="tab"
                :aria-selected="mode === t.mode"
                class="relative z-10 py-2.5 text-center text-sm font-semibold transition-colors duration-300"
                :class="mode === t.mode ? 'text-white' : 'text-charcoal-soft hover:text-rosewood'"
              >
                {{ t.label }}
              </NuxtLink>
            </div>

            <Transition :name="mode === 'register' ? 'slide-left' : 'slide-right'" mode="out-in">
              <!-- ============ LOG IN ============ -->
              <form v-if="mode === 'login'" key="login" class="mt-8" novalidate @submit.prevent="doLogin">
                <h1 class="font-serif text-[2rem] font-semibold leading-tight text-charcoal">Log in to Wedding Hub</h1>
                <p class="mt-1.5 text-sm text-charcoal-soft">Welcome back! Pick up right where you left off.</p>

                <Transition name="pop">
                  <p v-if="formError" class="mt-5 flex items-start gap-2.5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200" role="alert">
                    <AppIcon name="close" :size="16" class="mt-0.5 shrink-0" />
                    {{ formError }}
                  </p>
                </Transition>

                <div class="mt-6 space-y-4">
                  <AuthInput v-model="loginForm.email" label="E-mail address" icon="mail" type="email" autocomplete="email" :error="errors.email" />
                  <AuthInput v-model="loginForm.password" label="Password" icon="shield" type="password" autocomplete="current-password" :error="errors.password" />
                </div>

                <div class="mt-4 flex items-center justify-between text-sm">
                  <label class="flex cursor-pointer items-center gap-2 text-charcoal-soft">
                    <input v-model="loginForm.remember" type="checkbox" class="h-4 w-4 rounded accent-rosewood">
                    Remember me
                  </label>
                  <button type="button" class="font-medium text-rosewood hover:underline" @click="comingSoon('Password reset by e-mail')">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" class="submit-btn btn-shine mt-7" :disabled="busy">
                  <span v-if="busy" class="spinner" aria-hidden="true" />
                  {{ busy ? 'Logging in…' : 'Log in' }}
                  <AppIcon v-if="!busy" name="arrowRight" :size="17" />
                </button>

                <div class="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-charcoal-soft/70">
                  <span class="h-px flex-1 bg-rosewood/15" />
                  or
                  <span class="h-px flex-1 bg-rosewood/15" />
                </div>

                <div class="grid gap-2.5 sm:grid-cols-2">
                  <button type="button" class="demo-btn" :disabled="busy" @click="useDemo">
                    <AppIcon name="sparkles" :size="17" class="text-gold-dark" />
                    Try the demo account
                  </button>
                  <button type="button" class="demo-btn" :disabled="busy" @click="useAdminDemo">
                    <AppIcon name="shield" :size="17" class="text-rosewood" />
                    Admin demo
                  </button>
                </div>

                <p class="mt-7 text-center text-sm text-charcoal-soft">
                  New to Wedding Hub?
                  <NuxtLink :to="{ path: '/auth/register', query: carryQuery }" replace class="font-semibold text-rosewood hover:underline">Create an account</NuxtLink>
                </p>
              </form>

              <!-- ============ SIGN UP ============ -->
              <form v-else key="register" class="mt-8" novalidate @submit.prevent="nextStep">
                <h1 class="font-serif text-[2rem] font-semibold leading-tight text-charcoal">Create your account</h1>
                <p class="mt-1.5 text-sm text-charcoal-soft">It’s free and takes less than a minute.</p>

                <!-- Steps -->
                <ol class="mt-6 flex items-center gap-3" aria-label="Sign-up steps">
                  <li v-for="(s, i) in steps" :key="s" class="flex flex-1 items-center gap-2.5">
                    <span
                      class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-all duration-500"
                      :class="step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-rosewood text-white shadow-soft ring-4 ring-rosewood/15' : 'bg-blush-light text-charcoal-soft'"
                      :aria-current="step === i + 1 ? 'step' : undefined"
                    >
                      <AppIcon v-if="step > i + 1" name="check" :size="14" :stroke-width="2.6" />
                      <template v-else>{{ i + 1 }}</template>
                    </span>
                    <span class="text-xs font-medium" :class="step >= i + 1 ? 'text-charcoal' : 'text-charcoal-soft'">{{ s }}</span>
                    <span v-if="i < steps.length - 1" class="relative h-0.5 flex-1 overflow-hidden rounded-full bg-blush">
                      <span class="absolute inset-0 origin-left bg-rosewood transition-transform duration-700" :class="step > 1 ? 'scale-x-100' : 'scale-x-0'" />
                    </span>
                  </li>
                </ol>

                <Transition name="pop">
                  <p v-if="formError" class="mt-5 flex items-start gap-2.5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200" role="alert">
                    <AppIcon name="close" :size="16" class="mt-0.5 shrink-0" />
                    {{ formError }}
                  </p>
                </Transition>

                <Transition :name="stepDir" mode="out-in">
                  <!-- Step 1 -->
                  <div v-if="step === 1" key="s1" class="mt-6 space-y-4">
                    <fieldset>
                      <legend class="mb-2.5 text-xs font-medium uppercase tracking-[0.16em] text-charcoal-soft">I am a…</legend>
                      <div class="grid grid-cols-2 gap-3">
                        <button
                          v-for="r in roles"
                          :key="r.value"
                          type="button"
                          class="role-card"
                          :class="{ 'is-on': reg.role === r.value }"
                          :aria-pressed="reg.role === r.value"
                          @click="reg.role = r.value"
                        >
                          <span class="role-icon"><AppIcon :name="r.icon" :size="20" /></span>
                          <span class="mt-2.5 block text-sm font-semibold text-charcoal">{{ r.label }}</span>
                          <span class="mt-0.5 block text-[11px] leading-snug text-charcoal-soft">{{ r.hint }}</span>
                          <span class="role-check"><AppIcon name="check" :size="12" :stroke-width="2.8" /></span>
                        </button>
                      </div>
                    </fieldset>
                    <AuthInput v-model="reg.name" label="Full name" icon="user" autocomplete="name" :error="errors.name" />
                    <AuthInput v-model="reg.email" label="E-mail address" icon="mail" type="email" autocomplete="email" :error="errors.email" />
                    <AuthInput v-model="reg.phone" label="Mobile number" icon="phone" type="tel" autocomplete="tel" :error="errors.phone" />
                  </div>

                  <!-- Step 2 -->
                  <div v-else key="s2" class="mt-6 space-y-4">
                    <template v-if="reg.role === 'couple'">
                      <AuthInput v-model="reg.partnerName" label="Partner’s name (optional)" icon="heart" autocomplete="off" />
                      <div class="grid gap-4 sm:grid-cols-2">
                        <AuthInput v-model="reg.weddingDate" label="Wedding date" icon="calendar" type="date" :min="today" />
                        <AuthInput v-model="reg.city" label="City" icon="pin" as="select">
                          <option value="">Select</option>
                          <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
                        </AuthInput>
                      </div>
                    </template>
                    <template v-else>
                      <AuthInput v-model="reg.businessName" label="Business name" icon="store" autocomplete="organization" :error="errors.businessName" />
                      <div class="grid gap-4 sm:grid-cols-2">
                        <AuthInput v-model="reg.businessCategory" label="Category" icon="layers" as="select" :error="errors.businessCategory">
                          <option value="">Select</option>
                          <option v-for="c in weddingCategories" :key="c.key" :value="c.key">{{ c.name }}</option>
                        </AuthInput>
                        <AuthInput v-model="reg.city" label="City" icon="pin" as="select">
                          <option value="">Select</option>
                          <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
                        </AuthInput>
                      </div>
                    </template>

                    <div>
                      <AuthInput v-model="reg.password" label="Create password" icon="shield" type="password" autocomplete="new-password" :error="errors.password" />
                      <div class="mt-2.5 flex items-center gap-3 px-1" aria-live="polite">
                        <div class="flex flex-1 gap-1.5">
                          <span
                            v-for="n in 4"
                            :key="n"
                            class="h-1.5 flex-1 rounded-full transition-all duration-500"
                            :class="n <= strength.score ? strengthColor : 'bg-blush'"
                          />
                        </div>
                        <span class="w-16 text-right text-[11px] font-medium text-charcoal-soft">{{ reg.password ? strength.label : '' }}</span>
                      </div>
                    </div>
                    <AuthInput v-model="reg.confirm" label="Confirm password" icon="shield" type="password" autocomplete="new-password" :error="errors.confirm" />

                    <label class="flex cursor-pointer items-start gap-2.5 text-sm text-charcoal-soft">
                      <input v-model="reg.agree" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded accent-rosewood">
                      <span>
                        I agree to the
                        <button type="button" class="font-medium text-rosewood hover:underline" @click="comingSoon('Our Terms & Conditions')">Terms</button>
                        and
                        <button type="button" class="font-medium text-rosewood hover:underline" @click="comingSoon('Our Privacy Policy')">Privacy Policy</button>
                      </span>
                    </label>
                    <p v-if="errors.agree" class="-mt-2 pl-7 text-xs text-red-600" role="alert">{{ errors.agree }}</p>
                  </div>
                </Transition>

                <div class="mt-7 flex gap-3">
                  <button v-if="step === 2" type="button" class="back-btn" :disabled="busy" @click="goStep(1)">
                    <AppIcon name="arrowRight" :size="16" class="rotate-180" />
                    Back
                  </button>
                  <button type="submit" class="submit-btn btn-shine flex-1" :disabled="busy">
                    <span v-if="busy" class="spinner" aria-hidden="true" />
                    {{ busy ? 'Creating account…' : step === 1 ? 'Continue' : 'Create account' }}
                    <AppIcon v-if="!busy" :name="step === 1 ? 'arrowRight' : 'sparkles'" :size="17" />
                  </button>
                </div>

                <p class="mt-7 text-center text-sm text-charcoal-soft">
                  Already have an account?
                  <NuxtLink :to="{ path: '/auth/login', query: carryQuery }" replace class="font-semibold text-rosewood hover:underline">Log in</NuxtLink>
                </p>
              </form>
            </Transition>

            <!-- Success celebration -->
            <Transition name="fade">
              <div v-if="success" class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[32px] bg-white/95 px-8 text-center backdrop-blur" role="status">
                <span
                  v-for="(h, i) in burst"
                  :key="`b${i}`"
                  class="burst-heart"
                  :style="{ '--bx': h.x + 'px', '--by': h.y + 'px', '--br': h.r + 'deg', animationDelay: h.d + 's', color: h.c }"
                  aria-hidden="true"
                >
                  <AppIcon name="heart" :size="h.s" filled />
                </span>
                <svg viewBox="0 0 80 80" class="success-check h-24 w-24" aria-hidden="true">
                  <circle cx="40" cy="40" r="34" pathLength="1" fill="none" stroke="#B4637A" stroke-width="3" />
                  <path d="M26 41l10 10 19-21" pathLength="1" fill="none" stroke="#B4637A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-5 font-script text-4xl text-rosewood">{{ success.title }}</p>
                <p class="mt-2 text-sm text-charcoal-soft">{{ success.text }}</p>
              </div>
            </Transition>
          </div>

          <p class="mt-6 flex items-center justify-center gap-2 text-center text-xs text-charcoal-soft">
            <AppIcon name="shield" :size="14" class="text-rosewood" />
            Demo site – your account is saved only in this browser.
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { locations } from '~/data/locations'
import { weddingCategories } from '~/data/weddingCategories'
import { passwordStrength, normaliseEmail, DEMO_ACCOUNT, ADMIN_ACCOUNT } from '~/composables/useAuth'

// Keep one page instance for /auth/login and /auth/register so the showcase
// keeps animating and the forms slide between each other.
definePageMeta({ key: 'auth' })

const route = useRoute()
const mode = computed(() => (route.params.mode === 'register' ? 'register' : 'login'))
if (!['login', 'register'].includes(String(route.params.mode))) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({ title: () => (mode.value === 'login' ? 'Log in – Wedding Hub' : 'Create an account – Wedding Hub') })
useSplash().finish()

const auth = useAuth()
const { comingSoon } = useToast()

const modeTabs = [
  { mode: 'login', label: 'Log in' },
  { mode: 'register', label: 'Sign up' }
]
const carryQuery = computed(() => (route.query.redirect ? { redirect: route.query.redirect } : {}))
const redirectTo = computed(() => {
  const r = String(route.query.redirect || '')
  if (r.startsWith('/') && !r.startsWith('//') && !r.startsWith('/auth')) return r
  // Admins land on the admin dashboard
  return auth.user.value?.role === 'admin' ? '/admin' : '/profile'
})

// Already signed in? Go straight to the profile.
onMounted(() => {
  if (auth.user.value) navigateTo(redirectTo.value, { replace: true })
})

const busy = ref(false)
const success = ref(null)
const formError = ref('')
const errors = reactive({})
const shaking = ref(false)
const clearErrors = () => {
  formError.value = ''
  Object.keys(errors).forEach((k) => delete errors[k])
}
const shake = () => {
  shaking.value = false
  requestAnimationFrame(() => {
    shaking.value = true
    setTimeout(() => (shaking.value = false), 600)
  })
}
watch(mode, () => {
  clearErrors()
  step.value = 1
})

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const celebrate = async (title, text) => {
  success.value = { title, text }
  await wait(1700)
  navigateTo(redirectTo.value, { replace: true })
}

// ---- Log in ----------------------------------------------------------------
const loginForm = reactive({ email: '', password: '', remember: true })
const doLogin = async () => {
  clearErrors()
  if (!EMAIL.test(loginForm.email.trim())) errors.email = 'Enter a valid e-mail address.'
  if (!loginForm.password) errors.password = 'Enter your password.'
  if (Object.keys(errors).length) return shake()
  busy.value = true
  try {
    await wait(650) // brief pause so the button state reads naturally
    const u = await auth.login(loginForm.email, loginForm.password, loginForm.remember)
    await celebrate(`Welcome back, ${u.name.split(' ')[0]}!`, u.role === 'admin' ? 'Opening the admin panel…' : 'Taking you to your profile…')
  } catch (e) {
    formError.value = e.message
    shake()
  } finally {
    busy.value = false
  }
}
const useAdminDemo = async () => {
  loginForm.email = ADMIN_ACCOUNT.email
  loginForm.password = ADMIN_ACCOUNT.password
  doLogin()
}
const useDemo = async () => {
  await auth.ensureDemoAccount()
  loginForm.email = DEMO_ACCOUNT.email
  loginForm.password = DEMO_ACCOUNT.password
  doLogin()
}

// ---- Sign up ----------------------------------------------------------------
const steps = ['Your account', 'Details']
const step = ref(1)
const stepDir = ref('step-next')
const goStep = (n) => {
  stepDir.value = n > step.value ? 'step-next' : 'step-back'
  clearErrors()
  step.value = n
}
const today = new Date().toISOString().slice(0, 10)
const roles = [
  { value: 'couple', label: 'Couple', hint: 'Planning our wedding', icon: 'rings' },
  { value: 'vendor', label: 'Vendor', hint: 'Offering wedding services', icon: 'store' }
]
const reg = reactive({
  role: route.query.type === 'vendor' ? 'vendor' : 'couple',
  name: '',
  email: '',
  phone: '',
  partnerName: '',
  weddingDate: '',
  city: '',
  businessName: '',
  businessCategory: '',
  password: '',
  confirm: '',
  agree: false
})
const strength = computed(() => passwordStrength(reg.password))
const strengthColor = computed(() => ['bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'][strength.value.score])

const validateStep1 = () => {
  if (reg.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!EMAIL.test(reg.email.trim())) errors.email = 'Enter a valid e-mail address.'
  if (!/^[+\d][\d\s()-]{8,}$/.test(reg.phone.trim())) errors.phone = 'Enter a valid mobile number.'
}
const validateStep2 = () => {
  if (reg.role === 'vendor') {
    if (!reg.businessName.trim()) errors.businessName = 'Enter your business name.'
    if (!reg.businessCategory) errors.businessCategory = 'Choose a category.'
  }
  if (reg.password.length < 8) errors.password = 'Use at least 8 characters.'
  else if (strength.value.score < 2) errors.password = 'Add capitals, numbers or symbols to make it stronger.'
  if (reg.confirm !== reg.password) errors.confirm = 'Passwords don’t match.'
  if (!reg.agree) errors.agree = 'Please accept the terms to continue.'
}

const nextStep = async () => {
  clearErrors()
  if (step.value === 1) {
    validateStep1()
    if (Object.keys(errors).length) return shake()
    return goStep(2)
  }
  validateStep2()
  if (Object.keys(errors).length) return shake()
  busy.value = true
  try {
    await wait(800)
    const u = await auth.register({ ...reg, email: normaliseEmail(reg.email) })
    await celebrate(`Welcome, ${u.name.split(' ')[0]}!`, 'Your account is ready. Taking you to your profile…')
  } catch (e) {
    formError.value = e.message
    if (/already exists/.test(e.message)) goStep(1)
    shake()
  } finally {
    busy.value = false
  }
}

// Hearts that burst out of the success tick
const burst = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2
  return {
    x: Math.round(Math.cos(a) * 120),
    y: Math.round(Math.sin(a) * 100),
    r: (i * 37) % 60 - 30,
    s: 12 + (i % 3) * 5,
    d: 0.35 + (i % 4) * 0.05,
    c: ['#B4637A', '#C9A86A', '#EDC5CA'][i % 3]
  }
})
</script>

<style scoped>
.card-in {
  animation: card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(26px) scale(0.98); }
  to { opacity: 1; transform: none; }
}

.switch-pill {
  @apply absolute bottom-1 left-1 top-1 rounded-full bg-gradient-to-r from-rosewood to-rosewood-700 shadow-soft transition-transform duration-500;
  width: calc(50% - 4px);
  transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}

.submit-btn {
  @apply relative inline-flex min-h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rosewood to-rosewood-700 px-6 text-[15px] font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-80;
}
.back-btn {
  @apply inline-flex min-h-[54px] items-center gap-1.5 rounded-full px-5 text-sm font-medium text-charcoal ring-1 ring-rosewood/20 transition hover:bg-rosewood-50;
}
.demo-btn {
  @apply inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full border border-dashed border-gold/60 bg-gold-light/20 text-sm font-semibold text-charcoal transition hover:border-gold hover:bg-gold-light/40;
}
.spinner {
  @apply h-4 w-4 rounded-full border-2 border-white/40 border-t-white;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.role-card {
  @apply relative rounded-2xl bg-white p-4 text-left ring-1 ring-rosewood/15 transition duration-300 hover:-translate-y-0.5 hover:ring-rosewood/40;
}
.role-card.is-on {
  @apply bg-rosewood-50 ring-2 ring-rosewood;
}
.role-icon {
  @apply grid h-10 w-10 place-items-center rounded-xl bg-blush-light text-rosewood transition duration-300;
}
.role-card.is-on .role-icon {
  @apply bg-rosewood text-white;
}
.role-check {
  @apply absolute right-3 top-3 grid h-5 w-5 scale-0 place-items-center rounded-full bg-rosewood text-white transition-transform duration-300;
}
.role-card.is-on .role-check {
  @apply scale-100;
}

.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
@keyframes shake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-7px); }
  40%, 60% { transform: translateX(7px); }
}

/* Form transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.step-next-enter-active,
.step-next-leave-active,
.step-back-enter-active,
.step-back-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-left-enter-from,
.step-next-enter-from {
  opacity: 0;
  transform: translateX(36px);
}
.slide-left-leave-to,
.step-next-leave-to {
  opacity: 0;
  transform: translateX(-36px);
}
.slide-right-enter-from,
.step-back-enter-from {
  opacity: 0;
  transform: translateX(-36px);
}
.slide-right-leave-to,
.step-back-leave-to {
  opacity: 0;
  transform: translateX(36px);
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* Success */
.success-check circle,
.success-check path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.success-check circle {
  animation: draw 0.7s ease forwards;
}
.success-check path {
  animation: draw 0.45s ease 0.55s forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
.burst-heart {
  position: absolute;
  left: 50%;
  top: 42%;
  opacity: 0;
  animation: burst 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes burst {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--bx)), calc(-50% + var(--by))) scale(1) rotate(var(--br)); }
}

@media (prefers-reduced-motion: reduce) {
  .card-in,
  .shake,
  .burst-heart {
    animation: none;
  }
  .success-check circle,
  .success-check path {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
