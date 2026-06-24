<template>
  <div class="animate-fade-in">
    <!-- Back Button -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to History
      </button>
    </div>

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">QR Code Details</h1>
      <p class="text-gray-600">View detailed information about your QR code</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 text-center">
      <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Loading QR code details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-12 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading QR Code</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchQRDetail" class="btn-primary">Try Again</button>
    </div>

    <!-- QR Detail Content -->
    <div v-else-if="qrCode" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- QR Image -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">QR Code Image</h2>
        <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
          <img 
            :src="qrCode.qrImage" 
            alt="QR Code"
            class="max-w-full h-auto"
            style="max-height: 400px;"
          />
        </div>
        <div class="mt-4 flex space-x-3">
          <button @click="downloadQR" class="btn-primary flex-1">
            Download QR
          </button>
          <button @click="deleteQR" class="btn-secondary flex-1 text-red-600 hover:bg-red-50">
            Delete QR
          </button>
        </div>
      </div>

      <!-- QR Details -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">QR Code Information</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-500">Content</label>
            <p class="mt-1 text-gray-900">{{ qrCode.content }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500">Type</label>
            <span 
              class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="typeBadgeClass"
            >
              {{ qrCode.qrType }}
            </span>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500">Size</label>
            <p class="mt-1 text-gray-900">{{ qrCode.size }} x {{ qrCode.size }} px</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500">Foreground Color</label>
              <div class="mt-1 flex items-center space-x-2">
                <div 
                  class="w-6 h-6 rounded border border-gray-300"
                  :style="{ backgroundColor: qrCode.foregroundColor }"
                />
                <span class="text-gray-900">{{ qrCode.foregroundColor }}</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500">Background Color</label>
              <div class="mt-1 flex items-center space-x-2">
                <div 
                  class="w-6 h-6 rounded border border-gray-300"
                  :style="{ backgroundColor: qrCode.backgroundColor }"
                />
                <span class="text-gray-900">{{ qrCode.backgroundColor }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500">Created</label>
            <p class="mt-1 text-gray-900">{{ formattedDate }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500">QR Code ID</label>
            <p class="mt-1 text-gray-500 text-sm font-mono">{{ qrCode._id }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { qrService } from '../services/qrService';
import Toast from '../components/Toast.vue';

const route = useRoute();
const router = useRouter();

const qrCode = ref(null);
const loading = ref(true);
const error = ref(null);

const toast = ref({
  visible: false,
  message: '',
  type: 'info'
});

/**
 * Type badge color
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
  if (!qrCode.value?.createdAt) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(qrCode.value.createdAt));
});

/**
 * Show toast
 */
const showToast = (message, type) => {
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
    console.error('❌ Error fetching QR detail:', err);
    error.value = err.response?.data?.message || 'Failed to load QR code details';
  } finally {
    loading.value = false;
  }
};

/**
 * Navigate back to history
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
  link.download = `qr-code-${timestamp}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('QR code downloaded!', 'success');
};

/**
 * Delete QR code
 */
const deleteQR = async () => {
  if (!qrCode.value || !confirm('Are you sure you want to delete this QR code?')) return;
  
  try {
    await qrService.deleteQRCode(qrCode.value._id);
    showToast('QR code deleted!', 'success');
    router.push('/history');
  } catch (err) {
    showToast('Failed to delete QR code', 'error');
  }
};

onMounted(() => {
  fetchQRDetail();
});
</script>