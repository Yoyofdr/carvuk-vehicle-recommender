import { z } from 'zod'

export type AnswerKey = string

export interface StepConfig {
  id: string
  type: 'single-choice' | 'multi-choice' | 'range' | 'pills'
  title: string
  description?: string
  answerKey: AnswerKey
  required?: boolean
  options?: Array<{
    id: string
    label: string
    description?: string
    icon?: string
  }>
  range?: {
    min: number
    max: number
    step: number
    unit?: string
    format?: 'currency' | 'number' | 'uf'
  }
  validation?: z.ZodSchema
}

export const VehicleSteps: StepConfig[] = [
  {
    id: 'vehicle-condition',
    type: 'single-choice',
    title: '¿Buscas un auto nuevo o usado?',
    description: 'Esto nos ayuda a personalizar tus opciones desde el inicio',
    answerKey: 'vehicleCondition',
    required: true,
    options: [
      {
        id: 'new',
        label: 'Auto Nuevo',
        description: '0km directo de concesionario',
        icon: '✨'
      },
      {
        id: 'used',
        label: 'Auto Usado',
        description: 'Seminuevos con mejores precios',
        icon: '🚗'
      }
    ]
  },
  {
    id: 'budget',
    type: 'range',
    title: '¿Cuál es tu presupuesto?',
    description: 'Puedes ajustar más tarde si lo necesitas',
    answerKey: 'monthlyBudget',
    required: true,
    range: {
      min: 200000,
      max: 2000000,
      step: 50000,
      unit: 'CLP',
      format: 'currency'
    }
  },
  {
    id: 'down-payment',
    type: 'range',
    title: '¿Cuánto puedes dar de pie?',
    description: 'Pago inicial al contado',
    answerKey: 'downPayment',
    required: false,
    range: {
      min: 0,
      max: 50000000,
      step: 500000,
      unit: 'CLP',
      format: 'currency'
    }
  },
  {
    id: 'body-type',
    type: 'multi-choice',
    title: '¿Qué tipo de auto te acomoda?',
    description: 'Elige uno o varios',
    answerKey: 'bodyTypes',
    required: true,
    options: [
      { id: 'sedan', label: 'Sedán', description: 'Clásico y eficiente' },
      { id: 'suv', label: 'SUV', description: 'Espacioso y versátil' },
      { id: 'hatchback', label: 'Hatchback', description: 'Compacto y ágil' },
      { id: 'pickup', label: 'Pickup', description: 'Potente y funcional' },
      { id: 'coupe', label: 'Coupé', description: 'Deportivo y elegante' },
      { id: 'minivan', label: 'Minivan', description: 'Familiar y amplio' }
    ]
  },
  {
    id: 'fuel-type',
    type: 'multi-choice',
    title: '¿Qué tipo de combustible prefieres?',
    answerKey: 'fuelTypes',
    required: false,
    options: [
      { id: 'gasoline', label: 'Bencina', description: 'Más común' },
      { id: 'diesel', label: 'Diésel', description: 'Mayor rendimiento' },
      { id: 'hybrid', label: 'Híbrido', description: 'Eco-amigable' },
      { id: 'electric', label: 'Eléctrico', description: 'Cero emisiones' }
    ]
  },
  {
    id: 'transmission',
    type: 'single-choice',
    title: '¿Qué transmisión prefieres?',
    answerKey: 'transmission',
    required: false,
    options: [
      { id: 'manual', label: 'Manual', description: 'Mayor control' },
      { id: 'automatic', label: 'Automática', description: 'Más cómoda' },
      { id: 'any', label: 'Me da igual', description: 'Sin preferencia' }
    ]
  },
  {
    id: 'usage',
    type: 'pills',
    title: '¿Para qué lo usarás principalmente?',
    description: 'Ayúdanos a recomendarte mejor',
    answerKey: 'usage',
    required: false,
    options: [
      { id: 'city', label: 'Ciudad' },
      { id: 'highway', label: 'Carretera' },
      { id: 'family', label: 'Familiar' },
      { id: 'work', label: 'Trabajo' },
      { id: 'offroad', label: 'Off-road' },
      { id: 'sport', label: 'Deportivo' }
    ]
  }
]

export const InsuranceSteps: StepConfig[] = [
  {
    id: 'monthly-budget',
    type: 'range',
    title: '¿Cuál es tu presupuesto mensual para el seguro?',
    answerKey: 'monthlyBudget',
    required: true,
    range: {
      min: 10000,
      max: 200000,
      step: 5000,
      unit: 'CLP',
      format: 'currency'
    }
  },
  {
    id: 'deductible-range',
    type: 'range',
    title: '¿Qué rango de deducible prefieres?',
    description: 'El monto que pagas en caso de siniestro',
    answerKey: 'deductibleRange',
    required: true,
    range: {
      min: 3,
      max: 20,
      step: 1,
      unit: 'UF',
      format: 'uf'
    }
  },
  {
    id: 'min-coverages',
    type: 'multi-choice',
    title: '¿Qué coberturas son esenciales para ti?',
    answerKey: 'minCoverages',
    required: true,
    options: [
      { id: 'rc-1000', label: 'RC ≥ 1000 UF', description: 'Responsabilidad civil amplia' },
      { id: 'damage', label: 'Daños propios', description: 'Protección total' },
      { id: 'theft', label: 'Robo', description: 'Contra robo total o parcial' },
      { id: 'glass', label: 'Cristales', description: 'Lunas y parabrisas' },
      { id: 'natural', label: 'Eventos naturales', description: 'Sismos, inundaciones' }
    ]
  },
  {
    id: 'preferences',
    type: 'pills',
    title: '¿Qué servicios adicionales valoras?',
    answerKey: 'preferences',
    required: false,
    options: [
      { id: 'brand-workshop', label: 'Taller de marca' },
      { id: 'replacement-car', label: 'Auto de reemplazo' },
      { id: 'road-assistance', label: 'Asistencia en ruta' },
      { id: 'international', label: 'Cobertura internacional' },
      { id: 'zero-deductible-glass', label: 'Sin deducible en cristales' }
    ]
  }
]