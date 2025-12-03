import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import rawExperiences from '@/data/data.json'
import type { AgeGroup, Experience } from '@/types/Experience'

const experiences = rawExperiences as Experience[]

type BookingSelection = {
  id: string
  experienceId: string
  ageGroup: AgeGroup | ''
  date: string
  totalPeople: number
  createdAt: number
}



export const useCartStore = defineStore('cart', () => {
  const selectedExperienceId = ref<string | null>(null)
  const ageGroup = ref<AgeGroup | ''>('')
  const date = ref('')
  const totalPeople = ref(1)
  const selections = ref<BookingSelection[]>([])
  const normalizeTotalPeople = (value: number) => (value > 0 ? Math.trunc(value) : 1)

  const selectedExperience = computed(
    () => experiences.find((exp) => exp.id === selectedExperienceId.value) ?? null,
  )

  function setExperience(id: string | null) {
    selectedExperienceId.value = id
  }

  function setAgeGroup(value: AgeGroup | '') {
    ageGroup.value = value
  }

  function setDate(value: string) {
    date.value = value
  }

  function setTotalPeople(value: number) {
    totalPeople.value = normalizeTotalPeople(value)
  }

  function hydrateFromExperience(exp: Experience) {
    selectedExperienceId.value = exp.id
    ageGroup.value = exp.age_group
    date.value = exp.date
  }

  function addSelection() {
    if (!selectedExperienceId.value) return

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Date.now().toString(36)

    selections.value.push({
      id,
      experienceId: selectedExperienceId.value,
      ageGroup: ageGroup.value,
      date: date.value,
      totalPeople: totalPeople.value,
      createdAt: Date.now(),
    })
  }

  function clear() {
    selectedExperienceId.value = null
    ageGroup.value = ''
    date.value = ''
    totalPeople.value = 1
    selections.value = []
  }


  return {
    ageGroup,
    date,
    totalPeople,
    selectedExperienceId,
    selectedExperience,
    selections,
    setExperience,
    setAgeGroup,
    setDate,
    setTotalPeople,
    hydrateFromExperience,
    addSelection,
    clear,
    experiences,
  }
})
