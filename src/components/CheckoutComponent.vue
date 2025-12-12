<script lang="ts" setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const showConfirmation = ref(false)

const lineItems = computed(() =>
  cartStore.selections.map((selection) => {
    const experience = cartStore.experiences.find((exp) => exp.id === selection.experienceId)
    const unitPrice = selection.price || experience?.price || 0
    
    // Calculate addons total for this selection
    const addonsTotal = selection.addons?.reduce((total, addonId) => {
      const addon = experience?.add_ons?.find(a => a.id === addonId)  // Use add_ons
      return total + (addon?.price || 0)
    }, 0) || 0
    
    const lineTotal = (unitPrice + addonsTotal) * selection.totalPeople
    
    return { 
      selection, 
      experience, 
      unitPrice, 
      addonsTotal,
      lineTotal,
      selectedAddons: selection.addons?.map(addonId => 
        experience?.add_ons?.find(a => a.id === addonId)
      ).filter(Boolean) || []
    }
  }),
)

const hasItems = computed(() => lineItems.value.length > 0)
const totalPeople = computed(() =>
  lineItems.value.reduce((sum, item) => sum + item.selection.totalPeople, 0),
)

// Calculate subtotal including addons
const subtotal = computed(() => 
  lineItems.value.reduce((sum, item) => sum + item.lineTotal, 0)
)

// Calculate just the addons total
const addonsTotal = computed(() =>
  lineItems.value.reduce((sum, item) => sum + (item.addonsTotal * item.selection.totalPeople), 0)
)

// Calculate just the experience base total
const experiencesTotal = computed(() =>
  lineItems.value.reduce((sum, item) => sum + (item.unitPrice * item.selection.totalPeople), 0)
)

const formatDate = (value: string) => {
  if (!value) return 'Datum saknas'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })
}

const handlePlaceOrder = () => {
  if (!hasItems.value) return
  showConfirmation.value = true
  setTimeout(() => {
    showConfirmation.value = false
  }, 2200)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kassa</h1>
            <p class="text-gray-600 dark:text-gray-400">
              Granska och bekräfta din beställning
            </p>
          </div>
          
          <div class="flex gap-3">
            <RouterLink
              to="/bokning"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                     rounded-lg transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Tillbaka till bokning
            </RouterLink>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                     bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 
                     rounded-lg transition-colors flex items-center gap-2"
              @click="cartStore.clear"
              :disabled="!hasItems"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Töm varukorg
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Items -->
        <div class="lg:col-span-2">
          <div v-if="hasItems" class="space-y-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Dina bokningar ({{ lineItems.length }})
            </h2>
            
            <div class="space-y-4">
              <article
                v-for="item in lineItems"
                :key="item.selection.id"
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                       p-6 flex gap-6 hover:shadow-xl transition-shadow duration-200"
              >
                <!-- Image -->
                <div class="w-32 h-32 flex-shrink-0">
                  <div class="relative w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      v-if="item.experience?.image_url"
                      :src="item.experience.image_url"
                      :alt="item.experience.title"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center text-sm text-gray-400 dark:text-gray-500"
                    >
                      Ingen bild
                    </div>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 flex flex-col">
                  <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {{ item.experience?.title ?? 'Upplevelse' }}
                      </h3>
                      <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          {{ item.experience?.location || 'Plats saknas' }}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          {{ formatDate(item.selection.date || item.experience?.date_range.start_date || '') }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="text-right">
                      <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {{ item.lineTotal }} kr
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ item.unitPrice }} kr / person
                        <span v-if="item.addonsTotal > 0" class="text-emerald-600 dark:text-emerald-400">
                          + {{ item.addonsTotal }} kr tillägg
                        </span>
                      </div>
                    </div>
                  </div>

                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {{ item.experience?.description || 'Ingen beskrivning tillagd.' }}
                  </p>

                  <!-- Selected Addons -->
                  <div v-if="item.selectedAddons.length > 0" class="mb-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Valda tillägg:</p>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="addon in item.selectedAddons" 
                        :key="addon?.id"
                        class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 
                               text-xs font-medium rounded-full flex items-center gap-1"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {{ addon?.title }} (+{{ addon?.price }} kr)
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 mt-auto">
                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                text-xs font-medium rounded-full">
                      {{ item.selection.totalPeople }} personer
                    </span>
                    <span 
                      v-if="item.selection.ageGroup"
                      class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                             text-xs font-medium rounded-full"
                    >
                      Åldersgrupp: {{ item.selection.ageGroup }}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 
                   p-12 text-center shadow-sm"
          >
            <div class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Din varukorg är tom
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Lägg till minst en upplevelse i bokningsformuläret för att se den här.
            </p>
            <RouterLink
              to="/bokning"
              class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                     font-medium rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Tillbaka till bokning
            </RouterLink>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                     p-6 sticky top-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Orderöversikt</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ lineItems.length }} upplevelser
                </p>
              </div>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 
                         text-sm font-medium rounded-full">
                {{ lineItems.length }} st
              </span>
            </div>

            <dl class="space-y-3 mb-6">
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Antal personer</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ totalPeople }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Upplevelser</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ lineItems.length }}</dd>
              </div>
              
              <!-- Experience base price -->
              <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <dt class="text-gray-600 dark:text-gray-400">Upplevelser totalt</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ experiencesTotal }} kr</dd>
              </div>
              
              <!-- Addons total -->
              <div v-if="addonsTotal > 0" class="flex justify-between">
                <dt class="text-gray-600 dark:text-gray-400">Tillägg totalt</dt>
                <dd class="font-medium text-emerald-600 dark:text-emerald-400">+ {{ addonsTotal }} kr</dd>
              </div>
              
              <!-- Grand total -->
              <div class="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <dt class="text-lg font-semibold text-gray-900 dark:text-white">Summa</dt>
                <dd class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ subtotal }} kr
                </dd>
              </div>
            </dl>

            <button
              type="button"
              class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                     rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                     flex items-center justify-center gap-2"
              :disabled="!hasItems"
              @click="handlePlaceOrder"
            >
              <svg v-if="!showConfirmation" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5 13l4 4L19 7"/>
              </svg>
              {{ showConfirmation ? 'Tack för din beställning!' : 'Bekräfta beställning' }}
            </button>

            <div 
              v-if="showConfirmation"
              class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 
                     rounded-lg text-green-800 dark:text-green-300 text-sm"
            >
              Beställningen är mottagen! Vi skickar en bekräftelse inom kort.
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                Genom att klicka på "Bekräfta beställning" godkänner du våra 
                <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">villkor</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>