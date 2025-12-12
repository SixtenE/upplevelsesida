<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import experiencesData from '@/data/data.json'
import { useCartStore } from '@/stores/cart'
import type { AgeGroup, Experience, AddOn } from '@/types/Experience'

const experiences = experiencesData as Experience[]
const allowedAgeGroups: AgeGroup[] = ['child', 'adult', 'senior']

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const showSaved = ref(false)

const normalizeAgeGroup = (value: unknown): AgeGroup | '' =>
  typeof value === 'string' && allowedAgeGroups.includes(value as AgeGroup)
    ? (value as AgeGroup)
    : ''

const toFirstString = (value: LocationQuery[keyof LocationQuery]) => {
  if (Array.isArray(value)) return value[0] ?? undefined
  if (typeof value === 'string') return value
  return undefined
}

const parsePeople = (query: LocationQuery) => {
  const rawValue = query.people ?? query.total_people
  const numericValue = Array.isArray(rawValue) ? Number(rawValue[0]) : Number(rawValue)
  return Number.isFinite(numericValue) && numericValue > 0 ? Math.trunc(numericValue) : 1
}

const pickExperienceIdFromQuery = () => {
  const queryId = typeof route.query.id === 'string' ? route.query.id : ''
  return experiences.some((exp) => exp.id === queryId) ? queryId : (experiences[0]?.id ?? '')
}

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

// Get addons from the selected experience
const experienceAddons = computed(() => {
  return selectedExperience.value?.add_ons || []
})

const ageGroupOptions = computed(() => Array.from(new Set(experiences.map((exp) => exp.age_group))))

const applyExperienceDefaults = () => {
  if (!selectedExperience.value) return
  if (!state.ageGroup) state.ageGroup = selectedExperience.value.age_group
  if (!state.date) state.date = selectedExperience.value.date_range.start_date
}

applyExperienceDefaults()

// Get current selection for addons
const currentSelection = computed(() => {
  return cartStore.selections.find(s => s.experienceId === state.experienceId)
})

// Check if addon is selected
const isAddonSelected = (addonId: string) => {
  const selection = currentSelection.value
  if (!selection || !selection.addons) return false
  return selection.addons.includes(addonId)
}

// Toggle addon function
const toggleAddonSelection = (addonId: string) => {
  if (!currentSelection.value) {
    // Create selection first if it doesn't exist
    cartStore.setExperience(state.experienceId || null)
    cartStore.setAgeGroup(state.ageGroup as AgeGroup | '')
    cartStore.setDate(state.date)
    cartStore.setTotalPeople(state.totalPeople)
    cartStore.addSelection()
  }
  cartStore.toggleAddon(addonId)
}

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

const canSubmit = computed(
  () =>
    Boolean(state.experienceId) &&
    Boolean(state.ageGroup) &&
    Boolean(state.date) &&
    state.totalPeople > 0,
)

