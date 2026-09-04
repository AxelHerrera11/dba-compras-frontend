<script setup>
import { reactive, watch, onMounted, computed } from 'vue'
import { getComprasPorCategoria } from '../../services/api.js'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  filtros: { type: Object, default: () => ({}) },
})

const estado = reactive({
  datos: [],
  cargando: true,
  error: '',
})

function cargar() {
  estado.cargando = true
  estado.error = ''
  getComprasPorCategoria(props.filtros)
    .then((data) => {
      estado.datos = Array.isArray(data) ? data : []
      estado.cargando = false
    })
    .catch((err) => {
      estado.error = err.message
      estado.cargando = false
    })
}

onMounted(cargar)

const chartData = computed(() => ({
  labels: estado.datos.map((d) => d.nombreCategoria),
  datasets: [
    {
      label: 'Monto total (GTQ)',
      data: estado.datos.map((d) => d.totalVendido),
      backgroundColor: '#F2A0C9',
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label(context) {
          const fila = estado.datos[context.dataIndex]
          const monto = new Intl.NumberFormat('es-GT', {
            style: 'currency', currency: 'GTQ', maximumFractionDigits: 0,
          }).format(Number(fila?.totalVendido || 0))
          const cantidad = new Intl.NumberFormat('es-GT')
            .format(Number(fila?.cantidadVendida || 0))
          return ` ${monto} · ${cantidad} unidades`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback(value) {
          return new Intl.NumberFormat('es-GT').format(value)
        },
      },
    },
  },
}

watch(() => props.filtros, cargar, { deep: true })
</script>

<template>
  <section class="grafica">
    <p v-if="estado.cargando" class="grafica__aviso">Cargando…</p>
    <p v-else-if="estado.error" class="grafica__aviso grafica__aviso--error">
      No se pudieron cargar los datos.
      <span class="grafica__detalle">{{ estado.error }}</span>
    </p>
    <p v-else-if="estado.datos.length === 0" class="grafica__aviso">
      No hay datos para mostrar.
    </p>
    <div v-else class="grafica__contenedor">
      <BaseChart type="bar" :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

<style scoped>
.grafica__aviso {
  margin: 0;
  padding: 32px;
  text-align: center;
  color: var(--text);
  border: 1px dashed var(--border);
  border-radius: 16px;
  background: var(--surface-muted);
}
.grafica__aviso--error {
  color: var(--danger);
}
.grafica__detalle {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-soft);
}
.grafica__contenedor {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow);
}
</style>
