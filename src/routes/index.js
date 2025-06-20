import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Routines from '../components/Routines.vue'
import Login from '../components/Login.vue'
import Clients from '../components/Clients.vue'
import Register from '../components/Register.vue'
import Result from '../components/Result.vue'
import User from '../components/User.vue'
import AlumnosView from '../components/AlumnosView.vue'
import AlumnoDetalleView from '../components/AlumnoDetalleView.vue'
import App from '../App.vue'
import MiPerfil from '../components/MiPerfil.vue'
import Admin from '../components/Admin.vue'
import SeleccionarEntrenador from '../components/SeleccionarEntrenador.vue'
import AsignarRutina from '../components/AsignarRutina.vue'

const routes = [
    { path: '/', name: 'Home', component: Home},
   // { path: '/home', name: 'Home', component: Home},
    { path: '/login', name: 'login', component: Login},
    { path: '/register', name: 'Register', component: Register},
    { path: '/routines', name: 'Routines', component: Routines},
    { path: '/clients', name: 'Clients', component: Clients},
    { path: '/results', name: 'Result', component: Result},
    { path: '/user', name: 'User', component: User},
    {path: '/miPerfil',  name: 'MiPerfil',component: MiPerfil },
    {path: '/admin',  name: 'Admin',component: Admin },
    { path: '/alumnos', name: 'Alumnos', component: AlumnosView },
    {path: '/alumno/:email',name: 'AlumnoDetalleView',component: AlumnoDetalleView},
    {path: '/seleccionarEntrenador', name: 'SeleccionarEntrenador', component: SeleccionarEntrenador},
    {path: '/asignarRutina/:email', name: 'AsignarRutina', component: AsignarRutina}
]

const router = createRouter({ 
    history: createWebHistory(),
    routes,
 })

 export default router;