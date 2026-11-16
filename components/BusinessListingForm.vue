<template>
  <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
    <!-- ================= Form ================= -->
    <div class="min-w-0">
      <Transition name="fade" mode="out-in">
        <!-- Success -->
        <div v-if="submitted" key="done" class="panel relative overflow-hidden text-center">
          <span
            v-for="(h, i) in burst"
            :key="`b${i}`"
            class="burst-heart"
            :style="{ '--bx': h.x + 'px', '--by': h.y + 'px', animationDelay: h.d + 's', color: h.c }"
            aria-hidden="true"
          >
            <AppIcon name="heart" :size="h.s" filled />
          </span>
          <svg viewBox="0 0 80 80" class="success-check mx-auto h-24 w-24" aria-hidden="true">
            <circle cx="40" cy="40" r="34" pathLength="1" fill="none" stroke="#B4637A" stroke-width="3" />
            <path d="M26 41l10 10 19-21" pathLength="1" fill="none" stroke="#B4637A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="mt-5 font-script text-4xl text-rosewood">Thank you!</p>
          <h3 class="mt-2 font-serif text-3xl font-semibold text-charcoal">
            {{ submitted.businessName }} {{ submitted.status === 'approved' ? 'is now live' : submitted.resubmitted ? 'has been resubmitted' : 'has been submitted' }}
          </h3>
          <p v-if="submitted.status === 'approved'" class="mx-auto mt-3 max-w-lg text-sm text-charcoal-soft">
            Free listings are published straight away. Couples can find you now.
          </p>
          <p v-else class="mx-auto mt-3 max-w-lg text-sm text-charcoal-soft">
            Our team will review your listing and get back to you at <strong class="text-charcoal">{{ submitted.email }}</strong> within 1–2 working days.
          </p>
          <p class="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-blush-light px-4 py-2 text-sm text-charcoal ring-1 ring-rosewood/15">
            Reference <strong class="font-semibold tracking-wider text-rosewood">{{ submitted.ref }}</strong>
          </p>

          <ol class="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            <li v-for="(n, i) in nextSteps" :key="n.title" class="rounded-2xl bg-ivory p-4 ring-1 ring-rosewood/10">
              <span class="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold" :class="i === 0 ? 'bg-emerald-500 text-white' : 'bg-blush text-rosewood-800'">
                <AppIcon v-if="i === 0" name="check" :size="14" :stroke-width="2.6" />
                <template v-else>{{ i + 1 }}</template>
              </span>
              <p class="mt-2.5 text-sm font-semibold text-charcoal">{{ n.title }}</p>
              <p class="mt-0.5 text-xs text-charcoal-soft">{{ n.text }}</p>
            </li>
          </ol>

          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <NuxtLink v-if="user" to="/profile" class="btn-primary">
              <AppIcon name="user" :size="16" />
              Go to my profile
            </NuxtLink>
            <NuxtLink v-else :to="{ path: '/auth/register', query: { type: 'vendor', redirect: '/profile' } }" class="btn-primary">
              <AppIcon name="user" :size="16" />
              Create a vendor account
            </NuxtLink>
            <button type="button" class="btn-outline" @click="startOver">List another business</button>
          </div>
        </div>

        <!-- Steps -->
        <form v-else key="form" class="panel" novalidate @submit.prevent="next">
          <!-- Updating a listing the admin team sent back -->
          <div v-if="editing" class="mb-6 flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900 ring-1 ring-sky-200">
            <AppIcon name="sparkles" :size="18" class="mt-0.5 shrink-0" />
            <div>
              <p class="font-semibold">You’re updating {{ editing.businessName }} ({{ editing.ref }})</p>
              <p v-if="editing.decisionNote" class="mt-1">Our team asked: “{{ editing.decisionNote }}”</p>
              <p class="mt-1 text-sky-800/80">When you submit, the listing goes back to our team for review.</p>
            </div>
          </div>
          <!-- Progress -->
          <div class="flex items-center justify-between gap-3">
            <p class="text-xs font-medium uppercase tracking-[0.2em] text-gold-dark">Step {{ step }} of {{ steps.length }}</p>
            <p class="flex items-center gap-1.5 text-xs text-charcoal-soft" aria-live="polite">
              <Transition name="fade" mode="out-in">
                <span :key="savedLabel" class="flex items-center gap-1.5">
                  <AppIcon v-if="savedLabel" name="check" :size="13" class="text-emerald-600" />
                  {{ savedLabel }}
                </span>
              </Transition>
            </p>
          </div>
          <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-blush-light">
            <div class="h-full rounded-full bg-gradient-to-r from-rosewood to-gold transition-all duration-700" :style="{ width: (step / steps.length) * 100 + '%' }" />
          </div>
          <ol class="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Listing steps">
            <li v-for="(s, i) in steps" :key="s.title">
              <button
                type="button"
                class="step-chip"
                :class="{ 'is-on': step === i + 1, 'is-done': step > i + 1 }"
                :aria-current="step === i + 1 ? 'step' : undefined"
                :disabled="i + 1 > maxStep"
                @click="goStep(i + 1)"
              >
                <span class="step-num">
                  <AppIcon v-if="step > i + 1" name="check" :size="12" :stroke-width="2.8" />
                  <template v-else>{{ i + 1 }}</template>
                </span>
                {{ s.title }}
              </button>
            </li>
          </ol>

          <div class="mt-7">
            <h3 class="font-serif text-[1.75rem] font-semibold leading-tight text-charcoal">{{ steps[step - 1].heading }}</h3>
            <p class="mt-1 text-sm text-charcoal-soft">{{ steps[step - 1].hint }}</p>
          </div>

          <Transition :name="dir" mode="out-in">
            <!-- 1. Business -->
            <div v-if="step === 1" key="s1" class="mt-6 grid gap-4 sm:grid-cols-2">
              <AuthInput v-model="f.businessName" class="sm:col-span-2" label="Business name *" icon="store" autocomplete="organization" :error="errors.businessName" />
              <AuthInput v-model="f.category" label="Category *" icon="layers" as="select" :error="errors.category">
                <option value="">Select a category</option>
                <option v-for="c in weddingCategories" :key="c.key" :value="c.key">{{ c.name }}</option>
              </AuthInput>
              <AuthInput v-model="f.since" label="Year established" icon="calendar" as="select">
                <option value="">Select year</option>
                <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
              </AuthInput>

              <fieldset v-if="categoryObj" class="sm:col-span-2">
                <legend class="field-legend">Services you offer * <span class="normal-case tracking-normal text-charcoal-soft/80">(choose all that apply)</span></legend>
                <div class="mt-2.5 flex flex-wrap gap-2">
                  <button
                    v-for="s in categoryObj.subcategories"
                    :key="s"
                    type="button"
                    class="pick-chip"
                    :class="{ 'is-on': f.services.includes(s) }"
                    :aria-pressed="f.services.includes(s)"
                    @click="toggle(f.services, s)"
                  >
                    <AppIcon v-if="f.services.includes(s)" name="check" :size="13" :stroke-width="2.6" />
                    {{ s }}
                  </button>
                </div>
                <p v-if="errors.services" class="field-error">{{ errors.services }}</p>
              </fieldset>

              <div class="sm:col-span-2">
                <AuthInput v-model="f.description" label="Describe your business *" icon="sparkles" as="textarea" :error="errors.description" />
                <p class="mt-1.5 flex justify-between px-1 text-[11px] text-charcoal-soft">
                  <span>What makes you special? Mention your style, experience and what’s included.</span>
                  <span :class="f.description.length > DESC_MAX ? 'text-red-600' : ''">{{ f.description.length }}/{{ DESC_MAX }}</span>
                </p>
              </div>
            </div>

            <!-- 2. Contact & location -->
            <div v-else-if="step === 2" key="s2" class="mt-6 grid gap-4 sm:grid-cols-2">
              <AuthInput v-model="f.contactName" label="Contact person *" icon="user" autocomplete="name" :error="errors.contactName" />
              <AuthInput v-model="f.phone" label="Phone number *" icon="phone" type="tel" autocomplete="tel" :error="errors.phone" />
              <AuthInput v-model="f.email" label="E-mail address *" icon="mail" type="email" autocomplete="email" :error="errors.email" />
              <AuthInput v-model="f.website" label="Website (optional)" icon="compass" type="url" autocomplete="url" :error="errors.website" />
              <AuthInput v-model="f.address" class="sm:col-span-2" label="Business address *" icon="pin" autocomplete="street-address" :error="errors.address" />
              <AuthInput v-model="f.city" label="City *" icon="pin" as="select" :error="errors.city">
                <option value="">Select a city</option>
                <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
              </AuthInput>
              <fieldset class="sm:col-span-2">
                <legend class="field-legend">Areas you serve</legend>
                <div class="mt-2.5 flex flex-wrap gap-2">
                  <button type="button" class="pick-chip" :class="{ 'is-on': f.islandWide }" :aria-pressed="f.islandWide" @click="f.islandWide = !f.islandWide">
                    <AppIcon v-if="f.islandWide" name="check" :size="13" :stroke-width="2.6" />
                    Island-wide
                  </button>
                  <template v-if="!f.islandWide">
                    <button
                      v-for="l in locations"
                      :key="l"
                      type="button"
                      class="pick-chip"
                      :class="{ 'is-on': f.areas.includes(l) }"
                      :aria-pressed="f.areas.includes(l)"
                      @click="toggle(f.areas, l)"
                    >
                      <AppIcon v-if="f.areas.includes(l)" name="check" :size="13" :stroke-width="2.6" />
                      {{ l }}
                    </button>
                  </template>
                </div>
              </fieldset>
            </div>

            <!-- 3. Services & pricing -->
            <div v-else-if="step === 3" key="s3" class="mt-6 grid gap-4 sm:grid-cols-2">
              <AuthInput v-model="f.priceUnit" label="Pricing *" icon="store" as="select">
                <option v-for="u in priceUnits" :key="u" :value="u">{{ u }}</option>
              </AuthInput>
              <AuthInput
                v-if="f.priceUnit !== 'Price on request'"
                v-model="f.price"
                label="Starting price (LKR) *"
                icon="sparkles"
                type="number"
                :error="errors.price"
              />
              <AuthInput v-if="showCapacity" v-model="f.capacity" label="Guest capacity (optional)" icon="users" type="number" />

              <div class="sm:col-span-2">
                <p class="field-legend">What’s included</p>
                <div class="mt-2.5 flex flex-wrap items-center gap-2 rounded-2xl border border-rosewood/15 bg-white/80 p-2.5 focus-within:border-rosewood/50 focus-within:ring-4 focus-within:ring-rosewood/10">
                  <TransitionGroup name="tag">
                    <span v-for="(t, i) in f.offerings" :key="t" class="inline-flex items-center gap-1.5 rounded-full bg-rosewood-50 py-1 pl-3 pr-1.5 text-[13px] text-rosewood-800 ring-1 ring-rosewood/20">
                      {{ t }}
                      <button type="button" class="grid h-5 w-5 place-items-center rounded-full hover:bg-rosewood hover:text-white" :aria-label="`Remove ${t}`" @click="f.offerings.splice(i, 1)">
                        <AppIcon name="close" :size="11" :stroke-width="2.4" />
                      </button>
                    </span>
                  </TransitionGroup>
                  <input
                    v-model="tagDraft"
                    type="text"
                    class="min-w-[180px] flex-1 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-charcoal-soft/60"
                    placeholder="Type an item and press Enter"
                    aria-label="Add an included item"
                    @keydown="onTagKey"
                    @blur="addTag"
                  >
                </div>
                <div v-if="tagSuggestions.length" class="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-charcoal-soft">
                  Suggestions:
                  <button v-for="s in tagSuggestions" :key="s" type="button" class="rounded-full px-2.5 py-1 ring-1 ring-charcoal/10 transition hover:text-rosewood hover:ring-rosewood/40" @click="f.offerings.push(s)">
                    + {{ s }}
                  </button>
                </div>
                <p v-if="errors.offerings" class="field-error">{{ errors.offerings }}</p>
              </div>

              <AuthInput v-model="f.facebook" label="Facebook page (optional)" icon="facebook" type="url" />
              <AuthInput v-model="f.instagram" label="Instagram (optional)" icon="instagram" type="url" />
            </div>

            <!-- 4. Photos -->
            <div v-else-if="step === 4" key="s4" class="mt-6 space-y-6">
              <div class="flex flex-wrap items-center gap-5">
                <div class="relative">
                  <img v-if="f.logo" :src="f.logo" alt="Business logo" class="h-24 w-24 rounded-2xl object-cover ring-4 ring-blush-light">
                  <span v-else class="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-rosewood to-rosewood-800 font-serif text-3xl font-semibold text-white">{{ initials || 'WH' }}</span>
                  <button v-if="f.logo" type="button" class="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-rosewood shadow-soft ring-1 ring-rosewood/20" aria-label="Remove logo" @click="f.logo = ''">
                    <AppIcon name="close" :size="13" />
                  </button>
                </div>
                <div>
                  <p class="text-sm font-semibold text-charcoal">Logo or profile photo</p>
                  <p class="mt-0.5 text-xs text-charcoal-soft">Square image, at least 300 × 300 px.</p>
                  <label class="btn-outline mt-3 !min-h-[40px] cursor-pointer !px-4 text-[13px]">
                    <AppIcon name="image" :size="15" />
                    {{ f.logo ? 'Change logo' : 'Upload logo' }}
                    <input type="file" accept="image/*" class="sr-only" @change="onLogo">
                  </label>
                </div>
              </div>

              <div>
                <div class="flex items-end justify-between gap-3">
                  <p class="field-legend">Gallery photos *</p>
                  <p class="text-xs text-charcoal-soft">{{ f.photos.length }} / {{ photoLimit }} · {{ planObj.name }} plan</p>
                </div>
                <label
                  class="drop-zone mt-2.5"
                  :class="{ 'is-over': dragOver, 'is-full': f.photos.length >= photoLimit }"
                  @dragover.prevent="dragOver = true"
                  @dragleave.prevent="dragOver = false"
                  @drop.prevent="onDrop"
                >
                  <span class="grid h-14 w-14 place-items-center rounded-2xl bg-white text-rosewood shadow-soft">
                    <AppIcon name="image" :size="24" />
                  </span>
                  <span class="mt-3 text-sm font-semibold text-charcoal">
                    {{ f.photos.length >= photoLimit ? 'Photo limit reached' : 'Drag & drop photos here, or click to browse' }}
                  </span>
                  <span class="mt-1 text-xs text-charcoal-soft">JPG or PNG · we resize large photos automatically</span>
                  <input type="file" accept="image/*" multiple class="sr-only" :disabled="f.photos.length >= photoLimit" @change="onPhotos">
                </label>
                <p v-if="errors.photos" class="field-error">{{ errors.photos }}</p>
                <p v-if="busyPhotos" class="mt-2 flex items-center gap-2 text-xs text-charcoal-soft"><span class="spinner !border-rosewood/30 !border-t-rosewood" /> Preparing photos…</p>

                <TransitionGroup v-if="f.photos.length" tag="ul" name="tag" class="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  <li v-for="(p, i) in f.photos" :key="p.slice(-40)" class="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-rosewood/10">
                    <img :src="p" :alt="`Photo ${i + 1}`" class="h-full w-full object-cover">
                    <span v-if="i === 0" class="absolute left-2 top-2 rounded-full bg-rosewood px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Cover</span>
                    <div class="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                      <button v-if="i !== 0" type="button" class="photo-btn" aria-label="Make cover photo" @click="makeCover(i)">
                        <AppIcon name="star" :size="13" />
                      </button>
                      <span v-else />
                      <button type="button" class="photo-btn" aria-label="Remove photo" @click="f.photos.splice(i, 1)">
                        <AppIcon name="close" :size="13" />
                      </button>
                    </div>
                  </li>
                </TransitionGroup>
              </div>
            </div>

            <!-- 5. Plan & review -->
            <div v-else key="s5" class="mt-6 space-y-6">
              <div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p class="field-legend">Your plan</p>
                  <BillingToggle v-model="billingModel" />
                </div>
                <div class="mt-3 grid gap-3 sm:grid-cols-3">
                  <button
                    v-for="p in plans"
                    :key="p.id"
                    type="button"
                    class="plan-pick"
                    :class="{ 'is-on': planModel === p.id }"
                    :aria-pressed="planModel === p.id"
                    @click="planModel = p.id"
                  >
                    <span class="flex items-center justify-between">
                      <span class="font-serif text-xl font-semibold text-charcoal">{{ p.name }}</span>
                      <span class="radio"><span /></span>
                    </span>
                    <span class="mt-1 block text-sm font-semibold text-rosewood">{{ priceLabel(p) }}</span>
                    <span class="mt-0.5 block text-[11px] text-charcoal-soft">{{ p.tagline }}</span>
                  </button>
                </div>
              </div>

              <div class="divide-y divide-rosewood/10 rounded-2xl ring-1 ring-rosewood/15">
                <div v-for="(r, i) in review" :key="r.title" class="flex items-start gap-4 p-4 sm:p-5">
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rosewood-50 text-rosewood"><AppIcon :name="r.icon" :size="17" /></span>
                  <dl class="min-w-0 flex-1 text-sm">
                    <dt class="font-semibold text-charcoal">{{ r.title }}</dt>
                    <dd v-for="line in r.lines" :key="line" class="mt-0.5 break-words text-charcoal-soft">{{ line }}</dd>
                  </dl>
                  <button type="button" class="shrink-0 text-xs font-semibold text-rosewood hover:underline" @click="goStep(i + 1)">Edit</button>
                </div>
              </div>

              <label class="flex cursor-pointer items-start gap-2.5 text-sm text-charcoal-soft">
                <input v-model="f.agree" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded accent-rosewood">
                <span>I confirm these details are correct and I agree to the Wedding Hub listing terms and privacy policy.</span>
              </label>
              <p v-if="errors.agree" class="field-error -mt-3 pl-7">{{ errors.agree }}</p>
            </div>
          </Transition>

          <!-- Navigation -->
          <div class="mt-8 flex flex-wrap items-center gap-3 border-t border-rosewood/10 pt-6">
            <button v-if="step > 1" type="button" class="back-btn" :disabled="busy" @click="goStep(step - 1)">
              <AppIcon name="arrowRight" :size="16" class="rotate-180" />
              Back
            </button>
            <button type="button" class="text-xs font-medium text-charcoal-soft hover:text-rosewood" @click="clearForm">Clear form</button>
            <button type="submit" class="submit-btn btn-shine ml-auto" :disabled="busy">
              <span v-if="busy" class="spinner" aria-hidden="true" />
              {{ busy ? 'Submitting…' : step < steps.length ? 'Continue' : 'Submit listing' }}
              <AppIcon v-if="!busy" :name="step < steps.length ? 'arrowRight' : 'check'" :size="17" />
            </button>
          </div>
        </form>
      </Transition>
    </div>

    <!-- ================= Live preview ================= -->
    <aside class="lg:sticky lg:top-24 lg:self-start" aria-label="Listing preview">
      <p class="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-dark">
        <span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
        Live preview
      </p>
      <article class="overflow-hidden rounded-[28px] bg-white shadow-lift ring-1 ring-rosewood/10">
        <div class="relative aspect-[4/3] bg-blush-light">
          <img v-if="f.photos[0]" :src="f.photos[0]" alt="" class="h-full w-full object-cover">
          <div v-else class="grid h-full place-items-center text-rosewood/40">
            <AppIcon name="image" :size="44" />
          </div>
          <span v-if="planModel !== 'free'" class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 shadow">
            <AppIcon name="verified" :size="12" /> Verified
          </span>
          <span v-if="planModel === 'gold'" class="absolute right-3 top-3 rounded-full bg-gradient-to-r from-gold to-gold-dark px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow">Featured</span>
        </div>
        <div class="relative px-5 pb-5">
          <div class="-mt-9 flex justify-center">
            <img v-if="f.logo" :src="f.logo" alt="" class="h-[72px] w-[72px] rounded-full object-cover ring-4 ring-white">
            <span v-else class="grid h-[72px] w-[72px] place-items-center rounded-full bg-gradient-to-br from-rosewood to-rosewood-800 font-serif text-2xl font-semibold text-white ring-4 ring-white">{{ initials || 'WH' }}</span>
          </div>
          <h4 class="mt-3 text-center font-serif text-2xl font-semibold leading-tight text-charcoal">{{ f.businessName || 'Your business name' }}</h4>
          <p class="mt-0.5 text-center text-xs text-charcoal-soft">{{ categoryObj?.name || 'Category' }}</p>
          <p class="mt-2 flex items-center justify-center gap-1 text-sm text-charcoal-soft">
            <AppIcon name="pin" :size="14" class="text-rosewood" />
            {{ f.city || 'City' }}<template v-if="f.islandWide"> · Island-wide</template>
          </p>
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <span class="rounded-full bg-rosewood-50 px-3 py-1 text-xs font-semibold text-rosewood-700 ring-1 ring-rosewood-100">{{ previewPrice }}</span>
            <span v-for="s in f.services.slice(0, 2)" :key="s" class="rounded-full px-3 py-1 text-xs text-charcoal-soft ring-1 ring-charcoal/10">{{ s }}</span>
            <span v-if="f.services.length > 2" class="rounded-full px-2.5 py-1 text-xs text-charcoal-soft ring-1 ring-charcoal/10">+{{ f.services.length - 2 }}</span>
          </div>
          <p v-if="f.description" class="mt-4 line-clamp-3 text-center text-xs leading-relaxed text-charcoal-soft">{{ f.description }}</p>
        </div>
      </article>

      <div class="mt-5 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-rosewood/5">
        <div class="flex items-center justify-between text-sm">
          <p class="font-semibold text-charcoal">Listing strength</p>
          <p class="font-serif text-xl font-semibold text-rosewood">{{ strength }}%</p>
        </div>
        <div class="mt-2.5 h-2 overflow-hidden rounded-full bg-blush-light">
          <div class="h-full rounded-full bg-gradient-to-r from-rosewood to-gold transition-all duration-700" :style="{ width: strength + '%' }" />
        </div>
        <p class="mt-2.5 text-xs text-charcoal-soft">{{ strengthTip }}</p>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { weddingCategories } from '~/data/weddingCategories'
