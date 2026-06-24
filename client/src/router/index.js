import { createRouter, createWebHistory } from 'vue-router'

const Generate = () => import('../pages/Generate.vue')
const History = () => import('../pages/History.vue')
const QRDetail = () => import('../pages/QRDetail.vue')

/**
 * Route Configuration
 * Defines all application routes with lazy loading
 */
const routes = [
  {
    path: '/',
    redirect: '/generate'
  },
  {
    path: '/generate',
    name: 'Generate',
    component: () => import('../pages/Generate.vue'),
    meta: { title: 'Generate QR Code' }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../pages/History.vue'),
    meta: { title: 'QR Code History' }
  },
  {
    // Catch all route for 404 pages
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: {
      title: '404 - Not Found',
      description: 'Page not found'
    }
  }
]

// Create router instance with HTML5 history mode
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on route change
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard to update page title
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = `${to.meta.title} | QR Code Manager`
  next()
})

export default router