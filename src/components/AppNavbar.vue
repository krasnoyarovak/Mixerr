<template>
  <header class="fixed-top d-flex justify-content-between align-items-center px-5 py-4 bg-mixerr w-100">
    <router-link to="/" class="logo-link">
      <div class="logo-text">
        <div>MI</div>
        <div>XERR</div>
      </div>
    </router-link>
    <nav class="d-flex gap-4 align-items-center">
      <navbar-link href="/about">О нас</navbar-link>
      <navbar-link href="/rules" :filled="true">Правила</navbar-link>
    </nav>
  </header>
</template>

<script setup>
import navbarLink from './NavbarLink.vue'
</script>

<style scoped>
.logo-link {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.logo-text {
  font-family: 'Press Start 2P', monospace;
  font-size: 15px;
  line-height: 1;
  color: var(--svet);
  text-align: left;
}
</style>
