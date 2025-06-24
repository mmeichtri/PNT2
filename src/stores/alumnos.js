import { defineStore } from 'pinia'
import axios from 'axios'

export const useAlumnosStore = defineStore('alumnos', {
  state: () => ({
    lista: [],
    detalle: {}
  }),
  actions: {
 async fetchAlumnos () {
  if (this.lista.length) return
  const { data } = await axios.get('/alumnos')
  console.log('Datos del backend:', data) // ← esto te va a ayudar
  this.lista = data.map(a => ({
    ...a,
    rutina: [],
    entrenadorAsignado: null
  }))
}
,
    async fetchDetalle (id) {
      if (this.detalle[id]) return
      const { data } = await axios.get(`/alumnos/${id}`)
      this.detalle[id] = data
    }
  }
})
