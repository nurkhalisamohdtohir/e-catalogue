import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'product-list',
      component: () => import('@/views/product-list.vue')
    },
    {
      path: '/create',
      name: 'product-create',
      component: () => import('@/views/product-create.vue')
    },
    {
      path: '/:productId/update',
      name: 'product-update',
      component: () => import('@/views/product-update.vue')
    }
  ]
})

export default router
