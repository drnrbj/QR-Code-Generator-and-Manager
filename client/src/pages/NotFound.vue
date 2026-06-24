<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="text-9xl font-bold text-gray-200">404</div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p class="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <!-- Navigation Options -->
      <div class="space-x-4">
        <router-link to="/" class="btn-primary">
          Go to Dashboard
        </router-link>
        <router-link to="/generate" class="btn-secondary">
          Generate QR Code
        </router-link>
      </div>

      <!-- Helpful Links -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">You might be looking for:</h2>
        <div class="flex justify-center space-x-8">
          <router-link to="/history" class="text-primary-600 hover:text-primary-700">
            QR Code History
          </router-link>
          <router-link to="/statistics" class="text-primary-600 hover:text-primary-700">
            Statistics
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 page component
</script>