import { locations } from '~/data/locations'
import { plans, priceUnits } from '~/data/businessPlans'

const props = defineProps({
  plan: { type: String, default: 'free' },
  billing: { type: String, default: 'monthly' }
})
const emit = defineEmits(['update:plan', 'update:billing'])

const planModel = computed({ get: () => props.plan, set: (v) => emit('update:plan', v) })
const billingModel = computed({ get: () => props.billing, set: (v) => emit('update:billing', v) })
const planObj = computed(() => plans.find((p) => p.id === planModel.value) || plans[0])

const auth = useAuth()
const user = auth.user
const { show } = useToast()

const DRAFT_KEY = 'wh:listing-draft'
const site = useSiteData()
const route = useRoute()
const DESC_MAX = 600
const PHOTO_LIMITS = { free: 3, silver: 15, gold: 30 }

const steps = [
  { title: 'Business', heading: 'Tell us about your business', hint: 'The basics couples see first.' },
  { title: 'Contact', heading: 'Contact & location', hint: 'How and where couples can reach you.' },
  { title: 'Pricing', heading: 'Services & pricing', hint: 'Help couples understand what you offer.' },
  { title: 'Photos', heading: 'Add your best photos', hint: 'Listings with great photos get far more enquiries.' },
  { title: 'Review', heading: 'Choose a plan & submit', hint: 'Check everything looks right.' }
]

