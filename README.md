#  Estanco Ortega — Segundo Parcial Desarrollo de Aplicaciones Web

Sistema de gestión de inventario para una licorería, construido con **Vue 3**, **Vue Router** y **Bootstrap 5**.

---

## Integrantes

| Nombre | Rol |
|--------|-----|
| Ronal Carvajalino - 0192623 | Desarrollador Frontend |
| Jaider Ortega - 0192579| Desarrollador Frontend |


---

## Descripción del Negocio

**Estanco Ortega** es una licorería premium ubicada en Norte de Santander, Colombia. Esta aplicación simula un panel de administración para gestionar el inventario de productos (licores, cervezas, vinos), clientes y estadísticas del negocio.

---

## Estructura del Proyecto

```
segundo-parcial-des-app-web/
├── public/
│   └── data/
│       ├── products.json     # Catálogo inicial (15 productos)
│       └── usuarios.json     # Usuarios para autenticación local
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── NavbarComponent.vue
│   │   ├── SidebarComponent.vue
│   │   ├── FooterComponent.vue
│   │   └── ProductCardComponent.vue
│   ├── views/                # Vistas del sistema
│   │   ├── LoginView.vue
│   │   ├── DashboardLayout.vue
│   │   ├── HomeView.vue
│   │   ├── ProductView.vue
│   │   └── ClientView.vue
│   ├── router/
│   │   └── index.js          # Configuración de rutas y navigation guard
│   ├── services/
│   │   ├── authService.js    # Autenticación contra usuarios.json
│   │   └── productService.js # CRUD simulado con LocalStorage
│   ├── App.vue               # Punto de entrada, sobrescribe variables Bootstrap
│   └── main.js               # Inicialización de Vue + plugins
├── index.html
├── vite.config.js
└── package.json
```

---

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## Autenticación

 **Aviso educativo:** Esta validación es únicamente con fines académicos y **no representa un sistema de autenticación seguro para producción**. Las contraseñas se almacenan en texto plano en un JSON local.

La autenticación valida las credenciales contra `public/data/usuarios.json`. Si son correctas, guarda la sesión en `localStorage` y redirige al Dashboard.

**Credenciales de prueba:**
- Usuario: `Jaider` / Contraseña: `ortega123`
- Usuario: `admin` / Contraseña: `admin123`

---

## Modularización

### Componentes reutilizables

| Componente | Descripción | Props | Eventos |
|---|---|---|---|
| `NavbarComponent` | Barra superior con logo y logout | `session` | `toggle-sidebar` |
| `SidebarComponent` | Menú lateral con rutas e iconos | `isOpen` | `close` |
| `FooterComponent` | Pie de página con derechos reservados | — | — |
| `ProductCardComponent` | Tarjeta de producto con acciones | `product` | `ver-detalles`, `editar`, `eliminar` |

### Ejemplo de comunicación por props y eventos

```vue
<!-- ProductView.vue pasa props y escucha eventos de ProductCardComponent -->
<ProductCardComponent
  :product="product"
  @ver-detalles="openDetailModal"
  @editar="openEditModal"
  @eliminar="confirmDelete"
/>
```

### Rutas configuradas (vue-router con rutas hijas)

```js
// El layout persistente (Navbar + Sidebar) vive en DashboardLayout.vue
// Las vistas hijas se renderizan en su <RouterView> interno
{ path: '/dashboard', component: DashboardLayout, children: [
  { path: '',           component: HomeView },
  { path: 'productos',  component: ProductView },
  { path: 'clientes',   component: ClientView },
]}
```

---

## CRUD Simulado con LocalStorage

El `productService.js` implementa las 4 operaciones fundamentales:

```js
// Precarga desde products.json si localStorage está vacío
await initProducts()

// Crear
createProduct({ name, price, stock, category, description, image })

// Leer
getProducts()             // todos
getProductById(id)        // uno por ID

// Actualizar
updateProduct(id, data)

// Eliminar
deleteProduct(id)
```

---

## Bootstrap y paleta de colores

Las variables de Bootstrap se sobrescriben en `App.vue` para adaptar la paleta dorada de Estanco Ortega:

```css
:root {
  --bs-primary: #d4af37;   /* Dorado principal */
  --estanco-dark: #121212; /* Fondo oscuro */
  --estanco-panel: #1e1e1e;
}
```

---

## Trabajo colaborativo

- **Repositorio:** https://github.com/ronal-4587/segundo-parcial-des-app-web
