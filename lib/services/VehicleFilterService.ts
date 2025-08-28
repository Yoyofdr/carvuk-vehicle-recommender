import { apiNinjasService, ApiNinjasVehicle } from './ApiNinjasService'
import { autopressService } from './autopressService'
import { cache, CACHE_TTL } from './CacheService'
import { VehicleVersion } from '../types'

export interface VehicleFilterCriteria {
  minPrice?: number
  maxPrice?: number
  bodyTypes?: string[]
  fuelTypes?: string[]
  transmission?: string[]
  brands?: string[]
  features?: string[]
  paymentMode?: 'cash' | 'monthly'
  monthlyBudget?: number
}

export interface EnhancedVehicle {
  // Basic info from API-Ninjas
  make: string
  model: string
  year: number
  class: string
  bodyType: string
  fuelType: string
  transmission: string
  
  // Chile-specific info from AutoFact
  idVersion?: number
  version?: string
  priceInChile?: number
  minPrice?: number
  maxPrice?: number
  commercialValue?: number
  monthlyPayment?: number
  
  // Additional metadata
  availability?: 'available' | 'limited' | 'unavailable'
  popularityScore?: number
  matchScore?: number
  imageUrl?: string
}

export class VehicleFilterService {
  constructor() {}

  /**
   * Main method to filter vehicles based on client preferences
   */
  async filterVehicles(criteria: VehicleFilterCriteria): Promise<EnhancedVehicle[]> {
    console.log('Starting vehicle filtering with criteria:', criteria)
    
    // Generate cache key
    const cacheKey = this.generateCacheKey(criteria)
    
    // Try cache first
    const cachedResults = await cache.get<EnhancedVehicle[]>(cacheKey)
    if (cachedResults) {
      console.log('Using cached filter results')
      return cachedResults
    }

    try {
      // Step 1: Get vehicles from API-Ninjas based on initial filters
      const apiNinjasVehicles = await this.fetchFromApiNinjas(criteria)
      
      if (apiNinjasVehicles.length === 0) {
        console.log('No vehicles found from API-Ninjas')
        return []
      }

      // Step 2: For each vehicle, try to find matching Chile prices from AutoFact
      const enhancedVehicles = await this.enhanceWithChilePrices(apiNinjasVehicles, criteria)
      
      // Step 3: Apply final filtering based on Chile prices
      const filteredVehicles = this.applyPriceFilters(enhancedVehicles, criteria)
      
      // Step 4: Calculate match scores
      const scoredVehicles = this.calculateMatchScores(filteredVehicles, criteria)
      
      // Step 5: Sort by match score
      scoredVehicles.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      
      // Cache results
      await cache.set(cacheKey, scoredVehicles, CACHE_TTL.SEARCH_RESULTS)
      
      console.log(`Filtering complete. Found ${scoredVehicles.length} matching vehicles`)
      return scoredVehicles
    } catch (error) {
      console.error('Error in vehicle filtering:', error)
      throw new Error('Failed to filter vehicles')
    }
  }

  /**
   * Fetch vehicles from API-Ninjas
   */
  private async fetchFromApiNinjas(criteria: VehicleFilterCriteria): Promise<ApiNinjasVehicle[]> {
    const preferences = {
      bodyTypes: criteria.bodyTypes,
      fuelTypes: criteria.fuelTypes,
      transmission: criteria.transmission
    }
    
    // If specific brands are requested, fetch for each brand
    if (criteria.brands && criteria.brands.length > 0) {
      const allVehicles: ApiNinjasVehicle[] = []
      
      for (const brand of criteria.brands) {
        const vehicles = await apiNinjasService.fetchVehicles({
          make: brand
        })
        allVehicles.push(...vehicles)
      }
      
      // Apply filters locally
      return apiNinjasService.filterVehiclesForClient(preferences)
    }
    
    // Otherwise get popular brands in Chile
    const popularMakes = apiNinjasService.getPopularMakesInChile()
    const allVehicles: ApiNinjasVehicle[] = []
    
    // Fetch vehicles for popular makes (limit to avoid too many API calls)
    for (const make of popularMakes.slice(0, 3)) { // Reduced to 3 brands for free tier
      const vehicles = await apiNinjasService.fetchVehicles({
        make
      })
      allVehicles.push(...vehicles)
    }
    
    return allVehicles
  }

