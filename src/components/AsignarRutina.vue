<template>
  <div class="asignarRutinaPage">
    <h1 class="tituloRutina text-center mb-8 w-full">
      {{ diaIndexEditando !== null ? `Editar rutina del ${diasMostrados[0]}` : `Asignar rutina a ${alumno.nombre}` }}
    </h1>

    <div class="asignarRutinaContainer">
      <form class="flex flex-col gap-10 w-full">
        <div
          v-for="dia in diasMostrados"
          :key="dia"
          class="form-card"
        >
          <h3 class="dia-header">Ejercicios</h3>

          <div v-if="resumenDia(dia).length" class="mb-4">
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
            <div class="inline-field mb-4">
              <label class="text-sm font-medium">Grupos musculares</label>
              <select
                v-model="gruposDropdown[dia]"
                @change="agregarGrupo(dia)"
                class="select-field"
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
            </div>
          </template>

          <div
            v-for="grupo in gruposPorDia[dia]"
            :key="grupo"
            class="grupo-card"
          >
            <div class="inline-field mb-2" v-if="!rutinaGuardada[dia] && !ejerciciosSeleccionados[dia][grupo].length">
              <h4 class="font-medium capitalize">{{ grupo }}</h4>
              <button
                type="button"
                class="text-red-400 hover:text-red-600 text-xs"
                @click="quitarGrupo(dia, grupo)"
              >
                Eliminar grupo
              </button>
            </div>

            <template v-if="!rutinaGuardada[dia] && !ejerciciosSeleccionados[dia][grupo].length">
              <div class="inline-field mb-2">
                <select
                  v-model="ejercicioTemporal[dia][grupo]"
                  class="select-field"
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

                <input
                  type="number"
                  min="1"
                  v-model="seriesTemporal[dia][grupo]"
                  class="input-mini"
                  placeholder="Series"
                />
                <input
                  type="number"
                  min="1"
                  v-model="repeticionesTemporal[dia][grupo]"
                  class="input-mini"
                  placeholder="Reps"
                />

                <button
                  type="button"
                  class="btn-add"
                  @click="agregarEjercicio(dia, grupo)"
                >
                  Añadir
                </button>
              </div>
            </template>

            <ul
              v-if="ejerciciosSeleccionados[dia][grupo]?.length"
              class="tags-wrapper"
            >
              <li
                v-for="e in ejerciciosSeleccionados[dia][grupo]"
                :key="e.nombre"
                class="tag-item"
              >
                {{ e.nombre }} ({{ e.series }}x{{ e.repeticiones }})
                <button
                  v-if="!rutinaGuardada[dia]"
                  type="button"
                  class="hover:text-yellow-300"
                  @click="quitarEjercicio(dia, grupo, e.nombre)"
                >×</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="actions" v-if="diasPendientes.length">
          <button type="button" class="btn-guardar" @click="guardarTodo">
            {{ diaIndexEditando !== null ? 'Guardar cambios' : 'Guardar' }}
          </button>
          <button type="button" class="btn-volver" @click="volverVistaAlumno">
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
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const diaIndexEditando = ref(null)

const gruposPorDia = ref({})
const gruposDropdown = ref({})
const ejerciciosPorGrupo = ref({})
const detallesEjercicios = ref({})
const ejerciciosSeleccionados = ref({})
const ejercicioTemporal = ref({})
const seriesTemporal = ref({})
const repeticionesTemporal = ref({})
const rutinaGuardada = ref({})
const cargandoEjercicios = ref({})
const errorEjercicios = ref({})

