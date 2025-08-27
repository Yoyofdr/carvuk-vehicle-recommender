'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Car, Shield } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function VehiclesPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'vehicles' | 'insurance' | null>(null)

  const handleVehicleWizard = () => {
    // Store selection in localStorage for the wizard
    if (typeof window !== 'undefined') {
      localStorage.setItem('wizardType', 'vehicles')
    }
    // Navigate to first step
    router.push('/vehicles/wizard')
  }

  const handleInsuranceWizard = () => {
    // Store selection in localStorage for the wizard
    if (typeof window !== 'undefined') {
      localStorage.setItem('wizardType', 'insurance')
    }
    // Navigate to first step
    router.push('/insurance/wizard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand to-brand/70 bg-clip-text text-transparent">
              Recomendador Inteligente
            </h1>
            
            <div className="w-32" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              ¿Qué estás buscando?
            </h2>
            <p className="text-lg text-neutral-600">
              Nuestro asistente inteligente te ayudará a encontrar la mejor opción
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Vehicle Option */}
            <button
              onClick={() => setSelectedType('vehicles')}
              className={cn(
                "group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2",
                selectedType === 'vehicles' 
                  ? "border-brand shadow-xl" 
                  : "border-transparent hover:border-brand/20"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-20 h-20 bg-brand/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Car className="h-10 w-10 text-brand" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  Vehículos
                </h3>
                <p className="text-neutral-600 mb-4">
                  Encuentra el vehículo ideal basado en tu presupuesto y necesidades
                </p>
                <div className="space-y-2 text-sm text-neutral-500 text-left">
                  <p>✓ Nuevos y usados</p>
                  <p>✓ Comparación inteligente</p>
                  <p>✓ Mejores ofertas del mercado</p>
                </div>
              </div>
            </button>

            {/* Insurance Option */}
            <button
              onClick={() => setSelectedType('insurance')}
              className={cn(
                "group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2",
                selectedType === 'insurance' 
                  ? "border-brand shadow-xl" 
                  : "border-transparent hover:border-brand/20"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-20 h-20 bg-brand/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Shield className="h-10 w-10 text-brand" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  Seguros
                </h3>
                <p className="text-neutral-600 mb-4">
                  Compara seguros y encuentra la mejor cobertura para tu vehículo
                </p>
                <div className="space-y-2 text-sm text-neutral-500 text-left">
                  <p>✓ Múltiples aseguradoras</p>
                  <p>✓ Cotización inmediata</p>
                  <p>✓ Mejores coberturas</p>
                </div>
              </div>
            </button>
          </div>

          {/* Continue Button */}
          {selectedType && (
            <div className="mt-8 text-center">
              <button
                onClick={selectedType === 'vehicles' ? handleVehicleWizard : handleInsuranceWizard}
                className="inline-flex items-center gap-2 bg-brand text-white rounded-2xl px-8 py-3 font-medium hover:bg-brand/90 active:bg-brand/80 transition-colors shadow-md hover:shadow-lg"
              >
                <span>Comenzar con {selectedType === 'vehicles' ? 'Vehículos' : 'Seguros'}</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-neutral-900 mb-1">Personalizado</h4>
              <p className="text-sm text-neutral-600">
                Recomendaciones basadas en tus necesidades específicas
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-neutral-900 mb-1">Data Real</h4>
              <p className="text-sm text-neutral-600">
                Información actualizada del mercado chileno
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-neutral-900 mb-1">Rápido</h4>
              <p className="text-sm text-neutral-600">
                Obtén resultados en menos de 2 minutos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}