<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import data from '@/data/data.json'
import type { Experience } from '@/types/Experience'

const route = useRoute()
const upplevelse = ref<Experience | null>(null)
const totalPeople = ref(1)

onMounted(() => {
  const id = route.params.id as string
  upplevelse.value = (data as Experience[]).find((item) => item.id === id) || null
})

</script>

<template>
  <main class="max-w-[1080px] px-[24px] mx-auto text-black dark:text-white">
    <div v-if="upplevelse">
      <h1 class="text-center text-5xl my-8 font-medium tracking-tight">
        {{ upplevelse.title }}
      </h1>
      <div class="flex flex-col md:flex-row gap-[24px] my-8">
        <div class="w-full md:flex-1 aspect-square md:aspect-auto md:h-[400px] rounded-[10px] bg-black/50 dark:bg-white/50 overflow-hidden">
          <img :src="upplevelse.image_url" :alt="upplevelse.title" class="w-full h-full object-cover" />
        </div>
        <div class="w-full md:flex-1 flex flex-col gap-4">
          <div>
            <h2 class="text-2xl font-semibold mb-2">Beskrivning</h2>
            <p class="text-lg">{{ upplevelse.description }}</p>
          </div>
          
          <div class="flex gap-8">
            <div>
              <p class="text-sm opacity-70">Pris</p>
              <p class="text-2xl font-bold">{{ upplevelse.price }} kr</p>
            </div>
            <div>
              <p class="text-sm opacity-70">Betyg</p>
              <p class="text-2xl font-bold">⭐ {{ upplevelse.rating }}</p>
            </div>
          </div>
          
          <div>
            <p class="text-sm opacity-70">Plats</p>
            <p class="text-lg">📍 {{ upplevelse.location }}</p>
          </div>
          
          <div>
            <p class="text-sm opacity-70">Datum</p>
            <p class="text-lg">📅 {{ upplevelse.date_range.start_date }} - {{ upplevelse.date_range.end_date  }}</p>
          </div>
          
          <div v-if="upplevelse.add_ons && upplevelse.add_ons.length > 0">
            <h3 class="text-xl font-semibold mb-2">Tillägg</h3>
            <ul class="space-y-2">
              <li v-for="addon in upplevelse.add_ons" :key="addon.id" class="flex justify-between items-center border-b border-current/20 pb-2">
                <span>{{ addon.title }}</span>
                <span class="font-semibold">+{{ addon.price }} kr</span>
              </li>
            </ul>
          </div>
          
          <div>
            <label for="totalPeople" class="text-sm opacity-70 block mb-2">Antal personer</label>
            <input
              id="totalPeople"
              v-model.number="totalPeople"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-current/20 rounded-lg text-black dark:text-white bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          
          <RouterLink
            :to="{
              path: '/bokning',
              query: {
                age_group: upplevelse.age_group,
                id: upplevelse.id,
                people: totalPeople,
                date: upplevelse.date_range.start_date
              }
            }"
            class="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer block text-center"
          >
            Boka
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-16">
      <p class="text-2xl">Upplevelse hittades inte</p>
    </div>
  </main>
</template>
