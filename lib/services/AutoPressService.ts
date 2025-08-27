// AutoPress API Service for vehicle valuations
import { z } from 'zod'

// Schema definitions for API responses
const VersionSchema = z.object({
  id: z.number(),
  id_modelo: z.number().optional(),
  ano: z.number(),
  marca: z.string(),
  modelo: z.string(),
  generacion: z.string().optional(),
  version: z.string(),
  mas_probable: z.boolean().optional(),
  carroceria: z.string().optional(),
  motor: z.string().optional(),
  combustible: z.string().optional(),
  transmision: z.string().optional(),
  puertas: z.string().optional(),
  tipo: z.string().optional(),
  segmento: z.string().optional(),
  informacion_fiscal: z.object({
    ano_info_fiscal: z.string().optional(),
    tasacion: z.string().optional(),
    permiso: z.string().optional(),
    codigo: z.string().optional()
  }).optional(),
  flujo_usados_habilitado: z.boolean().optional()
}).transform(data => ({
  ...data,
  id_version: data.id // Map id to id_version for consistency
}))

const TasacionSchema = z.object({
  id: z.number(),
  id_version: z.number(),
  fecha_consulta: z.string(),
  fecha_resultados: z.string(),
  precio_autopress: z.number(),
  precio_autopress_historico: z.number().nullable().optional()
}).transform(data => ({
  // Transform to expected format
  valor_comercial: data.precio_autopress,
  valor_minimo: Math.round(data.precio_autopress * 0.85), // Estimate 15% below
  valor_maximo: Math.round(data.precio_autopress * 1.15), // Estimate 15% above
  fecha_tasacion: data.fecha_consulta,
  moneda: 'CLP',
  precio_original: data.precio_autopress,
  precio_historico: data.precio_autopress_historico
}))

export type VehicleVersion = z.infer<typeof VersionSchema>
export type VehicleValuation = z.infer<typeof TasacionSchema>

interface AutoPressConfig {
  apiUrl: string
  bearerToken: string
}

export class AutoPressService {
  private config: AutoPressConfig
  private vehicleCatalog: Map<string, Map<string, Set<number>>> // brand -> model -> years

  constructor() {
    this.config = {
      apiUrl: process.env.AUTOPRESS_API_URL || 'https://api.autopress.cl/v1',
      bearerToken: process.env.AUTOPRESS_BEARER_TOKEN || ''
    }
    this.vehicleCatalog = new Map()
    this.initializeCatalog()
  }

