<template>
  <div class="layout">
  <div class="user-view"> <div class="top-bar">
      <h1>
        Bienvenido<span class="user-name" v-if="userStore.loggedUser?.nombre">, {{ userStore.loggedUser.nombre}}</span> 👋
      </h1>
     
    </div>
    <div class="dashboard">
    
      <div class="calendar">
        <h2>Tu calendario</h2>
        <vue-cal style="height: 400px;" />
      </div>

      <div class="summary">
        <h2>Resumen</h2>
        <ul>
          <li><strong>Rutinas activas:</strong> 3</li>
          <li><strong>Resultados recientes:</strong> 2 mejoras</li>
          <li><strong>Próxima cita:</strong> 20 de junio, 10:00 AM</li>
        </ul>
      </div>
    </div>
    </div>
      <Sidebar />
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import Sidebar from '../components/Sidebar.vue'


const userStore = useUserStore()
const router = useRouter()

</script>

<style scoped>
.user-view {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #888686;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
</style>
