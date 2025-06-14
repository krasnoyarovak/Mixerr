import { defineStore } from 'pinia'

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase()
}

export const useGameStore = defineStore('game', {
  //функция, в которой хранятся объекты
  state: () => ({
    phrase: '',
    emojis: '',
    originalPhrase: '',
    showGuessInput: false, //флаг для окна угдывания фразы
    currentGuess: '',
    guesses: [],
    activeUserIndex: 0,
    currentUserIndex: 1,
    name: '',
    message: '',
    nickname: '',
    avatar: '',
    defaultAvatar: new URL('@/assets/img/smile_think.png', import.meta.url).href,
    roomCode: generateRoomCode(),
    users: [
      { name: 'Игрок 1', avatar: new URL('@/assets/img/smile_laugh.png', import.meta.url).href },
      { name: 'Игрок 2', avatar: new URL('@/assets/img/smile_think.png', import.meta.url).href },
      { name: 'Игрок 3', avatar: new URL('@/assets/img/smile_win.png', import.meta.url).href }
    ]
  }),
  //методы хранилища, которые работают с данными из state
  actions: {
    //асинхронная функция для перевода с русского языка на язык эмодзи (вернет или перевод фразы, или ошибку)
    async submitPhrase() {
      this.emojis = '' 
      //запрос для ии
      const prompt = `
Ты — Emoji MixBot, AI, который переводит фразы на язык эмодзи.  
Твоя цель: точно и кратко отобразить смысл входной фразы, используя ТОЛЬКО эмодзи.

📌 Правила:
1. ✅ Используй ТОЛЬКО эмодзи.  
2. ❌ Не используй текст, символы, кавычки, знаки препинания, цифры, HTML или переносы строк.  
3. 🧵 Ответ — одна строка.  
4. 🧠 Передавай только ключевой смысл фразы.  
5. ⛔ Никаких пояснений или лишних символов.

🔤 Входная фраза: "${this.phrase}"

🔁 Переведи в эмодзи (одной строкой, без пояснений):
`

      try {
        //выполняем пост-запрос к API OpenRouter
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST', //метод для отправки данных на сервер
          headers: { //заголовки, чтобы сервер понимал, что мы от него хотим
            'Authorization': 'Bearer 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', //ключ доступа к апи
            'Content-Type': 'application/json', //хотим отправить данные в формате json
            'X-Title': 'mixerr',
            'HTTP-Referer': 'http://localhost:5173' //с какого сайта пришел запрос 
          },
          body: JSON.stringify({   //преобразуем наш объект в строку json, чтобы сервер нас понял
            model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
            messages: [{ role: 'user', content: prompt }]
          })
        })

        const data = await res.json() //переводим из json формата в js
        if (data.error) throw new Error(data.error.message) //если в ответе от сервера вылезла ошибка, то выбрасываем 
        //безопасно достаем наш результат и если выскочила ошибка, то emojis примет значение пустой строки
        this.emojis = data.choices?.[0]?.message?.content.trim() || ''
        this.originalPhrase = this.phrase.trim().toLowerCase() //сохраняем загаданную игроком фразу в норм виде
        this.phrase = '' //очищаем поля ввода фразы
        this.showGuessInput = true 
        this.guesses = []
        this.currentUserIndex = (this.activeUserIndex + 1) % this.users.length 

      } catch (err) {
        this.emojis = '⚠️ Ошибка перевода'
        console.error('Ошибка API:', err)
      }
    },

    submitGuess() {
      const normalizedGuess = this.currentGuess.trim().toLowerCase() //приводим угаданную фразу к такому же виду (без пробелов и в нижнем регистре)
      const player = this.users[this.currentUserIndex]
      //проверяем индекс текущего игрока
      if (!player) {
        console.error('Игрок не найден по индексу:', this.currentUserIndex)
        return
      }
      //если в списке угадывающих уже есть выбранный игрок, то выходим из функции
      const alreadyGuessed = this.guesses.some(g => g.name === player.name)
      if (alreadyGuessed) return

      const isCorrect = normalizedGuess === this.originalPhrase
      this.guesses.push({ name: player.name, correct: isCorrect })
      this.currentGuess = ''

      const nextIndex = (this.currentUserIndex + 1) % this.users.length
      //заканчиваем раунд и очищаем переменные, если следующий игрок - тот, кто загадывал фразу
      if (nextIndex === this.activeUserIndex) {
        this.showGuessInput = false
        this.emojis = ''
        this.originalPhrase = ''

        setTimeout(() => {
          const winners = this.guesses.filter(g => g.correct).map(g => g.name)
          if (winners.length > 0) {
            const message = winners.length === 1
              ? `${winners[0]} угадал фразу! 🎉`
              : `${winners.join(' и ')} угадали фразу! 🎉`
            alert(message)
          } else {
            alert('Никто не угадал фразу 😢')
          }
          this.guesses = []
          this.activeUserIndex = (this.activeUserIndex + 1) % this.users.length
          this.currentUserIndex = (this.activeUserIndex + 1) % this.users.length
        }, 100)

      } else {
        this.currentUserIndex = nextIndex
      }
    },

    submitForm() {
      alert(`Спасибо, ${this.name}! Мы получили ваше сообщение: "${this.message}"`)
      this.name = ''
      this.message = ''
    },

    handleAvatarUpload(e) {
      const file = e.target.files[0]
      if (file) this.avatar = URL.createObjectURL(file)
    }
  }
})
