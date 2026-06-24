<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="text-center animate-fade-in">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="relative inline-block">
          <div class="text-9xl font-bold text-gray-200 select-none">404</div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                    d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m4-6V7m-4-4v1m6 11h2m-6 0h-2m-2 0h-2m4 0h2m-2-6v6m-4-4v1"/>
            </svg>
          </div>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Navigation Options -->
      <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <router-link to="/" class="btn-primary flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Go to Dashboard</span>
        </router-link>
        <router-link to="/generate" class="btn-secondary flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Generate QR Code</span>
        </router-link>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">You might be looking for:</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link 
            v-for="link in helpfulLinks" 
            :key="link.path"
            :to="link.path"
            class="text-primary-600 hover:text-primary-700 hover:underline"
          >
            {{ link.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const helpfulLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Generate QR', path: '/generate' },
  { name: 'History', path: '/history' },
  { name: 'Statistics', path: '/statistics' }
];
</script>