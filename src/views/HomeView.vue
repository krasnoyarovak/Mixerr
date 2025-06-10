<template>
  <div class="page">
    <AppNavbar />

    <main class="main-blok">
      <div class="logo-blok">
        <h1 class="logo-tekst">MI<br />XERR</h1>
        <div class="pers-anima"></div>
      </div>

      <div class="knopki-blok">
        <router-link
          to="/create"
          class="btn-mixerr d-block w-100 text-decoration-none text-uppercase text-center"
        >
          создать комнату
        </router-link>

        <router-link
          to="/join"
          class="btn-mixerr-light d-block w-100 text-decoration-none text-uppercase text-center"
        >
          присоединиться
        </router-link>
      </div>

      <div class="cursor-anim"></div>
    </main>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'

defineOptions({
  name: 'HomeView'
})
</script>

<style scoped>
.cursor-anim {
  position: absolute;
  bottom: 120px;
  left: 39%;
  transform: translateX(-165px);
  width: 100px;
  height: 100px;
  background-image: url('@/assets/img/kursor.png');
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
  animation: cursor-bounce 1s infinite;
  z-index: 7;
}

@keyframes cursor-bounce {
  0%, 100% {
    transform: translateX(-165px) translateY(0);
  }
  50% {
    transform: translateX(-165px) translateY(-6px);
  }
}
</style>

<style scoped src="@/assets/mixerr.css"></style>
