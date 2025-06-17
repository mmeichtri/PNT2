import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([])

  function addUser(user) {
    users.value.push(user)
  }

  const loggedUser = ref(null)

  function login(user) {
    loggedUser.value = user
  }

  function logout() {
    loggedUser.value = null
  }

  const isLoggedIn = computed(() => loggedUser.value !== null)

  return { users, addUser, loggedUser, login, logout, isLoggedIn }
})
