<template>
  <router-link
    :to="{ name: 'AlumnoDetalle', params: { id: alumno.id } }"
    class="block rounded-xl shadow-lg bg-white hover:shadow-xl transition p-4"
  >
    <header class="flex items-center gap-4 mb-4">
      <img
        :src="alumno.foto || 'https://i.pravatar.cc/80?u=' + alumno.id"
        alt=""
        class="w-16 h-16 rounded-full object-cover"
      />
      <h2 class="text-xl font-semibold">{{ alumno.nombre }}</h2>
    </header>

    <ul class="text-sm text-gray-600 space-y-1">
      <li><strong>Edad:</strong> {{ alumno.edad }} años</li>
      <li><strong>Objetivo:</strong> {{ alumno.objetivo }}</li>
      <li><strong>Progreso:</strong> {{ alumno.progresoGlobal }} %</li>
    </ul>
  </router-link>
</template>

<script setup>
defineProps({
  alumno: {
    type: Object,
    required: true
  }
})
</script>
