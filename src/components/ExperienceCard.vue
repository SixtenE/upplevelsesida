<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router'
import type { Experience, AgeGroup } from '@/types/Experience'
import { Star, MapPin, Calendar } from 'lucide-vue-next'

interface Props {
  experience: Experience
  groupSize?: number
  date?: string
  ageGroup?: AgeGroup | ''
}

const props = defineProps<Props>()
const router = useRouter()

const emit = defineEmits<{
  addToCart: [experience: Experience, event: Event]
}>()

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startFormatted = start.toLocaleDateString('sv-SE', {
    month: 'short',
    day: 'numeric',
  })

  const endFormatted = end.toLocaleDateString('sv-SE', {
    month: 'short',
    day: 'numeric',
  })

  if (start.getFullYear() === end.getFullYear()) {
    return `${startFormatted} - ${endFormatted} ${start.getFullYear()}`
  }

  return `${startFormatted} ${start.getFullYear()} - ${endFormatted} ${end.getFullYear()}`
}

const getExperienceLink = () => {
  const query: Record<string, string> = {}
  if (props.date) query.date = props.date
  if (props.groupSize && props.groupSize > 1) query.group_size = props.groupSize.toString()
  if (props.ageGroup) query.age_group = props.ageGroup

  return {
    path: `/upplevelse/${props.experience.id}`,
    query: Object.keys(query).length > 0 ? query : undefined,
  }
}

const getBookingLink = () => {
  const query: Record<string, string> = {
    id: props.experience.id,
  }
  if (props.date) query.date = props.date
  if (props.groupSize && props.groupSize > 1) query.group_size = props.groupSize.toString()
  if (props.ageGroup) query.age_group = props.ageGroup

  return {
    path: '/bokning',
    query,
  }
}

const handleAddToCart = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  router.push(getBookingLink())
  emit('addToCart', props.experience, event)
}
</script>

<template>
  <RouterLink
    :to="getExperienceLink()"
    class="block h-full group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden 
           shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 
           hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900"
  >
    <!-- Image Container -->
    <div class="relative overflow-hidden aspect-[4/3]">
      <img
        :src="experience.image_url"
        :alt="experience.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <!-- Rating Badge -->
      <div class="absolute top-3 left-3">
        <div class="flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm 
                    px-3 py-1.5 rounded-full">
          <Star class="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span class="text-sm font-semibold text-gray-900 dark:text-white ml-1">
            {{ experience.rating.toFixed(1) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 
                 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {{ experience.title }}
      </h3>

      <!-- Meta Info -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPin class="w-4 h-4" />
          <span class="text-sm">{{ experience.location }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar class="w-4 h-4" />
          <span class="text-sm">
            {{ formatDateRange(experience.date_range.start_date, experience.date_range.end_date) }}
          </span>
        </div>
      </div>

      <!-- Footer with Price and Action -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ experience.price }} kr
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">per person</div>
        </div>
        <button
          @click.stop="handleAddToCart($event)"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl 
                 transition-all duration-200 hover:shadow-lg flex items-center gap-2 group/button"
        >
          <span>Boka</span>
          <svg class="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </button>
      </div>
    </div>
  </RouterLink>
</template>