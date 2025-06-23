<template>
  <button @click="$router.back()" class="volver-btn">Volver</button>

  <section class="detalleViewContainer">
    <div v-if="cargando" class="text-white">Cargando datos del alumno…</div>
    <div v-else-if="!alumno?.email" class="text-gray-400 bg-gray-800 p-6 rounded">
      No se encontró el alumno.
    </div>

    <div v-else class="detalleViewPage">
      <!-- ──────────── Cabecera ──────────── -->
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

      <!-- ──────────── Rutina ──────────── -->
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
              :class="estadoClase"
            >
              {{ estadoTexto }}
            </span>
          </div>
        </div>

        <div v-if="sinRutinaAlumno && !isTrainer" class="text-gray-400">
          Sin rutina asignada aún.
        </div>

        <div v-else>
          <!-- Selector de días -->
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

          <div v-if="!isTrainer && !diaSeleccionado.esPlaceholder && !diaSeleccionado.hecho">
            <button class="btn-marcar" @click="marcarComoHecho">
              Marcar como realizado
            </button>
          </div>
        </div>
      </section>

      <!-- ──────────── Progreso ──────────── -->
      <section class="mt-10 w-full">
        <h2 class="text-2xl font-semibold mb-3">Progreso</h2>

        <div v-if="alumno.rutina.length && progresoTotal > 0" class="mb-6 flex items-center gap-4">
          <div class="circular-progress">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path
                class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle"
                :stroke-dasharray="porcentajeProgreso + ', 100'"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" class="percentage">{{ porcentajeProgreso }}%</text>
            </svg>
          </div>
          <p class="text-sm text-gray-300">{{ porcentajeProgreso }}% completado</p>
        </div>

        <ul class="space-y-2">
          <li
            v-for="(item, i) in alumno.progreso"
            :key="'prog-'+i"
            class="p-3 border-l-4 border-green-500 bg-green-50 rounded text-gray-800"
          >
            {{ item.fecha }} – {{ item.descripcion }}
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

const estadoTexto = computed(() => {
  if (diaSeleccionado.value?.esPlaceholder) return 'Sin rutina asignada'
  return diaSeleccionado.value.hecho ? 'Completado' : 'Pendiente'
})

const estadoClase = computed(() => {
  if (diaSeleccionado.value?.esPlaceholder) return 'estado-pill--sin'
  return diaSeleccionado.value.hecho ? 'estado-pill--hecho' : 'estado-pill--pendiente'
})

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

function selectDia(idx) { selectedDiaIndex.value = idx }

function formatearFecha(fechaISO) {
  if (!fechaISO) return '--'
  const fecha = new Date(fechaISO)
  return fecha.getDate().toString().padStart(2, '0')
}

function asignarRutina() {
  router.push(`/asignarRutina/${alumno.value.email}/${selectedDiaIndex.value}`)
}

function modificarRutinaDia() {
  if (diaSeleccionado.value) {
    diaSeleccionado.value.hecho = false
    guardarEstadoDia()
  }
  router.push(`/asignarRutina/${alumno.value.email}/${selectedDiaIndex.value}`)
}

function verRutina() {
  router.push(`/verRutina/${alumno.value.email}/${selectedDiaIndex.value}`)
}

function obtenerNombreDia(fechaISO) {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  return dias[new Date(fechaISO).getDay()]
}

function abreviarDia(diaTexto) {
  const dias = { lunes:'Lun', martes:'Mar', miércoles:'Mie', jueves:'Jue', viernes:'Vie', sábado:'Sab', domingo:'Dom' }
  return dias[diaTexto.toLowerCase()] || diaTexto.slice(0, 3)
}

function guardarEstadoDia() {
  const userIdx = userStore.users.findIndex(u => u.email === alumno.value.email)
  if (userIdx !== -1) {
    userStore.users[userIdx] = { ...alumno.value }
    userStore._guardarLocalStorage()
  }
}

