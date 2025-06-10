<template>
  <div class="page px-4 pt-5">
    <AppNavbar />

    <h1 class="rules-title-global">ПРАВИЛА ИГРЫ</h1>

    <div class="rules-section d-flex justify-content-between align-items-center mt-5 flex-wrap">
      <div class="rules-text text-start mx-auto">
        <div class="rule-blok">
          <p><span class="emoji-text">😎</span> Играть могут от <span class="text-akcent">3 до 15</span> человек</p>
          <p><span class="emoji-text">✍️</span> Каждый игрок по очереди пишет <span class="text-akcent">оригинальную фразу</span></p>
          <p><span class="emoji-text">🔁</span> Фраза <span class="text-akcent">переводится в эмодзи</span> и рассылается остальным.</p>
          <p><span class="emoji-text">🧠</span> Остальные <span class="text-akcent">угадывают, что за фраза,</span> и отправляют свои версии</p>
          <p><span class="emoji-text">🌟</span> Баллы начисляются за <span class="text-akcent">точность</span> и <span class="text-akcent">креативность</span></p>
          <p><span class="emoji-text">👑</span> Побеждает тот, у кого больше всего очков!</p>
        </div>
      </div>

      <div class="rules-image">
        <img src="@/assets/img/smile_win.png" alt="winner emoji" class="emoji-img" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'

defineOptions({
  name: 'RulesView'
})
</script>

<style scoped>
.rules-title-global {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26px;
  color: var(--svet);
  font-family: 'Press Start 2P', monospace;
  text-align: center;
  z-index: 10;
}

.rules-section {
  padding-top: 160px;
  padding-bottom: 30px;
  box-sizing: border-box;
  width: 100%;
}

.rules-text {
  max-width: 600px;
  font-family: 'Press Start 2P', monospace;
  font-size: 14px;
  color: var(--svet);
  line-height: 2;
}

.rule-blok {
  text-align: left;
}

.text-akcent {
  color: var(--akcent);
}

.emoji-text {
  font-size: 20px;
  margin-right: 10px;
}

.rules-image {
  flex-shrink: 0;
}

.emoji-img {
  width: 800px;
  height: auto;
  image-rendering: pixelated;
  max-width: 100%;
}
</style>

<style scoped src="@/assets/mixerr.css"></style>
