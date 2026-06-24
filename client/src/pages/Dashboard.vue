<template>
  <div class="animate-fade-in">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Welcome to your QR Code Manager</p>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total QR Codes Card -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m4-6V7m-4-4v1m6 11h2m-6 0h-2m-2 0h-2m4 0h2m-2-6v6m-4-4v1"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-600">+12%</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">0</h3>
        <p class="text-gray-600 text-sm">Total QR Codes</p>
      </div>

      <!-- Today's Generation Card -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-green-600">Today</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">0</h3>
        <p class="text-gray-600 text-sm">Generated Today</p>
      </div>

      <!-- URL QR Codes Card -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-purple-600">Most Used</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">0</h3>
        <p class="text-gray-600 text-sm">URL QR Codes</p>
      </div>

      <!-- WiFi QR Codes Card -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"/>
            </svg>
          </div>
          <span class="text-sm font-medium text-yellow-600">Popular</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">0</h3>
        <p class="text-gray-600 text-sm">WiFi QR Codes</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link 
          to="/generate"
          class="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg 
                 hover:bg-primary-100 transition-colors duration-200"
        >
          <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Generate New QR Code</h3>
            <p class="text-sm text-gray-600">Create a new QR code for any purpose</p>
          </div>
        </router-link>

        <router-link 
          to="/history"
          class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg 
                 hover:bg-gray-100 transition-colors duration-200"
        >
          <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">View History</h3>
            <p class="text-sm text-gray-600">Browse all your generated QR codes</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dashboard logic will be implemented in Phase 2
// This is a placeholder page with UI structure
</script>