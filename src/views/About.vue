<template>
  <div class="page no-scroll-page px-4 pt-5">
    <AppNavbar />

    <div class="container mt-5 text-center position-relative">
      <div class="emoji-decor"></div>

      <h1 class="zagolovok mb-5 text-center w-100">О ПРОЕКТЕ</h1>
      <p class="opisanie mb-5">
        Mixerr — это многопользовательская игра, в которой эмоции важнее слов! 🎮<br />
        Наша цель — объединять людей через язык эмодзи и весёлые переводы.
      </p>

      <form @submit.prevent="submitForm" class="form-block mx-auto">
        <h2 class="form-title">Оставь отзыв или идею</h2>

        <div class="mb-3 text-start">
          <label for="name" class="form-label">Имя:</label>
          <input type="text" id="name" v-model="form.name" required class="form-control pixel-input" />
        </div>

        <div class="mb-3 text-start">
          <label for="message" class="form-label">Сообщение:</label>
          <textarea id="message" v-model="form.message" rows="4" required class="form-control pixel-input"></textarea>
        </div>

        <button type="submit" class="btn-mixerr">отправить</button>
      </form>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AboutPage' })
import { reactive } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import '@/assets/mixerr.css'

const form = reactive({
  name: '',
  message: ''
})

function submitForm() {
  alert(`Спасибо, ${form.name}! Мы получили ваше сообщение: "${form.message}"`)
  form.name = ''
  form.message = ''
}
</script>

<style scoped>
.no-scroll-page {
  height: 100vh;
  overflow: hidden;
}

.zagolovok {
  font-family: 'Press Start 2P', monospace;
  color: var(--svet);
  font-size: 22px;
}

.opisanie {
  font-family: 'Press Start 2P', monospace;
  font-size: 13px;
  color: var(--muted);
}

.form-block {
  max-width: 600px;
  font-family: 'Press Start 2P', monospace;
  position: relative;
  z-index: 1;
}

.form-title {
  color: var(--svet);
  font-size: 16px;
  margin-bottom: 20px;
}

.pixel-input {
  background-color: var(--fon);
  color: var(--svet);
  border: 2px solid var(--akcent);
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  padding: 10px;
  border-radius: 12px;
  resize: none;
}

.pixel-input:focus {
  outline: none;
  box-shadow: 0 0 4px var(--akcent);
}

.emoji-decor {
  position: absolute;
  top: -30px;
  left: -300px;
  width: 800px;
  height: 800px;
  background-image: url('@/assets/img/pers4.png');
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;
}
</style>
