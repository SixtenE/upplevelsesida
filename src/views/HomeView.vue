<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { motion } from 'motion-v'
import data from '@/data/data.json'
import type { Experience } from '@/types/Experience'
import router from '@/router'

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

const date = ref(router.currentRoute.value.query.date as string)

watch(date, (newDate) => {
  router.push({ query: { date: newDate } })
})
</script>

<template>
  <main class="container mx-auto flex flex-col pt-16 items-center gap-8 px-4 sm:px-0 pb-32">
    <motion.h1
      :initial="{ y: 10 }"
      :animate="{ y: 0 }"
      :transition="{ duration: 0.3 }"
      class="text-center w-full text-black dark:text-white text-4xl sm:text-6xl font-medium tracking-tight"
    >
      upplevelsesida
    </motion.h1>
    <div class="w-full sm:w-2xl flex flex-col gap-6 px-2">
      <motion.div
        :initial="{ y: 10 }"
        :animate="{ y: 0 }"
        :transition="{ duration: 0.5 }"
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
            v-model="date"
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
            class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
            placeholder="Lägg till personer"
          />
        </div>
      </motion.div>
      <div class="w-full flex justify-end px-3">
        <RouterLink to="/#2">
          <motion.button
            :initial="{ y: 10 }"
            :animate="{ y: 0 }"
            :transition="{ duration: 0.3 }"
            class="py-3 px-5 text-sm border-b-4 border-blue-800 bg-blue-600 text-white rounded-sm"
          >
            Hitta upplevelser
          </motion.button>
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
          class="group"
        >
          <RouterLink
            :to="`/upplevelse/${experience.id}`"
            class="flex flex-col h-full bg-neutral-100 dark:bg-neutral-800 border-b-4 border-neutral-300 dark:border-neutral-700 rounded overflow-hidden transition-all"
          >
            <div class="relative overflow-hidden">
              <img
                :src="experience.image_url"
                class="h-60 w-full object-cover transition-all duration-500 group-hover:scale-105"
                :alt="experience.title"
              />
            </div>
            <div class="flex flex-col grow p-4 gap-2">
              <p class="text-black dark:text-white leading-tight text-lg font-medium line-clamp-2">
                {{ experience.title }}
              </p>
              <p class="text-neutral-600 dark:text-neutral-400 leading-tight text-sm">
                {{ experience.location }}
              </p>
              <div class="mt-auto pt-2 border-t border-neutral-300 dark:border-neutral-700">
                <p class="text-neutral-800 dark:text-neutral-200 text-base font-medium">
                  <span class="text-2xl font-medium">{{ experience.price }} kr</span>
                  <span class="text-sm text-neutral-600 dark:text-neutral-400 font-normal">
                    / person
                  </span>
                </p>
              </div>
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
