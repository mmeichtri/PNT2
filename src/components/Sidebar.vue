 <script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const menuItems = computed(() => {
  const rol = userStore.loggedUser?.rol
  const email = userStore.loggedUser.email
  if (rol === 'entrenador') {
    return [
      { name: 'Mi perfil', route: 'MiPerfil', icon: '👤', routeName: 'MiPerfil'},
      { name: 'Mis alumnos', route: 'User', icon: '👥', routeName: 'User' },
    ]
  } else if (rol === 'cliente') {
    return [
      { name: 'Mi perfil', route: 'MiPerfil', icon: '👤', routeName: 'MiPerfil' },
      // { name: 'Calendario', route: 'Clients', icon: '📅', routeName: 'Clients' },
      { name: 'Mi plan', route: `/alumno/${email}`, icon: '📋', routeName: 'AlumnoDetalleView' },
      { name: 'Progreso', route: 'Progreso', icon: '📈', routeName: 'VistaProgresoAlumno' },
    ]
  } else if (rol === 'admin') {
    return [
      { name: 'Estadísticas', route: 'Estadísticas', icon: '📊', routeName: 'Admin' },
      { name: 'Alumnos', route: 'AlumnosLista', icon: '👥', routeName: 'AlumnosLista' },
    { name: 'Entrenadores', route: 'EntrenadoresLista', icon: '🧑‍🏫', routeName: 'EntrenadoresLista' },
    ]
  }
  return []
})

const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
function goToRoute(routeName) {
  if (routeName === 'AlumnoDetalleView') {
    const email = userStore.loggedUser.email
    router.push({ name: 'AlumnoDetalleView', params: { email } })
  } else {
    router.push({ name: routeName })
  }
}
</script>

<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <button 
      @click="toggleSidebar" 
      class="toggle-button" 

      :aria-label="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
    >
      <span>{{ isCollapsed ? '◀' : '➤' }}</span>
    </button>

    <div v-if="!isCollapsed" class="avatar">
      <img src="https://www.pngarts.com/files/3/Avatar-PNG-Pic.png" alt="Avatar" />
    </div>

    <transition name="fade">
      <div v-if="!isCollapsed">
        <!-- Corrijo el v-if aquí -->
        <div class="user-info" v-if="userStore.loggedUser">
          <p>
            <strong>{{ userStore.loggedUser.nombre }} {{ userStore.loggedUser.apellido }}</strong>
          </p>
          <div class="userType">
            {{ userStore.loggedUser.rol }}
          </div>
        </div>
        <div class="divider"></div>
      </div>
    </transition>
<div class="menu-scroll">
    <ul class="section-list">
 <li 
          v-for="(item, index) in menuItems" 
    :key="index" 
    class="listItemSidebar" 
    @click="goToRoute(item.routeName)" 
    style="cursor: pointer;"
  >
    <span class="icon">{{ item.icon }}</span>
    <span v-if="!isCollapsed" class="section-text">{{ item.name }}</span>
      </li>
    </ul>
    </div>
  </div>
</template>



<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}



.sidebar.collapsed {
  width: 60px;
  padding: 20px 5px;
  overflow: hidden;
}
.centerOnly {
  justify-content: center;
  gap: 0;
}

.toggle-button {
    
  align-self: flex-end;
  background: none;
  border: none;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
  margin-bottom: 10px;
}

.sidebar {
  width: 280px;
  height: 100vh;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
   overflow-y: auto;
  background-color: rgba(30, 30, 30, 0.95); 
  backdrop-filter: blur(10px);
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
  transition: width 0.3s ease;
  z-index: 1000;
}


.avatar {
  width: 80px;
  height: 80px;
  margin: 1.5rem auto;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
}

.avatar img {
  width: 100%;
  height: 80%;
  object-fit: cover;
  display: block;
}

.sidebar.collapsed .avatar {
  display: none;
}




.user-info {
    font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
}


.userType {
  font-size: 1.1rem;
  color: #aaa;
}

.divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 1rem 0;
}

.section-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.listItemSidebar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}


.listItemSidebar:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.sidebar.collapsed .listItemSidebar {
  justify-content: center;
  gap: 0;
}
.sidebar.collapsed .user-info,
.sidebar.collapsed .divider{
  display: none;
}
.icon {
  font-size: 1.2rem;
}

.menu-scroll {
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 1rem;
}
</style>