const blank = () => ({
  businessName: '',
  category: '',
  since: '',
  services: [],
  description: '',
  contactName: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  city: '',
  islandWide: false,
  areas: [],
  priceUnit: 'Package',
  price: '',
  capacity: '',
  offerings: [],
  facebook: '',
  instagram: '',
  logo: '',
  photos: [],
  agree: false
})
const f = reactive(blank())
const step = ref(1)
const maxStep = ref(1)
const dir = ref('step-next')
const errors = reactive({})
const busy = ref(false)
const busyPhotos = ref(false)
const submitted = ref(null)
const editing = ref(null) // submission being updated (?edit=WH-XXXX)
const dragOver = ref(false)
const tagDraft = ref('')
const savedLabel = ref('')

const categoryObj = computed(() => weddingCategories.find((c) => c.key === f.category))
const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i)
const showCapacity = computed(() => ['venues', 'foods', 'marquee', 'transport'].includes(f.category))
const photoLimit = computed(() => PHOTO_LIMITS[planModel.value] || 3)
const initials = computed(() =>
  f.businessName
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
)
const lkr = (n) => `LKR ${Number(n).toLocaleString('en-LK')}`
const previewPrice = computed(() => {
  if (f.priceUnit === 'Price on request' || !f.price) return 'Price on request'
  const unit = { 'Per guest (pax)': ' / pax', 'Per day': ' / day', 'Per hour': ' / hour', 'Per item': ' / item' }[f.priceUnit] || ''
  return `${lkr(f.price)}${unit}`
})
const priceLabel = (p) => (p.monthly === 0 ? 'Free' : billingModel.value === 'yearly' ? `${lkr(p.yearly)} / year` : `${lkr(p.monthly)} / month`)

