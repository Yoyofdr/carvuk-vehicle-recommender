'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Info, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCLP } from '@/lib/utils/currency'

// Types
type PaymentMode = 'monthly' | 'cash'
type Step = 'budget' | 'bodyType' | 'fuel' | 'features' | 'brand'

// Constants
const STEPS: Step[] = ['budget', 'bodyType', 'fuel', 'features', 'brand']

const BODY_TYPES = [
  { 
    id: 'suv', 
    label: 'SUV y 4x4', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M5 11h14l-1-4H6l-1 4zm14 0v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-6m14 0H5m0 0l1-4m0 0h12m0 0l1 4" />
        <circle cx="7.5" cy="14.5" r="1.5" />
        <circle cx="16.5" cy="14.5" r="1.5" />
      </svg>
    )
  },
  { 
    id: 'sedan', 
    label: 'Berlina', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M4 11h16l-1.5-4h-13L4 11zm16 0v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-5m16 0H4" />
        <circle cx="7.5" cy="13.5" r="1.5" />
        <circle cx="16.5" cy="13.5" r="1.5" />
      </svg>
    )
  },
  { 
    id: 'minivan', 
    label: 'Monovolumen', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M4 11h16v-3a2 2 0 00-2-2H6a2 2 0 00-2 2v3zm16 0v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-6m16 0H4" />
        <circle cx="7.5" cy="14.5" r="1.5" />
        <circle cx="16.5" cy="14.5" r="1.5" />
        <rect x="7" y="7" width="3" height="3" rx="0.5" />
        <rect x="14" y="7" width="3" height="3" rx="0.5" />
      </svg>
    )
  },
  { 
    id: 'hatchback', 
    label: 'Urbano', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M5 11h14l-2-3.5h-10L5 11zm14 0v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-5m14 0H5" />
        <circle cx="7.5" cy="13.5" r="1.5" />
        <circle cx="16.5" cy="13.5" r="1.5" />
      </svg>
    )
  },
  { 
    id: 'wagon', 
    label: 'Ranchera', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M4 11h16l-1.5-4h-13L4 11zm16 0v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H7v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-5m16 0H4m2-4l.5-1h11l.5 1" />
        <circle cx="7.5" cy="13.5" r="1.5" />
        <circle cx="16.5" cy="13.5" r="1.5" />
      </svg>
    )
  },
  { 
    id: 'coupe', 
    label: 'Deportivo', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M5 12h14l-2-4.5h-10L5 12zm14 0v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-4m14 0H5" />
        <circle cx="7.5" cy="14.5" r="1.5" />
        <circle cx="16.5" cy="14.5" r="1.5" />
      </svg>
    )
  },
  { 
    id: 'convertible', 
    label: 'Descapotable', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M5 13h14l-2-3h-10l-2 3zm14 0v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-4m14 0H5m3-3l1-2h6l1 2" />
        <circle cx="7.5" cy="15.5" r="1.5" />
        <circle cx="16.5" cy="15.5" r="1.5" />
      </svg>
    )
  },
  { 
    id: 'commercial', 
    label: 'Comercial', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
        <path d="M5 11h14V8a1 1 0 00-1-1H6a1 1 0 00-1 1v3zm14 0v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-6m14 0H5" />
        <circle cx="7.5" cy="14.5" r="1.5" />
        <circle cx="16.5" cy="14.5" r="1.5" />
      </svg>
    )
  },
]

const FUEL_TYPES = [
  { id: 'gasoline', label: 'Bencina', icon: '⛽', desc: 'El más común, amplia red de estaciones' },
  { id: 'diesel', label: 'Diésel', icon: '🛢️', desc: 'Mayor rendimiento en carretera' },
  { id: 'hybrid', label: 'Híbrido', icon: '🔋', desc: 'Combina motor y electricidad' },
  { id: 'electric', label: 'Eléctrico', icon: '⚡', desc: '100% ecológico, cero emisiones' },
]

