<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden group">

    <!-- QR Image -->
    <div class="p-5 bg-gray-50 flex items-center justify-center border-b border-gray-100">
      <img
        :src="qrCode.qrImage"
        :alt="`QR Code - ${qrCode.qrType}`"
        class="max-h-40 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <!-- Info -->
    <div class="px-4 py-3.5">
      <!-- Type badge right, date left -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-400 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDate }}
        </span>
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          {{ qrCode.qrType }}
        </span>
      </div>

      <!-- Content -->
      <p class="text-sm font-medium text-gray-800 truncate" :title="qrCode.content">
        {{ qrCode.content }}
      </p>
    </div>

    <!-- Action Row — full width, 3 equal columns -->
    <div class="grid grid-cols-3 border-t border-gray-100">
      <button
        @click="handleDownload"
        class="flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500
               hover:bg-blue-600 hover:text-white transition-all duration-150
               border-r border-gray-100 focus:outline-none"
        title="Download QR Code"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>

      <button
        @click="handleView"
        class="flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500
               hover:bg-blue-600 hover:text-white transition-all duration-150
               border-r border-gray-100 focus:outline-none"
        title="View Details"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </button>

      <button
        @click="handleDelete"
        class="flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500
               hover:bg-red-500 hover:text-white transition-all duration-150
               focus:outline-none"
        title="Delete QR Code"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  qrCode: {
    type: Object,
    required: true,
    validator: (obj) => obj._id && obj.content && obj.qrType && obj.qrImage
  }
});

const emit = defineEmits(['download', 'view', 'delete']);

const formattedDate = computed(() => {
  if (!props.qrCode.createdAt) return 'Unknown date';

  const date = new Date(props.qrCode.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(date);
});

const handleDownload = () => emit('download', props.qrCode);
const handleView = () => emit('view', props.qrCode._id);
const handleDelete = () => emit('delete', props.qrCode._id);
</script>