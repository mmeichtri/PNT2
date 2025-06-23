<template>
  <section class="userPage">
    <div class="userContainer">
      <h2 class="titulo">Alumnos</h2>

      <ul v-if="alumnos.length" class="listaAlumnos">
        <li
          v-for="alumno in alumnos"
          :key="alumno.email"
          @click="verAlumno(alumno.email)"
          tabindex="0"
          @keydown.enter="verAlumno(alumno.email)"
          class="alumnoItem"
        >
          {{ alumno.nombre }}
        </li>
      </ul>

      <div v-else class="mensajeVacio">
        No tenés alumnos registrados aún.
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.loadUserFromStorage()
})

const alumnos = computed(() =>
  userStore.alumnosDe(userStore.loggedUser.email)
)

function verAlumno(email) {
  router.push({ name: 'AlumnoDetalleView', params: { email } })
}
</script>

<style scoped>
.userPage {
  min-height: 100vh;
  padding: 2rem 1rem 3rem;
  background-color: var(--color-background-dark);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 6vh;
}

.userContainer {
  max-width: 480px;
  width: 100%;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 2rem 2.5rem;
  color: #e5e7eb;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  user-select: none;
}

.titulo {
  font-size: 2.25rem; /* text-3xl */
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #c5ff5d;
  text-shadow: 0 0 6px #a0d911;
}

.listaAlumnos {
  list-style: none;
  padding: 0;
  margin: 0;
}

.alumnoItem {
  background: rgba(80, 80, 80, 0.7);
  margin-bottom: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.125rem; /* text-lg */
  font-weight: 600;
  color: #d1d5db;
  transition: background-color 0.25s ease, transform 0.25s ease;
  box-shadow: 0 3px 6px rgba(0,0,0,0.4);
}

.alumnoItem:hover,
.alumnoItem:focus {
  background-color: #c5ff5d;
  color: #1f1f1f;
  outline: none;
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(197, 255, 93, 0.8);
}

.mensajeVacio {
  color: #9ca3af; /* gray-400 */
  text-align: center;
  font-size: 1.125rem;
  padding: 2rem 0;
  font-style: italic;
}
</style>
