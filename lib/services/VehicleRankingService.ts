import { Vehicle } from '../entities/Vehicle'
import { VehicleAnswers } from '../schemas/answers'
import { NormalizationService } from './NormalizationService'
import { ScoringUtils, WeightedScore } from './ScoringUtils'

export interface VehicleRecommendation {
  vehicle: Vehicle
  score: number
  reasons: string[]
  monthlyEstimateCLP?: number
}

export class VehicleRankingService {
  private static calculateMonthlyPayment(
    price: number,
    downPayment: number = 0,
    interestRate: number = 0.02,
    months: number = 48
  ): number {
    const principal = price - downPayment
    const monthlyRate = interestRate
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1)
    return Math.round(payment)
  }

  static rank(vehicles: Vehicle[], answers: VehicleAnswers): VehicleRecommendation[] {
    const recommendations = vehicles.map(vehicle => {
      const scores: WeightedScore[] = []
      const reasons: string[] = []

      // Budget scoring (0.5 weight total: 0.25 monthly + 0.25 cash)
      if (answers.monthlyBudget) {
        const [minBudget, maxBudget] = answers.monthlyBudget
        const downPayment = answers.downPayment ? answers.downPayment[0] : 0
        const monthlyPayment = this.calculateMonthlyPayment(vehicle.priceCLP, downPayment)
        
        // Monthly payment score
        const monthlyInBudget = monthlyPayment >= minBudget && monthlyPayment <= maxBudget
        scores.push({
          value: monthlyInBudget ? 1 : NormalizationService.normalizeInverse(
            Math.abs(monthlyPayment - (minBudget + maxBudget) / 2),
            0,
            maxBudget
          ),
          weight: 0.25,
          label: 'monthly_budget'
        })
        
        if (monthlyInBudget) {
          reasons.push('Dentro de tu presupuesto mensual')
        }

        // Cash price consideration
        if (answers.downPayment) {
          const [, maxDown] = answers.downPayment
          const cashAffordable = vehicle.priceCLP <= maxDown
          scores.push({
            value: cashAffordable ? 1 : 0.5,
            weight: 0.25,
            label: 'cash_budget'
          })
          
          if (cashAffordable) {
            reasons.push('Precio al contado alcanzable')
          }
        } else {
          scores.push({ value: 0.5, weight: 0.25, label: 'cash_budget' })
        }
      }

      // Body type preference (0.2 weight)
      if (answers.bodyTypes && answers.bodyTypes.length > 0) {
        const matchesBodyType = answers.bodyTypes.includes(vehicle.bodyType)
        scores.push({
          value: matchesBodyType ? 1 : 0.3,
          weight: 0.2,
          label: 'body_type'
        })
        
        if (matchesBodyType) {
          const bodyTypeLabels: Record<string, string> = {
            sedan: 'Saloons',
            suv: 'SUVs',
            hatchback: 'Hatchbacks',
            pickup: 'Pickup',
            coupe: 'Coupes',
            minivan: 'People carriers',
            wagon: 'Estate cars',
            convertible: 'Convertibles',
            sports: 'Sports cars'
          }
          reasons.push(`Carrocería ${bodyTypeLabels[vehicle.bodyType]}`)
        }
      }

      // Fuel type preference (0.1 weight)
      if (answers.fuelTypes && answers.fuelTypes.length > 0) {
        const matchesFuelType = answers.fuelTypes.includes(vehicle.fuelType)
        scores.push({
          value: matchesFuelType ? 1 : 0.5,
          weight: 0.1,
          label: 'fuel_type'
        })
        
        if (matchesFuelType) {
          const fuelTypeLabels: Record<string, string> = {
            gasoline: 'Bencina',
            diesel: 'Diésel',
            hybrid: 'Híbrido',
            electric: 'Eléctrico'
          }
          reasons.push(`${fuelTypeLabels[vehicle.fuelType]}`)
        }
      }

      // Transmission preference (0.05 weight)
      if (answers.transmission && answers.transmission !== 'any') {
        const matchesTransmission = vehicle.transmission === answers.transmission
        scores.push({
          value: matchesTransmission ? 1 : 0.5,
          weight: 0.05,
          label: 'transmission'
        })
        
        if (matchesTransmission) {
          reasons.push(vehicle.transmission === 'automatic' ? 'Automática' : 'Manual')
        }
      }

      // Usage scoring (0.1 weight)
      if (answers.usage && answers.usage.length > 0) {
        let usageScore = 0
        
        if (answers.usage.includes('city')) {
          usageScore += vehicle.bodyType === 'hatchback' || vehicle.fuelType === 'hybrid' ? 0.3 : 0.1
        }
        
        if (answers.usage.includes('family')) {
          usageScore += vehicle.seats >= 5 ? 0.3 : 0.1
          if (vehicle.bodyType === 'suv' || vehicle.bodyType === 'minivan') {
            usageScore += 0.2
            reasons.push('Ideal para familia')
          }
        }
        
        if (answers.usage.includes('offroad')) {
          usageScore += vehicle.bodyType === 'pickup' || vehicle.bodyType === 'suv' ? 0.4 : 0
          if (vehicle.bodyType === 'pickup') {
            reasons.push('Capacidad off-road')
          }
        }
        
        if (answers.usage.includes('sport')) {
          usageScore += vehicle.bodyType === 'coupe' ? 0.4 : 0.1
        }
        
        scores.push({
          value: Math.min(1, usageScore),
          weight: 0.1,
          label: 'usage'
        })
      }

      // Safety rating (0.05 weight)
      const safetyScore = NormalizationService.normalize(vehicle.safetyRating, 0, 5)
      scores.push({
        value: safetyScore,
        weight: 0.05,
        label: 'safety'
      })
      
      if (vehicle.safetyRating >= 4) {
        reasons.push(`Seguridad ${vehicle.safetyRating}/5 estrellas`)
      }

      // Calculate final score
      const finalScore = ScoringUtils.weightedSum(scores)
      
      // Calculate monthly estimate
      const downPayment = answers.downPayment ? answers.downPayment[0] : 0
      const monthlyEstimate = this.calculateMonthlyPayment(vehicle.priceCLP, downPayment)

      return {
        vehicle,
        score: finalScore,
        reasons: reasons.slice(0, 3), // Top 3 reasons
        monthlyEstimateCLP: monthlyEstimate
      }
    })

    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score)
  }

  static filterByBudget(
    vehicles: Vehicle[],
    monthlyBudget?: [number, number],
    downPayment?: [number, number]
  ): Vehicle[] {
    if (!monthlyBudget) return vehicles
    
    const [, maxBudget] = monthlyBudget
    const maxDown = downPayment ? downPayment[1] : 0
    
    return vehicles.filter(vehicle => {
      const monthlyPayment = this.calculateMonthlyPayment(vehicle.priceCLP, maxDown)
      return monthlyPayment <= maxBudget * 1.2 // Allow 20% flexibility
    })
  }

  static filterByCondition(
    vehicles: Vehicle[],
    condition?: 'new' | 'used'
  ): Vehicle[] {
    if (!condition) return vehicles
    
    return vehicles.filter(vehicle => vehicle.condition === condition)
  }
}