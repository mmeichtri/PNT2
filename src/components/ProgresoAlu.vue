<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const userStore = useUserStore()
const usuario = computed(() => userStore.loggedUser)


const completadas = computed(() =>
 usuario.value?.rutinasHechas || 0
)
const totales = computed(() => usuario.value?.rutinas?.length || 0)
const pendientes = computed(() => totales.value - completadas.value)

const data = computed(() => ({
  labels: ['Completadas', 'Pendientes'],
  datasets: [
    {
      data: [completadas.value, pendientes.value],
      backgroundColor: ['#4caf50', '#f44336']
    }
  ]
}))

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>

<template>
  <div class="progreso-container">
    <h2 class="titulo-progreso">Progreso de rutinas</h2>
    <Pie :data="data" :options="options" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  max-width: 400px;
  margin: 0 auto;
}
.titulo-progreso {
  text-align: center;
  font-size: 2rem; /* más grande */
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #ea2a2a;
}

.progreso-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

</style>
