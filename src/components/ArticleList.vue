<script lang="ts" setup>
import ArticleCard from './ArticleCard.vue'

interface Article {
  id: string
  title: string
  description: string
  image_url: string
  date: string
}

interface Props {
  articles: Article[]
}

defineProps<Props>()
</script>

<template>
  <div class="w-full flex flex-col gap-6 px-2">
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
    </ul>
  </div>
</template>