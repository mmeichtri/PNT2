<script setup>
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <div>
    <h2>Lista de Entrenadores</h2>
    <ul>
      <li v-for="entrenador in userStore.entrenadores" :key="entrenador.email">
        {{ entrenador.nombre }}
      </li>
    </ul>
  </div>
</template>
