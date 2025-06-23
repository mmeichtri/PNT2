<template>
  <button @click="$router.back()" class="volver-btn">← Volver</button>

  <section class="detalleViewContainer">
    <div v-if="cargando" class="text-white">Cargando rutina…</div>

    <div v-else-if="!alumno || !diaSeleccionado" class="text-red-400">
      No se pudo cargar la rutina del día.
    </div>

    <div v-else class="detalleViewPage">
      <h1 class="tituloRutina text-center mb-8">
        Rutina de {{ alumno.nombre }} – {{ abreviarDia(diaSeleccionado.dia) }}
      </h1>

      <div class="grid gap-8">
        <div
          v-for="(ejercicios, grupo) in diaSeleccionado.descripcion"
          :key="grupo"
        >
          <div
            v-for="ej in ejercicios"
            :key="typeof ej === 'string' ? ej : ej.nombre"
            class="ejercicio-row"
          >
            <div class="ej-info">
              <h4 class="ej-title">
                {{ typeof ej === 'string' ? ej : ej.nombre }}
              </h4>

              <div class="series-reps">
                <span><strong>Series:</strong> {{ typeof ej === 'string' ? '-' : ej.series }}</span>
                <span><strong>Repeticiones:</strong> {{ typeof ej === 'string' ? '-' : ej.repeticiones }}</span>
              </div>

              <p class="ej-desc">
                {{ datosGrupo[grupo]?.[typeof ej === 'string' ? ej : ej.nombre]?.descripcion?.ejecucion || 'Descripción no disponible.' }}
              </p>
            </div>

            <img
              :src="datosGrupo[grupo]?.[typeof ej === 'string' ? ej : ej.nombre]?.img || '/placeholder.png'"
              alt="Imagen ejercicio"
              class="ej-img"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

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
  padding: 2rem;
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

/* --- NUEVO estilo para el título principal --- */
.tituloRutina {
  font-size: 2.75rem; /* grande, casi text-4xl */
  font-weight: 800;
  color: #c5ff5d;
  text-shadow:
    0 0 10px #a0d911,
    0 0 15px #a0d911,
    0 0 20px #84cc16;
  margin-bottom: 2rem;
}

/* Nuevo layout ejercicio fila */
.ejercicio-row {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.07);
  border-radius: 8px;
  padding: 1rem;
}

.ej-info {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ej-title {
  font-weight: 600;
  font-size: 1.25rem;
}

.series-reps {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #d1d5db;
}

.series-reps span strong {
  color: #a3d147;
}

.ej-desc {
  font-size: 1rem;
  font-weight: 600;
  color: #fdfdfa;
  margin-top: 0.25rem;
}

.ej-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 6px;
  background: #111;
}

@media (max-width: 480px) {
  .ejercicio-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .ej-img {
    width: 120px;
    height: 120px;
  }
  .series-reps {
    justify-content: center;
  }
}
</style>
