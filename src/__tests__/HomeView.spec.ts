import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import type { Experience } from '../types/Experience'

// Mock the router import used by HomeView
vi.mock('../router', async () => {
  const { createRouter, createWebHistory } = await import('vue-router')
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: { template: '<div>Home</div>' },
      },
    ],
  })
  // Store in a way that's accessible to tests
  ;(globalThis as any).__testRouter__ = router
  return {
    default: router,
  }
})

// Import HomeView after mocking router
import HomeView from '../views/HomeView.vue'

// Get the router from global for use in tests
const getTestRouter = () => (globalThis as any).__testRouter__ as ReturnType<typeof createRouter>
let testRouter: ReturnType<typeof createRouter>

// Mock child components
vi.mock('../components/PageHeader.vue', () => ({
  default: {
    name: 'PageHeader',
    template: '<div class="page-header">Page Header</div>',
  },
}))

vi.mock('../components/SearchFilters.vue', () => ({
  default: {
    name: 'SearchFilters',
    props: ['location', 'date', 'groupSize', 'ageGroup'],
    emits: ['update:location', 'update:date', 'update:group-size', 'update:age-group', 'clear'],
    template: '<div class="search-filters">Search Filters</div>',
  },
}))

vi.mock('../components/ExperienceList.vue', () => ({
  default: {
    name: 'ExperienceList',
    props: ['experiences', 'sortBy', 'groupSize', 'date', 'ageGroup'],
    emits: ['add-to-cart', 'clear-search'],
    template: '<div class="experience-list">Experience List</div>',
  },
}))

vi.mock('../components/ArticleList.vue', () => ({
  default: {
    name: 'ArticleList',
    props: ['articles'],
    template: '<div class="article-list">Article List</div>',
  },
}))

vi.mock('../components/Footer.vue', () => ({
  default: {
    name: 'Footer',
    template: '<div class="footer">Footer</div>',
  },
}))

