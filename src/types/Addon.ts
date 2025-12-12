export interface Addon {
  id: string
  title: string
  price: number
  description?: string
  perPerson?: boolean
  required?: boolean
}