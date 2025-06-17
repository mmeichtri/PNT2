

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const muscles = ref([])
const selectedMuscle = ref(null)
const loading = ref(true)
const error = ref(null)
const router = useRouter()

onMounted(async () => {
  try {
    const res = await fetch('https://www.mockachino.com/97e84d8a-f013-43/musculos')
    if (!res.ok) throw new Error('Error en la petición inicial')
    const json = await res.json()
    muscles.value = json.musculos
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})


async function fetchMuscleDetail(muscle) {
  const url = `https://www.mockachino.com/97e84d8a-f013-43/musculos/${encodeURIComponent(muscle)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error al consultar ${muscle}`)
  return res.json()
}

async function onAccept() {
  if (!selectedMuscle.value) {
    alert('Seleccioná un músculo')
    return
  }

  try {
    const detail = await fetchMuscleDetail(selectedMuscle.value)
    console.log(`Detalle ${selectedMuscle.value}:`, detail)

    router.push({
      path: '/results',
      query: { musculo: selectedMuscle.value }
    })
  } catch (err) {
    console.error(err)
    alert('Hubo un problema: ' + err.message)
  }
}
</script>

<template>
  <div class="homeClass">
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-for="m in muscles" :key="m">
        <label class="radio-label">
          <input
            type="radio"
            name="musculo"
            :value="m"
            v-model="selectedMuscle"
          />
          {{ m }}
        </label>
      </div>

      <button class="btn-accept" @click="onAccept">
        Aceptar
      </button>
    </div>
  </div>
</template>

<style scoped>
.homeClass {
  background-color: #161616;
  padding: 20px;
  text-align: center;
  color: white;
}
.radio-label {
  display: block;
  margin: 0.5rem 0;
}
.btn-accept {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
}
.btn-accept:hover {
  background-color: #45a049;
}
</style>
