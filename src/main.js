import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/mixerr.css'

// Создание приложения Vue
const app = createApp(App)

// Создание и подключение хранилища Pinia
const pinia = createPinia()
app.use(pinia)

// Подключение роутера и монтирование
app.use(router).mount('#app')