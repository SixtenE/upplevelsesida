<script lang="ts" setup>
import { ArrowUp } from 'lucide-vue-next'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="w-full mt-16">
    <!-- Back to top section -->
    <div class="w-full bg-white dark:bg-neutral-950 py-3">
      <div class="container mx-auto px-4 sm:px-0">
        <button
          @click="scrollToTop"
          class="w-full text-center text-black dark:text-white hover:opacity-70 transition-opacity text-sm flex items-center justify-center gap-1"
        >
          <ArrowUp class="w-4 h-4" />
          Tillbaka till toppen
        </button>
      </div>
    </div>

    <!-- Main footer content -->
    <div class="w-full bg-neutral-800 dark:bg-neutral-950 text-white py-12">
      <div class="container mx-auto px-4 sm:px-0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <!-- Company description column -->
          <div class="lg:col-span-1">
            <h3 class="text-lg font-bold mb-3">upplevelsesida © 2025</h3>
            <p class="text-sm text-neutral-300 leading-relaxed">
              Vi är stolta över att kunna erbjuda en upplevelseplattform med ett brett utbud av de
              bästa upplevelserna i Sverige.
            </p>
          </div>

          <!-- Mitt upplevelsesida column -->
          <div>
            <h3 class="text-base font-bold mb-4">Mitt upplevelsesida</h3>
            <ul class="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Mitt konto
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Försäkring
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Allmänna villkor
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Integritetspolicy
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Om cookies
                </a>
              </li>
            </ul>
          </div>

          <!-- Kundservice column -->
          <div>
            <h3 class="text-base font-bold mb-4">Kundservice</h3>
            <ul class="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Kontakta oss
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Frågor & svar
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Våra butiker
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Återförsäljare
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Kontrollera giltighetstiden
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Leverans
                </a>
              </li>
            </ul>
          </div>

          <!-- Företagsinfo column -->
          <div>
            <h3 class="text-base font-bold mb-4">Företagsinfo</h3>
            <ul class="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">Om oss</a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Support för återförsäljare
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Bli återförsäljare
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Bli partner
                </a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">Press</a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">Blogg</a>
              </li>
              <li>
                <a href="#" class="text-neutral-300 hover:text-white transition-colors">
                  Jobba hos oss
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom footer strip -->
    <div class="w-full bg-neutral-800 dark:bg-neutral-950 border-t border-neutral-700 py-6">
      <div class="container mx-auto px-4 sm:px-0">
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <!-- Social media links -->
          <div class="flex items-center gap-6 flex-wrap">
            <a href="#" class="text-white hover:text-neutral-300 transition-colors text-sm">
              Instagram
            </a>
            <a href="#" class="text-white hover:text-neutral-300 transition-colors text-sm">
              Facebook
            </a>
            <a href="#" class="text-white hover:text-neutral-300 transition-colors text-sm">
              LinkedIn
            </a>
            <a href="#" class="text-white hover:text-neutral-300 transition-colors text-sm">
              YouTube
            </a>
            <a href="#" class="text-white hover:text-neutral-300 transition-colors text-sm">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
