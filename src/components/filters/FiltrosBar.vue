<script setup>
import { reactive, onMounted } from 'vue'
import {
  getClientesTop10,
  getClientesSinCompras,
} from '../../services/api.js'

const emit = defineEmits(['cambiar'])

const estado = reactive({
  clientes: [],
  clientesCargando: true,
  clientesError: '',
})

const filtros = reactive({
  fechaDesde: '',
  fechaHasta: '',
  cliente: '',
  categoria: '',
  producto: '',
})

function notificar() {
  emit('cambiar', { ...filtros })
}

function limpiarClientes() {
  estado.clientes = []
  estado.clientesCargando = false
  estado.clientesError = ''
}

function toggleCategoria() {
  if (filtros.categoria) {
    filtros.categoria = ''
    notificar()
  }
}

function toggleProducto() {
  if (filtros.producto) {
    filtros.producto = ''
    notificar()
  }
}

function limpiarFiltros() {
  filtros.fechaDesde = ''
  filtros.fechaHasta = ''
  filtros.cliente = ''
  filtros.categoria = ''
  filtros.producto = ''
  notificar()
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
      estado.clientesError =
        'No se pudieron cargar los clientes.'
      estado.clientesCargando = false
    })
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
        v-model="filtros.cliente"
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
      <label class="filtros__label" for="filtro-categoria">
        Categoría
        <span class="filtros__nota">(sin API)</span>
      </label>
      <input
        id="filtro-categoria"
        type="text"
        class="filtros__input filtros__input--deshabilitado"
        disabled
        placeholder="No disponible"
        @click="toggleCategoria"
      />
    </div>

    <div class="filtros__campo">
      <label class="filtros__label" for="filtro-producto">
        Producto
        <span class="filtros__nota">(sin API)</span>
      </label>
      <input
        id="filtro-producto"
        type="text"
        class="filtros__input filtros__input--deshabilitado"
        disabled
        placeholder="No disponible"
        @click="toggleProducto"
      />
    </div>

    <button
      type="button"
      class="filtros__limpiar"
      @click="limpiarFiltros"
    >
      Limpiar filtros
    </button>

    <p class="filtros__aviso">
      {{
        estado.clientesError
          ? estado.clientesError
          : 'El backend desplegado no soporta filtros por rango de fecha, categoría ni producto; estos se aplican por el momento sobre los datos reales disponibles en el frontend.'
      }}
    </p>
  </div>
</template>

<style scoped>
.filtros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  align-items: end;
  background: #fff;
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.filtros__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #6b6375;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.filtros__nota {
  color: #b45309;
  text-transform: none;
  font-weight: 500;
}
.filtros__input {
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  color: #08060d;
  background: #fff;
  border: 1px solid #c9c5ce;
  border-radius: 8px;
}
.filtros__input--deshabilitado {
  background: #f0eef2;
  color: #9ca3af;
  cursor: not-allowed;
}
.filtros__limpiar {
  grid-column: 1 / -1;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #7c5cff;
  background: transparent;
  border: 1px solid #7c5cff;
  border-radius: 8px;
  cursor: pointer;
  justify-self: start;
}
.filtros__limpiar:hover {
  background: #f3f0ff;
}
.filtros__aviso {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

@media (prefers-color-scheme: dark) {
  .filtros {
    background: #1f2028;
    border-color: #2e303a;
  }
  .filtros__label {
    color: #9ca3af;
  }
  .filtros__input {
    color: #f3f4f6;
    background: #16171d;
    border-color: #2e303a;
  }
  .filtros__input--deshabilitado {
    background: #2a2c36;
    color: #6b7280;
  }
  .filtros__limpiar:hover {
    background: #2a2c36;
  }
}
</style>
