'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, ChevronRight, Filter, Heart } from 'lucide-react'
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
  monthlyPayment?: number
  year: number
  bodyType: string
  fuelType: string
  image?: string
  matchScore: number
  matchReasons: string[]
  discount?: number
  dealerCount: number
  features: {
    economy: boolean
    space: boolean
    performance: boolean
    safety: boolean
    technology: boolean
    comfort: boolean
  }
}

// Mock vehicles data
const allVehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    version: 'XEI CVT',
    price: 22990000,
    monthlyPayment: 450000,
    year: 2024,
    bodyType: 'sedan',
    fuelType: 'gasoline',
    matchScore: 98,
    matchReasons: ['Perfecto para tu presupuesto', 'Excelente economía', 'Alta confiabilidad'],
    discount: 1500000,
    dealerCount: 5,
    features: {
      economy: true,
      space: false,
      performance: false,
      safety: true,
      technology: true,
      comfort: true
    }
  },
  {
    id: '2',
    brand: 'Nissan',
    model: 'Kicks',
    version: 'Advance CVT',
    price: 24900000,
    monthlyPayment: 490000,
    year: 2024,
    bodyType: 'suv',
    fuelType: 'gasoline',
    matchScore: 95,
    matchReasons: ['SUV compacto ideal', 'Tecnología avanzada', 'Espacioso'],
    discount: 2000000,
    dealerCount: 4,
    features: {
      economy: true,
      space: true,
      performance: false,
      safety: true,
      technology: true,
      comfort: true
    }
  },
  {
    id: '3',
    brand: 'Hyundai',
    model: 'Tucson',
    version: '2.0 AT',
    price: 32900000,
    monthlyPayment: 650000,
    year: 2024,
    bodyType: 'suv',
    fuelType: 'gasoline',
    matchScore: 92,
    matchReasons: ['SUV familiar', 'Garantía extendida', 'Diseño moderno'],
    dealerCount: 6,
    features: {
      economy: false,
      space: true,
      performance: true,
      safety: true,
      technology: true,
      comfort: true
    }
  },
  {
    id: '4',
    brand: 'Mazda',
    model: '3',
    version: '2.0 AT',
    price: 26500000,
    monthlyPayment: 520000,
    year: 2024,
    bodyType: 'sedan',
    fuelType: 'gasoline',
    matchScore: 90,
    matchReasons: ['Deportivo y elegante', 'Excelente manejo', 'Premium'],
    discount: 1200000,
    dealerCount: 3,
    features: {
      economy: false,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true
    }
  },
  {
    id: '5',
    brand: 'Volkswagen',
    model: 'T-Cross',
    version: 'Comfortline TSI',
    price: 25990000,
    monthlyPayment: 510000,
    year: 2024,
    bodyType: 'suv',
    fuelType: 'gasoline',
    matchScore: 88,
    matchReasons: ['SUV urbano', 'Calidad alemana', 'Tecnológico'],
    dealerCount: 4,
    features: {
      economy: true,
      space: false,
      performance: true,
      safety: true,
      technology: true,
      comfort: true
    }
  },
  {
    id: '6',
    brand: 'Chevrolet',
    model: 'Onix',
    version: 'Turbo AT',
    price: 18900000,
    monthlyPayment: 370000,
    year: 2024,
    bodyType: 'hatchback',
    fuelType: 'gasoline',
    matchScore: 85,
    matchReasons: ['Económico', 'Ideal para ciudad', 'Conectividad'],
    discount: 1000000,
    dealerCount: 5,
    features: {
      economy: true,
      space: false,
      performance: false,
      safety: false,
      technology: true,
      comfort: false
    }
  },
  {
    id: '7',
    brand: 'Kia',
    model: 'Seltos',
    version: 'EX 1.6T',
    price: 28900000,
    monthlyPayment: 570000,
    year: 2024,
    bodyType: 'suv',
    fuelType: 'gasoline',
    matchScore: 93,
    matchReasons: ['SUV moderno', 'Garantía 7 años', 'Full equipo'],
    dealerCount: 4,
    features: {
      economy: false,
      space: true,
      performance: true,
      safety: true,
      technology: true,
      comfort: true
    }
  },
  {
    id: '8',
    brand: 'Toyota',
    model: 'RAV4',
    version: 'Hybrid AWD',
    price: 45900000,
    monthlyPayment: 900000,
    year: 2024,
    bodyType: 'suv',
    fuelType: 'hybrid',
    matchScore: 94,
    matchReasons: ['Híbrido eficiente', 'Tracción 4x4', 'Premium'],
    dealerCount: 3,
    features: {
      economy: true,
      space: true,
      performance: true,
      safety: true,
      technology: true,
      comfort: true
    }
  }
]

