<template>
  <div class="page no-scroll-page px-4 pt-5">
    <AppNavbar />

    <div class="room-container d-flex flex-column align-items-center justify-content-center text-center">
      <div class="emoji-decor-room"></div>

      <h1 class="room-title mb-3">КОД КОМНАТЫ</h1>
      <div class="room-code-display mb-5">{{ roomCode }}</div>

      <div class="players-list px-4 py-4 mb-4">
        <h2 class="sub-title mb-3">ИГРОКИ ({{ players.length }}):</h2>

        <div class="row justify-content-center">
          <div
            v-for="(player) in players"
            :key="player.name"
            class="col-6 col-md-4 col-lg-3 mb-4 player-card d-flex flex-column align-items-center"
          >
            <img :src="player.avatar" class="player-avatar mb-2" alt="avatar" />
            <div class="player-name">{{ player.name }}</div>
          </div>
        </div>
      </div>

      <div v-if="players.length < 3" class="waiting-message">
        Ожидание других игроков...
      </div>

      <button class="btn-mixerr mt-3" :disabled="players.length < 3" @click="startGame">
        НАЧАТЬ ИГРУ
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'

const router = useRouter()
const roomCode = 'ABC12'
const players = ref([
  { name: 'Игрок1', avatar: new URL('@/assets/img/smile_think.png', import.meta.url).href },
  { name: 'Игрок2', avatar: new URL('@/assets/img/smile_laugh.png', import.meta.url).href },
  { name: 'Игрок3', avatar: new URL('@/assets/img/smile_win.png', import.meta.url).href }
])

function startGame() {
  router.push('/startgame')
}
</script>

<style scoped>
.no-scroll-page {
  height: 100vh;
  overflow: hidden;
}

.room-container {
  position: relative;
  min-height: calc(100vh - 100px);
  font-family: 'Press Start 2P', monospace;
  color: var(--svet);
  z-index: 1;
}

.room-title {
  font-size: 22px;
  color: var(--akcent);
}

.room-code-display {
  font-size: 28px;
  background-color: var(--fon);
  border: 3px dashed var(--akcent);
  padding: 20px 40px;
  border-radius: 16px;
  display: inline-block;
  color: var(--svet);
}

.players-list {
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--akcent);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
}

.sub-title {
  font-size: 18px;
  color: var(--svet);
  text-transform: uppercase;
}

.player-card {
  animation: fadeIn 0.5s ease forwards;
}

.player-avatar {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  border: 2px solid var(--akcent);
  image-rendering: pixelated;
  object-fit: cover;
  background-color: var(--fon);
}

.player-name {
  font-size: 12px;
  margin-top: 4px;
  color: var(--muted);
}

.waiting-message {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 16px;
}

/* анимация */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.emoji-decor-room {
  position: absolute;
  top: -20px;
  right: -280px;
  width: 700px;
  height: 700px;
  background-image: url('@/assets/img/pers2.png');
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  opacity: 0.2;
  z-index: 0;
  pointer-events: none;
}
</style>

<style scoped src="@/assets/mixerr.css"></style>
