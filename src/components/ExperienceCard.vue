<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router'
import type { Experience, AgeGroup } from '@/types/Experience'
import { Star } from 'lucide-vue-next'

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
    month: 'long',
    day: 'numeric',
  })

  const endFormatted = end.toLocaleDateString('sv-SE', {
    month: 'long',
    day: 'numeric',
  })

  // If same year, don't show year twice
  if (start.getFullYear() === end.getFullYear()) {
    return `${startFormatted} - ${endFormatted} ${start.getFullYear()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
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
  // Navigate to booking page with query params
  router.push(getBookingLink())
  emit('addToCart', props.experience, event)
}
</script>

<template>
  <RouterLink
    :to="getExperienceLink()"
    class="flex flex-col h-full bg-neutral-100 dark:bg-neutral-800 border-b-4 border-neutral-300 dark:border-neutral-700 rounded overflow-hidden transition-all group"
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
      <p class="text-neutral-500 dark:text-neutral-500 leading-tight text-xs">
        {{ formatDateRange(experience.date_range.start_date, experience.date_range.end_date) }}
      </p>
      <div class="flex items-center gap-1">
        <span class="text-sm"><Star class="w-4 h-4 stroke-yellow-500 fill-yellow-500" /></span>
        <span class="text-neutral-800 dark:text-neutral-200 text-sm font-medium">
          {{ experience.rating }}
        </span>
      </div>
      <div
        class="mt-auto pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between gap-2"
      >
        <p class="text-neutral-800 dark:text-neutral-200 text-base font-medium">
          <span class="text-2xl font-medium">{{ experience.price }} kr</span>
          <span class="text-sm text-neutral-600 dark:text-neutral-400 font-normal"> / person </span>
        </p>
        <RouterLink
          :to="getBookingLink()"
          @click.stop="handleAddToCart($event)"
          class="py-1.5 px-3 text-xs border-b-2 border-blue-800 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors whitespace-nowrap text-center"
        >
          Boka
        </RouterLink>
      </div>
    </div>
  </RouterLink>
</template>
