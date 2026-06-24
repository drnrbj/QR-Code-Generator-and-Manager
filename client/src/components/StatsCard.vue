<template>
  <div 
    class="card p-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-default"
    :class="bgColorClass"
  >
    <div class="flex items-center justify-between mb-4">
      <!-- Icon Container -->
      <div 
        class="w-12 h-12 rounded-lg flex items-center justify-center"
        :class="iconBgClass"
      >
        <slot name="icon">
          <svg 
            class="w-6 h-6"
            :class="iconColorClass"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m4-6V7m-4-4v1m6 11h2m-6 0h-2m-2 0h-2m4 0h2m-2-6v6m-4-4v1"
            />
          </svg>
        </slot>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="animate-pulse flex space-x-4">
        <div class="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="!loading">
      <h3 class="text-2xl font-bold text-gray-900 mb-1">
        {{ displayValue }}
      </h3>
      <p class="text-gray-600 text-sm">{{ title }}</p>
      
      <!-- Subtitle if provided -->
      <p v-if="subtitle" class="text-xs text-gray-500 mt-2 truncate">
        {{ subtitle }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-else class="space-y-3">
      <div class="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
      <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: 0
  },
  subtitle: {
    type: String,
    default: ''
  },
  bgColor: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'purple', 'yellow', 'red', 'indigo'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
});

/**
 * Background color class based on bgColor prop
 */
const bgColorClass = computed(() => {
  const colors = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
    indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'
  };
  return colors[props.bgColor] || colors.blue;
});

/**
 * Icon background class
 */
const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    purple: 'bg-purple-200',
    yellow: 'bg-yellow-200',
    red: 'bg-red-200',
    indigo: 'bg-indigo-200'
  };
  return colors[props.bgColor] || colors.blue;
});

/**
 * Icon color class
 */
const iconColorClass = computed(() => {
  const colors = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    purple: 'text-purple-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
    indigo: 'text-indigo-700'
  };
  return colors[props.bgColor] || colors.blue;
});

/**
 * Format display value
 */
const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value || 'N/A';
});
</script>

<style scoped>
.card {
  backdrop-filter: blur(10px);
}
</style>