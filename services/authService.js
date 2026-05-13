/**
 * authService.js
 * Servicio de autenticación local contra usuarios.json.
 *
 * ⚠️ AVISO EDUCATIVO: Esta validación es solo con fines académicos.
 * No representa un sistema de autenticación seguro para producción.
 */

const SESSION_KEY = 'estanco_session'

/**
 * Valida credenciales contra el archivo usuarios.json local.
 * Retorna el objeto usuario si es válido, o null si falla.
 */
export async function login(usuario, password) {
  const response = await fetch('/data/usuarios.json')
  const usuarios = await response.json()
  const found = usuarios.find(
    u => u.usuario === usuario && u.password === password
  )
  if (found) {
    const sessionData = { usuario: found.usuario, nombre: found.nombre, rol: found.rol }
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    return sessionData
  }
  return null
}

/**
 * Cierra la sesión del usuario.
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

/**
 * Retorna los datos de sesión del usuario autenticado, o null.
 */
export function getSession() {
  const data = localStorage.getItem(SESSION_KEY)
  return data ? JSON.parse(data) : null
}

/**
 * Retorna true si hay una sesión activa.
 */
export function isAuthenticated() {
  return !!getSession()
}
