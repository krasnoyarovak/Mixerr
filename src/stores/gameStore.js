import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const phrase = ref('')
  const emojis = ref('')
  const originalPhrase = ref('')
  const showGuessInput = ref(false)
  const currentGuess = ref('')
  const guesses = ref([])
  const activeUserIndex = ref(0)
  const currentUserIndex = ref(1)
  const name = ref('')
  const message = ref('')

  const users = ref([
    { name: 'Игрок 1', avatar: new URL('@/assets/img/smile_laugh.png', import.meta.url).href },
    { name: 'Игрок 2', avatar: new URL('@/assets/img/smile_think.png', import.meta.url).href },
    { name: 'Игрок 3', avatar: new URL('@/assets/img/smile_win.png', import.meta.url).href }
  ])

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

🔁 Переведи в эмодзи (одной строкой, без пояснений):
`

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
          messages: [{ role: 'user', content: prompt }]
        })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      emojis.value = data.choices?.[0]?.message?.content.trim() || ''
      originalPhrase.value = phrase.value.trim().toLowerCase()
      phrase.value = ''
      showGuessInput.value = true
      guesses.value = []
      currentUserIndex.value = (activeUserIndex.value + 1) % users.value.length
    } catch (err) {
      emojis.value = '⚠️ Ошибка перевода'
      console.error('Ошибка API:', err)
    }
  }

  function submitGuess() {
    const normalizedGuess = currentGuess.value.trim().toLowerCase()
    const player = users.value[currentUserIndex.value]

    if (!player) {
      console.error('Игрок не найден по индексу:', currentUserIndex.value)
      return
    }

    const alreadyGuessed = guesses.value.some(g => g.name === player.name)
    if (alreadyGuessed) return

    const isCorrect = normalizedGuess === originalPhrase.value
    guesses.value.push({ name: player.name, correct: isCorrect })

    currentGuess.value = ''

    const nextIndex = (currentUserIndex.value + 1) % users.value.length
    if (nextIndex === activeUserIndex.value) {
      showGuessInput.value = false
      emojis.value = ''
      originalPhrase.value = ''
      setTimeout(() => {
        const winners = guesses.value.filter(g => g.correct).map(g => g.name)
        if (winners.length > 0) {
          const message = winners.length === 1
            ? `${winners[0]} угадал фразу! 🎉`
            : `${winners.join(' и ')} угадали фразу! 🎉`
          alert(message)
        } else {
          alert('Никто не угадал фразу 😢')
        }
        guesses.value = []
        activeUserIndex.value = (activeUserIndex.value + 1) % users.value.length
        currentUserIndex.value = (activeUserIndex.value + 1) % users.value.length
      }, 100)
    } else {
      currentUserIndex.value = nextIndex
    }
  }
  
  function submitForm() {
    alert(`Спасибо, ${name.value}! Мы получили ваше сообщение: "${message.value}"`)
    name.value = ''
    message.value = ''
  }
  // Хранилище комнаты
  const nickname = ref('')
  const avatar = ref('')
  const defaultAvatar = new URL('@/assets/img/smile_think.png', import.meta.url).href
  const roomCode = ref(generateRoomCode())

  function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase()
  }

  function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (file) avatar.value = URL.createObjectURL(file)
  }
  

  return {
    phrase,
    emojis,
    originalPhrase,
    showGuessInput,
    currentGuess,
    guesses,
    activeUserIndex,
    currentUserIndex,
    users,
    name,
    message,
    nickname,
    avatar,
    defaultAvatar,
    roomCode,
    handleAvatarUpload,
    submitPhrase,
    submitGuess,
    submitForm,
  }
})
