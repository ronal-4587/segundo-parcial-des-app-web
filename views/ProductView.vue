<template>
  <!-- ProductView: Gestión de productos con CRUD simulado usando LocalStorage -->
  <div class="p-4">

    <!-- Encabezado -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h2 class="text-primary fw-bold mb-1"><i class="bi bi-box-seam me-2"></i>Gestión de Productos</h2>
        <p class="text-light mb-0 small" style="opacity: 0.85;">CRUD simulado con LocalStorage — {{ products.length }} productos registrados</p>
      </div>
      <button class="btn btn-primary fw-semibold" @click="openCreateModal">
        <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
      </button>
    </div>

    <!-- Barra de búsqueda y filtros -->
    <div class="row g-2 mb-4">
      <div class="col-12 col-md-6">
        <div class="input-group">
          <span class="input-group-text bg-dark border-secondary text-primary">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control estanco-input"
            placeholder="Buscar producto por nombre..."
          />
        </div>
      </div>
      <div class="col-6 col-md-3">
        <select v-model="filterCategory" class="form-select estanco-input">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="col-6 col-md-3">
        <div class="btn-group w-100">
          <button :class="['btn btn-sm', viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary']" @click="viewMode = 'table'">
            <i class="bi bi-table me-1"></i>Tabla
          </button>
          <button :class="['btn btn-sm', viewMode === 'cards' ? 'btn-primary' : 'btn-outline-secondary']" @click="viewMode = 'cards'">
            <i class="bi bi-grid me-1"></i>Tarjetas
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="toast.show" :class="['alert', `alert-${toast.type}`, 'alert-dismissible', 'py-2']" role="alert">
      <i :class="['bi me-2', toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill']"></i>
      {{ toast.message }}
      <button type="button" class="btn-close" @click="toast.show = false"></button>
    </div>

    <!-- Vista en TABLA -->
    <div v-if="viewMode === 'table'" class="dashboard-panel">
      <div class="table-responsive">
        <table class="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="text-primary">#</th>
              <th class="text-primary">Imagen</th>
              <th class="text-primary">Nombre</th>
              <th class="text-primary">Categoría</th>
              <th class="text-primary">Precio</th>
              <th class="text-primary">Stock</th>
              <th class="text-primary text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" class="text-center text-light py-4" style="opacity: 0.85;">
                <i class="bi bi-inbox fs-3 d-block mb-2"></i>No se encontraron productos
              </td>
            </tr>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="text-light" style="opacity: 0.85;">{{ product.id }}</td>
              <td>
                <img :src="product.image" :alt="product.name" class="product-thumb" />
              </td>
              <td class="text-light fw-semibold" style="max-width:200px">
                <div class="text-truncate" :title="product.name">{{ product.name }}</div>
              </td>
              <td>
                <span class="badge" style="background:rgba(212,175,55,0.2);color:#d4af37">{{ product.category }}</span>
              </td>
              <td class="text-light">{{ formatPrice(product.price) }}</td>
              <td>
                <span :class="['badge', product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning text-dark' : 'bg-danger']">
                  {{ product.stock }}
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex gap-1 justify-content-center">
                  <button class="btn btn-sm btn-outline-info" @click="openDetailModal(product)" title="Ver detalles">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-warning" @click="openEditModal(product)" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(product)" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vista en TARJETAS usando ProductCardComponent -->
    <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
      <div v-for="product in filteredProducts" :key="product.id" class="col">
        <ProductCardComponent
          :product="product"
          @ver-detalles="openDetailModal"
          @editar="openEditModal"
          @eliminar="confirmDelete({ id: $event })"
        />
      </div>
      <div v-if="filteredProducts.length === 0" class="col-12 text-center text-light py-5" style="opacity: 0.85;">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>No se encontraron productos
      </div>
    </div>

    <!-- ====== MODAL CREAR / EDITAR ====== -->
    <div v-if="modal.show && modal.type !== 'delete' && modal.type !== 'detail'" class="modal-overlay" @click.self="closeModal">
      <div class="modal-panel">
        <div class="modal-panel-header">
          <h5 class="text-primary mb-0">
            <i :class="['bi me-2', modal.type === 'create' ? 'bi-plus-circle' : 'bi-pencil-square']"></i>
            {{ modal.type === 'create' ? 'Nuevo Producto' : 'Editar Producto' }}
          </h5>
          <button class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        <div class="modal-panel-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label text-light small">Nombre del producto <span class="text-danger">*</span></label>
              <input v-model="form.name" type="text" class="form-control estanco-input" placeholder="Ej: Whisky Buchanan's 12 Años" />
            </div>
            <div class="col-6">
              <label class="form-label text-light small">Precio (COP) <span class="text-danger">*</span></label>
              <input v-model.number="form.price" type="number" class="form-control estanco-input" placeholder="45000" min="0" />
            </div>
            <div class="col-6">
              <label class="form-label text-light small">Stock <span class="text-danger">*</span></label>
              <input v-model.number="form.stock" type="number" class="form-control estanco-input" placeholder="10" min="0" />
            </div>
            <div class="col-12">
              <label class="form-label text-light small">Categoría <span class="text-danger">*</span></label>
              <select v-model="form.category" class="form-select estanco-input">
                <option value="">Seleccionar categoría</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label text-light small">URL de imagen</label>
              <input v-model="form.image" type="text" class="form-control estanco-input" placeholder="https://..." />
            </div>
            <div class="col-12">
              <label class="form-label text-light small">Descripción</label>
              <textarea v-model="form.description" class="form-control estanco-input" rows="2" placeholder="Descripción breve del producto..."></textarea>
            </div>
          </div>
          <div v-if="formError" class="alert alert-danger py-2 mt-3 mb-0 small">
            <i class="bi bi-exclamation-triangle me-1"></i>{{ formError }}
          </div>
        </div>
        <div class="modal-panel-footer">
          <button class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary fw-semibold" @click="saveProduct">
            <i :class="['bi me-2', modal.type === 'create' ? 'bi-plus-lg' : 'bi-floppy']"></i>
            {{ modal.type === 'create' ? 'Crear producto' : 'Guardar cambios' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ====== MODAL VER DETALLES ====== -->
    <div v-if="modal.show && modal.type === 'detail'" class="modal-overlay" @click.self="closeModal">
      <div class="modal-panel">
        <div class="modal-panel-header">
          <h5 class="text-primary mb-0"><i class="bi bi-eye me-2"></i>Detalles del Producto</h5>
          <button class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        <div class="modal-panel-body text-center" v-if="selectedProduct">
          <img :src="selectedProduct.image" :alt="selectedProduct.name" class="detail-img mb-3" />
          <h5 class="text-primary">{{ selectedProduct.name }}</h5>
          <p class="text-light small mb-3" style="opacity: 0.85;">{{ selectedProduct.description }}</p>
          <div class="row g-2 text-start">
            <div class="col-6">
              <div class="detail-stat">
                <div class="text-light small" style="opacity: 0.85;">Precio</div>
                <div class="text-light fw-bold">{{ formatPrice(selectedProduct.price) }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="detail-stat">
                <div class="text-light small" style="opacity: 0.85;">Stock</div>
                <div class="text-light fw-bold">{{ selectedProduct.stock }} unidades</div>
              </div>
            </div>
            <div class="col-6">
              <div class="detail-stat">
                <div class="text-light small" style="opacity: 0.85;">Categoría</div>
                <div class="text-light fw-bold">{{ selectedProduct.category }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="detail-stat">
                <div class="text-light small" style="opacity: 0.85;">ID</div>
                <div class="text-light fw-bold">#{{ selectedProduct.id }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-panel-footer">
          <button class="btn btn-outline-secondary" @click="closeModal">Cerrar</button>
          <button class="btn btn-outline-warning" @click="openEditModal(selectedProduct); modal.type = 'edit'">
            <i class="bi bi-pencil me-1"></i>Editar
          </button>
        </div>
      </div>
    </div>

    <!-- ====== MODAL CONFIRMAR ELIMINACIÓN ====== -->
    <div v-if="modal.show && modal.type === 'delete'" class="modal-overlay" @click.self="closeModal">
      <div class="modal-panel modal-panel-sm">
        <div class="modal-panel-header">
          <h5 class="text-danger mb-0"><i class="bi bi-exclamation-triangle me-2"></i>Confirmar eliminación</h5>
          <button class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        <div class="modal-panel-body">
          <p class="text-light">¿Estás seguro de que deseas eliminar el producto <strong class="text-primary">{{ selectedProduct?.name }}</strong>?</p>
          <p class="text-light small" style="opacity: 0.85;">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-panel-footer">
          <button class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-danger fw-semibold" @click="deleteConfirmed">
            <i class="bi bi-trash me-2"></i>Sí, eliminar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCardComponent from '../components/ProductCardComponent.vue'
import {
  initProducts, getProducts, createProduct,
  updateProduct, deleteProduct, formatPrice
} from '../services/productService'

// Estado reactivo
const products = ref([])
const searchQuery = ref('')
const filterCategory = ref('')
const viewMode = ref('table')
const selectedProduct = ref(null)
const formError = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

const modal = ref({ show: false, type: '' }) // 'create' | 'edit' | 'detail' | 'delete'

const form = ref({
  name: '', price: 0, stock: 0, category: '', image: '', description: ''
})

// Carga inicial desde localStorage o JSON
onMounted(async () => {
  await initProducts()
  products.value = getProducts()
})

// Productos filtrados por búsqueda y categoría
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCat = !filterCategory.value || p.category === filterCategory.value
    return matchSearch && matchCat
  })
})

