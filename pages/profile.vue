<template>
  <div class="relative min-h-screen bg-ivory">
    <AppNavbar />

    <main v-if="user">
      <!-- Cover -->
      <section class="cover relative isolate overflow-hidden bg-rosewood-900 text-white">
        <img src="/images/inspiration-banner.jpg" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover opacity-40">
        <div aria-hidden="true" class="absolute inset-0 -z-10 bg-gradient-to-r from-rosewood-900 via-rosewood-800/85 to-rosewood/50" />
        <span
          v-for="(h, i) in floatHearts"
          :key="`fh${i}`"
          aria-hidden="true"
          class="float-heart"
          :style="{ left: h.x + '%', animationDuration: h.d + 's', animationDelay: h.delay + 's' }"
        >
          <AppIcon name="heart" :size="h.s" filled />
        </span>

        <div class="container-site relative flex flex-col gap-8 pb-24 pt-10 sm:pb-28 lg:flex-row lg:items-end lg:justify-between">
          <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
            <!-- Avatar -->
            <div class="avatar-in relative">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="h-28 w-28 rounded-[28px] object-cover shadow-lift ring-4 ring-white/90 sm:h-32 sm:w-32"
              >
              <span
                v-else
                class="grid h-28 w-28 place-items-center rounded-[28px] bg-gradient-to-br from-gold-light to-gold font-serif text-4xl font-semibold text-rosewood-900 shadow-lift ring-4 ring-white/90 sm:h-32 sm:w-32 sm:text-5xl"
                aria-hidden="true"
              >
                {{ initials }}
              </span>
              <label
                class="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white text-rosewood shadow-lift transition hover:scale-110"
                title="Change photo"
              >
                <AppIcon name="image" :size="18" />
                <span class="sr-only">Change profile photo</span>
                <input type="file" accept="image/*" class="sr-only" @change="onAvatar">
              </label>
            </div>

            <div class="text-in">
              <p class="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-light">
                <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 tracking-[0.18em] ring-1 ring-white/25">
                  <AppIcon :name="user.role === 'vendor' ? 'store' : 'rings'" :size="12" />
                  {{ user.role === 'vendor' ? 'Vendor account' : 'Couple account' }}
                </span>
                Member since {{ memberSince }}
              </p>
              <h1 class="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                {{ user.name }}
                <template v-if="user.role === 'couple' && user.partnerName">
                  <span class="mx-1.5 font-script text-blush">&amp;</span>{{ user.partnerName }}
                </template>
              </h1>
              <p class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
                <span class="flex items-center gap-1.5"><AppIcon name="mail" :size="15" class="text-gold-light" />{{ user.email }}</span>
                <span v-if="user.city" class="flex items-center gap-1.5"><AppIcon name="pin" :size="15" class="text-gold-light" />{{ user.city }}</span>
                <span v-if="user.role === 'vendor' && user.businessName" class="flex items-center gap-1.5"><AppIcon name="store" :size="15" class="text-gold-light" />{{ user.businessName }}</span>
              </p>
            </div>
          </div>

          <!-- Countdown -->
          <div v-if="user.role === 'couple'" class="countdown-in rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md">
            <template v-if="countdown">
              <p class="text-[11px] uppercase tracking-[0.24em] text-gold-light">{{ countdown.past ? 'Married for' : 'Countdown to “I do”' }}</p>
              <div class="mt-3 flex gap-3">
                <div v-for="u in countdown.units" :key="u.label" class="w-16 rounded-2xl bg-white/10 py-2.5 text-center ring-1 ring-white/15">
                  <p class="font-serif text-3xl font-semibold tabular-nums leading-none">{{ u.value }}</p>
                  <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/70">{{ u.label }}</p>
                </div>
              </div>
              <p class="mt-3 text-xs text-white/70">{{ weddingDateLabel }}</p>
            </template>
            <template v-else>
              <p class="text-sm text-white/85">Add your wedding date to start the countdown.</p>
              <button type="button" class="mt-3 text-sm font-semibold text-gold-light hover:text-white" @click="setTab('edit')">Add wedding date →</button>
            </template>
          </div>
        </div>
      </section>

      <!-- Tabs -->
      <div class="container-site relative z-10 -mt-12">
        <nav class="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-lift ring-1 ring-rosewood/10" aria-label="Profile sections">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            class="tab"
            :class="{ 'is-on': tab === t.id }"
            :aria-current="tab === t.id ? 'page' : undefined"
            @click="setTab(t.id)"
          >
            <AppIcon :name="t.icon" :size="16" />
            {{ t.label }}
            <span v-if="t.count !== undefined" class="rounded-full px-1.5 text-[11px]" :class="tab === t.id ? 'bg-white/25' : 'bg-blush-light'">{{ t.count }}</span>
          </button>
        </nav>
      </div>

      <section class="container-site py-10 sm:py-12">
        <Transition name="tab" mode="out-in">
          <!-- ===== Overview ===== -->
          <div v-if="tab === 'overview'" key="overview" class="space-y-8">
            <!-- Admin shortcut -->
            <NuxtLink
              v-if="user.role === 'admin'"
              to="/admin"
              class="flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-r from-rosewood-900 to-rosewood-700 p-5 text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span class="grid h-12 w-12 place-items-center rounded-2xl bg-gold-light text-rosewood-900"><AppIcon name="dashboard" :size="22" /></span>
              <span class="min-w-0 flex-1">
                <span class="block font-serif text-2xl font-semibold">Admin panel</span>
                <span class="block text-sm text-white/75">{{ pendingCount }} listing request{{ pendingCount === 1 ? '' : 's' }} waiting for approval</span>
              </span>
              <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light">Open <AppIcon name="arrowRight" :size="16" /></span>
            </NuxtLink>

            <!-- Notifications from the Wedding Hub team -->
            <article v-if="notes.length" class="panel">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="panel-title flex items-center gap-2">
                  Notifications
                  <span v-if="unread" class="rounded-full bg-rosewood px-2 py-0.5 font-sans text-xs font-semibold text-white">{{ unread }} new</span>
                </h2>
                <button v-if="unread" type="button" class="text-sm font-semibold text-rosewood hover:underline" @click="site.markNotificationsRead(user.email)">Mark all as read</button>
              </div>
              <ul class="mt-4 space-y-2.5">
                <li v-for="n in notes.slice(0, 5)" :key="n.id" class="flex gap-3 rounded-2xl p-4 ring-1" :class="noteCls(n)">
                  <span class="mt-1 h-2 w-2 shrink-0 rounded-full" :class="n.read ? 'bg-charcoal/15' : 'bg-rosewood'" />
                  <div class="min-w-0 flex-1 text-sm">
                    <p class="font-semibold text-charcoal">{{ n.title }}</p>
                    <p class="mt-0.5 text-charcoal-soft">{{ n.message }}</p>
                    <p class="mt-1 text-xs text-charcoal-soft">{{ formatDate(n.at) }}</p>
                  </div>
                  <NuxtLink v-if="n.link" :to="n.link" class="self-center whitespace-nowrap text-sm font-semibold text-rosewood hover:underline">View →</NuxtLink>
                </li>
              </ul>
            </article>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="(s, i) in stats" :key="s.label" class="stat" :style="{ animationDelay: i * 0.08 + 's' }">
                <span class="grid h-12 w-12 place-items-center rounded-2xl" :class="s.tone">
                  <AppIcon :name="s.icon" :size="21" />
                </span>
                <div>
                  <p class="font-serif text-3xl font-semibold leading-none text-charcoal">{{ s.value }}</p>
                  <p class="mt-1 text-xs text-charcoal-soft">{{ s.label }}</p>
                </div>
              </div>
            </div>

            <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <!-- Checklist (couples) / business (vendors) -->
              <article v-if="user.role === 'couple'" class="panel">
                <div class="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p class="eyebrow">Planning</p>
                    <h2 class="panel-title mt-2">Wedding checklist</h2>
                  </div>
                  <p class="text-sm text-charcoal-soft"><strong class="text-charcoal">{{ doneCount }}</strong> of {{ WEDDING_CHECKLIST.length }} done</p>
                </div>
                <div class="mt-4 h-2 overflow-hidden rounded-full bg-blush-light">
                  <div class="h-full rounded-full bg-gradient-to-r from-rosewood to-gold transition-all duration-700" :style="{ width: checklistPct + '%' }" />
                </div>
                <ul class="mt-5 grid gap-2.5 sm:grid-cols-2">
                  <li v-for="c in WEDDING_CHECKLIST" :key="c.id">
                    <button type="button" class="check-item" :class="{ 'is-done': isDone(c.id) }" :aria-pressed="isDone(c.id)" @click="toggleChecklist(c.id)">
                      <span class="check-box"><AppIcon name="check" :size="13" :stroke-width="2.8" /></span>
                      {{ c.label }}
                    </button>
                  </li>
                </ul>
              </article>
              <article v-else-if="user.role !== 'admin'" class="panel">
                <p class="eyebrow">Your business</p>
                <h2 class="panel-title mt-2">{{ user.businessName || 'Your listing' }}</h2>
                <p class="mt-2 text-sm text-charcoal-soft">{{ categoryName(user.businessCategory) || 'Category not set' }}<template v-if="user.city"> · {{ user.city }}</template></p>
                <!-- Listing requests and their review status -->
                <ul v-if="mySubs.length" class="mt-5 space-y-3">
                  <li v-for="sb in mySubs" :key="sb.ref" class="rounded-2xl p-4 ring-1" :class="statusInfo(sb).box">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <p class="text-sm font-semibold text-charcoal">{{ sb.businessName }} <span class="font-normal text-charcoal-soft">· {{ sb.ref }}</span></p>
                      <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="statusInfo(sb).pill">{{ statusInfo(sb).label }}</span>
                    </div>
                    <p class="mt-1 text-xs text-charcoal-soft">Submitted {{ formatDate(sb.submittedAt) }} · {{ sb.plan }} plan</p>
                    <p v-if="sb.decisionNote && sb.status !== 'approved'" class="mt-2 text-sm text-charcoal">“{{ sb.decisionNote }}”</p>
                    <p v-else-if="sb.status === 'pending'" class="mt-2 text-sm text-charcoal-soft">Our team is reviewing it – usually within 1–2 working days.</p>
                    <div v-if="sb.status === 'approved' || sb.status === 'changes' || sb.status === 'rejected'" class="mt-3 flex flex-wrap gap-2">
                      <NuxtLink v-if="sb.status === 'approved'" :to="listingPath(submissionToListing(sb))" class="btn-primary !min-h-[38px] !px-4 text-xs">View live listing</NuxtLink>
                      <NuxtLink v-else :to="`/list-your-business?edit=${sb.ref}#apply`" class="btn-primary !min-h-[38px] !px-4 text-xs">Update &amp; resubmit</NuxtLink>
                    </div>
                  </li>
                </ul>
                <div v-else class="mt-5 flex items-start gap-3 rounded-2xl bg-gold-light/25 p-4 ring-1 ring-gold/30">
                  <AppIcon name="sparkles" :size="18" class="mt-0.5 shrink-0 text-gold-dark" />
                  <p class="text-sm text-charcoal">You haven’t submitted your listing yet. Add photos, services and prices so couples can find you.</p>
                </div>
                <div class="mt-5 flex flex-wrap gap-3">
                  <NuxtLink to="/list-your-business#apply" class="btn-primary !min-h-[44px] text-sm">{{ mySubs.length ? 'Submit another listing' : 'Complete your listing' }}</NuxtLink>
                  <NuxtLink :to="catalogLink({ category: user.businessCategory })" class="btn-outline !min-h-[44px] text-sm">See your category</NuxtLink>
                </div>
              </article>

              <!-- Profile completeness -->
              <article class="panel flex flex-col items-center text-center">
                <h2 class="panel-title">Profile strength</h2>
                <div class="relative mt-5 h-36 w-36">
                  <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90" aria-hidden="true">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#FCF1F2" stroke-width="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" stroke-width="10" stroke-linecap="round"
                      pathLength="100" stroke-dasharray="100" :stroke-dashoffset="100 - completeness"
                      class="transition-[stroke-dashoffset] duration-1000"
                    />
                    <defs>
                      <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stop-color="#B4637A" />
                        <stop offset="100%" stop-color="#C9A86A" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <p class="absolute inset-0 grid place-items-center font-serif text-4xl font-semibold text-charcoal">{{ completeness }}%</p>
                </div>
                <ul class="mt-5 w-full space-y-2 text-left text-sm">
                  <li v-for="f in profileFields" :key="f.label" class="flex items-center gap-2" :class="f.done ? 'text-charcoal' : 'text-charcoal-soft'">
                    <span class="grid h-5 w-5 place-items-center rounded-full" :class="f.done ? 'bg-emerald-500 text-white' : 'bg-blush-light text-charcoal-soft'">
                      <AppIcon :name="f.done ? 'check' : 'close'" :size="11" :stroke-width="2.6" />
                    </span>
                    {{ f.label }}
                  </li>
                </ul>
                <button v-if="completeness < 100" type="button" class="mt-5 text-sm font-semibold text-rosewood hover:underline" @click="setTab('edit')">Complete your profile →</button>
              </article>
            </div>

            <!-- Recommended -->
            <article v-if="recommended.length" class="panel">
              <div class="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p class="eyebrow">Just for you</p>
                  <h2 class="panel-title mt-2">Recommended vendors{{ user.city ? ` near ${user.city}` : '' }}</h2>
                </div>
                <NuxtLink to="/catalog" class="text-sm font-semibold text-rosewood hover:underline">Browse all →</NuxtLink>
              </div>
              <div class="mt-5 grid grid-cols-1 gap-4">
                <CatalogRow v-for="item in recommended" :key="item.id" :item="item" />
              </div>
            </article>
          </div>

          <!-- ===== Saved vendors ===== -->
          <div v-else-if="tab === 'saved'" key="saved">
            <div v-if="saved.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <CatalogRow v-for="item in saved" :key="item.id" :item="item" />
            </div>
            <div v-else class="empty">
              <span class="empty-icon"><AppIcon name="heart" :size="28" /></span>
              <h2 class="mt-5 font-serif text-2xl font-semibold">No saved vendors yet</h2>
              <p class="mt-2 max-w-md text-sm text-charcoal-soft">Tap the heart on any vendor to keep them here for later.</p>
              <NuxtLink to="/catalog" class="btn-primary mt-6">Browse vendors</NuxtLink>
            </div>
          </div>

          <!-- ===== Enquiries ===== -->
          <div v-else-if="tab === 'enquiries'" key="enquiries">
            <ul v-if="user.enquiries?.length" class="space-y-4">
              <li v-for="e in user.enquiries" :key="e.id" class="panel !p-5 sm:!p-6">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <NuxtLink v-if="e.link" :to="e.link" class="font-serif text-xl font-semibold text-charcoal hover:text-rosewood">{{ e.vendorName }}</NuxtLink>
                    <p v-else class="font-serif text-xl font-semibold text-charcoal">{{ e.vendorName }}</p>
                    <p class="mt-0.5 text-xs text-charcoal-soft">{{ e.sub }} · Sent {{ formatDate(e.sentAt) }}</p>
                  </div>
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Sent
                  </span>
                </div>
                <p class="mt-3 rounded-2xl bg-blush-light/60 px-4 py-3 text-sm text-charcoal-soft">“{{ e.message }}”</p>
                <p class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-charcoal-soft">
                  <span v-if="e.weddingDate" class="flex items-center gap-1.5"><AppIcon name="calendar" :size="13" class="text-rosewood" />Wedding: {{ formatDate(e.weddingDate) }}</span>
                  <span class="flex items-center gap-1.5"><AppIcon name="phone" :size="13" class="text-rosewood" />{{ e.phone }}</span>
                </p>
              </li>
            </ul>
            <div v-else class="empty">
              <span class="empty-icon"><AppIcon name="mail" :size="28" /></span>
              <h2 class="mt-5 font-serif text-2xl font-semibold">No enquiries yet</h2>
              <p class="mt-2 max-w-md text-sm text-charcoal-soft">Enquiries you send from a vendor’s page will appear here.</p>
              <NuxtLink to="/catalog" class="btn-primary mt-6">Find vendors</NuxtLink>
            </div>
          </div>

          <!-- ===== Edit profile ===== -->
          <form v-else-if="tab === 'edit'" key="edit" class="panel mx-auto max-w-3xl" novalidate @submit.prevent="saveProfile">
            <h2 class="panel-title">Edit profile</h2>
            <p class="mt-1 text-sm text-charcoal-soft">Keep your details up to date so vendors can reach you.</p>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <AuthInput v-model="form.name" label="Full name" icon="user" autocomplete="name" :error="formErrors.name" />
              <AuthInput v-model="form.phone" label="Mobile number" icon="phone" type="tel" autocomplete="tel" :error="formErrors.phone" />
              <template v-if="user.role === 'couple'">
                <AuthInput v-model="form.partnerName" label="Partner’s name" icon="heart" />
                <AuthInput v-model="form.weddingDate" label="Wedding date" icon="calendar" type="date" />
              </template>
              <template v-else>
                <AuthInput v-model="form.businessName" label="Business name" icon="store" :error="formErrors.businessName" />
                <AuthInput v-model="form.businessCategory" label="Category" icon="layers" as="select">
                  <option value="">Select</option>
                  <option v-for="c in weddingCategories" :key="c.key" :value="c.key">{{ c.name }}</option>
                </AuthInput>
              </template>
              <AuthInput v-model="form.city" label="City" icon="pin" as="select">
                <option value="">Select</option>
                <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
              </AuthInput>
              <AuthInput :model-value="user.email" label="E-mail (can’t be changed)" icon="mail" type="email" force-up disabled />
              <AuthInput v-model="form.bio" :label="user.role === 'vendor' ? 'About your business' : 'About your wedding'" icon="sparkles" as="textarea" class="sm:col-span-2" force-up />
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <button type="submit" class="btn-primary !min-h-[48px]">
                <AppIcon name="check" :size="17" />
                Save changes
              </button>
              <button type="button" class="btn-outline !min-h-[48px]" @click="resetForm">Cancel</button>
            </div>
          </form>

          <!-- ===== Settings ===== -->
          <div v-else key="settings" class="mx-auto grid max-w-3xl gap-6">
            <form class="panel" novalidate @submit.prevent="savePassword">
              <h2 class="panel-title">Change password</h2>
              <div class="mt-5 grid gap-4">
                <AuthInput v-model="pw.current" label="Current password" icon="shield" type="password" autocomplete="current-password" :error="pwErrors.current" />
                <div class="grid gap-4 sm:grid-cols-2">
                  <AuthInput v-model="pw.next" label="New password" icon="shield" type="password" autocomplete="new-password" :error="pwErrors.next" />
                  <AuthInput v-model="pw.confirm" label="Confirm new password" icon="shield" type="password" autocomplete="new-password" :error="pwErrors.confirm" />
                </div>
              </div>
              <button type="submit" class="btn-primary mt-5 !min-h-[46px] text-sm">Update password</button>
            </form>

            <div class="panel flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 class="panel-title">Log out</h2>
                <p class="mt-1 text-sm text-charcoal-soft">Sign out of Wedding Hub on this browser.</p>
              </div>
              <button type="button" class="btn-outline !min-h-[46px] text-sm" @click="doLogout">Log out</button>
            </div>

            <div class="panel ring-red-200">
              <h2 class="panel-title text-red-700">Delete account</h2>
              <p class="mt-1 text-sm text-charcoal-soft">This permanently removes your profile, saved vendors and enquiries from this browser.</p>
              <div v-if="confirmDelete" class="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
                <p class="flex-1 text-sm text-red-700">Are you sure? This can’t be undone.</p>
                <button type="button" class="rounded-full px-4 py-2 text-sm font-medium text-charcoal hover:bg-white" @click="confirmDelete = false">Keep my account</button>
                <button type="button" class="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" @click="doDelete">Yes, delete</button>
              </div>
              <button v-else type="button" class="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50" @click="confirmDelete = true">
                Delete my account
              </button>
            </div>
          </div>
        </Transition>
      </section>
    </main>

    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { catalog } from '~/data/catalog'
