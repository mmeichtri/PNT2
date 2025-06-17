<template>
  <header class="header">
    <div class="container">
      <div class="logo">🏋️ FitLife</div>

      <nav class="nav" :class="{ open: menuOpen }">
        <router-link to="/" class="nav-icon" title="Inicio">
          <!-- Ícono SVG de casa -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
               class="bi bi-house-fill" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646
                     6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0
                     0-.5.5v1.293z" />
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5
                     1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
          </svg>
           <span class="nav-text">Home</span>
        </router-link>

    
        <router-link to="/login">
          <button class="cta">Login</button>
        </router-link>
      </nav>

      <div class="hamburger" @click="toggleMenu">☰</div>
    </div>
  </header>
</template>


<script setu


<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

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
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: auto;
}
.logo {
  font-weight: bold;
  font-size: 1.5rem;
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

/* Responsive */
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
  gap: 0.4rem; /* espacio entre ícono y texto */
  color: #333;
  text-decoration: none;
}

.nav-icon:hover {
  color: #ff4d4d;
}

.nav-icon svg {
  transition: transform 0.2s ease;
}

.nav-icon:hover svg {
  transform: scale(1.1);
}

.nav-text {
  font-weight: 500;
  font-size: 0.95rem;
}

}
</style>
