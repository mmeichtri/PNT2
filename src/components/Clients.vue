<template>
  <div class="layout">
  <div class="user-view"> <div class="top-bar">
      <h1>
        Bienvenido<span class="user-name" v-if="userStore.loggedUser?.nombre">, {{ userStore.loggedUser.nombre}}</span> 👋
      </h1>
     <p class="next-routine">{{ timeLeft }}</p>
    </div>
    <div class="dashboard">
    
      <div class="calendar">
        <h2>Tu calendario</h2>
        <vue-cal style="height: 400px;" />
      </div>

      <div class="summary">
        <h2>Resumen</h2>
        <ul>
          <li><strong>Rutinas activas:</strong>  {{ rutinasActivas }} </li>
          <li><strong>Resultados recientes:</strong> 2 mejoras</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'


const userStore = useUserStore()
const router = useRouter()

//CAMBIAR ESTO PARA QUE LAS RUTINAS VENGAN DE PINIA
/*
const events = ref([
  { start: new Date('2025-06-25T10:00:00'), title: 'Rutina 1' },
  { start: new Date('2025-06-28T18:00:00'), title: 'Rutina 2' },
])

const rutinasActivas = computed(() =>
  rutinas.value.length
)

const now = ref(new Date())

const nextEvent = computed(() => {
  const upcoming = events.value
    .filter(e => new Date(e.start) > now.value)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
  return upcoming.length > 0 ? upcoming[0] : null
})

const timeLeft = computed(() => {
  if (!nextEvent.value) return 'No hay próximas rutinas programadas.'

  const diffMs = new Date(nextEvent.value.start) - now.value
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60)

  let str = 'Proxima rutina: '
  if (diffDays > 0) str += `${diffDays} día${diffDays > 1 ? 's' : ''} `
  if (diffHours > 0) str += `${diffHours} hora${diffHours > 1 ? 's' : ''} `
  if (diffMinutes > 0) str += `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} `
  str += `(${nextEvent.value.title}).`

  return str
})
*/

</script>

<style scoped>
.user-view {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #888686;
}

.top-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}


h1 {
   font-size: 2.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}


.user-name {
  font-size: 1.8rem; 
  font-weight: 700; 
  color: #ae0101e1; 
  margin-left: 0.5rem;
}

.dashboard {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}


.calendar, .summary {
  flex: 1 1 300px;
  background: #e0d3d3;
   color: #ae0101e1; 
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(5, 5, 5, 0.934);
}


.summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary li {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #444;
}
.next-routine {
  font-size: 1.5rem;
  margin-top: 0.5rem;
  color: #fff;
  text-align: left;  
}
</style>
