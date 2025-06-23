<template>
    <div class="layout">
  <div class="profile-container">
    <div class="profile-card">
      <img
        class="avatar"
        src="https://www.pngarts.com/files/3/Avatar-PNG-Pic.png"
        alt="Avatar"
      />
      <h2 class="username">
        {{ userStore.loggedUser.nombre }} {{ userStore.loggedUser.apellido }}
      </h2>
      <p class="role">{{ userStore.loggedUser.rol }}</p>
      <div class="info">
        <p><strong>Email:</strong> {{ userStore.loggedUser.email }}</p>
        <p><strong>Edad:</strong> {{ userStore.loggedUser.edad }}</p>
        <p><strong>Teléfono:</strong> {{ userStore.loggedUser.telefono || 'No disponible' }}</p>
        <p><strong>Descripción:</strong> {{ userStore.loggedUser.objetivo }}</p>
        <p><strong>Fecha de inicio:</strong> {{ userStore.loggedUser.fecha }}</p>
        <div v-if="esAlumno" class="text-gray-400">
          <p><strong>Entrenador: </strong> {{ userStore.entrenadorAsignado }}</p>
        </div>
      </div>
      <div class="form-actions">
          <button class="btn-modificar"  @click="modificar" type="submit">Modificar</button>
          <button class="btn-eliminar"  @click="eliminarUsuario" type="submit">Eliminar usuario</button>
      </div>
    </div>
    </div>
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router  = useRouter()
const email = userStore.loggedUser.email

function modificar(){
  router.push({path: `/modificar/${email}`})
}

const esAlumno = computed(() => userStore.loggedUser.rol === 'cliente')

function eliminarUsuario() {
  const confirmar = confirm('¿Estás seguro de que querés eliminar tu usuario? Esta acción no se puede deshacer.')
  if (!confirmar) return
    const email = userStore.loggedUser.email
    userStore.users = userStore.users.filter(u => u.email !== email)
    userStore.loggedUser = null
    userStore._guardarLocalStorage()
    router.push('/')
}

</script>

<style scoped>
.layout {
 display: flex;
  width: 100vw;   
  min-height: 100vh;
}
.profile-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-background-dark);
  min-height: 100vh;
}

.profile-card {
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 5px;
  background: rgba(0,0,0,0.3);
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.username {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.role {
      font-size: 1.5rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.info {
      font-size: 1.5rem;
  text-align: left;
  margin-bottom: 2rem;
}

.info p {
  margin: 0.5rem 0;
}

.btn-eliminar{
  padding: 8px 16px;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  color: #e74c3c;
  transition: 0.2s;
}

.btn-modificar{
  padding: 8px 16px;
  border-radius: 6px;
  color: var(--color-text-light);
  transition: 0.2s;
  background-color: var(--color-success)
}
</style>
