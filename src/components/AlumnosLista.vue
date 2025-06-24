<script setup>
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <div class="alumnos-container">
    <div class="card">
      <h2 class="titulo">Alumnos registrados</h2>
      <ul class="lista">
        <li
          v-for="alumno in userStore.alumnos"
          :key="alumno.email"
          class="item"
        >
          {{ alumno.nombre }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.alumnos-container {
  min-height: 100vh;
  background-color: #222;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background-color: #111;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
  border: 1px solid #444;
}

.titulo {
  color: #bfff00;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 5px #bfff00;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  background-color: #444;
  color: #ddd;
  padding: 0.8rem;
  border-radius: 8px;
  text-align: center;
  transition: background 0.3s;
  cursor: pointer;
}

.item:hover {
  background-color: #555;
}
</style>