// Changing category resets the chosen services.
watch(
  () => f.category,
  (v, old) => {
    if (old) f.services = f.services.filter((s) => categoryObj.value?.subcategories.includes(s))
  }
)
// If the plan allows fewer photos, keep the first ones.
watch(photoLimit, (n) => {
  if (f.photos.length > n) {
    f.photos.splice(n)
    show(`The ${planObj.value.name} plan includes up to ${n} photos, so the extra ones were removed.`, { title: 'Photos trimmed', icon: 'image' })
  }
})

const toggle = (list, v) => {
  const i = list.indexOf(v)
  i === -1 ? list.push(v) : list.splice(i, 1)
}

// ---- tags --------------------------------------------------------------------------
const SUGGEST = {
  venues: ['Bridal suite', 'Parking', 'Air-conditioned hall', 'Poruwa setup', 'Sound system'],
  foods: ['Buffet setup', 'Live stations', 'Service staff', 'Tasting session'],
  photography: ['Pre-shoot', 'Drone coverage', 'Album', 'Highlight video'],
  beauty: ['Bridal trial', 'Hair styling', 'Bridesmaid makeup', 'Touch-ups'],
  decoration: ['Poruwa décor', 'Fresh flowers', 'Table centrepieces', 'Lighting'],
  attire: ['Fittings', 'Alterations', 'Accessories', 'Rental option']
}
const tagSuggestions = computed(() => (SUGGEST[f.category] || ['Free consultation', 'Island-wide service', 'Custom packages']).filter((s) => !f.offerings.includes(s)).slice(0, 4))
const onTagKey = (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
}
const addTag = () => {
  const t = tagDraft.value.replace(/,/g, '').trim()
  if (t && !f.offerings.includes(t) && f.offerings.length < 15) f.offerings.push(t)
  tagDraft.value = ''
}

