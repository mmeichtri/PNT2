<template>
  <div class="hero-full">
    <div class="hero-content">
      <h1>
  Bienvenido a <span class="brand-name">FitLife</span>
</h1>
      <p>Tu plataforma para alcanzar tus metas de fitness.</p>
      <router-link to="/login" class="cta-button">Empieza ahora</router-link>
    </div>
  </div>

  <section class="promo">
    <h2>🏷️ ¡Descuento especial para grupos familiares!</h2>
    <p>Entrena junto a tus seres queridos con <strong>30% de descuento</strong>.</p>
    <router-link to="/login" class="cta-promo">Aprovechar promoción</router-link>
  </section>
</template>

<style scoped>
.hero-full {
  background-image: url('https://plus.unsplash.com/premium_photo-1663088651100-85eac75d894a?q=80&w=2096&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh; /* Usa toda la pantalla */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-full::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); /* oscurece fondo */
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  color: #fff;
  text-align: center;
  padding: 2rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.hero-content span {
  color: #ff4d4d;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-button {
  padding: 0.75rem 1.5rem;
  background-color: #ff4d4d;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.cta-button:hover {
  background-color: #e03a3a;
}

.promo {
  background-color: #fff5f5;
  text-align: center;
  padding: 3rem 1rem;
}

.promo h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.promo p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.cta-promo {
  padding: 0.75rem 1.5rem;
  background-color: #ff4d4d;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.cta-promo:hover {
  background-color: #e03a3a;
}
.brand-name {
  font-size: 5rem;          /* mucho más grande que el texto anterior */
  color: #ff4d4d;
  font-weight: bold;
  display: block;           /* opcional: lo pone en línea separada */
  margin-top: 0.5rem;
}

</style>
