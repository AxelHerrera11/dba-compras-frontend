<script setup>
import { onMounted, reactive } from 'vue'
import KpiCard from './KpiCard.vue'
import {
  getTotalCompras,
  getClientesConCompras,
  getMontoTotalVendido,
  getTicketPromedio,
} from '../../services/api.js'

const estado = reactive({
  totalCompras: { valor: null, cargando: true, error: '' },
  clientesConCompras: { valor: null, cargando: true, error: '' },
  montoTotal: { valor: null, cargando: true, error: '' },
  ticketPromedio: { valor: null, cargando: true, error: '' },
})

function cargarKpi(clave, promesa) {
  promesa
    .then((data) => {
      estado[clave].valor = data
      estado[clave].cargando = false
    })
    .catch((err) => {
      estado[clave].error = err.message
      estado[clave].cargando = false
    })
}

onMounted(() => {
  cargarKpi('totalCompras', getTotalCompras())
  cargarKpi('clientesConCompras', getClientesConCompras())
  cargarKpi('montoTotal', getMontoTotalVendido())
  cargarKpi('ticketPromedio', getTicketPromedio())
})
</script>

<template>
  <div class="kpi-grid">
    <KpiCard
      titulo="Total de compras"
      :valor="estado.totalCompras.valor"
      :cargando="estado.totalCompras.cargando"
      :error="estado.totalCompras.error"
    />

    <KpiCard
      titulo="Clientes con compras"
      :valor="estado.clientesConCompras.valor"
      :cargando="estado.clientesConCompras.cargando"
      :error="estado.clientesConCompras.error"
    />

    <KpiCard
      titulo="Monto total vendido"
      :valor="estado.montoTotal.valor"
      :cargando="estado.montoTotal.cargando"
      :error="estado.montoTotal.error"
      moneda
    />

    <KpiCard
      titulo="Ticket promedio"
      :valor="estado.ticketPromedio.valor"
      :cargando="estado.ticketPromedio.cargando"
      :error="estado.ticketPromedio.error"
      moneda
    />
  </div>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
</style>
