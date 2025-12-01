import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/HomeView.vue'
import Upplevelse from '@/views/UpplevelseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/upplevelser/:id',
      component: Upplevelse,
    },
  ],
})

export default router
