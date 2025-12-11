<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'

import experiencesData from '@/data/data.json'
import { useCartStore } from '@/stores/cart'
import type { AgeGroup, Experience } from '@/types/Experience'

const experiences = experiencesData as Experience[]
const allowedAgeGroups: AgeGroup[] = ['child', 'adult', 'senior']

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const showSaved = ref(false)
// normaliserar age_group från query
const normalizeAgeGroup = (value: unknown): AgeGroup | '' =>
  typeof value === 'string' && allowedAgeGroups.includes(value as AgeGroup)
    ? (value as AgeGroup)
    : ''
// hämtar första strängen från query värde
const toFirstString = (value: LocationQuery[keyof LocationQuery]) => {
  if (Array.isArray(value)) return value[0] ?? undefined
  if (typeof value === 'string') return value
  return undefined
}

// parserar antal personer från query
const parsePeople = (query: LocationQuery) => {
  const rawValue = query.people ?? query.total_people
  const numericValue = Array.isArray(rawValue) ? Number(rawValue[0]) : Number(rawValue)
  return Number.isFinite(numericValue) && numericValue > 0 ? Math.trunc(numericValue) : 1
}

// hämtar experience id från query
const pickExperienceIdFromQuery = () => {
  const queryId = typeof route.query.id === 'string' ? route.query.id : ''
  return experiences.some((exp) => exp.id === queryId) ? queryId : (experiences[0]?.id ?? '')
}

// state som innehåller formulärets data
const state = reactive({
  experienceId: pickExperienceIdFromQuery(),
  ageGroup: normalizeAgeGroup(route.query.age_group),
  date: typeof route.query.date === 'string' ? route.query.date : '',
  totalPeople: parsePeople(route.query),
})

let hideSavedTimer: ReturnType<typeof setTimeout> | null = null

const selectedExperience = computed(
  () => experiences.find((exp) => exp.id === state.experienceId) ?? null,
)

const ageGroupOptions = computed(() => Array.from(new Set(experiences.map((exp) => exp.age_group))))

const applyExperienceDefaults = () => {
  if (!selectedExperience.value) return
  if (!state.ageGroup) state.ageGroup = selectedExperience.value.age_group
  if (!state.date) state.date = selectedExperience.value.date_range.start_date
}

applyExperienceDefaults()
// updaterar state när query ändras
watch(
  () => route.query,
  (query) => {
    const nextExperienceId =
      typeof query.id === 'string' && experiences.some((exp) => exp.id === query.id) ? query.id : ''
    if (nextExperienceId && nextExperienceId !== state.experienceId) {
      state.experienceId = nextExperienceId
    }

    const nextAgeGroup = normalizeAgeGroup(query.age_group)
    if (nextAgeGroup && nextAgeGroup !== state.ageGroup) {
      state.ageGroup = nextAgeGroup
    }

    const nextDate = typeof query.date === 'string' ? query.date : ''
    if (nextDate && nextDate !== state.date) {
      state.date = nextDate
    }

    const nextTotal = parsePeople(query)
    if (nextTotal !== state.totalPeople) {
      state.totalPeople = nextTotal
    }
  },
)

watch(
  () => state.experienceId,
  () => {
    applyExperienceDefaults()
  },
)
//bygger query från state
const buildQuery = () => {
  const preservedEntries: Record<string, string> = {}
  Object.entries(route.query).forEach(([key, value]) => {
    if (['id', 'age_group', 'date', 'people', 'total_people'].includes(key)) {
      return
    }
    const stringValue = toFirstString(value)
    if (stringValue) {
      preservedEntries[key] = stringValue
    }
  })

  if (state.experienceId) preservedEntries.id = state.experienceId
  if (state.ageGroup) preservedEntries.age_group = state.ageGroup
  if (state.date) preservedEntries.date = state.date
  preservedEntries.people = String(state.totalPeople)

  return preservedEntries
}
// jämförar nuvarande query med nästa query så att det inte händer onödiga router.replace
const isSameQuery = (nextQuery: Record<string, string>) => {
  const currentQuery: Record<string, string> = {}
  Object.entries(route.query).forEach(([key, value]) => {
    const stringValue = toFirstString(value)
    if (stringValue !== undefined) currentQuery[key] = stringValue
  })

  const keys = new Set([...Object.keys(currentQuery), ...Object.keys(nextQuery)])
  for (const key of keys) {
    if (currentQuery[key] !== nextQuery[key]) {
      return false
    }
  }
  return true
}
//
const canSubmit = computed(
  () =>
    Boolean(state.experienceId) &&
    Boolean(state.ageGroup) &&
    Boolean(state.date) &&
    state.totalPeople > 0,
)
// när du skickar in formuläret
const handleSubmit = () => {
  if (!canSubmit.value) return
  cartStore.setExperience(state.experienceId || null)
  cartStore.setAgeGroup(state.ageGroup as AgeGroup | '')
  cartStore.setDate(state.date)
  cartStore.setTotalPeople(state.totalPeople)
  cartStore.addSelection()
  showSaved.value = true
  console.log(cartStore.selections)

  if (hideSavedTimer) {
    clearTimeout(hideSavedTimer)
  }
  hideSavedTimer = setTimeout(() => {
    showSaved.value = false
  }, 2000)
}

