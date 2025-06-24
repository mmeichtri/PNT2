<template>
  <div>
    <h1>Detalle del Alumno</h1>
    <ProgresoAlumno :alumno="alumno" />
    
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { computed } from 'vue'
import ProgresoAlumno from '../components/ProgresoAlu.vue'

const userStore = useUserStore()
const alumno = computed(() => userStore.loggedUser)

</script>
