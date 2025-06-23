<template>
  <button @click="$router.back()" class="volver-btn">Volver</button>

  <section class="detalleViewContainer">
    <div v-if="cargando" class="text-white">Cargando datos del alumno…</div>
    <div v-else-if="!alumno?.email" class="text-gray-400 bg-gray-800 p-6 rounded">
      No se encontró el alumno.
    </div>

    <div v-else class="detalleViewPage">
      <header class="flex flex-col items-center gap-2 mb-8">
        <div class="avatar-wrapper">
          <img :src="alumno.foto || '/avatar-default.png'" alt="avatar alumno" />
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold">{{ alumno.nombre }}</h1>
          <p class="text-gray-300">Edad: {{ alumno.edad }} años</p>
          <p class="text-gray-300">Objetivo: {{ alumno.objetivo }}</p>
        </div>
      </header>

      <section class="w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Plan de entrenamiento</h2>

          <div class="flex gap-2 items-center">
            <template v-if="diaTieneRutina">
              <button class="btn-rutina" @click="verRutina">Ver rutina</button>
            </template>

            <template v-if="isTrainer">
              <button
                class="addRoutine-link"
                @click="diaTieneRutina ? modificarRutinaDia() : asignarRutina()"
              >
                {{ diaTieneRutina ? 'Modificar rutina' : 'Asignar rutina' }}
              </button>
            </template>

            <span
              v-if="diaSeleccionado"
              class="estado-pill"
              :class="diaSeleccionado.hecho ? 'estado-pill--hecho' : 'estado-pill--pendiente'"
            >
              {{ diaSeleccionado.hecho ? 'Completado' : 'Pendiente' }}
            </span>
          </div>
        </div>

        <div v-if="sinRutinaAlumno && !isTrainer" class="text-gray-400">
          Sin rutina asignada aún.
        </div>

        <div v-else>
          <ul class="dias-selector">
            <li v-for="(diaRutina, idx) in alumno.rutina" :key="'dia-'+idx">
              <button
                class="dia-pill"
                :class="{ 'dia-pill--activo': idx === selectedDiaIndex }"
                @click="selectDia(idx)"
              >
                <span class="dia-pill-dia">
                  {{ esHoy(diaRutina) ? 'Hoy ' + abreviarDia(diaRutina.dia) : abreviarDia(diaRutina.dia) }}
                </span>
                <span class="dia-pill-fecha">{{ diaRutina.diaNumero }}</span>
              </button>
            </li>
          </ul>


            <div v-if="!isTrainer && !diaSeleccionado.esPlaceholder">
              <button
                class="btn-marcar"
                v-if="!diaSeleccionado.hecho"
                @click="marcarComoHecho"
              >
                Marcar como realizado
              </button>
              </div>
          </div>
      </section>

      <section class="mt-10 w-full">
        <h2 class="text-2xl font-semibold mb-3">Progreso</h2>

        <div v-if="alumno.rutina.length && progresoTotal > 0" class="mb-4">
          <div class="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
            <div
              class="bg-green-400 h-full transition-all duration-500 ease-in-out"
              :style="{ width: porcentajeProgreso + '%' }"
            ></div>
          </div>
          <p class="text-sm mt-1 text-gray-300">{{ porcentajeProgreso }}% completado</p>
        </div>

        <ul class="space-y-2">
          <li
            v-for="(item, i) in alumno.progreso"
            :key="'prog-'+i"
            class="p-3 border-l-4 border-green-500 bg-green-50 rounded text-gray-800"
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const route = useRoute()
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

const selectedDiaIndex = ref(0)
const diaSeleccionado = computed(() => alumno.value.rutina[selectedDiaIndex.value])

function esHoy(diaRutina) {
  if (!diaRutina?.fechaOriginal) return false
  const fecha = new Date(diaRutina.fechaOriginal)
  const hoy = new Date()
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  )
}

function selectDia(idx) {
  selectedDiaIndex.value = idx
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return '--'
  const fecha = new Date(fechaISO)
  return fecha.getDate().toString().padStart(2, '0')
}

function asignarRutina() {
  router.push(`/asignarRutina/${alumno.value.email}/${selectedDiaIndex.value}`)
}

function modificarRutinaDia() {
  router.push(`/asignarRutina/${alumno.value.email}/${selectedDiaIndex.value}`)
}


function verRutina() {
  router.push(`/verRutina/${alumno.value.email}/${selectedDiaIndex.value}`)
}

function obtenerNombreDia(fechaISO) {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const fecha = new Date(fechaISO)
  return dias[fecha.getDay()]
}

