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
      this.lista = data
    },
    async fetchDetalle (id) {
      if (this.detalle[id]) return
      const { data } = await axios.get(`/alumnos/${id}`)
      this.detalle[id] = data
    }
  }
})
