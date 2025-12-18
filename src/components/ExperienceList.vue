<script lang="ts" setup>
import { computed } from 'vue'
import { LayoutGroup, motion } from 'motion-v'
import type { Experience, SortOption, AgeGroup } from '@/types/Experience'
import ExperienceCard from './ExperienceCard.vue'

interface Props {
  experiences: Experience[]
  sortBy?: SortOption
  groupSize?: number
  date?: string
  ageGroup?: AgeGroup | ''
}

const props = withDefaults(defineProps<Props>(), {
  sortBy: 'rating-desc',
  groupSize: 1,
  date: '',
  ageGroup: '',
})

const emit = defineEmits<{
  addToCart: [experience: Experience, event: Event]
  clearSearch: []
}>()

const handleAddToCart = (experience: Experience, event: Event) => {
  emit('addToCart', experience, event)
}

const sortedExperiences = computed(() => {
  const experiences = [...props.experiences]

  switch (props.sortBy) {
    case 'price-asc':
      return experiences.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return experiences.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return experiences.sort((a, b) => b.rating - a.rating)
    case 'rating-asc':
      return experiences.sort((a, b) => a.rating - b.rating)
    default:
      return experiences
  }
})
</script>

<template>
  <div class="w-full">
    <template v-if="sortedExperiences.length > 0">
      <LayoutGroup>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <motion.div
            v-for="experience in sortedExperiences"
            :key="experience.id"
            layout
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 20 }"
            :transition="{ duration: 0.3 }"
            class="group"
          >
            <ExperienceCard
              :experience="experience"
              :group-size="groupSize"
              :date="date"
              :age-group="ageGroup"
              @add-to-cart="handleAddToCart"
            />
          </motion.div>
        </div>
      </LayoutGroup>
    </template>
    
    <template v-else>
      <div class="text-center py-16 px-4 max-w-md mx-auto">
        <div class="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600">
          <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Inga upplevelser hittades
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Prova att justera dina sökfilter eller utforska våra rekommenderade artiklar.
        </p>
        <button
          @click="emit('clearSearch')"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl 
                 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Rensa sökfilter
        </button>
      </div>
    </template>
  </div>
</template>