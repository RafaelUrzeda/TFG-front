<script setup lang="ts">
</script>

<template>
  <div class="d-flex">
    <nav class="bg-light p-3 vh-100" style="width: 200px;">
      <h5>Reservas</h5>
      <ul class="nav flex-column">
        <li class="nav-item"><router-link class="nav-link" to="/booking">Nueva Reserva</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/update">Actualizar</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/delete">Eliminar</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/retrieve">Recuperar</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to="/map">Ver Mapa</router-link></li>
      </ul>
    </nav>

    <div class="flex-grow-1 p-4">
      <router-view />
    </div>
  </div>
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
