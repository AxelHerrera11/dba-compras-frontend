<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { useApiData } from '../../composables/useApiData'
import { getClientesTop10 } from '../../services/api'
import { barOptions, formatCurrency, isDarkMode, normalizeTopClients } from '../../utils/chart'
import ChartCard from './ChartCard.vue'

const getTopTenClients = (options) => getClientesTop10(10, options)
const { data: clients, error, loading, reload } = useApiData(getTopTenClients, normalizeTopClients)

const chartData = computed(() => ({
  labels: clients.value.map((item) => item.label),
  datasets: [
    {
      data: clients.value.map((item) => item.value),
      label: 'Total comprado',
      backgroundColor: isDarkMode() ? '#22d3ee' : '#155e75',
      borderRadius: 7,
      borderSkipped: false,
      barThickness: 14,
    },
  ],
}))

const chartOptions = barOptions(formatCurrency)
</script>

<template>
  <ChartCard
    title="Top 10 clientes"
    description="Clientes con mayor monto acumulado de compras"
    :loading="loading"
    :error="error"
    :empty="clients.length === 0"
    @retry="reload"
  >
    <Bar
      :data="chartData"
      :options="chartOptions"
      aria-label="Gráfica de los diez clientes con más compras"
      role="img"
    />
    <template #data>
      <table>
        <caption>Datos de los diez clientes con más compras</caption>
        <thead>
          <tr><th>Cliente</th><th>Total comprado</th></tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.label">
            <td>{{ client.label }}</td>
            <td>{{ formatCurrency(client.value) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </ChartCard>
</template>
