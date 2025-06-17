<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const musculo = ref(route.query.musculo || '')
const detail = ref(null)
const loading = ref(true)
const error = ref(null)

async function fetchMuscleDetail(name) {
  const url = `https://www.mockachino.com/97e84d8a-f013-43/musculos/${encodeURIComponent(name)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error al consultar ${name}`)
  return res.json()
}

onMounted(async () => {
  if (!musculo.value) {
    error.value = 'No se recibió ningún músculo'
    loading.value = false
    return
  }
  try {
    detail.value = await fetchMuscleDetail(musculo.value)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="resultsClass">
    <h1>Ejercicios para {{ musculo }}</h1>

    <div v-if="loading">Cargando detalle…</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-if="detail.ejercicios && detail.ejercicios.length">
        <div
          v-for="(bloque, index) in detail.ejercicios"
          :key="index"
          class="bloque-ejercicios"
        >
          <div
            v-for="(ej, key) in bloque"
            :key="key"
            class="ejercicio"
          >
            <h2>{{ key }}</h2>
            <img
              v-if="ej.img"
              :src="ej.img"
              :alt="`Imagen de ${key}`"
              class="img-ejercicio"
            />
            <p v-if="ej.descripcion">{{ ej.descripcion }}</p>
            <p v-else class="sin-desc">Sin descripción</p>
          </div>
        </div>
      </div>
      <div v-else>
        No hay ejercicios disponibles.
      </div>
    </div>
  </div>
</template>

<style scoped>
.resultsClass {
  background: #1e1e1e;
  color: #fff;
  padding: 20px;
  text-align: center;
}
.bloque-ejercicios {
  margin-bottom: 2rem;
}
.ejercicio {
  background: #2a2a2a;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 400px;
  border-radius: 8px;
  text-align: left;
}
.img-ejercicio {
  display: block;
  max-width: 100%;
  margin: 0.5rem 0;
  border-radius: 4px;
}
.sin-desc {
  font-style: italic;
  opacity: 0.7;
}
</style>
