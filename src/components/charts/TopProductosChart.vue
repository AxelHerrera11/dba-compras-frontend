<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { useApiData } from '../../composables/useApiData'
import { getProductosTop10 } from '../../services/api'
import { barOptions, formatNumber, normalizeTopProducts } from '../../utils/chart'
import ChartCard from './ChartCard.vue'

const { data: products, error, loading, reload } = useApiData(getProductosTop10, normalizeTopProducts)

const chartData = computed(() => ({
  labels: products.value.map((item) => item.label),
  datasets: [
    {
      data: products.value.map((item) => item.value),
      label: 'Ventas',
      backgroundColor: '#d97706',
      borderRadius: 7,
      borderSkipped: false,
      barThickness: 14,
    },
  ],
}))

const chartOptions = barOptions()
</script>

<template>
  <ChartCard
    title="Top 10 productos"
    description="Productos con mayor volumen de ventas"
    :loading="loading"
    :error="error"
    :empty="products.length === 0"
    @retry="reload"
  >
    <Bar
      :data="chartData"
      :options="chartOptions"
      aria-label="Gráfica de los diez productos más vendidos"
      role="img"
    />
    <template #data>
      <table>
        <caption>Datos de los diez productos más vendidos</caption>
        <thead>
          <tr><th>Producto</th><th>Ventas registradas</th></tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.label">
            <td>{{ product.label }}</td>
            <td>{{ formatNumber(product.value) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </ChartCard>
</template>
