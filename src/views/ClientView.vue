<template>
  <!-- ClientView: Vista de gestión de clientes (opcional según rúbrica) -->
  <div class="p-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h2 class="text-primary fw-bold mb-1"><i class="bi bi-people me-2"></i>Gestión de Clientes</h2>
        <p class="text-light mb-0 small" style="opacity: 0.85;">{{ clients.length }} clientes registrados</p>
      </div>
      <button class="btn btn-primary fw-semibold" @click="openCreate">
        <i class="bi bi-person-plus me-2"></i>Nuevo Cliente
      </button>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" :class="['alert', `alert-${toast.type}`, 'py-2 alert-dismissible']" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>{{ toast.message }}
      <button type="button" class="btn-close" @click="toast.show = false"></button>
    </div>

    <!-- Tabla de clientes -->
    <div class="dashboard-panel">
      <div class="table-responsive">
        <table class="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="text-primary">#</th>
              <th class="text-primary">Nombre</th>
              <th class="text-primary">Teléfono</th>
              <th class="text-primary">Email</th>
              <th class="text-primary">Ciudad</th>
              <th class="text-primary text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="clients.length === 0">
              <td colspan="6" class="text-center text-light py-4" style="opacity: 0.85;">
                <i class="bi bi-person-x fs-3 d-block mb-2"></i>No hay clientes registrados. ¡Agrega el primero!
              </td>
            </tr>
            <tr v-for="client in clients" :key="client.id">
              <td class="text-light" style="opacity: 0.85;">{{ client.id }}</td>
              <td class="text-light fw-semibold">{{ client.nombre }}</td>
              <td class="text-light" style="opacity: 0.85;">{{ client.telefono }}</td>
              <td class="text-light" style="opacity: 0.85;">{{ client.email }}</td>
              <td>
                <span class="badge" style="background:rgba(212,175,55,0.2);color:#d4af37">{{ client.ciudad }}</span>
              </td>
              <td class="text-center">
                <div class="d-flex gap-1 justify-content-center">
                  <button class="btn btn-sm btn-outline-warning" @click="openEdit(client)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="remove(client.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear / Editar -->
    <div v-if="modal.show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-panel">
        <div class="modal-panel-header">
          <h5 class="text-primary mb-0">
            <i :class="['bi me-2', editing ? 'bi-pencil-square' : 'bi-person-plus']"></i>
            {{ editing ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h5>
          <button class="btn-close btn-close-white" @click="closeModal"></button>
        </div>
        <div class="modal-panel-body">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label text-light small">Nombre completo <span class="text-danger">*</span></label>
              <input v-model="form.nombre" type="text" class="form-control estanco-input" placeholder="Juan Pérez" />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label text-light small">Teléfono</label>
              <input v-model="form.telefono" type="tel" class="form-control estanco-input" placeholder="310 000 0000" />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label text-light small">Email</label>
              <input v-model="form.email" type="email" class="form-control estanco-input" placeholder="correo@ejemplo.com" />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label text-light small">Ciudad</label>
              <input v-model="form.ciudad" type="text" class="form-control estanco-input" placeholder="Ocaña" />
            </div>
          </div>
          <div v-if="formError" class="alert alert-danger py-2 mt-3 mb-0 small">{{ formError }}</div>
        </div>
        <div class="modal-panel-footer">
          <button class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary fw-semibold" @click="save">
            <i class="bi bi-floppy me-1"></i>{{ editing ? 'Guardar' : 'Crear' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'estanco_ortega_clients'

const clients = ref([])
const modal = ref({ show: false })
const editing = ref(false)
const editId = ref(null)
const form = ref({ nombre: '', telefono: '', email: '', ciudad: '' })
const formError = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

onMounted(() => {
  const data = localStorage.getItem(STORAGE_KEY)
  clients.value = data ? JSON.parse(data) : []
})

function save() {
  if (!form.value.nombre.trim()) {
    formError.value = 'El nombre es obligatorio.'
    return
  }
  const data = [...clients.value]
  if (editing.value) {
    const idx = data.findIndex(c => c.id === editId.value)
    data[idx] = { ...data[idx], ...form.value }
  } else {
    const newId = data.length > 0 ? Math.max(...data.map(c => c.id)) + 1 : 1
    data.push({ id: newId, ...form.value })
  }
  clients.value = data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  showToast(editing.value ? 'Cliente actualizado.' : 'Cliente creado.')
  closeModal()
}

function remove(id) {
  if (!confirm('¿Eliminar este cliente?')) return
  clients.value = clients.value.filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients.value))
  showToast('Cliente eliminado.', 'warning')
}

function openCreate() {
  form.value = { nombre: '', telefono: '', email: '', ciudad: '' }
  editing.value = false
  formError.value = ''
  modal.value.show = true
}
function openEdit(client) {
  form.value = { ...client }
  editing.value = true
  editId.value = client.id
  formError.value = ''
  modal.value.show = true
}
function closeModal() { modal.value.show = false }

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

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 2000;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.modal-panel {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7);
}
.modal-panel-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #333;
}
.modal-panel-body { padding: 1.5rem; }
.modal-panel-footer {
  display: flex; justify-content: flex-end; gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #333;
}
</style>