const FEATURES = [
  { id: 'economy', label: 'Economía', icon: '💰', desc: 'Bajo consumo y mantenimiento' },
  { id: 'space', label: 'Espacio', icon: '📦', desc: 'Amplitud interior y maletero' },
  { id: 'performance', label: 'Prestaciones', icon: '🏁', desc: 'Potencia y deportividad' },
  { id: 'safety', label: 'Seguridad', icon: '🛡️', desc: 'Máxima protección' },
  { id: 'technology', label: 'Tecnología', icon: '📱', desc: 'Conectividad y asistentes' },
  { id: 'comfort', label: 'Confort', icon: '🛋️', desc: 'Comodidad y equipamiento' },
  { id: 'resale', label: 'Valor de Reventa', icon: '📈', desc: 'Buena depreciación y respaldo de marca' },
  { id: 'highway', label: 'Rendimiento en Carretera', icon: '🛣️', desc: 'Estabilidad y consumo en viajes largos' },
  { id: 'cargo', label: 'Capacidad de Carga', icon: '🚚', desc: 'Maletero y fuerza de arrastre' },
  { id: 'maintenance', label: 'Mantenimiento y Respaldo', icon: '🔧', desc: 'Talleres, repuestos y garantía' },
]

const BRANDS = [
  'Toyota', 'Chevrolet', 'Nissan', 'Hyundai',
  'Mazda', 'Volkswagen', 'Kia', 'Suzuki',
  'Ford', 'Honda', 'Mitsubishi', 'Peugeot'
]

const SUGGESTED_RANGES = {
  monthly: [
    { min: 200000, max: 400000, label: 'Económico' },
    { min: 400000, max: 800000, label: 'Medio' },
    { min: 800000, max: 1500000, label: 'Premium' }
  ],
  cash: [
    { min: 8000000, max: 15000000, label: 'Económico' },
    { min: 15000000, max: 35000000, label: 'Medio' },
    { min: 35000000, max: 75000000, label: 'Premium' }
  ]
}

