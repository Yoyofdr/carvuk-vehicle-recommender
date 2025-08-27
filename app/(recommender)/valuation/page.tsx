'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import VehicleFilterForm from '../components/VehicleFilterForm'

function ValuationContent() {
  const searchParams = useSearchParams()
  const brand = searchParams.get('brand') || undefined
  const model = searchParams.get('model') || undefined
  const year = searchParams.get('year')
  const yearNum = year ? parseInt(year) : undefined
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
              <span className="font-medium">Volver</span>
            </Link>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand to-brand/70 bg-clip-text text-transparent">
              Tasación de Vehículos
            </h1>
            
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Conoce el Valor Real de tu Vehículo
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Obtén una tasación profesional basada en datos del mercado actual. 
              Selecciona la marca, modelo y año de tu vehículo.
            </p>
          </div>

          {/* Search Form */}
          <VehicleFilterForm 
            initialBrand={brand}
            initialModel={model}
            initialYear={yearNum}
          />

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Búsqueda por Filtros
              </h3>
              <p className="text-sm text-neutral-600">
                Selecciona marca, modelo y año para obtener la tasación
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Datos Actualizados
              </h3>
              <p className="text-sm text-neutral-600">
                Información basada en el mercado automotriz chileno actual
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                Rango de Valores
              </h3>
              <p className="text-sm text-neutral-600">
                Conoce el valor mínimo, comercial y máximo de tu vehículo
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ValuationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100" />}>
      <ValuationContent />
    </Suspense>
  )
}