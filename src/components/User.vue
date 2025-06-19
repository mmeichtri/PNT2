<style>
.userPage {
  width: 50dvw;
  height: 50dvh;
  padding: 2rem;
  background-color: var(--color-background-dark);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 4vh;
}

.userContainer {
  max-width: 250px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 5px;
  background: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

</style>

<template>
  <section class="userPage">
    <div class="bg-gray-800 text-white w-full max-w-md p-6 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold text-center mb-6">Alumnos</h2>

      <ul v-if="alumnos.length" class="userContainer">
        <li
          v-for="alumno in alumnos"
          :key="alumno.id"
          @click="verAlumno(alumno.id)"
          class="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition duration-200"
        >
          <span class="font-semibold text-lg">{{ alumno.nombre }}</span>
        </li>
      </ul>

      <div v-else class="text-gray-400 text-center">
        No tenés alumnos registrados aún.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAlumnosStore } from '../stores/alumnos'


const router = useRouter()
const store = useAlumnosStore()
// const alumnos = ref()

// Datos de prueba
const datosPrueba = [
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'María López' }
]

const alumnos = ref([])

onMounted(async () => {
  await store.fetchAlumnos()
  alumnos.value = datosPrueba
})

function verAlumno(id) {
  router.push({ name: 'AlumnoDetalle', params: { id } })
}
</script>
