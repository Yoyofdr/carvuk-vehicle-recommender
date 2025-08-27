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
    label: 'SUVs', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* SUV - taller body with characteristic shape */}
        <g transform="translate(10, 20)">
          {/* Main body */}
          <path d="M15 30 L15 25 L20 18 L35 15 L60 15 L75 18 L82 25 L82 30 L82 38 L15 38 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Roof rack lines */}
          <line x1="30" y1="15" x2="65" y2="15" stroke="currentColor" strokeWidth="1.5"/>
          {/* Windows */}
          <rect x="25" y="20" width="15" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="43" y="20" width="15" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M61 20 L61 30 L72 30 L70 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Wheels */}
          <circle cx="28" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="28" cy="38" r="3" fill="currentColor"/>
          <circle cx="68" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="68" cy="38" r="3" fill="currentColor"/>
          {/* Door handles */}
          <rect x="30" y="32" width="8" height="1.5" fill="currentColor"/>
          <rect x="48" y="32" width="8" height="1.5" fill="currentColor"/>
        </g>
      </svg>
    )
  },
  { 
    id: 'hatchback', 
    label: 'Hatchbacks', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* Hatchback - compact with sloped rear */}
        <g transform="translate(10, 25)">
          {/* Main body */}
          <path d="M18 33 L18 28 L25 20 L45 18 L65 20 L75 28 L75 33 L75 38 L18 38 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Windows */}
          <path d="M28 22 L28 30 L40 30 L40 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M43 22 L43 30 L58 30 L57 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M61 23 L61 30 L70 30 L67 25 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Wheels */}
          <circle cx="28" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="28" cy="38" r="3" fill="currentColor"/>
          <circle cx="65" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="65" cy="38" r="3" fill="currentColor"/>
          {/* Door handle */}
          <rect x="32" y="32" width="8" height="1.5" fill="currentColor"/>
          <rect x="48" y="32" width="8" height="1.5" fill="currentColor"/>
        </g>
      </svg>
    )
  },
  { 
    id: 'sedan', 
    label: 'Saloons', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* Saloon/Sedan - classic three-box design */}
        <g transform="translate(10, 25)">
          {/* Main body */}
          <path d="M15 33 L15 30 L18 28 L22 20 L40 18 L58 20 L70 28 L78 30 L78 33 L78 38 L15 38 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Trunk line */}
          <path d="M70 30 L78 30" stroke="currentColor" strokeWidth="1.5"/>
          {/* Windows */}
          <path d="M25 22 L25 30 L38 30 L38 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M41 22 L41 30 L54 30 L54 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M57 22 L57 30 L66 30 L65 24 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Wheels */}
          <circle cx="26" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="26" cy="38" r="3" fill="currentColor"/>
          <circle cx="66" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="66" cy="38" r="3" fill="currentColor"/>
          {/* Door handles */}
          <rect x="30" y="32" width="8" height="1.5" fill="currentColor"/>
          <rect x="46" y="32" width="8" height="1.5" fill="currentColor"/>
        </g>
      </svg>
    )
  },
  { 
    id: 'coupe', 
    label: 'Coupes', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* Coupe - two-door, sporty profile */}
        <g transform="translate(10, 28)">
          {/* Main body - lower and sleeker */}
          <path d="M18 32 L18 30 L22 26 L35 20 L60 20 L72 26 L78 30 L78 32 L78 38 L18 38 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Windows - larger, more slanted */}
          <path d="M28 24 L28 30 L50 30 L48 24 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M53 24 L53 30 L68 30 L66 26 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Wheels */}
          <circle cx="28" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="28" cy="38" r="3" fill="currentColor"/>
          <circle cx="68" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="68" cy="38" r="3" fill="currentColor"/>
          {/* Door handle - single long handle for 2-door */}
          <rect x="38" y="32" width="12" height="1.5" fill="currentColor"/>
        </g>
      </svg>
    )
  },
  { 
    id: 'wagon', 
    label: 'Estate cars', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* Estate/Station Wagon - extended rear section */}
        <g transform="translate(10, 25)">
          {/* Main body - extended rear */}
          <path d="M15 33 L15 30 L18 28 L22 20 L40 18 L65 18 L75 20 L80 28 L80 33 L80 38 L15 38 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Windows */}
          <path d="M25 22 L25 30 L36 30 L36 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M39 22 L39 30 L50 30 L50 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M53 22 L53 30 L64 30 L64 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M67 22 L67 30 L75 30 L74 22 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Wheels */}
          <circle cx="26" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="26" cy="38" r="3" fill="currentColor"/>
          <circle cx="68" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="68" cy="38" r="3" fill="currentColor"/>
          {/* Door handles */}
          <rect x="28" y="32" width="8" height="1.5" fill="currentColor"/>
          <rect x="42" y="32" width="8" height="1.5" fill="currentColor"/>
          <rect x="56" y="32" width="8" height="1.5" fill="currentColor"/>
        </g>
      </svg>
    )
  },
  { 
    id: 'minivan', 
    label: 'People carriers', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* People Carrier/Minivan - tall, boxy */}
        <g transform="translate(10, 20)">
          {/* Main body - taller and boxier */}
          <path d="M18 35 L18 15 L70 15 L78 18 L80 25 L80 35 L80 38 L18 38 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Windows - larger and more */}
          <rect x="22" y="18" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="37" y="18" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="52" y="18" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M67 18 L67 30 L74 30 L73 18 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Wheels */}
          <circle cx="28" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="28" cy="38" r="3" fill="currentColor"/>
          <circle cx="68" cy="38" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="68" cy="38" r="3" fill="currentColor"/>
          {/* Sliding door track */}
          <line x1="35" y1="32" x2="55" y2="32" stroke="currentColor" strokeWidth="1.5"/>
        </g>
      </svg>
    )
  },
  { 
    id: 'sports', 
    label: 'Sports cars', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* Sports car - very low, aggressive stance */}
        <g transform="translate(10, 32)">
          {/* Main body - very low profile */}
          <path d="M15 30 L15 28 L20 26 L35 20 L65 20 L75 24 L82 28 L82 30 L82 36 L15 36 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Hood vents */}
          <line x1="25" y1="28" x2="30" y2="28" stroke="currentColor" strokeWidth="1"/>
          <line x1="25" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="1"/>
          {/* Windows - minimal, aggressive angle */}
          <path d="M38 24 L38 28 L58 28 L56 24 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Spoiler */}
          <path d="M78 24 L82 22 L82 24" stroke="currentColor" strokeWidth="1.5"/>
          {/* Wheels */}
          <circle cx="28" cy="36" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="28" cy="36" r="3" fill="currentColor"/>
          <circle cx="70" cy="36" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="70" cy="36" r="3" fill="currentColor"/>
        </g>
      </svg>
    )
  },
  { 
    id: 'convertible', 
    label: 'Convertibles', 
    icon: (
      <svg viewBox="0 0 120 80" fill="none" className="w-24 h-16">
        {/* Convertible - open top design */}
        <g transform="translate(10, 30)">
          {/* Main body - no roof */}
          <path d="M18 30 L18 28 L22 26 L25 24 L75 24 L78 26 L82 28 L82 30 L82 36 L18 36 Z" 
                fill="white" stroke="currentColor" strokeWidth="2"/>
          {/* Windscreen frame */}
          <path d="M30 24 L32 18 L34 18 L36 24" stroke="currentColor" strokeWidth="2"/>
          {/* Soft top (folded down) indication */}
          <path d="M65 26 L70 26 L72 24 L74 24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
          {/* Interior seats visible */}
          <rect x="35" y="27" width="8" height="4" fill="none" stroke="currentColor" strokeWidth="1"/>
          <rect x="50" y="27" width="8" height="4" fill="none" stroke="currentColor" strokeWidth="1"/>
          {/* Wheels */}
          <circle cx="28" cy="36" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="28" cy="36" r="3" fill="currentColor"/>
          <circle cx="70" cy="36" r="6" fill="white" stroke="currentColor" strokeWidth="2"/>
          <circle cx="70" cy="36" r="3" fill="currentColor"/>
          {/* Door handle */}
          <rect x="40" y="32" width="10" height="1.5" fill="currentColor"/>
        </g>
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

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {BODY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleBodyType(type.id)}
                  className={cn(
                    "group relative p-6 rounded-2xl border-2 transition-all bg-white min-h-[140px]",
                    selectedBodyTypes.includes(type.id)
                      ? "border-brand bg-brand/5"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  {/* Checkbox in top-left corner */}
                  <div className={cn(
                    "absolute top-4 left-4 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    selectedBodyTypes.includes(type.id)
                      ? "bg-brand border-brand"
                      : "border-neutral-400 group-hover:border-neutral-600"
                  )}>
                    {selectedBodyTypes.includes(type.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  
                  {/* Centered content */}
                  <div className="flex flex-col items-center justify-center h-full">
                    {/* Icon centered */}
                    <div className="text-neutral-700 mb-3">
                      {type.icon}
                    </div>
                    
                    {/* Label centered */}
                    <p className="font-medium text-neutral-900 text-center text-sm">
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