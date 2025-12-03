import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import rawExperiences from '@/data/data.json'
import type { AgeGroup, Experience } from '@/types/Experience'

const experiences = rawExperiences as Experience[]

type BookingSelection = {
  id: string
  experienceId: string
  price: number
  ageGroup: AgeGroup | ''
  date: string
  totalPeople: number
  createdAt: number
}



export const useCartStore = defineStore('cart', () => {
  const selectedExperienceId = ref<string | null>(null)
  const ageGroup = ref<AgeGroup | ''>('')
  const date = ref('')
  const price = ref(0)
  const totalPeople = ref(1)
  const selections = ref<BookingSelection[]>([])
  const normalizeTotalPeople = (value: number) => (value > 0 ? Math.trunc(value) : 1)

  const selectedExperience = computed(
    () => experiences.find((exp) => exp.id === selectedExperienceId.value) ?? null,
  )
  function setPrice(value: number) {
    price.value = value
  }
  function setExperience(id: string | null) {
    selectedExperienceId.value = id
    const experiencePrice =
      id !== null ? experiences.find((exp) => exp.id === id)?.price ?? 0 : 0
    price.value = experiencePrice
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
    price.value = exp.price
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
      price: price.value || selectedExperience.value?.price || 0,
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
    price.value = 0
    totalPeople.value = 1
    selections.value = []
  }


  return {
    ageGroup,
    date,
    price,
    totalPeople,
    selectedExperienceId,
    selectedExperience,
    selections,
    setExperience,
    setAgeGroup,
    setDate,
    setTotalPeople,
    setPrice,
    hydrateFromExperience,
    addSelection,
    clear,
    experiences,
  }
})
