<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Asignar rutina a {{ alumno.nombre }}</h1>

    <form @submit.prevent="guardarRutina">
      <div v-for="dia in diasSemana" :key="dia" class="mb-4">
        <label :for="dia" class="block font-semibold">{{ dia }}</label>
        <input
          v-model="rutinaForm[dia]"
          :id="dia"
          type="text"
          placeholder="Ej: Cardio + abdominales"
          class="w-full p-2 border rounded"
        />
      </div>
      <button class="addRoutine-link" @click.prevent="guardarRutina">Guardar rutina</button>
      
    </form>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const alumno = ref({})
const rutinaForm = ref({})

const diasSemana = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
]

// Inicializa rutinaForm vacío
diasSemana.forEach(dia => {
  rutinaForm.value[dia] = ''
})

async function cargarAlumno() {
  await userStore.loadUserFromStorage()
  const email = route.params.email
  const encontrado = userStore.users.find(u => u.email === email)
  if (encontrado) alumno.value = encontrado
}

function guardarRutina() {
  const nuevaRutina = diasSemana
    .filter(dia => rutinaForm.value[dia].trim() !== '')
    .map(dia => ({
      dia,
      descripcion: rutinaForm.value[dia].trim()
    }))

  alumno.value.rutina = nuevaRutina

  // asigna al entrenador
  const entrenador = userStore.loggedUser
  if (entrenador.rol === 'entrenador') {
    if (!entrenador.rutinasAsignadas) entrenador.rutinasAsignadas = {}
    entrenador.rutinasAsignadas[alumno.value.email] = nuevaRutina
  }

  // Actualiza el store
  const i = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (i !== -1) userStore.users[i] = { ...alumno.value }

  userStore._guardarLocalStorage()

  router.push(`/alumno/${alumno.value.email}`)
}
cargarAlumno()
</script>
