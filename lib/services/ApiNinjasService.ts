import { cache, CACHE_TTL } from './CacheService'

export interface ApiNinjasVehicle {
  make: string
  model: string
  year: number
  class: string
  combination_mpg?: number
  city_mpg?: number
  highway_mpg?: number
  cylinders?: number
  displacement?: number
  drive?: string
  fuel_type?: string
  transmission?: string
  min_price?: number
  max_price?: number
}

export interface ApiNinjasFilters {
  make?: string
  model?: string
  year?: number
  fuel_type?: string
  drive?: string
  cylinders?: number
  transmission?: string
}

export class ApiNinjasService {
  private apiKey: string
  private baseUrl: string = 'https://api.api-ninjas.com/v1/cars'

  constructor() {
    this.apiKey = process.env.API_NINJAS_KEY || ''
    if (!this.apiKey && process.env.NODE_ENV === 'production') {
      console.warn('API-Ninjas API key not configured')
    }
  }

  /**
   * Fetch vehicles from API-Ninjas based on filters
   */
  async fetchVehicles(filters: ApiNinjasFilters): Promise<ApiNinjasVehicle[]> {
    // Generate cache key from filters
    const cacheKey = this.generateCacheKey(filters)
    
    // Try to get from cache first
    const cached = await cache.get<ApiNinjasVehicle[]>(cacheKey)
    if (cached) {
      console.log('API-Ninjas: Using cached response')
      return cached
    }

    try {
      // Build query string
      const queryParams = new URLSearchParams()
      
      if (filters.make) queryParams.append('make', filters.make)
      if (filters.model) queryParams.append('model', filters.model)
      if (filters.year) queryParams.append('year', filters.year.toString())
      if (filters.fuel_type) queryParams.append('fuel_type', filters.fuel_type)
      if (filters.drive) queryParams.append('drive', filters.drive)
      if (filters.cylinders) queryParams.append('cylinders', filters.cylinders.toString())
      if (filters.transmission) queryParams.append('transmission', filters.transmission)

      const url = `${this.baseUrl}?${queryParams.toString()}`
      
      console.log('API-Ninjas: Fetching vehicles with filters:', filters)
      
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`API-Ninjas API error: ${response.status} ${response.statusText}`)
      }

      const vehicles = await response.json() as ApiNinjasVehicle[]
      
      // Cache the response
      await cache.set(cacheKey, vehicles, CACHE_TTL.SEARCH_RESULTS)
      
