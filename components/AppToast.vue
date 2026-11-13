<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex justify-center px-4 sm:bottom-6 sm:justify-end sm:px-6" aria-live="polite">
    <Transition name="fade">
      <div
        v-if="toast"
        :key="toast.id"
        class="toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-white p-4 shadow-lift ring-1 ring-rosewood/10"
        role="status"
      >
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rosewood-50 text-rosewood">
          <AppIcon :name="toast.icon" :size="18" :filled="toast.icon === 'heart'" />
        </span>
        <div class="min-w-0 flex-1">
          <p v-if="toast.title" class="font-serif text-lg font-semibold leading-tight text-charcoal">{{ toast.title }}</p>
          <p class="mt-0.5 text-sm leading-snug text-charcoal-soft">{{ toast.message }}</p>
        </div>
        <button
          type="button"
          class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-charcoal-soft hover:bg-rosewood/5 hover:text-rosewood"
          aria-label="Dismiss notification"
          @click="hide"
        >
          <AppIcon name="close" :size="15" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { toast, hide } = useToast()
</script>

<style scoped>
.toast {
  animation: toast-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
