<template>
  <!-- LoginView: Vista de inicio de sesión con validación contra usuarios.json -->
  <div class="login-bg min-vh-100 d-flex align-items-center justify-content-center p-3">
    <div class="login-card">

      <!-- Logo y título -->
      <div class="text-center mb-4">
        <div class="login-icon mx-auto mb-3">
          <i class="bi bi-droplet-half fs-1"></i>
        </div>
        <h1 class="fs-3 fw-bold text-primary mb-1">Estanco Ortega</h1>
        <p class="text-light small" style="opacity: 0.85;">Licores & Bebidas Premium — Panel de Administración</p>
      </div>

      <!-- Alerta de error (Bootstrap) -->
      <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Alerta de éxito -->
      <div v-if="successMsg" class="alert alert-success d-flex align-items-center gap-2 py-2" role="alert">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ successMsg }}</span>
      </div>

      <!-- Formulario -->
      <div class="mb-3">
        <label for="usuario" class="form-label text-light small fw-semibold">
          <i class="bi bi-person me-1 text-primary"></i>Usuario
        </label>
        <input
          id="usuario"
          v-model="form.usuario"
          type="text"
          class="form-control estanco-input"
          placeholder="Ingresa tu usuario"
          @keyup.enter="handleLogin"
          autocomplete="username"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="form-label text-light small fw-semibold">
          <i class="bi bi-lock me-1 text-primary"></i>Contraseña
        </label>
        <div class="input-group">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control estanco-input"
            placeholder="Ingresa tu contraseña"
            @keyup.enter="handleLogin"
            autocomplete="current-password"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
      </div>

      <button
        class="btn btn-primary w-100 fw-bold py-2"
        @click="handleLogin"
        :disabled="loading"
      >
        <span v-if="loading">
          <span class="spinner-border spinner-border-sm me-2"></span>Verificando...
        </span>
        <span v-else>
          <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
        </span>
      </button>

      <!-- Aviso educativo -->
      <div class="mt-4 p-3 rounded border border-secondary">
        <p class="text-light small mb-1" style="opacity: 0.85;">
          <i class="bi bi-info-circle text-primary me-1"></i>
          <strong class="text-light">Aviso educativo:</strong> Esta validación es solo con fines académicos. No representa un sistema de autenticación real.
        </p>
        <p class="text-light small mb-0" style="opacity: 0.85;">
          Credenciales de prueba: <code class="text-primary">Jaider</code> / <code class="text-primary">ortega123</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authService'

const router = useRouter()

const form = ref({ usuario: '', password: '' })
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!form.value.usuario.trim() || !form.value.password.trim()) {
    errorMsg.value = 'Por favor, completa todos los campos.'
    return
  }

  loading.value = true
  try {
    const session = await login(form.value.usuario.trim(), form.value.password.trim())
    if (session) {
      successMsg.value = `¡Bienvenido, ${session.nombre}! Redirigiendo...`
      setTimeout(() => router.push('/dashboard'), 800)
    } else {
      errorMsg.value = 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.'
    }
  } catch (e) {
    errorMsg.value = 'Error al conectar con el servidor. Intenta más tarde.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  background-color: #121212;
  background-image: radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 60%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.login-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #d4af37, #b8972e);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #121212;
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
.estanco-input::placeholder {
  color: #666;
}
.input-group .btn-outline-secondary {
  border-color: #444;
  color: #aaa;
  background: #2a2a2a;
}
.input-group .btn-outline-secondary:hover {
  background: #333;
  color: #d4af37;
}
</style>