import { vendors } from '~/data/vendors'
import { locations } from '~/data/locations'
import { weddingCategories } from '~/data/weddingCategories'
import { catalogLink, categoryName } from '~/composables/useCatalog'
import { WEDDING_CHECKLIST, passwordStrength } from '~/composables/useAuth'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'My profile – Wedding Hub' })
useSplash().finish()

const auth = useAuth()
const user = auth.user
const route = useRoute()
const router = useRouter()
const { show, comingSoon } = useToast()
const { favourites } = useFavourites()
const site = useSiteData()

// ---- listing requests & notifications (managed in the admin panel) ----------------
const mySubs = computed(() => site.submissionsFor(user.value))
const notes = computed(() => site.notificationsFor(user.value?.email))
const unread = computed(() => notes.value.filter((n) => !n.read).length)
const pendingCount = computed(() => siteDb.submissions.filter((x) => x.status === 'pending').length)
const STATUS_INFO = {
  pending: { label: 'Pending review', short: 'Pending', box: 'bg-amber-50/60 ring-amber-200', pill: 'bg-amber-100 text-amber-800' },
  changes: { label: 'Changes requested', short: 'Changes', box: 'bg-sky-50/70 ring-sky-200', pill: 'bg-sky-100 text-sky-800' },
  approved: { label: 'Live', short: 'Live', box: 'bg-emerald-50/60 ring-emerald-200', pill: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Not approved', short: 'Rejected', box: 'bg-red-50/60 ring-red-200', pill: 'bg-red-100 text-red-700' },
  unpublished: { label: 'Unpublished', short: 'Offline', box: 'bg-charcoal/[0.03] ring-charcoal/10', pill: 'bg-charcoal/10 text-charcoal-soft' }
}
const statusInfo = (sb) => STATUS_INFO[sb.status] || STATUS_INFO.pending
const noteCls = (n) => ({ success: 'ring-emerald-200 bg-emerald-50/50', warn: 'ring-sky-200 bg-sky-50/50', danger: 'ring-red-200 bg-red-50/50' })[n.tone] || 'ring-rosewood/10'

// ---- tabs (kept in the URL: /profile?tab=saved) ----------------------------------
const tab = computed(() => {
  const t = String(route.query.tab || 'overview')
  return ['overview', 'saved', 'enquiries', 'edit', 'settings'].includes(t) ? t : 'overview'
})
const setTab = (id) => router.replace({ query: id === 'overview' ? {} : { tab: id } })

// Saved vendors: catalog ids, plus homepage featured vendors mapped to their listing
const saved = computed(() =>
  favourites.value
    .map((id) => catalog.find((l) => l.id === id) || catalog.find((l) => l.name === vendors.find((v) => v.id === id)?.name))
    .filter(Boolean)
    .filter((item, i, arr) => arr.findIndex((x) => x.id === item.id) === i)
)

const tabs = computed(() => [
  { id: 'overview', label: 'Overview', icon: 'compass' },
  { id: 'saved', label: 'Saved vendors', icon: 'heart', count: saved.value.length },
  { id: 'enquiries', label: 'My enquiries', icon: 'mail', count: user.value?.enquiries?.length || 0 },
  { id: 'edit', label: 'Edit profile', icon: 'user' },
  { id: 'settings', label: 'Settings', icon: 'shield' }
])

const initials = computed(() =>
  (user.value?.name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
)
const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const memberSince = computed(() => new Date(user.value?.createdAt || Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))
const weddingDateLabel = computed(() => (user.value?.weddingDate ? formatDate(user.value.weddingDate) : ''))

// ---- countdown --------------------------------------------------------------
const now = ref(Date.now())
let clock = null
onMounted(() => {
  clock = setInterval(() => (now.value = Date.now()), 1000)
})
onBeforeUnmount(() => clearInterval(clock))
const countdown = computed(() => {
  if (!user.value?.weddingDate) return null
  const target = new Date(`${user.value.weddingDate}T09:00:00`).getTime()
  let diff = Math.abs(target - now.value)
  const past = target < now.value
  const days = Math.floor(diff / 864e5)
  diff -= days * 864e5
  const hours = Math.floor(diff / 36e5)
  diff -= hours * 36e5
  const mins = Math.floor(diff / 6e4)
  const secs = Math.floor((diff - mins * 6e4) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return {
    past,
    days,
    units: [
      { label: 'Days', value: days },
      { label: 'Hours', value: pad(hours) },
      { label: 'Mins', value: pad(mins) },
      { label: 'Secs', value: pad(secs) }
    ]
  }
})

// ---- overview -------------------------------------------------------------------
const isDone = (id) => (user.value?.checklist || []).includes(id)
const doneCount = computed(() => WEDDING_CHECKLIST.filter((c) => isDone(c.id)).length)
const checklistPct = computed(() => Math.round((doneCount.value / WEDDING_CHECKLIST.length) * 100))
const toggleChecklist = (id) => auth.toggleChecklist(id)

const profileFields = computed(() => {
  const u = user.value || {}
  const base = [
    { label: 'Profile photo', done: !!u.avatar },
    { label: 'Mobile number', done: !!u.phone },
    { label: 'City', done: !!u.city },
    { label: u.role === 'vendor' ? 'About your business' : 'About your wedding', done: !!u.bio }
  ]
  return u.role === 'vendor'
    ? [...base, { label: 'Business name', done: !!u.businessName }, { label: 'Category', done: !!u.businessCategory }]
    : [...base, { label: 'Wedding date', done: !!u.weddingDate }, { label: 'Partner’s name', done: !!u.partnerName }]
})
const completeness = computed(() => Math.round((profileFields.value.filter((f) => f.done).length / profileFields.value.length) * 100))

const stats = computed(() => [
  { label: 'Saved vendors', value: saved.value.length, icon: 'heart', tone: 'bg-rosewood-50 text-rosewood' },
  { label: 'Enquiries sent', value: user.value?.enquiries?.length || 0, icon: 'mail', tone: 'bg-gold-light/40 text-gold-dark' },
  user.value?.role === 'couple'
    ? { label: countdown.value?.past ? 'Days married' : 'Days to go', value: countdown.value ? countdown.value.days : '—', icon: 'calendar', tone: 'bg-blush text-rosewood-800' }
    : { label: 'Listing status', value: mySubs.value[0] ? statusInfo(mySubs.value[0]).short : 'Not listed', icon: 'store', tone: 'bg-blush text-rosewood-800' },
  { label: 'Profile strength', value: `${completeness.value}%`, icon: 'sparkles', tone: 'bg-emerald-50 text-emerald-600' }
])

const recommended = computed(() => {
  const city = user.value?.city
  const pool = catalog.filter((l) => !favourites.value.includes(l.id) && l.rating)
  const near = city ? pool.filter((l) => l.location === city) : []
  return [...near, ...pool.filter((l) => !near.includes(l)).sort((a, b) => b.rating - a.rating)].slice(0, 3)
})

// ---- avatar upload (resized to keep browser storage small) ---------------------
const onAvatar = (e) => {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) return show('Please choose an image file.', { title: 'Not an image', icon: 'image' })
  const img = new Image()
  const url = URL.createObjectURL(file)
  img.onload = () => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    const s = Math.min(img.width, img.height)
    ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size)
    URL.revokeObjectURL(url)
    try {
      auth.updateProfile({ avatar: canvas.toDataURL('image/jpeg', 0.85) })
      show('Your profile photo has been updated.', { title: 'Looking good!', icon: 'check' })
    } catch (err) {
      show(err.message, { title: 'Could not save photo', icon: 'close' })
    }
  }
  img.onerror = () => {
    URL.revokeObjectURL(url)
    show('That image could not be read.', { title: 'Not an image', icon: 'image' })
  }
  img.src = url
}

