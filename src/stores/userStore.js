import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const storedUsers = JSON.parse(localStorage.getItem('users')) || []
  const users = ref(storedUsers)

  function addUser(user) {
    const exists = users.value.find(u => u.email === user.email)
    if (!exists) {
      users.value.push(user)
      localStorage.setItem('users', JSON.stringify(users.value))
    } else {
      alert('El usuario ya existe')
    }
  }

  const loggedUser = ref(null)

  function login(user) {
    loggedUser.value = user
    localStorage.setItem('loggedUser', JSON.stringify(user))
  }

  function logout() {
    loggedUser.value = null
    localStorage.removeItem('loggedUser')
  }

  function loadUserFromStorage() {
    const stored = JSON.parse(localStorage.getItem('loggedUser'))
    if (stored) {
      loggedUser.value = stored
    }
  }

  const isLoggedIn = computed(() => loggedUser.value !== null)

  return {
    users,
    addUser,
    loggedUser,
    login,
    logout,
    isLoggedIn,
    loadUserFromStorage, // <- ¡esto es lo que te faltaba!
  }
})