// ---- images (downscaled so they fit in browser storage) ---------------------------
const shrink = (file, max, quality = 0.78) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Not an image'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale)
      c.height = Math.round(img.height * scale)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unreadable image'))
    }
    img.src = url
  })
const addPhotos = async (files) => {
  const room = photoLimit.value - f.photos.length
  const list = [...files].filter((x) => x.type.startsWith('image/'))
  if (!list.length) return show('Please choose JPG or PNG images.', { title: 'Not an image', icon: 'image' })
  if (list.length > room) show(`Only ${room} more photo${room === 1 ? '' : 's'} can be added on the ${planObj.value.name} plan.`, { title: 'Photo limit', icon: 'image' })
  busyPhotos.value = true
  for (const file of list.slice(0, room)) {
    try {
      f.photos.push(await shrink(file, 1000))
    } catch {
      // skip unreadable files
    }
  }
  busyPhotos.value = false
  delete errors.photos
}
const onPhotos = (e) => {
  addPhotos(e.target.files)
  e.target.value = ''
}
const onDrop = (e) => {
  dragOver.value = false
  if (f.photos.length < photoLimit.value) addPhotos(e.dataTransfer.files)
}
const onLogo = async (e) => {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  try {
    f.logo = await shrink(file, 320, 0.85)
  } catch {
    show('That image could not be read.', { title: 'Not an image', icon: 'image' })
  }
}
const makeCover = (i) => {
  const [p] = f.photos.splice(i, 1)
  f.photos.unshift(p)
}

