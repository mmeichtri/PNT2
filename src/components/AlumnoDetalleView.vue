<style>
img {
  background-color: transparent;
  border-radius: 50%;
  object-fit: cover;
}
</style>

<template>
  <section class="container mx-auto py-8">
    <button @click="$router.back()" class="mb-4 text-blue-500 hover:underline">
      ← Volver
    </button>

    <div v-if="cargando" class="text-white">Cargando datos del alumno…</div>

    <div v-else-if="!alumno.id" class="text-gray-400 bg-gray-800 p-6 rounded">
      No se encontró el alumno.
    </div>

    <div v-else class="bg-white rounded-xl shadow p-6">
      <header class="flex items-center gap-6 mb-6">
        <div v-if="alumno.foto" class="w-24 h-24 rounded-full overflow-hidden bg-white">
          <img
            :src="alumno.foto"
            alt="foto alumno"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-else class="w-24 h-24 rounded-full bg-white overflow-hidden" aria-label="avatar alumno" role="img">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            shape-rendering="auto"
            width="96"
            height="96"
            class="block"
          >
            <mask id="viewboxMask">
              <rect width="64" height="64" rx="0" ry="0" x="0" y="0" fill="#fff" />
            </mask>
            <g mask="url(#viewboxMask)">
              <path
                d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.04 14.04 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.97V27a14 14 0 1 1 28 0v1.03a4.5 4.5 0 0 1-.58 8.97A14.04 14.04 0 0 1 37 46.08Z"
                fill="#d78774"
              />
              <mask
                id="personas-a"
                style="mask-type:luminance"
                maskUnits="userSpaceOnUse"
                x="14"
                y="13"
                width="36"
                height="44"
              >
                <path
                  d="M37 46.08V52a5 5 0 0 1-10 0v-5.92A14.04 14.04 0 0 1 18.58 37h-.08a4.5 4.5 0 0 1-.5-8.97V27a14 14 0 1 1 28 0v1.03a4.5 4.5 0 0 1-.58 8.97A14.04 14.04 0 0 1 37 46.08Z"
                  fill="#fff"
                />
              </mask>
              <g mask="url(#personas-a)">
                <path
                  d="M32 13a14 14 0 0 1 14 14v6a14 14 0 1 1-28 0v-6a14 14 0 0 1 14-14Z"
                  fill="#fff"
                  style="mix-blend-mode:overlay"
                  opacity=".36"
                />
              </g>
              <g transform="translate(20 24)">
                <path
                  d="M4 4.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM21.24 3.9a.75.75 0 0 0-.83-.64l-4 .5a.75.75 0 0 0 .18 1.48l4-.5c.41-.05.7-.42.65-.83Z"
                  fill="#1B0640"
                />
              </g>
              <g transform="translate(2 2)">
                <path
                  d="M20.2 15a10 10 0 1 1 19.6 0c-2.53-2.47-5.98-4-9.8-4-3.82 0-7.27 1.53-9.8 4Z"
                  fill="#e15c66"
                />
                <path
                  d="M43.93 23.63A14 14 0 0 0 31 15h-2a14 14 0 0 0-12.93 8.63 14 14 0 0 1 27.86 0Z"
                  fill="#F55D81"
                />
              </g>
              <g transform="translate(11 44)">
                <path
                  d="M16 7v.47a5 5 0 1 0 10 0V7c7.06 1.52 12.93 6.74 16 13H0C3.07 13.74 8.94 8.52 16 7Z"
                  fill="#456dff"
                />
              </g>
              <g transform="translate(23 36)">
                <path
                  d="M7.32 5.73a.75.75 0 0 1 .36-1.46c2.44.61 4.17.32 5.29-.8a.75.75 0 1 1 1.06 1.06c-1.54 1.54-3.81 1.92-6.71 1.2Z"
                  fill="#1B0640"
                />
              </g>
              <g transform="translate(24 28)">
                <path
                  d="M4.25 5a.75.75 0 0 1 1.5 0c0 .84.91 1.75 2.25 1.75 1.34 0 2.25-.91 2.25-1.75a.75.75 0 0 1 1.5 0c0 1.66-1.59 3.25-3.75 3.25S4.25 6.66 4.25 5Z"
                  fill="#000"
                  style="mix-blend-mode:overlay"
                  opacity=".36"
                />
              </g>
              <g transform="translate(14 26)"></g>
            </g>
          </svg>
        </div>

        <div>
          <h1 class="text-3xl font-bold">{{ alumno.nombre }}</h1>
          <p class="text-gray-600">Edad: {{ alumno.edad }} años</p>
          <p class="text-gray-600">Objetivo: {{ alumno.objetivo }}</p>
        </div>
      </header>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-3">Rutina actual</h2>
        <ul class="space-y-2">
          <li
            v-for="(ej, i) in alumno.rutina"
            :key="i"
            class="p-3 bg-gray-50 rounded border"
          >
            <strong>{{ ej.dia }}:</strong> {{ ej.descripcion }}
          </li>
          <li v-if="alumno.rutina.length === 0" class="text-gray-400">
            Sin rutina asignada aún.
          </li>
        </ul>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAlumnosStore } from '../stores/alumnos'

const route = useRoute()
const store = useAlumnosStore()
const cargando = ref(true)

const alumno = ref({
  id: null,
  nombre: '',
  edad: null,
  objetivo: '',
  foto: '',
  rutina: [],
  progreso: []
})


//datos de prueba
const datosDePrueba = {
  1: {
    id: 1,
    nombre: 'Juan Pérez',
    edad: 25,
    objetivo: 'Ganar masa muscular',
    foto: '',
    rutina: [
      { dia: 'Lunes', descripcion: 'Pecho y tríceps' },
      { dia: 'Miércoles', descripcion: 'Espalda y bíceps' }
    ],
    progreso: [
      { fecha: '2025-06-01', descripcion: 'Aumentó 2kg de músculo' }
    ]
  },
  2: {
    id: 2,
    nombre: 'María López',
    edad: 30,
    objetivo: 'Perder peso',
    foto: '',
    rutina: [],
    progreso: []
  }
}

async function cargarAlumno(id) {
  cargando.value = true

  if (datosDePrueba[id]) {
    Object.assign(alumno.value, datosDePrueba[id])
  } else {
    await store.fetchDetalle(id)
    Object.assign(alumno.value, store.detalle[id] || {})
  }

  cargando.value = false
}

onMounted(() => {
  cargarAlumno(Number(route.params.id))
})

watch(
  () => route.params.id,
  newId => cargarAlumno(Number(newId))
)
</script>
