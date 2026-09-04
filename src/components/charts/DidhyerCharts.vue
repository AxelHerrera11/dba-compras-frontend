<script setup>
import TopClientesChart from './TopClientesChart.vue'
import TopProductosChart from './TopProductosChart.vue'
import VentasPorMesChart from './VentasPorMesChart.vue'

defineProps({
  filtros: { type: Object, default: () => ({}) },
})
</script>

<template>
  <section class="charts" aria-label="Gráficas de ventas, clientes y productos">
    <VentasPorMesChart :filtros="filtros" />
    <TopClientesChart :filtros="filtros" />
    <TopProductosChart :filtros="filtros" />
  </section>
</template>

<style scoped>
.charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 900px) {
  .charts {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
