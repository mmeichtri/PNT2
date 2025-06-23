import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [],
    loggedUser: JSON.parse(localStorage.getItem('loggedUser')) || null
  }),

  getters: {
    entrenadores: (state) => state.users.filter(u => u.rol === 'entrenador'),
alumnos: (state) => state.users.filter(u => u.rol === 'cliente'),
    alumnosDe: (state) => (emailEntrenador) =>
      state.users.filter(u => u.entrenadorAsignado === emailEntrenador),
    entrenadorConMasAlumnos: (state) => {
  const conteo = {}
  for (const u of state.users) {
    if (u.entrenadorAsignado) {
      conteo[u.entrenadorAsignado] = (conteo[u.entrenadorAsignado] || 0) + 1
    }
  }
  const [email, cantidad] = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0] || []
  return state.users.find(u => u.email === email) || null
},

alumnoConMasRutinas: (state) => {
  return state.users
    .filter(u => u.rol === 'cliente')
    .sort((a, b) => (b.rutinasHechas || 0) - (a.rutinasHechas || 0))[0] || null
},

entrenadorConMasClientesActivos: (state) => {
  const rutinasPorEntrenador = {}
  for (const u of state.users) {
    if (u.rol === 'cliente' && u.entrenadorAsignado && (u.rutinasHechas || 0) > 0) {
      rutinasPorEntrenador[u.entrenadorAsignado] = (rutinasPorEntrenador[u.entrenadorAsignado] || 0) + 1
    }
  }
  const [email, cantidad] = Object.entries(rutinasPorEntrenador).sort((a, b) => b[1] - a[1])[0] || []
  return state.users.find(u => u.email === email) || null
}

  },

  actions: {
    addUser(nuevoUsuario) {
      const existe = this.users.some(u => u.email === nuevoUsuario.email)
      if (existe) {
        throw new Error('Ya existe un usuario registrado con ese email')
      }

      this.users.push({
        ...nuevoUsuario,
        entrenadorAsignado: null,
        rutinasHechas: 0 ,  
        rutinas: []  
      })

      this._guardarLocalStorage()

      return true                      
    },

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
    },
    sumarRutinaHecha(emailCliente) {
  const i = this.users.findIndex(u => u.email === emailCliente)
  if (i !== -1 && this.users[i].rol === 'cliente') {
    this.users[i].rutinasHechas = (this.users[i].rutinasHechas || 0) + 1
    this._guardarLocalStorage()
  }
}
  }
})