// ---- edit profile -----------------------------------------------------------------
const pick = (u) => ({
  name: u?.name || '',
  phone: u?.phone || '',
  partnerName: u?.partnerName || '',
  weddingDate: u?.weddingDate || '',
  businessName: u?.businessName || '',
  businessCategory: u?.businessCategory || '',
  city: u?.city || '',
  bio: u?.bio || ''
})
const form = reactive(pick(user.value))
const formErrors = reactive({})
const resetForm = () => {
  Object.assign(form, pick(user.value))
  Object.keys(formErrors).forEach((k) => delete formErrors[k])
}
watch(tab, (t) => {
  if (t === 'edit') resetForm()
})
const saveProfile = () => {
  Object.keys(formErrors).forEach((k) => delete formErrors[k])
  if (form.name.trim().length < 2) formErrors.name = 'Please enter your full name.'
  if (form.phone && !/^[+\d][\d\s()-]{8,}$/.test(form.phone.trim())) formErrors.phone = 'Enter a valid mobile number.'
  if (user.value.role === 'vendor' && !form.businessName.trim()) formErrors.businessName = 'Enter your business name.'
  if (Object.keys(formErrors).length) return
  try {
    auth.updateProfile({ ...form, name: form.name.trim(), phone: form.phone.trim() })
    show('Your profile has been saved.', { title: 'Saved', icon: 'check' })
    setTab('overview')
  } catch (err) {
    show(err.message, { title: 'Could not save', icon: 'close' })
  }
}

