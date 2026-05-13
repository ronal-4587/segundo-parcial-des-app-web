import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'estanco_ortega_cart'

// Estado reactivo centralizado para el carrito
const state = reactive({
  items: []
})

// Inicializar desde localStorage
export function initCart() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    state.items = JSON.parse(stored)
  }
}

// Guardar en localStorage cada vez que haya un cambio
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
}

export const cartItems = computed(() => state.items)

export const cartCount = computed(() => {
  return state.items.reduce((total, item) => total + item.quantity, 0)
})

export const cartTotal = computed(() => {
  return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

export function addToCart(product, quantity = 1) {
  const existingItem = state.items.find(item => item.id === product.id)
  
  if (existingItem) {
    // Si ya existe, validamos que no exceda el stock (opcional, pero buena práctica)
    if (existingItem.quantity + quantity <= product.stock) {
      existingItem.quantity += quantity
    } else {
      existingItem.quantity = product.stock // Límite de stock
    }
  } else {
    // Si no existe, agregamos el producto entero más la propiedad quantity
    state.items.push({
      ...product,
      quantity: Math.min(quantity, product.stock)
    })
  }
  saveCart()
}

export function removeFromCart(productId) {
  state.items = state.items.filter(item => item.id !== productId)
  saveCart()
}

export function updateQuantity(productId, quantity) {
  const item = state.items.find(i => i.id === productId)
  if (item) {
    if (quantity > 0 && quantity <= item.stock) {
      item.quantity = quantity
    } else if (quantity > item.stock) {
      item.quantity = item.stock
    }
    saveCart()
  }
}

export function clearCart() {
  state.items = []
  saveCart()
}

// Iniciar automáticamente al importar
initCart()
