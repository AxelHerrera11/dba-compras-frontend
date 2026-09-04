<script setup>
import TopClientesChart from './TopClientesChart.vue'
import TopProductosChart from './TopProductosChart.vue'
import VentasPorMesChart from './VentasPorMesChart.vue'
</script>

<template>
  <section class="charts" aria-label="Gráficas de ventas, clientes y productos">
    <VentasPorMesChart />
    <TopClientesChart />
    <TopProductosChart />
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
