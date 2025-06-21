<template>
  <button @click="$router.back()" class="volver-btn">← Volver</button>
  <section class="detalleViewContainer">
    <div v-if="cargando" class="text-white">Cargando datos del alumno…</div>

    <div v-else-if="!alumno?.email" class="text-gray-400 bg-gray-800 p-6 rounded">
      No se encontró el alumno.
    </div>

    <div v-else class="detalleViewPage">
      <header class="flex flex-col items-center gap-2 mb-6">
        <div class="w-16 h-16 rounded-full overflow-hidden bg-white">
          <img
            :src="alumno.foto || '/avatar-default.png'"
            alt="avatar alumno"
            class="rounded-full overflow-hidden bg-white"
            style="width: 200px; height: 200px;"
          />
        </div>

        <div class="text-center">
          <h1 class="text-2xl font-bold">{{ alumno.nombre }}</h1>
          <p class="text-gray-600">Edad: {{ alumno.edad }} años</p>
          <p class="text-gray-600">Objetivo: {{ alumno.objetivo }}</p>
        </div>
      </header>

      <section class="mb-8">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-2xl font-semibold">Plan de entrenamiento</h2>
          <template v-if="isTrainer">
            <button class="addRoutine-link text-sm w-auto h-auto px-4 py-2" @click.prevent="asignarRutina">
              {{ alumno.rutina?.length ? 'Modificar rutina' : 'Asignar rutina' }}
            </button>
          </template>
        </div>

        <template v-if="!alumno.rutina || alumno.rutina.length === 0">
          <div v-if="!isTrainer" class="text-gray-400 mt-4">
            Sin rutina asignada aún.
          </div>
        </template>

        <template v-else>
          <ul class="space-y-3">
            <li v-for="(diaRutina, index) in alumno.rutina" :key="index" class="border p-3 rounded bg-gray-50">
              <div class="flex justify-between items-center mb-1">
                <div>
                  <span class="font-semibold">{{ diaRutina.dia }}:</span>
                  <span class="text-gray-500 text-sm">{{ diaRutina.fecha || '-' }}</span>
                </div>

                <div v-if="isTrainer">
                  <span
                    class="text-sm px-2 py-1 rounded font-medium"
                    :class="{
                      'bg-green-100 text-green-700': diaRutina.hecho,
                      'bg-red-100 text-red-600': !diaRutina.hecho
                    }"
                  >
                    {{ diaRutina.hecho ? '✓' : 'X' }}
                  </span>
                </div>

                <div v-else>
                  <input
                    type="checkbox"
                    :id="`hecho-${diaRutina.dia}`"
                    v-model="diaRutina.hecho"
                    @change="guardarEstadoDia(index)"
                  />
                  <label :for="`hecho-${diaRutina.dia}`" class="text-sm select-none ml-1">
                    {{ diaRutina.hecho ? 'Hecho' : 'No hecho' }}
                  </label>
                </div>
              </div>

              <div v-if="diaRutina.descripcion" class="ml-2 mt-1 space-y-1">
                <div
                  v-for="(ejercicios, grupo) in diaRutina.descripcion"
                  :key="grupo"
                  class="text-sm"
                >
                  <em class="capitalize">{{ grupo }}:</em> {{ ejercicios.join(', ') }}
                </div>
              </div>
            </li>
          </ul>
        </template>
      </section>

      <section class="mt-8">
        <h2 class="text-2xl font-semibold mb-3">Progreso</h2>
        <ul class="space-y-2">
          <li
            v-for="(item, i) in alumno.progreso"
            :key="i"
            class="p-3 border-l-4 border-green-500 bg-green-50 rounded"
          >
            {{ item.fecha }} – {{ item.descripcion }}
          </li>
          <li v-if="alumno.progreso.length === 0" class="text-gray-400">
            Aún no hay registros de progreso.
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cargando = ref(true)

const alumno = ref({
  email: '',
  nombre: '',
  edad: null,
  objetivo: '',
  foto: '',
  rutina: [],
  progreso: []
})

async function cargarAlumno(email) {
  cargando.value = true
  await userStore.loadUserFromStorage()

  const encontrado = userStore.users.find(u => u.email === email)
  if (encontrado) {
    encontrado.rutina.forEach(dia => {
      if (dia.hecho === undefined) dia.hecho = false
    })
    alumno.value = { ...alumno.value, ...encontrado }
  } else {
    alumno.value = { email: '', nombre: '', edad: null, objetivo: '', foto: '', rutina: [], progreso: [] }
  }
  cargando.value = false
}

function asignarRutina() {
  router.push(`/asignarRutina/${alumno.value.email}`)
}

function guardarEstadoDia(indice) {
  const idxUser = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (idxUser !== -1) {
    userStore.users[idxUser] = { ...alumno.value }
    userStore._guardarLocalStorage()
  }
}

const isTrainer = computed(() => userStore.loggedUser?.rol === 'entrenador')

cargarAlumno(route.params.email)
watch(() => route.params.email, cargarAlumno)
</script>

<style>
img {
  background-color: transparent;
  border-radius: 50%;
  object-fit: cover;
}

.addRoutine-link {
  width: 200px;
  height: 50px;
  font-size: 1rem;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
  margin: 0;
  font-weight: 500;
  transition: background 0.2s;
}

.addRoutine-link:hover {
  background: #e74c3c;
  color: #fff;
}

.detalleViewContainer {
  width: 100vw;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--color-background-dark);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 6vh;
}

.detalleViewPage {
  max-width: 700px;
  width: 100%;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 5px;
  background: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.volver-btn {
  position: absolute;
  top: 40px; 
  left: 20px;
  color: #3b82f6;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.2);
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
}

</style>
