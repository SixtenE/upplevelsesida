<script lang="ts" setup>
import { useCounterStore } from './stores/counter'
const counterStore = useCounterStore()
</script>

<template>
  <h1>
    {{ counterStore.count }}
  </h1>
  <h2>
    {{ counterStore.doubleCount }}
  </h2>
  <button @click="counterStore.increment">Increment</button>
</template>