export default function DiscoverPage() {
  const router = useRouter()
  
  // State
  const [currentStep, setCurrentStep] = useState<Step>('budget')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash')
  const [budgetValues, setBudgetValues] = useState({ min: '', max: '' })
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [, forceUpdate] = useState(0)

  // Computed values
  const currentStepIndex = STEPS.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100
  const suggestedRanges = SUGGESTED_RANGES[paymentMode]
  const isLastStep = currentStepIndex === STEPS.length - 1

  // Helper functions
  const getBudgetInputValues = () => {
    if (typeof document === 'undefined') return { min: '', max: '' }
    
    const minInput = document.getElementById('min-budget') as HTMLInputElement
    const maxInput = document.getElementById('max-budget') as HTMLInputElement
    
    if (!minInput || !maxInput) return { min: '', max: '' }
    
    return {
      min: minInput.value.replace(/\D/g, ''),
      max: maxInput.value.replace(/\D/g, '')
    }
  }

  const isBudgetValid = () => {
    const { min: minVal, max: maxVal } = getBudgetInputValues()
    const min = parseInt(minVal)
    const max = parseInt(maxVal)
    return minVal.length > 0 && maxVal.length > 0 && !isNaN(min) && !isNaN(max) && min > 0 && max > min
  }

  const canContinue = () => {
    switch (currentStep) {
      case 'budget': return isBudgetValid()
      case 'bodyType': return selectedBodyTypes.length > 0
      case 'fuel': return selectedFuelTypes.length > 0
      case 'features': return selectedFeatures.length > 0
      case 'brand': return true // Marcas son opcionales
      default: return false
    }
  }

  // Event handlers
  const handleNext = () => {
    // Save budget values when moving from budget step
    if (currentStep === 'budget') {
      setBudgetValues(getBudgetInputValues())
    }

    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1])
    } else {
      // Save data and navigate to results
      // Get current budget values from inputs if not already saved
      const currentBudget = budgetValues.min && budgetValues.max 
        ? budgetValues 
        : getBudgetInputValues()
      
      const data = {
        paymentMode,
        budget: currentBudget.min && currentBudget.max ? { 
          min: parseInt(currentBudget.min), 
          max: parseInt(currentBudget.max)
        } : null,
        bodyTypes: selectedBodyTypes,
        fuelTypes: selectedFuelTypes,
        features: selectedFeatures,
        brands: selectedBrands
      }
      
      console.log('Saving discovery data:', data)
      localStorage.setItem('carDiscovery', JSON.stringify(data))
      router.push('/descubre/resultados')
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1])
    } else {
      router.push('/')
    }
  }

  const handleBudgetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    e.target.value = value
    forceUpdate(prev => prev + 1) // Force re-render to update button state
  }

  const handlePaymentModeChange = (mode: PaymentMode) => {
    setPaymentMode(mode)
    // Clear budget inputs
    const minInput = document.getElementById('min-budget') as HTMLInputElement
    const maxInput = document.getElementById('max-budget') as HTMLInputElement
    if (minInput && maxInput) {
      minInput.value = ''
      maxInput.value = ''
    }
    forceUpdate(prev => prev + 1)
  }

  const fillBudgetRange = (min: number, max: number) => {
    const minInput = document.getElementById('min-budget') as HTMLInputElement
    const maxInput = document.getElementById('max-budget') as HTMLInputElement
    if (minInput && maxInput) {
      minInput.value = min.toString()
      maxInput.value = max.toString()
      forceUpdate(prev => prev + 1)
    }
  }

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    )
  }

  const toggleBodyType = (typeId: string) => {
    setSelectedBodyTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    )
  }

  const toggleFuelType = (fuelId: string) => {
    setSelectedFuelTypes(prev => 
      prev.includes(fuelId) 
        ? prev.filter(f => f !== fuelId)
        : [...prev, fuelId]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Atrás</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-neutral-900">Encuentra tu auto ideal</h1>
              <p className="text-sm text-neutral-600">Paso {currentStepIndex + 1} de {STEPS.length}</p>
            </div>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-3">
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Budget Step */}
        {currentStep === 'budget' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                ¿Cuál es tu presupuesto?
              </h2>
              <p className="text-lg text-neutral-600">
                Ingresa el rango de precio que estás dispuesto a pagar
              </p>
            </div>

            {/* Payment Mode Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => handlePaymentModeChange('monthly')}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-all",
                    paymentMode === 'monthly'
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-600"
                  )}
                >
                  Pago Mensual
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentModeChange('cash')}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-all",
                    paymentMode === 'cash'
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-600"
                  )}
                >
                  Pago Contado
                </button>
              </div>
            </div>

            {/* Budget Input Fields */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="min-budget" className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio mínimo {paymentMode === 'monthly' ? 'mensual' : ''}
                  </label>
                  <input
                    id="min-budget"
                    type="text"
                    inputMode="numeric"
                    onInput={handleBudgetInput}
                    placeholder={paymentMode === 'monthly' ? '200000' : '8000000'}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-lg"
                  />
                </div>
                
                <div>
                  <label htmlFor="max-budget" className="block text-sm font-medium text-neutral-700 mb-2">
                    Precio máximo {paymentMode === 'monthly' ? 'mensual' : ''}
                  </label>
                  <input
                    id="max-budget"
                    type="text"
                    inputMode="numeric"
                    onInput={handleBudgetInput}
                    placeholder={paymentMode === 'monthly' ? '1500000' : '50000000'}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-lg"
                  />
                </div>
              </div>

              {/* Suggested Ranges */}
              <div className="mt-6">
                <p className="text-sm text-neutral-600 mb-3">Rangos sugeridos:</p>
                <div className="flex gap-3 flex-wrap">
                  {suggestedRanges.map((range) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => fillBudgetRange(range.min, range.max)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-all"
                    >
                      {range.label}: {formatCLP(range.min)} - {formatCLP(range.max)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body Type Step */}
        {currentStep === 'bodyType' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                ¿Qué tipos de auto te interesan?
              </h2>
              <p className="text-lg text-neutral-600">
                Selecciona todos los tipos de carrocería que prefieres
              </p>
              <p className="text-sm text-neutral-500 mt-2">
                Puedes elegir varios o solo uno
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {BODY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleBodyType(type.id)}
                  className={cn(
                    "group relative p-6 rounded-xl border-2 transition-all bg-white",
                    selectedBodyTypes.includes(type.id)
                      ? "border-brand bg-brand/5"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      selectedBodyTypes.includes(type.id)
                        ? "bg-brand border-brand"
                        : "border-neutral-400 group-hover:border-neutral-600"
                    )}>
                      {selectedBodyTypes.includes(type.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-neutral-700">
                      {type.icon}
                    </div>
                    
                    {/* Label */}
                    <p className="font-medium text-neutral-900 text-lg">
                      {type.label}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fuel Type Step */}
        {currentStep === 'fuel' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                ¿Qué tipos de combustible consideras?
              </h2>
              <p className="text-lg text-neutral-600">
                Elige todos los tipos según tu estilo de conducción y economía
              </p>
              <p className="text-sm text-neutral-500 mt-2">
                Puedes seleccionar múltiples opciones
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {FUEL_TYPES.map((fuel) => (
                <button
                  key={fuel.id}
                  type="button"
                  onClick={() => toggleFuelType(fuel.id)}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all relative text-left",
                    selectedFuelTypes.includes(fuel.id)
                      ? "border-brand bg-brand/5"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  )}
                >
                  {selectedFuelTypes.includes(fuel.id) && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{fuel.icon}</div>
                    <div>
                      <p className="font-semibold text-neutral-900">{fuel.label}</p>
                      <p className="text-sm text-neutral-600">{fuel.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features Step */}
        {currentStep === 'features' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                ¿Qué es importante para ti?
              </h2>
              <p className="text-lg text-neutral-600">
                Selecciona todas las características que consideres importantes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleFeature(feature.id)}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all relative text-left",
                    selectedFeatures.includes(feature.id)
                      ? "border-brand bg-brand/5"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  )}
                >
                  {selectedFeatures.includes(feature.id) && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <p className="font-semibold text-neutral-900">{feature.label}</p>
                      <p className="text-sm text-neutral-600">{feature.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brand Step */}
        {currentStep === 'brand' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                ¿Tienes alguna marca preferida?
              </h2>
              <p className="text-lg text-neutral-600">
                Selecciona todas las marcas que te interesan
              </p>
              <p className="text-sm text-neutral-500 mt-2">
                O déjalo vacío para ver todas las opciones
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all relative",
                    selectedBrands.includes(brand)
                      ? "border-brand bg-brand/5"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  )}
                >
                  {selectedBrands.includes(brand) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <p className="font-medium text-neutral-900 text-center">{brand}</p>
                </button>
              ))}
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-600">
                💡 <span className="font-medium">Consejo:</span> Si no seleccionas ninguna marca, te mostraremos las mejores opciones de todas las marcas disponibles
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 rounded-xl font-medium border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-all"
          >
            Anterior
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue()}
            className={cn(
              "px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
              canContinue()
                ? "bg-brand text-white hover:bg-brand/90"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            <span>{isLastStep ? 'Ver resultados' : 'Siguiente'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>

      {/* Help Button */}
      <div className="fixed bottom-8 right-8">
        <button
          type="button"
          className="bg-white rounded-full shadow-lg p-4 hover:shadow-xl transition-all"
        >
          <Info className="h-6 w-6 text-brand" />
        </button>
      </div>
    </div>
  )
}