// Categorías únicas
const categories = computed(() => [...new Set(products.value.map(p => p.category))])

// Abrir modal de creación
function openCreateModal() {
  form.value = { name: '', price: 0, stock: 0, category: '', image: '', description: '' }
  formError.value = ''
  modal.value = { show: true, type: 'create' }
}

// Abrir modal de edición
function openEditModal(product) {
  selectedProduct.value = product
  form.value = { ...product }
  formError.value = ''
  modal.value = { show: true, type: 'edit' }
}

// Abrir modal de detalle
function openDetailModal(product) {
  selectedProduct.value = product
  modal.value = { show: true, type: 'detail' }
}

// Confirmar eliminación
function confirmDelete(product) {
  selectedProduct.value = products.value.find(p => p.id === (product.id || product))
  modal.value = { show: true, type: 'delete' }
}

function closeModal() {
  modal.value = { show: false, type: '' }
  selectedProduct.value = null
}

// Guardar (crear o editar)
function saveProduct() {
  if (!form.value.name.trim() || !form.value.price || !form.value.category) {
    formError.value = 'Los campos nombre, precio y categoría son obligatorios.'
    return
  }
  if (modal.value.type === 'create') {
    createProduct({ ...form.value })
    showToast('Producto creado correctamente.', 'success')
  } else {
    updateProduct(selectedProduct.value.id, { ...form.value })
    showToast('Producto actualizado correctamente.', 'success')
  }
  products.value = getProducts()
  closeModal()
}

// Eliminar confirmado
function deleteConfirmed() {
  deleteProduct(selectedProduct.value.id)
  products.value = getProducts()
  showToast('Producto eliminado.', 'warning')
  closeModal()
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
.dashboard-panel {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
}
.table-dark { background-color: transparent; }
.table-dark td, .table-dark th { border-color: #2a2a2a; }
.product-thumb {
  width: 44px; height: 44px;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
  mix-blend-mode: multiply;
}

.estanco-input {
  background-color: #2a2a2a;
  border-color: #444;
  color: #f5f5f5;
}
.estanco-input:focus {
  background-color: #2a2a2a;
  border-color: #d4af37;
  box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.2);
  color: #f5f5f5;
}
.estanco-input::placeholder { color: #666; }
.estanco-input option { background: #2a2a2a; color: #f5f5f5; }
.input-group-text { color: #d4af37; }

/* Modales custom */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-panel {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7);
}
.modal-panel-sm { max-width: 380px; }
.modal-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #333;
}
.modal-panel-body { padding: 1.5rem; }
.modal-panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #333;
}
.detail-img {
  width: 150px; height: 150px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
  mix-blend-mode: multiply;
}
.detail-stat {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
}
</style>
