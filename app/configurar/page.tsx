'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, ChevronRight, Info } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatCLP } from '@/lib/utils/currency'

// Configuration options
const motorOptions = [
  { id: '1.6', label: '1.6L Bencina', price: 18990000 },
  { id: '2.0', label: '2.0L Bencina', price: 21990000 },
  { id: '2.0-hybrid', label: '2.0L Híbrido', price: 24990000 },
]

const versionOptions = [
  { id: 'base', label: 'Base', price: 0 },
  { id: 'mid', label: 'XLI', price: 1500000 },
  { id: 'full', label: 'XEI', price: 3000000 },
]

const colorOptions = [
  { id: 'white', label: 'Blanco', hex: '#FFFFFF', price: 0 },
  { id: 'silver', label: 'Plata', hex: '#C0C0C0', price: 0 },
  { id: 'black', label: 'Negro', hex: '#000000', price: 300000 },
  { id: 'red', label: 'Rojo', hex: '#DC143C', price: 300000 },
  { id: 'blue', label: 'Azul', hex: '#1E40AF', price: 300000 },
]

const extraOptions = [
  { id: 'techo', label: 'Techo panorámico', price: 800000 },
  { id: 'cuero', label: 'Asientos de cuero', price: 1200000 },
  { id: 'sonido', label: 'Sistema de sonido premium', price: 600000 },
  { id: 'navegacion', label: 'Navegación GPS', price: 400000 },
  { id: 'camara360', label: 'Cámara 360°', price: 500000 },
]

function ConfiguratorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const marca = searchParams.get('marca') || 'Toyota'
  const modelo = searchParams.get('modelo') || 'Corolla'

  const [selectedMotor, setSelectedMotor] = useState(motorOptions[0].id)
  const [selectedVersion, setSelectedVersion] = useState(versionOptions[0].id)
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].id)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const calculateTotal = () => {
    const motorPrice = motorOptions.find(m => m.id === selectedMotor)?.price || 0
    const versionPrice = versionOptions.find(v => v.id === selectedVersion)?.price || 0
    const colorPrice = colorOptions.find(c => c.id === selectedColor)?.price || 0
    const extrasPrice = selectedExtras.reduce((acc, extraId) => {
      const extra = extraOptions.find(e => e.id === extraId)
      return acc + (extra?.price || 0)
    }, 0)
    
    return motorPrice + versionPrice + colorPrice + extrasPrice
  }

  const handleRequestOffers = () => {
    // Save configuration
    const config = {
      marca,
      modelo,
      motor: selectedMotor,
      version: selectedVersion,
      color: selectedColor,
      extras: selectedExtras,
      total: calculateTotal()
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('vehicleConfig', JSON.stringify(config))
    }
    
    router.push('/solicitar-ofertas')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-neutral-900">
                {marca} {modelo}
              </h1>
              <p className="text-sm text-neutral-600">Configurador</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-neutral-600">Total</p>
              <p className="text-lg font-bold text-brand">{formatCLP(calculateTotal())}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Motor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Motor
              </h3>
              <div className="space-y-3">
                {motorOptions.map(option => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                      selectedMotor === option.id 
                        ? "border-brand bg-brand/5" 
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="motor"
                        value={option.id}
                        checked={selectedMotor === option.id}
                        onChange={(e) => setSelectedMotor(e.target.value)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        selectedMotor === option.id 
                          ? "border-brand bg-brand" 
                          : "border-neutral-300"
                      )}>
                        {selectedMotor === option.id && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-neutral-900">{option.label}</span>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      {formatCLP(option.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Version */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Versión
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {versionOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedVersion(option.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-center transition-all",
                      selectedVersion === option.id 
                        ? "border-brand bg-brand/5" 
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    <p className="font-medium text-neutral-900 mb-1">{option.label}</p>
                    <p className="text-sm text-neutral-600">
                      {option.price > 0 ? `+${formatCLP(option.price)}` : 'Incluido'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Color exterior
              </h3>
              <div className="flex gap-3 flex-wrap">
                {colorOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedColor(option.id)}
                    className={cn(
                      "relative p-1 rounded-lg transition-all",
                      selectedColor === option.id 
                        ? "ring-2 ring-brand ring-offset-2" 
                        : "hover:ring-2 hover:ring-neutral-300 hover:ring-offset-2"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="w-12 h-12 rounded-lg border border-neutral-300"
                        style={{ backgroundColor: option.hex }}
                      />
                      <span className="text-xs text-neutral-700">{option.label}</span>
                      {option.price > 0 && (
                        <span className="text-xs text-neutral-500">+{formatCLP(option.price)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Equipamiento opcional
              </h3>
              <div className="space-y-3">
                {extraOptions.map(option => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        value={option.id}
                        checked={selectedExtras.includes(option.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExtras([...selectedExtras, option.id])
                          } else {
                            setSelectedExtras(selectedExtras.filter(id => id !== option.id))
                          }
                        }}
                        className="w-5 h-5 text-brand rounded border-neutral-300 focus:ring-brand/20"
                      />
                      <span className="text-neutral-900">{option.label}</span>
                    </div>
                    <span className="font-medium text-neutral-900">
                      +{formatCLP(option.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Tu configuración
              </h3>
              
              {/* Vehicle Image */}
              <div className="bg-neutral-100 rounded-lg h-48 mb-6 flex items-center justify-center">
                <span className="text-6xl">🚗</span>
              </div>

              {/* Configuration Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Modelo base</span>
                  <span className="font-medium text-neutral-900">
                    {formatCLP(motorOptions.find(m => m.id === selectedMotor)?.price || 0)}
                  </span>
                </div>
                
                {(versionOptions.find(v => v.id === selectedVersion)?.price || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Versión {versionOptions.find(v => v.id === selectedVersion)?.label}</span>
                    <span className="font-medium text-neutral-900">
                      +{formatCLP(versionOptions.find(v => v.id === selectedVersion)?.price || 0)}
                    </span>
                  </div>
                )}

                {(colorOptions.find(c => c.id === selectedColor)?.price || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Color {colorOptions.find(c => c.id === selectedColor)?.label}</span>
                    <span className="font-medium text-neutral-900">
                      +{formatCLP(colorOptions.find(c => c.id === selectedColor)?.price || 0)}
                    </span>
                  </div>
                )}

                {selectedExtras.map(extraId => {
                  const extra = extraOptions.find(e => e.id === extraId)
                  if (!extra) return null
                  return (
                    <div key={extraId} className="flex justify-between text-sm">
                      <span className="text-neutral-600">{extra.label}</span>
                      <span className="font-medium text-neutral-900">
                        +{formatCLP(extra.price)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-neutral-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-neutral-900">Total</span>
                  <span className="text-xl font-bold text-brand">
                    {formatCLP(calculateTotal())}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Precio referencial. Las ofertas pueden variar.
                </p>
              </div>

              <button
                onClick={handleRequestOffers}
                className="w-full bg-brand text-white rounded-xl py-3 font-medium hover:bg-brand/90 transition-all flex items-center justify-center gap-2"
              >
                <span>Solicitar ofertas</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                <div className="flex gap-2 text-xs text-neutral-600">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <p>
                    Los concesionarios te enviarán sus mejores ofertas en las próximas 24 horas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse text-neutral-600">Cargando configurador...</div>
      </div>
    }>
      <ConfiguratorContent />
    </Suspense>
  )
}