function abreviarDia(diaTexto) {
  const dias = {
    lunes: 'Lun',
    martes: 'Mar',
    miércoles: 'Mie',
    jueves: 'Jue',
    viernes: 'Vie',
    sábado: 'Sab',
    domingo: 'Dom'
  }
  return dias[diaTexto.toLowerCase()] || diaTexto.slice(0, 3)
}


function guardarEstadoDia(idx) {
  const userIdx = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (userIdx !== -1) {
    userStore.users[userIdx] = { ...alumno.value }
    userStore._guardarLocalStorage()
  }
}


async function cargarAlumno(email) {
  cargando.value = true
  await userStore.loadUserFromStorage()

  const encontrado = userStore.users.find(u => u.email === email)
  if (encontrado) {
    const rutinaMapeada = (encontrado.rutina || []).map(d => {
      const nombreDia = d.dia ?? obtenerNombreDia(d.fecha)
      return {
        ...d,
        dia: nombreDia,
        hecho: d.hecho ?? false,
        fechaOriginal: d.fecha ?? null,
        diaNumero: d.fecha ? formatearFecha(d.fecha) : '--'
      }
    })

    const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
    const rutinaCompleta = diasSemana.map(diaTexto => {
      const existente = rutinaMapeada.find(r => r.dia.toLowerCase() === diaTexto)
      if (existente) return existente
      return {
        dia: diaTexto,
        diaNumero: '--',
        hecho: false,
        fechaOriginal: null,
        esPlaceholder: true
      }
    })

    alumno.value = { ...alumno.value, ...encontrado, rutina: rutinaCompleta }

    const hoyIdx = rutinaCompleta.findIndex(r => esHoy(r))
    selectedDiaIndex.value = hoyIdx !== -1 ? hoyIdx : 0
  } else {
    alumno.value = { email: '' }
  }
  cargando.value = false
}

function marcarComoHecho() {
  diaSeleccionado.value.hecho = true
  guardarEstadoDia(selectedDiaIndex.value)
}

const isTrainer = computed(() => userStore.loggedUser?.rol === 'entrenador')
const diaTieneRutina = computed(() => diaSeleccionado.value && !diaSeleccionado.value.esPlaceholder)
const progresoTotal = computed(() => alumno.value.rutina.filter(r => !r.esPlaceholder).length)
const porcentajeProgreso = computed(() => {
  const total = progresoTotal.value
  if (!total) return 0
  const completados = alumno.value.rutina.filter(d => !d.esPlaceholder && d.hecho).length
  return Math.round((completados / total) * 100)
})
const sinRutinaAlumno = computed(() => progresoTotal.value === 0)

cargarAlumno(route.params.email)
watch(() => route.params.email, cargarAlumno)
</script>

<style scoped>

.btn-marcar {
  padding: 6px 16px;
  background-color: #10b981; 
  color: white;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  transition: background 0.2s;
}
.btn-marcar:hover {
  background-color: #059669;
}

.btn-rutina {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: var(--color-success);
  color: var(--color-text-light);
  transition: 0.2s;
}
.addRoutine-link {
  padding: 8px 16px;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  color: #e74c3c;
  transition: 0.2s;
}
.addRoutine-link:hover {
  background: #e74c3c;
  color: #fff;
}

.detalleViewContainer {
  width: 100vw;
  min-height: 100vh;
  padding: 2rem;
  background: var(--color-background-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6vh;
  color: #e5e7eb;
}
.detalleViewPage {
  max-width: 680px;
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 2rem 1.5rem;
}

.volver-btn {
  position: absolute;
  top: 32px;
  left: 20px;
  color: #3b82f6;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  font-weight: 600;
  border-radius: 4px;
}

.avatar-wrapper {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
}
.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dias-selector {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 16px;
  margin-bottom: 24px;
  color: #fff;
}
.dias-selector::-webkit-scrollbar {
  display: none;
}
.dia-pill {
  width: 64px;
  height: 94px;
  border-radius: 30px;
  background: #505050;
  border: 1px solid #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  user-select: none;
  transition: transform 0.12s, background 0.2s;
  flex-shrink: 0;
}
.dia-pill:hover { transform: translateY(-2px); }
.dia-pill-dia {
  font-size: 0.85rem;
  font-weight: 600;
  color: #d1d5db;
}
.dia-pill-fecha {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 0.85rem;
}
.dia-pill--activo {
  background: #c5ff5d;
  transform: scale(1.05);
  border-color: #c5ff5d;
}
.dia-pill--activo .dia-pill-dia { color: #1f1f1f; }
.dia-pill--activo .dia-pill-fecha {
  background: #ffffff;
  color: #1f1f1f;
}

.estado-pill {
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.estado-pill--hecho { background: #bbf7d0; color: #065f46; }
.estado-pill--pendiente { background: #fecaca; color: #7f1d1d; }

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}
</style>
