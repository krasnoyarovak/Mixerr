<template>
  <a
    :href="href"
    class="pixel-link"
    :class="{ filled }"
  >
    <slot />
  </a>
</template>

<script setup>
defineProps({
  href: String,
  filled: Boolean
})
</script>

<style scoped>
.pixel-link {
  font-family: 'Press Start 2P', monospace;
  font-size: 15px;
  color: var(--svet);
  text-decoration: none;
  padding: 10px 20px;
  position: relative;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.pixel-link.filled {
  background-color: var(--akcent);
  color: var(--fon);
  border-radius: 12px;
}

.pixel-link:hover {
  outline: 2px solid var(--akcent);
  outline-offset: 2px;
  border-radius: 10px;
  box-shadow: 0 0 1px 1px var(--akcent);
}
</style>
