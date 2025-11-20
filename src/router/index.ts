import { createRouter, createWebHistory } from 'vue-router'

import Counter from '@/CounterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/counter',
    },
    {
      path: '/counter',
      component: Counter,
    },
  ],
})

export default router
