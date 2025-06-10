import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateRoom from '@/views/CreateRoom.vue'
import JoinRoom from '@/views/JoinRoom.vue'
import RoomPage from '@/views/RoomPage.vue'
import About from '@/views/About.vue'
import Rules from '@/views/Rules.vue'
import StartGame from '@/views/StartGame.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/create', component: CreateRoom },
  { path: '/join', component: JoinRoom },
  { path: '/room', component: RoomPage },
  { path: '/about', component: About },
  { path: '/rules', component: Rules },
  { path: '/startgame', component: StartGame }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