  /**
   * Initialize a sample catalog - in production, this should come from a database
   */
  private initializeCatalog() {
    // Popular brands and models in Chile
    const catalog = [
      { brand: 'Toyota', models: [
        { name: 'Corolla', years: [2020, 2021, 2022, 2023, 2024] },
        { name: 'RAV4', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Hilux', years: [2018, 2019, 2020, 2021, 2022, 2023] },
        { name: 'Yaris', years: [2020, 2021, 2022, 2023] },
        { name: 'C-HR', years: [2019, 2020, 2021, 2022] }
      ]},
      { brand: 'Chevrolet', models: [
        { name: 'Sail', years: [2018, 2019, 2020, 2021, 2022] },
        { name: 'Spark', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Tracker', years: [2020, 2021, 2022, 2023] },
        { name: 'Onix', years: [2020, 2021, 2022, 2023] }
      ]},
      { brand: 'Nissan', models: [
        { name: 'Versa', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Kicks', years: [2018, 2019, 2020, 2021, 2022] },
        { name: 'X-Trail', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Frontier', years: [2018, 2019, 2020, 2021, 2022] }
      ]},
      { brand: 'Hyundai', models: [
        { name: 'Accent', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Tucson', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Santa Fe', years: [2019, 2020, 2021, 2022] },
        { name: 'Creta', years: [2020, 2021, 2022, 2023] }
      ]},
      { brand: 'Mazda', models: [
        { name: 'CX-5', years: [2018, 2019, 2020, 2021, 2022, 2023] },
        { name: 'CX-30', years: [2020, 2021, 2022, 2023] },
        { name: '3', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'CX-3', years: [2018, 2019, 2020, 2021] }
      ]},
      { brand: 'Suzuki', models: [
        { name: 'Swift', years: [2018, 2019, 2020, 2021, 2022] },
        { name: 'Vitara', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'S-Cross', years: [2019, 2020, 2021, 2022] },
        { name: 'Baleno', years: [2018, 2019, 2020, 2021] }
      ]},
      { brand: 'Kia', models: [
        { name: 'Rio', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Sportage', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'Seltos', years: [2020, 2021, 2022, 2023] },
        { name: 'Morning', years: [2018, 2019, 2020, 2021, 2022] }
      ]},
      { brand: 'Volkswagen', models: [
        { name: 'Polo', years: [2019, 2020, 2021, 2022, 2023] },
        { name: 'T-Cross', years: [2020, 2021, 2022, 2023] },
        { name: 'Tiguan', years: [2018, 2019, 2020, 2021, 2022] },
        { name: 'Virtus', years: [2020, 2021, 2022, 2023] }
      ]}
    ]

    // Build the catalog map
    catalog.forEach(brand => {
      const modelMap = new Map<string, Set<number>>()
      brand.models.forEach(model => {
        modelMap.set(model.name, new Set(model.years))
      })
      this.vehicleCatalog.set(brand.brand, modelMap)
    })
  }

  /**
   * Get vehicle versions by license plate (patente)
   */
  async getVersionsByPlate(plate: string): Promise<VehicleVersion[]> {
    try {
      const url = `${this.config.apiUrl}/versiones/?patente=${plate.toUpperCase()}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Validate response data
      if (Array.isArray(data)) {
        return data.map(item => VersionSchema.parse(item))
      }
      
      // If single object returned, wrap in array
      return [VersionSchema.parse(data)]
    } catch (error) {
      console.error('Error fetching vehicle versions:', error)
      throw new Error(`Failed to fetch vehicle versions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get vehicle valuation (tasación)
   */
  async getValuation(
    versionId: number, 
    valuationDate: string = new Date().toISOString().split('T')[0]
  ): Promise<VehicleValuation> {
    try {
      const url = `${this.config.apiUrl}/tasaciones/`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fecha_tasacion: valuationDate,
          id_version: versionId
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return TasacionSchema.parse(data)
    } catch (error) {
      console.error('Error fetching valuation:', error)
      throw new Error(`Failed to fetch valuation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get complete vehicle information (version + valuation)
   */
  async getVehicleInfo(plate: string, valuationDate?: string): Promise<{
    versions: VehicleVersion[]
    valuations: Map<number, VehicleValuation>
  }> {
    try {
      // Step 1: Get vehicle versions
      const versions = await this.getVersionsByPlate(plate)
      
      if (versions.length === 0) {
        throw new Error('No vehicle versions found for this plate')
      }

      // Step 2: Get valuations for each version
      const valuations = new Map<number, VehicleValuation>()
      
      for (const version of versions) {
        try {
          const valuation = await this.getValuation(version.id_version, valuationDate)
          valuations.set(version.id_version, valuation)
        } catch (error) {
          console.warn(`Failed to get valuation for version ${version.id_version}:`, error)
        }
      }

      return {
        versions,
        valuations
      }
    } catch (error) {
      console.error('Error getting vehicle info:', error)
      throw error
    }
  }

  /**
   * Format currency for Chilean Pesos
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  /**
   * Calculate depreciation for future years
   */
  calculateDepreciation(
    currentValue: number,
    depreciationRate: number = 0.15,
    years: number = 1
  ): number {
    return Math.round(currentValue * Math.pow(1 - depreciationRate, years))
  }

  /**
   * Get all available brands
   */
  getAvailableBrands(): string[] {
    return Array.from(this.vehicleCatalog.keys()).sort()
  }

  /**
   * Get available models for a brand
   */
  getModelsByBrand(brand: string): string[] {
    const models = this.vehicleCatalog.get(brand)
    if (!models) return []
    return Array.from(models.keys()).sort()
  }

  /**
   * Get available years for a model
   */
  getYearsByModel(brand: string, model: string): number[] {
    const models = this.vehicleCatalog.get(brand)
    if (!models) return []
    const years = models.get(model)
    if (!years) return []
    return Array.from(years).sort((a, b) => b - a) // Sort descending
  }

  /**
   * Search for versions by brand, model, and year
   * Since AutoPress requires a license plate, we'll need to handle this differently
   * In production, you would have a database of versions or a different API
   */
  async getVersionsByFilters(brand: string, model: string, year: number): Promise<VehicleVersion[]> {
    // For now, create synthetic versions based on common configurations
    // In production, this should query a real database or API
    const baseVersions = [
      { variant: 'Base', transmission: 'Manual', fuel: 'Bencina' },
      { variant: 'Mid', transmission: 'Automática', fuel: 'Bencina' },
      { variant: 'Full', transmission: 'Automática', fuel: 'Bencina' },
    ]

    // Create version objects
    const versions: VehicleVersion[] = baseVersions.map((v, index) => ({
      id: Math.floor(Math.random() * 100000) + index,
      id_version: Math.floor(Math.random() * 100000) + index,
      marca: brand,
      modelo: model,
      version: `${v.variant}`,
      ano: year,
      combustible: v.fuel,
      transmision: v.transmission,
      mas_probable: index === 1, // Mid variant is usually most common
      carroceria: model.toLowerCase().includes('suv') || model.toLowerCase().includes('x-trail') || 
                  model.toLowerCase().includes('rav4') || model.toLowerCase().includes('tracker') ? 
                  'SUV' : 'Sedan',
      tipo: 'Particular'
    }))

    return versions
  }

  /**
   * Get valuations for multiple versions
   * Since we can't get versions without a plate, we'll generate estimated values
   * In production, you would need a different approach
   */
  async getValuationsByVersions(versions: VehicleVersion[]): Promise<Map<number, VehicleValuation>> {
    const valuations = new Map<number, VehicleValuation>()
    
    for (const version of versions) {
      // Generate estimated values based on year and variant
      const baseValue = this.estimateBaseValue(version.marca, version.modelo, version.ano)
      const variantMultiplier = version.version === 'Full' ? 1.2 : version.version === 'Mid' ? 1.1 : 1.0
      const valor_comercial = Math.round(baseValue * variantMultiplier)
      
      valuations.set(version.id_version, {
        valor_comercial,
        valor_minimo: Math.round(valor_comercial * 0.85),
        valor_maximo: Math.round(valor_comercial * 1.15),
        fecha_tasacion: new Date().toISOString().split('T')[0],
        moneda: 'CLP',
        precio_original: valor_comercial,
        precio_historico: null
      })
    }
    
    return valuations
  }

  /**
   * Estimate base value for a vehicle (in CLP)
   * This is a simplified estimation - in production use real data
   */
  private estimateBaseValue(brand: string, model: string, year: number): number {
    const currentYear = new Date().getFullYear()
    const age = currentYear - year
    
    // Base prices by category (in millions CLP)
    const categoryPrices: Record<string, number> = {
      // Compact/City cars
      'Spark': 8000000, 'Morning': 8500000, 'Swift': 10000000,
      // Sedans
      'Corolla': 18000000, 'Versa': 14000000, 'Accent': 15000000,
      'Sail': 12000000, 'Virtus': 16000000, 'Polo': 15000000,
      // SUVs
      'RAV4': 25000000, 'CX-5': 24000000, 'Tucson': 23000000,
      'Sportage': 22000000, 'Kicks': 18000000, 'T-Cross': 17000000,
      'Tracker': 16000000, 'Creta': 17000000, 'Vitara': 18000000,
      'Seltos': 19000000, 'CX-30': 22000000,
      // Pickups
      'Hilux': 28000000, 'Frontier': 26000000,
      // Default
      'default': 15000000
    }
    
    const basePrice = categoryPrices[model] || categoryPrices['default']
    
    // Apply depreciation (15% per year, simplified)
    const depreciationRate = 0.15
    const currentValue = basePrice * Math.pow(1 - depreciationRate, age)
    
    return Math.round(currentValue)
  }
}

// Singleton instance
export const autoPressService = new AutoPressService()