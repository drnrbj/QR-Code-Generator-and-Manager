<template>
  <div 
    class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
  >
    <!-- QR Code Image -->
    <div class="p-4 bg-gray-50 flex items-center justify-center border-b border-gray-200">
      <img 
        :src="qrCode.qrImage" 
        :alt="`QR Code - ${qrCode.qrType}`"
        class="max-h-48 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <!-- Info Section -->
    <div class="p-4">
      <!-- Type Badge -->
      <div class="mb-3">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="typeBadgeClass"
        >
          {{ qrCode.qrType }}
        </span>
      </div>

      <!-- Content Preview -->
      <div class="mb-2">
        <p class="text-sm text-gray-900 font-medium truncate" :title="qrCode.content">
          {{ qrCode.content }}
        </p>
      </div>

      <!-- Creation Date -->
      <div class="mb-4">
        <p class="text-xs text-gray-500 flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {{ formattedDate }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between space-x-2 pt-3 border-t border-gray-100">
        <!-- Download Button -->
        <button
          @click="handleDownload"
          class="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 
                 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
          title="Download QR Code"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Download</span>
        </button>

        <!-- View Details Button -->
        <button
          @click="handleView"
          class="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-primary-700 
                 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1"
          title="View Details"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <span>View</span>
        </button>

        <!-- Delete Button -->
        <button
          @click="handleDelete"
          class="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-red-700 
                 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          title="Delete QR Code"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  qrCode: {
    type: Object,
    required: true,
    validator: (obj) => {
      return obj._id && obj.content && obj.qrType && obj.qrImage;
    }
  }
});

const emit = defineEmits(['download', 'view', 'delete']);

/**
 * Type badge color classes based on QR type
 */
const typeBadgeClass = computed(() => {
  const classes = {
    'URL': 'bg-blue-100 text-blue-800',
    'Plain Text': 'bg-gray-100 text-gray-800',
    'Email': 'bg-green-100 text-green-800',
    'Phone Number': 'bg-yellow-100 text-yellow-800',
    'WiFi': 'bg-purple-100 text-purple-800'
  };
  return classes[props.qrCode.qrType] || 'bg-gray-100 text-gray-800';
});

/**
 * Format date for display
 */
const formattedDate = computed(() => {
  if (!props.qrCode.createdAt) return 'Unknown date';
  
  const date = new Date(props.qrCode.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // If today, show relative time
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  }

  // If yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // If within 7 days, show day name
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Otherwise, show formatted date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
});

/**
 * Handle download button click
 */
const handleDownload = () => {
  emit('download', props.qrCode);
};

/**
 * Handle view details button click
 */
const handleView = () => {
  emit('view', props.qrCode._id);
};

/**
 * Handle delete button click
 */
const handleDelete = () => {
  emit('delete', props.qrCode._id);
};
</script>

<style scoped>
/* Optional: Add any component-specific styles */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>