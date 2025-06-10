<template>
  <div class="page">
    <AppNavbar />

    <div class="d-flex flex-row">
      <!-- левая панель -->
      <div class="sidebar d-flex flex-column align-items-center px-4 pt-4">
        <h2 class="room-code-label">КОД КОМНАТЫ</h2>
        <div class="avatars-list mt-4">
          <div
            v-for="(user, i) in users"
            :key="i"
            class="avatar-block mb-3"
            :class="{ 'active-user': i === currentUserIndex }"
          >
            <img :src="user.avatar" alt="avatar" class="avatar-img" />
            <p class="avatar-name">{{ user.name }}</p>
          </div>
        </div>
      </div>

      <!-- правая часть -->
      <div class="main-area flex-grow-1 d-flex flex-column justify-content-between px-5 pt-4">
        <div class="d-flex justify-content-between align-items-start mb-4">
          <div class="emoji-box w-100 d-flex justify-content-center align-items-center">
            <h1 class="emoji-output-title text-center">{{ emojis || 'Переводим вашу фразу...' }}</h1>
          </div>
        </div>

        <form @submit.prevent="submitPhrase" class="chat-input-block d-flex align-items-center gap-2 mb-4">
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
import { ref } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'

const phrase = ref('')
const emojis = ref('')
const currentUserIndex = ref(0)

const users = [
  { name: 'Игрок 1', avatar: new URL('@/assets/img/smile_laugh.png', import.meta.url).href },
  { name: 'Игрок 2', avatar: new URL('@/assets/img/smile_think.png', import.meta.url).href },
  { name: 'Игрок 3', avatar: new URL('@/assets/img/smile_win.png', import.meta.url).href }
]

async function submitPhrase() {
  emojis.value = ''

  const prompt = `
Ты — Emoji MixBot, AI-система, которая переводит фразы на язык эмодзи. Твоя задача — точно и коротко передавать смысл только с помощью эмодзи.

📌 Требования:
- ❌ Не используй текст, символы, кавычки, переводы строк или пояснения.
- ✅ Используй только эмодзи.
- ⛔ Ответ не должен содержать никаких служебных или вспомогательных слов.
- 🔁 Ответ всегда должен быть одной строкой.

📎 Примеры:
"я люблю пиццу" → 🍕❤️
"работаю ночью" → 💻🌙🧠
"еду в отпуск" → ✈️🏖️😎
"собака лает" → 🐶🔊

🔤 Входная фраза: "${phrase.value}"
🔁 Эмодзи:`

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'X-Title': 'mixerr',
        'HTTP-Referer': 'http://localhost:5173'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    emojis.value = data.choices?.[0]?.message?.content.trim() || ''
    phrase.value = ''

    // анимация перехода на следующего игрока
    currentUserIndex.value = (currentUserIndex.value + 1) % users.length
  } catch (err) {
    emojis.value = '⚠️ Ошибка перевода'
    console.error('Ошибка API:', err)
  }
}
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
  width: 80px;
  height: 80px;
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
