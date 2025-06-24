<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const userStore = useUserStore()

// 📊 1. Alumnos por entrenador
const entrenadores = computed(() => userStore.entrenadores)
const alumnosPorEntrenador = computed(() =>
  entrenadores.value.map(ent => userStore.alumnosDe(ent.email).length)
)

const dataEntrenadores = computed(() => ({
  labels: entrenadores.value.map(e => e.nombre),
  datasets: [
    {
      label: 'Cantidad de alumnos',
      backgroundColor: '#42A5F5',
      data: alumnosPorEntrenador.value
    }
  ]
}))

// 📊 2. Alumnos con más rutinas completadas
const alumnosConRutinas = computed(() => {
  return userStore.users
    .filter(u => u.rol === 'cliente')
    .map(u => ({
      nombre: u.nombre,
      rutinas: u.rutinasHechas || 0
    }))
    .sort((a, b) => b.rutinas - a.rutinas)
    .slice(0, 5)
})





const dataAlumnos = computed(() => ({
  labels: alumnosConRutinas.value.map(a => a.nombre),
  datasets: [
    {
      label: 'Rutinas completadas',
      backgroundColor: '#66BB6A',
      data: alumnosConRutinas.value.map(a => a.rutinas)
    }
  ]
}))

// 📊 3. Entrenadores con más alumnos activos (alumnos con al menos 1 rutina hecha)
const entrenadoresActivos = computed(() =>
  entrenadores.value.map(ent => {
    const alumnos = userStore.alumnosDe(ent.email)
    const activos = alumnos.filter(a => (a.rutinasHechas || 0) > 0)
    return {
      nombre: ent.nombre,
      activos: activos.length
    }
  })
)


const dataActivos = computed(() => ({
  labels: entrenadoresActivos.value.map(e => e.nombre),
  datasets: [
    {
      label: 'Alumnos activos',
      backgroundColor: '#FFA726',
      data: entrenadoresActivos.value.map(e => e.activos)
    }
  ]
}))

// Opciones compartidas
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0
      }
    }
  }
}
</script>

<template>
  <div class="chart-grid">
    <div class="chart-container">
      <h2>Alumnos por entrenador</h2>
      <Bar :data="dataEntrenadores" :options="options" />
    </div>

    <div class="chart-container">
      <h2>Alumnos con más rutinas completadas</h2>
      <Bar :data="dataAlumnos" :options="options" />
    </div>

    <div class="chart-container">
      <h2>Entrenadores con más alumnos activos</h2>
      <Bar :data="dataActivos" :options="options" />
    </div>
  </div>
</template>

<style scoped>
.chart-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 2rem;
  align-items: center;
}

.chart-container {
  max-width: 500px;
  width: 100%;
  height: 300px;
}
</style>

