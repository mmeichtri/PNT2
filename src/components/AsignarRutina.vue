<style>
.asignarRutinaPage {
  width: 100dvw;
  height: 100dvh;
  padding: 2rem;
  background-color: var(--color-background-dark);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 8vh;
}


.asignarRutinaContainer {
  max-width: 400px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 5px;
  background: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-guardar{
    width: 100px;
    height: 40px;
    margin-bottom: 0.5rem;
    background-color: var(--color-success);
    color: var(--color-text-light);
    font-size: 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: 500;
}

.btn-volver{
  width: 100px;
  height: 40px;
  color: var(--color-text-light);
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
}

</style>
<template>
    <div class="asignarRutinaPage">
    <h1 class="text-2xl font-bold mb-6">
      Asignar rutina a {{ alumno.nombre }}
    </h1>

    <div class="asignarRutinaContainer">
      <form class="flex-1 space-y-10">
        <div
          v-for="dia in diasSemana"
          :key="dia"
          class="bg-gray-800/80 rounded-xl p-6"
        >
          <h3 class="text-lg font-semibold mb-4">{{ dia }}</h3>

          <div v-if="rutinaGuardada[dia]" class="text-green-400 text-sm mb-4">
            ✅ Rutina asignada para {{ dia }}
          </div>

          <div v-if="resumenDia(dia).length" class="mb-4 space-y-1">
            <h4 class="text-sm font-medium text-gray-300">Ejercicios seleccionados</h4>
            <ul class="space-y-1 ml-2">
              <li
                v-for="item in resumenDia(dia)"
                :key="item.id"
                class="text-xs text-gray-100"
              >
                <strong class="capitalize">{{ item.grupo }}:</strong>
                {{ item.ejercicios.join(', ') || '—' }}
              </li>
            </ul>
          </div>

          <template v-if="!rutinaGuardada[dia]">
            <label class="block mb-2">Grupos musculares</label>
            <select
              v-model="gruposDropdown[dia]"
              @change="agregarGrupo(dia)"
              class="w-full rounded p-2 text-black bg-white mb-6"
            >
              <option value="" disabled selected>Seleccioná un grupo…</option>
              <option
                v-for="m in gruposDisponibles(dia)"
                :key="m"
                :value="m"
                class="capitalize"
              >
                {{ m }}
              </option>
            </select>
          </template>

          <div
            v-for="grupo in gruposPorDia[dia]"
            :key="grupo"
            class="mt-8"
          >
            <template v-if="!rutinaGuardada[dia] && !ejerciciosSeleccionados[dia][grupo].length">
              <h4 class="font-medium capitalize mb-2 flex items-center gap-2">
                {{ grupo }}
                <button
                  type="button"
                  class="text-red-400 hover:text-red-600 text-sm"
                  @click="quitarGrupo(dia, grupo)"
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
                    v-model="ejercicioTemporal[dia][grupo]"
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
                    @click="agregarEjercicio(dia, grupo)"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </template>

            <ul
              v-if="ejerciciosSeleccionados[dia][grupo]?.length"
              class="flex flex-wrap gap-2 mt-2"
            >
              <li
                v-for="e in ejerciciosSeleccionados[dia][grupo]"
                :key="e"
                class="bg-blue-600/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
              >
                {{ e }}
                <button
                  v-if="!rutinaGuardada[dia]"
                  type="button"
                  class="hover:text-yellow-300"
                  @click="quitarEjercicio(dia, grupo, e)"
                >×</button>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="diasPendientes.length" class="text-right">
          <button type="button" class="btn-guardar"@click="guardarTodo">
            Guardar 
          </button>
          <button
            type="button"
            class="btn-volver"
            @click="volverVistaAlumno"
          >
            Volver
          </button>
        </div>
      </form>

      
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const alumno = ref({})
const musculos = ref([])
const diasSemana = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

const gruposPorDia = ref({})
const gruposDropdown = ref({})
const ejerciciosPorGrupo = ref({})
const detallesEjercicios = ref({})
const ejerciciosSeleccionados = ref({})
const ejercicioTemporal = ref({})
const rutinaGuardada = ref({})
const cargandoEjercicios = ref({})
const errorEjercicios = ref({})

function initDia(dia) {
  gruposPorDia.value[dia] = []
  gruposDropdown.value[dia] = ''
  ejerciciosSeleccionados.value[dia] = {}
  ejercicioTemporal.value[dia] = {}
  rutinaGuardada.value[dia] = false
}
diasSemana.forEach(initDia)

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

async function cargarAlumno () {
  await userStore.loadUserFromStorage()
  const email = route.params.email
  const encontrado = userStore.users.find(u => u.email === email)
  if (encontrado) alumno.value = encontrado
}

function normalizar(arr) {
  return arr.map(s => s.trim()).filter(Boolean)
}

async function cargarEjercicios(grupo) {
  if (ejerciciosPorGrupo.value[grupo] || cargandoEjercicios.value[grupo]) return
  cargandoEjercicios.value[grupo] = true
  try {
    const { data } = await axios.get(`https://www.mockachino.com/97e84d8a-f013-43/musculos/${grupo}`)
    let nombres = [], detalles = {}
    if (Array.isArray(data)) {
      nombres = normalizar(data)
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.ejercicios)) {
        detalles = data.ejercicios[0] || {}
        nombres = normalizar(Object.keys(detalles))
      } else {
        detalles = data
        nombres = normalizar(Object.keys(data))
      }
    }
    ejerciciosPorGrupo.value[grupo] = nombres
    detallesEjercicios.value[grupo] = detalles
  } catch (e) {
    errorEjercicios.value[grupo] = true
  } finally {
    cargandoEjercicios.value[grupo] = false
  }
}