// ---- validation ------------------------------------------------------------------------
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+\d][\d\s()-]{8,}$/
const validate = (n) => {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (n === 1) {
    if (f.businessName.trim().length < 2) errors.businessName = 'Enter your business name.'
    if (!f.category) errors.category = 'Choose a category.'
    else if (!f.services.length) errors.services = 'Choose at least one service.'
    if (f.description.trim().length < 40) errors.description = 'Write at least 40 characters so couples get a feel for your business.'
    else if (f.description.length > DESC_MAX) errors.description = `Keep it under ${DESC_MAX} characters.`
  }
  if (n === 2) {
    if (f.contactName.trim().length < 2) errors.contactName = 'Enter a contact name.'
    if (!PHONE.test(f.phone.trim())) errors.phone = 'Enter a valid phone number.'
    if (!EMAIL.test(f.email.trim())) errors.email = 'Enter a valid e-mail address.'
    if (f.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(f.website.trim())) errors.website = 'Enter a valid website address.'
    if (f.address.trim().length < 5) errors.address = 'Enter your business address.'
    if (!f.city) errors.city = 'Choose your city.'
  }
  if (n === 3) {
    if (f.priceUnit !== 'Price on request' && !(Number(f.price) > 0)) errors.price = 'Enter a starting price, or choose “Price on request”.'
    if (!f.offerings.length) errors.offerings = 'Add at least one thing that’s included.'
  }
  if (n === 4 && !f.photos.length) errors.photos = 'Add at least one photo.'
  if (n === 5 && !f.agree) errors.agree = 'Please confirm the details and accept the terms.'
  return !Object.keys(errors).length
}

const scrollToForm = () => {
  const el = document.getElementById('apply')
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' })
}
const goStep = (n) => {
  if (n > maxStep.value) return
  dir.value = n > step.value ? 'step-next' : 'step-back'
  Object.keys(errors).forEach((k) => delete errors[k])
  step.value = n
  scrollToForm()
}
const next = async () => {
  addTag()
  if (!validate(step.value)) {
    show('Please check the highlighted fields.', { title: 'Almost there', icon: 'sparkles' })
    return
  }
  if (step.value < steps.length) {
    maxStep.value = Math.max(maxStep.value, step.value + 1)
    return goStep(step.value + 1)
  }
  await submit()
}

