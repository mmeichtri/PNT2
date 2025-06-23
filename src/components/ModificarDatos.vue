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
        <div class="form-row">
          <input v-model="user.email" type="text" placeholder="Email" />
        </div>
        <div class="form-row">
          <input v-model="user.edad" type="text" placeholder="Edad" />
        </div>
        <div class="form-row">
          <input v-model="user.telefono" type="text" placeholder="Telefono" />
        </div>
        <div class="form-row">
          <input v-model="user.descripcion" type="text" placeholder="Descripción" />
        </div>
        <div class="form-row">
          <select v-model="user.entrenadorAsignado" class="input-like" required>
            <option disabled value="">Seleccioná un entrenador</option>
            <option
              v-for="e in entrenadores"
              :key="e.email"
              :value="e.email"
            >
              {{ e.nombre }} {{ e.apellido }} ({{ e.email }})
            </option>
          </select>
        </div>

      </div>
      <div class="form-actions">
          <button class="btn-guardar"  @click="guardar" type="submit">Guardar</button>
      </div>
</div>
    </div>
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { reactive, computed } from 'vue'

const userStore = useUserStore()
const router  = useRouter()
const user = reactive({ ...userStore.loggedUser })

function guardar () {
  const idx = userStore.users.findIndex(u => u.email === user.email)
  if (idx !== -1) {
    userStore.users[idx] = { ...user }      
    userStore.loggedUser = { ...user }  
    userStore._guardarLocalStorage()
    alert('Perfil actualizado correctamente.')
    router.push({path: '/miPerfil'})
  } else {
    alert('Error: usuario no encontrado.')
  }
}

const entrenadores = computed(() =>
  userStore.users.filter(u => u.rol === 'entrenador')
)

const entrenadorActual = computed(() =>
  entrenadores.value.find(e => e.email === user.entrenadorAsignado)
)

const otrosEntrenadores = computed(() =>
  entrenadores.value.filter(e => e.email !== user.entrenadorAsignado)
)
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

.form-row {
  margin-bottom: 1rem;
}

.input-like {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0,5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f5f5f5;
  color: #000;
  transition: border-color 0.3s ease;
}

.input-like:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: #fff;
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

.btn-guardar{
  padding: 8px 16px;
  border-radius: 6px;
  color: var(--color-text-light);
  transition: 0.2s;
  background-color: var(--color-success)
}
</style>