// ---- settings ----------------------------------------------------------------------
const pw = reactive({ current: '', next: '', confirm: '' })
const pwErrors = reactive({})
const savePassword = async () => {
  Object.keys(pwErrors).forEach((k) => delete pwErrors[k])
  if (!pw.current) pwErrors.current = 'Enter your current password.'
  if (pw.next.length < 8) pwErrors.next = 'Use at least 8 characters.'
  else if (passwordStrength(pw.next).score < 2) pwErrors.next = 'Add capitals, numbers or symbols.'
  if (pw.confirm !== pw.next) pwErrors.confirm = 'Passwords don’t match.'
  if (Object.keys(pwErrors).length) return
  try {
    await auth.changePassword(pw.current, pw.next)
    Object.assign(pw, { current: '', next: '', confirm: '' })
    show('Your password has been changed.', { title: 'Password updated', icon: 'check' })
  } catch (err) {
    pwErrors.current = err.message
  }
}
const confirmDelete = ref(false)
const doLogout = () => {
  auth.logout()
  show('You have been logged out. See you soon!', { title: 'Logged out', icon: 'heart' })
  navigateTo('/')
}
const doDelete = () => {
  auth.deleteAccount()
  show('Your account has been deleted.', { title: 'Account deleted', icon: 'close' })
  navigateTo('/')
}

