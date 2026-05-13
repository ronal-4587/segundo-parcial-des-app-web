<template>
  <!--
    DashboardLayout.vue — Layout persistente del Dashboard.
    Contiene Navbar + Sidebar que NUNCA se destruyen al cambiar de vista hija.
    Las vistas hijas (ProductView, ClientView, etc.) se renderizan en <RouterView>.
  -->
  <div class="dashboard-layout">
    <!-- Navbar siempre visible -->
    <NavbarComponent :session="session" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="dashboard-body">
      <!-- Sidebar siempre visible en desktop, toggle en móvil -->
      <SidebarComponent :is-open="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Área principal: aquí se renderizan las rutas hijas -->
      <main class="main-content">
        <RouterView />
        <FooterComponent />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { getSession } from '../services/authService'

const session = ref(getSession())
const sidebarOpen = ref(false)
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121212;
}

.dashboard-body {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;
}
</style>
