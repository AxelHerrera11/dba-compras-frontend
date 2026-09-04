<script setup>
import { computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import { useApiData } from '../../composables/useApiData'
import { getComprasPorMes } from '../../services/api'
import { chartTextColor, formatCurrency, normalizeMonthlySales } from '../../utils/chart'
import ChartCard from './ChartCard.vue'

const props = defineProps({
  filtros: { type: Object, default: () => ({}) },
})

const getFilteredComprasPorMes = (options) => getComprasPorMes(props.filtros, options)
const { data: sales, error, loading, reload } = useApiData(getFilteredComprasPorMes, normalizeMonthlySales)

watch(() => props.filtros, reload, { deep: true })

const chartData = computed(() => ({
  labels: sales.value.map((item) => item.label),
  datasets: [
    {
      data: sales.value.map((item) => item.value),
      label: 'Ventas',
      borderColor: '#0f766e',
      backgroundColor: 'rgba(13, 148, 136, 0.12)',
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#0f766e',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 3,
      fill: true,
      tension: 0.34,
    },
  ],
}))

const textColor = chartTextColor()
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (context) => formatCurrency(context.raw) } },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: { color: textColor },
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: '#e5ebe7' },
      ticks: { callback: formatCurrency, color: textColor, maxTicksLimit: 6 },
    },
  },
}
</script>

<template>
  <ChartCard
    title="Ventas por mes"
    description="Evolución del monto vendido en cada periodo"
    :loading="loading"
    :error="error"
    :empty="sales.length === 0"
    wide
    @retry="reload"
  >
    <Line
      :data="chartData"
      :options="chartOptions"
      aria-label="Gráfica de ventas por mes"
      role="img"
    />
    <template #data>
      <table>
        <caption>Datos de ventas por mes</caption>
        <thead>
          <tr><th>Periodo</th><th>Monto vendido</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in sales" :key="item.label">
            <td>{{ item.label }}</td>
            <td>{{ formatCurrency(item.value) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </ChartCard>
</template>
