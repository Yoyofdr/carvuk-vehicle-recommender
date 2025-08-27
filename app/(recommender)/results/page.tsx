'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Car, Activity } from 'lucide-react'
import useWizardStore from '../_hooks/useWizardStore'
import { analytics } from '../_client/analytics'
import { formatCLP } from '@/lib/utils/currency'
import ResultCard from '../components/ResultCard'
import EmptyState from '../components/EmptyState'
import { VehicleRecommendation } from '@/lib/services/VehicleRankingService'
import { InsuranceRecommendation } from '@/lib/services/InsuranceRankingService'
// import UsedVehiclesSection from '../components/UsedVehiclesSection'
// import ScrapingDashboard from '../components/ScrapingDashboard'

type Recommendation = VehicleRecommendation | InsuranceRecommendation

export default function ResultsPage() {
  const router = useRouter()
  const { vertical, answers, reset } = useWizardStore()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'recommended' | 'used' | 'dashboard'>('recommended')

  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const endpoint = vertical === 'vehicles' 
        ? '/api/recommender/vehicles'
        : '/api/recommender/insurance'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      setRecommendations(data.items || [])

      analytics.track('recommender_results_view', {
        vertical,
        resultsCount: data.items?.length || 0
      })
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Error al cargar las recomendaciones. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }, [vertical, answers])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  const handleSelectRecommendation = (id: string, score: number) => {
    analytics.track('recommender_select', {
      vertical,
      selectedId: id,
      score
    })
    // TODO: Navigate to detail page or trigger action
  }

  const handleValuation = (brand: string, model: string, year: number) => {
    analytics.track('valuation_request', {
      from: 'results',
      brand,
      model,
      year
    })
    // Open valuation in new tab with pre-filled data
    const params = new URLSearchParams({
      brand,
      model,
      year: year.toString()
    })
    router.push(`/valuation?${params.toString()}`)
  }

  const handleBackToWizard = () => {
    router.push('/')
  }

  const handleStartOver = () => {
    reset()
    router.push('/')
  }

  const isVehicleRecommendation = (rec: Recommendation): rec is VehicleRecommendation => {
    return 'vehicle' in rec
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-neutral-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState
          title="Ocurrió un error"
          description={error}
          icon="alert"
          action={{
            label: 'Intentar nuevamente',
            onClick: fetchRecommendations
          }}
        />
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState
          title="No encontramos resultados"
          description="Intenta ajustar tus preferencias para ver más opciones"
          action={{
            label: 'Ajustar preferencias',
            onClick: handleBackToWizard
          }}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {activeTab === 'dashboard' ? 'Dashboard de Scraping' : 
             activeTab === 'used' ? 'Vehículos Usados Disponibles' : 
             'Lo que mejor calza contigo'}
          </h1>
          <p className="mt-2 text-neutral-600">
            {activeTab === 'dashboard' ? 'Métricas y estadísticas en tiempo real' :
             activeTab === 'used' ? 'Agregados de múltiples fuentes con análisis IA' :
             'Basado en tu presupuesto y preferencias'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToWizard}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ajustar</span>
          </button>
          
          <button
            onClick={handleStartOver}
            className="px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Comenzar de nuevo
          </button>
        </div>
      </div>

      {/* Tabs */}
      {vertical === 'vehicles' && (
        <div className="flex gap-2 mb-8 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'recommended' 
                ? 'text-brand border-brand' 
                : 'text-neutral-600 border-transparent hover:text-neutral-900'
            }`}
          >
            Recomendados para ti
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`px-4 py-3 font-medium transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'used' 
                ? 'text-brand border-brand' 
                : 'text-neutral-600 border-transparent hover:text-neutral-900'
            }`}
          >
            <Car className="h-4 w-4" />
            Vehículos Usados
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 font-medium transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'dashboard' 
                ? 'text-brand border-brand' 
                : 'text-neutral-600 border-transparent hover:text-neutral-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </button>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'dashboard' ? (
        <div className="text-center py-12">Dashboard coming soon...</div>
      ) : activeTab === 'used' ? (
        <div className="text-center py-12">Used vehicles section coming soon...</div>
      ) : (
        /* Results Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => {
          if (isVehicleRecommendation(rec)) {
            const vehicle = rec.vehicle
            return (
              <ResultCard
                key={vehicle.id}
                title={`${vehicle.brand} ${vehicle.model}`}
                subtitle={`${vehicle.year} · ${vehicle.engineSize}L · ${vehicle.transmission === 'automatic' ? 'Automática' : 'Manual'}`}
                image={vehicle.image}
                price={formatCLP(vehicle.priceCLP)}
                monthlyPrice={rec.monthlyEstimateCLP ? formatCLP(rec.monthlyEstimateCLP) : undefined}
                score={rec.score}
                reasons={rec.reasons}
                features={vehicle.features.slice(0, 3)}
                highlighted={index === 0}
                ctaLabel="Ver detalles"
                onCtaClick={() => handleSelectRecommendation(vehicle.id, rec.score)}
                valuationData={{
                  brand: vehicle.brand,
                  model: vehicle.model,
                  year: vehicle.year
                }}
                onValuationClick={() => handleValuation(vehicle.brand, vehicle.model, vehicle.year)}
              />
            )
          } else {
            const product = rec.product
            const premium = rec.premium
            return (
              <ResultCard
                key={product.id}
                title={product.productName}
                subtitle={product.provider}
                price={premium ? formatCLP(premium.monthlyPremiumCLP) + '/mes' : 'Cotizar'}
                score={rec.score}
                reasons={rec.reasons}
                features={[
                  product.features.workshopType === 'brand' && 'Taller de marca',
                  product.features.replacementCar && 'Auto de reemplazo',
                  product.features.roadAssistance && 'Asistencia en ruta',
                  product.features.internationalCoverage && 'Cobertura internacional'
                ].filter(Boolean) as string[]}
                highlighted={index === 0}
                ctaLabel="Cotizar"
                onCtaClick={() => handleSelectRecommendation(product.id, rec.score)}
              />
            )
          }
        })}
        </div>
      )}
    </div>
  )
}