function marcarComoHecho() {
  diaSeleccionado.value.hecho = true
  guardarEstadoDia()
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

    const diasSemana = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo']
    const rutinaCompleta = diasSemana.map(diaTexto => {
      const existente = rutinaMapeada.find(r => r.dia.toLowerCase() === diaTexto)
      return existente ?? {
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

const isTrainer        = computed(() => userStore.loggedUser?.rol === 'entrenador')
const diaTieneRutina   = computed(() => diaSeleccionado.value && !diaSeleccionado.value.esPlaceholder)
const progresoTotal    = computed(() => alumno.value.rutina.filter(r => !r.esPlaceholder).length)
const porcentajeProgreso = computed(() => {
  const total = progresoTotal.value
  if (!total) return 0
  const completados = alumno.value.rutina.filter(d => !d.esPlaceholder && d.hecho).length
  return Math.round((completados / total) * 100)
})
const sinRutinaAlumno  = computed(() => progresoTotal.value === 0)

cargarAlumno(route.params.email)
watch(() => route.params.email, cargarAlumno)
</script>

<style scoped>
.estado-pill--hecho    { background:#bbf7d0;color:#065f46; }
.estado-pill--pendiente{ background:#fecaca;color:#7f1d1d; }
.estado-pill--sin      { background:#facc15;color:#7c4701; }

.btn-rutina, .btn-marcar, .addRoutine-link {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  transition: 0.2s;
  border: none;
}

.btn-rutina{ 
  background: var(--color-success);
  color: var(--color-text-light); 
}
.btn-marcar{ 
  background: var(--color-success);
  color: var(--color-text-light)

}
.btn-marcar:hover{ 
  background: #059669;
}
.addRoutine-link{ 
  background:none; border:1px solid #e74c3c; color:#e74c3c;
}
.addRoutine-link:hover{ 
  background:#e74c3c; color:#fff;
}

.detalleViewContainer {
  width: 100vw; min-height: 100vh; padding: 2rem 2rem 4rem;
  background: var(--color-background-dark);
  display:flex; flex-direction:column; align-items:center; color:#e5e7eb;
}
.detalleViewPage {
  max-width: 680px; width:100%;
  background:rgba(0,0,0,.35);
  border:1px solid rgba(255,255,255,.12);
  border-radius:8px; padding:2rem 1.5rem;
}

.volver-btn {
  position:absolute; top:32px; left:20px;
  color:#3b82f6; background:rgba(0,0,0,.35);
  border:1px solid rgba(255,255,255,.15); padding:6px 12px;
  font-weight:600; border-radius:4px;
}

.avatar-wrapper { width:160px;height:160px;border-radius:50%;overflow:hidden;background:#fff; }
.avatar-wrapper img { width:100%;height:100%;object-fit:cover; }

.dias-selector { display:flex; gap:12px; overflow-x:auto; padding-bottom:16px; margin-bottom:24px; }
.dias-selector::-webkit-scrollbar { display:none; }
.dia-pill {
  width:64px;height:94px;border-radius:30px;
  background:#505050;border:1px solid #666;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  user-select:none;transition:.12s transform,.2s background; flex-shrink:0;
}
.dia-pill:hover      { transform:translateY(-2px); }
.dia-pill-dia        { font-size:.85rem;font-weight:600;color:#d1d5db; }
.dia-pill-fecha      { width:34px;height:34px;border-radius:50%;background:#777;
                        display:flex;align-items:center;justify-content:center;
                        font-weight:700;color:#fff;font-size:.85rem; }
.dia-pill--activo          { background:#c5ff5d; transform:scale(1.05); border-color:#c5ff5d; }
.dia-pill--activo .dia-pill-dia   { color:#1f1f1f; }
.dia-pill--activo .dia-pill-fecha { background:#fff;color:#1f1f1f; }

/* — Estado — */
.estado-pill { padding:2px 10px;border-radius:9999px;font-size:.75rem;font-weight:600; }
.estado-pill--hecho    { background:#bbf7d0;color:#065f46; }
.estado-pill--pendiente{ background:#fecaca;color:#7f1d1d; }

.progress-circle {
  --porcentaje:0;
  width:110px;height:110px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;position:relative;
  background:conic-gradient(#c5ff5d calc(var(--porcentaje)*1%), #3f3f3f 0deg);
  transform:rotate(0deg); 
}
.progress-circle::after {
  content:'';position:absolute;inset:13px;
  background:var(--color-background-dark); border-radius:50%;
}
.progress-text {
  position:absolute;transform:rotate(90deg); 
  font-weight:700;font-size:1rem;color:#e5e7eb;
}
.circular-progress {
  width: 80px;
  height: 80px;
}

.circular-chart {
  display: block;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #2f2f2f;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: #c5ff5d;
  stroke-width: 3.8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dasharray 0.6s ease;
}

.percentage {
  fill: white;
  font-family: 'Arial', sans-serif;
  font-size: 0.32em;
  text-anchor: middle;
}


</style>