describe('HomeView', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    // Get the test router instance
    testRouter = getTestRouter()
    // Reset router to default route before each test
    if (testRouter) {
      await testRouter.push('/')
    }
  })

  it('renders all main components', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    expect(wrapper.find('.page-header').exists()).toBe(true)
    expect(wrapper.find('.search-filters').exists()).toBe(true)
    expect(wrapper.find('.experience-list').exists()).toBe(true)
    expect(wrapper.find('.article-list').exists()).toBe(true)
    expect(wrapper.find('.footer').exists()).toBe(true)
  })

  it('displays the correct headings', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    const headings = wrapper.findAll('h1')
    expect(headings.length).toBeGreaterThanOrEqual(2)
    expect(headings[0]?.text()).toBe('Upplevelser')
    expect(headings[1]?.text()).toBe('Artiklar')
  })

  it('renders sort dropdown with correct options', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    expect(select.element.value).toBe('rating-desc')

    const options = select.findAll('option')
    expect(options.length).toBe(4)
    expect(options[0]?.text()).toBe('Betyg: Högst först')
    expect(options[1]?.text()).toBe('Betyg: Lägst först')
    expect(options[2]?.text()).toBe('Pris: Högst först')
    expect(options[3]?.text()).toBe('Pris: Lägst först')
  })

  it('initializes with default values when no query parameters', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    expect(searchFilters.props('location')).toBe('')
    expect(searchFilters.props('date')).toBe('')
    expect(searchFilters.props('groupSize')).toBe(1)
    expect(searchFilters.props('ageGroup')).toBe('')
  })

  it('initializes filters from query parameters', async () => {
    await testRouter.push({
      path: '/',
      query: {
        date: '2025-08-15',
        location: 'Stockholm',
        group_size: '3',
        age_group: 'adult',
      },
    })

    await testRouter.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Extra tick to ensure reactive updates

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    expect(searchFilters.props('location')).toBe('Stockholm')
    expect(searchFilters.props('date')).toBe('2025-08-15')
    // Query params come as strings, so we need to check the actual value
    // The component casts group_size as number, but query params are strings
    const groupSize = searchFilters.props('groupSize')
    expect(typeof groupSize === 'number' ? groupSize : Number(groupSize)).toBe(3)
    expect(searchFilters.props('ageGroup')).toBe('adult')
  })

  it('filters experiences by location', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:location', 'Stockholm')

    await wrapper.vm.$nextTick()

    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    const experiences = experienceList.props('experiences') as Experience[]

    // All experiences should have Stockholm in their location (case-insensitive)
    experiences.forEach((exp) => {
      expect(exp.location.toLowerCase()).toContain('stockholm')
    })
  })

  it('filters experiences by age group', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:age-group', 'adult')

    await wrapper.vm.$nextTick()

    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    const experiences = experienceList.props('experiences') as Experience[]

    experiences.forEach((exp) => {
      expect(exp.age_group).toBe('adult')
    })
  })

  it('filters experiences by date within range', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    // Set a date that should match experiences with date_range July 15 - November 15
    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:date', '2025-08-15')

    await wrapper.vm.$nextTick()

    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    const experiences = experienceList.props('experiences') as Experience[]

    // Verify that filtered experiences have date ranges that include August 15
    experiences.forEach((exp) => {
      const filterDate = new Date('2025-08-15')
      const startDate = new Date(exp.date_range.start_date)
      const endDate = new Date(exp.date_range.end_date)

      const filterMonth = filterDate.getMonth()
      const filterDay = filterDate.getDate()
      const startMonth = startDate.getMonth()
      const startDay = startDate.getDate()
      const endMonth = endDate.getMonth()
      const endDay = endDate.getDate()

      let isInRange = false
      if (startMonth < endMonth || (startMonth === endMonth && startDay <= endDay)) {
        isInRange =
          (filterMonth > startMonth || (filterMonth === startMonth && filterDay >= startDay)) &&
          (filterMonth < endMonth || (filterMonth === endMonth && filterDay <= endDay))
      } else {
        isInRange =
          filterMonth > startMonth ||
          (filterMonth === startMonth && filterDay >= startDay) ||
          filterMonth < endMonth ||
          (filterMonth === endMonth && filterDay <= endDay)
      }

      expect(isInRange).toBe(true)
    })
  })

  it('clears all filters when clearSearch is called', async () => {
    await testRouter.push({
      path: '/',
      query: {
        date: '2025-08-15',
        location: 'Stockholm',
        group_size: '3',
        age_group: 'adult',
      },
    })

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('clear')

    await wrapper.vm.$nextTick()

    expect(searchFilters.props('location')).toBe('')
    expect(searchFilters.props('date')).toBe('')
    expect(searchFilters.props('groupSize')).toBe(1)
    expect(searchFilters.props('ageGroup')).toBe('')
  })

  it('updates sort option when select changes', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const select = wrapper.find('select')
    await select.setValue('price-asc')

    await wrapper.vm.$nextTick()

    expect(select.element.value).toBe('price-asc')

    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    expect(experienceList.props('sortBy')).toBe('price-asc')
  })

  it('calls cart store methods when addToCart is triggered', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const cartStore = useCartStore()
    const hydrateSpy = vi.spyOn(cartStore, 'hydrateFromExperience')
    const setTotalPeopleSpy = vi.spyOn(cartStore, 'setTotalPeople')
    const addSelectionSpy = vi.spyOn(cartStore, 'addSelection')

    // Set group size first
    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:group-size', 4)

    await wrapper.vm.$nextTick()

    // Mock experience data
    const mockExperience = {
      id: 'test-id',
      title: 'Test Experience',
      description: 'Test',
      image_url: '/test.jpg',
      price: 100,
      location: 'Test Location',
      date_range: {
        start_date: '2025-07-15',
        end_date: '2025-11-15',
      },
      rating: 4.5,
      age_group: 'adult' as const,
      add_ons: [],
    }

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as Event

    // Trigger addToCart
    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    await experienceList.vm.$emit('add-to-cart', mockExperience, mockEvent)

    await wrapper.vm.$nextTick()

    expect(hydrateSpy).toHaveBeenCalledWith(mockExperience)
    expect(setTotalPeopleSpy).toHaveBeenCalledWith(4)
    expect(addSelectionSpy).toHaveBeenCalled()
    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.stopPropagation).toHaveBeenCalled()
  })

  it('handles location update event', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:location', 'Göteborg')

    await wrapper.vm.$nextTick()

    expect(searchFilters.props('location')).toBe('Göteborg')
  })

  it('handles date update event', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:date', '2025-09-20')

    await wrapper.vm.$nextTick()

    expect(searchFilters.props('date')).toBe('2025-09-20')
  })

  it('handles group size update event', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:group-size', 5)

    await wrapper.vm.$nextTick()

    expect(searchFilters.props('groupSize')).toBe(5)
  })

  it('handles age group update event', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:age-group', 'senior')

    await wrapper.vm.$nextTick()

    expect(searchFilters.props('ageGroup')).toBe('senior')
  })

  it('passes correct props to ExperienceList component', async () => {
    await testRouter.push({
      path: '/',
      query: {
        date: '2025-08-15',
        location: 'Stockholm',
        group_size: '2',
        age_group: 'adult',
      },
    })

    await testRouter.isReady()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Extra tick to ensure reactive updates

    const select = wrapper.find('select')
    await select.setValue('rating-asc')

    await wrapper.vm.$nextTick()

    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    expect(experienceList.props('sortBy')).toBe('rating-asc')
    // Query params come as strings, so we need to check the actual value
    const groupSize = experienceList.props('groupSize')
    expect(typeof groupSize === 'number' ? groupSize : Number(groupSize)).toBe(2)
    expect(experienceList.props('date')).toBe('2025-08-15')
    expect(experienceList.props('ageGroup')).toBe('adult')
    expect(Array.isArray(experienceList.props('experiences'))).toBe(true)
  })

  it('filters experiences correctly with multiple filters combined', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:location', 'Stockholm')
    await searchFilters.vm.$emit('update:age-group', 'adult')

    await wrapper.vm.$nextTick()

    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    const experiences = experienceList.props('experiences') as Experience[]

    experiences.forEach((exp) => {
      expect(exp.location.toLowerCase()).toContain('stockholm')
      expect(exp.age_group).toBe('adult')
    })
  })

  it('handles date filter with year boundary crossing', async () => {
    await testRouter.push('/')
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, testRouter],
      },
    })

    await wrapper.vm.$nextTick()

    // Test with a date that might be in a range that crosses year boundary
    // (e.g., November 15 - March 15)
    const searchFilters = wrapper.findComponent({ name: 'SearchFilters' })
    await searchFilters.vm.$emit('update:date', '2025-12-20')

    await wrapper.vm.$nextTick()

    const experienceList = wrapper.findComponent({ name: 'ExperienceList' })
    const experiences = experienceList.props('experiences') as Experience[]

    // Verify all returned experiences match the date filter logic
    experiences.forEach((exp) => {
      const filterDate = new Date('2025-12-20')
      const startDate = new Date(exp.date_range.start_date)
      const endDate = new Date(exp.date_range.end_date)

      const filterMonth = filterDate.getMonth()
      const filterDay = filterDate.getDate()
      const startMonth = startDate.getMonth()
      const startDay = startDate.getDate()
      const endMonth = endDate.getMonth()
      const endDay = endDate.getDate()

      let isInRange = false
      if (startMonth < endMonth || (startMonth === endMonth && startDay <= endDay)) {
        isInRange =
          (filterMonth > startMonth || (filterMonth === startMonth && filterDay >= startDay)) &&
          (filterMonth < endMonth || (filterMonth === endMonth && filterDay <= endDay))
      } else {
        isInRange =
          filterMonth > startMonth ||
          (filterMonth === startMonth && filterDay >= startDay) ||
          filterMonth < endMonth ||
          (filterMonth === endMonth && filterDay <= endDay)
      }

      expect(isInRange).toBe(true)
    })
  })
})
