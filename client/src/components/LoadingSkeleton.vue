<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <!-- Image skeleton -->
    <div class="p-4 bg-gray-100 animate-pulse">
      <div class="h-48 bg-gray-200 rounded"></div>
    </div>

    <!-- Content skeleton -->
    <div class="p-4 space-y-3">
      <!-- Type badge skeleton -->
      <div class="h-5 bg-gray-200 rounded-full w-20 animate-pulse"></div>
      
      <!-- Content line skeleton -->
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
      
      <!-- Date skeleton -->
      <div class="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
      
      <!-- Buttons skeleton -->
      <div class="flex justify-between pt-3 border-t border-gray-100">
        <div class="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div class="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div class="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Simple loading skeleton component
// No logic needed - pure presentational
</script>