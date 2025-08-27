import { InsuranceProduct } from '../entities/InsuranceProduct'
import { InsurancePremium } from '../entities/InsurancePremium'
import { InsuranceAnswers } from '../schemas/answers'
import { NormalizationService } from './NormalizationService'
import { ScoringUtils, WeightedScore } from './ScoringUtils'

export interface InsuranceRecommendation {
  product: InsuranceProduct
  premium?: InsurancePremium
  score: number
  reasons: string[]
}

export class InsuranceRankingService {
  static rank(
    products: InsuranceProduct[],
    premiums: InsurancePremium[],
    answers: InsuranceAnswers
  ): InsuranceRecommendation[] {
    const recommendations = products.map(product => {
      const scores: WeightedScore[] = []
      const reasons: string[] = []
      
      // Find premium for this product
      const premium = premiums.find(p => p.productId === product.id)
      
      if (!premium) {
        return {
          product,
          score: 0,
          reasons: ['Sin tarifa disponible']
        }
      }

      // Price scoring (0.45 weight)
      const [minBudget, maxBudget] = answers.monthlyBudget
      const priceInBudget = premium.monthlyPremiumCLP >= minBudget && 
                           premium.monthlyPremiumCLP <= maxBudget
      
      scores.push({
        value: priceInBudget ? 1 : NormalizationService.normalizeInverse(
          Math.abs(premium.monthlyPremiumCLP - (minBudget + maxBudget) / 2),
          0,
          maxBudget * 2
        ),
        weight: 0.45,
        label: 'price'
      })
      
      if (priceInBudget) {
        reasons.push('Dentro de presupuesto')
      }

      // Deductible scoring (0.15 weight)
      const [minDeductible, maxDeductible] = answers.deductibleRange
      const deductibleInRange = product.deductibleUF >= minDeductible && 
                                product.deductibleUF <= maxDeductible
      
      scores.push({
        value: deductibleInRange ? 1 : 0.3,
        weight: 0.15,
        label: 'deductible'
      })
      
      if (deductibleInRange) {
        reasons.push(`Deducible ${product.deductibleUF} UF`)
      }

      // Coverage scoring (0.35 weight total)
      const coverageScores: number[] = []
      
      // Check minimum required coverages
      if (answers.minCoverages.includes('rc-1000')) {
        const rcCoverage = product.coverages.find(c => c.type === 'rc')
        const hasMinRC = rcCoverage?.included && (rcCoverage.limitUF || 0) >= 1000
        coverageScores.push(hasMinRC ? 1 : 0)
        if (hasMinRC) {
          reasons.push('RC ≥ 1000 UF')
        }
      }
      
      if (answers.minCoverages.includes('damage')) {
        const hasDamage = product.coverages.find(c => c.type === 'damage')?.included
        coverageScores.push(hasDamage ? 1 : 0)
        if (hasDamage) {
          reasons.push('Daños propios')
        }
      }
      
      if (answers.minCoverages.includes('theft')) {
        const hasTheft = product.coverages.find(c => c.type === 'theft')?.included
        coverageScores.push(hasTheft ? 1 : 0)
        if (hasTheft) {
          reasons.push('Robo incluido')
        }
      }
      
      if (answers.minCoverages.includes('glass')) {
        const hasGlass = product.coverages.find(c => c.type === 'glass')?.included
        coverageScores.push(hasGlass ? 1 : 0)
        if (hasGlass) {
          reasons.push('Cristales')
        }
      }
      
      if (answers.minCoverages.includes('natural')) {
        const hasNatural = product.coverages.find(c => c.type === 'natural_disaster')?.included
        coverageScores.push(hasNatural ? 1 : 0)
        if (hasNatural) {
          reasons.push('Eventos naturales')
        }
      }
      
      const avgCoverageScore = coverageScores.length > 0 
        ? coverageScores.reduce((a, b) => a + b, 0) / coverageScores.length 
        : 0
      
      scores.push({
        value: avgCoverageScore,
        weight: 0.35,
        label: 'coverages'
      })

      // Preferences scoring (0.2 weight)
      if (answers.preferences && answers.preferences.length > 0) {
        const preferenceScores: number[] = []
        
        if (answers.preferences.includes('brand-workshop')) {
          const hasBrandWorkshop = product.features.workshopType === 'brand'
          preferenceScores.push(hasBrandWorkshop ? 1 : 0.5)
          if (hasBrandWorkshop) {
            reasons.push('Taller de marca')
          }
        }
        
        if (answers.preferences.includes('replacement-car')) {
          const hasReplacementCar = product.features.replacementCar
          preferenceScores.push(hasReplacementCar ? 1 : 0.3)
          if (hasReplacementCar) {
            reasons.push('Auto de reemplazo')
          }
        }
        
        if (answers.preferences.includes('road-assistance')) {
          const hasRoadAssistance = product.features.roadAssistance
          preferenceScores.push(hasRoadAssistance ? 1 : 0.5)
          if (hasRoadAssistance) {
            reasons.push('Asistencia en ruta')
          }
        }
        
        if (answers.preferences.includes('international')) {
          const hasInternational = product.features.internationalCoverage
          preferenceScores.push(hasInternational ? 1 : 0.3)
          if (hasInternational) {
            reasons.push('Cobertura internacional')
          }
        }
        
        if (answers.preferences.includes('zero-deductible-glass')) {
          const glassCoverage = product.coverages.find(c => c.type === 'glass')
          const hasZeroDeductible = glassCoverage?.included && 
                                   (!glassCoverage.deductibleUF || glassCoverage.deductibleUF === 0)
          preferenceScores.push(hasZeroDeductible ? 1 : 0.5)
          if (hasZeroDeductible) {
            reasons.push('Sin deducible cristales')
          }
        }
        
        const avgPreferenceScore = preferenceScores.length > 0
          ? preferenceScores.reduce((a, b) => a + b, 0) / preferenceScores.length
          : 0.5
        
        scores.push({
          value: avgPreferenceScore,
          weight: 0.2,
          label: 'preferences'
        })
      } else {
        scores.push({
          value: 0.5,
          weight: 0.2,
          label: 'preferences'
        })
      }

      // Calculate final score
      const finalScore = ScoringUtils.weightedSum(scores)

      return {
        product,
        premium,
        score: finalScore,
        reasons: reasons.slice(0, 4) // Top 4 reasons
      }
    })

    // Filter out products without premium
    const validRecommendations = recommendations.filter(r => r.score > 0)
    
    // Sort by score descending
    return validRecommendations.sort((a, b) => b.score - a.score)
  }

  static filterByBudget(
    products: InsuranceProduct[],
    premiums: InsurancePremium[],
    monthlyBudget: [number, number]
  ): InsuranceProduct[] {
    const [, maxBudget] = monthlyBudget
    
    return products.filter(product => {
      const premium = premiums.find(p => p.productId === product.id)
      if (!premium) return false
      
      // Allow 30% flexibility for insurance
      return premium.monthlyPremiumCLP <= maxBudget * 1.3
    })
  }
}