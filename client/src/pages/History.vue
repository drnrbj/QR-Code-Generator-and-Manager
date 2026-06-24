<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">History</h1>
      </div>
      <!-- Total Count Badge -->
      <div v-if="!loading && !error" class="mt-4 sm:mt-0">
        <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 text-primary-800">
          Total: {{ totalCount }}
        </span>
      </div>
    </div>

    <!-- Search and Sort Bar -->
    <div class="card p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search Input -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by content or type..."
            class="input-field pl-10"
            @input="onSearchInput"
          />
          <!-- Clear search button -->
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Sort Dropdown -->
        <div class="md:w-48">
          <select
            v-model="sortBy"
            @change="onSortChange"
            class="input-field"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="type">By Type</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LoadingSkeleton v-for="i in 6" :key="i" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-12 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading QR Codes</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchQRCodes" class="btn-primary">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="qrCodes.length === 0" class="card p-12 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m4-6V7m-4-4v1m6 11h2m-6 0h-2m-2 0h-2m4 0h2m-2-6v6m-4-4v1"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        {{ searchQuery ? 'No results match your search' : 'No QR Codes Yet' }}
      </h3>
      <p class="text-gray-600 mb-4">
        {{ searchQuery 
          ? 'Try adjusting your search terms or clear the search' 
          : 'Start by generating your first QR code'
        }}
      </p>
      <div class="flex justify-center space-x-4">
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="btn-secondary"
        >
          Clear Search
        </button>
        <router-link to="/generate" class="btn-primary">
          Generate QR Code
        </router-link>
      </div>
    </div>

    <!-- QR Codes Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QRCard
          v-for="qrCode in qrCodes"
          :key="qrCode._id"
          :qrCode="qrCode"
          @download="downloadQR"
          @view="viewDetails"
          @delete="confirmDelete"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalCount"
          @page-change="onPageChange"
        />
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Delete QR Code"
      message="Are you sure you want to delete this QR code? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="deleteQR"
      @cancel="showDeleteDialog = false"
    />

    <!-- Toast Notifications -->
    <Toast
      v-model="toast.visible"
      :message="toast.message"
      :type="toast.type"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { qrService } from '../services/qrService';
import QRCard from '../components/QRCard.vue';
import LoadingSkeleton from '../components/LoadingSkeleton.vue';
import Pagination from '../components/Pagination.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import Toast from '../components/Toast.vue';

const router = useRouter();

// Reactive state
const qrCodes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const totalPages = ref(0);
const totalCount = ref(0);
const itemsPerPage = 10;

// Delete confirmation
const showDeleteDialog = ref(false);
const deleteId = ref(null);

// Toast notification
const toast = ref({
  visible: false,
  message: '',
  type: 'info'
});

// Debounce timer for search
let debounceTimer = null;

/**
 * Show toast notification
 */
const showToast = (message, type = 'info') => {
  toast.value.message = message;
  toast.value.type = type;
  toast.value.visible = true;
};

/**
 * Fetch QR codes from API with current filters
 */
const fetchQRCodes = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log('📋 Fetching QR codes...', {
      page: currentPage.value,
      search: searchQuery.value,
      sort: sortBy.value
    });

    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      sort: sortBy.value
    };

    // Add search if not empty
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    const response = await qrService.getAllQRCodes(params);
    
    qrCodes.value = response.data;
    totalPages.value = response.totalPages;
    totalCount.value = response.count;
    
    console.log(`✅ Fetched ${qrCodes.value.length} QR codes (Page ${currentPage.value}/${totalPages.value})`);

  } catch (err) {
    console.error('❌ Error fetching QR codes:', err);
    error.value = err.response?.data?.message || 'Failed to load QR codes';
  } finally {
    loading.value = false;
  }
};

/**
 * Debounced search handler
 */
const onSearchInput = () => {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timer
  debounceTimer = setTimeout(() => {
    currentPage.value = 1; // Reset to first page on search
    fetchQRCodes();
  }, 300); // 300ms debounce
};

/**
 * Clear search query
 */
const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  fetchQRCodes();
};

/**
 * Handle sort change
 */
const onSortChange = () => {
  currentPage.value = 1; // Reset to first page
  fetchQRCodes();
};

/**
 * Handle page change
 */
const onPageChange = (page) => {
  currentPage.value = page;
  fetchQRCodes();
  
  // Scroll to top of page smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Download QR code as PNG
 */
const downloadQR = (qrCode) => {
  try {
    console.log('📥 Downloading QR code:', qrCode._id);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCode.qrImage;
    
    // Generate filename with type and timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedType = qrCode.qrType.toLowerCase().replace(/\s+/g, '-');
    link.download = `qr-code-${sanitizedType}-${timestamp}.png`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ QR code downloaded');
    showToast('QR code downloaded successfully!', 'success');
    
  } catch (err) {
    console.error('❌ Error downloading QR code:', err);
    showToast('Failed to download QR code', 'error');
  }
};

/**
 * View QR code details
 */
const viewDetails = (id) => {
  console.log('👁️ Viewing QR code details:', id);
  router.push(`/history/${id}`);
};

/**
 * Show delete confirmation dialog
 */
const confirmDelete = (id) => {
  console.log('🗑️ Confirm delete for QR code:', id);
  deleteId.value = id;
  showDeleteDialog.value = true;
};

/**
 * Delete QR code
 */
const deleteQR = async () => {
  if (!deleteId.value) return;

  try {
    console.log('🗑️ Deleting QR code:', deleteId.value);
    await qrService.deleteQRCode(deleteId.value);
    
    console.log('✅ QR code deleted');
    showToast('QR code deleted successfully!', 'success');
    
    // Optimistic update: remove from local array
    qrCodes.value = qrCodes.value.filter(code => code._id !== deleteId.value);
    
    // If page is now empty and not first page, go to previous page
    if (qrCodes.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
    
    // Refetch to get accurate count
    fetchQRCodes();
    
  } catch (err) {
    console.error('❌ Error deleting QR code:', err);
    const errorMessage = err.response?.data?.message || 'Failed to delete QR code';
    showToast(errorMessage, 'error');
  } finally {
    deleteId.value = null;
    showDeleteDialog.value = false;
  }
};

// Watch for route query params (if any)
watch(
  () => router.currentRoute.value.query,
  (newQuery) => {
    if (newQuery.search) {
      searchQuery.value = newQuery.search;
      fetchQRCodes();
    }
  }
);

// Fetch initial data on mount
onMounted(() => {
  fetchQRCodes();
});

// Cleanup debounce timer on unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<style scoped>
/* Any additional styles if needed */
</style>