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
            <h1 class="emoji-output-title text-center">{{ emojis || 'Переводим вашу фразу...' }}</h1>

            <div v-if="showGuessInput" class="guess-block mt-4">
              <h4 class="mb-2">Угадай фразу:</h4>
              <form @submit.prevent="submitGuess" class="d-flex gap-2">
                <input v-model="currentGuess" class="form-control" placeholder="Ваш вариант..." />
                <button class="btn-mixerr">УГАДАТЬ</button>
              </form>
            </div>
          </div>
        </div>

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
import { ref } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'

const phrase = ref('')
const emojis = ref('')
const originalPhrase = ref('')
const showGuessInput = ref(false)
const currentGuess = ref('')
const guesses = ref([])
const activeUserIndex = ref(0)
const currentUserIndex = ref(1)

const users = [
  { name: 'Игрок 1', avatar: new URL('@/assets/img/smile_laugh.png', import.meta.url).href },
  { name: 'Игрок 2', avatar: new URL('@/assets/img/smile_think.png', import.meta.url).href },
  { name: 'Игрок 3', avatar: new URL('@/assets/img/smile_win.png', import.meta.url).href }
]

async function submitPhrase() {
  emojis.value = ''

  const prompt = `
Ты — Emoji MixBot, AI, который переводит фразы на язык эмодзи.  
Твоя цель: точно и кратко отобразить смысл входной фразы, используя ТОЛЬКО эмодзи.

📌 Правила:
1. ✅ Используй ТОЛЬКО эмодзи.  
2. ❌ Не используй текст, символы, кавычки, знаки препинания, цифры, HTML или переносы строк.  
3. 🧵 Ответ — одна строка.  
4. 🧠 Передавай только ключевой смысл фразы.  
5. ⛔ Никаких пояснений или лишних символов.

📎 Примеры:

"я люблю пиццу" → 🍕❤️  
"работаю ночью" → 💻🌙🧠  
"иду на учебу" → 🏫🚶‍♂️  
"кошка спит" → 🐱💤  
"лечу в Париж" → ✈️🗼  
"играет музыка" → 🎶🔊  
"бегаю по утрам" → 🏃‍♀️🌅

🔤 Входная фраза: "${phrase.value}"
🔁 Эмодзи:`

  try {
    // Отправляем POST-запрос к API OpenRouter с prompt
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
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    // Записываем результат — эмодзи-перевод
    emojis.value = data.choices?.[0]?.message?.content.trim() || ''
    // Запоминаем исходную фразу в нижнем регистре для проверки угадываний
    originalPhrase.value = phrase.value.trim().toLowerCase()
    phrase.value = ''
    showGuessInput.value = true
    guesses.value = []
    // Следующий игрок начинает угадывать
    currentUserIndex.value = (activeUserIndex.value + 1) % users.length
  } catch (err) {
    emojis.value = '⚠️ Ошибка перевода'
    console.error('Ошибка API:', err)
  }
}
// Функция обработки угадывания фразы игроком
function submitGuess() {
  const normalizedGuess = currentGuess.value.trim().toLowerCase()
  const player = users[currentUserIndex.value]

  // Проверяем, не угадывал ли этот игрок ранее
  const alreadyGuessed = guesses.value.some(g => g.name === player.name)
  if (alreadyGuessed) return
  // Проверяем правильность угадывания
  const isCorrect = normalizedGuess === originalPhrase.value
  guesses.value.push({ name: player.name, correct: isCorrect })

  currentGuess.value = ''
  // Переходим к следующему игроку
  const nextIndex = (currentUserIndex.value + 1) % users.length
  
  if (nextIndex === activeUserIndex.value) {
    showGuessInput.value = false
    emojis.value = ''
    originalPhrase.value = ''
    setTimeout(() => {
      // Выводим сообщение о победителях
      const winners = guesses.value.filter(g => g.correct).map(g => g.name)
      if (winners.length > 0) {
        const message = winners.length === 1 ? `${winners[0]} угадал фразу! 🎉` : `${winners.join(' и ')} угадали фразу! 🎉`
        alert(message)
      } else {
        alert('Никто не угадал фразу 😢')
      }
      // Обнуляем угадывания и переключаем активного игрока
      guesses.value = []
      activeUserIndex.value = (activeUserIndex.value + 1) % users.length
      currentUserIndex.value = (activeUserIndex.value + 1) % users.length
    }, 100)
  } else {
    // Следующий игрок продолжает угадывать
    currentUserIndex.value = nextIndex
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