'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Vehicle } from '@/lib/entities/Vehicle'
import { InsuranceProduct } from '@/lib/entities/InsuranceProduct'
import { AIRecommendation } from '@/lib/types/ai'
import { VehicleAnswers, InsuranceAnswers } from '@/lib/schemas/answers'

interface AIRecommendationCardProps {
  vehicle?: Vehicle
  insurance?: InsuranceProduct
  userAnswers: VehicleAnswers | InsuranceAnswers
  className?: string
}

export default function AIRecommendationCard({ 
  vehicle, 
  insurance,
  userAnswers,
  className 
}: AIRecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)

  const fetchRecommendation = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: vehicle ? 'vehicle' : 'insurance',
          itemId: vehicle?.id || insurance?.id,
          userAnswers
        })
      })

      const data = await response.json()

      if (data.success) {
        setRecommendation(data.recommendation)
      } else {
        throw new Error(data.error || 'Failed to get recommendation')
      }
    } catch (err) {
      console.error('AI Recommendation error:', err)
      setError('No se pudo generar la recomendación de IA')
    } finally {
      setIsLoading(false)
    }
  }, [vehicle, insurance, userAnswers])

  useEffect(() => {
    if (vehicle || insurance) {
      fetchRecommendation()
    }
  }, [vehicle, insurance, fetchRecommendation])

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type)
    // TODO: Send feedback to analytics or API
    console.log('AI Feedback:', type)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'Alta confianza'
    if (score >= 0.6) return 'Confianza media'
    return 'Baja confianza'
  }

  if (!vehicle && !insurance) return null

  return (
    <div className={cn(
      'rounded-2xl border-2 border-brand/20 bg-gradient-to-br from-brand/5 to-purple-50 overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-brand/10 to-purple-100 border-b border-brand/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Brain className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                Análisis con IA
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </h3>
              <p className="text-xs text-neutral-600">Recomendación personalizada</p>
            </div>
          </div>
          
          {recommendation && (
            <div className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              getConfidenceColor(recommendation.confidenceScore)
            )}>
              {getConfidenceLabel(recommendation.confidenceScore)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-brand animate-spin mb-3" />
            <p className="text-sm text-neutral-600">Analizando con inteligencia artificial...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">{error}</p>
              <button
                onClick={fetchRecommendation}
                className="mt-2 text-xs text-red-700 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {recommendation && !error && (
          <div className="space-y-4">
            {/* Main Reasoning */}
            <div>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pros */}
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Ventajas
                </h4>
                <ul className="space-y-1">
                  {recommendation.pros.map((pro, idx) => (
                    <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Consideraciones
                </h4>
                <ul className="space-y-1">
                  {recommendation.cons.map((con, idx) => (
                    <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Expandable Section */}
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
              >
                <span>Ver más detalles</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-3 space-y-4 animate-fade-in">
                  {/* Personalized Advice */}
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">
                      Consejo Personalizado
                    </h4>
                    <p className="text-sm text-neutral-700">
                      {recommendation.personalizedAdvice}
                    </p>
                  </div>

                  {/* Alternatives */}
                  {recommendation.alternatives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 mb-2">
                        Alternativas Similares
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.alternatives.map((alt, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/70 rounded-full text-xs font-medium text-neutral-700"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <div className="pt-4 border-t border-brand/20">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-600">
                  ¿Te fue útil esta recomendación?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback('helpful')}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      feedback === 'helpful'
                        ? 'bg-green-100 text-green-600'
                        : 'hover:bg-neutral-100 text-neutral-400'
                    )}
                    aria-label="Útil"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback('not-helpful')}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      feedback === 'not-helpful'
                        ? 'bg-red-100 text-red-600'
                        : 'hover:bg-neutral-100 text-neutral-400'
                    )}
                    aria-label="No útil"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {feedback && (
                <p className="mt-2 text-xs text-neutral-500 text-right">
                  Gracias por tu feedback
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}