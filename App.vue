<template>
  <!-- App.vue actúa como punto de entrada. Las vistas se cargan aquí -->
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* ============================================
   Variables de Bootstrap sobrescritas con la
   paleta de colores de Estanco Ortega
   ============================================ */
:root {
  --bs-primary: #d4af37;
  --bs-primary-rgb: 212, 175, 55;
  --estanco-gold: #d4af37;
  --estanco-gold-dark: #b8972e;
  --estanco-dark: #121212;
  --estanco-panel: #1e1e1e;
  --estanco-border: #333333;
  --estanco-muted: #a0a0a0;
}

body {
  background-color: var(--estanco-dark);
  color: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Botón primario con color dorado */
.btn-primary {
  background-color: var(--estanco-gold) !important;
  border-color: var(--estanco-gold) !important;
  color: #121212 !important;
  font-weight: 600;
}
.btn-primary:hover {
  background-color: var(--estanco-gold-dark) !important;
  border-color: var(--estanco-gold-dark) !important;
}

.btn-outline-primary {
  color: var(--estanco-gold) !important;
  border-color: var(--estanco-gold) !important;
}
.btn-outline-primary:hover {
  background-color: var(--estanco-gold) !important;
  color: #121212 !important;
}

/* Texto dorado utilitario */
.text-primary {
  color: var(--estanco-gold) !important;
}

/* Scrollbar personalizado */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--estanco-dark); }
::-webkit-scrollbar-thumb { background: var(--estanco-border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--estanco-gold); }
</style>
