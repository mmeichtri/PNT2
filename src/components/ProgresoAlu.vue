<template>
  <div v-if="alumno">
    <h3 class="text-xl font-semibold mb-2">Progreso semanal</h3>
    <div style="max-width: 300px; max-height: 300px; margin: auto;">
      <Pie :data="chartData" :options="chartOptions" :width="300" :height="300" />
    </div>
    <p class="mt-2 text-sm text-gray-500">{{ completadas }} de {{ totales }} completadas</p>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  alumno: Object
})

const totales = computed(() =>
  (props.alumno?.rutina || []).filter(r => !r.esPlaceholder).length
)

const completadas = computed(() =>
  (props.alumno?.rutina || []).filter(r => !r.esPlaceholder && r.hecho).length
)

const pendientes = computed(() => totales.value - completadas.value)

const chartData = computed(() => ({
  labels: ['Completadas', 'Pendientes'],
  datasets: [
    {
      data: [completadas.value, pendientes.value],
      backgroundColor: ['#10b981', '#f59e0b']
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>
