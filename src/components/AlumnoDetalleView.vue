<template>
  <button @click="$router.back()" class="volver-btn">← Volver</button>

  <section class="detalleViewContainer">
    <div v-if="cargando" class="text-white">Cargando datos del alumno…</div>
    <div v-else-if="!alumno?.email" class="text-gray-400 bg-gray-800 p-6 rounded">
      No se encontró el alumno.
    </div>

    <div v-else class="detalleViewPage">
      <header class="flex flex-col items-center gap-2 mb-8">
        <div class="avatar-wrapper">
          <img
            :src="alumno.foto || '/avatar-default.png'"
            alt="avatar alumno"
          />
        </div>
        <div class="text-center">
          <h1 class="text-2xl font-bold">{{ alumno.nombre }}</h1>
          <p class="text-gray-300">Edad: {{ alumno.edad }} años</p>
          <p class="text-gray-300">Objetivo: {{ alumno.objetivo }}</p>
        </div>
      </header>

      <section class="w-full">
        <div class="flex justify-between items-center mb-4">
          <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-semibold">Plan de entrenamiento del día</h2>

              <div class="flex gap-2">
                <template v-if="alumno.rutina?.length">
                  <button class="btn-rutina" @click="verRutina">
                    Ver rutina
                  </button>
                </template>

                <template v-if="isTrainer">
                  <button class="addRoutine-link" @click="asignarRutina">
                    {{ alumno.rutina?.length ? 'Modificar rutina' : 'Asignar rutina' }}
                  </button>
                </template>
              </div>
            </div>
        </div>

        <div v-if="alumno.rutina.length === 0 && !isTrainer" class="text-gray-400">
          Sin rutina asignada aún.
        </div>

        <div v-else>
          <ul class="dias-selector">
            <li v-for="(diaRutina, idx) in alumno.rutina" :key="idx">
              
              <button
                class="dia-pill"
                :class="{ 'dia-pill--activo': idx === selectedDiaIndex }"
                @click="selectDia(idx)"
              >
                <span class="dia-pill-dia">{{ abreviarDia(diaRutina.dia) }}</span>
                <span class="dia-pill-fecha">{{ diaRutina.diaNumero }}</span>
              </button>
            </li>
          </ul>

          <div v-if="diaSeleccionado" class="dia-detalle-card">
            <header class="dia-detalle-header">
              <h3 class="capitalize">{{ diaSeleccionado.dia }}</h3>
              <span
                class="estado-pill"
                :class="diaSeleccionado.hecho ? 'estado-pill--hecho' : 'estado-pill--pendiente'"
              >
                {{ diaSeleccionado.hecho ? 'Completado' : 'Pendiente' }}
              </span>
            </header>

            <ul v-if="diaSeleccionado.descripcion" class="grupo-lista">
              <li v-for="(ejercicios, grupo) in diaSeleccionado.descripcion" :key="grupo">
                <strong class="capitalize">{{ grupo }}:</strong> {{ ejercicios.join(', ') }}
              </li>
            </ul>

            <div class="checkbox-wrapper" v-if="!isTrainer">
              <input
                type="checkbox"
                :id="`hecho-${diaSeleccionado.dia}`"
                v-model="diaSeleccionado.hecho"
                @change="guardarEstadoDia(selectedDiaIndex)"
              />
              <label :for="`hecho-${diaSeleccionado.dia}`">
                Marcar como completado
              </label>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-10 w-full">
      <h2 class="text-2xl font-semibold mb-3">Progreso</h2>

      <div v-if="alumno.rutina.length" class="mb-4">
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

function selectDia(idx) {
  selectedDiaIndex.value = idx
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO)
  return fecha.getDate().toString().padStart(2, '0')
}

async function cargarAlumno(email) {
  cargando.value = true
  await userStore.loadUserFromStorage()

  const encontrado = userStore.users.find(u => u.email === email)
  if (encontrado) {
    encontrado.rutina = encontrado.rutina.map(d => {
      const nombreDia = d.dia ?? obtenerNombreDia(d.fecha)

      return {
        ...d,
        dia: nombreDia,                   
        hecho: d.hecho ?? false,
        fechaOriginal: d.fecha,
        diaNumero: d.fecha ? formatearFecha(d.fecha) : '--'
      }
    })
  
    alumno.value = { ...alumno.value, ...encontrado }

    const hoyIdx = alumno.value.rutina.findIndex(r => {
      const fecha = new Date(r.fechaOriginal)
      return fecha.getDate() === new Date().getDate()
    })

    selectedDiaIndex.value = hoyIdx !== -1 ? hoyIdx : 0
  } else {
    alumno.value = { email: '' }
  }
  cargando.value = false
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

function asignarRutina() {
  router.push(`/asignarRutina/${alumno.value.email}`)
}

function guardarEstadoDia(idx) {
  const userIdx = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (userIdx !== -1) {
    userStore.users[userIdx] = { ...alumno.value }
    userStore._guardarLocalStorage()
  }
}

const isTrainer = computed(() => userStore.loggedUser?.rol === 'entrenador')


const porcentajeProgreso = computed(() => {
  const total = alumno.value.rutina.length
  if (!total) return 0
  const completados = alumno.value.rutina.filter(d => d.hecho).length
  return Math.round((completados / total) * 100)
})

function verRutina () {
  router.push(`/verRutina/${alumno.value.email}`)
}

cargarAlumno(route.params.email)
watch(() => route.params.email, cargarAlumno)
</script>


<style scoped>

.btn-rutina{
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: var(--color-success);
  color: var(--color-text-light);
  transition: 0.2s;
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

.dias-selector {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 16px;
  margin-bottom: 24px;
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

.dia-pill:hover {
  transform: translateY(-2px);
}

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
.dia-pill--activo .dia-pill-dia {
  color: #1f1f1f;
}
.dia-pill--activo .dia-pill-fecha {
  background: #ffffff;
  color: #1f1f1f;
}

.dia-detalle-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.dia-detalle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.estado-pill {
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.estado-pill--hecho {
  background: #bbf7d0;
  color: #065f46;
}
.estado-pill--pendiente {
  background: #fecaca;
  color: #7f1d1d;
}

.grupo-lista {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.progress-bar {
  height: 1.25rem;
  border-radius: 9999px;
  background-color: #1f2937; 
  overflow: hidden;
}
.progress-bar-fill {
  background-color: #34d399; 
  height: 100%;
  transition: width 0.4s ease-in-out;
}

</style>
