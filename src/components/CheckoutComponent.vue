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
    const lineTotal = unitPrice * selection.totalPeople
    return { selection, experience, unitPrice, lineTotal }
  }),
)

const hasItems = computed(() => lineItems.value.length > 0)
const totalPeople = computed(() =>
  lineItems.value.reduce((sum, item) => sum + item.selection.totalPeople, 0),
)
const subtotal = computed(() => lineItems.value.reduce((sum, item) => sum + item.lineTotal, 0))

const formatDate = (value: string) => {
  if (!value) return 'Date missing'
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
  <section
    class="min-h-screen bg-linear-to-b from-black via-neutral-950 to-black py-12 text-slate-100"
  >
    <div class="container mx-auto max-w-6xl px-4 flex flex-col gap-8">
      <header class="flex flex-col gap-3">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div class="space-y-2">
            <h1 class="text-3xl md:text-4xl font-semibold text-white">Checkout</h1>
          </div>
          <div class="flex gap-3">
            <RouterLink
              to="/bokning"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-blue-500/10 hover:-translate-y-[1px] hover:border-blue-400 hover:text-white transition"
            >
              Edit booking
            </RouterLink>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-blue-500/10 hover:-translate-y-[1px] hover:border-blue-400 hover:text-white transition"
              @click="cartStore.clear"
            >
              Clear cart
            </button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-4">
          <div v-if="hasItems" class="flex flex-col gap-4">
            <article
              v-for="item in lineItems"
              :key="item.selection.id"
              class="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg p-4 md:p-6 flex gap-4 md:gap-6"
            >
              <div
                class="relative h-28 w-28 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0"
              >
                <img
                  v-if="item.experience?.image_url"
                  :src="item.experience.image_url"
                  :alt="item.experience.title"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-xs text-slate-400"
                >
                  No image
                </div>
              </div>

              <div class="flex-1 flex flex-col gap-3">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div class="space-y-1">
                    <h2 class="text-lg font-semibold text-white">
                      {{ item.experience?.title ?? 'Upplevelse' }}
                    </h2>
                    <p class="text-sm text-slate-300">
                      {{ item.experience?.location || 'Plats saknas' }} |
                      {{
                        formatDate(
                          item.selection.date || item.experience?.date_range.start_date || '',
                        )
                      }}
                      | Age: {{ item.selection.ageGroup || item.experience?.age_group || 'Okand' }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-slate-400">Totalt</p>
                    <p class="text-xl font-semibold text-emerald-300">{{ item.lineTotal }} kr</p>
                  </div>
                </div>

                <p class="text-sm text-slate-200 line-clamp-2">
                  {{ item.experience?.description || 'Ingen beskrivning tillagd.' }}
                </p>

                <div class="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                  <span
                    class="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-medium text-slate-100"
                  >
                    {{ item.unitPrice }} kr / person
                  </span>
                  <span
                    class="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-medium text-slate-100"
                  >
                    {{ item.selection.totalPeople }} personer
                  </span>
                  <span
                    class="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-medium text-slate-100"
                    v-if="item.selection.ageGroup"
                  >
                    Age group: {{ item.selection.ageGroup }}
                  </span>
                </div>
              </div>
            </article>
          </div>

          <div
            v-else
            class="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center shadow-lg flex flex-col items-center gap-4"
          >
            <p class="text-lg font-semibold text-white">No bookings yet</p>
            <p class="text-slate-300 max-w-md">
              Add at least one experience in the booking form and it will show up here for review.
            </p>
            <RouterLink
              to="/bokning"
              class="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-400 transition"
            >
              Back to booking
            </RouterLink>
          </div>
        </div>

        <aside
          class="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg p-5 md:p-6 h-fit"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Overview
              </p>
              <h3 class="text-xl font-semibold text-white">Order summary</h3>
            </div>
            <span
              class="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-blue-500/25"
            >
              {{ lineItems.length }} st
            </span>
          </div>

          <dl class="mt-4 space-y-2 text-sm text-slate-200">
            <div class="flex items-center justify-between">
              <dt>Antal personer</dt>
              <dd class="font-semibold text-white">{{ totalPeople }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt>Upplevelser</dt>
              <dd class="font-semibold text-white">{{ lineItems.length }}</dd>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-800">
              <dt class="text-base font-semibold text-white">Summa</dt>
              <dd class="text-lg font-semibold text-emerald-300">{{ subtotal }} kr</dd>
            </div>
          </dl>

          <button
            type="button"
            class="mt-6 w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-400 transition disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
            :disabled="!hasItems"
            @click="handlePlaceOrder"
          >
            Confirm booking
          </button>

          <p v-if="showConfirmation" class="mt-3 text-sm text-emerald-400">
            Booking saved! We will hold your spot and send a confirmation shortly.
          </p>
        </aside>
      </div>
    </div>
  </section>
</template>
