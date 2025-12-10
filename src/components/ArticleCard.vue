<script lang="ts" setup>
import { RouterLink } from 'vue-router'

interface Article {
  id: string
  title: string
  description: string
  image_url: string
  date: string
}

interface Props {
  article: Article
}

const props = defineProps<Props>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <li class="group">
    <RouterLink
      :to="`/artiklar/${article.id}`"
      class="flex flex-col h-full bg-neutral-100 dark:bg-neutral-800 border-b-4 border-neutral-300 dark:border-neutral-700 rounded overflow-hidden transition-all"
    >
      <div class="relative overflow-hidden">
        <img
          :src="article.image_url"
          class="h-48 w-full object-cover transition-all duration-500 group-hover:scale-105"
          :alt="article.title"
        />
      </div>
      <div class="flex flex-col grow p-5 gap-3">
        <p
          class="text-neutral-500 dark:text-neutral-500 text-xs font-medium uppercase tracking-wide"
        >
          {{ formatDate(article.date) }}
        </p>
        <h2 class="text-black dark:text-white leading-tight text-xl font-semibold line-clamp-2">
          {{ article.title }}
        </h2>
        <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm line-clamp-3">
          {{ article.description }}
        </p>
        <div class="mt-auto pt-3 border-t border-neutral-300 dark:border-neutral-700">
          <span class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
            Läs mer →
          </span>
        </div>
      </div>
    </RouterLink>
  </li>
</template>
