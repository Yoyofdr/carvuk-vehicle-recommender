export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  condition: 'new' | 'used'
  bodyType: 'sedan' | 'suv' | 'hatchback' | 'pickup' | 'coupe' | 'minivan'
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
  transmission: 'manual' | 'automatic'
  engineSize: number // in liters
  seats: number
  doorsCount: number
  priceCLP: number
  image?: string
  features: string[]
  safetyRating: number // 0-5 (EuroNCAP style)
  fuelEfficiency: number // km/l
  maintenanceCostRating: 'low' | 'medium' | 'high'
}