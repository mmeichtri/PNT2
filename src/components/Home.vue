<template>
  <div class="hero-full">
    <div class="hero-content">
      <router-link
        v-if="!userStore.loggedUser"
        to="/login"
        class="cta-button"
      >Empieza ahora</router-link>
    </div>

    <!-- SOLO PARA CLIENTES SIN ENTRENADOR -->
    <div
      v-if="isCliente && !userStore.loggedUser?.entrenadorAsignado"
      class="seleccion-entrenador-card"
    >
      <h3>💪 Seleccioná tu entrenador</h3>
      <p>Conectate con un profesional que te acompañe en tu proceso.</p>
      <button class="btn-elegir" @click="irASeleccionEntrenador">Elegir entrenador</button>
    </div>

    <!-- SOLO PARA CLIENTES CON ENTRENADOR ASIGNADO -->
    <div
      v-if="isCliente && userStore.loggedUser?.entrenadorAsignado"
      class="entrenador-asignado-card"
    >
      <p>¡Ya tienes un entrenador asignado! Si quieres cambiarlo, contacta al soporte.</p>
    </div>
    </div>


  <section class="promo">
    <h2>🏷️ ¡Descuento especial para grupos familiares!</h2>
    <p>Entrena junto a tus seres queridos con <strong>30% de descuento</strong>.</p>
    <router-link to="/login" class="cta-promo">Aprovechar promoción</router-link>
  </section>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const isCliente = computed(() => userStore.loggedUser?.rol === 'cliente')

function irASeleccionEntrenador() {
  router.push('/seleccionarEntrenador')
}
</script>


<style scoped>
.hero-full {
  background-image: url('https://st4.depositphotos.com/12985848/21976/i/450/depositphotos_219769856-stock-photo-athletic-sportsman-sportswoman-exercising-cube.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-full::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  color: #fff;
  text-align: center;
  padding: 2rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.hero-content span {
  color: #ff4d4d;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-button {
  padding: 0.75rem 1.5rem;
  background-color: #ff4d4d;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.cta-button:hover {
  background-color: #e03a3a;
}

.seleccion-entrenador-card {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  color: #333;
  z-index: 2;
  max-width: 300px;
  text-align: left;
}

.btn-elegir {
  background-color: #ff4d4d;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-elegir:hover {
  background-color: #e03a3a;
}

.promo {
  background-color: #fff5f5;
  text-align: center;
  padding: 3rem 1rem;
}

.promo h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.promo p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.cta-promo {
  padding: 0.75rem 1.5rem;
  background-color: #ff4d4d;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.cta-promo:hover {
  background-color: #e03a3a;
}

.brand-name {
  font-size: 5rem;
  color: #ff4d4d;
  font-weight: bold;
  display: block;
  margin-top: 0.5rem;
}
</style>