watch(
  () => ({ ...state }),
  () => {
    const nextQuery = buildQuery()
    if (!isSameQuery(nextQuery)) {
      router.replace({ query: nextQuery })
    }
  },
  { deep: true, immediate: true },
)

const clearCart = () => {
  cartStore.clear()
  state.ageGroup = ''
  state.date = ''
  state.totalPeople = 1
}
</script>

<template>
  <section class="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-slate-100">
    <div class="container mx-auto max-w-4xl px-4 py-12 flex flex-col gap-8">
    <form
      class="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg backdrop-blur flex flex-col gap-6 p-6"
      @submit.prevent="handleSubmit"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="flex flex-col gap-2 text-sm font-medium text-slate-100">
          <span>Experience</span>
          <select
            v-model="state.experienceId"
            class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 shadow-inner focus:border-blue-500 focus:outline-none"
          >
            <option v-for="experience in experiences" :key="experience.id" :value="experience.id">
              {{ experience.title }}
            </option>
          </select>
        </label>

        <label class="flex flex-col gap-2 text-sm font-medium text-slate-100">
          <span>Age group</span>
          <select
            v-model="state.ageGroup"
            class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 shadow-inner focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select</option>
            <option v-for="group in ageGroupOptions" :key="group" :value="group">
              {{ group }}
            </option>
          </select>
        </label>

        <label class="flex flex-col gap-2 text-sm font-medium text-slate-100">
          <span>Date</span>
          <input
            v-model="state.date"
            type="date"
            class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 shadow-inner focus:border-blue-500 focus:outline-none"
          />
        </label>

        <label class="flex flex-col gap-2 text-sm font-medium text-slate-100">
          <span>Total people</span>
          <input
            v-model.number="state.totalPeople"
            type="number"
            min="1"
            class="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 shadow-inner focus:border-blue-500 focus:outline-none"
          />
        </label>
      </div>

      <div class="flex justify-end">
        <router-link class="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400 transition disabled:cursor-not-allowed disabled:bg-slate-700" to="/checkout">> Checkout</router-link>
        <button
          class="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400 transition disabled:cursor-not-allowed disabled:bg-slate-700"
          type="submit"
          :disabled="!canSubmit"
        >
          buy
        </button>
        <button
          class="ml-3 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 shadow hover:bg-slate-800"
          type="button"
          @click="clearCart"
        >
          Clear cart
        </button>
      </div>
    </form>

    <transition name="fade">
      <div
        v-if="showSaved"
        class="fixed bottom-6 right-6 rounded-xl bg-slate-900/90 text-white px-4 py-3 text-sm shadow-lg shadow-blue-500/15"
      >
        Sparat denna bokning!
      </div>
    </transition>

    <div
      v-if="selectedExperience"
      class="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg p-6 flex flex-col gap-2"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Selected experience</p>
      <h2 class="text-xl font-semibold text-white">{{ selectedExperience.title }}</h2>
      <p class="text-sm text-slate-300">
        {{ selectedExperience.location }} - {{ selectedExperience.date }} -
        Age: {{ selectedExperience.age_group }}
      </p>
      <p class="text-sm text-slate-200">{{ selectedExperience.description }}</p>
      <p class="text-lg font-semibold text-emerald-300 mt-2">{{ selectedExperience.price }} kr</p>
      <img :src="selectedExperience.image_url" :alt="selectedExperience.title" class="rounded-lg mt-4 border border-slate-800" />
    </div>

    <div v-else class="rounded-2xl border border-amber-400/70 bg-amber-400/10 text-amber-100 p-4 text-sm">
      No experiences in data.json - add an entry first.
    </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
