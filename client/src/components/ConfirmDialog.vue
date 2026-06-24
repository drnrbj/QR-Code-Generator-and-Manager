<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="cancel"
        />

        <!-- Modal Panel -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
            @click.stop
          >
            <!-- Icon -->
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>

            <!-- Content -->
            <div class="text-center">
              <h3 class="text-lg font-semibold text-gray-900 mb-2" id="modal-title">
                {{ title }}
              </h3>
              <p class="text-sm text-gray-500 mb-6">
                {{ message }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3">
              <button
                @click="cancel"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                       rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 
                       focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
              >
                {{ cancelText }}
              </button>
              <button
                @click="confirm"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 
                       rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 
                       focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

/**
 * Handle confirmation
 */
const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

/**
 * Handle cancellation
 */
const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>