  /**
   * Enhance vehicles with Chile-specific pricing from AutoFact
   */
  private async enhanceWithChilePrices(
    vehicles: ApiNinjasVehicle[],
    criteria: VehicleFilterCriteria
  ): Promise<EnhancedVehicle[]> {
    const enhanced: EnhancedVehicle[] = []
    
    for (const vehicle of vehicles) {
      try {
        // Try to find matching vehicle in AutoFact database
        const searchTerm = `${vehicle.make} ${vehicle.model}`
        const autofactVehicles = await autopressService.searchVehicles(searchTerm)
        
        // Find best match by year
        const match = autofactVehicles.find(v => 
          v.marca.toLowerCase() === vehicle.make.toLowerCase() &&
          v.modelo.toLowerCase().includes(vehicle.model.toLowerCase()) &&
          Math.abs(v.ano - vehicle.year) <= 1 // Allow 1 year difference
        )
        
        if (match) {
          // Get detailed valuation
          const valuation = await autopressService.getValuation(match.id_version.toString())
          
          const enhancedVehicle: EnhancedVehicle = {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            class: vehicle.class,
            bodyType: apiNinjasService.mapVehicleClass(vehicle.class),
            fuelType: apiNinjasService.mapFuelType(vehicle.fuel_type || ''),
            transmission: apiNinjasService.mapTransmission(vehicle.transmission || ''),
            
            idVersion: match.id_version,
            version: match.version,
            priceInChile: valuation?.precio || match.precio,
            minPrice: valuation?.valor_minimo,
            maxPrice: valuation?.valor_maximo,
            commercialValue: valuation?.valor_comercial,
            
            availability: this.determineAvailability(match),
            popularityScore: this.calculatePopularity(match),
            imageUrl: match.imagen_url
          }
          
          // Calculate monthly payment if needed
          if (criteria.paymentMode === 'monthly') {
            enhancedVehicle.monthlyPayment = this.calculateMonthlyPayment(
              enhancedVehicle.priceInChile || 0,
              criteria.monthlyBudget
            )
          }
          
          enhanced.push(enhancedVehicle)
        } else {
          // No match in Chile database - still include but mark as unavailable
          enhanced.push({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            class: vehicle.class,
            bodyType: apiNinjasService.mapVehicleClass(vehicle.class),
            fuelType: apiNinjasService.mapFuelType(vehicle.fuel_type || ''),
            transmission: apiNinjasService.mapTransmission(vehicle.transmission || ''),
            availability: 'unavailable',
            popularityScore: 0
          })
        }
      } catch (error) {
        console.error(`Error enhancing vehicle ${vehicle.make} ${vehicle.model}:`, error)
      }
    }
    
    return enhanced
  }

  /**
   * Apply price filters based on Chile prices
   */
  private applyPriceFilters(
    vehicles: EnhancedVehicle[],
    criteria: VehicleFilterCriteria
  ): EnhancedVehicle[] {
    return vehicles.filter(vehicle => {
      // Only filter vehicles that are available in Chile
      if (vehicle.availability === 'unavailable') {
        return false
      }
      
      // Apply price filters
      if (criteria.minPrice && vehicle.priceInChile) {
        if (vehicle.priceInChile < criteria.minPrice) {
          return false
        }
      }
      
      if (criteria.maxPrice && vehicle.priceInChile) {
        if (vehicle.priceInChile > criteria.maxPrice) {
          return false
        }
      }
      
      // Apply monthly payment filter
      if (criteria.paymentMode === 'monthly' && criteria.monthlyBudget) {
        if (!vehicle.monthlyPayment || vehicle.monthlyPayment > criteria.monthlyBudget) {
          return false
        }
      }
      
      return true
    })
  }

