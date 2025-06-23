<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const userStore = useUserStore()

const alumno = ref(null)
const diaSeleccionado = ref(null)
const cargando = ref(true)

const datosGrupo = reactive({})

async function fetchGrupo (grupo) {
  if (datosGrupo[grupo]) return
  try {
    const { data } = await axios.get(
      `https://www.mockachino.com/97e84d8a-f013-43/musculos/${encodeURIComponent(grupo)}`
    )
    const obj =
      Array.isArray(data) ? {} :
      data.ejercicios ? data.ejercicios[0] :
      data
    datosGrupo[grupo] = obj || {}
  } catch (err) {
    console.error(`Error grupo ${grupo}`, err)
    datosGrupo[grupo] = {}
  }
}

async function cargar () {
  await userStore.loadUserFromStorage()
  alumno.value = userStore.users.find(u => u.email === route.params.email)
  if (!alumno.value) return

  const idx = Number(route.params.diaIdx)
  diaSeleccionado.value = alumno.value.rutina[idx]

  if (!diaSeleccionado.value) return

  const grupos = Object.keys(diaSeleccionado.value.descripcion || {})
  await Promise.all(grupos.map(fetchGrupo))

  cargando.value = false
}

onMounted(cargar)

function abreviarDia (d) {
  const m = { lunes:'Lun', martes:'Mar', miércoles:'Mie', jueves:'Jue', viernes:'Vie', sábado:'Sab', domingo:'Dom' }
  return m[d.toLowerCase()] || d.slice(0,3)
}
</script>

<template>
  <button @click="$router.back()" class="volver-btn">← Volver</button>

  <section class="detalleViewContainer">
    <div v-if="cargando" class="text-white">Cargando rutina…</div>

    <div v-else-if="!alumno || !diaSeleccionado" class="text-red-400">
      No se pudo cargar la rutina del día.
    </div>

    <div v-else class="detalleViewPage">
      <h1 class="text-2xl font-bold mb-6 text-center">
        Rutina de {{ alumno.nombre }} – {{ abreviarDia(diaSeleccionado.dia) }}
      </h1>

      <div
        v-for="(ejercicios, grupo) in diaSeleccionado.descripcion"
        :key="grupo"
        class="mb-8"
      >
        <h3 class="font-medium capitalize mb-3">{{ grupo }}</h3>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="ej in ejercicios"
            :key="ej"
            class="ej-card"
          >
            <div class="ej-content">
              <h4 class="ej-title">{{ ej }}</h4>
              <p class="ej-desc">
                {{ datosGrupo[grupo]?.[ej]?.descripcion?.ejecucion || 'Descripción no disponible.' }}
              </p>
            </div>

            <img
              :src="datosGrupo[grupo]?.[ej]?.img || '/placeholder.png'"
              alt="img ejercicio"
              class="ej-img"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  max-width: 900px;
  width: 100%;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 2rem 2rem;
}
.volver-btn {
  position: absolute;
  top: 32px;
  left: 20px;
  color: #3b82f6;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 6px 12px;
  font-weight: 600;
  border-radius: 4px;
}
.ej-card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 1rem;
  display: flex;             
  align-items: flex-start;
  gap: 1rem;
}
.ej-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.ej-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  flex-shrink: 0;  
}
.ej-title { font-weight: 600; }
.ej-desc  { font-size: .875rem; color: #d1d5db; }
</style>
