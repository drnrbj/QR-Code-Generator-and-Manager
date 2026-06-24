<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Overview of your QR code statistics</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total QR Codes Card -->
      <StatsCard
        title="Total QR Codes"
        :value="stats.totalQRs || 0"
        bg-color="blue"
        :loading="loading"
      >
        <template #icon>
          <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </template>
      </StatsCard>

      <!-- Generated Today Card -->
      <StatsCard
        title="Generated Today"
        :value="stats.todayQRs || 0"
        bg-color="green"
        :loading="loading"
      >
        <template #icon>
          <svg class="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        </template>
      </StatsCard>

      <!-- Latest QR Card -->
      <StatsCard
        title="Latest QR Code"
        :value="stats.latestQR?.qrType || 'N/A'"
        :subtitle="truncatedContent"
        bg-color="purple"
        :loading="loading"
      >
        <template #icon>
          <svg class="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m4-6V7m-4-4v1m6 11h2m-6 0h-2m-2 0h-2m4 0h2m-2-6v6m-4-4v1"/>
          </svg>
        </template>
      </StatsCard>
    </div>

    <!-- Quick Actions Section -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link 
          to="/generate"
          class="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg 
                 hover:bg-blue-100 transition-all duration-200 hover:scale-105"
        >
          <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Generate New QR</h3>
            <p class="text-sm text-gray-600">Create a new QR code</p>
          </div>
        </router-link>

        <router-link 
          to="/history"
          class="flex items-center space-x-3 p-4 bg-green-50 rounded-lg 
                 hover:bg-green-100 transition-all duration-200 hover:scale-105"
        >
          <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">View History</h3>
            <p class="text-sm text-gray-600">Browse all QR codes</p>
          </div>
        </router-link>

        <router-link 
          to="/statistics"
          class="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg 
                 hover:bg-purple-100 transition-all duration-200 hover:scale-105"
        >
          <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Statistics</h3>
            <p class="text-sm text-gray-600">View analytics</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="card p-6 bg-red-50 border-red-200">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <h3 class="font-semibold text-red-800">Error Loading Dashboard</h3>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <button 
          @click="fetchStats"
          class="ml-auto btn-primary text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { qrService } from '../services/qrService';
import StatsCard from '../components/StatsCard.vue';

// Reactive state
const stats = ref({
  totalQRs: 0,
  todayQRs: 0,
  latestQR: null
});
const loading = ref(true);
const error = ref(null);

/**
 * Truncate content for display
 */
const truncatedContent = computed(() => {
  if (!stats.value.latestQR?.content) return 'No QR codes generated yet';
  const content = stats.value.latestQR.content;
  return content.length > 50 ? content.substring(0, 50) + '...' : content;
});

/**
 * Fetch dashboard statistics from API
 */
const fetchStats = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    console.log('📊 Fetching dashboard stats...');
    const response = await qrService.getStats();
    stats.value = response.data;
    console.log('✅ Dashboard stats loaded:', stats.value);
  } catch (err) {
    console.error('❌ Error fetching stats:', err);
    error.value = err.response?.data?.message || 'Failed to load dashboard statistics';
  } finally {
    loading.value = false;
  }
};

// Fetch stats on component mount
onMounted(() => {
  fetchStats();
});
</script>