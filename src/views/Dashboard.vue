<script setup>
import { reactive } from 'vue'
import DidhyerCharts from '../components/charts/DidhyerCharts.vue'
import KpiGrid from '../components/kpi/KpiGrid.vue'
import FiltrosBar from '../components/filters/FiltrosBar.vue'
import ComprasPorCategoria from '../components/charts/ComprasPorCategoria.vue'
import TarjetasPorMarca from '../components/charts/TarjetasPorMarca.vue'
import CreditoVsDebito from '../components/charts/CreditoVsDebito.vue'

const filtros = reactive({
  fechaDesde: '',
  fechaHasta: '',
  cliente: '',
  categoria: '',
  producto: '',
})

function aplicarFiltros(nuevosFiltros) {
  Object.assign(filtros, nuevosFiltros)
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1 class="dashboard__title">Dashboard de Análisis de Compras</h1>
      <p class="dashboard__subtitle">Grupo 2 · DBA_COMPRAS</p>
    </header>

    <main class="dashboard__body">
      <section class="dashboard__section">
        <h2 class="dashboard__section-title">Indicadores clave</h2>
        <KpiGrid />
      </section>

      <section class="dashboard__section dashboard__filtros">
        <h2 class="dashboard__section-title">Filtros</h2>
        <FiltrosBar @cambiar="aplicarFiltros" />
      </section>

      <section class="dashboard__section dashboard__charts">
        <h2 class="dashboard__section-title">Gráficas</h2>
        <DidhyerCharts />
        <div class="dashboard__graficas-grid">
          <div class="dashboard__grafica">
            <h3 class="dashboard__grafica-titulo">Compras por categoría</h3>
            <ComprasPorCategoria :filtros="filtros" />
          </div>
          <div class="dashboard__grafica">
            <h3 class="dashboard__grafica-titulo">Tarjetas por marca</h3>
            <TarjetasPorMarca :filtros="filtros" />
          </div>
          <div class="dashboard__grafica">
            <h3 class="dashboard__grafica-titulo">Crédito vs Débito</h3>
            <CreditoVsDebito :filtros="filtros" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 32px 0;
}

.dashboard__header {
  margin-bottom: 32px;
}

.dashboard__title {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
  color: #08060d;
}

.dashboard__subtitle {
  margin: 0;
  color: #6b6375;
  font-size: 16px;
}

.dashboard__body {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard__section-title {
  margin: 0 0 16px;
  font-size: 18px;
  color: #08060d;
}

.dashboard__charts {
  margin-top: 8px;
}

.dashboard__graficas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.dashboard__grafica-titulo {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #08060d;
}

@media (prefers-color-scheme: dark) {
  .dashboard__title,
  .dashboard__section-title,
  .dashboard__grafica-titulo {
    color: #f3f4f6;
  }
  .dashboard__subtitle {
    color: #9ca3af;
  }
}
</style>
