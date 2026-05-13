<template>
  <div class="container py-4">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary mb-3">Nuestro Catálogo</h1>
      <p class="lead text-light">Descubre nuestra selección premium de licores y bebidas.</p>
    </div>

    <!-- Filtros por categoría (opcional, básico) -->
    <div class="d-flex justify-content-center gap-2 mb-4 flex-wrap">
      <button 
        class="btn btn-sm" 
        :class="selectedCategory === 'Todos' ? 'btn-primary' : 'btn-outline-secondary'"
        @click="selectedCategory = 'Todos'"
      >
        Todos
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="btn btn-sm"
        :class="selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Catálogo de productos -->
    <div v-if="filteredProducts.length === 0" class="text-center text-muted my-5">
      <i class="bi bi-box-seam fs-1 mb-3 d-block"></i>
      <p>No hay productos disponibles en esta categoría.</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div class="col" v-for="product in filteredProducts" :key="product.id">
        <ProductCardComponent 
          :product="product" 
          mode="customer"
          @add-to-cart="handleAddToCart"
          @ver-detalles="handleVerDetalles"
        />
      </div>
    </div>

    <!-- Toast / Alerta de producto añadido -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div id="cartToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-check-circle me-2"></i>
            Producto añadido al carrito.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCardComponent from '../components/ProductCardComponent.vue'
import { getProducts, initProducts } from '../services/productService'
import { addToCart } from '../services/cartService'

const products = ref([])
const selectedCategory = ref('Todos')

const categories = computed(() => {
  const cats = products.value.map(p => p.category)
  return [...new Set(cats)].filter(Boolean)
})

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Todos') return products.value
  return products.value.filter(p => p.category === selectedCategory.value)
})

onMounted(async () => {
  // Asegurar que haya datos
  await initProducts()
  products.value = getProducts()
})

function handleAddToCart(product) {
  addToCart(product, 1)
  
  // Mostrar Toast usando Bootstrap de manera sencilla
  const toastEl = document.getElementById('cartToast')
  if (toastEl && window.bootstrap) {
    const toast = new window.bootstrap.Toast(toastEl)
    toast.show()
  } else {
    // Fallback simple si no está el script de bootstrap cargado globalmente
    toastEl.classList.add('show')
    setTimeout(() => {
      toastEl.classList.remove('show')
    }, 3000)
  }
}

function handleVerDetalles(product) {
  // Opcional: Implementar un modal para detalles
  alert(`Detalles de ${product.name}\n\n${product.description}`)
}
</script>
