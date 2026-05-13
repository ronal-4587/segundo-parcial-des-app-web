/**
 * router/index.js
 * Configuración de vue-router con rutas hijas para el Dashboard.
 * El layout persistente (Navbar + Sidebar) se logra con rutas anidadas (children).
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import { isAuthenticated } from '../services/authService'

// Vistas
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import ClientView from '../views/ClientView.vue'

// Vistas del Cliente
import CustomerLayout from '../layouts/CustomerLayout.vue'
import CustomerCatalogView from '../views/CustomerCatalogView.vue'
import CartView from '../views/CartView.vue'

const routes = [
  {
    path: '/',
    component: CustomerLayout,
    children: [
      {
        path: '',
        name: 'Catalog',
        component: CustomerCatalogView,
      },
      {
        path: 'cart',
        name: 'Cart',
        component: CartView,
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    // Ruta padre: renderiza el layout persistente (Navbar + Sidebar)
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: HomeView,
      },
      {
        path: 'productos',
        name: 'Productos',
        component: ProductView,
      },
      {
        path: 'clientes',
        name: 'Clientes',
        component: ClientView,
      },
    ],
  },
  // Redirige cualquier ruta no encontrada al login
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Navigation Guard: protege el dashboard si no hay sesión
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated()) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
