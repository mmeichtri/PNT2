<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
</script>

<template>
  <Header />
  <main>
    <router-view />
  </main>

  <Sidebar />
</template>
