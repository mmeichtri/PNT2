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
  <div class="chart-wrapper">
    <!-- 🌟 Título principal -->
    <h1 class="titulo-principal">Estadísticas del sistema</h1>

    <div class="chart-grid">
      <!-- 📊 Gráfico 1 -->
      <div class="chart-container">
        <h2 class="subtitulo">Alumnos por entrenador</h2>
        <Bar :data="dataEntrenadores" :options="options" />
      </div>

      <!-- 📊 Gráfico 2 -->
      <div class="chart-container">
        <h2 class="subtitulo">Alumnos con más rutinas completadas</h2>
        <Bar :data="dataAlumnos" :options="options" />
      </div>

      <!-- 📊 Gráfico 3 -->
      <div class="chart-container">
        <h2 class="subtitulo">Entrenadores con más alumnos activos</h2>
        <Bar :data="dataActivos" :options="options" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  min-height: 100vh;
  background-color: #222;
  padding: 2rem;
  color: white;
}

/* 🎯 Título principal con efecto neón */
.titulo-principal {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #bfff00;
  text-shadow: 0 0 8px #bfff00;
  margin-bottom: 3rem;
}

/* ✅ Subtítulos verdes más chicos */
.subtitulo {
  text-align: center;
  font-size: 1.2rem;
  color: #aaff00;
  text-shadow: 0 0 4px #aaff00;
  margin-bottom: 1rem;
}

/* 🎨 Contenedor de gráficos */
.chart-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

/* 🧱 Tarjetas de gráficos */
.chart-container {
  max-width: 600px;
  width: 100%;
  height: 300px;
  background-color: #111;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #444;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
}
</style>
