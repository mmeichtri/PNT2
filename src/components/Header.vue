
<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const menuOpen = ref(false)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

const userStore = useUserStore()

onMounted(() => {
  userStore.loadUserFromStorage()
})

const router = useRouter()

function logout() {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="logo">🏋️ FitLife</div>

      <div class="user-counter">
        Clientes registrados: <span class="user-count">{{ userStore.users.length }}</span>
      </div>

      <nav class="nav" :class="{ open: menuOpen }">
        <router-link to="/" class="nav-icon" title="Inicio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
              class="bi bi-house-fill" viewBox="0 0 16 16">
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646
                          6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0
                          0-.5.5v1.293z" />
                  <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5
                          1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
          </svg>
        </router-link>

        <template v-if="userStore.loggedUser">
          <div class="nav-icon hola-usuario fix-position">
            <span class="nav-text">Hola, {{ userStore.loggedUser.nombre }}</span>
            <button class="logout-btn" @click="logout">Cerrar sesión</button>
            
          </div>
        </template>
        <template v-else>
          <router-link to="/login">
            <button class="cta">Login</button>
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.cta {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.hamburger {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.user-counter {
  left: 50%;
  transform: translateX(-50%);
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.user-count {
  background: #ff4d4d;
  color: white;
  border-radius: 12px;
  padding: 0.1rem 0.6rem;
  margin-left: 0.5rem;
  font-weight: 700;
}

.nav-text {
  font-weight: 600;
  font-size: 1.2rem;
  color: #000;
}

.hola-usuario {
  color: #000 !important;
}

.fix-position {
  margin-right: 2rem;
  position: relative;
  right: 20px;
}

@media (max-width: 768px) {
  .nav {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    display: none;
    padding: 1rem 2rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  .nav.open {
    display: flex;
  }

  .hamburger {
    display: block;
  }

  .nav-icon {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #333;
    text-decoration: none;
  }

  .nav-icon.hola-usuario {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logout-btn {
    background-color: transparent;
    border: 1px solid #ff4d4d;
    color: #ff4d4d;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background-color 0.3s, color 0.3s;
    height: 32px;
    line-height: 1;
  }

  .logout-btn:hover {
    background-color: #ff4d4d;
    color: white;
  }

  .nav-icon svg {
    transition: transform 0.2s ease;
  }

  .nav-icon:hover svg {
    transform: scale(1.1);
  }
}
</style>
