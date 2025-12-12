<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Simple fixed header - FULL WIDTH -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="w-full px-4 py-3">
        <a 
          href="/" 
          class="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          upplevelsesida
        </a>
      </div>
    </header>

    <!-- Main Content with padding for fixed header -->
    <main class="pt-16">
      <RouterView />
    </main>
  </div>
</template>