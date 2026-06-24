<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="text-center animate-fade-in">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="relative inline-block">
          <div class="text-9xl font-bold text-blue-500 select-none">404</div>
          <div class="absolute inset-0 flex items-center justify-center">
          </div>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Navigation Options -->
      <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <router-link to="/generate" class="btn-primary flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Generate QR Code</span>
        </router-link>
      </div>
    </div>
  </div>
</template>