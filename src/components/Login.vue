
<script setup>
import { ref,} from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'



const email = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()

async function login() {
 const admin = {
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@admin.com',
    password: 'admin123',
    rol: 'admin'
  }

  const lista = JSON.parse(localStorage.getItem('users')) || []
const existeAdmin = lista.find(u => u.email === admin.email)

if (!existeAdmin) {
    lista.push(admin)
    localStorage.setItem('users', JSON.stringify(lista))
  }

  const usuarioGuardado = lista.find(
    u => u.email === email.value && u.password === password.value
  )

  if (!usuarioGuardado) {
    alert("Usuario o contraseña incorrectos.")
    return
  }

  userStore.login(usuarioGuardado)

  if (usuarioGuardado.rol === 'entrenador') {
    router.push('/user')
    } else if (usuarioGuardado.rol === 'admin') {
    router.push('/admin')
  } else {
    alumno = 
    router.push(`/alumno/${usuarioGuardado.email}`)
  }
}

function registro() {
  router.push('/register')
}
</script>

<template>
  <div class="loginPage">
    <h1 class="title">Hola!</h1>
    <p class="subtitle">Nos encanta tenerte por aca</p>
    <div class="loginContainer">
      <div class="form">
        <form class="form-group" @submit.prevent="login">
          <div class="form-group">
            <input v-model="email" type="email" placeholder="Correo" />
          </div>
          <div class="form-group">
            <input v-model="password" type="password" placeholder="Contraseña" />
          </div>
          <div class="form-actions">
            <button class="btn-login" type="submit">Ingresar</button>
            <button class="register-link" @click.prevent="registro">Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>

.title{
    font-size: 5rem;
    font-weight: 700;
    color: var(--color-text-light);
    font-family: var(--font-nunito);
    text-align: center;
}

.subtitle{
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 500;
    color: var(--color-text-light);
    font-family: var(--font-nunito);
    text-align: center;
}

.loginPage {
  width: 100dvw;
  height: 100dvh;
  padding: 2rem;
  background-color: var(--color-background-dark);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 8vh;
}


.loginContainer {
  max-width: 400px;
  padding: 1rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 5px;
  background: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}



.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

input {
    width: 100%; 
    height: 40px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    margin-bottom: 0.5rem;
    color: #000;
}


span{
    color: var(--color-text-light);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 5px 15px;
    border: 1px solid var(--color-text-light);
    border-radius: 5px;
    align-self: self-end;
    margin-bottom: 4rem;
}

.form {
    width: 80%;
    align-self: center;
    font-size: 1.5rem;
    margin-top: 0;     
    padding-top: 0;
}


.btn-login {
    width: 100%;
    height: 50px;
    margin-bottom: 0.5rem;
    background-color: var(--color-success);
    color: var(--color-text-light);
    font-size: 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-weight: 500;
}

:root {
    --color-success: #28a745;
}

.register-link {
    width: 200px;
    height: 50;
    font-size: 1rem;         
    color: #e74c3c; 
    border: 1px solid #e74c3c; 
    border-radius: 5px;
    padding: 6px 12px; 
    cursor: pointer;
    margin: 0;
    font-weight: 500;
}

</style>

