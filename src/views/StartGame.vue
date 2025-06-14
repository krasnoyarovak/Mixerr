<template>
  <div class="page">
    <AppNavbar />

    <div class="d-flex flex-row">
      <!-- левая панель -->
      <div class="sidebar d-flex flex-column align-items-center px-4 pt-4">
        <h2 class="room-code-label">КОД КОМНАТЫ</h2>
        <div class="avatars-list mt-4">
          <!-- перебираются игроки и активный подсвечивается -->
          <div
            v-for="(user, i) in users"
            :key="i"
            class="avatar-block mb-3"
            :class="{
              'active-user':
                (!showGuessInput && i === activeUserIndex) ||
                (showGuessInput && i === currentUserIndex)
            }"
          >
            <img :src="user.avatar" alt="avatar" class="avatar-img" />
            <p class="avatar-name">{{ user.name }}</p>
          </div>
        </div>
      </div>

      <!-- правая часть -->
      <div class="main-area flex-grow-1 d-flex flex-column justify-content-between px-5 pt-4">
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div class="emoji-box w-100 d-flex flex-column justify-content-center align-items-center">
            <!-- если есть эмодзи, то покажет эмодзи, если нет - то текст-заглушку -->
            <h1 class="emoji-output-title text-center">{{ emojis || 'Переводим вашу фразу...' }}</h1>
            <!-- Условный блок: появляется только тогда, когда пора угадывать -->
            <div v-if="showGuessInput" class="guess-block mt-4">
              <h4 class="mb-2">Угадай фразу:</h4>
              <form @submit.prevent="submitGuess" class="d-flex gap-2">
                <!-- сохраняем в currentGuess то, что ввел пользователь -->
                <input v-model="currentGuess" class="form-control" placeholder="Ваш вариант..." />
                <button class="btn-mixerr">УГАДАТЬ</button>
              </form>
            </div>
          </div>
        </div>
        <!-- форма показывается, когда надо загадывать фразу -->
        <form
          v-if="!showGuessInput"
          @submit.prevent="submitPhrase"
          class="chat-input-block d-flex align-items-center gap-2 mb-4"
        >
          <textarea
            v-model="phrase"
            placeholder="Напиши фразу — мы переведем её в эмодзи ✨"
            rows="2"
            class="form-control pixel-input flex-grow-1"
          ></textarea>
          <button type="submit" class="btn-mixerr px-4">ОТПРАВИТЬ</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
import AppNavbar from '@/components/AppNavbar.vue'
import { storeToRefs } from 'pinia'

const game = useGameStore()
const {
  phrase,
  emojis,
  showGuessInput,
  currentGuess,
  activeUserIndex,
  currentUserIndex,
  users
} = storeToRefs(game)
const { submitPhrase, submitGuess } = game
</script>


<style scoped>
.page {
  height: 100vh;
  font-family: 'Press Start 2P', monospace;
  color: var(--svet);
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background-color: var(--fon);
  border-right: 2px dashed var(--akcent);
}

.room-code-label {
  font-size: 20px;
  color: var(--akcent);
}

.avatars-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s;
}

.avatar-img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid var(--akcent);
  image-rendering: pixelated;
  background-color: var(--fon);
  filter: brightness(0.6);
  transition: filter 0.4s ease;
}

.active-user .avatar-img {
  filter: brightness(1.4);
  box-shadow: 0 0 15px 4px var(--akcent);
}

.avatar-name {
  margin-top: 8px;
  font-size: 10px;
  color: var(--muted);
  text-align: center;
}

.emoji-output-title {
  font-size: 48px;
  word-wrap: break-word;
  max-width: 600px;
  color: var(--svet);
  text-align: center;
  margin-top: 60px;
}

.chat-input-block {
  padding: 12px;
  border-top: 2px solid var(--akcent);
}
</style>