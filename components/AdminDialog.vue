<template>
  <Transition name="adm-dialog">
    <div v-if="d" class="fixed inset-0 z-[90] grid place-items-center p-4">
      <div class="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" @click="cancel" />
      <form
        class="dialog-panel relative w-full max-w-md rounded-3xl bg-white p-6 shadow-lift"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'adm-dlg-title'"
        @submit.prevent="ok"
      >
        <div class="flex items-start gap-4">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" :class="toneIcon">
            <AppIcon :name="d.icon || (d.tone === 'danger' ? 'close' : d.tone === 'success' ? 'check' : 'sparkles')" :size="20" :stroke-width="2" />
          </span>
          <div class="min-w-0 flex-1">
            <h2 id="adm-dlg-title" class="font-serif text-2xl font-semibold leading-tight text-charcoal">{{ d.title }}</h2>
            <p v-if="d.message" class="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{{ d.message }}</p>
          </div>
        </div>

        <div v-if="d.input" class="mt-5">
          <label class="adm-label" for="adm-dlg-input">{{ d.input.label }}</label>
          <div v-if="d.input.presets?.length" class="mb-2 flex flex-wrap gap-1.5">
            <button
              v-for="p in d.input.presets"
              :key="p"
              type="button"
              class="rounded-full px-2.5 py-1 text-xs ring-1 transition"
              :class="value === p ? 'bg-rosewood text-white ring-rosewood' : 'text-charcoal-soft ring-charcoal/15 hover:ring-rosewood/40 hover:text-rosewood'"
              @click="value = p"
            >
              {{ p }}
            </button>
          </div>
          <textarea
            id="adm-dlg-input"
            ref="field"
            v-model="value"
            rows="3"
            class="adm-input resize-none"
            :class="{ '!border-red-400': error }"
            :placeholder="d.input.placeholder || ''"
          />
          <p v-if="error" class="mt-1 text-xs text-red-600" role="alert">{{ error }}</p>
        </div>

        <div v-if="d.checks?.length" class="mt-4 space-y-2">
          <label v-for="c in checks" :key="c.key" class="flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ring-charcoal/10 transition hover:bg-ivory">
            <input v-model="c.value" type="checkbox" class="mt-0.5 h-4 w-4 accent-rosewood">
            <span>
              <span class="block text-sm font-medium text-charcoal">{{ c.label }}</span>
              <span v-if="c.hint" class="block text-xs text-charcoal-soft">{{ c.hint }}</span>
            </span>
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="adm-btn-ghost" @click="cancel">{{ d.cancelLabel || 'Cancel' }}</button>
          <button ref="okBtn" type="submit" :class="toneBtn">{{ d.confirmLabel }}</button>
        </div>
      </form>
    </div>
  </Transition>
</template>

<script setup>
const { state: d, close } = useAdminDialog()
const value = ref('')
const error = ref('')
const checks = ref([])
const field = ref(null)
const okBtn = ref(null)

watch(d, async (v) => {
  if (!v) return
  value.value = v.input?.value || ''
  error.value = ''
  checks.value = (v.checks || []).map((c) => ({ ...c, value: !!c.value }))
  await nextTick()
  ;(field.value || okBtn.value)?.focus()
})

const toneIcon = computed(() => ({ danger: 'bg-red-50 text-red-600', success: 'bg-emerald-50 text-emerald-600', warn: 'bg-sky-50 text-sky-600' })[d.value?.tone] || 'bg-rosewood-50 text-rosewood')
const toneBtn = computed(() => ({ danger: 'adm-btn-danger', success: 'adm-btn-success' })[d.value?.tone] || 'adm-btn-primary')

const ok = () => {
  if (d.value.input?.required && value.value.trim().length < 3) {
    error.value = d.value.input.error || 'Please add a short explanation.'
    return
  }
  close(d.value.input || d.value.checks ? { value: value.value.trim(), checks: Object.fromEntries(checks.value.map((c) => [c.key, c.value])) } : true)
}
const cancel = () => close(null)

const onKey = (e) => {
  if (e.key === 'Escape' && d.value) cancel()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
.adm-dialog-enter-active,
.adm-dialog-leave-active {
  transition: opacity 0.25s ease;
}
.adm-dialog-enter-active .dialog-panel,
.adm-dialog-leave-active .dialog-panel {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.adm-dialog-enter-from,
.adm-dialog-leave-to {
  opacity: 0;
}
.adm-dialog-enter-from .dialog-panel,
.adm-dialog-leave-to .dialog-panel {
  transform: translateY(16px) scale(0.97);
}
</style>
