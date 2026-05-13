/**
 * productService.js
 * Servicio de gestión de productos con LocalStorage.
 * Precarga desde products.json si no existe data en localStorage.
 * 
 * NOTA EDUCATIVA: Este servicio simula operaciones CRUD de forma local.
 * En una aplicación real, estas operaciones se harían contra una API REST.
 */

const STORAGE_KEY = 'estanco_ortega_products_v3'

/**
 * Inicializa el localStorage con los datos del JSON si está vacío.
 */
export async function initProducts() {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    const response = await fetch('/data/products.json')
    const data = await response.json()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  }
  return JSON.parse(existing)
}

/**
 * Obtiene todos los productos desde localStorage.
 */
export function getProducts() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

/**
 * Obtiene un producto por ID.
 */
export function getProductById(id) {
  return getProducts().find(p => p.id === Number(id)) || null
}

/**
 * Crea un nuevo producto.
 */
export function createProduct(product) {
  const products = getProducts()
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
  const newProduct = { ...product, id: newId }
  products.push(newProduct)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  return newProduct
}

/**
 * Actualiza un producto existente por ID.
 */
export function updateProduct(id, updatedData) {
  const products = getProducts()
  const index = products.findIndex(p => p.id === Number(id))
  if (index === -1) return null
  products[index] = { ...products[index], ...updatedData, id: Number(id) }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  return products[index]
}

/**
 * Elimina un producto por ID.
 */
export function deleteProduct(id) {
  const products = getProducts()
  const filtered = products.filter(p => p.id !== Number(id))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

/**
 * Actualiza el stock de un producto restando la cantidad indicada.
 */
export function updateProductStock(id, quantityToSubtract) {
  const products = getProducts()
  const index = products.findIndex(p => p.id === Number(id))
  if (index === -1) return false
  
  if (products[index].stock >= quantityToSubtract) {
    products[index].stock -= quantityToSubtract
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    return true
  }
  return false
}

/**
 * Formatea precio en pesos colombianos.
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}
