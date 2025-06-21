<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">
      Asignar rutina a {{ alumno.nombre }}
    </h1>

    <div class="flex flex-col gap-10">
      <!-- SELECCIONAR GRUPOS -->
      <div class="bg-gray-800/80 rounded-xl p-6">
        <label class="block mb-2">Seleccionar grupo muscular</label>
        <select
          v-model="grupoSeleccionado"
          @change="agregarGrupoUnico()"
          class="w-full rounded p-2 text-black bg-white mb-6"
        >
          <option value="" disabled selected>Seleccioná un grupo…</option>
          <option
            v-for="m in gruposDisponiblesUnicos"
            :key="m"
            :value="m"
            class="capitalize"
          >
            {{ m }}
          </option>
        </select>

        <!-- BLOQUES DE EJERCICIOS DEL GRUPO -->
        <div
          v-for="grupo in gruposSeleccionados"
          :key="grupo"
          class="mt-8"
        >
          <h4 class="font-medium capitalize mb-2 flex items-center gap-2">
            {{ grupo }}
            <button
              type="button"
              class="text-red-400 hover:text-red-600 text-sm"
              @click="quitarGrupoUnico(grupo)"
            >
              Eliminar grupo
            </button>
          </h4>

          <div v-if="cargandoEjercicios[grupo]" class="text-sm text-gray-400">
            Cargando ejercicios…
          </div>
          <div v-else-if="errorEjercicios[grupo]" class="text-sm text-red-400">
            Error al cargar ejercicios.
          </div>

          <div v-else>
            <div class="flex gap-2 items-start">
              <select
                v-model="ejercicioTemporal[grupo]"
                class="flex-1 p-2 rounded text-black bg-white"
              >
                <option value="" disabled selected>Elegí un ejercicio…</option>
                <option
                  v-for="nombre in ejerciciosPorGrupo[grupo]"
                  :key="nombre"
                  :value="nombre"
                >
                  {{ nombre }}
                </option>
              </select>
              <button
                type="button"
                class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                @click="agregarEjercicioUnico(grupo)"
              >
                Añadir
              </button>
            </div>
          </div>

          <ul
            v-if="ejerciciosSeleccionados[grupo]?.length"
            class="flex flex-wrap gap-2 mt-2"
          >
            <li
              v-for="e in ejerciciosSeleccionados[grupo]"
              :key="e"
              class="bg-blue-600/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              {{ e }}
              <button
                type="button"
                class="hover:text-yellow-300"
                @click="quitarEjercicioUnico(grupo, e)"
              >×</button>
            </li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        @click="guardarRutinaUnica"
      >
        Guardar rutina
      </button>

      <button
        type="button"
        class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        @click="volverVistaAlumno"
      >
        Volver
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const alumno = ref({})
const musculos = ref([])
const grupoSeleccionado = ref('')
const gruposSeleccionados = ref([])
const ejerciciosPorGrupo = ref({})
const ejerciciosSeleccionados = ref({})
const ejercicioTemporal = ref({})
const cargandoEjercicios = ref({})
const errorEjercicios = ref({})

onMounted(() => {
  cargarMusculos()
  cargarAlumno()
})

async function cargarMusculos() {
  try {
    const { data } = await axios.get('https://www.mockachino.com/97e84d8a-f013-43/musculos')
    musculos.value = data.musculos ?? []
  } catch (e) {
    console.error(e)
  }
}

async function cargarAlumno() {
  await userStore.loadUserFromStorage()
  const email = route.params.email
  const encontrado = userStore.users.find(u => u.email === email)
  if (encontrado) alumno.value = encontrado
}

const gruposDisponiblesUnicos = computed(() => {
  return musculos.value.filter(m => !gruposSeleccionados.value.includes(m))
})

function agregarGrupoUnico() {
  const grupo = grupoSeleccionado.value
  if (!grupo) return
  gruposSeleccionados.value.push(grupo)
  ejerciciosSeleccionados.value[grupo] = []
  ejercicioTemporal.value[grupo] = ''
  grupoSeleccionado.value = ''
  cargarEjercicios(grupo)
}

function quitarGrupoUnico(grupo) {
  gruposSeleccionados.value = gruposSeleccionados.value.filter(x => x !== grupo)
  delete ejerciciosSeleccionados.value[grupo]
}

function agregarEjercicioUnico(grupo) {
  const ejercicio = ejercicioTemporal.value[grupo]
  if (!ejercicio) return
  const lista = ejerciciosSeleccionados.value[grupo]
  if (!lista.includes(ejercicio)) lista.push(ejercicio)
  ejercicioTemporal.value[grupo] = ''
}

function quitarEjercicioUnico(grupo, ejercicio) {
  ejerciciosSeleccionados.value[grupo] = ejerciciosSeleccionados.value[grupo].filter(x => x !== ejercicio)
}

async function cargarEjercicios(grupo) {
  if (ejerciciosPorGrupo.value[grupo] || cargandoEjercicios.value[grupo]) return
  cargandoEjercicios.value[grupo] = true
  try {
    const { data } = await axios.get(`https://www.mockachino.com/97e84d8a-f013-43/musculos/${grupo}`)
    let nombres = []
    if (Array.isArray(data)) {
      nombres = data.map(s => s.trim()).filter(Boolean)
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.ejercicios)) {
        nombres = Object.keys(data.ejercicios[0] || {})
      } else {
        nombres = Object.keys(data)
      }
    }
    ejerciciosPorGrupo.value[grupo] = nombres
  } catch (e) {
    errorEjercicios.value[grupo] = true
  } finally {
    cargandoEjercicios.value[grupo] = false
  }
}

function guardarRutinaUnica() {
  const nuevaRutina = []
  gruposSeleccionados.value.forEach(grupo => {
    if (ejerciciosSeleccionados.value[grupo]?.length) {
      nuevaRutina.push({
        dia: grupo, // usar grupo como identificador temporal
        descripcion: {
          [grupo]: ejerciciosSeleccionados.value[grupo]
        },
        hecho: false
      })
    }
  })

  alumno.value.rutina = nuevaRutina
  const idxUser = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (idxUser !== -1) {
    userStore.users[idxUser] = { ...alumno.value }
    userStore._guardarLocalStorage()
  }
  router.push(`/alumno/${alumno.value.email}`)
}

function volverVistaAlumno() {
  router.push(`/alumno/${alumno.value.email}`)
}
</script>
