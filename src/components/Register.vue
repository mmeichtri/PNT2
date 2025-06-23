<template>
  <div class="registerPage">
    <h1 class="title">Registro</h1>

    <div class="registerContainer">
      <form @submit.prevent="registro">
        <div class="form-row">
          <input v-model="nombre" type="text" placeholder="Nombre" />
          <span v-if="submitted && !nombre" class="error">*</span>
        </div>

        <div class="form-row">
          <input v-model="apellido" type="text" placeholder="Apellido" />
          <span v-if="submitted && !apellido" class="error">*</span>
        </div>

        <div class="form-row">
          <input v-model="email" type="email" placeholder="Correo" />
          <span v-if="submitted && (!email || !checkEmail)" class="error">*</span>
        </div>

        <div class="form-row">
          <input v-model="password" type="password" placeholder="Contraseña" />
          <span v-if="submitted && !password" class="error">*</span>
        </div>

        <div class="form-row">
          <select v-model="rol">
            <option disabled value="">Seleccioná un rol</option>
            <option value="cliente">Cliente</option>
            <option value="entrenador">Entrenador</option>
          </select>
          <span v-if="submitted && !rol" class="error">*</span>
        </div>

        <div class="form-actions">
          <button class="btn-register" type="submit">Registrarse</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'


const nombre    = ref('')
const apellido  = ref('')
const email     = ref('')
const password  = ref('')
const rol       = ref('')
const fecha = new Date().toLocaleDateString()
const submitted = ref(false)


const router    = useRouter()
const userStore = useUserStore()


const checkEmail = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.value)
})


function registro () {
  submitted.value = true

  if (!nombre.value || !apellido.value || !email.value || !password.value || !rol.value) {
    alert('Completar los datos faltantes!')
    return
  }

  // Validar formato de email
  if (!checkEmail.value) {
    alert('El email no es válido!')
    return
  }

  // Crear y guardar el nuevo usuario
  const nuevoUsuario = {
    nombre   : nombre.value,
    apellido : apellido.value,
    email    : email.value,
    password : password.value,
    rol      : rol.value,
    fecha: fecha
  }
  userStore.addUser(nuevoUsuario)

  // Avisar y redirigir
  alert('Usuario registrado correctamente')
  router.push('/login')
}
</script>

<style>
.registerPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #222;
  padding-top: 10vh;
}
.registerContainer {
  width: 100%;
  max-width: 500px;
  padding: 2rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
}
span {
  color: var(--color-text-light);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 5px 15px;
  border: 1px solid var(--color-text-light);
  border-radius: 5px;
  align-self: self-end;
  margin-bottom: 4rem;
}
.btn-register {
  width: 200px;
  height: 40px;
  background-color: var(--color-success);
  color: var(--color-text-light);
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 0.5rem;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}
.form-row .error {
  color: #e74c3c;
  font-weight: bold;
  margin-left: 0.5rem;
  font-size: 1.2rem;
}
.form-row select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  justify-self: center;
  color: var(--color-text-light);
  border: 1px solid var(--color-text-light);
}
</style>
