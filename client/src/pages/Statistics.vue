<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading">
      <!-- Stats Cards Skeleton -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div v-for="i in 5" :key="i" class="card p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div class="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>

      <!-- Charts Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
        <div class="card p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-12 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Statistics</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchAllStats" class="btn-primary">Try Again</button>
    </div>

    <!-- Statistics Content -->
    <div v-else>
      <!-- Stats Cards Row -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard
          v-for="(stat, index) in statCards"
          :key="index"
          :title="stat.title"
          :value="stat.value"
          :bg-color="stat.color"
          :loading="false"
        >
          <template #icon>
            <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon"/>
            </svg>
          </template>
        </StatsCard>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Daily QR Codes Chart -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            QR Codes Generated Per Day
          </h2>
          <div class="relative" style="height: 300px;">
            <canvas ref="dailyChartRef"></canvas>
          </div>
          <p v-if="dailyStats.length === 0" class="text-center text-gray-500 mt-4">
            No data available yet
          </p>
        </div>

        <!-- Type Distribution Chart -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            QR Code Types Distribution
          </h2>
          <div class="relative" style="height: 300px;">
            <canvas ref="typeChartRef"></canvas>
          </div>
          <p v-if="typeDistribution.length === 0" class="text-center text-gray-500 mt-4">
            No data available yet
          </p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card p-6 mt-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-3xl font-bold text-blue-600">{{ animatedStats.total }}</p>
            <p class="text-sm text-blue-800 mt-1">Total Generated</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-3xl font-bold text-green-600">{{ stats.todayQRs || 0 }}</p>
            <p class="text-sm text-green-800 mt-1">Generated Today</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-3xl font-bold text-purple-600">{{ typeDistribution.length }}</p>
            <p class="text-sm text-purple-800 mt-1">Different Types</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <Toast
      v-model="toast.visible"
      :message="toast.message"
      :type="toast.type"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { qrService } from '../services/qrService';
import StatsCard from '../components/StatsCard.vue';
import Toast from '../components/Toast.vue';

// Register Chart.js components
Chart.register(...registerables);

// Reactive state
const loading = ref(true);
const error = ref(null);
const stats = ref({});
const dailyStats = ref([]);
const typeDistribution = ref([]);
const animatedStats = ref({
  total: 0,
  url: 0,
  text: 0,
  email: 0,
  phone: 0,
  wifi: 0
});

// Chart references
const dailyChartRef = ref(null);
const typeChartRef = ref(null);
let dailyChart = null;
let typeChart = null;

// Toast notification
const toast = ref({
  visible: false,
  message: '',
  type: 'info'
});

/**
 * Stat cards configuration
 */
const statCards = computed(() => [
  {
    title: 'Total QR Codes',
    value: animatedStats.value.total,
    color: 'blue',
    iconColor: 'text-blue-700',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    title: 'URL QR Codes',
    value: animatedStats.value.url,
    color: 'indigo',
    iconColor: 'text-indigo-700',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
  },
  {
    title: 'Text QR Codes',
    value: animatedStats.value.text,
    color: 'yellow',
    iconColor: 'text-yellow-700',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    title: 'Email QR Codes',
    value: animatedStats.value.email,
    color: 'green',
    iconColor: 'text-green-700',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  {
    title: 'WiFi QR Codes',
    value: animatedStats.value.wifi,
    color: 'purple',
    iconColor: 'text-purple-700',
    icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0'
  }
]);

/**
 * Animate number counting
 */
const animateValue = (key, targetValue, duration = 1000) => {
  const startValue = animatedStats.value[key];
  const difference = targetValue - startValue;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    
    animatedStats.value[key] = Math.round(startValue + difference * easeOutQuart);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

/**
 * Create daily QR codes chart
 */
const createDailyChart = async () => {
  await nextTick();
  
  if (!dailyChartRef.value) return;

  // Destroy existing chart
  if (dailyChart) {
    dailyChart.destroy();
  }

  const ctx = dailyChartRef.value.getContext('2d');
  
  // Prepare data
  const labels = dailyStats.value.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const data = dailyStats.value.map(item => item.count);

  dailyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'QR Codes Generated',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y} QR codes`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: (value) => Math.floor(value)
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
};

/**
 * Create type distribution doughnut chart
 */
const createTypeChart = async () => {
  await nextTick();
  
  if (!typeChartRef.value) return;

  // Destroy existing chart
  if (typeChart) {
    typeChart.destroy();
  }

  const ctx = typeChartRef.value.getContext('2d');
  
  // Type colors mapping
  const typeColors = {
    'URL': { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)' },
    'Plain Text': { bg: 'rgba(107, 114, 128, 0.8)', border: 'rgba(107, 114, 128, 1)' },
    'Email': { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgba(16, 185, 129, 1)' },
    'Phone Number': { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' },
    'WiFi': { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgba(139, 92, 246, 1)' }
  };

  const labels = typeDistribution.value.map(item => item.type);
  const data = typeDistribution.value.map(item => item.count);
  const backgroundColor = typeDistribution.value.map(item => 
    typeColors[item.type]?.bg || 'rgba(156, 163, 175, 0.8)'
  );
  const borderColor = typeDistribution.value.map(item => 
    typeColors[item.type]?.border || 'rgba(156, 163, 175, 1)'
  );

  typeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderColor,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return ` ${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

/**
 * Fetch all statistics data
 */
const fetchAllStats = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log('📊 Fetching all statistics...');
    
    // Fetch all stats in parallel
    const [statsResponse, dailyResponse, typeResponse] = await Promise.all([
      qrService.getStats(),
      qrService.getDailyStats(),
      qrService.getTypeDistribution()
    ]);

    stats.value = statsResponse.data;
    dailyStats.value = dailyResponse.data;
    typeDistribution.value = typeResponse.data;

    console.log('✅ Statistics loaded:', {
      stats: stats.value,
      dailyCount: dailyStats.value.length,
      typesCount: typeDistribution.value.length
    });

    // Animate stat numbers
    const targets = {
      total: stats.value.totalQRs || 0,
      url: stats.value.urlQRs || 0,
      text: stats.value.textQRs || 0,
      email: stats.value.emailQRs || 0,
      phone: stats.value.phoneQRs || 0,
      wifi: stats.value.wifiQRs || 0
    };

    Object.keys(targets).forEach(key => {
      animateValue(key, targets[key]);
    });

    // Create charts after data is loaded
    await createDailyChart();
    await createTypeChart();

  } catch (err) {
    console.error('❌ Error fetching statistics:', err);
    error.value = err.response?.data?.message || 'Failed to load statistics';
  } finally {
    loading.value = false;
  }
};

// Fetch data on mount
onMounted(() => {
  fetchAllStats();
});

// Cleanup charts on unmount
onUnmounted(() => {
  if (dailyChart) {
    dailyChart.destroy();
  }
  if (typeChart) {
    typeChart.destroy();
  }
});
</script>