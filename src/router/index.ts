import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/HomeView.vue'
import Upplevelse from '@/views/UpplevelseView.vue'
import BokningSidaView from '@/views/BokningSidaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/bokning',
      component: BokningSidaView,
    },
    {
      path: '/upplevelse/:id',
      component: Upplevelse,
    },
  ],
})

export default router
