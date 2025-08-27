export interface InsurancePremium {
  productId: string
  vehicleId: string
  monthlyPremiumCLP: number
  annualPremiumCLP: number
  validUntil: Date
  discounts?: {
    type: string
    percentage: number
  }[]
}