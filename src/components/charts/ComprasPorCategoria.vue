<script setup>
import { computed } from 'vue'

const props = defineProps({
  filtros: { type: Object, default: () => ({}) },
})

const aviso = computed(() => {
  const f = props.filtros || {}
  const activos = []
  if (f.fechaDesde || f.fechaHasta) activos.push('fecha')
  if (f.cliente) activos.push('cliente')
  if (f.categoria) activos.push('categoría')
  if (f.producto) activos.push('producto')
  return activos.length ? activos.join(', ') : null
})
</script>

<template>
  <section class="grafica">
    <div class="grafica__contenedor grafica__contenedor--sin-datos">
      <p class="grafica__titulo">Endpoint no disponible en el backend</p>
      <p class="grafica__texto">
        El backend desplegado no expone un endpoint de «compras por categoría»
        (se probaron <code>/api/categorias</code> y
        <code>/api/productos/por-categoria</code> sin resultado). Para mostrar
        esta gráfica con datos reales se requiere que el equipo de backend la
        implemente. No se modifica el backend desde este frontend.
      </p>
      <p v-if="aviso" class="grafica__texto grafica__texto--filtros">
        Filtros activos (se aplicarían cuando el endpoint esté disponible):
        {{ aviso }}.
      </p>
      <p v-else class="grafica__texto grafica__texto--filtros">
        Sin filtros activos.
      </p>
    </div>
  </section>
</template>

<style scoped>
.grafica__contenedor {
  background: #fff;
  border: 1px solid var(--border, #e5e4e7);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.grafica__titulo {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #b45309;
}
.grafica__texto {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #6b6375;
}
.grafica__texto--filtros {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
.grafica__texto code {
  background: #f0eef2;
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 12px;
}

@media (prefers-color-scheme: dark) {
  .grafica__contenedor {
    background: #1f2028;
    border-color: #2e303a;
  }
  .grafica__texto {
    color: #9ca3af;
  }
  .grafica__texto--filtros {
    border-top-color: #2e303a;
  }
  .grafica__texto code {
    background: #2a2c36;
  }
}
</style>