// If the user logs out in another tab/state change, leave the page.
watch(user, (u) => {
  if (!u) navigateTo('/auth/login', { replace: true })
})

const floatHearts = [
  { x: 8, s: 14, d: 9, delay: -2 },
  { x: 22, s: 10, d: 11, delay: -6 },
  { x: 41, s: 16, d: 10, delay: -1 },
  { x: 58, s: 11, d: 12, delay: -8 },
  { x: 73, s: 15, d: 9.5, delay: -4 },
  { x: 90, s: 12, d: 11.5, delay: -3 }
]
</script>

<style scoped>
.float-heart {
  position: absolute;
  bottom: -20px;
  z-index: -5;
  color: rgba(247, 225, 227, 0.35);
  animation: rise linear infinite;
  pointer-events: none;
}
@keyframes rise {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(-360px) rotate(25deg); opacity: 0; }
}
.avatar-in {
  animation: pop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.text-in {
  animation: rise-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}
.countdown-in {
  animation: rise-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
@keyframes pop-in {
  from { opacity: 0; transform: scale(0.6) rotate(-6deg); }
  to { opacity: 1; transform: none; }
}
@keyframes rise-in {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

.tab {
  @apply flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-charcoal-soft transition hover:text-rosewood;
}
.tab.is-on {
  @apply bg-gradient-to-r from-rosewood to-rosewood-700 text-white shadow-soft hover:text-white;
}
.panel {
  @apply rounded-3xl bg-white p-6 shadow-soft ring-1 ring-rosewood/5 sm:p-8;
}
.panel-title {
  @apply font-serif text-2xl font-semibold text-charcoal;
}
.stat {
  @apply flex items-center gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-rosewood/5;
  animation: rise-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.check-item {
  @apply flex w-full items-center gap-3 rounded-2xl bg-ivory px-4 py-3 text-left text-sm text-charcoal ring-1 ring-rosewood/10 transition hover:ring-rosewood/30;
}
.check-item.is-done {
  @apply bg-rosewood-50 text-charcoal-soft line-through decoration-rosewood/40;
}
.check-box {
  @apply grid h-5 w-5 shrink-0 place-items-center rounded-md text-transparent ring-1 ring-rosewood/30 transition duration-300;
}
.check-item.is-done .check-box {
  @apply scale-110 bg-rosewood text-white ring-rosewood;
}
.empty {
  @apply flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-soft ring-1 ring-rosewood/5;
}
.empty-icon {
  @apply grid h-16 w-16 place-items-center rounded-full bg-rosewood-50 text-rosewood;
}
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.tab-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.tab-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
@media (prefers-reduced-motion: reduce) {
  .float-heart,
  .avatar-in,
  .text-in,
  .countdown-in,
  .stat {
    animation: none;
  }
}
</style>
