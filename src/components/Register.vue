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

.form-row label {
  justify-self: end;
  color: var(--color-text-light);
}

.form-row input {
  justify-self: center;
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


<template>
  <div class="registerPage">
    <h1 class="title">Registro</h1>
    <div class="registerContainer">
      <form @submit.prevent="registro">
        <div class="form-row">
          <input v-model="nombre" id="Nombre" type="text" placeholder="Nombre" />
          <span v-if="!nombre && submitted" class="error">*</span>
        </div>
        <div class="form-row">
          <input v-model="apellido" id="Apellido" type="text" placeholder="Apellido" />
          <span v-if="!apellido && submitted" class="error">*</span>
        </div>
        <div class="form-row">
          <input id="Email" v-model="email" type="email" placeholder="Correo" />
          <span v-if="(!email || !checkEmail) && submitted" class="error">*</span>
        </div>
        <div class="form-row">
          <input v-model="password" id="Password" type="password" placeholder="Contraseña" />
          <span v-if="submitted && !checkEmail" class="error">*</span>
        </div>
        <div class="form-row">
          <select v-model="rol" id="Rol">
            <option disabled value="">Seleccioná un rol</option>
            <option value="cliente">Cliente</option>
            <option value="entrenador">Entrenador</option>
          </select>
          <span v-if="!rol && submitted" class="error">*</span>
        </div>
        
        <div class="form-actions">
          <button class="btn-register" type="submit">Registrarse</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import { useUserStore } from '../stores/userStore'

export default {
  data() {
    return {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      rol: '',
      submitted: false
    };
  },
  computed: {
    checkEmail() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(this.email);
    }
  },
  methods: {
    registro() {
      this.submitted = true;
      if (!this.nombre || !this.apellido || !this.email || !this.password || !this.rol) {
        alert("Completar los datos faltantes!");
        return;
      }
      if (!this.checkEmail) {
        alert("El email no es válido!");
        return;
      }

      const userStore = useUserStore();

      const nuevoUsuario = {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        password: this.password,
        rol: this.rol
      };

      userStore.addUser(nuevoUsuario); // Agrega usuario y guarda en localStorage

      alert('Usuario registrado correctamente');
      this.$router.push('/login');
    }
  }
};
</script>
