<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const props = defineProps({
  alumno: { type: Object, required: true }
})

const router = useRouter()
const userStore = useUserStore()

const esSuEntrenador = computed(() =>
  userStore.loggedUser?.email &&
  props.alumno.entrenadorAsignado &&
  userStore.loggedUser.email === props.alumno.entrenadorAsignado
)

const sinRutina = computed(() =>
  !props.alumno.rutina || props.alumno.rutina.length === 0
)

function irARutinas () {
  router.push('/routines')
}
</script>

<template>
  <div class="relative block rounded-xl shadow-lg bg-white hover:shadow-xl transition p-4">
    <router-link
      :to="{ name: 'AlumnoDetalleView', params: { email: alumno.email } }"
      class="block"
    >
      <header class="flex items-center gap-4 mb-4">
        <img
          :src="alumno.foto || 'https://i.pravatar.cc/80?u=' + alumno.email"
          class="w-16 h-16 rounded-full object-cover"
        />
        <h2 class="text-xl font-semibold">{{ alumno.nombre }}</h2>
      </header>

      <ul class="text-sm text-gray-600 space-y-1">
        <li><strong>Edad:</strong> {{ alumno.edad }} años</li>
        <li><strong>Objetivo:</strong> {{ alumno.objetivo }}</li>
        <li><strong>Progreso:</strong> {{ alumno.progresoGlobal }} %</li>
      </ul>
    </router-link>

    <div
      v-if="esSuEntrenador && sinRutina"
      class="mt-4 p-3 border border-yellow-500 rounded bg-yellow-50 text-yellow-700"
    >
      <p class="text-sm">Este alumno no tiene rutina asignada.</p>
      <button
        @click.stop="irARutinas"
        class="mt-2 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Agregar rutina
      </button>
    </div>
  </div>
</template>
