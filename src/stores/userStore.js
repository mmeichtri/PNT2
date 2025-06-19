// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [],
    loggedUser: JSON.parse(localStorage.getItem('loggedUser')) || null
  }),

  getters: {
    entrenadores: (state) => state.users.filter(u => u.rol === 'entrenador'),

    alumnosDe: (state) => {
      return (emailEntrenador) =>
        state.users.filter(u => u.entrenadorAsignado === emailEntrenador)
    }
  },

  actions: {
    login(user) {
      this.loggedUser = user

      const i = this.users.findIndex(u => u.email === user.email)
      if (i === -1) {
        this.users.push(user)
      } else {
        this.users[i] = user
      }

      localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser))
      localStorage.setItem('users', JSON.stringify(this.users))
    },

    logout() {
      this.loggedUser = null
      localStorage.removeItem('loggedUser')
    },

    asignarEntrenadorACliente(emailCliente, emailEntrenador) {
      const cliente = this.users.find(u => u.email === emailCliente)
      if (cliente) {
        cliente.entrenadorAsignado = emailEntrenador
        this.login(cliente)
      }
    },

    loadUserFromStorage() {
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || null
      this.users = JSON.parse(localStorage.getItem('users')) || []
    }
  }
})
