'use client'

import { useState, useEffect } from 'react'
import { Search, Car, Loader2, AlertCircle, TrendingDown, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCLP } from '@/lib/utils/currency'

interface VehicleVersion {
  id: number
  id_version: number
  marca: string
  modelo: string
  version: string
  ano: number
  combustible?: string
  transmision?: string
  carroceria?: string
  mas_probable?: boolean
  valuation?: {
    valor_comercial: number
    valor_minimo: number
    valor_maximo: number
    fecha_tasacion: string
    formatted: {
      commercial: string
      minimum: string
      maximum: string
    }
    projections?: {
      oneYear: number
      twoYears: number
      threeYears: number
    }
  }
}

interface VehicleFilterFormProps {
  initialBrand?: string
  initialModel?: string
  initialYear?: number
}

export default function VehicleFilterForm({ initialBrand, initialModel, initialYear }: VehicleFilterFormProps = {}) {
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || '')
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || '')
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear || null)
  
  // Data states
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  
  // Loading states
  const [loadingBrands, setLoadingBrands] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingValuations, setLoadingValuations] = useState(false)
  
  // Results
  const [results, setResults] = useState<VehicleVersion[] | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<VehicleVersion | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load brands on mount and handle initial values
  useEffect(() => {
    loadBrands()
  }, [])

  // Load models if initial brand is provided
  useEffect(() => {
    if (initialBrand && brands.includes(initialBrand)) {
      loadModels(initialBrand)
    }
  }, [initialBrand, brands])

  // Load years if initial model is provided
  useEffect(() => {
    if (initialBrand && initialModel && models.includes(initialModel)) {
      loadYears(initialBrand, initialModel)
    }
  }, [initialBrand, initialModel, models])

  // Auto-search if all initial values are provided
  useEffect(() => {
    if (initialBrand && initialModel && initialYear && 
        brands.includes(initialBrand) && 
        models.includes(initialModel) && 
        years.includes(initialYear)) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBrand, initialModel, initialYear, brands, models, years])

  // Load models when brand changes
  useEffect(() => {
    if (selectedBrand) {
      loadModels(selectedBrand)
      setSelectedModel('')
      setSelectedYear(null)
      setResults(null)
      setSelectedVersion(null)
    }
  }, [selectedBrand])

  // Load years when model changes
  useEffect(() => {
    if (selectedBrand && selectedModel) {
      loadYears(selectedBrand, selectedModel)
      setSelectedYear(null)
      setResults(null)
      setSelectedVersion(null)
    }
  }, [selectedBrand, selectedModel])

  const loadBrands = async () => {
    setLoadingBrands(true)
    setError(null)
    try {
      const response = await fetch('/api/autopress/brands')
      const data = await response.json()
      if (data.success) {
        setBrands(data.brands)
      } else {
        throw new Error(data.error || 'Error al cargar marcas')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar marcas')
    } finally {
      setLoadingBrands(false)
    }
  }

  const loadModels = async (brand: string) => {
    setLoadingModels(true)
    setError(null)
    try {
      const response = await fetch(`/api/autopress/models?brand=${encodeURIComponent(brand)}`)
      const data = await response.json()
      if (data.success) {
        setModels(data.models)
      } else {
        throw new Error(data.error || 'Error al cargar modelos')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar modelos')
    } finally {
      setLoadingModels(false)
    }
  }

  const loadYears = async (brand: string, model: string) => {
    setLoadingYears(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/autopress/years?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`
      )
      const data = await response.json()
      if (data.success) {
        setYears(data.years)
      } else {
        throw new Error(data.error || 'Error al cargar años')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar años')
    } finally {
      setLoadingYears(false)
    }
  }

  const handleSearch = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear) {
      setError('Por favor selecciona marca, modelo y año')
      return
    }

    setLoadingValuations(true)
    setError(null)
    setResults(null)
    setSelectedVersion(null)

    try {
      const response = await fetch(
        `/api/autopress/valuations-by-filters?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}&year=${selectedYear}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar tasaciones')
      }

      if (data.vehicleData && data.vehicleData.length > 0) {
        setResults(data.vehicleData)
        // Auto-select if only one version
        if (data.vehicleData.length === 1) {
          setSelectedVersion(data.vehicleData[0])
        }
      } else {
        setError('No se encontraron tasaciones para esta combinación')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar tasaciones')
    } finally {
      setLoadingValuations(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Filter Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Buscar Valor Comercial por Vehículo
            </h2>
            <p className="text-sm text-neutral-600">
              Selecciona la marca, modelo y año para conocer el valor comercial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Brand Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Marca
              </label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  disabled={loadingBrands}
                  className={cn(
                    "w-full px-4 py-3 pr-10 border rounded-xl appearance-none",
                    "focus:outline-none focus:ring-2 transition-all",
                    "border-neutral-200 focus:ring-brand/20 focus:border-brand",
                    loadingBrands && "bg-neutral-50 cursor-not-allowed"
                  )}
                >
                  <option value="">Selecciona marca</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Model Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Modelo
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand || loadingModels}
                  className={cn(
                    "w-full px-4 py-3 pr-10 border rounded-xl appearance-none",
                    "focus:outline-none focus:ring-2 transition-all",
                    "border-neutral-200 focus:ring-brand/20 focus:border-brand",
                    (!selectedBrand || loadingModels) && "bg-neutral-50 cursor-not-allowed"
                  )}
                >
                  <option value="">
                    {selectedBrand ? 'Selecciona modelo' : 'Primero selecciona marca'}
                  </option>
                  {models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Year Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Año
              </label>
              <div className="relative">
                <select
                  value={selectedYear || ''}
                  onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                  disabled={!selectedModel || loadingYears}
                  className={cn(
                    "w-full px-4 py-3 pr-10 border rounded-xl appearance-none",
                    "focus:outline-none focus:ring-2 transition-all",
                    "border-neutral-200 focus:ring-brand/20 focus:border-brand",
                    (!selectedModel || loadingYears) && "bg-neutral-50 cursor-not-allowed"
                  )}
                >
                  <option value="">
                    {selectedModel ? 'Selecciona año' : 'Primero selecciona modelo'}
                  </option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loadingValuations || !selectedBrand || !selectedModel || !selectedYear}
            className={cn(
              "w-full px-6 py-3 rounded-xl font-medium transition-all",
              "flex items-center justify-center gap-2",
              loadingValuations || !selectedBrand || !selectedModel || !selectedYear
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-brand text-white hover:bg-brand/90 hover:shadow-md"
            )}
          >
            {loadingValuations ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Buscando tasaciones...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Buscar Tasación
              </>
            )}
          </button>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && results.length > 0 && (
        <div className="space-y-4">
          {/* Version Selector (if multiple) */}
          {results.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700 mb-2">
                Se encontraron {results.length} versiones. Selecciona una:
              </p>
              <div className="grid gap-2">
                {results.map((version) => (
                  <button
                    key={version.id_version}
                    onClick={() => setSelectedVersion(version)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-left transition-all",
                      selectedVersion?.id_version === version.id_version
                        ? "border-brand bg-brand/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    <div className="font-medium">
                      {version.marca} {version.modelo} {version.version}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Año {version.ano} • {version.combustible} • {version.transmision}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Vehicle Details */}
          {selectedVersion && (
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand/10 to-brand/5 p-6 border-b border-neutral-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {selectedVersion.marca} {selectedVersion.modelo}
                    </h3>
                    <p className="text-lg text-neutral-700 mt-1">
                      {selectedVersion.version} • Año {selectedVersion.ano}
                    </p>
                    <div className="flex gap-4 mt-3 text-sm text-neutral-600">
                      {selectedVersion.combustible && <span>{selectedVersion.combustible}</span>}
                      {selectedVersion.transmision && (
                        <>
                          {selectedVersion.combustible && <span>•</span>}
                          <span>{selectedVersion.transmision}</span>
                        </>
                      )}
                      {selectedVersion.carroceria && (
                        <>
                          <span>•</span>
                          <span>{selectedVersion.carroceria}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Car className="h-8 w-8 text-brand/50" />
                </div>
              </div>

              {/* Valuation */}
              {selectedVersion.valuation && (
                <div className="p-6 space-y-6">
                  {/* Main Value */}
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-600 mb-2">Valor Comercial Estimado</p>
                    <p className="text-4xl font-bold text-brand">
                      {selectedVersion.valuation.formatted.commercial}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      Tasación del {selectedVersion.valuation.fecha_tasacion}
                    </p>
                  </div>

                  {/* Value Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-600 mb-1">Valor Mínimo</p>
                      <p className="text-xl font-semibold text-neutral-900">
                        {selectedVersion.valuation.formatted.minimum}
                      </p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-600 mb-1">Valor Máximo</p>
                      <p className="text-xl font-semibold text-neutral-900">
                        {selectedVersion.valuation.formatted.maximum}
                      </p>
                    </div>
                  </div>

                  {/* Depreciation Projections */}
                  {selectedVersion.valuation.projections && (
                    <div className="border-t border-neutral-200 pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="h-5 w-5 text-neutral-600" />
                        <h4 className="font-medium text-neutral-900">
                          Proyección de Depreciación
                        </h4>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 mb-1">En 1 año</p>
                          <p className="text-lg font-semibold text-neutral-900">
                            {formatCLP(selectedVersion.valuation.projections.oneYear)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 mb-1">En 2 años</p>
                          <p className="text-lg font-semibold text-neutral-900">
                            {formatCLP(selectedVersion.valuation.projections.twoYears)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 mb-1">En 3 años</p>
                          <p className="text-lg font-semibold text-neutral-900">
                            {formatCLP(selectedVersion.valuation.projections.threeYears)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 px-4 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-all">
                      Cotizar Seguro
                    </button>
                    <button className="flex-1 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200 transition-all">
                      Comparar con Otro
                    </button>
                  </div>
                </div>
              )}

              {/* No valuation available */}
              {!selectedVersion.valuation && (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                  <p className="text-neutral-700 font-medium">
                    No hay información de tasación disponible
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    Por favor, intenta más tarde o contacta soporte
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}