function gruposDisponibles(dia) {
  return musculos.value.filter(m => !gruposPorDia.value[dia].includes(m))
}

function agregarGrupo(dia) {
  const grupo = gruposDropdown.value[dia]
  if (!grupo) return
  gruposPorDia.value[dia].push(grupo)
  ejerciciosSeleccionados.value[dia][grupo] = []
  ejercicioTemporal.value[dia][grupo] = ''
  gruposDropdown.value[dia] = ''
  cargarEjercicios(grupo)
}

function quitarGrupo(dia, grupo) {
  gruposPorDia.value[dia] = gruposPorDia.value[dia].filter(x => x !== grupo)
  delete ejerciciosSeleccionados.value[dia][grupo]
}

function agregarEjercicio(dia, grupo) {
  const ejercicio = ejercicioTemporal.value[dia][grupo]
  if (!ejercicio) return
  const lista = ejerciciosSeleccionados.value[dia][grupo]
  if (!lista.includes(ejercicio)) lista.push(ejercicio)
  ejercicioTemporal.value[dia][grupo] = ''
}

function quitarEjercicio(dia, grupo, ejercicio) {
  ejerciciosSeleccionados.value[dia][grupo] = ejerciciosSeleccionados.value[dia][grupo].filter(x => x !== ejercicio)
}

function resumenDia(dia) {
  return Object.keys(ejerciciosSeleccionados.value[dia] || {}).map(grupo => ({
    id: `${dia}-${grupo}`,
    grupo,
    ejercicios: ejerciciosSeleccionados.value[dia][grupo]
  }))
}

const diasPendientes = computed(() =>
  diasSemana.filter(d => resumenDia(d).length && !rutinaGuardada.value[d])
)

function guardarTodo () {
  diasPendientes.value.forEach(d => guardarRutinaDia(d))
  router.push(`/alumno/${alumno.value.email}`)
}

function guardarRutinaDia(dia) {
  const detalle = resumenDia(dia)
  if (!detalle.length) return

  const nuevoDiaRutina = {
    dia,
    descripcion: {}
  }
  detalle.forEach(item => {
    nuevoDiaRutina.descripcion[item.grupo] = item.ejercicios
  })

  const indiceDia = alumno.value.rutina.findIndex(r => r.dia === dia)
  if (indiceDia !== -1) {
    alumno.value.rutina[indiceDia] = nuevoDiaRutina
  } else {
    alumno.value.rutina.push(nuevoDiaRutina)
  }

  const idxUser = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (idxUser !== -1) {
    userStore.users[idxUser] = { ...alumno.value }
    userStore._guardarLocalStorage()
  }

  rutinaGuardada.value[dia] = true
}


function volverVistaAlumno() {
  router.push(`/alumno/${alumno.value.email}`)
}
</script>
