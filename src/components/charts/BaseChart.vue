<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  type: { type: String, required: true },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
})

const canvas = ref(null)
let chart = null

function render() {
  if (!canvas.value) return
  if (chart) {
    chart.data = props.data
    chart.options = { ...props.options }
    chart.update()
    return
  }
  chart = new Chart(canvas.value, {
    type: props.type,
    data: props.data,
    options: props.options,
  })
}

onMounted(() => {
  Chart.defaults.color = '#6b6375'
  Chart.defaults.font.family =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  render()
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})

watch(() => [props.data, props.options], render, { deep: true })
</script>

<template>
  <canvas ref="canvas" class="base-chart"></canvas>
</template>

<style scoped>
.base-chart {
  width: 100%;
  height: 320px;
}
</style>
