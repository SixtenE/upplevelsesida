<script lang="ts" setup>
import { RouterLink } from 'vue-router'

// type experience = {
//   id: string
//   title: string
//   description: string
//   image_url: string
//   price: number
//   location: string
//   date: string
//   rating: number
//   age_group: 'child' | 'adult' | 'senior'
//   add_ons: {
//     id: string
//     title: string
//     price: number
//   }[]
// }
</script>

<template>
  <main class="container mx-auto flex flex-col pt-32 sm:pt-44 items-center gap-16">
    <h1 class="text-center text-black dark:text-white text-6xl font-medium tracking-tight">
      upplevelsesida
    </h1>
    <div class="w-full sm:w-2xl flex flex-col gap-6 px-2">
      <div
        class="h-20 w-full px-0 sm:px-8 py-3 grid grid-cols-3 bg-neutral-100 border-b-4 border-neutral-300 rounded-sm"
      >
        <div
          class="w-full border-r border-neutral-500 h-full flex flex-col justify-center items-center pl-4"
        >
          <label for="location" class="w-full text-sm font-medium">Var</label>
          <input
            type="text"
            id="location"
            class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
            placeholder="Sök efter en plats"
          />
        </div>
        <div
          class="w-full border-r border-neutral-500 h-full flex flex-col justify-center items-center pl-4"
        >
          <label for="date" class="w-full text-sm font-medium">När</label>
          <input
            type="text"
            id="date"
            class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
            placeholder="Lägg till datum"
          />
        </div>
        <div class="w-full h-full flex flex-col justify-center items-center pl-4">
          <label for="group_size" class="w-full text-sm font-medium">Antal</label>
          <input
            type="text"
            id="group_size"
            class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
            placeholder="Lägg till personer"
          />
        </div>
      </div>
      <div class="w-full flex justify-end px-3">
        <RouterLink to="/#123">
          <button
            class="py-3 px-5 text-sm border-b-4 border-blue-800 bg-blue-600 text-white rounded-sm"
          >
            Hitta upplevelser
          </button>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
