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

  if (props.sortBy === 'price-asc') {
    return experiences.sort((a, b) => a.price - b.price)
  } else if (props.sortBy === 'price-desc') {
    return experiences.sort((a, b) => b.price - a.price)
  } else if (props.sortBy === 'rating-desc') {
    return experiences.sort((a, b) => b.rating - a.rating)
  } else if (props.sortBy === 'rating-asc') {
    return experiences.sort((a, b) => a.rating - b.rating)
  }

  return experiences
})
</script>

<template>
  <div class="w-full flex flex-col gap-6 px-2">
    <ul
      v-if="sortedExperiences.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <LayoutGroup>
        <motion.li
          v-for="experience in sortedExperiences"
          :key="experience.id"
          class="group"
          layout
        >
          <ExperienceCard
            :experience="experience"
            :group-size="groupSize"
            :date="date"
            :age-group="ageGroup"
            @add-to-cart="handleAddToCart"
          />
        </motion.li>
      </LayoutGroup>
    </ul>
    <div v-else class="w-full flex flex-col items-center justify-center py-16 px-4 text-center">
      <p class="text-neutral-600 dark:text-neutral-400 text-lg mb-2">Inga upplevelser hittades</p>
      <p class="text-neutral-500 dark:text-neutral-500 text-sm mb-6">
        Prova att ändra dina filter eller rensa sökningen för att se fler upplevelser.
      </p>
      <button
        @click="emit('clearSearch')"
        class="py-2 px-6 text-sm border-b-4 border-blue-800 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
      >
        Rensa sökning
      </button>
    </div>
  </div>
</template>
