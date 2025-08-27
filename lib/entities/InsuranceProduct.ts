export interface Coverage {
  type: 'rc' | 'damage' | 'theft' | 'glass' | 'natural_disaster' | 'personal_accident'
  limitUF?: number
  deductibleUF?: number
  included: boolean
}

export interface InsuranceProduct {
  id: string
  provider: string
  productName: string
  coverages: Coverage[]
  deductibleUF: number // general deductible
  features: {
    workshopType: 'brand' | 'preferred' | 'any'
    replacementCar: boolean
    roadAssistance: boolean
    internationalCoverage: boolean
  }
  exclusions?: string[]
  rating?: number // 1-5
}