<template>
  <!--
    ProductCardComponent: Tarjeta individual de producto.
    Recibe datos via props y emite eventos al padre.
  -->
  <div class="card product-card h-100 border-0">
    <div class="product-img-wrapper">
      <img
        :src="product.image"
        :alt="product.name"
        class="card-img-top product-img"
        loading="lazy"
        @error="onImgError"
      />
      <span class="badge category-badge">{{ product.category }}</span>
    </div>
    <div class="card-body d-flex flex-column p-3">
      <h6 class="card-title product-name text-primary mb-1">{{ product.name }}</h6>
      <p class="card-text text-light small mb-2 flex-grow-1" style="opacity: 0.85;">{{ product.description }}</p>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="product-price fw-bold text-light">{{ formatPrice(product.price) }}</span>
        <span class="badge bg-secondary text-light small">
          <i class="bi bi-boxes me-1"></i>{{ product.stock }} und
        </span>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-primary flex-grow-1" @click="$emit('ver-detalles', product)">
          <i class="bi bi-eye me-1"></i>Detalles
        </button>
        <template v-if="mode === 'admin'">
          <button class="btn btn-sm btn-outline-warning" @click="$emit('editar', product)" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="$emit('eliminar', product.id)" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </template>
        <template v-else-if="mode === 'customer'">
          <button 
            class="btn btn-sm btn-primary flex-grow-1" 
            :disabled="product.stock <= 0"
            @click="$emit('add-to-cart', product)"
          >
            <i class="bi bi-cart-plus me-1"></i>
            {{ product.stock > 0 ? 'Añadir' : 'Agotado' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '../services/productService'

// Props: recibe el objeto producto completo y el modo de vista
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'admin', // 'admin' o 'customer'
  }
})

// Eventos que emite hacia el componente padre
defineEmits(['ver-detalles', 'editar', 'eliminar', 'add-to-cart'])

function onImgError(e) {
  e.target.src = `https://placehold.co/300x300/1a1a2e/d4af37?text=${encodeURIComponent(props.product.name.slice(0, 10))}`
}
</script>

<style scoped>
.product-card {
  background-color: #1e1e1e;
  border: 1px solid #333 !important;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  border-color: #d4af37 !important;
}

.product-img-wrapper {
  position: relative;
  background: #fff;
  height: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
  transition: transform 0.3s ease;
}
.product-card:hover .product-img {
  transform: scale(1.08);
}

.category-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(30, 30, 30, 0.85);
  color: #d4af37;
  border: 1px solid #d4af37;
  font-size: 0.7rem;
  border-radius: 20px;
  padding: 2px 8px;
}

.product-name {
  font-size: 0.88rem;
  line-height: 1.3;
  min-height: 2.6em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1rem;
  color: #f5f5f5;
}
</style>
