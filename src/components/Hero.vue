<script setup>
import Nav from './Nav.vue'
</script>

<template>
  <div class="hero-wrapper">
    <Nav />
    <router-view />
  </div>
</template>

<style scoped>
.hero-wrapper {
  width: 100%;
  min-height: 100vh;
}
</style>
