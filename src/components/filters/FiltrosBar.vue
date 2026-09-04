<script setup>
import { reactive, onMounted } from 'vue'
import {
  getClientesTop10,
  getClientesSinCompras,
  getCategorias,
  getProductos,
} from '../../services/api.js'

const emit = defineEmits(['cambiar'])

const estado = reactive({
  clientes: [],
  clientesCargando: true,
  clientesError: '',
  categorias: [],
  categoriasCargando: true,
  categoriasError: '',
  productos: [],
  productosCargando: true,
  productosError: '',
})

const filtros = reactive({
  fechaDesde: '',
  fechaHasta: '',
  idCliente: '',
  idCategoria: '',
  idProducto: '',
})

function notificar() {
  emit('cambiar', { ...filtros })
}

function cargarProductos() {
  estado.productosCargando = true
  estado.productosError = ''
  getProductos({ idCategoria: filtros.idCategoria })
    .then((data) => {
      estado.productos = Array.isArray(data) ? data : []
      estado.productosCargando = false
    })
    .catch((err) => {
      estado.productosError = err.message
      estado.productosCargando = false
    })
}

function cambiarCategoria() {
  filtros.idProducto = ''
  notificar()
  cargarProductos()
}

function limpiarFiltros() {
  filtros.fechaDesde = ''
  filtros.fechaHasta = ''
  filtros.idCliente = ''
  filtros.idCategoria = ''
  filtros.idProducto = ''
  notificar()
  cargarProductos()
}

onMounted(() => {
  Promise.all([
    getClientesTop10(100).catch(() => []),
    getClientesSinCompras().catch(() => []),
  ])
    .then(([conCompras, sinCompras]) => {
      const lista = []
      const vistos = new Set()

      const normalizar = (c) => ({
        id: c.idCliente ?? c.id,
        nombre: [c.primerNombre, c.segundoNombre, c.tercerNombre,
          c.primerApellido, c.segundoApellido]
          .filter(Boolean)
          .join(' ')
          .trim(),
      })

      ;(Array.isArray(conCompras) ? conCompras : []).forEach((c) => {
        const n = normalizar(c)
        if (n.id !== undefined && !vistos.has(n.id)) {
          vistos.add(n.id)
          lista.push(n)
        }
      })
      ;(Array.isArray(sinCompras) ? sinCompras : []).forEach((c) => {
        const n = normalizar(c)
        if (n.id !== undefined && !vistos.has(n.id)) {
          vistos.add(n.id)
          lista.push(n)
        }
      })

      lista.sort((a, b) => a.nombre.localeCompare(b.nombre))
      estado.clientes = lista
      estado.clientesCargando = false
    })
    .catch(() => {
      estado.clientesError = 'No se pudieron cargar los clientes.'
      estado.clientesCargando = false
    })

  getCategorias()
    .then((data) => {
      estado.categorias = Array.isArray(data) ? data : []
      estado.categoriasCargando = false
    })
    .catch((err) => {
      estado.categoriasError = err.message
      estado.categoriasCargando = false
    })

  cargarProductos()
})
</script>

<template>
  <div class="filtros">
    <div class="filtros__campo">
      <label class="filtros__label" for="fecha-desde">Fecha inicial</label>
      <input
        id="fecha-desde"
        v-model="filtros.fechaDesde"
        type="date"
        class="filtros__input"
        @change="notificar"
      />
    </div>

    <div class="filtros__campo">
      <label class="filtros__label" for="fecha-hasta">Fecha final</label>
      <input
        id="fecha-hasta"
        v-model="filtros.fechaHasta"
        type="date"
        :min="filtros.fechaDesde || undefined"
        class="filtros__input"
        @change="notificar"
      />
    </div>

    <div class="filtros__campo filtros__campo--cliente">
      <label class="filtros__label" for="filtro-cliente">Cliente</label>
      <select
        id="filtro-cliente"
        v-model="filtros.idCliente"
        class="filtros__input"
        :disabled="estado.clientesCargando"
        @change="notificar"
      >
        <option value="">Todos</option>
        <option
          v-for="c in estado.clientes"
          :key="c.id"
          :value="String(c.id)"
        >
          {{ c.nombre }}
        </option>
      </select>
    </div>

    <div class="filtros__campo">
      <label class="filtros__label" for="filtro-categoria">Categoría</label>
      <select
        id="filtro-categoria"
        v-model="filtros.idCategoria"
        class="filtros__input"
        :disabled="estado.categoriasCargando"
        @change="cambiarCategoria"
      >
        <option value="">Todas</option>
        <option
          v-for="cat in estado.categorias"
          :key="cat.idCategoria"
          :value="String(cat.idCategoria)"
        >
          {{ cat.nombreCategoria }}
        </option>
      </select>
    </div>

    <div class="filtros__campo">
      <label class="filtros__label" for="filtro-producto">Producto</label>
      <select
        id="filtro-producto"
        v-model="filtros.idProducto"
        class="filtros__input"
        :disabled="estado.productosCargando"
        @change="notificar"
      >
        <option value="">Todos</option>
        <option
          v-for="p in estado.productos"
          :key="p.idProducto"
          :value="String(p.idProducto)"
        >
          {{ p.nombreProducto }}
        </option>
      </select>
    </div>

    <button
      type="button"
      class="filtros__limpiar"
      @click="limpiarFiltros"
    >
      Limpiar filtros
    </button>

    <p v-if="estado.clientesError || estado.categoriasError || estado.productosError" class="filtros__aviso filtros__aviso--error">
      {{ estado.clientesError || estado.categoriasError || estado.productosError }}
    </p>
  </div>
</template>

<style scoped>
.filtros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  align-items: end;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow);
}
.filtros__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.filtros__input {
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  color: var(--text-h);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.filtros__input:disabled {
  background: var(--surface-muted);
  color: var(--text-soft);
  cursor: not-allowed;
}
.filtros__limpiar {
  grid-column: 1 / -1;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  background: transparent;
  border: 1px solid var(--accent);
  border-radius: 8px;
  cursor: pointer;
  justify-self: start;
}
.filtros__limpiar:hover {
  background: var(--accent-bg);
}
.filtros__aviso {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 12px;
  color: var(--text-soft);
}
.filtros__aviso--error {
  color: var(--danger);
}
</style>
