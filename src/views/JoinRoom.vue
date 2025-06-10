<template>
  <div class="page px-4 pt-5">
    <AppNavbar />
    <div class="create-room-layout" style="justify-content: flex-start;">
      <!-- левая часть -->
      <div class="left-side d-flex flex-column justify-content-center align-items-start ps-5" style="margin-left: 80px;">
        <label class="avatar-label"></label>
        <div class="avatar-block d-flex flex-column align-items-center">
          <div class="avatar-wrapper mb-3">
            <img :src="avatarToShow" alt="avatar" class="avatar-img" />
          </div>
          <input type="file" accept="image/*" @change="handleAvatarUpload" class="custom-file pixel-input" />
        </div>
      </div>

<!-- правая часть -->
      <div class="right-side d-flex flex-column justify-content-center align-items-start" style="padding: 0 60px;">
        <form @submit.prevent="joinRoom" class="form-fixed-block">
          <h1 class="zagolovok mb-5 text-center w-100">ПРИСОЕДИНИТЬСЯ</h1>

          <label for="username" class="form-label">Имя игрока:</label>
          <input type="text" id="username" v-model="name" class="form-control pixel-input mb-5" required />

          <label for="roomInput" class="form-label">Код комнаты:</label>
          <input type="text" id="roomInput" v-model="roomInput" class="form-control pixel-input mb-5 text-uppercase" required />

          <div class="d-flex justify-content-center w-100 mt-4">
            <button type="submit" class="btn-mixerr btn-start btn-wide" @click="submitRoom">НАЧАТЬ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'

const router = useRouter()

const defaultAvatar = new URL('@/assets/img/smile_think.png', import.meta.url).href
const name = ref('')
const avatar = ref('')

function handleAvatarUpload(e) {
  const file = e.target.files[0]
  if (file) avatar.value = URL.createObjectURL(file)
}

function submitRoom() {
  // можно сохранить имя и аватар в хранилище или Pinia при необходимости
  router.push('/room')
}

const avatarToShow = computed(() => avatar.value || defaultAvatar)
</script>

<style scoped>
.create-room-layout {
  display: flex;
  height: calc(100vh - 100px);
}

.left-side,
.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.avatar-label {
  font-size: 24px;
  margin-bottom: 30px;
  font-family: 'Press Start 2P', monospace;
  color: var(--svet);
}

.avatar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  border: 2px solid var(--akcent);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.avatar-img {
  width: 320px;
  height: 320px;
  object-fit: cover;
  image-rendering: pixelated;
  background-color: var(--fon);
}

.custom-file {
  font-size: 16px;
  color: var(--fon);
  background: var(--svet);
  padding: 16px;
  border-radius: 12px;
  border: 2px solid var(--akcent);
  font-family: 'Press Start 2P', monospace;
  width: 100%;
  max-width: 320px;
}

.form-fixed-block {
  max-width: 640px;
  width: 100%;
  font-family: 'Press Start 2P', monospace;
}

.zagolovok {
  font-size: 34px;
  color: var(--svet);
}

.pixel-input {
  background-color: var(--fon);
  color: var(--svet);
  border: 2px solid var(--akcent);
  font-family: 'Press Start 2P', monospace;
  font-size: 20px;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
}

.pixel-input:focus {
  outline: none;
  box-shadow: 0 0 4px var(--akcent);
}

.room-code {
  font-size: 18px;
  color: var(--muted);
  font-family: 'Press Start 2P', monospace;
}

.btn-wide {
  padding: 16px 80px;
  font-size: 18px;
}
</style>

<style scoped src="@/assets/mixerr.css"></style>