const handleSubmit = () => {
  if (!canSubmit.value) return
  cartStore.setExperience(state.experienceId || null)
  cartStore.setAgeGroup(state.ageGroup as AgeGroup | '')
  cartStore.setDate(state.date)
  cartStore.setTotalPeople(state.totalPeople)
  cartStore.addSelection()
  showSaved.value = true

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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bokning</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Välj upplevelse och anpassa efter dina preferenser
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left: Booking Form -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Bokningsformulär
            </h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="space-y-4">
                <!-- Experience Select -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upplevelse
                  </label>
                  <select
                    v-model="state.experienceId"
                    class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                           rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent transition-all duration-200"
                  >
                    <option v-for="experience in experiences" :key="experience.id" :value="experience.id">
                      {{ experience.title }}
                    </option>
                  </select>
                </div>

                <!-- Age Group Select -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Åldersgrupp
                  </label>
                  <select
                    v-model="state.ageGroup"
                    class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                           rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Välj åldersgrupp</option>
                    <option v-for="group in ageGroupOptions" :key="group" :value="group">
                      {{ group === 'child' ? 'Barn' : group === 'adult' ? 'Vuxen' : 'Senior' }}
                    </option>
                  </select>
                </div>

                <!-- Date Input -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Datum
                  </label>
                  <input
                    v-model="state.date"
                    type="date"
                    class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                           rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent transition-all duration-200"
                  />
                </div>

                <!-- People Input -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Antal personer
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="state.totalPeople"
                      type="number"
                      min="1"
                      class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                             rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all duration-200 text-center"
                    />
                    <div class="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        @click="state.totalPeople = Math.max(1, state.totalPeople - 1)"
                        class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 
                               dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        @click="state.totalPeople = state.totalPeople + 1"
                        class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 
                               dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Experience-specific Addons Section -->
              <div v-if="experienceAddons.length > 0" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Tillägg för denna upplevelse
                </h3>
                <div class="space-y-3">
                  <label 
                    v-for="addon in experienceAddons" 
                    :key="addon.id"
                    class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 
                           rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    :class="{ 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20': isAddonSelected(addon.id) }"
                  >
                    <div class="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        :checked="isAddonSelected(addon.id)" 
                        @change="toggleAddonSelection(addon.id)"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span class="font-medium text-gray-900 dark:text-white">{{ addon.title }}</span>
                      </div>
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ addon.price }} kr
                    </span>
                  </label>
                </div>
                
                <!-- Addon total summary -->
                <div 
                  v-if="currentSelection && currentSelection.addons && currentSelection.addons.length > 0" 
                  class="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Valda tillägg:</p>
                  <div class="space-y-1">
                    <div 
                      v-for="addonId in currentSelection.addons" 
                      :key="addonId"
                      class="flex justify-between text-sm text-white"
                    >
                      <span class="text-white-700 dark:text-white-300">
                        {{ experienceAddons.find(a => a.id === addonId)?.title }}
                      </span>
                      <span class="font-medium">
                        +{{ experienceAddons.find(a => a.id === addonId)?.price }} kr
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="!canSubmit"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                         rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                         flex-1 min-w-[120px]"
                >
                  Lägg till i varukorg
                </button>
                
                <RouterLink
                  to="/checkout"
                  :class="[
                    'px-6 py-3 font-medium rounded-xl transition-colors flex-1 min-w-[120px] text-center',
                    cartStore.selections.length > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  ]"
                  :disabled="cartStore.selections.length === 0"
                >
                  Gå till kassa
                </RouterLink>
                
                <button
                  type="button"
                  @click="clearCart"
                  class="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 
                         bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 
                         rounded-xl transition-colors"
                >
                  Rensa varukorg
                </button>
              </div>
            </form>

            <!-- Saved Notification -->
            <transition name="fade">
              <div 
                v-if="showSaved"
                class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 
                       rounded-lg text-green-800 dark:text-green-300 text-sm flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 13l4 4L19 7"/>
                </svg>
                Upplevelsen har lagts till i varukorgen!
              </div>
            </transition>
          </div>

          <!-- Cart Summary -->
          <div 
            v-if="cartStore.selections.length > 0"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Din varukorg ({{ cartStore.selections.length }})
            </h3>
            <div class="space-y-3">
              <div 
                v-for="selection in cartStore.selections" 
                :key="selection.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ cartStore.experiences.find(e => e.id === selection.experienceId)?.title || 'Upplevelse' }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ selection.totalPeople }} personer · {{ selection.price }} kr/person
                  </p>
                  <!-- Show selected addons -->
                  <div v-if="selection.addons && selection.addons.length > 0" class="mt-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Tillägg:</p>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span 
                        v-for="addonId in selection.addons" 
                        :key="addonId"
                        class="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                      >
                        {{
                          cartStore.experiences
                            .find(e => e.id === selection.experienceId)
                            ?.add_ons?.find(a => a.id === addonId)?.title || 'Tillägg'
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <span class="font-semibold text-blue-600 dark:text-blue-400">
                  {{ selection.price * selection.totalPeople }} kr
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Experience Preview -->
        <div class="space-y-6">
          <div 
            v-if="selectedExperience"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                   overflow-hidden"
          >
            <!-- Image -->
            <div class="relative h-64 md:h-80">
              <img
                :src="selectedExperience.image_url"
                :alt="selectedExperience.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {{ selectedExperience.price }} kr/person
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {{ selectedExperience.title }}
              </h3>
              
              <div class="space-y-3 mb-4">
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{{ selectedExperience.location }}</span>
                </div>
                
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>
                    {{ new Date(selectedExperience.date_range.start_date).toLocaleDateString('sv-SE') }} 
                    - 
                    {{ new Date(selectedExperience.date_range.end_date).toLocaleDateString('sv-SE') }}
                  </span>
                </div>
                
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>
                    {{ selectedExperience.age_group === 'child' ? 'Barn' : 
                       selectedExperience.age_group === 'adult' ? 'Vuxen' : 'Senior' }}
                  </span>
                </div>
              </div>

              <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {{ selectedExperience.description }}
              </p>

              <!-- Show available addons in preview -->
              <div v-if="selectedExperience.add_ons && selectedExperience.add_ons.length > 0" 
                   class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">Tillgängliga tillägg:</h4>
                <div class="space-y-2">
                  <div 
                    v-for="addon in selectedExperience.add_ons" 
                    :key="addon.id"
                    class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ addon.title }}</span>
                    <span class="text-sm font-medium text-blue-600 dark:text-blue-400">+{{ addon.price }} kr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div 
            v-else
            class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 
                   rounded-2xl p-6 text-yellow-800 dark:text-yellow-300"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.198 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <div>
                <p class="font-medium">Inga upplevelser hittades</p>
                <p class="text-sm mt-1">Lägg till upplevelser i data.json för att börja boka.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>