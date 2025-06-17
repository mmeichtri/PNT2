<script setup>
import { ref } from 'vue'

const sections = ref([
  { id: 1, name: 'Mi perfil', icon: '👤' },
  { id: 2, name: 'Mis rutinas', icon: '📋' },
  { id: 3, name: 'Progreso', icon: '📈' },
  { id: 4, name: 'Ajustes', icon: '⚙️' },
])


const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <button @click="toggleSidebar" class="toggle-button" :aria-label="isCollapsed ? 'Expandir menú' : 'Colapsar menú'">
      <span>{{ isCollapsed ? '◀' : '➤' }}</span>
    </button>

   <div v-if="!isCollapsed" class="avatar">
      <img src="https://www.pngarts.com/files/3/Avatar-PNG-Pic.png" alt="Avatar" />
    </div>

    <transition name="fade">
      <div v-if="!isCollapsed">
        <div class="user-info">
          <div class="userName">Fernando Colombo</div>
          <div class="userType">Cliente</div>
        </div>
        <div class="divider"></div>
      </div>
    </transition>

    <ul class="section-list">
      <li v-for="section in sections" :key="section.id" class="listItemSidebar">
        <span class="icon">{{ section.icon }}</span>
        <span v-if="!isCollapsed" class="section-text">{{ section.name }}</span>
      </li>
    </ul>
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
  background-color: rgba(30, 30, 30, 0.95); 
  backdrop-filter: blur(10px);
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
  transition: width 0.3s ease;
  z-index: 1000;
}


.avatar {
  width: 100px;
  height: 100px;
  margin: 1.5rem auto;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}



.user-info {
  text-align: center;
  margin-bottom: 1rem;
}

.userName {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
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
  gap: 10px;
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 8px;
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
  font-size: 1.5rem;
}
</style>
