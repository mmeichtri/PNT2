<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const usuarioGuardado = ref(null)

onMounted(() => {
  const user = localStorage.getItem('loggedUser')
  if (user) {
    usuarioGuardado.value = JSON.parse(user)
  }
})

</script>

<template>
  <div class="navClass">
    <nav class="navTest">
      <RouterLink class="navLink" to="/home">Home</RouterLink>

      <template v-if="usuarioGuardado">
        <span class="navLink">Hola, {{ usuarioGuardado.name }}</span>
      </template>
      <template v-else>
        <RouterLink class="navLink" to="/login">Login</RouterLink>
      </template>
    </nav>
  </div>
</template>
