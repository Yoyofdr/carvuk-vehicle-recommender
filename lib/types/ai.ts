// Common AI-related types used across the application
// import { ScrapedVehicle } from './scrapers'

// Temporary type definition
interface ScrapedVehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
}

export interface AIAnalysis {
  realMarketValue: number
  priceAssessment: 'overpriced' | 'fair' | 'good-deal' | 'excellent-deal'
  estimatedCondition: 'excellent' | 'very-good' | 'good' | 'fair' | 'poor'
  potentialIssues: string[]
  highlights: string[]
  negotiationTips: string[]
  marketComparison: string
  recommendationScore: number // 0-100
  dealScore: number // 0-100
}

export interface AIRecommendation {
  reasoning: string
  pros: string[]
  cons: string[]
  alternatives: string[]
  personalizedAdvice: string
  confidenceScore: number
}

export interface VehicleComparison {
  summary: string
  winner: string
  comparison: {
    category: string
    winner: string
    explanation: string
  }[]
}

export interface NaturalLanguageQuery {
  bodyTypes?: string[]
  fuelTypes?: string[]
  transmission?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  features?: string[]
}

export interface EnhancedVehicleData {
  vehicle: ScrapedVehicle
  aiAnalysis: AIAnalysis
}