<script setup>
import KpiGrid from '../components/kpi/KpiGrid.vue'
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

      <section class="dashboard__section dashboard__charts">
        <h2 class="dashboard__section-title">Gráficas</h2>
        <p class="dashboard__placeholder">
          Espacio reservado para las gráficas del equipo (ventas por mes, top 10
          clientes, top 10 productos, categorías, tarjetas y crédito vs débito).
        </p>
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

.dashboard__placeholder {
  margin: 0;
  padding: 32px;
  border: 1px dashed #c9c5ce;
  border-radius: 12px;
  color: #6b6375;
  background: #faf9fb;
}

@media (prefers-color-scheme: dark) {
  .dashboard__title,
  .dashboard__section-title {
    color: #f3f4f6;
  }
  .dashboard__subtitle {
    color: #9ca3af;
  }
  .dashboard__placeholder {
    border-color: #2e303a;
    background: #1f2028;
    color: #9ca3af;
  }
}
</style>
