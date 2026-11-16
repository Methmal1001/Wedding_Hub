<template>
  <!-- Input with an icon and a floating label -->
  <div class="auth-input">
    <div class="relative">
      <AppIcon
        :name="icon"
        :size="18"
        class="pointer-events-none absolute left-4 z-10 transition-colors duration-300"
        :class="[as === 'textarea' ? 'top-[18px]' : 'top-1/2 -translate-y-1/2', error ? 'text-red-500' : focused ? 'text-rosewood' : 'text-charcoal-soft/70']"
      />
      <!-- Separate elements (not <component :is>) so void <input>s never get slot children – keeps SSR hydration clean -->
      <select
        v-if="as === 'select'"
        v-bind="controlAttrs"
        class="peer field-control cursor-pointer appearance-none pr-4"
        :class="{ 'is-bad': error }"
        v-on="controlEvents"
      >
        <slot />
      </select>
      <textarea
        v-else-if="as === 'textarea'"
        v-bind="controlAttrs"
        class="peer field-control !h-28 resize-none !pt-7 pr-4"
        :class="{ 'is-bad': error }"
        v-on="controlEvents"
      />
      <input
        v-else
        v-bind="controlAttrs"
        :type="currentType"
        class="peer field-control"
        :class="[error ? 'is-bad' : '', type === 'password' ? 'pr-12' : 'pr-4']"
        v-on="controlEvents"
      >
      <label
        :for="id"
        class="field-label"
        :class="{ 'is-up': forceUp || as === 'select' || type === 'date', 'is-area': as === 'textarea' }"
      >
        {{ label }}
      </label>
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-charcoal-soft transition hover:bg-rosewood-50 hover:text-rosewood"
        :aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        @click="show = !show"
      >
        <svg v-if="!show" viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 3l18 18M10.6 6.1A9.5 9.5 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9M6.4 7.6A17 17 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4-.9" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
      </button>
      <AppIcon
        v-if="as === 'select'"
        name="chevronDown"
        :size="16"
        class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-soft"
      />
    </div>
    <Transition name="err">
      <p v-if="error" :id="`${id}-err`" class="mt-1.5 flex items-center gap-1.5 pl-1 text-xs text-red-600" role="alert">
        <span class="grid h-3.5 w-3.5 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">!</span>
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  icon: { type: String, default: 'user' },
  type: { type: String, default: 'text' },
  as: { type: String, default: 'input' },
  error: { type: String, default: '' },
  autocomplete: { type: String, default: undefined },
  min: { type: String, default: undefined },
  forceUp: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const id = useId()
const focused = ref(false)
const show = ref(false)
const currentType = computed(() => (props.type === 'password' && show.value ? 'text' : props.type))

const controlAttrs = computed(() => ({
  id,
  value: props.modelValue,
  autocomplete: props.autocomplete,
  min: props.min,
  disabled: props.disabled,
  placeholder: ' ',
  'aria-invalid': !!props.error,
  'aria-describedby': props.error ? `${id}-err` : undefined
}))
const emitValue = (e) => emit('update:modelValue', e.target.value)
const controlEvents = {
  input: emitValue,
  change: emitValue,
  focus: () => (focused.value = true),
  blur: () => (focused.value = false)
}
</script>

<style scoped>
.field-control {
  @apply h-14 w-full rounded-2xl border border-rosewood/15 bg-white/80 pb-1.5 pl-11 pt-5 text-[15px] text-charcoal outline-none transition duration-300;
}
.field-control:hover {
  @apply border-rosewood/30;
}
.field-control:focus {
  @apply border-rosewood/50 bg-white;
  box-shadow: 0 0 0 4px rgba(180, 99, 122, 0.12), 0 10px 24px -14px rgba(110, 52, 70, 0.45);
}
.field-control:disabled {
  @apply cursor-not-allowed bg-blush-light/50 text-charcoal-soft;
}
.field-control.is-bad {
  @apply border-red-400;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}
.field-label {
  @apply pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-[15px] text-charcoal-soft/80 transition-all duration-300;
}
/* Float the label when focused or filled */
.peer:focus ~ .field-label,
.peer:not(:placeholder-shown) ~ .field-label,
.field-label.is-up {
  @apply top-[15px] text-[11px] font-medium uppercase tracking-[0.14em] text-rosewood;
}
.field-label.is-area {
  @apply top-[18px] translate-y-0;
}
.peer:focus ~ .field-label.is-area,
.peer:not(:placeholder-shown) ~ .field-label.is-area,
.field-label.is-area.is-up {
  @apply top-[10px];
}
.err-enter-active,
.err-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.err-enter-from,
.err-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
