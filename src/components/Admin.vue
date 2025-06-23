<script setup>
import { useUserStore } from '../stores/userStore'
import EstadisticasChart from '../components/Estadisticas.vue'

const userStore = useUserStore()
</script>

<template>
  <div class="admin-page">
    <h2>📊 Estadísticas del sistema</h2>
    <EstadisticasChart />

    <div v-if="userStore.entrenadorConMasAlumnos">
      🧑‍🏫 <strong>Entrenador con más alumnos:</strong>
      {{ userStore.entrenadorConMasAlumnos.nombre }} ({{ userStore.alumnosDe(userStore.entrenadorConMasAlumnos.email).length }} alumnos)
    </div>

    <div v-if="userStore.alumnoConMasRutinas">
      🧍‍♂️ <strong>Alumno con más rutinas hechas:</strong>
      {{ userStore.alumnoConMasRutinas.nombre }} ({{ userStore.alumnoConMasRutinas.rutinasHechas }} rutinas)
    </div>

    <div v-if="userStore.entrenadorConMasClientesActivos">
      🏋️‍♂️ <strong>Entrenador con más alumnos activos:</strong>
      {{ userStore.entrenadorConMasClientesActivos.nombre }}
    </div>
  </div>
</template>

