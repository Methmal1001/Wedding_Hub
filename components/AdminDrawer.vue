<template>
  <!-- Slide-over panel for record details -->
  <Teleport to="body">
    <Transition name="adm-drawer">
      <div v-if="open" class="fixed inset-0 z-[80] flex justify-end">
        <div class="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]" @click="$emit('close')" />
        <aside
          class="drawer-panel relative flex h-full w-full flex-col bg-ivory shadow-lift"
          :class="wide ? 'max-w-3xl' : 'max-w-xl'"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <header class="flex items-start gap-3 border-b border-charcoal/10 bg-white px-5 py-4 sm:px-6">
            <div class="min-w-0 flex-1">
              <p v-if="eyebrow" class="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dark">{{ eyebrow }}</p>
              <h2 class="truncate font-serif text-2xl font-semibold text-charcoal">{{ title }}</h2>
              <slot name="sub" />
            </div>
            <button type="button" class="adm-icon-btn" aria-label="Close" @click="$emit('close')">
              <AppIcon name="close" :size="18" />
            </button>
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="flex flex-wrap items-center justify-end gap-2 border-t border-charcoal/10 bg-white px-5 py-3.5 sm:px-6">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  wide: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const { state: dialog } = useAdminDialog()
const onKey = (e) => {
  if (e.key === 'Escape' && props.open && !dialog.value) emit('close')
}
watch(
  () => props.open,
  (v) => {
    document.documentElement.style.overflow = v ? 'hidden' : ''
  }
)
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.adm-drawer-enter-active,
.adm-drawer-leave-active {
  transition: opacity 0.3s ease;
}
.adm-drawer-enter-active .drawer-panel,
.adm-drawer-leave-active .drawer-panel {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.adm-drawer-enter-from,
.adm-drawer-leave-to {
  opacity: 0;
}
.adm-drawer-enter-from .drawer-panel,
.adm-drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
