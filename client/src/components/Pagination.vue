<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
    <!-- Page Info -->
    <div class="text-sm text-gray-700">
      Page <span class="font-medium">{{ currentPage }}</span> of 
      <span class="font-medium">{{ totalPages }}</span>
      <span class="hidden sm:inline"> • {{ totalItems }} total items</span>
    </div>

    <!-- Pagination Controls -->
    <nav class="flex items-center space-x-1" aria-label="Pagination">
      <!-- Previous Button -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="currentPage === 1 
          ? 'text-gray-400 bg-gray-100' 
          : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'"
      >
        <span class="sr-only">Previous</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <!-- Page Numbers -->
      <template v-for="page in displayedPages" :key="page">
        <!-- Ellipsis -->
        <span
          v-if="page === '...'"
          class="px-3 py-2 text-sm text-gray-500"
        >
          ...
        </span>
        
        <!-- Page Number -->
        <button
          v-else
          @click="goToPage(page)"
          class="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
          :class="page === currentPage
            ? 'bg-primary-600 text-white'
            : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next Button -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="currentPage === totalPages 
          ? 'text-gray-400 bg-gray-100' 
          : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'"
      >
        <span class="sr-only">Next</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['page-change']);

/**
 * Generate array of page numbers to display
 * Shows first page, last page, and pages around current page
 * Uses ellipsis for gaps
 */
const displayedPages = computed(() => {
  const pages = [];
  const maxVisible = 5; // Maximum visible page numbers
  
  if (props.totalPages <= maxVisible + 2) {
    // Show all pages if total is small
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let start = Math.max(2, props.currentPage - 1);
    let end = Math.min(props.totalPages - 1, props.currentPage + 1);
    
    // Adjust range to show maxVisible pages
    if (props.currentPage <= 2) {
      end = Math.min(props.totalPages - 1, maxVisible);
    } else if (props.currentPage >= props.totalPages - 1) {
      start = Math.max(2, props.totalPages - maxVisible + 1);
    }
    
    // Add ellipsis if needed before range
    if (start > 2) {
      pages.push('...');
    }
    
    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed after range
    if (end < props.totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page
    pages.push(props.totalPages);
  }
  
  return pages;
});

/**
 * Navigate to specific page
 */
const goToPage = (page) => {
  if (page < 1 || page > props.totalPages) return;
  emit('page-change', page);
};
</script>