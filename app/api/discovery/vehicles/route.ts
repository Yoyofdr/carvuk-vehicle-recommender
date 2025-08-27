import { NextRequest, NextResponse } from 'next/server'
import { autoPressService } from '@/lib/services/AutoPressService'

// Define interfaces for our response
interface VehicleResult {
  id: string
  brand: string
  model: string
  year: number
  version: string
  bodyType: string
  fuelType: string
  transmission: string
  price: number
  monthlyPayment: number
  features: {
    economy: boolean
    space: boolean
    performance: boolean
    safety: boolean
    technology: boolean
    comfort: boolean
  }
}

// Map Spanish terms to English for consistency
const mapBodyType = (carroceria: string): string => {
  const map: Record<string, string> = {
    'Sedan': 'sedan',
    'Sedán': 'sedan',
    'Hatchback': 'hatchback',
    'Station Wagon': 'wagon',
    'SUV': 'suv',
    'Pickup': 'pickup',
    'Camioneta': 'pickup',
    'Van': 'minivan',
    'Minivan': 'minivan',
    'Coupe': 'coupe',
    'Coupé': 'coupe',
    'Convertible': 'convertible',
    'Cabriolet': 'convertible'
  }
  return map[carroceria] || 'other'
}

const mapFuelType = (combustible: string): string => {
  const map: Record<string, string> = {
    'Bencina': 'gasoline',
    'Gasolina': 'gasoline',
    'Diésel': 'diesel',
    'Diesel': 'diesel',
    'Híbrido': 'hybrid',
    'Hibrido': 'hybrid',
    'Eléctrico': 'electric',
    'Electrico': 'electric',
    'GNC': 'gas',
    'GLP': 'gas'
  }
  return map[combustible] || 'gasoline'
}

// Estimate features based on brand, model, and price
const estimateFeatures = (brand: string, model: string, price: number) => {
  // Price ranges for feature estimation (in CLP millions)
  const isPremium = price > 30000000
  const isBudget = price < 15000000
  
  // Brand reputation for features
  const economyBrands = ['Suzuki', 'Kia', 'Hyundai', 'Nissan', 'Chevrolet', 'Fiat', 'Renault']
  const performanceBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Mazda', 'Ford', 'Volkswagen']
  const safetyBrands = ['Volvo', 'Subaru', 'Toyota', 'Honda', 'Mazda', 'Hyundai']
  const techBrands = ['Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Kia', 'Hyundai']
  
  return {
    economy: economyBrands.includes(brand) || isBudget,
    space: model.toLowerCase().includes('suv') || model.toLowerCase().includes('van'),
    performance: performanceBrands.includes(brand) || isPremium,
    safety: safetyBrands.includes(brand) || isPremium,
    technology: techBrands.includes(brand) || isPremium,
    comfort: isPremium || price > 25000000
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get filter parameters
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bodyTypes = searchParams.get('bodyTypes')?.split(',').filter(Boolean) || []
    const fuelTypes = searchParams.get('fuelTypes')?.split(',').filter(Boolean) || []
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || []
    const features = searchParams.get('features')?.split(',').filter(Boolean) || []
    
    console.log('Discovery filters:', {
      minPrice,
      maxPrice,
      bodyTypes,
      fuelTypes,
      brands,
      features
    })
    
    const vehicles: VehicleResult[] = []
    
    // Use a simplified catalog for demo
    const catalog = [
      { brand: 'Toyota', models: ['Corolla', 'RAV4', 'Hilux', 'Yaris'], years: [2022, 2023, 2024] },
      { brand: 'Chevrolet', models: ['Spark', 'Onix', 'Tracker'], years: [2022, 2023, 2024] },
      { brand: 'Nissan', models: ['Versa', 'Kicks', 'X-Trail'], years: [2022, 2023, 2024] },
      { brand: 'Hyundai', models: ['Accent', 'Tucson', 'Creta'], years: [2022, 2023, 2024] },
      { brand: 'Kia', models: ['Rio', 'Seltos', 'Sportage'], years: [2022, 2023, 2024] }
    ]
    
    // Filter catalog based on selected brands
    const catalogToQuery = brands.length > 0
      ? catalog.filter(c => brands.includes(c.brand))
      : catalog
    
    // For each brand, get models and versions
    for (const brandData of catalogToQuery) {
      const { brand, models, years } = brandData
      
      // Limit models to query
      const modelsToQuery = models.slice(0, 3)
      
      for (const model of modelsToQuery) {
        // Limit years to query
        const yearsToQuery = years.slice(0, 2)
        
        for (const year of yearsToQuery) {
          try {
            // Get versions for this combination
            const versions = await autoPressService.getVersionsByFilters(brand, model, year)
            
            if (versions.length === 0) continue
            
            // Get valuations for versions
            const valuations = await autoPressService.getValuationsByVersions(versions)
            
            // Process each version
            for (const version of versions.slice(0, 2)) { // Limit versions per model
              const valuation = valuations.get(version.id_version)
              
              if (valuation) {
                const price = valuation.valor_comercial
                
                // Apply price filters
                if (minPrice && price < parseInt(minPrice)) continue
                if (maxPrice && price > parseInt(maxPrice)) continue
                
                // Map body and fuel types
                const bodyType = mapBodyType(version.carroceria || 'Sedan')
                const fuelType = mapFuelType(version.combustible || 'Bencina')
                
                // Apply body type filter
                if (bodyTypes.length > 0 && !bodyTypes.includes(bodyType)) continue
                
                // Apply fuel type filter
                if (fuelTypes.length > 0 && !fuelTypes.includes(fuelType)) continue
                
                // Estimate features
                const vehicleFeatures = estimateFeatures(brand, model, price)
                
                // Apply feature filter (vehicle must have at least one requested feature)
                if (features.length > 0) {
                  const hasRequestedFeature = features.some(f => 
                    vehicleFeatures[f as keyof typeof vehicleFeatures]
                  )
                  if (!hasRequestedFeature) continue
                }
                
                // Calculate monthly payment (rough estimate)
                const monthlyPayment = Math.round(price * 0.02) // 2% of price as monthly
                
                vehicles.push({
                  id: `${version.id_version}`,
                  brand,
                  model,
                  year,
                  version: version.version,
                  bodyType,
                  fuelType,
                  transmission: version.transmision || 'Manual',
                  price,
                  monthlyPayment,
                  features: vehicleFeatures
                })
              }
            }
          } catch (error) {
            console.error(`Error processing ${brand} ${model} ${year}:`, error)
            continue
          }
        }
      }
    }
    
    // Sort by price
    vehicles.sort((a, b) => a.price - b.price)
    
    return NextResponse.json({
      success: true,
      vehicles,
      total: vehicles.length,
      filters: {
        minPrice,
        maxPrice,
        bodyTypes,
        fuelTypes,
        brands,
        features
      }
    })
  } catch (error) {
    console.error('Error in discovery API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vehicles',
        vehicles: []
      },
      { status: 500 }
    )
  }
}