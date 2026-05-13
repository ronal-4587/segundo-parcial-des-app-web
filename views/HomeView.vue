<template>
  <!-- HomeView: Vista principal del Dashboard con estadísticas -->
  <div class="p-4">

    <!-- Encabezado de bienvenida -->
    <div class="mb-4">
      <h2 class="text-primary fw-bold mb-1">
        <i class="bi bi-speedometer2 me-2"></i>Dashboard
      </h2>
      <p class="text-light mb-0" style="opacity: 0.85;">Bienvenido, <strong class="text-light">{{ session?.nombre }}</strong>. Aquí tienes un resumen del negocio.</p>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon bg-primary-subtle">
            <i class="bi bi-box-seam text-primary fs-4"></i>
          </div>
          <div>
            <div class="fs-2 fw-bold text-light">{{ stats.totalProducts }}</div>
            <div class="text-light small" style="opacity: 0.85;">Total Productos</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(25,135,84,0.15)">
            <i class="bi bi-boxes fs-4" style="color:#198754"></i>
          </div>
          <div>
            <div class="fs-2 fw-bold text-light">{{ stats.totalStock }}</div>
            <div class="text-light small" style="opacity: 0.85;">Unidades en Stock</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(13,202,240,0.15)">
            <i class="bi bi-tags fs-4" style="color:#0dcaf0"></i>
          </div>
          <div>
            <div class="fs-2 fw-bold text-light">{{ stats.totalCategories }}</div>
            <div class="text-light small" style="opacity: 0.85;">Categorías</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(255,193,7,0.15)">
            <i class="bi bi-currency-dollar fs-4 text-warning"></i>
          </div>
          <div>
            <div class="fs-2 fw-bold text-light">{{ formatPrice(stats.avgPrice) }}</div>
            <div class="text-light small" style="opacity: 0.85;">Precio Promedio</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Últimos productos agregados -->
    <div class="row g-3">
      <div class="col-12 col-lg-8">
        <div class="dashboard-panel">
          <div class="panel-header">
            <h6 class="text-primary mb-0"><i class="bi bi-clock-history me-2"></i>Últimos productos</h6>
            <RouterLink to="/dashboard/productos" class="btn btn-sm btn-outline-primary">
              Ver todos <i class="bi bi-arrow-right ms-1"></i>
            </RouterLink>
          </div>
          <div class="table-responsive">
            <table class="table table-dark table-hover table-sm mb-0">
              <thead>
                <tr>
                  <th class="text-primary">#</th>
                  <th class="text-primary">Nombre</th>
                  <th class="text-primary">Categoría</th>
                  <th class="text-primary">Precio</th>
                  <th class="text-primary">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in recentProducts" :key="p.id">
                  <td class="text-light" style="opacity: 0.85;">{{ p.id }}</td>
                  <td class="text-light">{{ p.name }}</td>
                  <td><span class="badge" style="background:rgba(212,175,55,0.2);color:#d4af37">{{ p.category }}</span></td>
                  <td class="text-light">{{ formatPrice(p.price) }}</td>
                  <td><span class="badge bg-secondary">{{ p.stock }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="dashboard-panel h-100">
          <div class="panel-header">
            <h6 class="text-primary mb-0"><i class="bi bi-pie-chart me-2"></i>Por categoría</h6>
          </div>
          <ul class="list-unstyled mb-0">
            <li v-for="(count, cat) in stats.byCategory" :key="cat" class="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
              <span class="text-light small">{{ cat }}</span>
              <span class="badge" style="background:rgba(212,175,55,0.2);color:#d4af37">{{ count }} prod.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getProducts, formatPrice } from '../services/productService'
import { getSession } from '../services/authService'

const session = getSession()
const products = computed(() => getProducts())

const recentProducts = computed(() => [...products.value].slice(-5).reverse())

const stats = computed(() => {
  const ps = products.value
  const byCategory = ps.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  return {
    totalProducts: ps.length,
    totalStock: ps.reduce((s, p) => s + (p.stock || 0), 0),
    totalCategories: Object.keys(byCategory).length,
    avgPrice: ps.length ? ps.reduce((s, p) => s + p.price, 0) / ps.length : 0,
    byCategory,
  }
})
</script>

<style scoped>
.stat-card {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: border-color 0.2s;
}
.stat-card:hover { border-color: #d4af37; }
.stat-icon {
  width: 52px; height: 52px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.dashboard-panel {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #333;
}
.table-dark { background-color: transparent; }
.table-dark td, .table-dark th { border-color: #333; vertical-align: middle; }
</style>
