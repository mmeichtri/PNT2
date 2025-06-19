<template>
  <section class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">Tus alumnos</h1>

    <p v-if="cargando">Cargando alumnos...</p>
    <p v-else-if="!alumnos.length">Aún no tenés alumnos asignados.</p>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AlumnoCard
        v-for="alumno in alumnos"
        :key="alumno.id"
        :alumno="alumno"
      />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAlumnosStore } from '../stores/alumnos'
// import AlumnoCard from './AlumnoCard.vue'

const store = useAlumnosStore()
const cargando = ref(true)

onMounted(async () => {
  await store.fetchAlumnos()
  cargando.value = false
})

const alumnos = computed(() => store.lista)
</script>
