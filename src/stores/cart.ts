import { StorageSerializers, useStorage } from '@vueuse/core'
import { computed } from 'vue'
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
  const selectedExperienceId = useStorage<string | null>('cart:selectedExperienceId', null, undefined, {
    serializer: StorageSerializers.object,
  })
  const ageGroup = useStorage<AgeGroup | ''>('cart:ageGroup', '', undefined, {
    serializer: StorageSerializers.object,
  })
  const date = useStorage('cart:date', '')
  const totalPeople = useStorage('cart:totalPeople', 1, undefined, {
    serializer: StorageSerializers.number,
  })
  const selections = useStorage<BookingSelection[]>('cart:selections', [], undefined, {
    serializer: StorageSerializers.object,
  })
  const normalizeTotalPeople = (value: number) => (value > 0 ? Math.trunc(value) : 1)
  totalPeople.value = normalizeTotalPeople(totalPeople.value)

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
    experiences,
  }
})