  /**
   * Calculate match scores for vehicles
   */
  private calculateMatchScores(
    vehicles: EnhancedVehicle[],
    criteria: VehicleFilterCriteria
  ): EnhancedVehicle[] {
    return vehicles.map(vehicle => {
      let score = 0
      
      // Body type match (25 points)
      if (criteria.bodyTypes && criteria.bodyTypes.includes(vehicle.bodyType)) {
        score += 25
      }
      
      // Fuel type match (20 points)
      if (criteria.fuelTypes && criteria.fuelTypes.includes(vehicle.fuelType)) {
        score += 20
      }
      
      // Transmission match (15 points)
      if (criteria.transmission && criteria.transmission.includes(vehicle.transmission)) {
        score += 15
      }
      
      // Brand preference (15 points)
      if (criteria.brands && criteria.brands.includes(vehicle.make)) {
        score += 15
      }
      
      // Price fit (15 points)
      if (vehicle.priceInChile) {
        const priceRange = (criteria.maxPrice || 0) - (criteria.minPrice || 0)
        if (priceRange > 0) {
          const pricePosition = (vehicle.priceInChile - (criteria.minPrice || 0)) / priceRange
          score += Math.round(15 * (1 - Math.abs(pricePosition - 0.5) * 2)) // Prefer middle of range
        }
      }
      
      // Popularity bonus (10 points)
      score += (vehicle.popularityScore || 0) * 10
      
      vehicle.matchScore = score
      return vehicle
    })
  }

  /**
   * Determine vehicle availability
   */
  private determineAvailability(vehicle: VehicleVersion): 'available' | 'limited' | 'unavailable' {
    if (vehicle.flujo_usados_habilitado) {
      return 'available'
    }
    if (vehicle.mas_probable) {
      return 'limited'
    }
    return 'unavailable'
  }

  /**
   * Calculate popularity score
   */
  private calculatePopularity(vehicle: VehicleVersion): number {
    // Simple popularity based on whether it's marked as "mas_probable"
    return vehicle.mas_probable ? 1 : 0
  }

  /**
   * Calculate monthly payment
   */
  private calculateMonthlyPayment(price: number, maxMonthly?: number): number {
    // Assume 20% down payment and 48-month loan at 8% annual interest
    const downPayment = price * 0.2
    const loanAmount = price - downPayment
    const monthlyRate = 0.08 / 12
    const months = 48
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1)
    
    return Math.round(monthlyPayment)
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(criteria: VehicleFilterCriteria): string {
    const sortedCriteria = Object.keys(criteria)
      .sort()
      .reduce((obj, key) => {
        obj[key] = criteria[key as keyof VehicleFilterCriteria]
        return obj
      }, {} as any)
    
    return `vehicle-filter:${JSON.stringify(sortedCriteria)}`
  }

  /**
   * Get recommended vehicles for a user
   */
  async getRecommendations(criteria: VehicleFilterCriteria, limit: number = 10): Promise<EnhancedVehicle[]> {
    const filtered = await this.filterVehicles(criteria)
    
    // Return top matches
    return filtered.slice(0, limit)
  }

  /**
   * Get vehicles by specific feature
   */
  async getVehiclesByFeature(feature: string, limit: number = 20): Promise<EnhancedVehicle[]> {
    const criteria: VehicleFilterCriteria = {
      features: [feature]
    }
    
    // Map features to actual filters
    switch (feature.toLowerCase()) {
      case 'economy':
      case 'económico':
        criteria.fuelTypes = ['hybrid', 'electric']
        break
      case 'space':
      case 'espacio':
        criteria.bodyTypes = ['suv', 'people-carrier', 'estate']
        break
      case 'performance':
      case 'deportivo':
        criteria.bodyTypes = ['sports', 'coupe']
        break
      case 'luxury':
      case 'lujo':
        criteria.brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Lexus']
        break
    }
    
    return this.filterVehicles(criteria)
  }
}

export const vehicleFilterService = new VehicleFilterService()