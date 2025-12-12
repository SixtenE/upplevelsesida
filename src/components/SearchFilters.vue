<script lang="ts" setup>
import type { AgeGroup } from '@/types/Experience'

interface Props {
  location?: string
  date?: string
  groupSize?: number
  ageGroup?: AgeGroup | ''
}

interface Emits {
  (e: 'update:location', value: string): void
  (e: 'update:date', value: string): void
  (e: 'update:groupSize', value: number): void
  (e: 'update:ageGroup', value: AgeGroup | ''): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  location: '',
  date: '',
  groupSize: 1,
  ageGroup: '',
})

const emit = defineEmits<Emits>()

const ageGroupOptions: { value: AgeGroup | ''; label: string }[] = [
  { value: '', label: 'Alla åldrar' },
  { value: 'child', label: 'Barn' },
  { value: 'adult', label: 'Vuxen' },
  { value: 'senior', label: 'Senior' },
]

const updateLocation = (value: string) => {
  emit('update:location', value)
}

const updateDate = (value: string) => {
  emit('update:date', value)
}

const updateGroupSize = (value: number) => {
  emit('update:groupSize', value)
}

const updateAgeGroup = (value: string) => {
  emit('update:ageGroup', value as AgeGroup | '')
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="w-full grid grid-cols-1 sm:grid-cols-4 gap-4">
      <!-- Location Input -->
      <div class="space-y-2">
        <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Plats
        </label>
        <div class="relative">
          <input
            type="text"
            id="location"
            :value="props.location"
            @input="updateLocation(($event.target as HTMLInputElement).value)"
            class="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                   rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Ange plats..."
            list="locations"
          />
          <datalist id="locations">
            <option value="Stockholm"></option>
            <option value="Göteborg"></option>
            <option value="Malmö"></option>
            <option value="Uppsala"></option>
            <option value="Västerås"></option>
            <option value="Örebro"></option>
            <option value="Linköping"></option>
            <option value="Helsingborg"></option>
            <option value="Jönköping"></option>
            <option value="Norrköping"></option>
          </datalist>
          <!-- Search icon - moved to left side to avoid overlap -->
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Date Input -->
      <div class="space-y-2">
        <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Datum
        </label>
        <div class="relative">
          <input
            type="date"
            id="date"
            :value="props.date"
            @input="updateDate(($event.target as HTMLInputElement).value)"
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                   rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :min="new Date().toISOString().split('T')[0]"
          />
          <!-- No icon for date input - let browser handle it -->
        </div>
      </div>

      <!-- Age Group Select -->
      <div class="space-y-2">
        <label for="age_group" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Åldersgrupp
        </label>
        <div class="relative">
          <select
            id="age_group"
            :value="props.ageGroup"
            @change="updateAgeGroup(($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                   rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent transition-all duration-200 appearance-none pr-10"
          >
            <option v-for="option in ageGroupOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <!-- Custom dropdown arrow (positioned far right) -->
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Group Size Input -->
      <div class="space-y-2">
        <label for="group_size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Antal personer
        </label>
        <div class="relative">
          <input
            type="number"
            id="group_size"
            :value="props.groupSize"
            @input="updateGroupSize(Number(($event.target as HTMLInputElement).value))"
            min="1"
            class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                   rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent transition-all duration-200 text-center pr-16"
          />
          <!-- Number controls positioned on right side -->
          <div class="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              @click="updateGroupSize(Math.max(1, props.groupSize - 1))"
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 
                     dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              :disabled="props.groupSize <= 1"
              :class="{ 'opacity-50 cursor-not-allowed': props.groupSize <= 1 }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            <button
              type="button"
              @click="updateGroupSize(props.groupSize + 1)"
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 
                     dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Button -->
    <div class="flex justify-end">
      <button
        @click="$emit('clear')"
        class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 
               hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 
               rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Rensa filter
      </button>
    </div>
  </div>
</template>