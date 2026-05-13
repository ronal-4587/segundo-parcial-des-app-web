<template>
  <!-- SidebarComponent: Menú lateral con las rutas disponibles e iconos -->
  <div :class="['estanco-sidebar', { 'sidebar-open': isOpen }]">
    <!-- Overlay para móvil -->
    <div class="sidebar-overlay d-lg-none" :class="{ active: isOpen }" @click="$emit('close')"></div>

    <aside class="sidebar-content">
      <!-- Cabecera del sidebar en móvil -->
      <div class="sidebar-header d-lg-none d-flex justify-content-between align-items-center p-3">
        <span class="text-primary fw-bold">Menú</span>
        <button class="btn btn-sm btn-outline-secondary" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Navegación -->
      <nav class="sidebar-nav p-3">
        <div class="nav-section-label text-light small mb-2 px-2" style="opacity: 0.85;">NAVEGACIÓN</div>

        <RouterLink
          to="/dashboard"
          class="sidebar-link"
          :class="{ active: route.name === 'Dashboard' }"
          @click="$emit('close')"
        >
          <i class="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/productos"
          class="sidebar-link"
          :class="{ active: route.name === 'Productos' }"
          @click="$emit('close')"
        >
          <i class="bi bi-box-seam"></i>
          <span>Productos</span>
          <span class="badge bg-primary text-dark ms-auto">{{ productCount }}</span>
        </RouterLink>

        <RouterLink
          to="/dashboard/clientes"
          class="sidebar-link"
          :class="{ active: route.name === 'Clientes' }"
          @click="$emit('close')"
        >
          <i class="bi bi-people"></i>
          <span>Clientes</span>
        </RouterLink>

        <div class="nav-section-label text-light small mb-2 px-2 mt-4" style="opacity: 0.85;">AJUSTES</div>

        <a href="https://github.com" target="_blank" class="sidebar-link">
          <i class="bi bi-github"></i>
          <span>Repositorio</span>
          <i class="bi bi-box-arrow-up-right ms-auto small"></i>
        </a>
      </nav>

      <!-- Footer del sidebar -->
      <div class="sidebar-footer p-3 mt-auto">
        <div class="text-light small text-center" style="opacity: 0.85;">
          <i class="bi bi-shield-check text-primary me-1"></i>
          Estanco Ortega © 2025
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'
import { getProducts } from '../services/productService'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['close'])

const route = useRoute()
const productCount = computed(() => getProducts().length)
</script>

<style scoped>
.estanco-sidebar {
  position: relative;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1040;
}
.sidebar-overlay.active {
  display: block;
}

.sidebar-content {
  width: 240px;
  min-height: 100%;
  background-color: #1e1e1e;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
}

/* Móvil: sidebar fuera de pantalla por defecto */
@media (max-width: 991px) {
  .sidebar-content {
    position: fixed;
    top: 0;
    left: -250px;
    height: 100vh;
    z-index: 1050;
    transition: left 0.3s ease;
  }
  .sidebar-open .sidebar-content {
    left: 0;
  }
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #a0a0a0;
  text-decoration: none;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  font-size: 0.92rem;
}
.sidebar-link:hover {
  background-color: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}
.sidebar-link.active {
  background-color: rgba(212, 175, 55, 0.15);
  color: #d4af37;
  font-weight: 600;
  border-left: 3px solid #d4af37;
}
.sidebar-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.badge.bg-primary {
  background-color: #d4af37 !important;
  color: #121212 !important;
  font-weight: 700;
}

.nav-section-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
}
</style>
