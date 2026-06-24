<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
      <p class="text-gray-600">View analytics and insights about your QR codes</p>
    </div>

    <!-- Statistics Overview Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- QR Code Distribution Card -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">QR Code Distribution</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">URL</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
              </div>
            </div>
            <span class="text-sm font-medium">0%</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Plain Text</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 0%"></div>
              </div>
            </div>
            <span class="text-sm font-medium">0%</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">WiFi</span>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-600 h-2 rounded-full" style="width: 0%"></div>
              </div>
            </div>
            <span class="text-sm font-medium">0%</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity Card -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="text-center py-8">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <p class="text-gray-500">No data available yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Statistics logic will be implemented in Phase 2
// This is a placeholder page with UI structure
</script>