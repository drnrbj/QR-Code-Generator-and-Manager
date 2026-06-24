<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 4v1m6 11h2m-6 0h-2m4 0h-2m4-6V7m-4-4v1m6 11h2m-6 0h-2m-2 0h-2m4 0h2m-2-6v6m-4-4v1"/>
              </svg>
            </div>
            <span class="text-lg font-bold text-gray-800">QR Manager</span>
          </div>
          <p class="text-sm text-gray-600">
            Generate, manage, and track QR codes for all your needs.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.path">
              <router-link 
                :to="link.path"
                class="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Tech Stack -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tech Stack</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>Vue.js 3 (Frontend)</li>
            <li>Express.js (Backend)</li>
            <li>MongoDB (Database)</li>
            <li>Tailwind CSS (Styling)</li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-500">
            &copy; {{ currentYear }} QR Code Manager. All rights reserved.
          </p>
          <p class="text-sm text-gray-500 mt-2 md:mt-0">
            Made with ❤️ using Vue.js + Express.js
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());

const quickLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Generate QR', path: '/generate' },
  { name: 'History', path: '/history' },
  { name: 'Statistics', path: '/statistics' }
];
</script>