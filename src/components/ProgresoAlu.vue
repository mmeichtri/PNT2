<template>
  <div class="progreso-wrapper">
    <div class="progreso-card">
      <h3 class="titulo-progreso">📈 Progreso semanal</h3>

      <div v-if="totales > 0" class="grafico-contenedor">
        <Pie :data="chartData" :options="chartOptions" :width="300" :height="300" />
        <p class="texto-indicador">{{ completadas }} de {{ totales }} completadas</p>
      </div>

      <div v-else class="texto-sin-progreso">
        Aún no cuenta con progreso activo.
      </div>
    </div>
  </div>
</template>

<style>
.progreso-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background-color: #1a1a1a;
}


.progreso-card {
  background-color: #1f1f1f;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 255, 100, 0.1);
  text-align: center;
  color: #fff;
  max-width: 400px;
  margin: auto;
}

.titulo-progreso {
  font-size: 1.8rem;
  color: #bfff00;
  text-shadow: 0 0 5px #bfff00, 0 0 10px #bfff00;
  margin-bottom: 1rem;
}

.grafico-contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.texto-indicador {
  margin-top: 1rem;
  color: #ccc;
  font-size: 0.9rem;
}

.texto-sin-progreso {
  margin-top: 1rem;
  color: #999;
  font-style: italic;
}
</style>

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
