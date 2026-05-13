<template>
  <!-- NavbarComponent: Encabezado superior con nombre del negocio y logo -->
  <nav class="navbar navbar-dark px-3 py-2 estanco-navbar">
    <div class="d-flex align-items-center gap-3">
      <!-- Botón hamburguesa para sidebar en móvil -->
      <button
        v-if="isAdmin"
        class="btn btn-sm btn-outline-primary d-lg-none"
        @click="$emit('toggle-sidebar')"
        title="Abrir menú"
      >
        <i class="bi bi-list fs-5"></i>
      </button>

      <!-- Logo y nombre del negocio -->
      <RouterLink :to="isAdmin ? '/dashboard' : '/'" class="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
        <div class="estanco-logo">
          <i class="bi bi-droplet-half fs-4 text-primary"></i>
        </div>
        <div>
          <span class="fw-bold text-primary fs-5">Estanco Ortega</span>
          <div class="text-light small lh-1" style="opacity: 0.85;">Licores & Bebidas Premium</div>
        </div>
      </RouterLink>
    </div>

    <!-- Info de sesión, Carrito y botón logout -->
    <div class="d-flex align-items-center gap-3">
      <!-- Icono de Carrito para Cliente -->
      <RouterLink v-if="!isAdmin" to="/cart" class="btn btn-sm btn-outline-primary position-relative" title="Ver Carrito">
        <i class="bi bi-cart"></i>
        <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{ cartCount }}
        </span>
      </RouterLink>

      <div v-if="isAdmin" class="d-none d-md-flex align-items-center gap-2">
        <i class="bi bi-person-circle text-primary"></i>
        <span class="text-light small">{{ session?.nombre || 'Usuario' }}</span>
      </div>
      
      <button v-if="isAdmin" class="btn btn-sm btn-outline-danger" @click="handleLogout" title="Cerrar sesión">
        <i class="bi bi-box-arrow-right me-1"></i>
        <span class="d-none d-md-inline">Salir</span>
      </button>
      <RouterLink v-else to="/login" class="btn btn-sm btn-outline-secondary" title="Acceso Administrador">
        <i class="bi bi-shield-lock"></i>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { logout, getSession } from '../services/authService'
import { cartCount } from '../services/cartService'

// Props: datos de sesión opcionales y modo admin
const props = defineProps({
  session: {
    type: Object,
    default: () => getSession(),
  },
  isAdmin: {
    type: Boolean,
    default: true,
  }
})

// Evento para mostrar/ocultar sidebar en móvil
defineEmits(['toggle-sidebar'])

const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.estanco-navbar {
  background-color: #1e1e1e;
  border-bottom: 2px solid #d4af37;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 1030;
}

.estanco-logo {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #d4af37, #b8972e);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.estanco-logo i {
  color: #121212 !important;
}
</style>
