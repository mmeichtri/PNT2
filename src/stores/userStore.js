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

      this._guardarLocalStorage()
    },

    logout() {
      this.loggedUser = null
      localStorage.removeItem('loggedUser')
    },

    asignarEntrenadorACliente(emailCliente, emailEntrenador) {
      const clienteIndex = this.users.findIndex(u => u.email === emailCliente)
      if (clienteIndex !== -1) {
        this.users[clienteIndex].entrenadorAsignado = emailEntrenador

        // Si el cliente asignado es el usuario logueado, actualizo loggedUser también
        if (this.loggedUser?.email === emailCliente) {
          this.loggedUser = { ...this.loggedUser, entrenadorAsignado: emailEntrenador }
        }

        this._guardarLocalStorage()
      }
    },

    loadUserFromStorage() {
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || null
      this.users = JSON.parse(localStorage.getItem('users')) || []
    },

    _guardarLocalStorage() {
      localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser))
      localStorage.setItem('users', JSON.stringify(this.users))
    }
  }
})
