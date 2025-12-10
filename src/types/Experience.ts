export type AgeGroup = 'child' | 'adult' | 'senior'

export type AddOn = {
  id: string
  title: string
  price: number
}

export type Experience = {
  id: string
  title: string
  description: string
  image_url: string
  price: number
  location: string
  date: string
  rating: number
  age_group: AgeGroup
  add_ons: AddOn[]
}
