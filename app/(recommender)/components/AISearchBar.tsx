'use client'

import { useState } from 'react'
import { Search, Sparkles, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from './Toast'
import useWizardStore from '../_hooks/useWizardStore'
import { useRouter } from 'next/navigation'

export default function AISearchBar() {
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { showToast } = useToast()
  const { setAnswers } = useWizardStore()
  const router = useRouter()

  const suggestions = [
    'Busco un auto familiar económico',
    'SUV híbrido con buen rendimiento',
    'Sedán automático bajo 15 millones',
    'Auto deportivo para ciudad',
    'Camioneta 4x4 para trabajo',
    'Hatchback eléctrico moderno'
  ]

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await response.json()

      if (data.success) {
        // Convert AI parsed query to wizard answers format
        const wizardAnswers: Record<string, string | number | string[] | number[] | [number, number]> = {}

        // Map body types
        if (data.filters.bodyTypes?.length > 0) {
          wizardAnswers.bodyTypes = data.filters.bodyTypes
        }

        // Map fuel types
        if (data.filters.fuelTypes?.length > 0) {
          wizardAnswers.fuelTypes = data.filters.fuelTypes
        }

        // Map transmission
        if (data.filters.transmission) {
          wizardAnswers.transmission = data.filters.transmission
        }

        // Map price range
        if (data.filters.priceRange) {
          // Convert to monthly budget (rough estimation)
          const [minPrice, maxPrice] = data.filters.priceRange
          wizardAnswers.monthlyBudget = [
            Math.round(minPrice * 0.02), // 2% monthly estimation
            Math.round(maxPrice * 0.02)
          ]
        }

        // Map usage
        if (data.filters.usage?.length > 0) {
          wizardAnswers.usage = data.filters.usage
        }

        // Set answers in store
        setAnswers(wizardAnswers)

        showToast({
          type: 'success',
          message: '¡Búsqueda interpretada con IA!',
          description: data.interpretation || 'Aplicando filtros personalizados'
        })

        // Navigate to results
        router.push('/results')
        
      } else {
        throw new Error(data.error || 'Error al procesar búsqueda')
      }
    } catch (error) {
      console.error('AI Search error:', error)
      showToast({
        type: 'error',
        message: 'Error al procesar búsqueda',
        description: 'Intenta con una búsqueda más simple'
      })
    } finally {
      setIsProcessing(false)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    handleSearch()
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Search Input */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder="Describe qué auto buscas con lenguaje natural..."
            className={cn(
              'w-full pl-12 pr-32 py-4 rounded-2xl border-2 transition-all text-lg',
              'placeholder:text-neutral-400 focus:outline-none',
              isProcessing 
                ? 'border-brand/50 bg-brand/5' 
                : 'border-neutral-200 focus:border-brand hover:border-neutral-300'
            )}
            disabled={isProcessing}
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 pointer-events-none">
            {isProcessing ? (
              <Loader2 className="h-5 w-5 text-brand animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-neutral-400" />
            )}
          </div>

          {/* AI Badge */}
          <div className="absolute right-3">
            <button
              onClick={handleSearch}
              disabled={isProcessing || !query.trim()}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
                isProcessing || !query.trim()
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand to-purple-600 text-white hover:shadow-lg hover:scale-105'
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>Buscar con IA</span>
            </button>
          </div>

          {/* Clear Button */}
          {query && !isProcessing && (
            <button
              onClick={() => {
                setQuery('')
                setShowSuggestions(false)
              }}
              className="absolute right-32 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-neutral-500" />
            </button>
          )}
        </div>

        {/* AI Indicator */}
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          <Sparkles className="h-3 w-3" />
          <span>Powered by GPT - Describe tu auto ideal en palabras simples</span>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && !isProcessing && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50">
          <div className="p-3 border-b border-neutral-100">
            <p className="text-xs font-medium text-neutral-500 uppercase">
              Ejemplos de búsqueda
            </p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors flex items-center gap-3 group"
              >
                <Search className="h-4 w-4 text-neutral-400 group-hover:text-brand" />
                <span className="text-sm text-neutral-700 group-hover:text-neutral-900">
                  {suggestion}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-neutral-100 bg-neutral-50">
            <p className="text-xs text-neutral-500">
              💡 Tip: Puedes mencionar marca, precio, tipo de uso, o cualquier característica
            </p>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-40">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-brand animate-spin mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700">Analizando tu búsqueda con IA...</p>
          </div>
        </div>
      )}
    </div>
  )
}