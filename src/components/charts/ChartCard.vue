<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  empty: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
})

defineEmits(['retry'])
</script>

<template>
  <article class="chart-card" :class="{ 'chart-card--wide': wide }">
    <header>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </header>

    <div v-if="loading" class="chart-card__status" aria-live="polite">
      <span class="chart-card__loader" aria-hidden="true"></span>
      Cargando datos...
    </div>

    <div v-else-if="error" class="chart-card__status chart-card__status--error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Reintentar</button>
    </div>

    <div v-else-if="empty" class="chart-card__status" aria-live="polite">
      No hay información disponible para mostrar.
    </div>

    <template v-else>
      <div class="chart-card__canvas">
        <slot />
      </div>
      <div class="chart-card__accessible-data">
        <slot name="data" />
      </div>
    </template>
  </article>
</template>

<style scoped>
.chart-card {
  min-width: 0;
  padding: 24px;
  overflow: hidden;
  background: var(--bg, #fff);
  border: 1px solid var(--border, #dfe7e2);
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(30, 66, 62, 0.07);
}

.chart-card--wide {
  grid-column: 1 / -1;
}

header {
  margin-bottom: 22px;
}

h3 {
  margin: 0;
  color: var(--text-h, #183638);
  font-size: 1.05rem;
  letter-spacing: -0.015em;
}

header p {
  margin: 6px 0 0;
  color: var(--text, #596c6d);
  font-size: 0.82rem;
}

.chart-card__canvas,
.chart-card__status {
  height: 300px;
}

.chart-card__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #697a7b;
  text-align: center;
}

.chart-card__status--error {
  flex-direction: column;
  color: #9f3434;
}

.chart-card__status--error p {
  max-width: 420px;
  margin: 0;
}

button {
  padding: 8px 14px;
  color: #fff;
  background: #0f766e;
  border: 0;
  border-radius: 999px;
  font-weight: 700;
}

button:hover {
  background: #115e59;
}

button:focus-visible {
  outline: 3px solid rgba(13, 148, 136, 0.35);
  outline-offset: 2px;
}

.chart-card__loader {
  width: 18px;
  height: 18px;
  border: 2px solid #b8cbc6;
  border-top-color: #0f766e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.chart-card__accessible-data {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .chart-card {
    padding: 20px 16px;
    border-radius: 16px;
  }

  .chart-card__canvas,
  .chart-card__status {
    height: 270px;
  }
}
</style>
