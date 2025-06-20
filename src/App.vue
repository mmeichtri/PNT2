<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import { useUserStore } from './stores/userStore'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { onMounted } from 'vue'


const userStore = useUserStore()

const route = useRoute()
const showSidebar = computed(() => !!userStore.loggedUser)
onMounted(() => {
  userStore.loadUserFromStorage()
})

</script>

<template>
  <div id="app">
    <Header />

    <div class="layout">
      <Sidebar v-if="showSidebar" />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

