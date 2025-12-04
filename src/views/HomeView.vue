<script lang="ts" setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { motion } from 'motion-v'
import data from '@/data/data.json'
import type { Experience } from '@/types/Experience'

const experiences = data.sort(() => Math.random() - 0.5) as Experience[]

const articles = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: '"Ett Oförglömligt Äventyr i Lund!"',
    description:
      'Ge dina barn ett äventyr de aldrig kommer att glömma! Boka nu och låt dem upptäcka dinosauriernas värld på ett sätt de aldrig gjort förut.',
    image_url: '/images/article_1.jpg',
  },
]

const groupSize = ref(1)
const link = computed(() => {
  return `/bokning?id=eeb132bf-b4cd-4d39-bb96-7b189305f803&people=${groupSize.value}&date=2025-12-24`
})
</script>

<template>
  <main class="container mx-auto flex flex-col pt-16 items-center gap-8 px-4 sm:px-0 pb-32">
    <h1
      class="text-center w-full text-black dark:text-white text-4xl sm:text-6xl font-medium tracking-tight"
    >
      upplevelsesida
    </h1>
    <div class="w-full sm:w-2xl flex flex-col gap-6 px-2">
      <div
        class="w-full px-8 py-3 grid grid-cols-1 sm:grid-cols-3 bg-neutral-100 border-b-4 border-neutral-300 rounded-sm"
      >
        <div
          class="w-full border-b sm:border-b-0 sm:border-r border-neutral-500 h-full flex flex-col justify-center items-center pl-4"
        >
          <label for="location" class="w-full text-sm font-medium">Var</label>
          <input
            type="text"
            id="location"
            class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
            placeholder="Sök efter en plats"
            list="locations"
          />
          <datalist id="locations">
            <option value="Stockholm"></option>
            <option value="Göteborg"></option>
            <option value="Malmö"></option>
            <option value="Uppsala"></option>
            <option value="Västerås"></option>
            <option value="Örebro"></option>
            <option value="Linköping"></option>
            <option value="Helsingborg"></option>
            <option value="Jönköping"></option>
            <option value="Norrköping"></option>
          </datalist>
        </div>
        <div
          class="w-full border-b sm:border-b-0 sm:border-r border-neutral-500 h-full flex flex-col justify-center items-center pl-4"
        >
          <label for="date" class="w-full text-sm font-medium">När</label>
          <input
            type="date"
            id="date"
            class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
            placeholder="Lägg till datum"
          />
        </div>
        <div class="w-full h-full flex flex-col justify-center items-center pl-4">
          <label for="group_size" class="w-full text-sm font-medium">Antal</label>
          <input
            type="number"
            id="group_size"
            min="1"
            v-model="groupSize"
            class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
            placeholder="Lägg till personer"
          />
        </div>
      </div>
      <div class="w-full flex justify-end px-3">
        <RouterLink :to="link">
          <button
            class="py-3 px-5 text-sm border-b-4 border-blue-800 bg-blue-600 text-white rounded-sm"
          >
            Hitta upplevelser
          </button>
        </RouterLink>
      </div>
    </div>
    <h1
      class="text-left w-full text-black dark:text-white text-xl sm:text-xl font-medium tracking-tight"
    >
      Upplevelser
    </h1>
    <div class="w-full flex flex-col gap-6 px-2">
      <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        <motion.li
          layout
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ delay: (index - 1) * 0.05 }"
          v-for="(experience, index) in experiences"
          :key="experience.id"
          class="text-neutral-300 hover:opacity-80 transition-all hover:-translate-y-0.5"
        >
          <RouterLink :to="`/upplevelse/${experience.id}`">
            <img :src="experience.image_url" class="h-60 object-cover" />
            <p class="text-white leading-tight py-2 text-xl">{{ experience.title }}</p>
            <p class="leading-tight text-sm">{{ experience.location }}</p>
            <div class="flex justify-between">
              <p class="text-lg font-medium">{{ experience.price }} kr</p>
            </div>
          </RouterLink>
        </motion.li>
      </ul>
    </div>
    <h1
      class="text-left w-full text-black dark:text-white text-xl sm:text-xl font-medium tracking-tight"
    >
      Artiklar
    </h1>
    <div class="w-full flex flex-col gap-6 px-2">
      <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        <motion.li
          layout
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ delay: (index - 1) * 0.05 }"
          v-for="(article, index) in articles"
          :key="article.id"
          class="text-neutral-300 hover:opacity-80 transition-all hover:-translate-y-0.5"
        >
          <RouterLink :to="`/artiklar/${article.id}`">
            <img :src="article.image_url" class="h-60 object-cover" />
            <p class="text-white leading-tight py-2 text-xl">
              {{ article.title }}
            </p>
            <p class="leading-tight text-sm">
              {{ article.description }}
            </p>
          </RouterLink>
        </motion.li>
      </ul>
    </div>
  </main>
</template>
