<script lang="ts" setup>
import { ref, computed } from 'vue'
import data from '@/data/data.json'
import articlesData from '@/data/articles.json'
import type { Experience, SortOption, AgeGroup } from '@/types/Experience'
import router from '@/router'
import { useCartStore } from '@/stores/cart'
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

  // Filter by date
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

      if (startMonth < endMonth || (startMonth === endMonth && startDay <= endDay)) {
        return (
          (filterMonth > startMonth || (filterMonth === startMonth && filterDay >= startDay)) &&
          (filterMonth < endMonth || (filterMonth === endMonth && filterDay <= endDay))
        )
      } else {
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
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Upptäck Oförglömliga <span class="text-blue-600 dark:text-blue-400">Upplevelser</span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Hitta perfekta aktiviteter för alla tillfällen. Sök efter plats, datum och anpassa efter din grupp.
        </p>
      </div>

      <!-- Search Filters -->
      <section class="mb-10">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Sök & Filtrera</h2>
              <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">Anpassa sökningen efter dina preferenser</p>
            </div>
            <button
              @click="clearSearch"
              class="mt-4 sm:mt-0 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 
                     bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                     rounded-lg transition-all duration-200 flex items-center gap-2 group"
            >
              <svg class="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Rensa filter
            </button>
          </div>
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
        </div>
      </section>

      <!-- Experiences Section -->
      <section class="mb-16">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Upplevelser</h2>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 
                         text-sm font-medium rounded-full">
                {{ experiences.length }} st
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Utforska vårt urval av spännande aktiviteter</p>
          </div>
          <div class="flex items-center space-x-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Sortera:
            </label>
            <div class="relative">
              <select
                v-model="sortBy"
                class="pl-4 pr-10 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                       rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none"
              >
                <option value="rating-desc">Betyg: Högst först</option>
                <option value="rating-asc">Betyg: Lägst först</option>
                <option value="price-desc">Pris: Högst först</option>
                <option value="price-asc">Pris: Lägst först</option>
              </select>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
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
      </section>

      <!-- Articles Section -->
      <section class="mb-16">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Artiklar</h2>
          
        </div>
        <ArticleList :articles="articles" />
      </section>
    </main>
    <Footer />
  </div>
</template>