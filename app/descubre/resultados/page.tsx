'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, ChevronRight, Filter, Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatCLP } from '@/lib/utils/currency'
import { cn } from '@/lib/utils'

interface DiscoveryData {
  paymentMode: 'monthly' | 'cash'
  budget: { min: number; max: number } | null
  bodyTypes: string[]
  fuelTypes: string[]
  features: string[]
  brands: string[]
}

interface Vehicle {
  id: string
  brand: string
  model: string
  version: string
  price: number
  monthlyPayment: number
  year: number
  bodyType: string
  fuelType: string
  transmission: string
  features: {
    economy: boolean
    space: boolean
    performance: boolean
    safety: boolean
    technology: boolean
    comfort: boolean
    resale: boolean
    highway: boolean
    cargo: boolean
    maintenance: boolean
  }
}

export default function ResultadosPage() {
  const router = useRouter()
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'price' | 'monthly'>('price')
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load discovery data from localStorage
        const data = localStorage.getItem('carDiscovery')
        if (!data) {
          router.push('/descubre')
          return
        }
        
        const parsed = JSON.parse(data) as DiscoveryData
        console.log('Discovery data loaded:', parsed)
        setDiscoveryData(parsed)
        
        // Build API query parameters
        const params = new URLSearchParams()
        
        // Add budget filters
        if (parsed.budget && parsed.budget.min && parsed.budget.max) {
          params.append('minPrice', parsed.budget.min.toString())
          params.append('maxPrice', parsed.budget.max.toString())
        }
        
        // Add body type filters
        if (parsed.bodyTypes && parsed.bodyTypes.length > 0) {
          params.append('bodyTypes', parsed.bodyTypes.join(','))
        }
        
        // Add fuel type filters
        if (parsed.fuelTypes && parsed.fuelTypes.length > 0) {
          params.append('fuelTypes', parsed.fuelTypes.join(','))
        }
        
        // Add brand filters
        if (parsed.brands && parsed.brands.length > 0) {
          params.append('brands', parsed.brands.join(','))
        }
        
        // Add feature filters
        if (parsed.features && parsed.features.length > 0) {
          params.append('features', parsed.features.join(','))
        }
        
        console.log('Fetching vehicles with params:', params.toString())
        
        // Fetch vehicles from API
        const response = await fetch(`/api/discovery/vehicles?${params}`)
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch vehicles')
        }
        
        console.log('Vehicles fetched:', result.vehicles?.length || 0)
        
        // Calculate match scores and reasons
        const vehiclesWithScores = (result.vehicles || []).map((v: Vehicle) => {
          let matchScore = 70 // Base score
          const matchReasons: string[] = []
          
          // Check budget match
          if (parsed.budget) {
            const priceToCheck = parsed.paymentMode === 'monthly' ? v.monthlyPayment : v.price
            if (priceToCheck >= parsed.budget.min && priceToCheck <= parsed.budget.max) {
              matchScore += 10
              matchReasons.push('Dentro de tu presupuesto')
            }
          }
          
          // Check feature matches
          if (parsed.features.length > 0) {
            const featureMap: Record<string, string> = {
              economy: 'Económico',
              space: 'Espacioso',
              performance: 'Alto rendimiento',
              safety: 'Seguro',
              technology: 'Tecnológico',
              comfort: 'Confortable',
              resale: 'Buen valor de reventa',
              highway: 'Ideal para carretera',
              cargo: 'Gran capacidad de carga',
              maintenance: 'Fácil mantenimiento'
            }
            
            parsed.features.forEach(feature => {
              if (v.features[feature as keyof typeof v.features]) {
                matchScore += 5
                matchReasons.push(featureMap[feature])
              }
            })
          }
          
          // Check body type match
          if (parsed.bodyTypes.includes(v.bodyType)) {
            matchScore += 5
            matchReasons.push('Tipo de carrocería deseado')
          }
          
          // Check fuel type match
          if (parsed.fuelTypes.includes(v.fuelType)) {
            matchScore += 5
            matchReasons.push('Tipo de combustible preferido')
          }
          
          // Check brand match
          if (parsed.brands.includes(v.brand)) {
            matchScore += 5
            matchReasons.push('Marca preferida')
          }
          
          return {
            ...v,
            matchScore: Math.min(matchScore, 100),
            matchReasons
          }
        })
        
        // Sort by match score initially
        vehiclesWithScores.sort((a: any, b: any) => b.matchScore - a.matchScore)
        
        setVehicles(vehiclesWithScores)
      } catch (err) {
        console.error('Error fetching vehicles:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar vehículos')
      } finally {
        setLoading(false)
      }
    }
    
    fetchVehicles()
  }, [router])
  
  const handleSort = (type: 'price' | 'monthly') => {
    setSortBy(type)
    const sorted = [...vehicles]
    
    if (type === 'price') {
      sorted.sort((a, b) => a.price - b.price)
    } else {
      sorted.sort((a, b) => a.monthlyPayment - b.monthlyPayment)
    }
    
    setVehicles(sorted)
  }
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    )
  }

  const bodyTypeLabels: Record<string, string> = {
    suv: 'SUVs',
    sedan: 'Saloons',
    hatchback: 'Hatchbacks',
    pickup: 'Pickup',
    coupe: 'Coupes',
    minivan: 'People carriers',
    wagon: 'Estate cars',
    convertible: 'Convertibles',
    sports: 'Sports cars',
    commercial: 'Comercial',
    other: 'Otro'
  }

  const fuelTypeLabels: Record<string, string> = {
    gasoline: 'Bencina',
    diesel: 'Diésel',
    hybrid: 'Híbrido',
    electric: 'Eléctrico',
    gas: 'Gas'
  }

  if (!discoveryData) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/descubre"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Modificar búsqueda</span>
            </Link>
            
            <h1 className="text-lg font-bold text-neutral-900">
              {loading ? 'Buscando...' : `${vehicles.length} autos encontrados`}
            </h1>
            
            <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filtros</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filters Summary */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 text-sm overflow-x-auto">
            {discoveryData.budget && (
              <span className="px-3 py-1 bg-neutral-100 rounded-full whitespace-nowrap">
                {formatCLP(discoveryData.budget.min)} - {formatCLP(discoveryData.budget.max)}
              </span>
            )}
            {discoveryData.bodyTypes && discoveryData.bodyTypes.length > 0 && (
              <span className="px-3 py-1 bg-neutral-100 rounded-full">
                {discoveryData.bodyTypes.map(bt => bodyTypeLabels[bt] || bt).join(', ')}
              </span>
            )}
            {discoveryData.fuelTypes && discoveryData.fuelTypes.length > 0 && (
              <span className="px-3 py-1 bg-neutral-100 rounded-full">
                {discoveryData.fuelTypes.map(ft => fuelTypeLabels[ft] || ft).join(', ')}
              </span>
            )}
            {discoveryData.brands && discoveryData.brands.length > 0 && (
              <span className="px-3 py-1 bg-neutral-100 rounded-full">
                {discoveryData.brands.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      {!loading && vehicles.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">Ordenar por:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('price')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  sortBy === 'price'
                    ? "bg-brand text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-50"
                )}
              >
                Menor precio
              </button>
              {discoveryData.paymentMode === 'monthly' && (
                <button
                  onClick={() => handleSort('monthly')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    sortBy === 'monthly'
                      ? "bg-brand text-white"
                      : "bg-white text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  Menor cuota
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <main className="container mx-auto px-4 pb-8">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-brand" />
            <p className="text-xl text-neutral-600">
              Buscando los mejores vehículos para ti...
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              Esto puede tomar unos momentos mientras consultamos nuestra base de datos
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-xl text-red-600 mb-4">
              Error al cargar vehículos
            </p>
            <p className="text-neutral-600 mb-4">{error}</p>
            <Link
              href="/descubre"
              className="inline-block px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
            >
              Volver a intentar
            </Link>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-xl text-neutral-600 mb-4">
              No encontramos autos que coincidan con tus preferencias
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Intenta ajustar tus filtros para ver más opciones
            </p>
            <Link
              href="/descubre"
              className="inline-block px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all"
            >
              Modificar búsqueda
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {vehicles.map((vehicle: any, index) => (
              <div 
                key={vehicle.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Match Badge */}
                {index === 0 && vehicle.matchScore >= 80 && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 text-sm font-medium">
                    🏆 Mejor match para ti ({vehicle.matchScore}%)
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {vehicle.version} · {vehicle.year}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {bodyTypeLabels[vehicle.bodyType]} · {fuelTypeLabels[vehicle.fuelType]} · {vehicle.transmission}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(vehicle.id)}
                      className="p-2 rounded-lg hover:bg-neutral-50 transition-all"
                    >
                      <Heart 
                        className={cn(
                          "h-5 w-5",
                          favorites.includes(vehicle.id)
                            ? "fill-red-500 text-red-500"
                            : "text-neutral-400"
                        )}
                      />
                    </button>
                  </div>

                  {/* Match Info */}
                  {vehicle.matchScore && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(vehicle.matchScore / 20)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-neutral-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-neutral-700">
                          {vehicle.matchScore}% match
                        </span>
                      </div>
                      
                      {vehicle.matchReasons && vehicle.matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {vehicle.matchReasons.slice(0, 3).map((reason: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatCLP(vehicle.price)}
                      </p>
                    </div>
                    {discoveryData.paymentMode === 'monthly' && (
                      <p className="text-sm text-neutral-600">
                        Desde {formatCLP(vehicle.monthlyPayment)} al mes
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {vehicle.features.economy && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Económico
                      </span>
                    )}
                    {vehicle.features.space && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Espacioso
                      </span>
                    )}
                    {vehicle.features.safety && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Seguro
                      </span>
                    )}
                    {vehicle.features.technology && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Tecnológico
                      </span>
                    )}
                    {vehicle.features.resale && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        Buena reventa
                      </span>
                    )}
                    {vehicle.features.highway && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        Carretero
                      </span>
                    )}
                    {vehicle.features.cargo && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                        Carga
                      </span>
                    )}
                    {vehicle.features.maintenance && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Fácil mantención
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/configurar?brand=${vehicle.brand}&model=${vehicle.model}&year=${vehicle.year}`}
                      className="flex-1 px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all text-center"
                    >
                      Ver detalles
                    </Link>
                    <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all flex items-center gap-2">
                      Comparar
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}