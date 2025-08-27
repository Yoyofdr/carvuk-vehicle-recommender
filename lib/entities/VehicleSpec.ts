export interface VehicleSpec {
  vehicleId: string
  monthlyPaymentCLP?: number // estimated monthly payment
  insuranceMonthlyEstimateCLP?: number
  warrantyYears: number
  warrantyKm: number
  availability: 'immediate' | 'order' | 'unavailable'
  dealerDiscountPercentage?: number
  promotions?: string[]
}