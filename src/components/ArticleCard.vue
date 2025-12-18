<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { Calendar, ArrowRight } from 'lucide-vue-next'

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
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <li class="group">
    <RouterLink
      :to="`/artiklar/${article.id}`"
      class="block h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden 
             shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 
             hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900"
    >
      <!-- Image Container -->
      <div class="relative overflow-hidden aspect-[16/9]">
        <img
          :src="article.image_url"
          :alt="article.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        <!-- Date Badge -->
        <div class="absolute top-3 left-3">
          <div class="flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm 
                      px-3 py-1.5 rounded-full">
            <Calendar class="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ formatDate(article.date) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 
                   group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ article.title }}
        </h3>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed">
          {{ article.description }}
        </p>

        <!-- Read More Link -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Läs artikeln
          </span>
          <ArrowRight class="w-5 h-5 text-blue-600 dark:text-blue-400 
                            transform group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </RouterLink>
  </li>
</template>