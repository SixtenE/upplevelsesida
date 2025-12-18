import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import rawExperiences from '@/data/data.json'
import type { AgeGroup, Experience } from '@/types/Experience'
import type { Addon } from '@/types/Addon'

const experiences = rawExperiences as Experience[]

type BookingSelection = {
  id: string
  experienceId: string
  price: number
  ageGroup: AgeGroup | ''
  date: string
  totalPeople: number
  addons: string[] // Just store addon IDs
  createdAt: number
}

export const useCartStore = defineStore('cart', () => {
  const selectedExperienceId = ref<string | null>(null)
  const ageGroup = ref<AgeGroup | ''>('')
  const date = ref('')
  const price = ref(0)
  const totalPeople = ref(1)
  const selections = ref<BookingSelection[]>([])
  
  // Simple addons array - add your addons here
  const addons = ref<Addon[]>([
    { id: 'food', title: 'Matpaket', price: 199, description: 'Lunch eller middag' },
    { id: 'insurance', title: 'Försäkring', price: 99, description: 'Avbokningsförsäkring' },
    { id: 'transport', title: 'Transport', price: 299, description: 'Hämtning & hemkörning' },
    { id: 'photo', title: 'Fotopaket', price: 149, description: 'Professionella foton' },
  ])

  const normalizeTotalPeople = (value: number) => (value > 0 ? Math.trunc(value) : 1)

  const selectedExperience = computed(
    () => experiences.find((exp) => exp.id === selectedExperienceId.value) ?? null,
  )
  
  // Get selected addons for current selection
  const selectedAddons = computed(() => {
    const selection = selections.value.find(s => s.experienceId === selectedExperienceId.value)
    if (!selection) return []
    return addons.value.filter((addon: Addon) => selection.addons.includes(addon.id))
  })

  function setPrice(value: number) {
    price.value = value
  }
  
  function setExperience(id: string | null) {
    selectedExperienceId.value = id
    const experiencePrice = id !== null ? (experiences.find((exp) => exp.id === id)?.price ?? 0) : 0
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
    date.value = exp.date_range.start_date
    price.value = exp.price
  }

  // Simple addon toggle function
  function toggleAddon(addonId: string) {
    const selection = selections.value.find(s => s.experienceId === selectedExperienceId.value)
    if (!selection) return
    
    const index = selection.addons.indexOf(addonId)
    if (index > -1) {
      selection.addons.splice(index, 1)
    } else {
      selection.addons.push(addonId)
    }
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
      addons: [], // Start with empty addons
      createdAt: Date.now(),
    })
  }

  function removeSelection(selectionId: string) {
    const index = selections.value.findIndex(s => s.id === selectionId)
    if (index > -1) {
      selections.value.splice(index, 1)
    }
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
    // State
    ageGroup,
    date,
    price,
    totalPeople,
    selectedExperienceId,
    selections,
    addons,
    
    // Computed
    selectedExperience,
    selectedAddons,
    
    // Actions
    setExperience,
    setAgeGroup,
    setDate,
    setTotalPeople,
    setPrice,
    hydrateFromExperience,
    addSelection,
    toggleAddon,
    removeSelection,
    clear,
    
    // Data
    experiences,
  }
})