export default function ResultadosPage() {
  const router = useRouter()
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'monthly'>('match')
  
  useEffect(() => {
    // Load discovery data from localStorage
    const data = localStorage.getItem('carDiscovery')
    if (data) {
      const parsed = JSON.parse(data) as DiscoveryData
      setDiscoveryData(parsed)
      
      // Filter and sort vehicles based on preferences
      let filtered = allVehicles.filter(v => {
        // Filter by budget
        if (parsed.budget) {
          const priceToCheck = parsed.paymentMode === 'monthly' ? v.monthlyPayment || 0 : v.price
          if (priceToCheck < parsed.budget.min || priceToCheck > parsed.budget.max) {
            return false
          }
        }
        
        // Filter by body types (if any selected)
        if (parsed.bodyTypes && parsed.bodyTypes.length > 0 && !parsed.bodyTypes.includes(v.bodyType)) {
          return false
        }
        
        // Filter by fuel types (if any selected)
        if (parsed.fuelTypes && parsed.fuelTypes.length > 0 && !parsed.fuelTypes.includes(v.fuelType)) {
          return false
        }
        
        // Filter by brands (if any selected)
        if (parsed.brands && parsed.brands.length > 0 && !parsed.brands.includes(v.brand)) {
          return false
        }
        
        return true
      })
      
      // Calculate match scores based on features
      filtered = filtered.map(v => {
        let score = v.matchScore
        const reasons: string[] = []
        
        if (parsed.features.includes('economy') && v.features.economy) {
          score += 5
          reasons.push('Excelente economía')
        }
        if (parsed.features.includes('space') && v.features.space) {
          score += 5
          reasons.push('Amplio espacio')
        }
        if (parsed.features.includes('performance') && v.features.performance) {
          score += 5
          reasons.push('Altas prestaciones')
        }
        if (parsed.features.includes('safety') && v.features.safety) {
          score += 5
          reasons.push('Máxima seguridad')
        }
        if (parsed.features.includes('technology') && v.features.technology) {
          score += 5
          reasons.push('Alta tecnología')
        }
        if (parsed.features.includes('comfort') && v.features.comfort) {
          score += 5
          reasons.push('Gran confort')
        }
        
        return {
          ...v,
          matchScore: Math.min(score, 100),
          matchReasons: reasons.length > 0 ? reasons : v.matchReasons
        }
      })
      
      // Sort by match score
      filtered.sort((a, b) => b.matchScore - a.matchScore)
      
      setVehicles(filtered)
    } else {
      // If no discovery data, redirect back
      router.push('/descubre')
    }
  }, [router])
  
  const handleSort = (type: 'match' | 'price' | 'monthly') => {
    setSortBy(type)
    const sorted = [...vehicles]
    
    switch (type) {
      case 'match':
        sorted.sort((a, b) => b.matchScore - a.matchScore)
        break
      case 'price':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'monthly':
        sorted.sort((a, b) => (a.monthlyPayment || 0) - (b.monthlyPayment || 0))
        break
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

  if (!discoveryData) {
    return null
  }

  const bodyTypeLabels: Record<string, string> = {
    suv: 'SUV',
    sedan: 'Sedán',
    hatchback: 'Hatchback',
    pickup: 'Pickup',
    coupe: 'Coupé',
    minivan: 'Minivan'
  }

  const fuelTypeLabels: Record<string, string> = {
    gasoline: 'Bencina',
    diesel: 'Diésel',
    hybrid: 'Híbrido',
    electric: 'Eléctrico'
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
              {vehicles.length} autos encontrados
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
                {discoveryData.paymentMode === 'monthly' ? 'Mensual: ' : ''}
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-600">Ordenar por:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('match')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                sortBy === 'match'
                  ? "bg-brand text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              )}
            >
              Mejor match
            </button>
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

      {/* Results Grid */}
      <main className="container mx-auto px-4 pb-8">
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-xl text-neutral-600 mb-4">
              No encontramos autos que coincidan con tus preferencias
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
            {vehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Match Badge */}
                {index === 0 && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 text-sm font-medium">
                    🏆 Mejor match para ti
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-neutral-600">{vehicle.version} · {vehicle.year}</p>
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

                  {/* Match Score */}
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
                    
                    <div className="flex flex-wrap gap-2">
                      {vehicle.matchReasons.slice(0, 3).map((reason, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatCLP(vehicle.price)}
                      </p>
                      {vehicle.discount && (
                        <span className="text-sm text-green-600 font-medium">
                          -{formatCLP(vehicle.discount)}
                        </span>
                      )}
                    </div>
                    {discoveryData.paymentMode === 'monthly' && vehicle.monthlyPayment && (
                      <p className="text-sm text-neutral-600">
                        Desde {formatCLP(vehicle.monthlyPayment)} al mes
                      </p>
                    )}
                  </div>

                  {/* Dealer Count */}
                  <p className="text-sm text-neutral-600 mb-4">
                    {vehicle.dealerCount} concesionarios con ofertas
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/configurar?brand=${vehicle.brand}&model=${vehicle.model}&year=${vehicle.year}`}
                      className="flex-1 px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-all text-center"
                    >
                      Ver ofertas
                    </Link>
                    <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all flex items-center gap-2">
                      Detalles
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