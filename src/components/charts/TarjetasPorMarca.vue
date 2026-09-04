<script setup>
import { reactive, watch, onMounted, computed } from 'vue'
import { getTarjetasPorMarca } from '../../services/api.js'
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
  getTarjetasPorMarca()
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

const datosFiltrados = computed(() => {
  const f = props.filtros || {}
  let filas = estado.datos
  if (f.cliente) {
    filas = filas.filter((fila) => String(fila.titular || '').toLowerCase()
      .includes(String(f.cliente).toLowerCase()))
  }
  return filas
})

const chartData = computed(() => ({
  labels: datosFiltrados.value.map((d) => d.marca),
  datasets: [
    {
      label: 'Monto total (GTQ)',
      data: datosFiltrados.value.map((d) => d.montoTotal),
      backgroundColor: ['#7c5cff', '#2b7fff', '#00b894', '#f59e0b'],
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
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

watch(() => props.filtros, cargar)
</script>

<template>
  <section class="grafica">
    <p v-if="estado.cargando" class="grafica__aviso">Cargando…</p>
    <p v-else-if="estado.error" class="grafica__aviso grafica__aviso--error">
      No se pudieron cargar los datos.
      <span class="grafica__detalle">{{ estado.error }}</span>
    </p>
    <p v-else-if="datosFiltrados.length === 0" class="grafica__aviso">
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
  color: #6b6375;
  border: 1px dashed #c9c5ce;
  border-radius: 12px;
  background: #faf9fb;
}
.grafica__aviso--error {
  color: #b45309;
}
.grafica__detalle {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
}
.grafica__contenedor {
  background: #fff;
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

@media (prefers-color-scheme: dark) {
  .grafica__aviso {
    border-color: #2e303a;
    background: #1f2028;
    color: #9ca3af;
  }
  .grafica__contenedor {
    background: #1f2028;
    border-color: #2e303a;
  }
}
</style>
