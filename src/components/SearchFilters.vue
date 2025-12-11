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
  <div class="w-full sm:w-2xl flex flex-col gap-6 px-2">
    <div
      class="w-full px-8 py-3 grid grid-cols-1 sm:grid-cols-4 bg-neutral-100 border-b-4 border-neutral-300 rounded-sm"
    >
      <div
        class="w-full border-b sm:border-b-0 sm:border-r border-neutral-500 h-full flex flex-col justify-center items-center pl-4"
      >
        <label for="location" class="w-full text-sm font-medium">Var</label>
        <input
          type="text"
          id="location"
          :value="props.location"
          @input="updateLocation(($event.target as HTMLInputElement).value)"
          class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
          placeholder="Sök efter en plats"
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
      </div>
      <div
        class="w-full border-b sm:border-b-0 sm:border-r border-neutral-500 h-full flex flex-col justify-center items-center pl-4"
      >
        <label for="date" class="w-full text-sm font-medium">När</label>
        <input
          type="date"
          id="date"
          :value="props.date"
          @input="updateDate(($event.target as HTMLInputElement).value)"
          class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
          placeholder="Lägg till datum"
        />
      </div>
      <div
        class="w-full border-b sm:border-b-0 sm:border-r border-neutral-500 h-full flex flex-col justify-center items-center pl-4"
      >
        <label for="age_group" class="w-full text-sm font-medium">Ålderskategori</label>
        <select
          id="age_group"
          :value="props.ageGroup"
          @change="updateAgeGroup(($event.target as HTMLSelectElement).value)"
          class="w-full text-sm text-neutral-800 focus:outline-none bg-transparent"
        >
          <option v-for="option in ageGroupOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="w-full h-full flex flex-col justify-center items-center pl-4">
        <label for="group_size" class="w-full text-sm font-medium">Antal</label>
        <input
          type="number"
          id="group_size"
          :value="props.groupSize"
          @input="updateGroupSize(Number(($event.target as HTMLInputElement).value))"
          min="1"
          class="w-full placeholder:text-sm text-neutral-800 text-sm placeholder:font-normal placeholder:text-neutral-600 focus:outline-none"
          placeholder="Lägg till personer"
        />
      </div>
    </div>
  </div>
</template>
