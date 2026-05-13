<template>
  <div class="container py-4">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <h2 class="fw-bold text-primary mb-0">
        <i class="bi bi-cart me-2"></i>Tu Carrito
      </h2>
      <RouterLink to="/" class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-arrow-left me-1"></i>Seguir comprando
      </RouterLink>
    </div>

    <div v-if="successMessage" class="alert alert-success d-flex align-items-center mb-4" role="alert">
      <i class="bi bi-check-circle-fill me-2 fs-4"></i>
      <div>
        <h5 class="alert-heading mb-1">¡Compra Exitosa!</h5>
        <p class="mb-0">{{ successMessage }}</p>
      </div>
    </div>

    <div v-if="cartItems.length === 0 && !successMessage" class="text-center text-muted my-5 bg-dark p-5 rounded border border-secondary">
      <i class="bi bi-cart-x fs-1 mb-3 d-block"></i>
      <h4>El carrito está vacío</h4>
      <p>Aún no has agregado productos a tu carrito de compras.</p>
      <RouterLink to="/" class="btn btn-primary mt-3">Ir al Catálogo</RouterLink>
    </div>

    <div v-else-if="cartItems.length > 0" class="row g-4">
      <!-- Lista de Productos -->
      <div class="col-lg-8">
        <div class="card bg-dark border-secondary mb-3" v-for="item in cartItems" :key="item.id">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-2 col-4 mb-3 mb-md-0">
                <img :src="item.image" :alt="item.name" class="img-fluid rounded bg-white p-1" style="max-height: 80px; object-fit: contain;">
              </div>
              <div class="col-md-4 col-8">
                <h6 class="text-light mb-1">{{ item.name }}</h6>
                <p class="text-muted small mb-0">{{ formatPrice(item.price) }} c/u</p>
              </div>
              <div class="col-md-4 col-8 mt-3 mt-md-0 d-flex align-items-center justify-content-md-center">
                <div class="input-group input-group-sm w-75">
                  <button class="btn btn-outline-secondary" @click="handleUpdateQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                  <input type="text" class="form-control text-center bg-dark text-light border-secondary" :value="item.quantity" readonly>
                  <button class="btn btn-outline-secondary" @click="handleUpdateQuantity(item, item.quantity + 1)" :disabled="item.quantity >= item.stock">+</button>
                </div>
              </div>
              <div class="col-md-2 col-4 mt-3 mt-md-0 text-end">
                <p class="fw-bold text-primary mb-1">{{ formatPrice(item.price * item.quantity) }}</p>
                <button class="btn btn-sm btn-link text-danger p-0 text-decoration-none" @click="handleRemove(item.id)">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="d-flex justify-content-end mb-4">
          <button class="btn btn-sm btn-outline-danger" @click="clearCart">
            <i class="bi bi-trash-fill me-1"></i>Vaciar Carrito
          </button>
        </div>
      </div>

      <!-- Resumen de Compra -->
      <div class="col-lg-4">
        <div class="card bg-dark border-primary sticky-top" style="top: 80px;">
          <div class="card-body">
            <h5 class="card-title text-light mb-4">Resumen del Pedido</h5>
            
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal ({{ cartCount }} items)</span>
              <span class="text-light">{{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Envío</span>
              <span class="text-success">Gratis</span>
            </div>
            
            <hr class="border-secondary">
            
            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold text-light fs-5">Total</span>
              <span class="fw-bold text-primary fs-5">{{ formatPrice(cartTotal) }}</span>
            </div>
            
            <button class="btn btn-primary w-100 py-2 fw-bold" @click="handleCheckout" :disabled="isCheckingOut">
              <span v-if="isCheckingOut" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isCheckingOut ? 'Procesando...' : 'Finalizar Compra' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } from '../services/cartService'
import { formatPrice, updateProductStock } from '../services/productService'

const isCheckingOut = ref(false)
const successMessage = ref('')

function handleUpdateQuantity(item, newQuantity) {
  if (newQuantity > 0 && newQuantity <= item.stock) {
    updateQuantity(item.id, newQuantity)
  }
}

function handleRemove(id) {
  removeFromCart(id)
}

function handleCheckout() {
  isCheckingOut.value = true
  
  // Simulando retardo de red o procesamiento de pago
  setTimeout(() => {
    // Descontar stock de products.json en localStorage
    cartItems.value.forEach(item => {
      updateProductStock(item.id, item.quantity)
    })
    
    clearCart()
    isCheckingOut.value = false
    successMessage.value = 'Tu pedido ha sido procesado correctamente y pronto será enviado.'
    
    // Ocultar el mensaje después de unos segundos
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
    
  }, 1500)
}
</script>
