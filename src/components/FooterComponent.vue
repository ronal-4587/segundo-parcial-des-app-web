<template>
  <!-- FooterComponent: Pie de página con derechos reservados -->
  <footer class="estanco-footer py-3 px-4">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2"
    >
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-droplet-half text-primary"></i>
        <span class="text-light small" style="opacity: 0.85">
          &copy; {{ currentYear }}
          <strong class="text-primary">Estanco Ortega</strong> — Todos los
          derechos reservados.
        </span>
      </div>
      <div
        class="text-light small d-flex align-items-center gap-3"
        style="opacity: 0.85"
      >
        <span>
          <i class="bi bi-geo-alt me-1 text-primary"></i>Ocaña,Norte de
          Santander, Colombia
        </span>
        <span> <i class="bi bi-mortarboard me-1 text-primary"></i>UFPSO </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.estanco-footer {
  background-color: #1e1e1e;
  border-top: 1px solid #333333;
  margin-top: auto;
}
</style>