// ---- review summary -----------------------------------------------------------------------
const review = computed(() => [
  { title: 'Business', icon: 'store', lines: [f.businessName, `${categoryObj.value?.name || ''} · ${f.services.join(', ')}`, f.since ? `Since ${f.since}` : ''].filter(Boolean) },
  { title: 'Contact & location', icon: 'pin', lines: [`${f.contactName} · ${f.phone}`, f.email, `${f.address}, ${f.city}`, f.islandWide ? 'Serves island-wide' : f.areas.length ? `Serves ${f.areas.join(', ')}` : ''].filter(Boolean) },
  { title: 'Pricing', icon: 'sparkles', lines: [previewPrice.value, f.offerings.join(' · ')].filter(Boolean) },
  { title: 'Photos', icon: 'image', lines: [`${f.photos.length} photo${f.photos.length === 1 ? '' : 's'}${f.logo ? ' + logo' : ''}`] }
])

// ---- listing strength ------------------------------------------------------------------------
const strength = computed(() => {
  const checks = [
    f.businessName,
    f.category && f.services.length,
    f.description.length >= 40,
    f.description.length >= 150,
    f.phone && f.email,
    f.address && f.city,
    f.website || f.facebook || f.instagram,
    f.offerings.length >= 3,
    f.logo,
    f.photos.length >= 3,
    f.photos.length >= 6
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
})
const strengthTip = computed(() => {
  if (!f.photos.length) return 'Tip: listings with 6+ photos get the most enquiries.'
  if (!f.logo) return 'Tip: add your logo so couples recognise your brand.'
  if (f.description.length < 150) return 'Tip: a longer description (150+ characters) builds trust.'
  if (f.offerings.length < 3) return 'Tip: list at least 3 things included in your packages.'
  return 'Looking great! Your listing is ready to impress couples.'
})

// ---- draft auto-save ---------------------------------------------------------------------------
let saveTimer = null
const saveDraft = () => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const data = { form: { ...f, agree: false }, step: step.value, maxStep: maxStep.value, savedAt: Date.now() }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
      savedLabel.value = 'Draft saved'
    } catch {
      // Photos may not fit in storage – save the text at least.
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, form: { ...data.form, photos: [], logo: '' } }))
        savedLabel.value = 'Draft saved (without photos)'
      } catch {
        savedLabel.value = ''
      }
    }
  }, 500)
}
watch(f, saveDraft, { deep: true })
watch(step, saveDraft)

const prefillFromUser = () => {
  const u = user.value
  if (!u) return
  if (!f.contactName) f.contactName = u.name
  if (!f.email) f.email = u.email
  if (!f.phone) f.phone = u.phone || ''
  if (!f.city && u.city) f.city = u.city
  if (u.role === 'vendor') {
    if (!f.businessName) f.businessName = u.businessName || ''
    if (!f.category) f.category = u.businessCategory || ''
  }
}

onMounted(() => {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
    if (d?.form && !editing.value && (d.form.businessName || d.form.description || d.form.photos?.length)) {
      Object.assign(f, blank(), d.form)
      step.value = Math.min(d.step || 1, steps.length)
      maxStep.value = Math.min(d.maxStep || step.value, steps.length)
      show('We restored the listing you were working on.', { title: 'Draft restored', icon: 'check' })
    }
  } catch {
    // ignore broken drafts
  }
  prefillFromUser()
})
watch(() => user.value?.id, prefillFromUser)

// ?edit=WH-XXXX – reopen a listing the admin team sent back for changes.
// Waits until the account and the site data have loaded (after hydration).
const loadEdit = () => {
  const refNo = String(route.query.edit || '')
  if (!refNo || editing.value || !siteDb.loaded || !user.value) return
  const s = site.findSubmission(refNo)
  const mine = s && (s.userId === user.value.id || s.email?.toLowerCase() === user.value.email.toLowerCase())
  if (!mine || !['changes', 'rejected', 'pending'].includes(s.status) || !s.data?.businessName) return
  Object.assign(f, blank(), JSON.parse(JSON.stringify(s.data)), { agree: false })
  planModel.value = s.plan
  billingModel.value = s.billing
  editing.value = s
  step.value = 1
  maxStep.value = steps.length
  show(`Make your changes and submit ${s.businessName} again.`, { title: 'Listing loaded', icon: 'check' })
}
watch([() => siteDb.loaded, () => user.value?.id, () => route.query.edit], loadEdit, { immediate: true })
onBeforeUnmount(() => clearTimeout(saveTimer))

const clearForm = () => {
  Object.assign(f, blank())
  prefillFromUser()
  step.value = 1
  maxStep.value = 1
  Object.keys(errors).forEach((k) => delete errors[k])
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {}
  savedLabel.value = ''
  show('The form has been cleared.', { title: 'Cleared', icon: 'close' })
}