function initDia(dia) {
  gruposPorDia.value[dia] = []
  gruposDropdown.value[dia] = ''
  ejerciciosSeleccionados.value[dia] = {}
  ejercicioTemporal.value[dia] = {}
  seriesTemporal.value[dia] = {}
  repeticionesTemporal.value[dia] = {}
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

async function cargarAlumno() {
  await userStore.loadUserFromStorage()
  const email = route.params.email
  const encontrado = userStore.users.find(u => u.email === email)
  if (!encontrado) return

  alumno.value = encontrado

  if (route.params.diaIndex !== undefined) {
    diaIndexEditando.value = parseInt(route.params.diaIndex)
    const rutinaDia = alumno.value.rutina[diaIndexEditando.value]
    if (rutinaDia) {
      rutinaGuardada.value[rutinaDia.dia] = false
      Object.entries(rutinaDia.descripcion).forEach(([grupo, ejercicios]) => {
        agregarGrupoManual(rutinaDia.dia, grupo, ejercicios)
      })
    }
  }
}

function agregarGrupoManual(dia, grupo, ejercicios = []) {
  if (!gruposPorDia.value[dia].includes(grupo)) {
    gruposPorDia.value[dia].push(grupo)
    ejerciciosSeleccionados.value[dia][grupo] = ejercicios
    ejercicioTemporal.value[dia][grupo] = ''
    seriesTemporal.value[dia][grupo] = ''
    repeticionesTemporal.value[dia][grupo] = ''
    cargarEjercicios(grupo)
  }
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
  agregarGrupoManual(dia, grupo)
  gruposDropdown.value[dia] = ''
}

function quitarGrupo(dia, grupo) {
  gruposPorDia.value[dia] = gruposPorDia.value[dia].filter(x => x !== grupo)
  delete ejerciciosSeleccionados.value[dia][grupo]
}

function agregarEjercicio(dia, grupo) {
  const nombre = ejercicioTemporal.value[dia][grupo]
  const series = parseInt(seriesTemporal.value[dia][grupo]) || 0
  const repeticiones = parseInt(repeticionesTemporal.value[dia][grupo]) || 0

  if (!nombre || series <= 0 || repeticiones <= 0) return

  const lista = ejerciciosSeleccionados.value[dia][grupo]
  if (!lista.find(e => e.nombre === nombre)) {
    lista.push({ nombre, series, repeticiones })
  }

  ejercicioTemporal.value[dia][grupo] = ''
  seriesTemporal.value[dia][grupo] = ''
  repeticionesTemporal.value[dia][grupo] = ''
}

function quitarEjercicio(dia, grupo, nombre) {
  ejerciciosSeleccionados.value[dia][grupo] = ejerciciosSeleccionados.value[dia][grupo].filter(e => e.nombre !== nombre)
}

function resumenDia(dia) {
  return Object.keys(ejerciciosSeleccionados.value[dia] || {}).map(grupo => ({
    id: `${dia}-${grupo}`,
    grupo,
    ejercicios: ejerciciosSeleccionados.value[dia][grupo].map(e => `${e.nombre} (${e.series}x${e.repeticiones})`)
  }))
}

const diasMostrados = computed(() => {
  if (diaIndexEditando.value !== null) return [diasSemana[diaIndexEditando.value]]
  return diasSemana
})

const diasPendientes = computed(() =>
  diasMostrados.value.filter(d => resumenDia(d).length && !rutinaGuardada.value[d])
)

function guardarTodo() {
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

  gruposPorDia.value[dia].forEach(grupo => {
    nuevoDiaRutina.descripcion[grupo] = ejerciciosSeleccionados.value[dia][grupo]
  })

  const indiceDia = alumno.value.rutina.findIndex(r => r.dia === dia)
  if (indiceDia !== -1) {
    alumno.value.rutina[indiceDia] = { ...alumno.value.rutina[indiceDia], ...nuevoDiaRutina }
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

<style scoped>

.asignarRutinaPage {
  width: 100dvw;
  height: 100dvh;
  padding: 2rem;
  background-color: var(--color-background-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.asignarRutinaContainer {
  width: 100%;
  max-width: 640px;
  padding: 2.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.tituloRutina {
  font-size: 2.75rem;
  font-weight: 800;
  color: #c5ff5d;
  text-shadow:
    0 0 10px #a0d911,
    0 0 15px #a0d911,
    0 0 20px #84cc16;
  margin-bottom: 2rem;
}

.form-card {
  background: rgb(31 41 55 / 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.dia-header {
  font-size: 1rem;
  font-weight: 600;
  color: #d1d5db;
}


.inline-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.inline-field label,
.inline-field h4 {
  margin: 0;
  white-space: nowrap;
}

.select-field {
  flex: 1;
  min-width: 180px;
  padding: 0.5rem;
  border-radius: 6px;
  background: #fff;
  color: #000;
  font-size: 0.875rem;
}

.grupo-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag-item {
  background: rgb(37 99 235 / 0.8);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}


.btn-add {
  padding: 0.5rem 0.75rem;
  background: #51925c; 
  color: #fff;
  font-size: 0.75rem;
  border-radius: 6px;
  transition: background 0.15s;
}
.btn-add:hover {
  background: #1d4ed8;
}

.actions {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-guardar {
  width: 120px;
  height: 42px;
  color: var(--color-text-light);
  background-color: var(--color-success);
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-volver {
  width: 120px;
  height: 42px;
  color: var(--color-text-light);
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: #374151; 
}
.btn-volver:hover {
  background: #4b5563; 
}
</style>