<template>
  <div class="page px-4 pt-5">
    <AppNavbar />

    <div class="round-container d-flex flex-column align-items-center text-center">
      <h1 class="round-title mb-4">РАУНД 1</h1>

      <p class="round-instruction mb-4">
        Напиши фразу — мы переведем её в эмодзи ✨
      </p>

      <form @submit.prevent="submitPhrase" class="round-form w-100">
        <textarea
          v-model="phrase"
          required
          class="form-control pixel-input mb-4"
          rows="3"
          placeholder="Твоя фраза..."
        ></textarea>
        <button type="submit" class="btn-mixerr">ПЕРЕВЕСТИ</button>
      </form>

      <p v-if="emojis" class="emoji-output mt-4">{{ emojis }}</p>
      <p v-if="errorMsg" class="text-danger mt-3">{{ errorMsg }}</p>

      <div class="pers-anima-background"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'

const phrase = ref('')
const emojis = ref('')
const errorMsg = ref('')

async function submitPhrase() {
  emojis.value = ''
  errorMsg.value = ''

const prompt = `
Твоя задача — строго и моментально перевести фразу пользователя на язык эмодзи.
💥 Только эмодзи, НИКАКИХ слов, объяснений, кавычек, мыслей или размышлений.
🛑 Если ты добавишь хоть один текстовый символ — это ошибка.
✅ Просто набор эмодзи, подходящих по смыслу. Никаких "Я думаю", "можно использовать", "например".

Примеры:
"я люблю пиццу" → 🍕❤️
"работаю всю ночь" → 💻🌙🧠
"еду в отпуск" → ✈️🏖️😎

Фраза: "${phrase.value}"`

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'mixerr'
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    const data = await res.json()

    console.log('📥 Исходная фраза:', phrase.value)
    console.log('📤 Ответ от нейросети:', data)

    if (data.choices?.[0]?.message?.content) {
      emojis.value = data.choices[0].message.content.trim()
    } else {
      errorMsg.value = '⚠️ Ответ пустой или некорректный'
    }

    phrase.value = ''
  } catch (err) {
    errorMsg.value = '⚠️ Ошибка при обращении к API'
    console.error('❌ Ошибка запроса:', err)
  }
}
</script>

<style scoped>
.round-container {
  padding-top: 100px;
  font-family: 'Press Start 2P', monospace;
  color: var(--svet);
  position: relative;
  min-height: calc(100vh - 100px);
  overflow: hidden;
}

.round-title {
  font-size: 26px;
  color: var(--akcent);
}

.round-instruction {
  font-size: 14px;
  color: var(--muted);
  max-width: 600px;
}

.round-form {
  max-width: 600px;
  z-index: 2;
}

.pixel-input {
  background-color: var(--fon);
  color: var(--svet);
  border: 2px solid var(--akcent);
  font-family: 'Press Start 2P', monospace;
  font-size: 14px;
  padding: 12px;
  border-radius: 12px;
  resize: none;
}

.pixel-input:focus {
  outline: none;
  box-shadow: 0 0 4px var(--akcent);
}

.emoji-output {
  font-size: 28px;
  color: var(--svet);
  max-width: 600px;
  word-wrap: break-word;
}

.pers-anima-background {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 800px;
  height: 800px;
  background-image: url('@/assets/img/pers1.png');
  background-size: cover;
  animation: begunok 1s steps(3) infinite;
  image-rendering: pixelated;
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
}

@keyframes begunok {
  0%   { background-image: url('@/assets/img/pers1.png'); }
  33%  { background-image: url('@/assets/img/pers2.png'); }
  66%  { background-image: url('@/assets/img/pers3.png'); }
  100% { background-image: url('@/assets/img/pers1.png'); }
}
</style>

<style scoped src="@/assets/mixerr.css"></style>
