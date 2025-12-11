<script lang="ts" setup>
import { ref, computed } from 'vue'
import data from '@/data/data.json'
import articlesData from '@/data/articles.json'
import type { Experience, SortOption, AgeGroup } from '@/types/Experience'
import router from '@/router'
import { useCartStore } from '@/stores/cart'
import PageHeader from '@/components/PageHeader.vue'
import SearchFilters from '@/components/SearchFilters.vue'
import ExperienceList from '@/components/ExperienceList.vue'
import ArticleList from '@/components/ArticleList.vue'
import Footer from '@/components/Footer.vue'

const allExperiences = data as Experience[]
const articles = [...articlesData].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
})
const cartStore = useCartStore()

const sortBy = ref<SortOption>('rating-desc')
const date = ref((router.currentRoute.value.query.date as string) || '')
const location = ref((router.currentRoute.value.query.location as string) || '')
const group_size = ref((router.currentRoute.value.query.group_size as unknown as number) || 1)
const age_group = ref<AgeGroup | ''>(
  (router.currentRoute.value.query.age_group as AgeGroup | '') || '',
)

const experiences = computed(() => {
  let filtered = [...allExperiences]

  // Filter by location
  if (location.value) {
    filtered = filtered.filter((exp) =>
      exp.location.toLowerCase().includes(location.value.toLowerCase()),
    )
  }

  // Filter by age group
  if (age_group.value) {
    filtered = filtered.filter((exp) => exp.age_group === age_group.value)
  }

  // Filter by date (check if filter date month/day is within experience date range, ignoring year)
  if (date.value) {
    filtered = filtered.filter((exp) => {
      const filterDate = new Date(date.value)
      const startDate = new Date(exp.date_range.start_date)
      const endDate = new Date(exp.date_range.end_date)

      const filterMonth = filterDate.getMonth()
      const filterDay = filterDate.getDate()
      const startMonth = startDate.getMonth()
      const startDay = startDate.getDate()
      const endMonth = endDate.getMonth()
      const endDay = endDate.getDate()

      // Check if filter date (month/day) is within the experience date range (month/day)
      // Handle cases where range spans across year boundary
      if (startMonth < endMonth || (startMonth === endMonth && startDay <= endDay)) {
        // Normal range (e.g., July 15 - November 15)
        return (
          (filterMonth > startMonth || (filterMonth === startMonth && filterDay >= startDay)) &&
          (filterMonth < endMonth || (filterMonth === endMonth && filterDay <= endDay))
        )
      } else {
        // Range spans year boundary (e.g., November 15 - March 15)
        return (
          filterMonth > startMonth ||
          (filterMonth === startMonth && filterDay >= startDay) ||
          filterMonth < endMonth ||
          (filterMonth === endMonth && filterDay <= endDay)
        )
      }
    })
  }

  return filtered
})

const addToCart = (experience: Experience, event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  cartStore.hydrateFromExperience(experience)
  cartStore.setTotalPeople(group_size.value || 1)
  cartStore.addSelection()
}

const clearSearch = () => {
  date.value = ''
  location.value = ''
  group_size.value = 1
  age_group.value = ''
}

const handleLocationUpdate = (value: string) => {
  location.value = value
}

const handleDateUpdate = (value: string) => {
  date.value = value
}

const handleGroupSizeUpdate = (value: number) => {
  group_size.value = value
}

const handleAgeGroupUpdate = (value: AgeGroup | '') => {
  age_group.value = value
}
</script>

<template>
  <main class="container mx-auto flex flex-col pt-16 items-center gap-8 px-4 sm:px-0 pb-32">
    <PageHeader />
    <SearchFilters
      :location="location"
      :date="date"
      :group-size="group_size"
      :age-group="age_group"
      @update:location="handleLocationUpdate"
      @update:date="handleDateUpdate"
      @update:group-size="handleGroupSizeUpdate"
      @update:age-group="handleAgeGroupUpdate"
      @clear="clearSearch"
    />
    <div
      class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2"
    >
      <h1
        class="text-left text-black dark:text-white text-xl sm:text-xl font-medium tracking-tight"
      >
        Upplevelser
      </h1>
      <div class="flex items-center">
        <select
          v-model="sortBy"
          class="px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="rating-desc">Betyg: Högst först</option>
          <option value="rating-asc">Betyg: Lägst först</option>
          <option value="price-desc">Pris: Högst först</option>
          <option value="price-asc">Pris: Lägst först</option>
        </select>
      </div>
    </div>
    <ExperienceList
      :experiences="experiences"
      :sort-by="sortBy"
      :group-size="group_size"
      :date="date"
      :age-group="age_group"
      @add-to-cart="addToCart"
      @clear-search="clearSearch"
    />
    <h1
      class="text-left w-full text-black dark:text-white text-xl sm:text-xl font-medium tracking-tight"
    >
      Artiklar
    </h1>
    <ArticleList :articles="articles" />
  </main>
  <Footer />
</template>
