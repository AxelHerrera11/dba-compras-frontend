<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo: { type: String, required: true },
  valor: { type: [Number, String], default: null },
  cargando: { type: Boolean, default: false },
  error: { type: String, default: '' },
  moneda: { type: Boolean, default: false },
})

const formateado = computed(() => {
  if (props.valor === null || props.valor === '') return '—'
  if (props.moneda) {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      maximumFractionDigits: 0,
    }).format(Number(props.valor))
  }
  return new Intl.NumberFormat('es-GT').format(Number(props.valor))
})
</script>

<template>
  <section class="kpi-card" :class="{ 'kpi-card--empty': error }">
    <h3 class="kpi-card__title">{{ titulo }}</h3>

    <p v-if="cargando" class="kpi-card__value kpi-card__value--loading">Cargando…</p>

    <p v-else-if="error" class="kpi-card__value kpi-card__value--error" :title="error">
      Sin datos
    </p>

    <p v-else class="kpi-card__value">{{ formateado }}</p>
  </section>
</template>

<style scoped>
.kpi-card {
  background: #fff;
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.kpi-card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #6b6375;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.kpi-card__value {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #08060d;
}

.kpi-card__value--loading {
  color: #9ca3af;
  font-weight: 500;
  font-size: 18px;
}

.kpi-card__value--error {
  color: #b45309;
  font-weight: 500;
  font-size: 18px;
}

@media (prefers-color-scheme: dark) {
  .kpi-card {
    background: #1f2028;
    border-color: #2e303a;
  }
  .kpi-card__title {
    color: #9ca3af;
  }
  .kpi-card__value {
    color: #f3f4f6;
  }
}
</style>
