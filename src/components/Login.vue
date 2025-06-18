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

label{
    margin-bottom: .5em;
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
              <button class="register-link" @click="registro">Registrarse</button>
          </div>
        </form>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

      if (!usuarioGuardado) {
        alert("No hay usuario registrado.");
        return;
      }

      if (
        usuarioGuardado.email === this.email &&
        usuarioGuardado.password === this.password
      ) {
        if (usuarioGuardado.rol === 'admin') {
          this.$router.push('/user');
        } else {
          this.$router.push('/routines');
        }
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    },

    registro() {
      this.$router.push('/register');
    }
  }
};
</script>
