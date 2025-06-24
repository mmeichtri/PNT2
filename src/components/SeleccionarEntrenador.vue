<template>
  <div class="formPage">
    <h1 class="subtitle">Formulario de datos, y selección de entrenador</h1>
    <div class="formContainer">
      <form @submit.prevent="guardar">
        <div class="form-row">
          <label>Nombre<input v-model="form.nombre" type="text" required /></label>
          <label>Edad<input v-model.number="form.edad" type="number" min="1" required /></label>
          <label>E‑mail<input v-model="form.email" type="email" required /></label>
          <label>Peso (kg)<input v-model.number="form.peso" type="number" min="1" required /></label>
        </div>

        <label class="full-width">
          Objetivo
          <textarea v-model="form.descripcion" rows="3" required></textarea>
        </label>

        <label class="full-width">
          Entrenador disponible
          <select v-model="form.entrenador" required>
            <option disabled value="">Seleccioná un entrenador</option>
            <option v-for="e in entrenadores" :key="e.email" :value="e.email">
              {{ e.nombre }} {{ e.apellido }} ({{ e.email }})
            </option>
          </select>
        </label>

        <div v-if="entrenadorSeleccionado" class="preview-entrenador">
          <div class="entrenador-info">
            <img
              v-if="entrenadorSeleccionado.imagen"
              :src="entrenadorSeleccionado.imagen"
              alt="Foto del entrenador"
              class="entrenador-avatar"
            />
            <div>
              <p><strong>Nombre:</strong> {{ entrenadorSeleccionado.nombre }} {{ entrenadorSeleccionado.apellido }}</p>
              <p><strong>Email:</strong> {{ entrenadorSeleccionado.email }}</p>
              <p v-if="entrenadorSeleccionado.descripcion"><strong>Descripción:</strong> {{ entrenadorSeleccionado.descripcion }}</p>
              <p><strong>Personas que entrena:</strong> {{ cantidadClientes[entrenadorSeleccionado.email] || 0 }}</p>
            </div>
          </div>
        </div>

        <button class="btn-guardar" type="submit">Guardar y continuar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const entrenadores = computed(() =>
  userStore.users.filter(u => u.rol === 'entrenador')
)

// Cantidad de clientes por entrenador
const cantidadClientes = computed(() => {
  const conteo = {}
  userStore.users.forEach(u => {
    if (u.rol === 'cliente' && u.entrenadorAsignado) {
      conteo[u.entrenadorAsignado] = (conteo[u.entrenadorAsignado] || 0) + 1
    }
  })
  return conteo
})

const form = ref({
  nombre: userStore.loggedUser?.nombre + " " + userStore.loggedUser?.apellido || '',
  edad: userStore.loggedUser?.edad || '',
  email: userStore.loggedUser?.email || '',
  peso: userStore.loggedUser?.peso || '',
  descripcion: userStore.loggedUser?.descripcion || '',
  entrenador: userStore.loggedUser?.entrenadorAsignado || ''
})

const entrenadorSeleccionado = computed(() =>
  entrenadores.value.find(e => e.email === form.value.entrenador)
)

function guardar () {
  const datosActualizados = {
    ...userStore.loggedUser,
    ...form.value,
    entrenadorAsignado: form.value.entrenador
  }

  userStore.login(datosActualizados)

  userStore.asignarEntrenadorACliente(
    datosActualizados.email,
    datosActualizados.entrenadorAsignado
  )

  alert('Datos guardados correctamente ✅')
  router.push('/')
}
</script>


<style scoped>
label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: var(--color-text-light, #e5e5e5);
}

input,
select,
textarea {
  margin-top: 0.35rem;
  padding: 0.55rem 0.75rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background: #ffffff;
  color: #000;
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.full-width {
  grid-column: 1 / -1;
}

.btn-guardar {
  width: 200px;
  height: 50px;
  background-color: var(--color-success);
  color: var(--color-text-light);
  font-size: 1rem;
  border-radius: 1px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-guardar:hover {
  background: #218838;
}

.formPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #222;
  padding-top: 10vh;
}

.formContainer {
  width: 100%;
  max-width: 500px;
  padding: 2rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-entrenador {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #e5e5e5;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.entrenador-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.entrenador-avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #aaa;
}
</style>
