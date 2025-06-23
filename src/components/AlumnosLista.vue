<script setup>
import { useUserStore } from '../stores/userStore' // o la ruta correcta

const userStore = useUserStore()
</script>

<template>
  <div>
    <h2>Lista de Alumnos</h2>
    <ul>
      <li v-for="alumno in userStore.alumnos" :key="alumno.email">
        {{ alumno.nombre }}
      </li>
    </ul>
  </div>
</template>

