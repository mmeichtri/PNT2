<template>
  <section class="container mx-auto py-8">
    <button @click="$router.back()" class="mb-4 text-blue-500 hover:underline">
      ← Volver
    </button>

    <div v-if="cargando" class="text-white">Cargando datos del alumno…</div>

    <div v-else-if="!alumno?.email" class="text-gray-400 bg-gray-800 p-6 rounded">
      No se encontró el alumno.
    </div>

    <div v-else class="bg-white rounded-xl shadow p-6">
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
        <h2 class="text-2xl font-semibold mb-3">Rutina actual</h2>

        <template v-if="!tieneRutina">
          <div v-if="isTrainer">
            <button class="addRoutine-link" @click.prevent="asignarRutina">
              Asignar rutina
            </button>
          </div>
          <div v-else class="text-gray-400">
            Sin rutina asignada aún.
          </div>
        </template>

        <template v-else>
          <div v-if="isTrainer" class="mb-3">
            <button class="addRoutine-link" @click.prevent="asignarRutina">
              Modificar rutina
            </button>
          </div>

          <ul class="space-y-2">
            <li
              v-for="(diaRutina, i) in alumno.rutina"
              :key="i"
              class="p-3 bg-gray-50 rounded border flex items-center justify-between"
            >
              <div>
                <strong>{{ diaRutina.dia }}:</strong>
                <div class="ml-2 mt-1 space-y-1">
                  <div
                    v-for="(ejercicios, grupo) in diaRutina.descripcion"
                    :key="grupo"
                    class="text-sm"
                  >
                    <em class="capitalize">{{ grupo }}:</em> {{ ejercicios.join(', ') }}
                  </div>
                </div>
              </div>

              <div class="ml-4 flex items-center gap-2">
                <template v-if="!isTrainer">
                  <input
                    type="checkbox"
                    :id="`hecho-${diaRutina.dia}`"
                    v-model="diaRutina.hecho"
                    @change="guardarEstadoDia(i)"
                  />
                  <label :for="`hecho-${diaRutina.dia}`" class="text-sm select-none">
                    {{ diaRutina.hecho ? 'Hecho' : 'No hecho' }}
                  </label>
                </template>
                <template v-else>
                  <span
                    class="text-sm px-2 py-1 rounded font-medium"
                    :class="{
                      'bg-green-100 text-green-700': diaRutina.hecho,
                      'bg-red-100 text-red-600': !diaRutina.hecho
                    }"
                  >
                    {{ diaRutina.hecho ? '✓' : 'X' }}
                  </span>
                </template>
              </div>

            </li>
          </ul>
        </template>
      </section>

      <section>
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
  if(encontrado){
    // Aseguramos que cada día tenga la propiedad 'hecho'
    encontrado.rutina.forEach(dia => {
      if (dia.hecho === undefined) dia.hecho = false
    })
    alumno.value = { ...alumno.value, ...encontrado }
  }else{
    alumno.value = { email: '', nombre: '', edad: null, objetivo: '', foto: '', rutina: [], progreso: [] }
  }

  cargando.value = false
}

function asignarRutina() {
  router.push(`/asignarRutina/${alumno.value.email}`)
}

function guardarEstadoDia(indice) {
  // Guardar la actualización en el store y localStorage
  const idxUser = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (idxUser !== -1) {
    userStore.users[idxUser] = { ...alumno.value }
    userStore._guardarLocalStorage()  // Ajustá según tu método real para guardar
  }
}

const isTrainer = computed(() => userStore.loggedUser?.rol === 'entrenador')
const tieneRutina = computed(() => alumno.value.rutina && alumno.value.rutina.length > 0)

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
</style>
