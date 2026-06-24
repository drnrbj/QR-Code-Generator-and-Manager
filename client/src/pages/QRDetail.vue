<template>
  <div class="animate-fade-in">
    <!-- Back Button -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
      >
        <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to History
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12">
      <div class="flex flex-col items-center">
        <div class="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mb-4"></div>
        <p class="text-gray-600">Loading QR code details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-12 text-center">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ errorTitle }}</h3>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <div class="flex justify-center space-x-4">
        <button @click="goBack" class="btn-secondary">Go Back</button>
        <button @click="fetchQRDetail" class="btn-primary">Try Again</button>
      </div>
    </div>

    <!-- QR Detail Content -->
    <div v-else-if="qrCode" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- QR Image Section -->
      <div class="lg:col-span-2">
        <div class="card p-6 sticky top-24">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">QR Code Image</h2>
          <div class="bg-gray-50 rounded-lg p-6 flex items-center justify-center mb-4">
            <img 
              :src="qrCode.qrImage" 
              :alt="`QR Code - ${qrCode.qrType}`"
              class="max-w-full h-auto rounded shadow-sm"
              style="max-height: 350px;"
              loading="eager"
            />
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-3">
            <button 
              @click="downloadQR"
              class="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Download QR Code</span>
            </button>
            
            <button 
              @click="confirmDelete"
              class="w-full border border-red-300 text-red-700 px-4 py-2 rounded-lg 
                     hover:bg-red-50 transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                     flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span>Delete QR Code</span>
            </button>
          </div>
        </div>
      </div>

      <!-- QR Details Section -->
      <div class="lg:col-span-3">
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">QR Code Details</h2>
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="typeBadgeClass"
            >
              {{ qrCode.qrType }}
            </span>
          </div>

          <!-- Details Grid -->
          <div class="space-y-6">
            <!-- Content -->
            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-500 mb-2">Content</label>
              <p class="text-gray-900 font-medium break-all">{{ qrCode.content }}</p>
            </div>

            <!-- Type & Size Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">QR Type</label>
                <p class="text-gray-900 font-medium">{{ qrCode.qrType }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">Size</label>
                <p class="text-gray-900 font-medium">{{ qrCode.size }} x {{ qrCode.size }} px</p>
              </div>
            </div>

            <!-- Colors -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">Foreground Color</label>
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
                    :style="{ backgroundColor: qrCode.foregroundColor }"
                  ></div>
                  <span class="text-gray-900 font-medium font-mono">{{ qrCode.foregroundColor }}</span>
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">Background Color</label>
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
                    :style="{ backgroundColor: qrCode.backgroundColor }"
                  ></div>
                  <span class="text-gray-900 font-medium font-mono">{{ qrCode.backgroundColor }}</span>
                </div>
              </div>
            </div>

            <!-- Creation Date -->
            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-500 mb-2">Created</label>
              <p class="text-gray-900 font-medium">{{ formattedDate }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ relativeTime }}</p>
            </div>

            <!-- QR Code ID -->
            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-500 mb-2">QR Code ID</label>
              <p class="text-gray-500 font-mono text-sm break-all">{{ qrCode._id }}</p>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { qrService } from '../services/qrService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import Toast from '../components/Toast.vue';

const route = useRoute();
const router = useRouter();

// State
const qrCode = ref(null);
const loading = ref(true);
const error = ref(null);
const showDeleteDialog = ref(false);

// Toast
const toast = ref({
  visible: false,
  message: '',
  type: 'info'
});

/**
 * Type badge color class
 */
const typeBadgeClass = computed(() => {
  if (!qrCode.value) return '';
  const classes = {
    'URL': 'bg-blue-100 text-blue-800',
    'Plain Text': 'bg-gray-100 text-gray-800',
    'Email': 'bg-green-100 text-green-800',
    'Phone Number': 'bg-yellow-100 text-yellow-800',
    'WiFi': 'bg-purple-100 text-purple-800'
  };
  return classes[qrCode.value.qrType] || 'bg-gray-100 text-gray-800';
});

/**
 * Formatted date
 */
const formattedDate = computed(() => {
  if (!qrCode.value?.createdAt) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(qrCode.value.createdAt));
});

/**
 * Relative time
 */
const relativeTime = computed(() => {
  if (!qrCode.value?.createdAt) return '';
  const date = new Date(qrCode.value.createdAt);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 2592000)} months ago`;
});

/**
 * Error title based on error type
 */
const errorTitle = computed(() => {
  if (error.value?.includes('not found')) return 'QR Code Not Found';
  return 'Error Loading QR Code';
});

/**
 * Show toast
 */
const showToast = (message, type = 'info') => {
  toast.value.message = message;
  toast.value.type = type;
  toast.value.visible = true;
};

/**
 * Fetch QR code detail
 */
const fetchQRDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    const id = route.params.id;
    console.log('🔍 Fetching QR detail:', id);
    const response = await qrService.getQRCode(id);
    qrCode.value = response.data;
    console.log('✅ QR detail loaded');
  } catch (err) {
    console.error('❌ Error:', err);
    error.value = err.response?.data?.message || 'Failed to load QR code details';
  } finally {
    loading.value = false;
  }
};

/**
 * Navigate back
 */
const goBack = () => {
  router.push('/history');
};

/**
 * Download QR code
 */
const downloadQR = () => {
  if (!qrCode.value) return;
  
  const link = document.createElement('a');
  link.href = qrCode.value.qrImage;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.download = `qr-code-${qrCode.value.qrType.toLowerCase()}-${timestamp}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('QR code downloaded successfully!', 'success');
};

/**
 * Show delete confirmation
 */
const confirmDelete = () => {
  showDeleteDialog.value = true;
};

/**
 * Delete QR code
 */
const deleteQR = async () => {
  if (!qrCode.value) return;

  try {
    await qrService.deleteQRCode(qrCode.value._id);
    showToast('QR code deleted successfully!', 'success');
    setTimeout(() => {
      router.push('/history');
    }, 1000);
  } catch (err) {
    showToast('Failed to delete QR code', 'error');
  }
};

onMounted(() => {
  fetchQRDetail();
});
</script>