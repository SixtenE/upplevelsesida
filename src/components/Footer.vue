<script lang="ts" setup>
import { ArrowUp, Instagram, Facebook, Linkedin, Youtube, MessageSquare } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial check
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: MessageSquare, label: 'TikTok', href: '#' }
]

const footerLinks = {
  account: [
    { label: 'Mitt konto', href: '#' },
    { label: 'Försäkring', href: '#' },
    { label: 'Allmänna villkor', href: '#' },
    { label: 'Integritetspolicy', href: '#' },
    { label: 'Om cookies', href: '#' }
  ],
  service: [
    { label: 'Kontakta oss', href: '#' },
    { label: 'Frågor & svar', href: '#' },
    { label: 'Våra butiker', href: '#' },
    { label: 'Återförsäljare', href: '#' },
    { label: 'Kontrollera giltighetstiden', href: '#' },
    { label: 'Leverans', href: '#' }
  ],
  company: [
    { label: 'Om oss', href: '#' },
    { label: 'Support för återförsäljare', href: '#' },
    { label: 'Bli återförsäljare', href: '#' },
    { label: 'Bli partner', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blogg', href: '#' },
    { label: 'Jobba hos oss', href: '#' }
  ]
}
</script>

<template>
  <footer class="relative w-full mt-auto">
    <!-- Back to Top Button (Floating) -->
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white 
             rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
             transform hover:-translate-y-0.5 flex items-center justify-center
             backdrop-blur-sm bg-opacity-90"
      aria-label="Tillbaka till toppen"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
    <!-- Main Footer Content -->
    <div class="bg-gray-900 dark:bg-gray-950 text-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <!-- Brand & Description -->
          <div class="lg:col-span-4">
            <div class="mb-6">
              <h3 class="text-2xl font-bold mb-3">
                <span class="text-white">Upplevelsesida</span>
                <span class="text-blue-400">.se</span>
              </h3>
              <p class="text-gray-300 leading-relaxed mb-6">

              </p>
            </div>
            
            <!-- Contact Info -->
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-gray-300">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span class="text-sm">08-123 45 67</span>
              </div>
              <div class="flex items-center gap-3 text-gray-300">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm">hej@upplevelsesida.se</span>
              </div>
            </div>
          </div>

          <!-- Links Grid -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <!-- Account Links -->
              <div>
                <h4 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
                  Mitt upplevelsesida
                </h4>
                <ul class="space-y-2.5">
                  <li v-for="link in footerLinks.account" :key="link.label">
                    <a
                      :href="link.href"
                      class="text-gray-300 hover:text-white transition-colors duration-200 
                             hover:translate-x-1 inline-block transform hover:font-medium"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Service Links -->
              <div>
                <h4 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
                  Kundservice
                </h4>
                <ul class="space-y-2.5">
                  <li v-for="link in footerLinks.service" :key="link.label">
                    <a
                      :href="link.href"
                      class="text-gray-300 hover:text-white transition-colors duration-200 
                             hover:translate-x-1 inline-block transform hover:font-medium"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Company Links -->
              <div>
                <h4 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
                  Företagsinfo
                </h4>
                <ul class="space-y-2.5">
                  <li v-for="link in footerLinks.company" :key="link.label">
                    <a
                      :href="link.href"
                      class="text-gray-300 hover:text-white transition-colors duration-200 
                             hover:translate-x-1 inline-block transform hover:font-medium"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
            <!-- Copyright -->
            <div class="text-gray-400 text-sm">
              <p>&copy; 2025 Upplevelsesida.se. Alla rättigheter förbehållna.</p>
            </div>

            <!-- Social Links -->
            <div class="flex items-center gap-4">
              <p class="text-gray-400 text-sm hidden sm:block">Följ oss:</p>
              <div class="flex items-center gap-3">
                <a
                  v-for="social in socialLinks"
                  :key="social.label"
                  :href="social.href"
                  :aria-label="social.label"
                  class="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-all duration-200 
                         hover:scale-110 hover:shadow-lg"
                >
                  <component :is="social.icon" class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <!-- Legal Links -->
          <div class="mt-6 pt-6 border-t border-gray-800">
            <div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <a href="#" class="hover:text-gray-300 transition-colors">Integritetspolicy</a>
              <span class="text-gray-600">•</span>
              <a href="#" class="hover:text-gray-300 transition-colors">Användarvillkor</a>
              <span class="text-gray-600">•</span>
              <a href="#" class="hover:text-gray-300 transition-colors">Cookie-inställningar</a>
              <span class="text-gray-600">•</span>
              <a href="#" class="hover:text-gray-300 transition-colors">Juridisk information</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Custom hover effects for social icons */
a.bg-gray-800:hover {
  transform: translateY(-2px);
}

/* Smooth transitions */
a, button {
  transition: all 0.2s ease-in-out;
}

/* Newsletter form focus states */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>