      console.log(`API-Ninjas: Found ${vehicles.length} vehicles`)
      return vehicles
    } catch (error) {
      console.error('Error fetching from API-Ninjas:', error)
      return []
    }
  }

  /**
   * Map API-Ninjas vehicle class to our body types
   */
  mapVehicleClass(vehicleClass: string): string {
    const classMapping: Record<string, string> = {
      'Compact Cars': 'hatchback',
      'Midsize Cars': 'sedan',
      'Large Cars': 'sedan',
      'Small Sport Utility Vehicle': 'suv',
      'Standard Sport Utility Vehicle': 'suv',
      'Two Seaters': 'coupe',
      'Minicompact Cars': 'hatchback',
      'Subcompact Cars': 'hatchback',
      'Small Station Wagons': 'estate',
      'Midsize Station Wagons': 'estate',
      'Small Pickup Trucks': 'pickup',
      'Standard Pickup Trucks': 'pickup',
      'Special Purpose Vehicle': 'suv',
      'Minivan': 'people-carrier',
      'Van': 'van'
    }
    
    return classMapping[vehicleClass] || 'sedan'
  }

  /**
   * Map fuel type to Spanish
   */
  mapFuelType(fuelType: string): string {
    const fuelMapping: Record<string, string> = {
      'gas': 'Gasolina',
      'diesel': 'Diésel',
      'electricity': 'Eléctrico',
      'hybrid': 'Híbrido',
      'flex-fuel (E85)': 'Flex Fuel',
      'natural gas': 'Gas Natural'
    }
    
    return fuelMapping[fuelType.toLowerCase()] || fuelType
  }

  /**
   * Map transmission type to Spanish
   */
  mapTransmission(transmission: string): string {
    if (!transmission) return 'Manual'
    
    const transLower = transmission.toLowerCase()
    if (transLower.includes('automatic') || transLower.includes('a')) {
      return 'Automático'
    } else if (transLower.includes('manual') || transLower.includes('m')) {
      return 'Manual'
    }
    
    return transmission
  }

  /**
   * Filter vehicles based on client preferences
   */
  async filterVehiclesForClient(preferences: {
    bodyTypes?: string[]
    fuelTypes?: string[]
    transmission?: string[]
    minPrice?: number
    maxPrice?: number
  }): Promise<ApiNinjasVehicle[]> {
    const filters: ApiNinjasFilters = {}

    // Map our fuel types to API-Ninjas format
    if (preferences.fuelTypes && preferences.fuelTypes.length > 0) {
      // API-Ninjas accepts one fuel type at a time, so we'll make multiple requests if needed
      const allVehicles: ApiNinjasVehicle[] = []
      
      for (const fuelType of preferences.fuelTypes) {
        const mappedFuel = this.mapFuelTypeToApi(fuelType)
        if (mappedFuel) {
          filters.fuel_type = mappedFuel
          const vehicles = await this.fetchVehicles(filters)
          allVehicles.push(...vehicles)
        }
      }
      
      // Remove duplicates
      const uniqueVehicles = this.removeDuplicates(allVehicles)
      
      // Apply local filters
      return this.applyLocalFilters(uniqueVehicles, preferences)
    }

    // Fetch all vehicles and filter locally
    const vehicles = await this.fetchVehicles(filters)
    return this.applyLocalFilters(vehicles, preferences)
  }

  /**
   * Apply local filters to vehicles
   */
  private applyLocalFilters(vehicles: ApiNinjasVehicle[], preferences: any): ApiNinjasVehicle[] {
    return vehicles.filter(vehicle => {
      // Filter by body type
      if (preferences.bodyTypes && preferences.bodyTypes.length > 0) {
        const vehicleBodyType = this.mapVehicleClass(vehicle.class)
        if (!preferences.bodyTypes.includes(vehicleBodyType)) {
          return false
        }
      }

      // Filter by transmission
      if (preferences.transmission && preferences.transmission.length > 0) {
        const vehicleTransmission = this.mapTransmission(vehicle.transmission || '')
        const matchesTransmission = preferences.transmission.some((trans: string) => 
          vehicleTransmission.toLowerCase().includes(trans.toLowerCase())
        )
        if (!matchesTransmission) {
          return false
        }
      }

      // Price filtering would typically be done after getting Chile prices from AutoFact
      
      return true
    })
  }

  /**
   * Map our fuel types to API-Ninjas format
   */
  private mapFuelTypeToApi(fuelType: string): string | null {
    const mapping: Record<string, string> = {
      'gasoline': 'gas',
      'gasolina': 'gas',
      'diesel': 'diesel',
      'diésel': 'diesel',
      'electric': 'electricity',
      'eléctrico': 'electricity',
      'hybrid': 'hybrid',
      'híbrido': 'hybrid'
    }
    
    return mapping[fuelType.toLowerCase()] || null
  }

  /**
   * Remove duplicate vehicles
   */
  private removeDuplicates(vehicles: ApiNinjasVehicle[]): ApiNinjasVehicle[] {
    const seen = new Set()
    return vehicles.filter(vehicle => {
      const key = `${vehicle.make}-${vehicle.model}-${vehicle.year}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * Generate cache key from filters
   */
  private generateCacheKey(filters: ApiNinjasFilters): string {
    const sortedFilters = Object.keys(filters)
      .sort()
      .reduce((obj, key) => {
        obj[key] = filters[key as keyof ApiNinjasFilters]
        return obj
      }, {} as any)
    
    return `api-ninjas:vehicles:${JSON.stringify(sortedFilters)}`
  }

  /**
   * Get popular makes available in Chile
   */
  getPopularMakesInChile(): string[] {
    return [
      'Toyota', 'Nissan', 'Mazda', 'Hyundai', 'Kia',
      'Chevrolet', 'Ford', 'Volkswagen', 'Suzuki', 'Mitsubishi',
      'Honda', 'Subaru', 'Peugeot', 'Renault', 'BMW',
      'Mercedes-Benz', 'Audi', 'Volvo', 'Jeep', 'RAM'
    ]
  }
}

export const apiNinjasService = new ApiNinjasService()