// ---- submit ------------------------------------------------------------------------------------
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const submit = async () => {
  busy.value = true
  await wait(1100)
  const refNo = editing.value?.ref || `WH-${Date.now().toString(36).toUpperCase().slice(-6)}`
  const { agree, ...data } = f
  const record = {
    ref: refNo,
    status: 'pending',
    userId: user.value?.id || '',
    plan: planModel.value,
    billing: billingModel.value,
    submittedAt: new Date().toISOString(),
    businessName: f.businessName.trim(),
    category: f.category,
    services: [...f.services],
    city: f.city,
    email: f.email.trim(),
    phone: f.phone.trim(),
    price: previewPrice.value,
    photos: f.photos.length,
    data: JSON.parse(JSON.stringify(data))
  }
  // Goes to Admin → Listing requests
  const { storedPhotos } = site.submitListing(record)
  if (!storedPhotos) show('Your browser storage is full, so some photos were not saved with the listing.', { title: 'Photos not saved', icon: 'image' })
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {}
  if (user.value) {
    try {
      auth.updateProfile({
        listing: { ref: record.ref, businessName: record.businessName, plan: record.plan, submittedAt: record.submittedAt },
        businessName: user.value.businessName || record.businessName,
        businessCategory: user.value.businessCategory || record.category
      })
    } catch {}
  }
  busy.value = false
  submitted.value = { ...record, status: site.findSubmission(refNo)?.status, resubmitted: !!editing.value }
  editing.value = null
  scrollToForm()
}
const startOver = () => {
  submitted.value = null
  editing.value = null
  Object.assign(f, blank())
  prefillFromUser()
  step.value = 1
  maxStep.value = 1
}

const nextSteps = [
  { title: 'Submitted', text: 'We’ve received your listing.' },
  { title: 'Review', text: 'Our team checks your details within 1–2 days.' },
  { title: 'Go live', text: 'Couples can find and contact you.' }
]

const burst = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return { x: Math.round(Math.cos(a) * 170), y: Math.round(Math.sin(a) * 120), s: 12 + (i % 3) * 5, d: 0.3 + (i % 4) * 0.05, c: ['#B4637A', '#C9A86A', '#EDC5CA'][i % 3] }
})
</script>

<style scoped>
.panel {
  @apply rounded-[28px] bg-white p-6 shadow-lift ring-1 ring-rosewood/10 sm:p-9;
}
.field-legend {
  @apply text-xs font-medium uppercase tracking-[0.16em] text-charcoal-soft;
}
.field-error {
  @apply mt-1.5 pl-1 text-xs text-red-600;
}
.step-chip {
  @apply flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-charcoal-soft ring-1 ring-rosewood/15 transition disabled:cursor-not-allowed disabled:opacity-50;
}
.step-chip:not(:disabled):hover {
  @apply text-rosewood ring-rosewood/40;
}
.step-num {
  @apply grid h-6 w-6 place-items-center rounded-full bg-blush-light text-[11px] font-semibold;
}
.step-chip.is-on {
  @apply bg-rosewood text-white ring-rosewood;
}
.step-chip.is-on .step-num {
  @apply bg-white text-rosewood;
}
.step-chip.is-done .step-num {
  @apply bg-emerald-500 text-white;
}
.pick-chip {
  @apply inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] text-charcoal ring-1 ring-charcoal/10 transition duration-200 hover:ring-rosewood/40;
}
.pick-chip.is-on {
  @apply bg-rosewood text-white ring-rosewood;
}
.drop-zone {
  @apply flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed border-rosewood/25 bg-blush-light/50 px-6 py-10 text-center transition duration-300 hover:border-rosewood/50 hover:bg-blush-light;
}
.drop-zone.is-over {
  @apply scale-[1.01] border-rosewood bg-rosewood-50;
}
.drop-zone.is-full {
  @apply cursor-not-allowed opacity-60;
}
.photo-btn {
  @apply grid h-7 w-7 place-items-center rounded-full bg-white/90 text-rosewood transition hover:bg-rosewood hover:text-white;
}
.plan-pick {
  @apply rounded-2xl bg-white p-4 text-left ring-1 ring-rosewood/15 transition duration-300 hover:-translate-y-0.5 hover:ring-rosewood/40;
}
.plan-pick.is-on {
  @apply bg-rosewood-50 ring-2 ring-rosewood;
}
.radio {
  @apply grid h-5 w-5 place-items-center rounded-full ring-2 ring-rosewood/30;
}
.radio > span {
  @apply h-2.5 w-2.5 scale-0 rounded-full bg-rosewood transition-transform;
}
.plan-pick.is-on .radio {
  @apply ring-rosewood;
}
.plan-pick.is-on .radio > span {
  @apply scale-100;
}
.submit-btn {
  @apply relative inline-flex min-h-[52px] items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-rosewood to-rosewood-700 px-7 text-[15px] font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-80;
}
.back-btn {
  @apply inline-flex min-h-[52px] items-center gap-1.5 rounded-full px-5 text-sm font-medium text-charcoal ring-1 ring-rosewood/20 transition hover:bg-rosewood-50;
}
.spinner {
  @apply inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.step-next-enter-active,
.step-next-leave-active,
.step-back-enter-active,
.step-back-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.step-next-enter-from,
.step-back-leave-to {
  opacity: 0;
  transform: translateX(32px);
}
.step-next-leave-to,
.step-back-enter-from {
  opacity: 0;
  transform: translateX(-32px);
}
.tag-enter-active,
.tag-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.tag-enter-from,
.tag-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

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
  top: 110px;
  opacity: 0;
  animation: burst 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes burst {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--bx)), calc(-50% + var(--by))) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .success-check circle,
  .success-check path {
    animation: none;
    stroke-dashoffset: 0;
  }
  .burst-heart {
    display: none;
  }
}
</style>
